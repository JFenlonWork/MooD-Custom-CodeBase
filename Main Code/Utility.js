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
        var nameParsed = (name.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g,"-")).toLowerCase();
        return $("[class*=" + nameParsed + "]");
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
            return findHTMLObjectsFromName(_element.elementName);
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
				return findHTMLObjectsFromName(_element.elementName).find('[role="' + lowerCaseElementExtra + '"]');
			case "matrix":
				return findHTMLObjectsFromName(_element.elementExtra + "-" + _element.elementName);
			
			//default just incase incorrect typing
			default:
				console.log("Invalid element type for search: " + _element.elementName);
				return null;
				break;
		}
		
		//return search to save on typing
		return $('[' + typePrefix + '="' + lowerCaseElementName + '"]');

    }

}