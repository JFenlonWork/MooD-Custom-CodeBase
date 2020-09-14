/*
	Title:
		CssUtility
	
	Description:
		Any miscellaneous Css functions
*/

window.cCss = window.cCss || new function customCss()
{
	//====DATA TYPES====//
	this.dataTypes = new cCssDataTypes();

	this.cssTransitionData = this.dataTypes.cssTransitionData.prototype;
	this.cssTransitionData = this.dataTypes.cssTransitionData;

	this.StyleModificationData = this.dataTypes.styleModificationData.prototype;
	this.styleModificationData = this.dataTypes.styleModificationData;
	
	this.SeparatedListData = this.dataTypes.separatedListData.prototype;
	this.separatedListData = this.dataTypes.separatedListData;
	
	//====FUNCTIONS====//
	this.transform = new customCssTransformFunctions();
	this.transition = new customCssTransitionFunctions();
	this.style = new customCssStyleFunctions();
	this.styleSheet = new customCssstyleSheetFunctions();

	//====RUN-TIME FUNCTIONS====//

}

function cCssDataTypes()
{
	//store CssTransitionData
	this.cssTransitionData = function (_transitionProperty, _transitionDuration,
										 _transitionTiming, _transitionDelay, _transitionIndex)
	{
		this.transitionProperty = _transitionProperty || '';
		this.transitionDuration = _transitionDuration || 0;
		this.transitionTiming = _transitionTiming || "ease";
		this.transitionDelay = _transitionDelay || 0;
		this.transitionIndex = _transitionIndex || 0;
	}

	//store style data
	this.styleModificationData = function styleModificationData(_property, _value, _importance, _propertyIndex)
	{
		this.property = _property || "";
		this.value = _value || "";
		this.importance = _importance || "";
		this.propertyIndex = _propertyIndex || 0;
	}

	//store split style data
	this.separatedListData = function separatedListData(_prefix, _body, _commaSeparated)
	{
		this.prefix = _prefix || "";
		this.body = _body || [];
		this.commaSeparated = _commaSeparated || false;

		var _this = this;

		//combine prefix and body into single string
		this.combineData = function combineData()
		{
			//setup initial body of style
			var _ret = _prefix;

			//loop through all data of body
			for (var _body = 0; _body < _this.body.length; _body++)
			{
				//check if style was comma-separated
				if (_commaSeparated)
				{
					//add body section onto style body
					_ret += " " + _this.body[_body];
				}
				else
				{
					//check if body section needs to start/end with brackets
					if (_body == 0)
					{
						_ret += "(";
					}
					
					if (_body == _this.body.length - 1)
					{
						_ret += "," + _this.body[_body] + ")";
					} 
					else
					{
						_ret += "," + _this.body[_body];
					}
				}
			}

			return _ret;
		}
	}
}

//hold all transform functions
function customCssTransformFunctions()
{
	//get current transform and add onto it
	this.modifyTransformVariables = function modifyTransformVariables(_object, _type, _values)
	{
		//check object style exists
		if (_object)
		{
			if (_object.style)
			{

				//make sure variables are set
				var _values = _values || [];

				//grab previous transform variables
				var _prevTransformVars = cCss.transform.returnTransformVariables(_object, _type);
				
				//setup transform variables
				var _transform = _prevTransformVars.previous + _type + "(";

				//calculate loop count
				var _transformLoop = _prevTransformVars.values.length;
				if (_prevTransformVars.values.length < _values.length)
				{
					_transformLoop = _values.length;
				}

				//loop through all transform potential variables
				for (var i = 0; i < _transformLoop; i++)
				{
					var _transformValue = 0

					//setup tranform variable based
					if (i < _prevTransformVars.values.length)
					{
						_transformValue = _prevTransformVars.values[i];
					}

					if (i < _values.length)
					{
						_transformValue += _values[i];
					}
					
					//check if start of transform variable
					if (i == 0)
					{
						_transform += _transformValue + "px";
					}
					else
					{
						_transform += ", " + _transformValue + "px";
					}

				}

				_transform += ")" + _prevTransformVars.after;

				//set transform to new transform
				_object.style.transform = _transform;
			}
		}
	}

	//get current transform on object
	this.returnTransformVariables = function returnTransformVariables(_object, _type)
	{
		//store variables
		var _ret = {
			values: [],
			previous: "",
			after: ""
		}

		//check object transform exists
		if (_object)
		{
			if (_object.style)
			{
				if (_object.style.transform != '')
				{
					//get transform and remove excess characters
					var _tempTransform = _object.style.transform;

					//grab previous transform
					_ret.previous = _tempTransform.slice(0, _tempTransform.indexOf(_type));
					_tempTransform = _tempTransform.slice(_tempTransform.indexOf(_type), _tempTransform.length);

					//grab all transform variables
					var _transformVars = _tempTransform.slice(_tempTransform.indexOf("(") + 1, _tempTransform.indexOf(")"));
					_tempTransform = _tempTransform.slice(_tempTransform.indexOf(")") + 1, _tempTransform.length);
					_transformVars = _transformVars.split(",");

					//setup transform variables
					for (var i = 0; i < _transformVars.length; i++)
					{
						_ret.values.push(parseInt(_transformVars[i]));
					}

					//grab after transform
					_ret.after = _tempTransform.slice(0, _tempTransform.length);
				}
			}
		}

		return _ret;
	}
}

