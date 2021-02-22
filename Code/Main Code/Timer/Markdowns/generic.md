<a id="timer"/> <h2> generic </h1> 
  <p style="padding-left: 20px;"> Stores all "generic" functions for <a href="timer"> timer</a>. </p>

#### <a id="codeprefix"/> Code Prefix:
    cTimer.generic

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="findtimerbyname"/> [findTimerByName](#findtimerbynameexample) <p style="padding-left: 20px;"> Returns the first timer with the same name supplied. </p>

    * <a id="findtimerbyid"/> [findTimerById](#findtimerbyidexample) <p style="padding-left: 20px;"> Returns the first timer with the same ID supplied. </p>

    * <a id="findtimerindexbyid"/> [findTimerIndexByID](#findtimerindexbyidexample) <p style="padding-left: 20px;"> Returns the index of the first timer with the same ID supplied. </p>

* <a id="examples"/> <h2> Examples: </h2>
  
  * <a id="findtimerbynameexample"/> findTimerByName:
    ```Javascript
      var _timer = cTimer.generic.findTimerByName("Example1");

      if (_timer != null)
      {
        //Do stuff with timer
      }
    ``` 
    <hr>

  * <a id="findtimerbyidexample"/> findTimerByID:
    ```Javascript
      var _timer = cTimer.generic.findTimerByID(1);
      
      if (_timer != null)
      {
        //Do stuff with timer
      }
    ```

    <hr>

  * <a id="findtimerindexbyidexample"/> findTimerIndexByID:
    ```Javascript
      //Grab timer index if it exists
      var _timerIndex = cTimer.generic.findTimerIndexByID(1);
      
      if (_timerIndex != null)
      {
        var _timer = cTimer.timers[_timerIndex];
        //Check references for cTimer.timers information
        //Do stuff with timer
      }
    ```

#### References:
 * <a id="timerlist"/> [timer list](../README.md#timerlist)
  
[Return to parent](../README.md)