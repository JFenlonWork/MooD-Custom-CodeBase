# <a id="title"/> expansionData
### <a id="description"/> Holds information and functions for DOM objects that have or will be expanded to remove vertical scrollbars
#

#### <a id="codeexample"/> Code Example:
    ```Javascript
  	cExpander.expansionData(_objectToExpand, _scroller, _scrollerWidthOffset, _expandToJQuery, _expansionCssClass, _expansionID)
  	```
	
* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_objecttoexpand"/> _objectToExpand <p style="padding-left: 20px;"> The DOM Object or [cElement](INSERTLINK) that will be expanded. </p>

    * <a id="_scroller"/> _scroller <p style="padding-left: 20px;"> The CSS class that is on the scroller DIV/DOM Object. </p>

    * <a id="_scrollerwidthoffset"/> _scrollerWidthOffset <p style="padding-left: 20px;"> Applies a height offset if there is a scrollbar for the width. </p>

    * <a id="_expandtojquery"/> _expandToJQuery <p style="padding-left: 20px;"> Defines the JQuery string that [cMaths.Bounds.fromObject](INSERTLINK) will use for [_includeChildren](INSERTLINK). </p>

    * <a id="_expansioncssclass"/> _expansionCssClass <p style="padding-left: 20px;"> The CSS class that will be applied to the main object's DOM and scroller's DOM. </p>

    * <a id="_expansionid"/> _expansionID <p style="padding-left: 20px;"> The unique ID given to the expansionData that can be used to [returnExpansionDataFromObject](INSERTLINK). </p>

* <a id="properties"/> <h2> Properties: </h2>

    * <a id="propertiesprefix"/> All of the parameters are accessible without "_" <p style="padding-left: 20px;">  </p>

    * <a id="objecttoexpanddom"/> objectToExpandDOM <p style="padding-left: 20px;"> The DOM object to be expanded, calculated from [_objectToExpand](#_objecttoexpand). </p>

    * <a id="useselement"/> usesElement <p style="padding-left: 20px;"> Determines if this expansionData uses [cElement](INSERTLINK) for the main DOM object. </p>

    * <a id="scrollerdom"/> scrollerDOM <p style="padding-left: 20px;"> The DOM object of the scroller/s, calculated from [_scroller](#_scroller). </p>

    * <a id="originalheight"/> originalHeight <p style="padding-left: 20px;"> Stores the height before expansion. </p>

    * <a id="heightchanged"/> heightChanged <p style="padding-left: 20px;"> Stores the change in height from [originalHeight](#originalheight) and post-expansion. </p>

    * <a id="expanded"/> expanded <p style="padding-left: 20px;"> Stores if the object is currently expanded. </p>

    * <a id="previousexpanded"/> previousExpanded <p style="padding-left: 20px;"> Stores if the previous value of [expanded](#expanded). </p>

    * <a id="objectsmoveddom"/> objectsMovedDOM <p style="padding-left: 20px;"> An array that stores any DOM objects that have been repositioned when this object expanded. </p>

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="checkmovedexists"/> checkMovedExists <p style="padding-left: 20px;"> A function that searches through [objectsMovedDOM](#objectsmoveddom) to see if a parameter can be found. </p>

    * <a id="resetmoved"/> resetMoved <p style="padding-left: 20px;"> A function that loops through [objectsMovedDOM](#objectsmoveddom) and resets them back to their original position. </p>
    * 
#### References: 
  
[Return to parent](/README.md)