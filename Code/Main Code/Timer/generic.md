<a name="timer"/> <h2> generic </h1> 
  <p style="padding-left: 20px;"> Stores all "generic" functions for <a href="timer"> timer</a>. </p>

#### Code Prefix:
    cTimer.generic

* <h2> Methods: </h2>

    * <a name="findtimerbyname"/> [findTimerByName](#findtimerbynameexample) <p style="padding-left: 20px;"> Returns the first timer with the same name supplied. </p>

    * <a name="findtimerbyid"/> [findTimerById](#findtimerbyidexample) <p style="padding-left: 20px;"> Returns the first timer with the same ID supplied. </p>

    * <a name="findtimerindexbyid"/> [findTimerIndexByID](#findtimerindexbyidexample) <p style="padding-left: 20px;"> Returns the index of the first timer with the same ID supplied. </p>

* <h2> Examples: </h2>
  
  * <a name="findtimerbynameexample"/> findTimerByName:
    ```Javascript
      var _timer = cTimer.generic.findTimerByName("Example1");

      if (_timer != null)
      {
        //Do stuff with timer
      }
    ``` 
    <hr>

  * <a name="findtimerbyidexample"/> findTimerByID:
    ```Javascript
      var _timer = cTimer.generic.findTimerByID(1);
      
      if (_timer != null)
      {
        //Do stuff with timer
      }
    ```

    <hr>

  * <a name="findtimerindexbyidexample"/> findTimerIndexByID:
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
 * <a name="timerlist"/> [timer list](Timer.md#timerlist)
  
[Return to parent](Timer.md)