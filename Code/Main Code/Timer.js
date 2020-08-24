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

    this.Callback = this.dataTypes.callback.prototype;
    this.callback = this.dataTypes.callback;

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
    //holds specific callback data for use in timer
    this.callback = function callback(_callback, _caller, _args)
    {
        this.callback = _callback || null;
        this.caller = _caller || null;
        this.args = _args || {};
    }

    //holds specific timer data for individual timers
    this.timer = function timer(_callback, _timing, _startOnCreation, _runTime, _enableOffset)
    {
        //store basic variables for timer
        this.running = _startOnCreation || false;
        this.pausedAt = 0;
        this.lastCompletion = 0;
        this.callback = _callback || null;
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
        this.currentInterval = 0;
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
            //reset interval
            this.currentInterval = this.interval;

            //check if previously paused
            if (this.pausedAt != 0)
            {
                //set current interval to restart at paused state
                this.currentInterval = this.currentInterval - (this.pausedAt - this.lastCompletion);
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
                 && timeSinceLastUpdate != this.currentInterval
                 && this.skipOffset == false)
            {
                //calculate new offset to get closer to interval timings
                this.intervalOffset = this.currentInterval - timeSinceLastUpdate;

                //if offset is more than interval total
                //limit offset to be interval (instant loop)
                if (this.intervalOffset < - this.currentInterval)
                {
                    this.intervalOffset = -this.currentInterval;
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
            this.timeout = window.setTimeout(function() { _this.runLoop() }, this.currentInterval + this.intervalOffset);
        }

        //run callback based on inputted callback
        this.invokeCallback = function (_callback)
        {
            //check callback exists
            if (_callback != null && _callback.callback != null)
            {
                //check if caller suppied with callback
                if (_callback.caller != null)
                {
                    //invoke callback with caller as "this"
                    return _callback.callback.call(_callback.caller, _callback.args);
                }
                else
                {
                    //invoke callback with timer as "this"
                    return _callback.callback.call(this, _callback.args);
                }
            }

            //return null if no callback
            return null;
        }

        //on the end of every loop run this function
        //to calculate if it should continue
        this.runLoop = function runLoop()
        {
            //invoke callback
            this.invokeCallback(this.callback);
            this.lastCompletion = this.time();

            if (this.running)
            {
                //check timer should still be running
                if (this.ticksRemaining < 0)
                {
                    //destroy the timer if it should stop
                    this.destroy();
                    return;
                }
                this.loop();
            }
        }

        //on destroy call, find index of timer
        //and remove it from array
        this.destroy = function destroy()
        {
            this.stop();
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
    this.scaledTimer = function scaledTimer(_callback, _startOnCreation, _timeScalers, _runTime, _enableOffset)
    {
        //setup timer for current scaled timer
        this.scaledCallBack = _callback;

        //store time scaling variables
        this.currentFailedCount = 0;
        this.timeScalers = _timeScalers || [];

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
            var succeeded = this.invokeCallback(this.scaledCallBack);

            this.currentInterval = this.interval;

            //check if the above succeeded
            if (succeeded == false)
            {
                //add to current failed count
                this.currentFailedCount++;

                //change interval of timer to new scaled interval
                //use "this" as current function is timer's callback
                this.interval = this.findCurrentTimeScaler().interval;
            }
            else
            {
                //check if the function had failed before
                if (this.currentFailedCount != 0)
                {     
                    //reset failed count
                    //once it has succeeded
                    this.currentFailedCount = 0;

                    //change interval of timer to new scaled interval
                    //use "this" as current function is timer's callback
                    this.interval = this.findCurrentTimeScaler().interval;
                }
            }

            //check if interval is changing, then
            //force offset skipping to allow interval change
            if (this.currentInterval != this.interval)
            {
                this.skipOffset = true;
            }
        }

        //create timer with the callback of "waitForTimer"
        cTimer.timer.call(this, new cTimer.callback(this.waitForTimer),
                        _timeScalers[0].interval, _startOnCreation, 
                        _runTime, _enableOffset);
    }

    //holds specific real-time timer data (10ms fastest realtime due to ancient browser stuff)
    this.realtimeTimer = function realtimeTimer(_callback, _startOnCreation, _runTime)
    {
        //setup timer for current scaled timer
        this.realtimeCallback = _callback;

        //wait and respond to timer
        this.waitForTimer = function waitForTimer()
        {
            //update callback and test if continue
            this.realtimeCallback.args.ticksElapsed = this.ticksElapsed;
            var _cont = this.invokeCallback(this.realtimeCallback);
        }

        //create a 10ms timer with the callback "waitForTimer"
        cTimer.timer.call(this, new cTimer.callback(this.waitForTimer), 
            10, _startOnCreation, _runTime, true);
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