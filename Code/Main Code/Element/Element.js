/*
	Title:
		Elements
	
	Description:
		Attempt at making an array to hold elements dynamcally
*/

window.cElement = window.cElement || new function cElement()
{

    //===LOCAL VARIABLES===//
    this.uniqueID = 10000;
    this.elementArray = [];

    //====DATA TYPES====//
    this.dataTypes = new cElementDataTypes();
    
    //holds basic message information that is used by the event listener
    this.Element = this.dataTypes.element.prototype;
    this.element = this.dataTypes.element;

    //====FUNCTIONS====//
    this.setup = new cElementSetupFunctions();
    this.generic = new cElementGenericFunctions();
    this.search = new cElementSearchFunctions();
    this.modify = new cElementModifyFunctions();

    //===RUN-TIME FUNCTIONS===//
    (function setupElementListenerCreation()
    {
        
        //check if cEventListener has been defined
        if (typeof cEventListener !== 'undefined')
        {
            //add element setup to "EventListenerCreation" 
            cEventListener.generic.addFunctionToWaitingForMessage("afterEventListenerCreation",
                { 
                    setupFunction : 
                        function () 
                        {
                            //call any functions listening to "afterElementSetup"
                            new cTimer.timer("Element Wait For Message",
                                                new cTimer.callback(
                                                    function ()
                                                    { 
                                                        cEventListener.queue.invokeMessageQueue("afterElementSetup");
                                                    })
                                                , 100, 10);
                        }
                }
            );
            
            //add element registration to event listeners
            cEventListener.generic.addRegistrationFunction("element",
                { 
                    getRegisterQueueType : 
                        function (_data) 
                        {
                            return window.cElement.search.getElementID(_data.message).eventListener;
                        }  
                }
            );
        }
        else
        {
            //retry in 10ms if undefined
            setTimeout(function() { setupElementListenerCreation(); }, 10);
        }
        
    })();
    
}

function cElementDataTypes()
{
    this.element = function element(_elementObject, _moodObject, _elementParentObject, _ID, _enabledByDefault)
    {
        this.elementObject = _elementObject;
        this.elementParentObject = _elementParentObject || (_moodObject === true ? $(_elementObject).closest(".WebPanelOverlay")[0] : this.elementObject);
        this.ID = _ID || cElement.uniqueID;
        this.elementEnabled = (_enabledByDefault != null ? _enabledByDefault : true);
        
        if (_ID == cElement.uniqueID)
        {
            cElement.uniqueID++;
        }
    
        this.eventListener = new cEventListener.listener();

        //store a link to this current element for functions below
        var currentElement = this;

        this.enable = function()
        {
            window.cElement.modify.toggleElement(_ID, new cEventListener.basicMessage(null, true), null);
        }

        this.disable = function()
        {
            window.cElement.modify.toggleElement(_ID, new cEventListener.basicMessage(null, false), null);
        }
        
        this.eventListener.messagesListeningTo.push(
            new cEventListener.basicMessage('listenToToggleElementToEnableStatus', 
            { 
                receiveMessage : function (_data) 
                {
                    cElement.modify.toggleElement(currentElement.ID,
                                                    _data.message,
                                                    _data.senderListener.message.message
                                                );
                }
            }
            )
        );

        this.eventListener.messagesListeningTo.push(
            new cEventListener.basicMessage('listenToToggleElementToDisableStatus', 
            { 
                receiveMessage : function (_data) 
                {
                    cElement.modify.toggleElement(currentElement.ID,
                                                    _data.message,
                                                    _data.senderListener.message.message
                                                );
                }
            }
            )
        );
    }
}

