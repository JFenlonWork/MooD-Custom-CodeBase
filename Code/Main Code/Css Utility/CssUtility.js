/*
	Title:
		CssUtility
	
	Description:
		Any miscellaneous Css functions
*/

window.cCss = window.cCss || new function customCss() {
	//====DATA TYPES====//
	this.dataTypes = new cCssDataTypes();

	this.CssTransitionData = this.dataTypes.cssTransitionData.prototype;
	this.cssTransitionData = this.dataTypes.cssTransitionData;

	this.StyleModificationData = this.dataTypes.styleModificationData.prototype;
	this.styleModificationData = this.dataTypes.styleModificationData;

	this.StyleSheetModificationData = this.dataTypes.styleSheetModificationData.prototype;
	this.styleSheetModificationData = this.dataTypes.styleSheetModificationData;

	//====FUNCTIONS====//
	this.style = new customCssStyleFunctions();
	this.styleSheet = new customCssstyleSheetFunctions();

	//====RUN-TIME FUNCTIONS====//

}();

function cCssDataTypes() {
	//store CssTransitionData
	this.cssTransitionData = function (_transitionProperty, _transitionDuration,
		_transitionTiming, _transitionDelay, _transitionIndex) {
		this.transitionProperty = _transitionProperty || '';
		this.transitionDuration = _transitionDuration || 0;
		this.transitionTiming = _transitionTiming || "ease";
		this.transitionDelay = _transitionDelay || 0;
		this.transitionIndex = _transitionIndex || 0;
	}

	//store style data
	this.styleModificationData = function styleModificationData(_property, _value, _importance, _propertyIndex) {
		this.property = _property || "";
		this.value = _value || "";
		this.importance = _importance || "";
		this.propertyIndex = _propertyIndex || 0;
	}

	//make value be array to indicate (x,y,z) etc...
	this.styleSheetModificationData = function styleSheetModificationData(_property, _canBeList, _splitType, _value, _propertyIndex, _importance, _delayByFrame) {
		this.property = _property || {
			prop: "",
			cssProp: "",
			insidePropProp: ""
		};
		// this.property = _property || "";
		// this.cssTextProperty = _cssTextProperty || "";
		this.canBeList = _canBeList || false;

		//0 = none, 1 = brackets, 2 = commas
		this.splitType = _splitType || 0;
		this.value = _value == null ? "" : _value;
		this.importance = _importance || false;
		this.propertyIndex = _propertyIndex !== null ? _propertyIndex : -1;
		this.delayByFrame = _delayByFrame || false;
	}

}

