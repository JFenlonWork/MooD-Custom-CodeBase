# <a id="title"/> expansionData
### <a id="description"/> Holds information and functions for DOM objects that have or will be expanded to remove vertical scrollbars
#

#### <a id="codeexample"/> Code Example:
```Javascript
cExpander.expansionData(_objectToExpand, _scroller, _scrollerWidthOffset, _expandToJQuery, _expansionCssClass, _expansionID)
```
	
* <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_objecttoexpand"/> _objectToExpand <p style="padding-left: 20px;"> The DOM Object or [cElement](INSERTLINK) that will be expanded. </p> <br>

    * <a id="_scroller"/> _scroller <p style="padding-left: 20px;"> The CSS class that is on the scroller DIV/DOM Object. </p> <br>

    * <a id="_scrollerwidthoffset"/> _scrollerWidthOffset <p style="padding-left: 20px;"> Applies a height offset if there is a scrollbar for the width. </p> <br>

    * <a id="_expandtojquery"/> _expandToJQuery <p style="padding-left: 20px;"> Defines the JQuery string that [cMaths.Bounds.fromObject](INSERTLINK) will use for [_includeChildren](INSERTLINK). </p> <br>

    * <a id="_expansioncssclass"/> _expansionCssClass <p style="padding-left: 20px;"> The CSS class that will be applied to the main object's DOM and scroller's DOM. </p> <br>

    * <a id="_expansionid"/> _expansionID <p style="padding-left: 20px;"> The unique ID given to the expansionData that can be used to [returnExpansionDataFromObject](INSERTLINK). </p> <br>

* <a id="properties"/> <h2> Properties: </h2>

    * <a id="propertiesprefix"/> All of the parameters are accessible without "_" <p style="padding-left: 20px;">  </p> <br>

    * <a id="objecttoexpanddom"/> objectToExpandDOM <p style="padding-left: 20px;"> The DOM object to be expanded, calculated from [_objectToExpand](#_objecttoexpand). </p> <br>

    * <a id="useselement"/> usesElement <p style="padding-left: 20px;"> Determines if this expansionData uses [cElement](INSERTLINK) for the main DOM object. </p> <br>

    * <a id="scrollerdom"/> scrollerDOM <p style="padding-left: 20px;"> The DOM object of the scroller/s, calculated from [_scroller](#_scroller). </p> <br>

    * <a id="originalheight"/> originalHeight <p style="padding-left: 20px;"> Stores the height before expansion. </p> <br>

    * <a id="heightchanged"/> heightChanged <p style="padding-left: 20px;"> Stores the change in height from [originalHeight](#originalheight) and post-expansion. </p> <br>

    * <a id="expanded"/> expanded <p style="padding-left: 20px;"> Stores if the object is currently expanded. </p> <br>

    * <a id="previousexpanded"/> previousExpanded <p style="padding-left: 20px;"> Stores the previous value of [expanded](#expanded). </p> <br>

    * <a id="objectsmoveddom"/> objectsMovedDOM <p style="padding-left: 20px;"> An array that stores any DOM objects that have been repositioned when this object expanded. </p> <br>

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="checkmovedexists"/> checkMovedExists(_toCheck) <p style="padding-left: 20px;"> A function that searches through [objectsMovedDOM](#objectsmoveddom) to see if a parameter can be found. </p> <br>

    * <a id="resetmoved"/> resetMoved <p style="padding-left: 20px;"> A function that loops through [objectsMovedDOM](#objectsmoveddom) and resets them back to their original position. </p> <br>
  
#### References: 
  
[Return to parent](/Code/Other%20Custom%20Code/cExpander/README.md)