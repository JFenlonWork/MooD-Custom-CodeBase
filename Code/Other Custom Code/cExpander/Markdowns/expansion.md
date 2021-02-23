# <a id="title"/> expansion
### <a id="description"/> Collection of basic functions for [cExpander](../README.md)
#

#### <a id="codeprefix"/> Code Prefix:
    cExpander.expansion.
	

* <a id="functions"/> <h2> Functions: </h2>

	* <a id="createexpansiondata"/> createExpansionData(_expansionCreationData) <p style="padding-left: 20px;"> Create and return a new [expansionData](expansionData.md). </p>

		```Javascript
		_expansionCreationData = {
			_objectToExpand,
			_scroller,
			_scrollerWidthOffset,
			_expandToJQuery,
			_expansionCssClass,
			_id 
		}
		```
	<br>

	* <a id="createcalculateddata"/> createCalculatedData(_object, _id) <p style="padding-left: 20px;"> Create, add to [cExpander's allCalculatedObjects](/README.md#allcalculatedobjects) and return a new [calculatedObjectData](calculatedObjectData.md). </p>
	<br>

	* <a id="toggleexpansion"/> [toggleExpansion(_expansionData/_id/_object, _expanded)](toggleExpansion.md) <p style="padding-left: 20px;"> Expand/contract [expansionData](expansionData.md) based on _expanded and update it. </p>
	<br>

	* <a id="updateexpansion"/> updateExpansion(_expansionData) <p style="padding-left: 20px;"> Calculate size changes from expansion/contraction and update [_expansionData's objectToExpandDOM's CSS](expansionData.md#objecttoexpanddom).</p>
	<br>

	* <a id="movehtmltonotoverlap"/> moveHTMLToNotOverlap(_expansionData, _object, _allElements) <p style="padding-left: 20px;"> Calculate objects that are within the expansion space using [cMaths.collision](INSERTLINK) and move them accordingly. Automatically finds objects that may collide and move them as well. Only _expansionData is required for this function.</p>
	<br>
  
#### References: 
  
[Return to parent](/README.md)