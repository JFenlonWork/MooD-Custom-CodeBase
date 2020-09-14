/*
    Title:
        Utility

    Description:
        Used to assist other classes with non-class specific things
*/

window.cUtility = window.cUtility || new function cUtility()
{
    this.findHTMLObjectsFromName = function findHTMLObjectsFromName(name)
    {
        var nameParsed = (name.replace(/[.,\/#!$%\^&\*;:{}=_`~() ]/g,"-")).toLowerCase();
        return $("[class*=-" + nameParsed + "]");
    }

    this.findHTMLObjects = function findHTMLObjects(_element)
    {
        //log error if element doesn't exist
        if (!_element)
        {
            console.warn("Warning: Trying To Access Element That Doesn't exist"); 
            return null;
        }

        //force values if null/undefined
        if (!_element.elementName)
        {
            console.warn("Warning: No Name Provided To Element, Check HTML");
            return null;
        }
        
        //force values if element type is null/undefined
        if (!_element.elementType)
        {
            _element.elementType = '';
        }

        //check if element is a generic mood element with no extra checks/filters needed
        if (_element.elementType == '')
        {
            //return the mood element
            return window.cUtility.findHTMLObjectsFromName(_element.elementName);
        }
        
        //force values if element type is null/undefined
        if (!_element.elementExtra)
        {
            _element.elementExtra = '';
        }

        //Any extra type of search methods

        //setup type to save on typing
		var typePrefix = "";
		
		//most of mood objects are in lower case text
		//so convert element details into lower case 
		var lowerCaseElementName = (_element.elementName).toLowerCase();
		var lowerCaseElementType = (_element.elementType).toLowerCase();
		var lowerCaseElementExtra = (_element.elementExtra).toLowerCase();
		
		//switch through element type and choose
		//appropriate search terms to find element
		switch(lowerCaseElementType)
		{
			case "tab-button":
				return $('[id="' + _element.elementName + '"]');
			case "mood-button":
				return $('[aria-label="' + _element.elementName + '"]');
			case "generic-id":
				typePrefix = "id";
				break;
			case "text-box":
				return $('img[id="' + _element.elementName + '"]').parent();
			case "role":
				return window.cUtility.findHTMLObjectsFromName(_element.elementName).find('[role="' + lowerCaseElementExtra + '"]');
			case "matrix":
				return window.cUtility.findHTMLObjectsFromName(_element.elementExtra + "-" + _element.elementName);
			
			//default just incase incorrect typing
			default:
				console.log("Invalid element type for search: " + _element.elementName);
				break;
		}
		
		//return search to save on typing
		return $('[' + typePrefix + '="' + lowerCaseElementName + '"]');

    }

    this.compareMooDValue = function compareMooDValue(_toCheckElement, _toCheckJQuery, _toCheckValue, _compareValue)
    {
        //setup basic variables
        var _toCheckJQuery = _toCheckJQuery || "";
        var _toCheckHTML;

        //find the html that is supposed to be checked
        if (_toCheckJQuery && _toCheckJQuery != "")
        {
            _toCheckHTML = window.cUtility.findHTMLObjects(_toCheckElement).find(_toCheckJQuery);
        }
        else
        {
            _toCheckHTML = window.cUtility.findHTMLObjects(_toCheckElement);
        }
        
        //loop through all results found
        for (var h = 0; h < _toCheckHTML.length; h++)
        {
            //check if value to check exists
            if (_toCheckValue && _toCheckHTML[h][_toCheckValue])
            {
                //compare value to compare value
                if (_toCheckHTML[h][_toCheckValue] == _compareValue)
                {
                    //return true if compared
                    return true;
                }
            }
        }

        //return false because compare failed
        return false;
    }

    //add onClick to HTML
    this.addOnClickToHTML = function addOnClickToHTML(_htmlObj, _function, _addOrCreate)
	{
		//add onto onclick
		if (_addOrCreate)
		{
			//check if onclick exists and is add
			if (_htmlObj.getAttribute("onclick"))
			{
				//add onto onclick
				_htmlObj.setAttribute("onclick", _htmlObj.getAttribute("onclick") + ";" + _function);
			}
			else
			{
				//set onclick to be _function
				_htmlObj.setAttribute("onclick", _function);
			}
		}
		else
		{
			//create on click to be _function
			_htmlObj.setAttribute("onclick", _function);
		}
	}

}