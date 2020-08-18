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
    this.uniqueTimerID = 0;

    //====DATA TYPES====//
    this.timerDataTypes = new cTimerDataTypes();

    this.Timer = this.timerDataTypes.timer.prototype;
    this.timer = this.timerDataTypes.timer;

    this.ScaledTimer = this.timerDataTypes.scaledTimer.prototype;
    this.scaledTimer = this.timerDataTypes.scaledTimer;

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
        this.callBack = _callBack;

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

            //couldn't find scaler so return last possible scaler
            return this.timeScalers[this.timeScalers.length - 1];
        }
        
        this.waitForTimer = function waitForTimer()
        {
            //invoke the original callback and store
            //the value to see if it has succeeded
            var succeeded = _this.callBack();

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
        this.timerID = new cTimer.timer(this.waitForTimer, _timeScalers[0].interval, _startOnCreation);
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
}