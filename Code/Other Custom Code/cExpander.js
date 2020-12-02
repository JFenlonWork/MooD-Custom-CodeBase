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
	this.uniqueID = 1;

	//====RUN-TIME FUNCTIONS====//

}

function cExpanderDataTypes()
{

	this.expansionData = function expansionData(_objectToExpand, _scroller, _scrollerWidthOffset, _expandToJQuery, _expansionCssClass, _expansionID)
	{
		if (_objectToExpand == null || _scroller == null)
		{
			return null;
		}

		var _this = this;
		this.ID = _expansionID || window.cExpander.uniqueID++;

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

		this.checkMovedExists = function checkMovedExists(_toCheck)
        {
            for (var i = 0; i < _this.objectsMovedDOM.length; i++)
            {
                if (_this.objectsMovedDOM[i] == _toCheck)
                {
                    return true;
                }
            }
		}

		this.resetMoved = function resetMoved()
		{
			while(_this.objectsMovedDOM.length > 0)
			{
				var _styleData = new cCss.styleSheetModificationData("transform", "translateY", true, 1, null, -1, false);
				var _selector = cCss.styleSheet.getCssSelector("MainExpansionStyles", ".ExpansionMoved");
				var _currentTransform = cCss.styleSheet.getCssStyle(_selector.style, _styleData, 2);

				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", ".ExpansionMoved", _styleData);

				_this.objectsMovedDOM.shift();
			}
		}
	}

}

function cExpanderFunctions()
{
	this.returnExpansionDataFromObject = function returnExpansionData(_objectToExpand, _expansionCreationData)
	{
		for (var i = 0; i < cExpander.allExpansionData.length; i++)
        {
			if (cExpander.allExpansionData[i].objectToExpand == _objectToExpand ||
				cExpander.allExpansionData[i].objectToExpandDOM == _objectToExpand)
            {
                return cExpander.allExpansionData[i];
            }
		}
		
		if (_expansionCreationData != null)
		{
			return cExpander.expansion.createExpansionData(_expansionCreationData);
		}

		return null;
	}

	this.returnExpansionDataFromID = function returnExpansionDataFromID(_id, _expansionCreationData)
	{
		for (var i = 0; i < cExpander.allExpansionData.length; i++)
        {
            if (cExpander.allExpansionData[i].ID == _id)
            {
                return cExpander.allExpansionData[i];
            }
		}
		
		if (_expansionCreationData != null)
		{
			return cExpander.expansion.createExpansionData(_expansionCreationData);
		}

		return null;
	}

	this.createExpansionData = function createExpansionData(_expansionCreationData)
	{
		var _expansionData = new cExpander.expansionData(
										_expansionCreationData._objectToExpand
										, _expansionCreationData._scroller
										, _expansionCreationData._scrollerWidthOffset
										, _expansionCreationData._expandToJQuery
										, _expansionCreationData._expansionCssClass
										, _expansionCreationData._id);

		cExpander.allExpansionData.push(_expansionData);
		return _expansionData;
	}

	this.toggleExpansionID = function toggleExpansionID(_id, _expanded)
	{
		return cExpander.expansion.toggleExpansion(cExpander.expansion.returnExpansionDataFromID(_id), _expanded);
	}

	this.toggleExpansionObject = function toggleExpansion(_object, _expanded)
	{
		return cExpander.expansion.toggleExpansion(cExpander.expansion.returnExpansionDataFromObject(_object), _expanded);
	}

	this.toggleExpansion = function toggleExpansion(_expansionData, _expanded)
	{
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
		return true;
	}

	this.updateExpansion = function updateExpansion(_expansionData)
	{
		if (_expansionData.expanded)
		{
			//get total size of all items inside the inline form
			var totalSize = cMaths.Bounds.fromObject(_expansionData.objectToExpandDOM
											, document, _expansionData.expandToJQuery).size.y;

			if (_expansionData.previousExpanded == false)
			{
				totalSize += _expansionData.scrollerWidthOffset;
			}

			if (_expansionData.previousExpanded != _expansionData.expanded)
			{
				_expansionData.originalHeight = cMaths.Bounds.fromObject(_expansionData.scrollerDOM[0], document, null).size.y;
				_expansionData.heightChanged = totalSize - _expansionData.originalHeight;
			}

			//set height to be total size
			var _styleData = new cCss.styleSheetModificationData("height", null, false, 0, totalSize + "px", -1, true);
			cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);

			//move all other html that might've been affected
			cExpander.expansion.moveHTMLToNotOverlap(_expansionData)

		}
		else
		{
			if (_expansionData.originalHeight != -1)
			{
				var _styleData = new cCss.styleSheetModificationData("height", null, false, 0, _expansionData.originalHeight + "px", -1, true);
				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);	

            	//move all other html that might've been affected
            	_expansionData.resetMoved();
			}
		}

		/*
		if (typeof resizePage != "undefined")
        {
            resizePage();
		}
		*/
	}

	this.moveHTMLToNotOverlap = function moveHTMLToNotOverlap(_expansionData, _object, _allElements)
	{
		var _objectBounds = cMaths.Bounds.fromObject(_object, document);

		if (!_allElements)
		{
			var _allElements = [];
			_expansionData.moved = [];
			_objectBounds = cMaths.Bounds.fromObject(_expansionData.objectToExpandDOM, document);

			$(".InteractiveModel").children().filter(function() {
				return !(this == $("img[usemap='#ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0] ||
						this == $("map[name='ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0] ||
						this == $(ctl00_ContentPlaceHolder1_InteractiveModel1_shadow)[0] ||
						this == _expansionData.objectToExpandDOM ||
						$(this).not("div"))
			}).each(function() {
				var _bounds = cMaths.Bounds.fromObject(this, document);

				if (_bounds.y2 > _objectBounds.y1)
				{
					_allElements.push(this);
				}
			});
		}

		var _allWithin = cMaths.collision.returnObjectsIntersectArea(_objectBounds, _allElements).sort(function(a, b) {
			return (a.y2 > b.y2);
		});

		for (var i = 0; i < _allWithin.length; a++)
		{
			if (!(_expansionData.checkMovedExists(_allWithin[i]._object)))
			{
				
                var _styleData = new cCss.styleSheetModificationData("transform", "translateY", true, 1, null, -1, false);
				var _selector = cCss.styleSheet.getCssSelector("MainExpansionStyles", ".ExpansionMoved");
				var _currentTransform = cCss.styleSheet.getCssStyle(_selector.style, _styleData, 2);

				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", ".ExpansionMoved", _styleData);

				_expansionData.moved.push(_allWithin[i]._object);
			}
		}
		
	}



}