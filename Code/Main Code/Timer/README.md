# Timer.js
### This code uses a custom implementation of [setTimeout](#settimeout) to create a re-usable accurate timer.
#

#### <a name="codeprefix"/> Code Prefix:
    cTimer.  

* <a name="properties"/> <h2> Properties: </h2>

* <a name="timerlist"/> timers <p style="padding-left: 20px;"> Array of all valid timers. </p>

* <a name="uniquetimerid"/> uniqueTimerId <p style="padding-left: 20px;"> Stores an Id that isn't used by any current timer. (default 10000) </p>


* <a name="datatypes"/> <h2> Data Types: </h2>

* ".dataTypes" contains original functions for below.
* Protoypes of below start with capital instead of lowercase.
* ".callback" Instance of [Callback](./Markdowns/callback.md).
* ".timer" Instance of [Timer](./Markdowns/baseTimer.md).
* ".scaledTimer" Instance of [Scaled Timer](./Markdowns/scaledTimer.md).
* ".scaledTime" Instance of [Scaled Time](./Markdowns/scaledTime.md).
* ".realtimeTimer" Instance of [Realtime Timer](./Markdowns/realtimeTimer.md)

* <a name="functions"/> <h2> Functions: </h2>

* [generic](./Markdowns/generic.md)

#### References: 
 * <a name="settimeout"/> [setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout)
  
[Return to parent](/README.md)