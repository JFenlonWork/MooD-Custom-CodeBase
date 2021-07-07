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

	this.CalculatedObjectData = this.dataTypes.calculatedObjectData.prototype;
	this.calculatedObjectData = this.dataTypes.calculatedObjectData;
	
	//====FUNCTIONS====//
	this.expansion = new cExpanderFunctions();
	this.search = new cExpanderSearchFunctions();

	//====VARIABLES====//
	this.allExpansionData = [];
	this.allCalculatedObjects = [];
	this.uniqueID = 1;
	this.uniqueCalculatedID = 1;

	//====RUN-TIME FUNCTIONS====//

}

function cExpanderDataTypes()
{

	this.expansionData = function expansionData(_objectToExpand, _scroller, _scrollerWidthOffset, _expandToJQuery, _expansionCssClass, _expansionID)
	{
		if (_objectToExpand == null)
		{
			return null;
		}

		var _this = this;
		this.ID = _expansionID || cExpander.uniqueID;

		if (this.ID >= cExpander.uniqueID) { cExpander.uniqueID = this.ID + 1; }

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
				var _styleData = new cCss.styleSheetModificationData({
					prop: "transform",
					cssProp: "transform",
					insidePropProp: "translateY"
				 }, true, 1, null, 0, true);
				var _objectStyleID = cExpander.search.returnCalculatedObjectDataFromObject(_this.objectsMovedDOM[0], cExpander.uniqueCalculatedID);
				var _selector = cCss.styleSheet.translateCssSelector(".ExpansionMoved" + _objectStyleID.ID, "MainExpansionStyles");
				var _currentTransform = cCss.styleSheet.getCssStyle(_selector.style, _styleData, 2);

				_styleData.value = (_currentTransform.values.length > 0) ? parseInt(_currentTransform.values[0].replace(/\(|\)/gi, ""), 10) - _this.heightChanged : 0;
				_styleData.value += "px";

				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", ".ExpansionMoved" + _objectStyleID.ID, _styleData);

				_this.objectsMovedDOM.shift();
			}
		}
	}

	this.calculatedObjectData = function calculatedObjectData(_object, _id)
	{
		if (_object == null) { return null; }
		this.object = _object;
		this.ID = _id || cExpander.uniqueCalculatedID;

		if (this.ID >= cExpander.uniqueCalculatedID) { cExpander.uniqueCalculatedID = this.ID + 1; }
	}

}