function cElementSetupFunctions()
{
    this.createElement = function createElement(_elementData)
    {
        //check if element info actually has anything in it
        if (_elementData)
        {
            //create element
            cElement.generic.addElement(_elementData.elementObject, _elementData.isMoodObject, _elementData.elementParentObject, _elementData.id, _elementData.enabledByDefault);

            if (_elementData.onClick) {
                cElement.modify.addOnClickToElement(_elementData.id, _elementData.onClick, true, _elementData.css);
            }

            //modify original id to increase to shorten creation code
            _elementData.id++;
        }
        else
        {
            console.warn("Warning: HTML/JS is empty, if not adding elements ignore this");
        }
    }
}

function cElementGenericFunctions()
{
    this.addElement = function addElement(_elementObject, _moodObject, _elementParentObject, _ID, _enabledByDefault)
    {
        var _ID = _ID || cElement.uniqueID;

        var exists = cElement.search.checkElementExists(_elementObject);
        if (exists == -1)
        {
            //setup the element
            var _customElement = new cElement.element(_elementObject, _moodObject, _elementParentObject, parseInt(_ID), _enabledByDefault);

            //add the element to the array
            cElement.elementArray.push(_customElement);

            var _styleData = new cCss.styleSheetModificationData({
                prop: "zIndex",
                cssProp: "z-index"
            }, false, null, "unset", -1, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _ID, _styleData);

            $(_customElement.elementParentObject).addClass("Element" + _ID);

            //return the newly created element
            console.log("Created Element with object: " + _elementObject);
            return _customElement;
        }

        //return the element that already exists
        console.log("Element with id: "+ _ID + " Exists");
        return cElement.elementArray[exists];
    }

    this.removeElement = function removeElement(_elementName, _elementExtra, _elementType)
    {
        //check if the element exists in the array and where
        var exists = cElement.search.checkElementExists(_elementName, _elementExtra, _elementType)
        if (exists != -1)
        {
            //if the element exists remove it and return true
            var currentElement = cElement.elementArray[exists];

            //loop through all listeners attached to element and remove them
            while (currentElement.listener.length > 0)
            {
                cEventListener.generic.deregisterListener(currentElement, currentElement.listeners[0].listener, currentElement.listener[0].listenerType, currentElement.listener[0].listenerExtra);
            }

            //loop through all things the element is listening too and remove them
            while (currentElement.listeningTo.length > 0)
            {
                cEventListener.generic.deregisterListener(currentElement.listeningTo[0].listener, currentElement, currentElement.listeningTo[0].listenerType, currentElement.listeningTo[0].listenerExtra)
            }

            //remove the element from the element array and return true
            cElement.elementArray.splice(exists,1);
            return true;
        }

        //return false because element doesn't exist
        console.log("Element with name: " + _elementName + " Doesn't Exist");
        return false;
    }
}

function cElementSearchFunctions()
{

    //return the element associated with a listener
    this.returnElementListener = function returnElementListener(_listener)
    {
        //check type of input and return based on that
        if (typeof _listener.message == "string" || typeof _listener.messages == "number")
        {
            //find the element from an ID
            var _element = cElement.search.getElementID(_listener.message);

            //check if element exists, if so return the listener
            if (_element)
            {
                return _element.eventListener;
            }
        }
        else if (_listener.message instanceof cElement.element)
        {
            return _listener.message.eventListener;
        }

        return null;
    }

    //check element exists and return the index
    this.checkElementExists = function checkElementExists(_elementObject)
    {
        if (_elementObject == null) return -1;
        for (var i = 0; i < cElement.elementArray.length; i++)
        {
            //check if the names and role match
            if (cElement.elementArray[i].elementObject == _elementObject)
            {
                //return the position in the array
                return i;
            }
        }

        //return -1 if not found
        return -1;
    }

    //search for and return the elements with _elementName
    this.getElementByName = function getElementByName(_elementName)
    {
        //store elements
        var ret = [];

        //loop through every element in the array
        cElement.elementArray.forEach(function (_element, _index, _arr)
        {
            if (_element.elementName == _elementName)
            {
                ret.push(_arr[_index]);
            }
        });

        if (ret.length <= 0)
        {
            //return null if not found
            console.log("Element with name: " + _elementName + " Doesn't exist");
        }

        return ret;
    }

    //return the element with _ID
    this.getElementID = function getElementID(_ID)
    {
        //loop through every element in the array
        var _ret = null;
        cElement.elementArray.forEach(function (_element, _index, _arr)
        {
            if (_element.ID == _ID) { return _ret = _arr[_index]; }
        });

        if (_ret)
        {
            return _ret;
        }

        //return null if not found
        console.log("Element with ID: " + _ID + " Doesn't Exists");
        return null;
    }

    //return the listener 
    this.getElementByListener = function getElementByListener(_listener)
    {
        //loop through every element in the array
        var _ret = null;
        cElement.elementArray.forEach(function (_element, _index, _arr)
        {
            if (_element.eventListener.ID == _listener.ID) { return _ret = _arr[_index]; }
        });

        if (_ret)
        {
            return _ret;
        }
        //return null if not found
        console.log("Element with listener: " + _listener + " Doesn't Exist");
        return null;
    }

}

