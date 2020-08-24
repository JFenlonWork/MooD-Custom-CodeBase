/*
	Title:
		Inline Form Expander
	
	Description:
		Modify Inline Forms To Make Them Expandable 
*/
var inlineFormExpander = new inlineFormExpansion();

function inlineFormExpansion()
{

    var allInlineForms = [];

    //store expanded inline form data
    function inlineFormExpansionData(_inlineFormName)
    {
        this.inlineFormName = _inlineFormName;
        this.inlineFormScroller = $(".mood-node-name-" + _inlineFormName).first().find(".scroller").first()[0];
        this.toggled = false;
        this.originalSize = -1;
        this.heightChange = -1;
        this.moved = [];

        this.checkMovedExists = function(_move)
        {
            for (var i = 0; i < this.moved.length; i++)
            {
                if (this.moved[i] == _move)
                {
                    return true;
                }
            }
        }
    }

    //return inline form data from inline form list
    //if it doesn't exist create it 
    this.getInlineForm = function(_inlineFormName)
    {
        for (var i = 0; i < allInlineForms.length; i++)
        {
            if (allInlineForms[i].inlineFormName == _inlineFormName)
            {
                return allInlineForms[i];
            }
        }

        var _inlineForm = new inlineFormExpansionData(_inlineFormName);
        allInlineForms.push(_inlineForm);
        return _inlineForm;
    }

    //toggle inline form exapnded base
    this.toggleInlineFormExpansion = function(_inlineFormName, _toggledStatus)
    {
        var _inlineForm = this.getInlineForm(_inlineFormName);

        if (_toggledStatus)
        {
            _inlineForm.toggled = _toggledStatus;
        }
        else
        {
            _inlineForm.toggled = !_inlineForm.toggled;
        }

        updateInlineForm(_inlineForm);
    }

    //update all css for inline form
    function updateInlineForm(_inlineForm)
    {
        //get the inline form and the scroller
        var _inlineFormHTML = $(".mood-node-name-" + _inlineForm.inlineFormName).first()[0];
        var _inlineFormScroller = $(_inlineFormHTML).find(".scroller").first()[0];

        _inlineForm.inlineFormScroller = _inlineFormScroller;

        //setup animation css for scroller
        _inlineFormScroller.classList.add("inlineFormExpander");

        if (_inlineForm.toggled)
        {
            //get total size of all items inside the inline form
            var totalSize = 0;

            $(_inlineFormHTML).find(".editorContainer").each(function() {
                totalSize += $(this).outerHeight();
            });

            //store sizes of inline form if first time expanded
            if (_inlineForm.originalSize == -1)
            {
                _inlineForm.originalSize = parseInt(_inlineFormScroller.style.height);
                _inlineForm.heightChange = totalSize - _inlineForm.originalSize;
            }

            //set height to be total size
            _inlineFormScroller.style.height = totalSize + "px";

            //move all other html that might've been affected
            moveHTMLToNotOverlap(_inlineForm, _inlineFormScroller);
        }
        else
        {
            if (_inlineForm.originalSize != -1)
            {
                //set height to be total size
                _inlineFormScroller.style.height = _inlineForm.originalSize + "px";

                //move all other html that might've been affected
                moveHTMLToNotOverlap(_inlineForm, _inlineFormScroller);
            }
        }

        //run model master resizing
        if (typeof resizePage != "undefined")
        {
            resizePage();
        }
    }

    //move all HTML objects that might've been affected/overlapped
    function moveHTMLToNotOverlap(_inlineForm, _object, allElements)
    {
        //get page bounds from current _object
        var _inlineBounds = cMaths.Bounds.fromObject(_object, "document", ".scroller");

        //check if this is the inline form running move
        if (!allElements)
        {

            //setup all elements
            var allElements = [];
            var _inlineFormObj = $(".mood-node-name-" + _inlineForm.inlineFormName).first()[0];
            $(".InteractiveModel").children().each(function() {
                //check other object isn't the inline form
                if (this != _inlineFormObj)
                {
                    //check other object isn't the inline form
                    if (this != _inlineFormObj && ($(this).is("div")))
                    {
                        //get bounds for other objects on the page
                        var _bounds = cMaths.Bounds.fromObject(this, false);

                        //check if highest point of other objects on page
                        //are larger than the smallest point of the inline form
                        if (_bounds.y2 > _inlineBounds.y1)
                        {
                            allElements.push(this);
                        }
                    }
                }
            });
            
            //check if the inline form is being expanded
            if (_inlineForm.toggled)
            {
                //reset inline form moved
                _inlineForm.moved = [];

                /*  add height onto bounds as bounds uses
                    getClientBoundsRect() which means
                    the style height won't have been added due to animation
                    bounds can be float values so -2 is there
                    to make sure any rounding doesn't it */
                if ((_inlineBounds.y2 - _inlineBounds.y1) < _inlineForm.heightChange - 2)
                {
                    _inlineBounds = _inlineBounds.add(new cMaths.bounds(0, 0, 0, _inlineForm.heightChange));
                }
            }

        }

        if (_inlineForm.toggled)
        {
            //return all objects from allElements within objects bounds
            var _allWithin = cMaths.collision.returnObjectsIntersectArea(_inlineBounds, allElements);

            for (var i = 0; i < _allWithin.length; i++)
            {
                //check if object has already been moved
                if (!(_inlineForm.checkMovedExists(_allWithin[i])))
                {
                    //skip if child is an image or the shadow of the page
                    if (this == $("img[usemap='#ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0] ||
                        this == $("map[name='ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0] ||
                        this == $(ctl00_ContentPlaceHolder1_InteractiveModel1_shadow)[0])
                    { 
                        return;
                    }

                    //add expanded classList to object
                    _allWithin[i].style.transition = "transform " + parseInt(getComputedStyle(_inlineForm.inlineFormScroller).transitionDuration) + "s ease-in-out";

                    //modify the transform and add object to inline form moved
                    cCSS.transform.modifyTransformVariables(_allWithin[i], "translate", [0, _inlineForm.heightChange]);
                    _inlineForm.moved.push(_allWithin[i]);

                    //remove element from all elements to stop it
                    //getting checked more than once
                    for (var el = 0; el < allElements.length; el++)
                    {
                        if (allElements[el] == _allWithin[i])
                        {
                            allElements.splice(el,1);
                        }
                    }

                    //move all HTML Objects affected by moving _object
                    moveHTMLToNotOverlap(_inlineForm, _allWithin[i], allElements);
                }
            }

        }
        else
        {
            //check if inline form has been expanded before
            if (_inlineForm.originalSize != -1)
            {
                //loop through moved and modify transform position
                for (var i = 0; i < _inlineForm.moved.length; i++)
                {
                    cCSS.transform.modifyTransformVariables(_inlineForm.moved[i], "translate", [0, -_inlineForm.heightChange]);
                }
            }
        }
    }
    
}