//hold all transition functions
function customCssTransitionFunctions() 
{
	//add transition onto object
	this.addTransition = function addTransition(_object, _transitionData)
	{
		if (_transitionData)
		{
			//remove previous transition of same type
			cCss.transition.removeTransition(_object, _transitionData.transitionProperty);

			//check object transform exists
			if (_object)
			{
				if (_object.style)
				{
					if (_object.style.transition != "")
					{
						//add transition onto end of transitions
						_object.style.transitionProperty += ", " + _transitionData.transitionProperty;
						_object.style.transitionDuration += ", " + _transitionData.transitionDuration;
						_object.style.transitionTimingFunction += ", " + _transitionData.transitionTiming;
						_object.style.transitionDelay += ", " + _transitionData.transitionDelay;					
					}
					else
					{
						//set transitions to transition
						_object.style.transitionProperty = _transitionData.transitionProperty;
						_object.style.transitionDuration = _transitionData.transitionDuration;
						_object.style.transitionTimingFunction = _transitionData.transitionTiming;
						_object.style.transitionDelay = _transitionData.transitionDelay;	
					}
				}
			}
		}
	}

	//remove transition on object
	this.removeTransition = function removeTransition(_object, _transitionType)
	{
		var transIndex = cCss.transition.getTransition(_object, _transitionType)
		
		//check transition exists
		if (transIndex != null)
		{
			//store all transition data
			var _transitionProperty = _object.style.transitionProperty.split(",");
			var _transitionDuration = _object.style.transitionDuration.split(",");
			var _transitionTiming = _object.style.transitionTimingFunction.split(",");
			var _transitionDelay = _object.style.transitionDelay.split(",");

			//reset object transition to nothing
			_object.style.transitionProperty = '';
			_object.style.transitionDuration = '';
			_object.style.transitionTimingFunction = '';
			_object.style.transitionDelay = '';

			//loop through all transitions
			for (var i = 0; i < _transitionProperty.length; i++)
			{
				var _endString = ', ';

				//check if index is end index
				if (i == _transitionProperty.length)
				{
					_endString = '';
				}

				//check if index is not equal to transition being removed
				if (i != transIndex.transitionIndex)
				{
					//add object onto end of transition variable
					_object.style.transitionProperty += _transitionProperty[i] + _endString;
					_object.style.transitionDuration += _transitionDuration[i] + _endString;
					_object.style.transitionTimingFunction += _transitionTiming[i] + _endString;
					_object.style.transitionDelay += _transitionDelay[i] + _endString;
				}
			}
		}
	}

	//get index of transition property
	this.getTransition = function getTransition(_object, _transitionType)
	{
		//check object transform exists
		if (_object)
		{
			if (_object.style)
			{
				if (_object.style.transition != '')
				{
					//split all transitions up into _allTrans variable
					var _allTrans = _object.style.transitionProperty.split(",");

					//loop through all transitions and return _transitionType
					for (var i = 0; i < _allTrans.length; i++)
					{
						if (_allTrans[i] == _transitionType)
						{
							return new cCss.cssTransitionData(_allTrans[i],
								_object.style.transitionDuration.split(",")[i],
								_object.style.transitionTimingFunction.split(",")[i],
								_object.style.transitionDelay.split(",")[i],
								i);
						}
					}
				}
			}
		}

		return null;
	}
}