function cElementModifyFunctions()
{
    this.toggleElement = function toggleElement(_elementID, _enabled, _messageData) 
    {	
        var _element = cElement.search.getElementID(_elementID);
    
        var _messageData = _messageData || {};
    
        //check if element isn't null
        if (_element) 
        {
            //find HTML object attached to element
            //var htmlObject = _element.elementObject;

            if (_element.elementObject) 
            {
                //turn message enable/disable into bool
                var _toEnable = (_enabled.message === "enable" || _enabled.message === true);
        
                //modify the element's extras I.E position and zIndex
                cElement.modify.modifyElementOpacity(_element, _messageData, _toEnable);
                cElement.modify.modifyElementPosition(_element, _messageData);

                //check if the element now has a different active status and modify
                if (_enabled.message == "enable" && !_element.elementEnabled || 
                    _enabled.message == "disable" && _element.elementEnabled)
                {
                    //update listenerToElementEnabledChange and set element to be opposite
                    cEventListener.message.sendMessageToType(_element.eventListener, new cEventListener.basicMessage("listenToElementEnableChange", _enabled.message));
                    _element.elementEnabled = !_element.elementEnabled;						
                }

                return true;
            }
            
            //log warning fail and return false
            console.warn("Warning: No HTML Element Found With Name: " + _element.elementName + " Check HTML is correct, This usually happens when an object doesn't exist but is still being refenced");
            return false;
        }
            
        //log warning fail and return false
        console.warn("Warning: No Element Found Check HTML is correct");
        return false;
    }

    this.modifyElementOpacity = function modifyElementOpacity(_element, _messageData, _enabled)
    {
        if (_messageData.opacityTime)
        {
            var _transitionData = "opacity " + ((_messageData.opacityTime || 0) / 1000).toString() + "s";
            _transitionData += " " + (_messageData.opacityTiming || "linear");
            _transitionData += " " + ((_messageData.opacityDelay || 0) / 1000).toString() + "s";
                  
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "opacity"
            }, true, 2, _transitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        }
        else
        {
            var _transitionData = "opacity 0s linear 0s";    
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "opacity"
            }, true, 2, _transitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        }

        if (_enabled)
        {
            var _zIndexToSet = (_messageData.zIndex == null ? "10000" : _messageData.zIndex);
            var _zIndexImportanceToSet = (_messageData.zIndexImportance == null  ? true : _messageData.zIndexImportance);
            var _styleData = new cCss.styleSheetModificationData({
                prop: "zIndex",
                cssProp: "z-index" 
             }, false, null, _zIndexToSet, -1, _zIndexImportanceToSet);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);    

            //change html style to be visiblie and set zIndex to default
            var _opacityToSet = _messageData.opacity == null ? 100 : _messageData.opacity;
            _styleData = new cCss.styleSheetModificationData({
               prop: "opacity",
               cssProp: "opacity" 
            }, false, null, _opacityToSet.toString(), -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "visibility",
                cssProp: "visibility" 
             }, false, null, "visible", -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            var _opacityTimer = cTimer.generic.findTimerByName("ElementOpacityTimer" + _element.ID);

            if (_opacityTimer)
            {
                _opacityTimer.destroy();
            }
        }
        else
        {
            //change html style to be visiblie and set zIndex to default
            var _opacityToSet = _messageData.opacity == null ? 0 : _messageData.opacity;
            var _styleData = new cCss.styleSheetModificationData({
                prop: "opacity",
                cssProp: "opacity" 
             }, false, null, _opacityToSet.toString(), -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
            
            if (_element.elementEnabled == true && _enabled == false)
            {
                var currentDelay = (_messageData.opacityTime || 0) + (_messageData.opacityDelay || 0);

                function opacityChange(_args)
                {
                    _styleData = new cCss.styleSheetModificationData({
                        prop: "visibility",
                        cssProp: "visibility" 
                     }, false, null, "hidden", -1, false);
                    cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);            
                            
                    var _zIndexToSet = (_messageData.zIndex == null ? "0" : _messageData.zIndex);
                    var _zIndexImportanceToSet = (_messageData.zIndexImportance == null ? true : _messageData.zIndexImportance);
                    _styleData = new cCss.styleSheetModificationData({
                        prop: "zIndex",
                        cssProp: "z-index" 
                     }, false, null, _zIndexToSet, -1, _zIndexImportanceToSet);
                    cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
                }
                
                new cTimer.realtimeTimer("ElementOpacityTimer" + _element.ID, new cTimer.callback(opacityChange, this), true, currentDelay + 1, true);
            }
            else
            {
                _styleData = new cCss.styleSheetModificationData({
                    prop: "visibility",
                    cssProp: "visibility" 
                 }, false, null, "hidden", -1, false);
                cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);            
                        
                var _zIndexToSet = (_messageData.zIndex == null ? "0" : _messageData.zIndex);
                var _zIndexImportanceToSet = (_messageData.zIndexImportance == null ? true : _messageData.zIndexImportance);
                _styleData = new cCss.styleSheetModificationData({
                    prop: "zIndex",
                    cssProp: "z-index" 
                 }, false, null, _zIndexToSet, -1, _zIndexImportanceToSet);
                cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
            }
        }
    }

    this.modifyElementPosition = function modifyElementPosition(_element, _messageData)
    {
        //setup position variables
        var _posX = _messageData.posX != null ? _messageData.posX : typeof _messageData.generatePosX == "function" ? _messageData.generatePosX() : null;
        var _posY = _messageData.posY != null ? _messageData.posY : typeof _messageData.generatePosY == "function" ? _messageData.generatePosY() : null;

        var _transitionData = ((_messageData.positionMoveTime || 0) / 1000).toString() + "s"
                                + " " + (_messageData.positionTiming || "linear") + " "
                                + ((_messageData.positionDelay || 0) / 1000).toString() + "s";

        if (_posX) 
        {
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "left" 
             }, true, 2, _transitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "left",
                cssProp: "left" 
             }, false, 0, _posX + "px", -1, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        }

        if (_posY) 
        {
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "top"
             }, true, 2, _transitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "top",
                cssProp: "top" 
             }, false, 0, _posY + "px", -1, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        }
    }

    //add onClick to element's html
    this.addOnClickToElement = function addOnClickToElement(_elementID, _function, _addOrCreate, _css)
	{
		var _css = _css || null;
		//find all html objects from ID
        var elementObj = cElement.search.getElementID(_elementID)
		
		if (elementObj)
		{
            if (elementObj.elementObject == null) { console.error("No HTML supplied for: " + _elementID); return; };
			//add onto onclick
			cUtility.addOnClickToHTML(elementObj.elementObject, _function, _addOrCreate);
        
            if (_css)
			{
				//Add css based on button
				elementObj.elementObject.classList.add(_css);
			}
        }
	}
}