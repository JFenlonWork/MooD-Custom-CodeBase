# Timer.js
### This code uses a custom implementation of setTimeout to create a re-usable accurate timer
#

#### Code Prefix:
    cTimer.  

Data Types:
* [Timer](###timer)
* [Scaled Timer](###scaledTimer)
* [Realtime Timer](###realtimeTimer)

Functions:
* Find Timer By Name
* Find Timer By ID
* Find Timer Index By ID

#### Data Type Details:

[test](#name)

* ### timer 
  <p style="padding-left: 20px;"> Base timer that all timers build upon </p>

  * Properties:
    * <a name="name"/> name <p style="padding-left: 20px;"> The name of the timer that can be used for searching. </p>
    
    * <a name="running"/> Running <p style="padding-left: 20px;"> Whether the timer is currently running or paused. </p>

    * <a name="pausedat"/> pausedAt <p style="padding-left: 20px;"> How long the timer was through the current interval before it was paused. </p>

    * <a name="lastCompletion"/> lastCompletion <p style="padding-left: 20px;"> The last time that the timer has completed a loop. </p>

    * <a name="callback"/> callback <p style="padding-left: 20px;"> The function that will be called when the timer completes a loop. </p>

    * <a name="timeout"/> timeout <p style="padding-left: 20px;"> The internal timeout used for controlling the timer with [setTimeout](####References).</p>

    * <a name="timerid"/> timerID <p style="padding-left: 20px;"> The ID of the timer that can be used for searching.</p>

    * <a name="interval"/> interval <p style="padding-left: 20px;"> The time inbetween loops. </p>

    * <a name="currentinterval"/> currentInterval <p style="padding-left: 20px;"> The time inbetween loops taking into account other factors such as offset/pausedAt. </p>

    * <a name="startdate"/> startDate <p style="padding-left: 20px;"> The [date.time()](####References) of creation for the timer. </p>

    *  <a name="lasttickdate"/> lastTickDate <p style="padding-left: 20px;"> The [date.time()](####References) of the last loop completion. </p>

    * <a name="ticksremaining"/> ticksRemaning <p style="padding-left: 20px;"> How much time is remaning until destruction of the timer. </p>

    * <a name="tickselapsed"/> ticksElapsed <p style="padding-left: 20px;"> How much time has elapsed since [date.time()](####References) and startDate. </p>

    * <a name="enableoffset"/> enableOffset <p style="padding-left: 20px;"> Determines if the timer takes into account variances between [setTimeout](####References) time and actual time elapsed. </p>

    * <a name="intervaloffset"/> intervalOffset <p style="padding-left: 20px;"> The time to offset the current interval to make it inline with actual time elapsed vs [setTimout](####References) time elapsed. </p>

    * <a name="skipoffset"/> skipOffset <p style="padding-left: 20px;"> Used to override enableOffset but still calculate the required interval offset. </p>

    * <a name="skipoffsetiftoolarge"/> skipOffsetIfTooLarge  <p style="padding-left: 20px;"> Used to limit offset to times within interval to disable instant calls. </p>

  * Methods:
    * <a name="start"/> start <p style="padding-left: 20px;"> Start the timer running. </p>

    * <a name="stop"/> stop <p style="padding-left: 20px;"> Stop the timer and clear the [timeout](####References). </p>

    * <a name="restart"/> restart <p style="padding-left: 20px;"> Stop the timer and then start it again. </p>

    *  <a name="pause"/> pause <p style="padding-left: 20px;"> Stop the timer and update [pausedAt](#pausedat). </p>

    * <a name="resume"/> resume <p style="padding-left: 20px;"> Start the timer if it is currently paused. </p>

    * <a name="unpause"/> unpause <p style="padding-left: 20px;"> Same as resume. </p>

    * <a name="resume"/> resume <p style="padding-left: 20px;"> Start the timer if it is currently paused. </p>

    



#### Function Examples:



#### References:
#### e = External, i = Internal
 * [date.time() (e)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
 * [setTimeout() (e)](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)