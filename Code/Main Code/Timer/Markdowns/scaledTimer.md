<a id="scaledtimer"/> <h2> scaledTimer </h1> <p style="padding-left: 20px;"> A <a href="#timer"> timer </a> that adds the ability to change the interval to given parameters based on a provided function returning true/false </p>

```Javascript
cTimer.scaledTimer(_name, _callback, _startOnCreation, _timeScalers, _runtime, _enableOffset)
```

* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_name"/> _name <p style="padding-left: 20px;"> The [name](baseTimer.md#name) of the timer. (string) </p>

    * <a id="_callback"/> _callback <p style="padding-left: 20px;"> Holds the [callback](callback.md) information that will be called when the timer completes a [loop](baseTimer.md#runloop). </p>

    * <a id="_startoncreation"/> _startOnCreation <p style="padding-left: 20px;"> Determines if the timer's [start](baseTimer.md#start) function should be ran after creation. </p>

    * <a id="_timescalers"/> _timeScalers <p style="padding-left: 20px;"> An array of [time scalers](scaledTime.md) to be used with this scaledTimer. </p>

    * <a id="_runtime"/> _runTime <p style="padding-left: 20px;"> How many [ticks](#datetime) the timer should [remain](#ticksremaining) for. </p>

    * <a id="_enableoffset"/> _enableOffset <p style="padding-left: 20px; padding-bottom: 40px;"> Determine if the timer should [correct timing inaccuracies](#enableoffset) from [timeout](#settimeout) vs [actual time](#datetime) </p>

* <a id="properties"/> * <a id="properties"/> <h2> Properties: </h2>

    * <a id="inherittimer"/> Inherit from timer <p style="padding-left: 20px;"> The scaled timer inherts all values from [timer](baseTimer.md). </p>


    * <a id="scaledcallback"/> scaledCallBack <p style="padding-left: 20px;"> The [callback](callback.md) data to be used on completion of a [timer loop](baseTimer.md#runloop) (expects a boolean return value). </p>

    * <a id="currentfailedcount"/> currentFailedCount <p style="padding-left: 20px;"> Stores the current amount of times in a row [scaledCallBack](#scaledcallback) has returned "False". </p>

    * <a id="timescalers"/> timeScalers <p style="padding-left: 20px;"> An array of all [time scalers](scaledTime.md) associated with this scaled timer. </p>

    * <a id="resetskipoffset"/> resetSkipOffset <p style="padding-left: 20px; padding-bottom: 40px;"> Used to reset the [timer's skipOffset](baseTimer.md#skipOffset) to original after the current [time scaler](scaledTime.md) changes. </p>

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="findcurrenttimescaler"/> findCurrentTimeScaler <p style="padding-left: 20px;"> Returns the current [time scaler](scaledTime.md) that falls within the parameters of the [currentFailedCount](#currentfailedcount). </p>

    * <a id="waitfortimer"/> waitForTimer <p style="padding-left: 20px;"> Acts as a middle-man for base timer callback to implement changing time scalers based on [timer's callback](#scaledcallback) return value. </p>

#### References:
  
[Return to parent](../README.md)