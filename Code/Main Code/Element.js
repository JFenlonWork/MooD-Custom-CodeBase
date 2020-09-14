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
                            window.cElement.setup.elementSetup();
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
    this.element = function element(_elementName, _elementExtra, _elementType, _ID)
    {
        this.elementName = _elementName;
        this.elementExtra = _elementExtra || '';
        this.elementType = _elementType || '';
        this.ID = _ID || cElement.uniqueID;
        this.elementEnabled = false;
        
        if (_ID == cElement.uniqueID)
        {
            cElement.uniqueID++;
        }
    
        this.eventListener = new cEventListener.listener();

        //store a link to this current element for functions below
        var currentElement = this;
        
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
            cElement.generic.addElement(_elementData.name, _elementData.extra, _elementData.type, _elementData.id);

            //modify original id to increase to shorten creation code
            _elementData.id;
        }
        else
        {
            console.warn("Warning: HTML/JS is empty, if not adding elements ignore this");
        }
    }

    this.elementSetup = function elementSetup()
    {
        
        //call any functions listening to "beforeElementSetup"
        cEventListener.queue.invokeMessageQueue("beforeElementSetup");
            
        //find main custom div
        var divHeaders = $('[title="CustomTab"]');
            
        //setup elements and elementGroups from main divs
        for (var i = 0; i < divHeaders.length; i++)
        {
            //force z-Index to be unset so it doesn't ruin children z-Index
            var a = $(divHeaders[i]).closest(".mood-node-name-generic-xhtml")[0].style.zIndex = "unset";
            
            //find all elements on header
            var headerElementString = divHeaders[i].getAttribute( "elementSetup" );
            
            //check elementSetup exists
            if (headerElementString)
            {
                //Split header string into header elements
                var headerElements = headerElementString.split("\n");
                
                //loop through all elements on header
                for (var elementIndex = 0; elementIndex < headerElements.length; elementIndex++)
                {
                    //parse html data
                    var elementInfo = cEventListener.generic.parseCustomHTMLData(headerElements[elementIndex]);
                    
                    //check if element info actually has anything in it
                    if (elementInfo[0])
                    {
                        //create element
                        var _elementData = {
                            name : elementInfo[0],
                            extra : elementInfo[1],
                            type : elementInfo[2],
                            id : elementInfo[3]
                        }
    
                        cElement.generic.createElement(_elementData);
                    }
                }
            }
        }
            
        //call any functions listening to "afterElementSetup"
        cEventListener.queue.invokeMessageQueue("afterElementSetup");    
    }
}

