/*
	Title:
		cExpander
	
	Description:
        Handle size expandable functions to
        resize DOM objects to remove scrollers
*/

window.cExpander = window.cExpander || new function customExpander()
{

	//====DATA TYPES====//
	this.dataTypes = new cExpanderDataTypes();

	this.ExpansionData = this.dataTypes.expansionData.prototype;
	this.expansionData = this.dataTypes.expansionData;
	
	//====FUNCTIONS====//
	this.expansion = new cExpanderFunctions();

	//====VARIABLES====//
	this.allExpansionData = [];

	//====RUN-TIME FUNCTIONS====//

}

function cExpanderDataTypes()
{

	this.expansionData = function expansionData(_objectToExpand, _scroller, _scrollerWidthOffset, _expandToJQuery, _expansionCssClass)
	{
		if (_objectToExpand == null || _scroller == null)
		{
			return null;
		}

		var _this = this;
		this.objectToExpand = _objectToExpand;
		this.objectToExpandDOM = this.objectToExpand;
		this.usesElement = false;

		if (typeof this.objectToExpand === "object")
		{
			if (typeof window.cElement != "undefined")
			{
				if (this.objectToExpand instanceof cElement.element)
				{
					this.usesElement = true;
					this.objectToExpandDOM = cUtility.findHTMLObjects(_this.objectToExpand);
				}
			}
		}
		else
		{
			this.objectToExpandDOM = $(this.objectToExpand);
		}

		this.scroller = _scroller || ".scroller, .matrix-Scroller";
		this.scrollerDOM = this.objectToExpandDOM.find(_this.scroller);
		this.scrollerWidthOffset = _scrollerWidthOffset || 0;

		if (this.objectToExpandDOM.length && this.objectToExpandDOM.length > 0)
		{
			this.objectToExpandDOM = this.objectToExpandDOM[0];
		}

		this.expandToJQuery = _expandToJQuery || "*";

		this.expansionCssClass = _expansionCssClass || "defaultExpansion";
		
		$(_this.objectToExpandDOM).addClass(_this.expansionCssClass);
		this.scrollerDOM.addClass(_this.expansionCssClass);
		
		this.originalHeight = -1;
		this.heightChanged = -1;
		this.expanded = false;
		this.previousExpanded = false;

		this.objectsMovedDOM = [];

		this.checkMovedExists = function(_toCheck)
        {
            for (var i = 0; i < _this.objectsMovedDOM.length; i++)
            {
                if (_this.objectsMovedDOM[i] == _toCheck)
                {
                    return true;
                }
            }
		}
	}

}

function cExpanderFunctions()
{
	this.returnExpansionData = function returnExpansionData(_objectToExpand, _expansionCreationData)
	{
		for (var i = 0; i < cExpander.allExpansionData.length; i++)
        {
            if (cExpander.allExpansionData[i].objectToExpand == _objectToExpand)
            {
                return cExpander.allExpansionData[i];
            }
		}
		
		if (_expansionCreationData != null)
		{
			var _expansionData = new cExpander.expansionData(_objectToExpand
												, _expansionCreationData._scroller
												, _expansionCreationData._scrollerWidthOffset
												, _expansionCreationData._expandToJQuery
												, _expansionCreationData._expansionCssClass);
			cExpander.allExpansionData.push(_expansionData);
			return _expansionData;
		}

		return null;
	}

	this.toggleExpansion = function toggleExpansion(_objectToExpand, _expanded)
	{
		var _expansionData = cExpander.expansion.returnExpansionData(_objectToExpand);

		if (_expansionData == null) { return false; }

		_expansionData.previousExpanded = _expansionData.expanded;

		if (_expanded)
		{
			_expansionData.expanded = _expanded;
		}
		else
		{
			_expansionData.expanded = !_expansionData.expanded;
		}

		cExpander.expansion.updateExpansion(_expansionData);
	}

	this.updateExpansion = function updateExpansion(_expansionData)
	{
		if (_expansionData.expanded)
		{
			//get total size of all items inside the inline form
			var totalSize = cMaths.Bounds.fromObject(_expansionData.objectToExpandDOM
											, document, _expansionData.expandToJQuery).size.y;

			totalSize += _expansionData.scrollerWidthOffset;

			if (_expansionData.previousExpanded != _expansionData.expanded)
			{
				_expansionData.originalHeight = cMaths.Bounds.fromObject(_expansionData.scrollerDOM[0], document, null).size.y;
				_expansionData.heightChanged = totalSize - _expansionData.originalHeight;
			}

			//set height to be total size
			var _styleData = new cCss.styleSheetModificationData("height", null, false, 0, totalSize + "px", -1, true);
			cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);

            //move all other html that might've been affected
            //moveHTMLToNotOverlap(_inlineForm, _inlineFormScroller);
		}
		else
		{
			if (_expansionData.originalHeight != -1)
			{
				var _styleData = new cCss.styleSheetModificationData("height", null, false, 0, _expansionData.originalHeight + "px", -1, true);
				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);	

            	//move all other html that might've been affected
            	//moveHTMLToNotOverlap(_inlineForm, _inlineFormScroller);
			}
		}

		/*
		if (typeof resizePage != "undefined")
        {
            resizePage();
		}
		*/
	}


}