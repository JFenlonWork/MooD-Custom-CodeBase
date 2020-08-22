/*
	Title:
		CssUtility
	
	Description:
		Any miscellaneous css functions
*/

window.cCss = window.cCss || new function customCSS()
{
	//====DATA TYPES====//
	this.dataTypes = new cCssDataTypes();

	this.CssTransitionData = this.dataTypes.cssTransitionData.prototype;
	this.cssTransitionData = this.dataTypes.cssTransitionData;

	this.StyleModificationData = this.dataTypes.styleModificationData.prototype;
	this.styleModificationData = this.dataTypes.styleModificationData;
	
	//====FUNCTIONS====//
	this.transform = new customCssTransformFunctions();
	this.transition = new customCssTransitionFunctions();
	this.style = new customCssStyleFunctions();

}

function cCssDataTypes()
{
	//store cssTransitionData
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