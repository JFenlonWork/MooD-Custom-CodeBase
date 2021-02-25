# <a id="title"/> faderData
### <a id="description"/> Holds information and functions to handle a group of [fadingData](fadingData.md)
#

#### <a id="codeexample"/> Code Example:
```Javascript
cExpander.faderData(_fadingData, _startIndex, _faderID, _startOnCreation)
``` 


* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

  * <a id="_fadingdata"/> _fadingData <p style="padding-left: 20px;"> The initial _fadingData to setup faderData with. </p> <br>

  * <a id="_startindex"/> _startIndex <p style="padding-left: 20px;"> The initial index of fadingData to start fading at. </p> <br>

  * <a id="_faderid"/> _faderID <p style="padding-left: 20px;"> The unique numerical ID of this faderData. </p> <br>

  * <a id="_startoncreation"/> _startOnCreation <p style="padding-left: 20px;"> If the faderData should start fading between fadingData on creation/setup. </p> <br>


* <a id="properties"/> <h2> Properties: </h2>

  * <a id="propertiesprefix"/> All of the parameters are accessible without "_" except _faderID which is now "id" <p style="padding-left: 20px;">  </p> <br>

  * <a id="fadingData"/> fadingData <p style="padding-left: 20px;"> A list of all of the fadingData. </p> <br>

  * <a id="index"/> index <p style="padding-left: 20px;"> The current fadingData that is being active. </p> <br>

  * <a id="isfading"/> isFading <p style="padding-left: 20px;"> If the faderData is currently fading or paused. </p> <br>

  * <a id="fadertimer"/> faderTimer <p style="padding-left: 20px;"> The [cTimer's scaledTimer](/Code/Main%20Code/Timer/Markdowns/scaledTimer.md) that this faderData uses for fading. </p> <br>

* <a id="functions"/> <h2> Functions: </h2>

	* <a id="updatefadedcallback"/> updateFadedCallback() <p style="padding-left: 20px;"> The function used to determine if this faderData should change currently faded and updates faderTimer's scaledTime.</p>
	<br>

	* <a id="calculatescaledtimertime"/> calculatedScaledTimerTime() <p style="padding-left: 20px;"> Creates new list of [scaledTime](/Code/Main%20Code/Timer/Markdowns/scaledTime.md) with variables from fadingData and return it.</p>
	<br>

	* <a id="updatetimertimes"/> updateTimerTimes() <p style="padding-left: 20px;"> Calculate new scaled time and update faderTimer's scaledTime. </p>
	<br>

	* <a id="togglefading"/> toggleFading(_toggle) <p style="padding-left: 20px;"> Update isFading and enable/disable fading of fadingData based on _toggle.</p>
	<br>

	* <a id="addfadingdata"/> addFadingData(_fadingData) <p style="padding-left: 20px;"> Add _fadingData to fadingData and calculate/update [faderTimer's scaledTimer](/Code/Main%20Code/Timer/Markdowns/scaledTimer.md).</p>
	<br>

	* <a id="findfadingindexfromobject"/> findFadingIndexFromObject(_object) <p style="padding-left: 20px;"> Search and return the index of fadingData with _object in [fadingData](#fadingdata).</p>
	<br>

	* <a id="destroy"/> destroy() <p style="padding-left: 20px;"> Destroy faderTimer and remove this faderData from [cFader's allFaderData](/Code/Other%20Custom%20Code/cFader/README.md).</p>
	<br>

#### References: 
  
[cTimer](/code/Main%20Code/Timer/README.md)
[scaledTimer](/code/Main%20Code/Timer/Markdowns/scaledTimer.md)
[Return to parent](/Code/Other%20Custom%20Code/cFader/README.md)