//hold all style functions
function customCssStyleFunctions()
{
	//add transition onto object
	this.addStyleProperty = function addStyleProperty(_object, _stylePropertyData)
	{
		if (_stylePropertyData)
		{
			//remove previous style property of same type
			cCss.style.removeStyleProperty(_object, _stylePropertyData.property);

			//check object style exists
			if (_object)
			{
				if (_object.style)
				{
					var _property = _stylePropertyData.property + ": " + _stylePropertyData.value.toString();
					
					if (_stylePropertyData.importance != "")
					{
						_property += " " + _stylePropertyData.importance;
					}

					_property += ";";
					//add the style property to the object
					_object.style.cssText += _property;
				}
			}
		}
	}

	//remove style property on object
	this.removeStyleProperty = function removeStyleProperty(_object, _property)
	{
		var propertyIndex = cCss.style.getProperty(_object, _property)
		
		//check transition exists
		if (propertyIndex != null)
		{
			//store all transition data
			var _properties = _object.style.cssText.split("; ");

			//reset object transition to nothing
			_object.style = '';

			//loop through all transitions
			for (var i = 0; i < _properties.length; i++)
			{
				var _endString = '; ';

				//check if index is not equal to property being removed
				if (i != propertyIndex)
				{
					//add object onto end of transition variable
					_object.style.cssText += _properties[i] + _endString;
				}
			}
		}
	}

	//get index of style property
	this.getProperty = function getProperty(_object, _styleProperty)
	{
		//check object style exists
		if (_object)
		{
			if (_object.style)
			{
					//split style up into _allStyle variable
					var _allStyle = _object.style.cssText.split("; ");

					//loop through all style properties and return _styleProperty index
					for (var i = 0; i < _allStyle.length; i++)
					{
						//substring the property out of the style
						var currentProperty = _allStyle[i].substring(0, _allStyle[i].indexOf(":"));

						if (currentProperty == _styleProperty)
						{
							return i;
						}
					}
			}
		}

		return -1;
	}
}

