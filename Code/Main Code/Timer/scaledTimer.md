<a name="scaledtimer"/> <h2> scaledTimer </h1> <p style="padding-left: 20px;"> A <a href="#timer"> timer </a> that adds the ability to change the interval to given parameters based on a provided function returning true/false </p>

```Javascript
cTimer.timer(_name, _timeScalers, _runTime, _enableOffset) 
```

* <a name="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a name="_name"/> _name <p style="padding-left: 20px;"> The [name](baseTimer.md#name) of the timer. (string) </p>

    * <a name="_timescalers"/> _timeScalers <p style="padding-left: 20px;"> The [callback](callback.md) data to be used on completion of a [timer loop](timer.md#runloop). </p>

    * <a name="_scaledtimerruntime"/> _runTime <p style="padding-left: 20px;"> How many [ticks](#datetime) the timer should [remain](#ticksremaining) for. </p>

    * <a name="_scaledtimerenableoffset"/> _enableOffset <p style="padding-left: 20px; padding-bottom: 40px;"> Determine if the timer should [correct timing inaccuracies](#enableoffset) from [timeout](#settimeout) vs [actual time](#datetime) </p>

* <a name="properties"/> <h2> Properties: </h2>

  
