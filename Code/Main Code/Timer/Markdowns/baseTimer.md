  <a id="timer"/> <h2> timer </h1> 
  <p style="padding-left: 20px;"> Base timer that all timers build upon </p>

  ```Javascript
  cTimer.timer(_name, _callback, _timing, _startOnCreation, _runtime, _enabeOffset) 
  ```

  * <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_name"/> _name <p style="padding-left: 20px;"> The [name](#name) of the timer. (string) </p>

    * <a id="_callbacktimer"/> _callback <p style="padding-left: 20px;"> The [callback](#callbackdata) data to be used on completion of a [timer loop](#runloop). </p>

    * <a id="_timing"/> _timing <p style="padding-left: 20px;"> The [time](#interval) between [loop completion](#runLoop). </p>

    * <a id="_startoncreation"/> _startOnCreation <p style="padding-left: 20px;"> Determines if the timer's [start](#start) function should be ran after creation. </p>

    * <a id="_runtime"/> _runime <p style="padding-left: 20px;"> How many [ticks](#datetime) the timer should [remain](#ticksremaining) for. </p>

    * <a id="_enableoffset"/> _enableOffset <p style="padding-left: 20px; padding-bottom: 40px;"> Determine if the timer should [correct timing inaccuracies](#enableoffset) from [timeout](#settimeout) vs [actual time](#datetime) </p>

* <a id="properties"/> * <a id="properties"/> <h2> Properties: </h2>
    * <a id="name"/> name <p style="padding-left: 20px;"> The name of the timer that can be used for searching. </p>
    
    * <a id="running"/> Running <p style="padding-left: 20px;"> Whether the timer is currently running or paused. </p>

    * <a id="pausedat"/> pausedAt <p style="padding-left: 20px;"> How long the timer was through the current interval before it was paused. </p>

    * <a id="lastcompletion"/> lastCompletion <p style="padding-left: 20px;"> The last time that the timer has completed a loop. </p>

    * <a id="callback"/> callback <p style="padding-left: 20px;"> Holds the callback information that will be called when the timer completes a loop. </p>

    * <a id="timeout"/> timeout <p style="padding-left: 20px;"> The internal timeout used for controlling the timer with [setTimeout](#settimeout).</p>

    * <a id="timerid"/> timerID <p style="padding-left: 20px;"> The ID of the timer that can be used for searching.</p>

    * <a id="interval"/> interval <p style="padding-left: 20px;"> The time inbetween loops. </p>

    * <a id="currentinterval"/> currentInterval <p style="padding-left: 20px;"> The time inbetween loops taking into account other factors such as offset/pausedAt. </p>

    * <a id="startdate"/> startDate <p style="padding-left: 20px;"> The [date.time()](#datetime) of creation for the timer. </p>

    *  <a id="lasttickdate"/> lastTickDate <p style="padding-left: 20px;"> The [date.time()](#datetime) of the last loop completion. </p>

    * <a id="ticksremaining"/> ticksRemaning <p style="padding-left: 20px;"> How much time is remaning until destruction of the timer. </p>

    * <a id="tickselapsed"/> ticksElapsed <p style="padding-left: 20px;"> How much time has elapsed since [date.time()](#datetime) and startDate. </p>

    * <a id="enableoffset"/> enableOffset <p style="padding-left: 20px;"> Determines if the timer takes into account variances between [setTimeout](#settimeout) time and actual time elapsed. </p>

    * <a id="intervaloffset"/> intervalOffset <p style="padding-left: 20px;"> The time to offset the current interval to make it inline with actual time elapsed vs [setTimout](#settimeout) time elapsed. </p>

    * <a id="skipoffset"/> skipOffset <p style="padding-left: 20px;"> Used to override enableOffset but still calculate the required interval offset. </p>

    * <a id="skipoffsetiftoolarge"/> skipOffsetIfTooLarge  <p style="padding-left: 20px; padding-bottom: 40px;"> Used to limit offset to times within interval to disable instant calls. </p>

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="time"/> time <p style="padding-left: 20px;"> Returns the current [datetime](#datetime). </p>

    * <a id="start"/> start <p style="padding-left: 20px;"> Start the timer running. </p>

    * <a id="stop"/> stop <p style="padding-left: 20px;"> Stop the timer and clear the [timeout](#settimeout). </p>

    * <a id="restart"/> restart <p style="padding-left: 20px;"> Stop the timer and then start it again. </p>

    *  <a id="pause"/> pause <p style="padding-left: 20px;"> Stop the timer and update [pausedAt](#pausedat). </p>

    * <a id="resume"/> resume <p style="padding-left: 20px;"> Start the timer if it is currently paused. </p>

    * <a id="unpause"/> unpause <p style="padding-left: 20px;"> Same as resume. </p>

    * <a id="loop"/> loop <p style="padding-left: 20px;"> Handles the calculation of new [timeout](#settimeout) interval and updates internal properties to respect these calculations. </p>

    * <a id="invokecallback"/> invokeCallback <p style="padding-left: 20px;"> Handles calling the timer's [callback](#callback) with the parameters requested. </p>

    * <a id="runloop"/> runLoop <p style="padding-left: 20px;"> Invokes the callback and determines if the timer should continue or be [destroyed](#destroy). </p>

    * <a id="destroy"/> destroy <p style="padding-left: 20px; padding-bottom: 40px;"> Handles the destruction of the timer and removal from the [timer list](../README.md#timerlist).</p>

#### References:
 * <a id="datetime"/> [date.time()](https://developer.mozilla.org/en-US/docs/We
  
[Return to parent](../README.md)