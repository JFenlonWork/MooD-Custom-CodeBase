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

* ### timer 
  <p style="padding-left: 20px;"> Base timer that all timers build upon </p>

  * Properties:
    * <p id="name"> name <p style="padding-left: 20px;"> The name of the timer that can be used for searching. </p> </p>
    * <p id="running"> Running <p style="padding-left: 20px;"> Whether the timer is currently running or paused. </p> </p>

    * <p id="pausedAt"> pausedAt <p style="padding-left: 20px;"> How long the timer was through the current interval before it was paused. </p> </p>

    * <p id="lastCompletion"> lastCompletion <p style="padding-left: 20px;"> The last time that the timer has completed a loop. </p> </p>

    * <p id="callback"> callback <p style="padding-left: 20px;"> The function that will be called when the timer completes a loop. </p> </p>

    * <p id="timeout"> timeout <p style="padding-left: 20px;"> The internal timeout used for controlling the timer with [setTimeout](####References).</p> </p>

    * <p id="timerid"> timerID <p style="padding-left: 20px;"> The ID of the timer that can be used for searching.</p> </p>

    * <p id="interval"> interval <p style="padding-left: 20px;"> The time inbetween loops. </p> </p>

    * <p id="currentinterval"> currentInterval <p style="padding-left: 20px;"> The time inbetween loops taking into account other factors such as offset/pausedAt. </p> </p>

    * <p id="startdate"> startDate <p style="padding-left: 20px;"> The [date.time()](####References) of creation for the timer. </p> </p>

    *  <p id="lasttickdate"> lastTickDate <p style="padding-left: 20px;"> The [date.time()](####References) of the last loop completion. </p> </p>

    * <p id="ticksremaining"> ticksRemaning <p style="padding-left: 20px;"> How much time is remaning until destruction of the timer. </p> </p>

    * <p id="tickselapsed"> ticksElapsed <p style="padding-left: 20px;"> How much time has elapsed since [date.time()](####References) and startDate. </p> </p>

    * <p id="enableoffset"> enableOffset <p style="padding-left: 20px;"> Determines if the timer takes into account variances between [setTimeout](####References) time and actual time elapsed. </p> </p>

    * <p id="intervaloffset"> intervalOffset <p style="padding-left: 20px;"> The time to offset the current interval to make it inline with actual time elapsed vs [setTimout](####References) time elapsed. </p> </p>

    * <p id="skipoffset"> skipOffset <p style="padding-left: 20px;"> Used to override enableOffset but still calculate the required interval offset. </p> </p>

    * <p id="skipoffsetiftoolarge"> skipOffsetIfTooLarge  <p style="padding-left: 20px;"> Used to limit offset to times within interval to disable instant calls. </p> </p>

  * Methods:
    * <p id="start"> start <p style="padding-left: 20px;"> Start the timer running. </p> </p>

    * <p id="stop"> stop <p style="padding-left: 20px;"> Stop the timer and clear the [timeout](####References). </p> </p>

    * <p id="restart"> restart <p style="padding-left: 20px;"> Stop the timer and then start it again. </p> </p>

    *  <p id="pause"> pause <p style="padding-left: 20px;"> Stop the timer and update <a href="#user-content-pausedat"> pausedAt </a>. </p> </p>

    * <p id="resume"> resume <p style="padding-left: 20px;"> Start the timer if it is currently paused. </p> </p>

    * <p id="unpause"> unpause <p style="padding-left: 20px;"> Same as resume. </p> </p>

    * <p id="resume"> resume <p style="padding-left: 20px;"> Start the timer if it is currently paused. </p> </p>

    



#### Function Examples:



#### References:
#### e = External, i = Internal
<p id="references"> </p>

 * [date.time() (e)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)
 * [setTimeout() (e)](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)