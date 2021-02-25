# <a id="title"/> fadingData
### <a id="description"/> Holds information for DOM objects that are currently or have been faded
#

#### <a id="codeexample"/> Code Example:
```Javascript
cExpander.fadingData(_objectToFade, _timeActive, _cssFadeIn, _cssFadeOut, _cssStart)
```

* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

  * <a id="_objecttofade"/> _objectToFade <p style="padding-left: 20px;"> The DOM of the object that this fadingData controls. </p> <br>

  * <a id="_timeactive"/> _timeActive <p style="padding-left: 20px;"> The time that this fadingData is visible for. </p> <br>

  * <a id="_cssfadein"/> _cssFadeIn <p style="padding-left: 20px;"> The CSS class to apply to objectToFade when changing from hidden to visible. </p> <br>

  * <a id="_cssfadeout"/> _cssFadeOut <p style="padding-left: 20px;"> The CSS class to apply to objectToFade when changing from visible to hidden. </p> <br>

  * <a id="_cssstart"/> _cssStart <p style="padding-left: 20px;"> The CSS class to apply to objectToFade on setup. </p> <br>

* <a id="properties"/> <h2> Properties: </h2>

  * <a id="propertiesprefix"/> All of the parameters are accessible without "_" <p style="padding-left: 20px;">  </p> <br>

  * <a id="id"/> id <p style="padding-left: 20px;"> The unique numerical ID of this fadingData. </p> <br>

  * <a id="faderdataparent"/> faderDataParent <p style="padding-left: 20px;"> A reference to the [faderData](faderData.md) that this fadingData is a part of. </p> <br>

* <a id="functions"/> <h2> Functions: </h2>

  * <a id="toggleobject"/> toggleObject(_toggle) <p style="padding-left: 20px;"> Enables or disables this object based on _toggle.</p>
	<br>
	
  * <a id="enableobject"/> enableObject <p style="padding-left: 20px;"> Remove disabled CSS and add enabled CSS. </p>
	<br>

  * <a id="disableobject"/> disableObject <p style="padding-left: 20px;"> Remove enabled CSS and add disabled CSS. </p>
	<br>

  * <a id="disabledonstart"/> disabledOnStart <p style="padding-left: 20px;"> Remove enabled CSS and add disabled CSS. </p>
	<br>

  * <a id="applyclass"/> applyClass(_class) <p style="padding-left: 20px;"> Apply _class to fadingData's object. </p>
	<br>

  * <a id="removeclass"/> removeClass(_class) <p style="padding-left: 20px;"> Remove _class to fadingData's object. </p>
	<br>

  * <a id="clearelementclass"/> clearElementClass <p style="padding-left: 20px;"> Remove any CSS from [cElement](/Code/Main%20Code/Element/README.md) on fadingData's object. </p>
	<br>

#### References: 
  
[cTimer](/Code/Main%20Code/Timer/README.md)
[scaledTimer](/Code/Main%20Code/Timer/Markdowns/scaledTimer.md)
[scaledTime](/Code/Main%20Code/Timer/Markdowns/scaledTime.md)
[Return to parent](/Code/Other%20Custom%20Code/cFader/README.md)