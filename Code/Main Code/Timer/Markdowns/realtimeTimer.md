<a id="realtimetimer"/> <h2> realtimeTimer </h1> <p style="padding-left: 20px;"> A <a href="#timer"> timer </a> that adds the ability to be as close to real-time as possible on browsers (calls callback every 10ms) </p>

```Javascript
cTimer.realtimeTimer(_name, _callback, _startOnCreation, _runTime, _destroyOnStop) 
```

* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_name"/> _name <p style="padding-left: 20px;"> The [name](baseTimer.md#name) of the timer. (string) </p>

    * <a id="_callback"/> _callback <p style="padding-left: 20px;"> Holds the [callback](callback.md) information that will be called when the timer completes a [loop](baseTimer.md#runloop) (Expects a boolean response). </p>

    * <a id="_startoncreation"/> _startOnCreation <p style="padding-left: 20px;"> Determines if the timer's [start](baseTimer.md#start) function should be ran after creation. </p>

    * <a id="_runtime"/> _runTime <p style="padding-left: 20px;"> How many [ticks](#datetime) the timer should [remain](#ticksremaining) for. </p>

    * <a id="_destroyonstop"/> _destroyOnStop <p style="padding-left: 20px; padding-bottom: 40px;"> Determine if the timer should [destroy](baseTimer.md#destroy) itself when it is stopped through callback responding with "False". </p>

* <a id="properties"/> * <a id="properties"/> <h2> Properties: </h2>

    * <a id="inherittimer"/> Inherit from timer <p style="padding-left: 20px;"> The real-time timer inherts all values from [timer](baseTimer.md). </p>

    * <a id="name"/> name <p style="padding-left: 20px;"> The [name](baseTimer.md#name) of the timer. (string) </p>

    * <a id="callback"/> realtimeCallback <p style="padding-left: 20px;"> Holds the [callback](callback.md) information that will be called when the timer completes a [loop](baseTimer.md#runloop) (Expects a boolean response). </p>

    * <a id="destroyonstop"/> destroyOnStop <p style="padding-left: 20px; padding-bottom: 40px;"> Determine if the timer should [destroy](baseTimer.md#destroy) itself when it is stopped through callback responding with "False". </p>

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="waitfortimer"/> waitForTimer <p style="padding-left: 20px;"> Acts as a middle-man for base timer callback to implement real-time updates based on [timer's callback](#callback) return value. </p>

#### References:
  
[Return to parent](../README.md)