//hold all style sheet functions
function customCssstyleSheetFunctions()
{
	//create a new style and stylesheet or return an existing one
	this.addCssSheet = function addCssSheet(_sheet)
	{
		var _styleSheet = cCss.styleSheet.translateCssSheet(_sheet);

		if (_styleSheet != null)
		{
			return _styleSheet;
		}
		else
		{
			//setup the style sheet element and add it to head
			var _styleSheetElement = document.createElement('style');
			_styleSheetElement.id = _sheet;
		  	_styleSheetElement.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(_styleSheetElement);

			//return the stylesheet
			return _styleSheetElement.sheet;
		}
	}

	//remove Css Style Sheet
	this.removeCssSheet = function removeCssSheet(_sheet)
	{
		//find the sheet with _sheet
		var _styleSheet = cCss.styleSheet.translateCssSheet(_sheet);

		//check the sheet exists
		if (_styleSheet)
		{
			//remove the sheet element
			$(_styleSheet.ownerNode).remove();

			//return true as sheet has been deleted
			return true;
		}

		//return false as sheet doesn't exist
		return false;
	}

	//return Style Sheet based on _sheet type
	this.translateCssSheet = function translateCssSheet(_sheet, _createOnFail)
	{
		//check if _sheet is Sheet Name
		if (typeof _sheet === "string")
		{
			//check if sheet exists	
			var _found = cCss.styleSheet.getCssSheet(_sheet); 
			
			//if sheet doesn't exist and create on fail is true
			//create the sheet
			if (_createOnFail && _found == null)
			{
				_found = cCss.styleSheet.addCssSheet(_sheet);
			}

			//return the Style Sheet
			return _found
		}
		//check if _sheet is a HTML Object with a Style Sheet
		else if (_sheet.sheet)
		{
			//return the Style SHeet
			return _sheet.sheet;
		}
		//check if _sheet is a Style Sheet
		else if (_sheet.cssRules)
		{
			//return _sheet as it is a Style Sheet
			return _sheet;
		}

		//return null because something failed
		return null;
	}

	//return the style with _sheet
	this.getCssSheet = function getCssSheet(_sheet)
	{
		//search for all styles with id "_sheet"
		var _styleSheets = $("style[id=" + _sheet + "]");

		//check styles exist
		if (_styleSheets.length != 0)
		{
			//loop through all avaialble sheets
			for (var s = 0; s < _styleSheets.length; s++)
			{
				//check the sheet exists
				if (_styleSheets[s].sheet != null)
				{
					//return the first sheet available
					return _styleSheets[s].sheet;
				}
			}
		}

		//return null because no sheet exists
		return null;
	}

	//return the first style sheet with an instance of _selector
	this.findCssSheetWithSelector = function findCssSheetWithSelector(_selector)
	{
		var _foundSelector = cCss.styleSheet.findCssSelector(_selector);

		//return _foundSelector Style Sheet
		if (_foundSelector)
		{
			return _foundSelector.parentStyleSheet;
		}

		//return null because no sheet exists
		return null;
	}

	//add Css Selector To Style Sheet
	this.addCssSelector = function addCssSelector(_sheet, _selector)
	{
		//find style sheet and selector
		var _styleSheet = cCss.styleSheet.addCssSheet(_sheet);
		var _media = typeof _styleSheet.media;
		var _selectorExists = cCss.styleSheet.getCssSelector(_styleSheet, _selector);

		//if selector doesn't exist then create it
		if (_selectorExists == null)
		{
			if (_media == "string")
			{
				//add _selector rule into the style sheet
				_styleSheet.addRule(_selector,"");
				return cCss.styleSheet.getCssSelector(_styleSheet, _selector);
			}
			else if (_media == "object")
			{
				//setup style sheet rule index for
				//browser (IE8...) compatability
				var _styleSheetLength = 0;
				
				if (_styleSheet.cssRules)
				{
					_styleSheetLength = _styleSheet.cssRules.length
				}

				//insert _selector rule into the correct index of style sheet
				return _styleSheet.rules[_styleSheet.insertRule(_selector + "{ }", _styleSheetLength)];
			}

			//return null because something failed
			return null;
		}
		
		//return the selector as it already exists
		return _selector;
	}

	//remove Css Selector From Style Sheet
	this.removeCssSelector = function removeCssSelector(_sheet, _selector)
	{
		//get the index of _selector in _sheet's rules
		var _index = cCss.styleSheet.getCssSelectorIndex(_sheet, _selector);

		//check index exists
		if (_index != null) 
		{
			//return rule at index
			_sheet.rules.splice(_index, 1);

			//return true as _selector has been removed
			return true;
		}

		//return false as _selector doesn't exist
		return false;
	}

	//return Style Sheet based on _sheet type
	this.translateCssSelector = function translateCssSelector(_selector, _createOnFailSheet)
	{
		//check if _selector is a CSS Style Rule
		if (_selector.selectorText)
		{
			//return the selector
			return _selector;
		}
		//check if _selector is Selector Name
		else if (typeof _selector === "string")
		{
			//check if _selector exists
			var _found = cCss.styleSheet.findCssSelector(_selector);

			//if _selector doesn't exist and create on fail sheet exists
			//then create the sheet
			if (_createOnFailSheet && _found == null)
			{
				//setup the current Style Sheet and create it if it is a string
				var _sheet = cCss.styleSheet.translateCssSheet(_createOnFailSheet, true);

				//add the selector to _sheet and return this
				_found = cCss.styleSheet.addCssSelector(_sheet, _selector);
			}

			//return the Selector
			return _found;
		}

		//return null because something failed
		return null;
	}

	//return the first instance of the Css selector
	//across all style sheets
	this.findCssSelector = function findCssSelector(_selector)
	{
		//store current style sheets
		var _sheets = document.styleSheets;

		//loop through all Style Sheets
		//and return the first instance of _selector
		for (var s = 0; s < _sheets.length; s++)
		{
			//try to find the selector on current style sheet
			var _foundSelector = cCss.styleSheet.getCssSelector(_sheets[s], _selector);

			//if selector was found then return selector
			if (_foundSelector)
			{
				return _foundSelector;
			}
		}

		//return null because no selector exists
		return null;
	}

	//return selector rule
	this.getCssSelector = function getCssSelector(_sheet, _selector)
	{
		//get the index of _selector in _sheet's rules
		var _index = cCss.styleSheet.getCssSelectorIndex(_sheet, _selector);

		//check index exists
		if (_index != null) 
		{
			//return rule at index
			return _sheet.rules[_index];
		}

		//return null if selector doesn't exist
		return null;
	}

	//return selector rule index
	this.getCssSelectorIndex = function getCssSelectorIndex(_sheet, _selector)
	{
		//loop through all style sheet rules
		for (var r = 0; r < _sheet.rules.length; r++) {
			
			//return the current sheet at index
			if(_sheet.rules[r].selectorText 
				&& _sheet.rules[r].selectorText.toLowerCase() == _selector.toLowerCase())
			{
				return r;
		 	}
		}
	}

	//add Css Selector Style To Style Sheet
	this.addCssStyle = function addCssStyle(_sheet, _selector, _style, _replace)
	{
		//setup basic variables
		var _sheet = cCss.styleSheet.translateCssSheet(_sheet, true);
		var _selector = cCss.styleSheet.translateCssSelector(_selector, _sheet);
		var _styles = cCss.styleSheet.translateCssStyle(_style);
		
		//check selector exists
		if (_selector && _styles)
		{
			var _currentStylesNotReplacing = cCss.styleSheet.getCssStyle(_sheet, _selector, _styles, 2);
			var _styleString = "";

			//add all current style to style string
			if (_currentStylesNotReplacing)
			{
				for (var cs = 0; cs < _currentStylesNotReplacing.length; cs++)
				{
					_styleString += _currentStylesNotReplacing[cs] + "; ";
				}
			}

			//check if replacing style is true
			if (_replace)
			{
				//append styles to the end of current style
				for (var s = 0; s < _styles.length; s++)
				{
					_styleString += _styles[s] + "; ";
				}
			}
			else
			{
				//loop through and find values to append based on current style
				var _currentStylesNotReplacing = cCss.styleSheet.getCssStyle(_sheet, _selector, _styles, 1) || [];
				for (var s = 0; s < _styles.length; s++)
				{
					//store style substring
					var _styleSubStr = _styles[s].substring(0, _styles[s].indexOf(":") || _styles[s].length);
					var _found = false;
					
					//loop through all similar current styles
					for (var cs = 0; cs < _currentStylesNotReplacing.length; cs++)
					{
						//check if style substring is the same as current style
						if (_styleSubStr ==
							 _currentStylesNotReplacing[cs].substring(
								0,
								_styles[s].indexOf(":") || _styles[s].length)
							)
						{
							//set found to true and break
							_found = true;
							break;
						}
					}
					
					//if style hasn't been found
					if (!_found)
					{
						//add style onto end of cssText
						_styleString += _styles[s] + "; ";
					}
				}
			}

			//set the selector css to new css
			_selector.style.cssText = _styleString;

			//return true as suceeded
			return true;
		}

		//return null as something failed
		return null;

	}

	//remove Css Selector Style From Sheet
	this.removeCssStyle = function removeCssStyle(_sheet, _selector, _style)
	{
		//setup basic variables
		var _sheet = cCss.styleSheet.translateCssSheet(_sheet, true);
		var _selector = cCss.styleSheet.translateCssSelector(_selector, _sheet);
		var _styles = cCss.styleSheet.translateCssStyle(_style);

		if (_selector)
		{
			var _currentStylesToKeep = cCss.styleSheet.getCssStyle(_sheet, _selector, _styles, 2);
			var _styleString = "";

			//add current style to keep to style string
			if (_currentStylesToKeep)
			{
				for (var cs = 0; cs < _currentStylesToKeep.length; cs++)
				{
					_styleString += _currentStylesToKeep[cs] + "; ";
				}
			}

			//set the selector css to new css
			_selector.style.cssText = _styleString;

			//return true as suceeded
			return true;
		}

		//return null as something failed
		return null;
	}

	//return the correct format for _style to be inserted
	this.translateCssStyle = function translateCssStyle(_style)
	{
		//setup return value
		var _ret = [];

		//check if _style exists
		if (!_style)
		{	
			//return null because _style doesn't exist
			return null;
		}

		//check what type _style is
		if (typeof _style === "string")
		{
			//remove potential object specifiers
			_style = _style.replace(/[{}]/g, "");
			
			//split the string to individual styles
			_ret = _style.split(/(; )|(;)/g);
		}
		else if (typeof _style === "array")
		{
			//loop through all style array values
			for (var s = 0; s < _style.length; s++)
			{
				//translate the current style array index
				var _translated = cCss.styleSheets.translateCssStyle(_style[s]);

				//check if style exists and add it to ret
				if (_translated)
				{
					_ret.push(_translated);
				}
			}
		}
		else if (typeof _style === "object")
		{
			//translate based on string version of _style
			_ret = cCss.styleSheet.translateCssStyle(_style.toString());
		}

		//return _ret or null
		if (_ret.length != 0)
		{
			return _ret;
		}

		//return null as something failed
		return null;
	}

	/**
	 * return the styles in a selector using the given _style
	 * 
	 * Return Types:
	 * 
	 * 0 -> return all
	 * 
	 * 1 -> return if the same style 
	 * 
	 * 2 -> return if not the same style
	 */
	this.getCssStyle = function getCssStyle(_sheet, _selector, _style, _returnType)
	{
		//setup basic variables
		var _ret = [];
		var _sheet = cCss.styleSheet.translateCssSheet(_sheet);
		var _selector = cCss.styleSheet.translateCssSelector(_selector, _sheet);
		var _styles = cCss.styleSheet.translateCssStyle(_style) || [];
		var _returnType = _returnType || 0;

		//CHANGE TO HASH TABLE IF EFFICIENCY IS A PROBLEM (DOUBT IT)
		//check selector exists
		if (_selector)
		{
			//find current selector style and split them into comparable values
			var _currentStyles = cCss.styleSheet.translateCssStyle(_selector.style.cssText) || [];

			//if requesting all style split then return 
			if (_returnType == 0)
			{
				return _currentStyles;
			}
			//check if return found and input empty
			else if (_styles.length == 0 && _returnType == 1)
			{
				return null
			}
			//check if return not found and input empty
			else if (_styles.length == 0 && _returnType == 2)
			{
				return _currentStyles;
			}

			//loop through input styles
			for (var cs = 0; cs < _currentStyles.length; cs++)
			{
				//setup _style substring
				var _currentStyleSubstr = _currentStyles[cs].substring(0, _currentStyles[cs].indexOf(":"));
				var _found = false;

				//loop through current styles
				for (var s = 0; s < _styles.length; s++)
				{
					//check styles are the same
					if (_currentStyleSubstr == _styles[s].substring(0, _styles[s].indexOf(":") || _styles[s].length))
					{
						//set found to true and break out of loop
						_found = true;
						break;
					}
				}

				//add to return based on return type
				if (_found && _returnType == 1)
				{
					//found
					_ret.push(_currentStyles[cs]);
				}
				else if (!_found && _returnType == 2)
				{
					//not found
					_ret.push(_currentStyles[cs]);
				}
			}
		}
		
		//return the calculated value if valid
		if (_ret.length != 0)
		{
			return _ret;
		}

		//return null as something failed
		return null;
		
	}

	//return a style list separated 
	this.separateStyleListAttribute = function separateStyleListAttribute(_attribute, _commaSeparated)
	{
		var _ret = [];
		if (_commaSeparated)
		{
			//split based on comma-separated
			var _attributes = _attribute.split(/,( |(?=[a-z]))/gi);

			//loop through attributes after they are separated
			for (var _attrs = 0; _attrs < _attributes.length; _attrs++)
			{
				var _attrSplit = _attributes[_attrs].split(" ");
				var _attrPrefix = _attrSplit[0];
				_attrSplit.splice(0,1);

				//create a return entry 
				_ret.push(new cCss.SeparatedListData(_attrPrefix,_attrSplit,true));
			}
		}
		else
		{
			//split based on bracket-separated
			var _attributes = _attribute.split(/\((.*?)\)(?=[a-z]| |$|;)/gi);
			var _attributesData = _attribute.split(/((?=(\)|^))(.*?)\()|(\)$)/gi);
			
			//loop through attributes after they are separated
			for (var _attrs = 0; _attrs < _attributes.length; _attrs++)
			{
				//split based on brackets (,)
				var _attrSplitData = _attributesData[_attrs].split(",");
				var _attrPrefix = _attributes[_attrs];

				//create a return entry 
				_ret.push(new cCss.SeparatedListData(_attrPrefix,_attrSplitData,false));
			}
		} 
	}

	/**
	 * split up style into comma separated and then pick out _prefix from those
	 * 
	 * can ONLY search for one type of style at a time (can accept multiple prefix)
	 * 
	 * returns custom split data with: .prefix and
	 * .body with function .combineData() to return one string
	 * 
	 * Return Types:
	 * 
	 * 0 -> return all
	 * 
	 * 1 -> return if the same style 
	 * 
	 * 2 -> return if not the same style
	 */
	this.getSeparatedAttributes = function getSeparatedAttributes(_sheet, _selector, _style, _stylePrefix, _commaSeparated, _returnType)
	{
		//setup basic variables
		var _ret = [];
		var _sheet = cCss.styleSheet.translateCssSheet(_sheet, true);
		var _selector = cCss.styleSheet.translateCssSelector(_selector, _sheet);
		var _styles = cCss.styleSheet.translateCssStyle(_style);
		var _stylePrefix = _stylePrefix || [];

		if (_selector && _commaSeparated != null)
		{
			//get the current _style 
			var _currentStyles = cCss.styleSheet.getCssStyle(_sheet, _selector, _styles, 1);

			//loop through current style 
			for (var _cs = 0; _cs < _currentStyles.length; _cs++)
			{
				//loop through all separated indexs
				var _regexSeparated = cCss.styleSheet.separateStyleListAttribute(_currentStyles[_cs],_commaSeparated);

				for (var _rs = 0; _rs < _regexSeparated.length; _rs++)
				{
					var _found = false;
					//loop through style prefixes and see if similar
					for (var _s = 0; _s < _stylePrefix.length; _s)
					{
						if (_stylePrefix[s] == _regexSeparated[_rs].prefix)
						{
							_found = true;
							break;
						}
					}

					//add to return based on return type
					if (_returnType == 0)
					{
						//add because returning all
						_ret.push(_regexSeparated[_rs])
					}
					if (_found && _returnType == 1)
					{
						//found
						_ret.push(_regexSeparated[_rs]);
					}
					else if (!_found && _returnType == 2)
					{
						//not found
						_ret.push(_regexSeparated[_rs]);
					}
				}
			}
		}

		//return ret value if populated
		if (_ret.length != 0)
		{
			return _ret;
		}

		//return null as something failed
		return null;
	}

	//modify separated style attribute
	this.translateSeparatedAttributePrefix = function translateSeparatedAttributePrefix(_stylePrefix)
	{
		//check style and stylePrefix is correct if not setup and return
		if (typeof _stylePrefix == "string")
		{
			var _ret = [];
			_ret.push(_stylePrefix);
			return _ret;
		}
		else if (typeof _stylePrefix == "array")
		{
			return _stylePrefix;
		}

		//return null as something failed
		return null;
	}

	//Add to separated style attribute
	this.addSeparatedAttribute = function addSeparatedAttribute(_sheet, _selector, _style, _stylePrefix, _commaSeparated, _addOrReplace, _attributeIndexToEdit)
	{
		//setup basic variables
		var _sheet = cCss.styleSheet.translateCssSheet(_sheet);
		var _selector = cCss.styleSheet.translateCssSelector(_selector, _sheet);
		var _styles = cCss.styleSheet.translateCssStyle(_style) || [];
		var _stylePrefix = cCss.styleSheet.translateSeparatedAttributePrefix(_stylePrefix) || [];
		var _attributeIndexToEdit = _attributeIndexToEdit || 0;
	}

	//remove separated style attribute
	this.removeSeparatedAttribute = function removeSeparatedAttribute(_sheet, _selector, _style, _stylePrefix, _commaSeparated, _removeOrErase, _attributeIndexToEdit)
	{
		//setup basic variables
		var _sheet = cCss.styleSheet.translateCssSheet(_sheet);
		var _selector = cCss.styleSheet.translateCssSelector(_selector, _sheet);
		var _styles = cCss.styleSheet.translateCssStyle(_style) || [];
		var _stylePrefix = cCss.styleSheet.translateSeparatedAttributePrefix(_stylePrefix) || [];
		var _attributeIndexToEdit = _attributeIndexToEdit || 0;
	}

}