function cElementGenericFunctions()
{
    this.addElement = function addElement(_elementName, _elementExtra, _elementType, _ID)
    {
        var _ID = _ID || cElement.uniqueID;

        var exists = cElement.search.checkElementExists(_elementName, _elementExtra, _elementType);
        if (exists == -1)
        {
            //setup the element
            var _customElement = new cElement.element(_elementName, _elementExtra, _elementType, parseInt(_ID));

            //add the element to the array
            cElement.elementArray.push(_customElement);

            var removeZIndex = cUtility.findHTMLObjects(_customElement);

            for (var obj = 0; obj < removeZIndex.length; obj++)
            {
                cCss.style.addStyleProperty($(
                    removeZIndex[obj]).closest(".WebPanelOverlay")[0],
                    new cCss.styleModificationData("z-index", "unset")
                );
            }

            //return the newly created element
            console.log("Created Element with name: " + _elementName);
            return _customElement;
        }

        //return the element that already exists
        console.log("Element with name: "+ _elementName + " Exists");
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
    this.checkElementExists = function checkElementExists(_elementName, _elementExtra, _elementType)
    {
        for (var i = 0; i < cElement.elementArray.length; i++)
        {
            //check if the names and role match
            if (cElement.elementArray[i].elementName == _elementName
                && cElement.elementArray[i].elementExtra == _elementExtra
                && cElement.elementType == _elementType)
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
        for (var i = 0; i < cElement.elementArray.length; i++)
        {
            //check if the names and role match
            if (cElement.elementArray[i].elementName == _elementName)
            {
                //add the element to the return list
                ret.push(cElement.elementArray[i]);
            }
        }

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
        for (var i = 0; i < cElement.elementArray.length; i++)
        {
            //check if the names and role match
            if (cElement.elementArray[i].ID == _ID)
            {
                //return the element
                return cElement.elementArray[i];
            }
        }
        //return null if not found
        console.log("Element with ID: " + _ID + " Doesn't Exists");
        return null;
    }

    //return the listener 
    this.getElementByListener = function getElementByListener(_listener)
    {
        //loop through every element in the array
        for (var i = 0; i < cElement.elementArray.length; i++)
        {
            //check if the listener ID match
            if (cElement.elementArray[i].eventListener.ID == _listener.ID)
            {
                //return the position in the array
                return cElement.elementArray[i];
            }
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
            var htmlObject = cUtility.findHTMLObjects(_element);
            
            if (htmlObject) 
            {
                var _zIndex = _messageData.zIndex || null,
                    _posX = _messageData.posX || null,
                    _posY = _messageData.posY || null;
                
                //loop through all HTML Objects
                for (var obj = 0; obj < htmlObject.length; obj++)
                {
                    
                    //try to find overlay panel if mood object
                    var htmlOverlayPanels = null;

                    //if message for panel data exists find panelOverlay
                    if (_messageData["panel"] && typeof _messageData["panel"] === "function")
                    {
                        htmlOverlayPanels = 
                            _messageData["panel"].call(this, htmlObject[obj]);
                    }
                    else
                    {
                        htmlOverlayPanels = 
                            $(htmlObject[obj]).closest(".WebPanelOverlay");
                    }
                    
                    //if not mood object then reset back to html object
                    if (typeof htmlOverlayPanels == "undefined" || htmlOverlayPanels.length == 0)
                    {
                        htmlOverlayPanels = htmlObject[obj];
                    }
    
                    //loop through all panels that need modifiying
                    for (var i = 0; i < htmlOverlayPanels.length; i++)
                    {	
                        //turn message enable/disable into bool
                        var _toEnable = (_enabled.message === "enable" || _enabled.message === true);
    
                        //modify the element's extras I.E position and zIndex
                        cElement.modify.modifyElementExtras(_element, htmlObject[obj], htmlOverlayPanels[i], _messageData, _toEnable);
    
                        //check if the element now has a different active status and modify
                        if (_enabled.message == "enable" && !_element.elementEnabled || 
                            _enabled.message == "disable" && _element.elementEnabled)
                        {
                            //update listenerToElementEnabledChange and set element to be opposite
                            cEventListener.message.sendMessageToType(_element.eventListener, new cEventListener.basicMessage("listenToElementEnableChange", _enabled.message));
                            _element.elementEnabled = !_element.elementEnabled;						
                        }
                    }
                }
                
                //return succeeded
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

    this.modifyElementExtras = function modifyElementExtras(element, htmlObject, htmlOverlayPanel, _messageData, _enabled)
    {
        //check custom css exists and message data
        //has a custom opacity transition
        if (cCss)
        {
            if (_messageData.opacityTime)
            {
                //setup opacity transition data
                var _transData = 
                new cCss.cssTransitionData(
                    "opacity",
                    ((_messageData.opacityTime || 0) / 1000).toString() + "s",
                    _messageData.opacityTiming || "linear",
                    ((_messageData.opacityDelay || 0) / 1000).toString() + "s",
                    null
                );

                //add the transition data to the overylay panel
                cCss.transition.addTransition(htmlOverlayPanel, _transData);
            }
            else
            {
                //setup opacity transition data
                var _transData = 
                new cCss.cssTransitionData(
                    "opacity",
                    "0s",
                    "linear",
                    "0s",
                    null
                    );

                //add the transition data to the overylay panel
                cCss.transition.addTransition(htmlOverlayPanel, _transData);
            }
        }

        //check if the element is to be enabled or disabled
        if (_enabled)
        {
            //change html style to be visiblie and set zIndex to default
            htmlOverlayPanel.style.opacity = 100;
            htmlOverlayPanel.style.visibility = "visible";
            cCss.style.addStyleProperty(htmlOverlayPanel,
                new cCss.styleModificationData("z-index",
                    10000
                )
            );
        }
        else
        {
            //change html style to be visiblie and set zIndex to default
            htmlOverlayPanel.style.opacity = 0;
            var currentDelay = (_messageData.opacityTime || 0) + (_messageData.opacityDelay || 0);

            //function for callback in timer
            function opacityChange(_args)
            {
                //check if current timer tick is less than delay
                if (_args.ticksElapsed < currentDelay)
                {
                    //check if element enabled has been changed to true
                    if (element.elementEnabled == true)
                    {
                        //stop timer if true
                        return false;
                    }

                    //otherwise continue timer
                    return true;
                }
                else
                {
                    //check if element is stil false when timer ends
                    if (element.elementEnabled == false)
                    {
                        //set element to be hidden and set z-index to 0
                        htmlOverlayPanel.style.visibility = "hidden";
                        cCss.style.addStyleProperty(htmlOverlayPanel,
                            new cCss.styleModificationData("z-index",
                                0
                            )
                        );
                    }

                    //then stop the timer
                    return false;
                }
            }
            
            new cTimer.realtimeTimer(new cTimer.callback(opacityChange, this), true, currentDelay + 1, true);
        }

        //check if zIndex supplied and set to that if so
        if (_messageData.zIndex)
        {
            cCss.style.addStyleProperty(htmlOverlayPanel,
                new cCss.styleModificationData("z-index",
                    _messageData.zIndex, 
                    _messageData.zIndexImportance || ""
                )
            );
        }

        //setup position variables
        var _posX = _messageData.posX || "undefined", _posY = _messageData.posY || "undefined";

        //check if _posX exists
        if (_posX == "undefined")
        {
            //check if there is a function to generate _posX
            if (typeof _messageData.generatePosX == "function")
            {
                //run the function to generate _posX
                _posX = _messageData.generatePosX();
            }
            else
            {
                //set _posX to null as both it and
                //a function to generate it don't exist
                _posX = null;
            }
        }

       //check if _posY exists
       if (_posY == "undefined")
       {
           //check if there is a function to generate _posY
           if (typeof _messageData.generateposY == "function")
           {
               //run the function to generate _posY
               _posY = _messageData.generateposY();
           }
           else
           {
               //set _posY to null as both it and
               //a function to generate it don't exist
               _posY = null;
           }
       }
        
        //check if position supplied, if so set them up
        if (_posX && _posY)
        {
            htmlOverlayPanel.style.position = "absolute";

            //check custom css exists and message data
            //has a custom position transition
            if (cCss && _messageData.positionMoveTime)
            {
                //setup position transition data
                var _transData = 
                    new cCss.cssTransitionData(
                        "left",
                        ((_messageData.positionMoveTime || 0) / 1000).toString() + "s",
                        _messageData.positionTiming || "linear",
                        ((_messageData.positionDelay || 0) / 1000).toString() + "s",
                        null
                        );

                //add transition data to "left" 
                cCss.transition.addTransition(htmlOverlayPanel, _transData);

                //add same transition data to "top"
                _transData.transitionProperty = "top";
                cCss.transition.addTransition(htmlOverlayPanel, _transData);
            }
            
            //class scroll seems to be the object itself vs the surrounding div
            var scroller = $(htmlObject).children(".scroller");
            
            var scrollOffset = null;
            var scrollOffsetX = 0;
            var scrollOffsetY = 0;
            
            if (scroller.length > 0)
            {
                var scrollOffset = scroller[0].style;
                var scrollOffsetX = scrollOffset.left.replace('px', '');
                var scrollOffsetY = scrollOffset.top.replace('px', '');
            }
            
            //set position and force align start to left of page
            htmlOverlayPanel.style.left = (_posX - parseInt(scrollOffsetX)) + "px";
            htmlOverlayPanel.style.top = (_posY - parseInt(scrollOffsetY)) + "px";
        }
    }

    //add onClick to element's html
    this.addOnClickToElement = function addOnClickToElement(_elementID, _function, _addOrCreate, _css)
	{
		
		var _css = _css || null;
		//find all html objects from ID
		var elementObjs = cUtility.findHTMLObjects(cElement.search.getElementID(_elementID));
		
		if (elementObjs)
		{
			//loop through all objects
			for (var e = 0; e < elementObjs.length; e++)
			{
				//add onto onclick
				cUtility.addOnClickToHTML(elementObjs[e], _function, _addOrCreate);

				if (_css)
				{
					//Add css based on button
					elementObjs[e].classList.add(_css);
				}
			}
		}
	}
}