function cExpanderSearchFunctions()
{
	this.returnExpansionDataFromObject = function returnExpansionData(_objectToExpand, _expansionCreationData)
	{
		for (var l = 0; l < cExpander.allExpansionData.length; l++)
		{
			if (cExpander.allExpansionData[l].objectToExpand == _objectToExpand ||
				cExpander.allExpansionData[l].objectToExpandDOM == _objectToExpand)
			{
				return cExpander.allExpansionData[l];
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
		for (var l = 0; l < cExpander.allExpansionData.length; l++)
		{
			if (cExpander.allExpansionData[l].ID == _id) { return cExpander.allExpansionData[l]; }
		}
		
		if (_expansionCreationData != null)
		{
			return cExpander.expansion.createExpansionData(_expansionCreationData);
		}

		return null;
	}

	this.returnCalculatedObjectDataFromObject = function returnCalculatedObjectDataFromObject(_object, _createOnFailID)
	{
		for (var l = 0; l < cExpander.allCalculatedObjects.length; l++)
		{
			if (cExpander.allCalculatedObjects[l].object == _object) { return cExpander.allCalculatedObjects[l]; }
		}

		if (_createOnFailID)
		{
			return cExpander.expansion.createCalculatedData(_object, _createOnFailID);
		}

		return null;
	}

	this.returnCalculatedObjectDataFromID = function returnCalculatedObjectDataFromID(_id, _createOnFailObject)
	{
		for (var l = 0; l < cExpander.allCalculatedObjects.length; l++)
		{
			if (cExpander.allCalculatedObjects[l].ID == _id) { return cExpander.allCalculatedObjects[l]; }
		}

		if (_createOnFailObject)
		{
			return cExpander.expansion.createCalculatedData(_createOnFailObject, _id);
		}
		
		return null;
	}
}

function cExpanderFunctions()
{

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

	this.createCalculatedData = function createCalculatedData(_object, _id)
	{
		var _calculatedData = new cExpander.calculatedObjectData(_object, _id);
		cExpander.allCalculatedObjects.push(_calculatedData);
		return _calculatedData;
	}

	this.toggleExpansionID = function toggleExpansionID(_id, _expanded)
	{
		return cExpander.expansion.toggleExpansion(cExpander.search.returnExpansionDataFromID(_id), _expanded);
	}

	this.toggleExpansionObject = function toggleExpansion(_object, _expanded)
	{
		return cExpander.expansion.toggleExpansion(cExpander.search.returnExpansionDataFromObject(_object), _expanded);
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
			var _styleData = new cCss.styleSheetModificationData({
				prop: "height",
				cssProp: "height" 
			 }, false, 0, totalSize + "px", -1, true);
			cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);

			//move all other html that might've been affected
			cExpander.expansion.moveHTMLToNotOverlap(_expansionData)

		}
		else
		{
			if (_expansionData.originalHeight != -1)
			{
				var _styleData = new cCss.styleSheetModificationData({
					prop: "height",
					cssProp: "height" 
				 }, false, 0, _expansionData.originalHeight + "px", -1, true);
				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);	

            	//move all other html that might've been affected
            	_expansionData.resetMoved();
			}
		}

		if (cPageResizer != null)
		{
			cPageResizer.resizePage();
		}
	}

	this.moveHTMLToNotOverlap = function moveHTMLToNotOverlap(_expansionData, _object, _allElements)
	{
		var _objectBounds = cMaths.Bounds.fromObject(_object, document);

		if (!_allElements)
		{
			var _allElements = [];
			_expansionData.moved = [];
			_objectBounds = cMaths.Bounds.fromObject(_expansionData.objectToExpandDOM, document);

			var _objToIgnore = [$("img[usemap='#ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']"[0]),
								$("map[name='ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']"[0]),
								$("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]")[0],
								_expansionData.objectToExpandDOM]

			var _allElements = $(".InteractiveModel").children().filter(function() {

				if ($.inArray(this, _objToIgnore) != -1) { return false; }

				if ($(this).is("div"))
				{
					var _bounds = cMaths.Bounds.fromObject(this, document);

					if (_bounds.y2 > _objectBounds.y1)
					{
						return true;
					}
				}

				return false;

			}).toArray();
		}

		var _allWithin = null;
		var _lastLowest = null;
		var _completeBounds = _objectBounds.clone();

		do {
			_lastLowest = _allWithin == null ? null : _allWithin.length > 0 ? _allWithin[0].object : null;
			_allWithin = cMaths.collision.returnObjectsIntersectArea(_completeBounds, _allElements).sort(function(a, b) {
				return (a.y2 > b.y2);
			});

			if (_allWithin.length > 0)
			{
				_completeBounds.y2 = _allWithin[0].y2;
				_completeBounds.updateExtras();
			}
		} while (_allWithin.length != 0 && _allWithin[0].object != _lastLowest)

		for (var i = 0; i < _allWithin.length; i++)
		{
			if (!(_expansionData.checkMovedExists(_allWithin[i]._object)))
			{
				
                var _styleData = new cCss.styleSheetModificationData({
					prop: "transform",
					cssProp: "transform",
					insidePropProp: "translateY"
				 }, true, 1, null, 0, true);
				var _objectStyleID = cExpander.search.returnCalculatedObjectDataFromObject(_allWithin[i]._object, cExpander.uniqueCalculatedID);
				var _selector = cCss.styleSheet.translateCssSelector(".ExpansionMoved" + _objectStyleID.ID, "MainExpansionStyles");
				
				var _currentTransform = cCss.styleSheet.getCssStyle(_selector.style, _styleData, 2);
				
				_styleData.value = (_currentTransform.values.length > 0) ? parseInt(_currentTransform.values[0].replace(/\(|\)/gi, ""), 10) + _expansionData.heightChanged : _expansionData.heightChanged;
				_styleData.value += "px";
				
				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", ".ExpansionMoved" + _objectStyleID.ID, _styleData);

                _expansionData.objectsMovedDOM.push(_allWithin[i]._object);
                $(_allWithin[i]._object).addClass("ExpansionMoved" + _objectStyleID.ID);
			}
		}
		
	}

}