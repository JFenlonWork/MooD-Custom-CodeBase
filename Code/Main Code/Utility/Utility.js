/*
    Title:
        Utility

    Description:
        Used to assist other classes with non-class specific things
*/

window.cUtility = window.cUtility || new function cUtility()
{
    this.findHTMLObjectsFromClassName = function findHTMLObjectsFromClassName(name)
    {
        var nameParsed = (name.replace(/[.,\/#!$%\^&\*;:{}=_`~() ]/g,"-")).toLowerCase();
        return $("[class*=-" + nameParsed + "]");
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
            if (_htmlObj.length != null)
            {
                $(_htmlObj).each(function() {
                    if (this.getAttribute("onclick"))
                    {
                        //add onto onclick
                        this.setAttribute("onclick", this.getAttribute("onclick") + ";" + _function);
                    }
                    else
                    {
                        //set onclick to be _function
                        this.setAttribute("onclick", _function);
                    }
                });
            }
            else
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
		}
		else
		{
            if (_htmlObj.length != null)
            {
                $(_htmlObj).each(function() {
                    //add onto onclick
                    this.setAttribute("onclick", _function);
                });
            }
            else
            {
                //create on click to be _function
                _htmlObj.setAttribute("onclick", _function);
            }
		}
	}

}