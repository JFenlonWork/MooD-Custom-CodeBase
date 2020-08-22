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
    this.timer = function timer(_callBack, _timing, _startOnCreation)
    {
        //store basic variables for timer
        this.interval = _timing || 0;
        this.running = _startOnCreation || false;
        this.pausedAt = 0;
        this.lastCompletion = 0;
        this.callBack = _callBack || null;
        this.timeout = null;
        this.timerID = cTimer.uniqueTimerID++;

        //will start the timer
        this.start = function()
        {
            this.running = true;
            this.loop();
        }

        //will stop the timer
        //and reset pausedAt
        this.stop = function()
        {
            this.running = false;
            this.pausedAt = 0;
            window.clearTimeout(this.timeout);
        }

        //will stop and then start
        //the timer again
        this.restart = function()
        {
            this.stop();
            this.start();
        }

        //will stop the timer and
        //record when it was paused
        this.pause = function()
        {
            if (this.running)
            {
                this.stop();
                this.pausedAt = Date.now();
            }
        }

        //will run start, only if timer is
        //currently not running
        this.resume = function()
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
        this.loop = function()
        {
            var currentInterval = this.interval;

            if (this.pausedAt != 0)
            {
                currentInterval = currentInterval - (this.pausedAt - this.lastCompletion);
                this.pausedAt = 0;
            }

            var _this = this;
            this.timeout = window.setTimeout(function() { _this.runLoop() }, currentInterval);
        }

        //on the end of every loop run this function
        //to calculate 
        this.runLoop = function()
        {
            this.lastCompletion = Date.now();
            this.callBack();
            if (this.running)
            {
                this.loop();
            }
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
    this.scaledTimer = function scaledTimer(_callBack, _startOnCreation, _timeScalers)
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
        }

        //create timer with the callback of "waitForTimer"
        cTimer.timer.call(this, this.waitForTimer, _timeScalers[0].interval, _startOnCreation);
    }

    //holds specific real-time timer data
    this.realtimeTimer = function realtimeTimer(_callBack, _startOnCreation, _runTime)
    {
        //setup timer for current scaled timer
        this.realtimeCallBack = _callBack;

        //store timer variables
        this.currentTick = 0;
        this.maxTick = _runTime || Number.MAX_SAFE_INTEGER;
        var _this = this;

        //wait and respond to timer
        this.waitForTimer = function waitForTimer()
        {
            //update callback and test if continue
            var _cont = _this.realtimeCallBack(_this.currentTick);

            //check if timer has ran out or continue is false
            if (_this.currentTick == _this.maxTick || _cont == false)
            {
                //stop the timer
                //EDIT ADD TIMER REMOVAL
                //cTimer.timers[cTimer.generic.findTimerByID(_this.timerID)].stop();
                _this.stop();
            }
        }

        //create a 1ms timer with the callback wait for timer
        //this.timerID = new cTimer.timer(this.waitForTimer, 1, _startOnCreation);
        cTimer.timer.call(this, this.waitForTimer, 1, _startOnCreation);
    }
}

function cTimerFunctions()
{
    //return the timer with _id
    this.findTimerByID = function (_id)
    {
        //loop through all timer in cTimer
        for (var t = 0; t < cTimer.timers.length; t++)
        {
            //check if the timerID is _id
            if (cTimer.timers[t].timerID == _id)
            {
                //return the timer if it is
                return cTimer.timers[t];
            }
        }
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