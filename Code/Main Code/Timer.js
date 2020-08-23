/*
    Title:
        Timer

    Description:
        Used to allow better timing controls over setInterval
*/

window.cTimer = window.cTimer || new function cTimer()
{
    //====VARIABLES====//
    this.timers = [];
    this.uniqueTimerID = 10000;

    //====DATA TYPES====//
    this.dataTypes = new cTimerDataTypes();

    this.Timer = this.dataTypes.timer.prototype;
    this.timer = this.dataTypes.timer;

    this.ScaledTimer = this.dataTypes.scaledTimer.prototype;
    this.scaledTimer = this.dataTypes.scaledTimer;

    this.RealtimeTimer = this.dataTypes.realtimeTimer.prototype;
    this.realtimeTimer = this.dataTypes.realtimeTimer;

    //====FUNCTIONS====//
    this.generic = new cTimerFunctions();

}

function cTimerDataTypes()
{
    //holds specific timer data for individual timers
    this.timer = function timer(_callBack, _timing, _startOnCreation, _runTime, _enableOffset)
    {
        //store basic variables for timer
        this.running = _startOnCreation || false;
        this.pausedAt = 0;
        this.lastCompletion = 0;
        this.callBack = _callBack || null;
        this.timeout = null;
        this.timerID = cTimer.uniqueTimerID++;

        //function to get the current system time
        this.time = function time()
        {
            return new Date().getTime();
        }

        //store timer time variables
        //anything below 4ms will be capped at 4ms
        //after 5 iterations due to ancient browser stuff
        this.interval = _timing || 0;
        this.startDate = this.time();
        this.lastTickDate = this.startDate;
        this.ticksRemaining = _runTime || Number.MAX_SAFE_INTEGER;
        this.ticksElapsed = 0;
        
        //allow timeout offset to enable interval-like
        //mechanics without using interval to enable
        //realtime with script order
        this.enableOffset = _enableOffset || false;
        this.intervalOffset = 0;
        this.skipOffset = true;

        //will start the timer
        this.start = function start()
        {
            this.running = true;
            this.lastTickDate = this.time();
            this.skipOffset = true;
            this.loop();
        }

        //will stop the timer
        //and reset pausedAt
        this.stop = function stop()
        {
            this.running = false;
            this.pausedAt = 0;
            window.clearTimeout(this.timeout);
        }

        //will stop and then start
        //the timer again
        this.restart = function restart()
        {
            this.stop();
            this.start();
        }

        //will stop the timer and
        //record when it was paused
        this.pause = function pause()
        {
            if (this.running)
            {
                this.stop();
                this.pausedAt = this.time();
            }
        }

        //will run start, only if timer is
        //currently not running
        this.resume = function resume()
        {
            if (!this.running)
            {
                this.start();
            }
        }
        //allow both unpause and resume
        //to do the same thing
        this.unpause = this.resume;

        //On start of timer calculate
        //the required timeout time,
        //start and store the timeout
        this.loop = function loop()
        {
            var currentInterval = this.interval;

            //check if previously paused
            if (this.pausedAt != 0)
            {
                //set current interval to restart at paused state
                currentInterval = currentInterval - (this.pausedAt - this.lastCompletion);
                this.pausedAt = 0;
            }

            //add on the time it has taken since the last tick
            var _time = this.time();
            var timeSinceLastUpdate = _time - this.lastTickDate;
            this.lastTickDate = _time;
            this.ticksElapsed += timeSinceLastUpdate;
            this.ticksRemaining -= timeSinceLastUpdate;

            //check if enable offset is enabled and if a new offset is needed
            if (this.enableOffset == true
                 && timeSinceLastUpdate != currentInterval
                 && this.skipOffset == false)
            {
                //calculate new offset to get closer to interval timings
                this.intervalOffset = currentInterval - timeSinceLastUpdate;

                //if offset is more than interval total
                //limit offset to be interval (instant loop)
                if (this.intervalOffset < -currentInterval)
                {
                    this.intervalOffset = -currentInterval;
                }
            }
            else
            {
                //set interval to be 0 and reset skip offset
                this.intervalOffset = 0;
                this.skipOffset = false;
            }

            //continue loop
            var _this = this;
            this.timeout = window.setTimeout(function() { _this.runLoop() }, currentInterval + this.intervalOffset);
        }

        //on the end of every loop run this function
        //to calculate if it should continue
        this.runLoop = function runLoop()
        {
            this.lastCompletion = this.time();
            this.callBack();
            if (this.running)
            {
                //check timer should still be running
                if (this.ticksRemaining < 0)
                {
                    this.running = false;
                    return;
                }
                this.loop();
            }
        }

        //on destroy call, find index of timer
        //and remove it from array
        this.destroy = function destroy()
        {
            var index = cTimer.generic.findTimerIndexByID(this.timerID);
            cTimer.timers.splice(index, 1);
        }

        //add current timer to list of timers
        cTimer.timers.push(this);

        //if start on creation is true then
        //run the timer when it is created
        if (_startOnCreation === true)
        {
            this.start();
        }

        return this.timerID;
    }

    //holds specific timer data with scaling time based on results
    this.scaledTimer = function scaledTimer(_callBack, _startOnCreation, _timeScalers, _runTime, _enableOffset)
    {
        //setup timer for current scaled timer
        this.scaledCallBack = _callBack;

        //store time scaling variables
        this.currentFailedCount = 0;
        this.timeScalers = _timeScalers || [];

        //function as intermediary for
        //time scaling
        var _this = this;

        //loop through all time scalers and find current
        //scaled time for failed count
        this.findCurrentTimeScaler = function findCurrentTimeScaler()
        {
            //loop through all time scalers
            for (var s = 0; s < this.timeScalers.length - 1; s++)
            {
                //check if current the time scaler threshold is above failed count
                if (this.timeScalers[s + 1].threshold >= this.currentFailedCount)
                {
                    //store previous level of
                    //time scaler
                    return this.timeScalers[s];
                }
            }

            //check if timeScalers length is greater than 0
            if (this.timeScalers.length == 0)
            {
                //No time scalers supplied
                console.warn("No time scalers supplied to timer");
                return null;
            }

            //couldn't find scaler so return last possible scaler
            return this.timeScalers[this.timeScalers.length - 1];
        }
        
        this.waitForTimer = function waitForTimer()
        {
            //invoke the original callback and store
            //the value to see if it has succeeded
            var succeeded = _this.scaledCallBack();

            var currentInterval = this.interval;

            //check if the above succeeded
            if (succeeded == false)
            {
                //add to current failed count
                _this.currentFailedCount++;

                //change interval of timer to new scaled interval
                //use "this" as current function is timer's callback
                this.interval = _this.findCurrentTimeScaler().interval;
            }
            else
            {
                //check if the function had failed before
                if (_this.currentFailedCount != 0)
                {     
                    //reset failed count
                    //once it has succeeded
                    _this.currentFailedCount = 0;

                    //change interval of timer to new scaled interval
                    //use "this" as current function is timer's callback
                    this.interval = _this.findCurrentTimeScaler().interval;
                }
            }

            //check if interval is changing, then
            //force offset skipping to allow interval change
            if (currentInterval != this.interval)
            {
                this.skipOffset = true;
            }
        }

        //create timer with the callback of "waitForTimer"
        cTimer.timer.call(this, this.waitForTimer,
                        _timeScalers[0].interval, _startOnCreation, 
                        _runTime, _enableOffset);
    }

    //holds specific real-time timer data (10ms fastest realtime due to ancient browser stuff)
    this.realtimeTimer = function realtimeTimer(_callBack, _startOnCreation, _runTime)
    {
        //setup timer for current scaled timer
        this.realtimeCallBack = _callBack;

        var _this = this;

        //wait and respond to timer
        this.waitForTimer = function waitForTimer()
        {
            //update callback and test if continue
            var _cont = _this.realtimeCallBack(_this.ticksElapsed);

            //check if timer has ran out or continue is false
            if (_this.ticksRemaining <= 0 || _cont == false)
            {
                //stop the timer
                //EDIT ADD TIMER REMOVAL
                //cTimer.timers[cTimer.generic.findTimerByID(_this.timerID)].stop();
                _this.stop();
                _this.destroy();
            }

        }

        //create a 1ms timer with the callback wait for timer
        //this.timerID = new cTimer.timer(this.waitForTimer, 1, _startOnCreation);
        cTimer.timer.call(this, this.waitForTimer, 10, _startOnCreation, _runTime, true);
    }
}

function cTimerFunctions()
{
    //return the timer with _id
    this.findTimerByID = function findTimerByID(_id)
    {
        //find index of timer with id
        var index = cTimer.generic.findTimerIndexByID(_id);
        
        //check index exists
        if (index != null)
        {
            return cTimer.timers[index];
        }
    }

    this.findTimerIndexByID = function findTimerIndexByID(_id)
    {
        //loop through all timer in cTimer
        for (var t = 0; t < cTimer.timers.length; t++)
        {
            //check if the timerID is _id
            if (cTimer.timers[t].timerID == _id)
            {
                //return the timer if it is
                return t;
            }
        }

        //return null to show it doesn't exist
        return null;
    }

    //run timer function
    this.runTimerFunction = function runTimerFunction(_function, _id)
    {
        //find timer
        var _timer = cTimer.generic.findTimerByID(_id);

        //check timer exists
        if (_timer)
        {
            if (typeof _timer[_function] == "function")
            {
                _timer[_function]();
            }
        }
    }
}