//hold all style functions
function customCssStyleFunctions() {
	//add transition onto object
	this.addStyleProperty = function addStyleProperty(_object, _stylePropertyData) {
		if (_stylePropertyData) {
			//remove previous style property of same type
			cCss.style.removeStyleProperty(_object, _stylePropertyData.property);

			//check object style exists
			if (_object) {
				if (_object.style) {
					var _property = _stylePropertyData.property + ": " + _stylePropertyData.value.toString();

					if (_stylePropertyData.importance != "") {
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
	this.removeStyleProperty = function removeStyleProperty(_object, _property) {
		var propertyIndex = cCss.style.getProperty(_object, _property)

		//check transition exists
		if (propertyIndex != null) {
			//store all transition data
			var _properties = _object.style.cssText.split("; ");

			//reset object transition to nothing
			_object.style = '';

			//loop through all transitions
			for (var i = 0; i < _properties.length; i++) {
				var _endString = '; ';

				//check if index is not equal to property being removed
				if (i != propertyIndex) {
					//add object onto end of transition variable
					_object.style.cssText += _properties[i] + _endString;
				}
			}
		}
	}

	//get index of style property
	this.getProperty = function getProperty(_object, _styleProperty) {
		//check object style exists
		if (_object) {
			if (_object.style) {
				//split style up into _allStyle variable
				var _allStyle = _object.style.cssText.split("; ");

				//loop through all style properties and return _styleProperty index
				for (var i = 0; i < _allStyle.length; i++) {
					//substring the property out of the style
					var currentProperty = _allStyle[i].substring(0, _allStyle[i].indexOf(":"));

					if (currentProperty == _styleProperty) {
						return i;
					}
				}
			}
		}

		return -1;
	}

	//get current transform and add onto it
	this.modifyTransformVariables = function modifyTransformVariables(_object, _type, _values, _addOrSet) {
		//check object style exists
		if (_object) {
			if (_object.style) {

				//make sure variables are set
				var _values = _values || [];

				//grab previous transform variables
				var _prevTransformVars = cCss.style.returnTransformVariables(_object, _type);

				//setup transform variables
				var _transform = _prevTransformVars.previous + _type + "(";

				//calculate loop count
				var _transformLoop = _prevTransformVars.values.length;
				if (_prevTransformVars.values.length < _values.length) {
					_transformLoop = _values.length;
				}

				//loop through all transform potential variables
				for (var i = 0; i < _transformLoop; i++) {
					var _transformValue = 0

					//setup tranform variable based
					if (i < _prevTransformVars.values.length) {
						_transformValue = _prevTransformVars.values[i];
					}

					if (i < _values.length) {
						if (_addOrSet) {
							_transformValue += _values[i];
						} else {
							if (_values[i] !== null) {
								_transformValue = _values[i];
							}
						}
					}

					//check if start of transform variable
					if (i == 0) {
						_transform += _transformValue + "px";
					} else {
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
	this.returnTransformVariables = function returnTransformVariables(_object, _type) {
		//store variables
		var _ret = {
			values: [],
			previous: "",
			after: ""
		}

		//check object transform exists
		if (_object) {
			if (_object.style) {
				if (_object.style.transform != '') {
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
					for (var i = 0; i < _transformVars.length; i++) {
						_ret.values.push(parseInt(_transformVars[i]));
					}

					//grab after transform
					_ret.after = _tempTransform.slice(0, _tempTransform.length);
				}
			}
		}

		return _ret;
	}

	//add transition onto object
	this.addTransition = function addTransition(_object, _transitionData) {
		if (_transitionData) {
			//remove previous transition of same type
			cCss.style.removeTransition(_object, _transitionData.transitionProperty);

			//check object transform exists
			if (_object) {
				if (_object.style) {
					if (_object.style.transition != "") {
						//add transition onto end of transitions
						_object.style.transitionProperty += ", " + _transitionData.transitionProperty;
						_object.style.transitionDuration += ", " + _transitionData.transitionDuration;
						_object.style.transitionTimingFunction += ", " + _transitionData.transitionTiming;
						_object.style.transitionDelay += ", " + _transitionData.transitionDelay;
					} else {
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
	this.removeTransition = function removeTransition(_object, _transitionType) {
		var transIndex = cCss.style.getTransition(_object, _transitionType)

		//check transition exists
		if (transIndex != null) {
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
			for (var i = 0; i < _transitionProperty.length; i++) {
				var _endString = ', ';

				//check if index is end index
				if (i == _transitionProperty.length) {
					_endString = '';
				}

				//check if index is not equal to transition being removed
				if (i != transIndex.transitionIndex) {
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
	this.getTransition = function getTransition(_object, _transitionType) {
		//check object transform exists
		if (_object) {
			if (_object.style) {
				if (_object.style.transition != '') {
					//split all transitions up into _allTrans variable
					var _allTrans = _object.style.transitionProperty.split(",");

					//loop through all transitions and return _transitionType
					for (var i = 0; i < _allTrans.length; i++) {
						if (_allTrans[i] == _transitionType) {
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

//hold all style sheet functions
function customCssstyleSheetFunctions() {
	//create a new style and stylesheet or return an existing one
	this.addCssSheet = function addCssSheet(_sheet) {
		var _styleSheet = cCss.styleSheet.translateCssSheet(_sheet);

		if (_styleSheet != null) {
			return _styleSheet;
		} else {
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
	this.removeCssSheet = function removeCssSheet(_sheet) {
		//find the sheet with _sheet
		var _styleSheet = cCss.styleSheet.translateCssSheet(_sheet);

		//check the sheet exists
		if (_styleSheet) {
			//remove the sheet element
			$(_styleSheet.ownerNode).remove();

			//return true as sheet has been deleted
			return true;
		}

		//return false as sheet doesn't exist
		return false;
	}

	//return Style Sheet based on _sheet type
	this.translateCssSheet = function translateCssSheet(_sheet, _createOnFail) {
		//check if _sheet is Sheet Name
		if (typeof _sheet === "string") {
			//check if sheet exists	
			var _found = cCss.styleSheet.getCssSheet(_sheet);

			//if sheet doesn't exist and create on fail is true
			//create the sheet
			if (_createOnFail && _found == null) {
				_found = cCss.styleSheet.addCssSheet(_sheet);
			}

			//return the Style Sheet
			return _found
		}
		//check if _sheet is a HTML Object with a Style Sheet
		else if (_sheet.sheet) {
			//return the Style SHeet
			return _sheet.sheet;
		}
		//check if _sheet is a Style Sheet
		else if (_sheet.cssRules) {
			//return _sheet as it is a Style Sheet
			return _sheet;
		}

		//return null because something failed
		return null;
	}

	//return the style with _sheet
	this.getCssSheet = function getCssSheet(_sheet) {
		//search for all styles with id "_sheet"
		var _styleSheets = $("style[id=" + _sheet + "]");

		//check styles exist
		if (_styleSheets.length != 0) {
			//loop through all avaialble sheets
			for (var s = 0; s < _styleSheets.length; s++) {
				//check the sheet exists
				if (_styleSheets[s].sheet != null) {
					//return the first sheet available
					return _styleSheets[s].sheet;
				}
			}
		}

		//return null because no sheet exists
		return null;
	}

	//return the first style sheet with an instance of _selector
	this.findCssSheetWithSelector = function findCssSheetWithSelector(_selector) {
		var _foundSelector = cCss.styleSheet.findCssSelector(_selector);

		//return _foundSelector Style Sheet
		if (_foundSelector) {
			return _foundSelector.parentStyleSheet;
		}

		//return null because no sheet exists
		return null;
	}

	//add Css Selector To Style Sheet
	this.addCssSelector = function addCssSelector(_sheet, _selector) {
		//find style sheet and selector
		var _styleSheet = cCss.styleSheet.addCssSheet(_sheet);
		var _media = typeof _styleSheet.media;
		var _selectorExists = cCss.styleSheet.getCssSelector(_styleSheet, _selector);

		//if selector doesn't exist then create it
		if (_selectorExists == null) {
			if (_media == "string") {
				//add _selector rule into the style sheet
				_styleSheet.addRule(_selector, "");
				return cCss.styleSheet.getCssSelector(_styleSheet, _selector);
			} else if (_media == "object") {
				//setup style sheet rule index for
				//browser (IE8...) compatability
				var _styleSheetLength = 0;

				if (_styleSheet.cssRules) {
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
	this.removeCssSelector = function removeCssSelector(_sheet, _selector) {
		//get the index of _selector in _sheet's rules
		var _index = cCss.styleSheet.getCssSelectorIndex(_sheet, _selector);

		//check index exists
		if (_index != null) {
			//return rule at index
			_sheet.rules.splice(_index, 1);

			//return true as _selector has been removed
			return true;
		}

		//return false as _selector doesn't exist
		return false;
	}

	//return Style Sheet based on _sheet type
	this.translateCssSelector = function translateCssSelector(_selector, _createOnFailSheet) {
		//check if _selector is a CSS Style Rule
		if (_selector.selectorText) {
			//return the selector
			return _selector;
		}
		//check if _selector is Selector Name
		else if (typeof _selector === "string") {
			//check if _selector exists
			var _found = cCss.styleSheet.findCssSelector(_selector);

			//if _selector doesn't exist and create on fail sheet exists
			//then create the sheet
			if (_createOnFailSheet && _found == null) {
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
	this.findCssSelector = function findCssSelector(_selector) {
		//store current style sheets
		var _sheets = document.styleSheets;

		//loop through all Style Sheets
		//and return the first instance of _selector
		for (var s = 0; s < _sheets.length; s++) {
			//try to find the selector on current style sheet
			var _foundSelector = cCss.styleSheet.getCssSelector(_sheets[s], _selector);

			//if selector was found then return selector
			if (_foundSelector) {
				return _foundSelector;
			}
		}

		//return null because no selector exists
		return null;
	}

	//return selector rule
	this.getCssSelector = function getCssSelector(_sheet, _selector) {
		//get the index of _selector in _sheet's rules
		var _index = cCss.styleSheet.getCssSelectorIndex(_sheet, _selector);

		//check index exists
		if (_index != null) {
			//return rule at index
			return _sheet.rules[_index];
		}

		//return null if selector doesn't exist
		return null;
	}

	//return selector rule index
	this.getCssSelectorIndex = function getCssSelectorIndex(_sheet, _selector) {
		//loop through all style sheet rules
		for (var r = 0; r < _sheet.rules.length; r++) {

			//return the current sheet at index
			if (_sheet.rules[r].selectorText &&
				_sheet.rules[r].selectorText.toLowerCase() == _selector.toLowerCase()) {
				return r;
			}
		}
	}

	/**
	 * return the property/values within a style 
	 * 
	 * Return Types:
	 * 
	 * 0 -> return all
	 * 
	 * 1 -> return if not the same style
	 * 
	 * 2 -> return if the same style 
	 * 
	 * 3 -> do not create style string or store index
	 */
	this.getCssStyle = function getCssStyle(_style, _styleData, _returnType) {
		var _properties = [];
		var _values = [];
		var _styleProperty = _style[_styleData.property.prop] || "";

		//split by 1 == "example(...) example2(...)"
		if (_styleData.splitType === 1) {
			_properties = _styleProperty.split(/(?=\().*?(?=\)).*?(?=[a-z]|$)/gi)
				.filter(
					function (value, index, arr) {
						return value !== "";
					}
				);

			_values = _styleProperty.split(/(?=(^|\))).*?(?=\()/gi)
				.filter(
					function (_value, index, arr) {
						return _value !== "" && _value !== ")";
					}
				);

			_values.forEach(function (_value, _index, _array) {
				if (_value && _value.charAt(_value.length - 1) !== ")") {
					_array[_index] = _value + ")";
				}
			});
		}
		//split by 2 == test 1s ease-in-out, test2 1s ease-in-out
		else if (_styleData.splitType === 2) {
			_styleProperty.split(", ").forEach(function (prop) {
				var _prop = prop.split(" ")[0];
				_properties.push(_prop);
			});

			_styleProperty.split(", ").forEach(function (value) {
				var _value = value.split(" ");
				_value[0] = "";
				_values.push(_value.join(" "));
			});
		} else {
			return {
				properties: [_styleData.property.prop],
				values: [_styleProperty],
				_returnTypeIndex: -1,
				returnTypeNewCss: ""
			}
		}

		var _combinedStyleText = "";
		var _returnTypeIndex = -1;
		var _propertyToTest = _styleData.property.insidePropProp === null ? _styleData.property.prop : _styleData.property.insidePropProp;

		_properties.forEach(function (_currentProperty, _index) {
			if (_currentProperty && _currentProperty !== "" && _currentProperty !== " ") {
				if (_currentProperty !== _propertyToTest) {
					if (_returnType === 0 || _returnType === 1) {
						_combinedStyleText += (_combinedStyleText == "" ? "" : ", ") + _currentProperty + _values[_index];
					}
				} else {
					_returnTypeIndex = _index;
					if (_returnType === 0 || _returnType === 2) {
						_combinedStyleText += (_combinedStyleText == "" ? "" : ", ") + _currentProperty + _values[_index];
					}
				}
			}
		});

		return {
			properties: _properties,
			values: _values,
			returnTypeIndex: _returnTypeIndex,
			returnTypeNewCss: _combinedStyleText
		};

	}

	this.replaceCssStyle = function replaceCssStyle(_sheet, _selector, _styleData) {
		//setup basic variables
		var _sheet = cCss.styleSheet.translateCssSheet(_sheet, true);
		var _selector = cCss.styleSheet.translateCssSelector(_selector, _sheet);
		var _style = _selector.style;

		var setProp = function setProp() {
			if (_styleData.property.prop) {
				var _styleParsedData = cCss.styleSheet.getCssStyle(_style, _styleData, 1)

				var _valueToSet = "";

				if (_styleData.propertyIndex === -1) {
					if (_styleData.splitType === 1) {
						_valueToSet = _styleParsedData.returnTypeNewCss + " " + _styleData.property.insidePropProp + "(" + _styleData.value + ")";
					} else if (_styleData.splitType === 2) {
						_valueToSet = _styleParsedData.returnTypeNewCss + (_styleParsedData.returnTypeNewCss == "" ? "" : ", ") + _styleData.property.insidePropProp + " " + _styleData.value;
					} else {
						//replace entire property value
						_valueToSet = _styleParsedData.returnTypeNewCss + _styleData.value;
					}
				} else if (_styleParsedData.returnTypeIndex !== -1) {
					//replace value at index of property
					var _valueSplit = "";
					if (_styleData.splitType === 1) {
						_valueSplit = _styleParsedData.values[_styleParsedData.returnTypeIndex].substring(1, _styleParsedData.values[_styleParsedData.returnTypeIndex].length - 1).split(",");
					} else {
						_valueSplit = _styleParsedData.values[_styleParsedData.returnTypeIndex].split(" ").filter(function (_value) {
							return _value !== "";
						});
					}

					if (_valueSplit.length >= _styleData.propertyIndex && _valueSplit.length != 0 && _styleData.propertyIndex >= 0) {
						_valueSplit[_styleData.propertyIndex] = _styleData.value;

						if (_styleData.splitType == 1) {
							_valueToSet = _styleParsedData.returnTypeNewCss + _styleParsedData.properties[_styleParsedData.returnTypeIndex] + "(" + _valueSplit.join(",") + ")";
						} else {
							_valueToSet = _styleParsedData.returnTypeNewCss + _styleParsedData.properties[_styleParsedData.returnTypeIndex] + " " + _valueSplit.join(" ");
						}
					} else {
						return false;
					}
				} else {
					if (_styleData.property.cssProp) {
						if (_styleData.splitType == 1) {
							_valueToSet = _styleParsedData.returnTypeNewCss + _styleData.property.cssProp + "(" + _styleData.value + ")";
						} else if (_styleData.split == 2) {
							_valueToSet = _styleParsedData.returnTypeNewCss + _styleData.property.cssProp + " " + _styleData.value;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}

				//set the actual property of the style
				if (_style.setProperty != null) {
					_style.removeProperty(_styleData.property.cssProp);
					_style.setProperty(_styleData.property.cssProp, _valueToSet);
				} else {
					_style[_styleData.property.prop] = _valueToSet;
				}

				//add importance to the property
				if (_styleData.importance !== null) {

					var _regexWithoutNewStyle = "(^|.)(" + _styleData.property.cssProp + (_styleData.canBeList === true ? ").*?(?=;)." : ")(?=:).*?(?=;).");
					var _regexWithStyle = "(^|;).*?(?=(" + _styleData.property.cssProp + (_styleData.canBeList === true ? "|$))" : "(?=:)|$))");

					var _cssWithoutStyleChange = _style.cssText.replace(new RegExp(_regexWithoutNewStyle, "gi"), "");
					var _cssOnlyStyleChange = _style.cssText.replace(new RegExp(_regexWithStyle, "gi"), "");

					//Remove !important if it still exists
					_cssOnlyStyleChange = _cssOnlyStyleChange.replace(" !important", "");

					_style.cssText = _cssWithoutStyleChange + " " + _cssOnlyStyleChange + " " + (_styleData.importance === true ? " !important;" : ";");

				}
				return true;
			}
			return false;
		}

		//delay to allow redraw of DOM Object
		if (_styleData.delayByFrame) {
			return setTimeout(function () {
				return setProp();
			}, 100);
		} else {
			return setProp();
		}
	}

}