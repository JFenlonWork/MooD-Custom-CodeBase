/*
	Title:
		Buttons
	
	Description:
		Attempt at making an array to hold buttons dynamcally
*/

window.cButton = window.cButton || new function cButton()
{
    //===LOCAL VARIABLES===//
    this.buttonArray = [];

	//====DATA TYPES====//
	this.dataTypes = new cButtonDataTypes();
    
    //holds basic message information that is used by the event listener
    this.Button = this.dataTypes.button.prototype;
	this.button = this.dataTypes.button;
	
	//====FUNCTIONS====//
	this.setup = new cButtonSetupFunctions();
	this.registration = new cButtonRegistrationFunctions();
    this.generic = new cButtonGenericFunctions();
    this.search = new cButtonSearchFunctions();
	this.modify = new cButtonModifyFunctions();
	
    //===RUN-TIME FUNCTIONS===//
    (function setupButtonListenerCreation()
    {
        
        //check if cEventListener has been defined
        if (typeof cEventListener !== 'undefined')
        {
            //add button setup to "EventListenerCreation" 
			cEventListener.generic.addFunctionToWaitingForMessage("afterElementSetup",
				{ 
					setupFunction : 
						function()
						{ 
							window.cButton.setup.buttonSetup();
						} 
				}
			);
            
            //add button registration to event listeners
            cEventListener.generic.addRegistrationFunction("button",
                { 
                    getRegisterQueueType : 
                        function (_data) 
                        {
                            return window.cButton.search.returnButtonListener(_data.type);
                        }  
                }
            );
		}
        else
        {
            //retry in 10ms if undefined
            setTimeout(function() { setupButtonListenerCreation(); }, 10);
        }
        
    })();
}

function cButtonDataTypes()
{
	this.button = function button(_htmlButtonID, _moodButtonID, _buttonElementID, _buttonEnabledByDefault, _canDisableSelf, _element)
	{	
		this.htmlButtonID = _htmlButtonID;
		this.moodButtonID = _moodButtonID;
		
		this.tabElementEnabledCount = 0;
		this.tabElementEnabledMax = 0;
		
		this.elementObj = '';
		
		this.buttonEnabledByDefault = _buttonEnabledByDefault || false;
		this.canDisableSelf = _canDisableSelf || false;
		this.buttonEnabled = "false";
		
		this.elementOwned = _element || new customElement(_htmlButtonID + ' ' + _buttonElementID.toString(), '', '', _buttonElementID);
		this.buttonElementID = this.elementOwned.ID || uniqueID;
		
        //store a link to this current element for functions below
        var currentButton = this;

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('registerListenerSuccesful',
			{ 
				receiveMessage : function (_data) 
				{
					cButton.generic.buttonRegistered(true, currentButton.buttonElementID , _data.message);
				}
			}
		));

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('deregisterListenerSuccesful',
			{ 
				receiveMessage : function (_data) 
				{
					cButton.generic.buttonRegistered(false, currentButton.buttonElementID , _data.message);
				}
			}
		));

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('listenToElementEnableChange',
			{ 
				receiveMessage : function (_data) 
				{
					cButton.generic.buttonUpdateElementCount(currentButton.buttonElementID , _data.message);
				}
			}
		));

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('updateElementCount',
			{ 
				receiveMessage : function (_data) 
				{
					cButton.generic.buttonUpdateElementCount(currentButton.buttonElementID , _data.message);
				}
			}
		));
		
	}
}

function cButtonSetupFunctions()
{
	//used to create button from other files
	this.createButton = function createButton(_buttonData)
	{
		//create or find element for button
		var elementGenerated = cElement.generic.addElement(_buttonData.name, "", "mood-button", _buttonData.id);
	
		//find html data for button
		var moodButton = cUtility.findHTMLObjects(elementGenerated)[0];
		var buttonGenerated = null;
	
		//if no element supplied with button
		//then create empty button
		if (moodButton == null)
		{
			//add and/or get button 
			buttonGenerated = cButton.generic.addButton(elementGenerated.ID, elementGenerated.ID, 
								elementGenerated.ID, _buttonData.elementsToEnable, 
								_buttonData.elementsToDisable, _buttonData.enabledOnDefault, 
								_buttonData.canDisableSelf, _buttonData.id);
		}
		else
		{
			//add and/or get button 
			buttonGenerated = cButton.generic.addButton(moodButton.id, moodButton.id, 
									elementGenerated.ID, _buttonData.elementsToEnable, 
									_buttonData.elementsToDisable, _buttonData.enabledOnDefault, 
									_buttonData.canDisableSelf, _buttonData.id);
		}

		//modify original id to increase to shorten creation code
		_buttonData.id++;
	
		//check html data exists
		if (buttonGenerated)
		{
			//add button activate/deactivate to registeredListeners so it
			//activates/deactivates whenever a new listener is added
	
			//if enableOnDefault is false then _enable is "true" (disable on toggle)
			//else "false" (enable on toggle)
			var _enabled = '"' + (_buttonData.enabledOnDefault === "false" ||
									_buttonData.enabledOnDefault === false).toString() + '"';
	
			//toggle button to _enabled status on default
			cEventListener.generic.addFunctionToWaitingForMessage(
				"registeredListeners",
				{
					setupFunction : function ()
					{
						cButton.modify.toggleButtonClick(buttonGenerated.buttonElementID, _buttonData.enabledOnDefault.toString());
					}
				}
			);
	
			//check if the button has no special onClick
			//if so set it to default toggleButton
			if (_buttonData.onClick == null)
			{
				_buttonData.onClick = "cButton.modify.toggleButtonClick(" + buttonGenerated.buttonElementID + ")";
			}
	
			//check if onClick is in string
			if (_buttonData.onClick.charAt(0) == '"')
			{
				//remove quotes from start and end
				_buttonData.onClick = _buttonData.onClick.substr(1,_buttonData.onClick.length - 2);
			}

			//add on click to object
			cElement.modify.addOnClickToElement(buttonGenerated.buttonElementID, _buttonData.onClick, true);
	
			//return succeeded
			return true;
								
		}
	
		//output warning
		console.warn("Warning: Button could not be found: " + _buttonData.name
						+ " Check HTML/JS Is Correct Or Button Is Named Correctly In MooD");			
	
		//return failed
		return false;
	}

	//run first pass
	this.buttonSetup = function buttonSetup()
	{
		//call any functions listening to "beforeButtonSetup"			
		cEventListener.queue.invokeMessageQueue("beforeButtonSetup");
		
		//find main custom div
		var divHeaders = $('[title="CustomTab"]');
			
		//setup buttons from main divs
		for (var i = 0; i < divHeaders.length; i++)
		{		
			//find all mood buttons on header
			var headerButtonString = divHeaders[i].getAttribute( "moodButtonSetup" );
					
			//check moodButtonSetup exists
			if (headerButtonString)
			{
				//split header string into header buttons
				var headerButtons = headerButtonString.split("\n");
				
				//loop through all buttons
				for (var moodIndex = 0; moodIndex < headerButtons.length; moodIndex++)
				{
					//parse html data
					var buttonInfo = cEventListener.message.parseCustomHTMLData(headerButtons[moodIndex]);
						
					//check if button info actually has anything in it
					if (buttonInfo[0])
					{

						//setup button data for createButton function
						var _buttonData = {
							name : buttonInfo[0],
							id : buttonInfo[1],
							elementsToEnable : buttonInfo[2].split(" "),
							elementsToDisable : buttonInfo[3].split(" "),
							enabledOnDefault : buttonInfo[4],
							canDisableSelf : buttonInfo[5],
							onClick : ('"' + buttonInfo[6] + '"') || null
						};

						//create button 
						cButton.setup.createButton(_buttonData);

					}
					else
					{
						//warn if no button data available
						console.warn("Warning: HTML is empty, if not using mood buttons ignore this");
					}
				}
			}
			
			//Possibly just remove html implementation?
				
			//find all custom html buttons
			//find all buttons from headers
			var buttons = $(divHeaders[header]).find('button');
					
			//loop through all custom buttons
			for (var htmlButtonIndex = 0; htmlButtonIndex < buttons.length; htmlButtonIndex++)
			{
				//store basic variables for button
				var buttonToCopyStyle = buttons[htmlButtonIndex].getAttribute( "buttonToCopyStyle" );
				var buttonEnabledByDefault = buttons[htmlButtonIndex].getAttribute( "buttonEnabled" );
				var buttonCanDisableSelf = buttons[htmlButtonIndex].getAttribute( "buttonCanDisable" );
				var buttonID = buttons[htmlButtonIndex].getAttribute( "elementID" );
					
				//setup button button and add elementGroups
				var elementsToEnable = buttons[htmlButtonIndex].getAttribute( "elementsToEnable" ).split(" ");
				var elementsToDisable = buttons[htmlButtonIndex].getAttribute( "elementsToDisable" ).split(" ");
				
				//create element for button
				var elementGenerated = cElement.generic.addElement(buttons[htmlButtonIndex].id,"","tab-button",buttonID);
					
				//check if style copy exists
				if (buttonToCopyStyle) 
				{
					//find the element in HTML		
					var temp = cElement.generic.addElement(buttonToCopyStyle, '', "mood-button");
						
					//cheat for copying mood button style
					temp.elementExtra = "button";
					temp.elementType = "role";
					var tempElement = cUtility.findHTMLObjects(temp)[0];
					temp.elementExtra = "";
					temp.elementType = "mood-button";
					
					//copyMooDStyle(buttons[htmlButtonIndex], tempElement);
					
					//add button with mood button link
					cButton.generic.addButton(buttons[htmlButtonIndex].id, tempElement.id, elementGenerated.ID, elementsToEnable, elementsToDisable, buttonEnabledByDefault, buttonCanDisableSelf, elementGenerated.ID);
				}
				else
				{	
					//add button with no mood button link
					cButton.generic.addButton(buttons[htmlButtonIndex].id, -1, elementGenerated.ID, elementsToEnable, elementsToDisable, buttonEnabledByDefault, buttonCanDisableSelf, elementGenerated.ID);
				}

				//setup button message for enabledByDefault
				var _buttonEnabledMessage = 
					"cButton.modify.toggleButtonClick(" +
						"cUility.findHTMLObjects(" +
							"cElement.search.getElementID(" +
								elementGenerated.ID 
					+ ")))[0],";
					
				//toggle button on if trueOnDefault is true
				if (buttonEnabledByDefault == "true")
				{
					//uses 'false' because it's going through a toggle function
					cEventListener.generic.addFunctionToWaitingForMessage("registeredListeners",_buttonEnabledMessage + "'false')");
				}
				else
				{
					//uses 'true' because it's going through a toggle function
					cEventListener.generic.addFunctionToWaitingForMessage("registeredListeners",_buttonEnabledMessage + "'true')");
				}
			}	
				
		}
			
		cEventListener.queue.invokeMessageQueue("afterButtonSetup");
	}
}

function cButtonGenericFunctions() 
{
	//function to handle when button listener is registered/deregistered
	this.buttonRegistered = function buttonRegistered(_successful, _button, _message)
	{
		var _registeredMessageType = _message.message.message.type;

		switch(_message.type)
		{
			//if listener is listening to deregistered element 
			case "registerListenerSuccesful":
			case "degregisterListenerSuccesful":

				if (_registeredMessageType == "listenToElementEnableChange")
				{
					
					//var listenerElement = cElement.search.getElementID(_message.message.message.message.id);
					var listenerElement = cElement.search.getElementByListener(_message.message.listener);

					if (listenerElement)
					{
						if (_successful)
						{
							if (listenerElement.elementEnabled)
							{
								//if element was enabled then increase both max and current count
								cButton.generic.buttonUpdateElementCount(_button, new cEventListener.basicMessage(null, "increaseBoth"));
							}
							else
							{
								//if element was disabled then increase max count
								cButton.generic.buttonUpdateElementCount(_button, new cEventListener.basicMessage(null, "increase"));
							}
						}
						else
						{
							if (listenerElement.elementEnabled)
							{
								//if element was enabled then decrease both max and current count
								cButton.generic.buttonUpdateElementCount(_button, new cEventListener.basicMessage(null, "decreaseBoth"));
							}
							else
							{
								//if element was disabled then decrease max count
								cButton.generic.buttonUpdateElementCount(_button, new cEventListener.basicMessage(null, "decrease"));
							}
						}
					}
				}
			break;
		}
	}

	//update elementEnabled function
	this.buttonUpdateElementCount = function buttonUpdateElementCount(_button, _message)
	{
		
		var _button = cButton.search.getButtonFromID(_button);
		switch (_message.message)
		{						
			//if message is registered enabled element to button
			case "increaseBoth":
				_button.tabElementEnabledCount++;
				
				//if message is registered disabled element to button
			case "increase":
				_button.tabElementEnabledMax++;
			break;
				
			//if message is element enabled
			case "enable":
				_button.tabElementEnabledCount++;
			break;
				
			//if message is deregistered enabled element to button
			case "decreaseBoth":
				_button.tabElementEnabledCount--;
				
			//if message is deregistered disabled element to button
			case "decrease":
				_button.tabElementEnabledMax--;
			break;
			
			//if message is element disabled
			case "disable":
				_button.tabElementEnabledCount--;
			break;
		}
		
		//update style based on enabled count
		cButton.generic.checkButtonStyle(_button);
	}

	//Handle Updating Button Style
	this.checkButtonStyle = function checkButtonStyle(_button)
	{
		if (_button.tabElementEnabledCount <= 0)
		{
			//if 0 or less elements enabled set style to disabled
			cButton.modify.updateButtonEnabledDisabled(_button, "false", "CustomTabDisabled");
		}
		else if (_button.tabElementEnabledCount >= _button.tabElementEnabledMax)
		{
			//if more than or equal to max elements enabled set style to enabled
			cButton.modify.updateButtonEnabledDisabled(_button, "true", "CustomTabEnabled");
		}
		else
		{
			//if more than 0 but less than max elements enabled set style to partial
			cButton.modify.updateButtonEnabledDisabled(_button, "partially", "CustomTabPartEnabled");
		}
	}

	//function to add button
	this.addButton = function addButton(_htmlButtonID, _moodButtonID, _buttonElementID, _tabElementsToEnable, _tabElementsToDisable, _buttonEnabledByDefault, _canDisableSelf, _ID)
	{
		
		var _buttonEnabledByDefault = _buttonEnabledByDefault || false;
		var _canDisableSelf = _canDisableSelf || false;
		var _ID = _ID || uniqueID;

		var button = null;
		
		//check if button exists in buttonArray
		var exists = cButton.search.checkButtonExists(_htmlButtonID, _moodButtonID);
		if (exists == -1)
		{
			//setup button and add to buttonArray
			button = new cButton.button(_htmlButtonID, _moodButtonID, parseInt(_buttonElementID),
											 _buttonEnabledByDefault, _canDisableSelf,
											  cElement.search.getElementID(_ID));
			cButton.buttonArray.push(button);
			
			console.log("Created Button with ID: " + _ID); 
		} else
		{
			button = cButton.buttonArray[exists];
			console.log("Button: " + _ID + " Already exists");
		}

		if (_tabElementsToEnable)
		{
			//register _tabElementsToEnable to listen to button "elementToggleEnable"
			cButton.registration.registerButton(_tabElementsToEnable, button, "listenToToggleElementToEnableStatus");
			
			//register button to listen to _tabElementsToEnable "elementToggleEnable"
			cButton.registration.registerElement(_tabElementsToEnable, button, "listenToElementEnableChange");
		}
			
		if (_tabElementsToDisable)
		{
			//register button to listen to _tabElementsToDisable "elementToggleEnable"
			cButton.registration.registerButton(_tabElementsToDisable, button, "listenToToggleElementToDisableStatus");
		}
		
		return button;
	}

	//function to remove button
	this.removeButton = function removeButton(_htmlButtonID, _moodButtonID)
	{
		//check if button exists in buttonArray
		var exists = cButton.search.checkButtonExists(_htmlButtonID, _moodButtonID);
		
		//check if button exists
		if (exists != -1)
		{
			//loop through listeners and deregister them
			while (buttonArray[exists].eventListener.listeners.length > 0)
			{
				cEventListener.generic.deregisterListener(buttonArray[exists], buttonArray[exists].eventListener.listeners[0].listener, buttonArray[exists].eventListener.listeners[0].listenerType, buttonArray[exists].eventListener.listeners[0].listenerExtra);		
			}
			
			//loop through listening too and deregister self from them
			while (buttonArray[exists].listeningTo.length > 0)
			{
				cEventListener.generic.deregisterListener(buttonArray[exists].eventListener.listeningTo[0].listener, buttonArray[exists], buttonArray[exists].eventListener.listeningTo[0].listenerType, buttonArray[exists].eventListener.listeningTo[0].listenerExtra);		
			}
			
			//Find element attached to button
			var buttonElement = cElement.search.getElementID(buttonArray[exists].buttonElementID);		
			
			///check if button exists
			if (buttonElement)
			{
				//remove button if it does exist
				cButton.generic.removeElement(buttonElement.elementName, buttonElement.elementExtra, buttonElement.elementType);
			}
			
			//remove button from buttonArray
			cButton.buttonArray.splice(exists,1);
			return true;
		}
		
		//log that button doesn't exsist and return false
		console.log("Button: " + _ID + " Doesn't exist");
		return false;
	}

}

function cButtonRegistrationFunctions()
{
	//handle registering the element to listen to the button
	this.registerButton = function registerButton(_elementsInfo, _button, _type)
	{
		//check if _elementsInfo exists
		if (_elementsInfo)
		{
			//check _elementsInfo has values
			if (_elementsInfo.length > 0)
			{
				//loop through all _elementsInfo
				for (var a = 0; a < _elementsInfo.length; a++)
				{

					//register the button to the element 
					var _registrationContent = {
						listener : _elementsInfo[a].id,
						listenTo : _button,
						message : new cEventListener.basicMessage(_type, _elementsInfo[a]),

						returnListener : function ()
						{
							return cEventListener.search.returnQueueListener(
								new cEventListener.basicMessage(
									"element",
									this.listener
								));
						},

						returnListenTo : function ()
						{
							return this.listenTo.elementOwned.eventListener;
						}
					};

					cEventListener.listenerRegistrationQueue.push(_registrationContent);
				}
			}
		}
	}

	//handle registering the button to listen to element 
	this.registerElement = function registerElement(_elementsInfo, _button, _type)
	{
		//check if _elementsInfo exists
		if (_elementsInfo)
		{
			//check _elementsInfo has values
			if (_elementsInfo.length > 0)
			{
				//loop through all _elementsInfo
				for (var a = 0; a < _elementsInfo.length; a++)
				{
					//register the button to the element 
					var _registrationContent = {
						listener : _button,
						listenTo : _elementsInfo[a].id,
						message : new cEventListener.basicMessage(_type, _elementsInfo[a]),

						returnListener : function ()
						{
							return this.listener.elementOwned.eventListener;
						},

						returnListenTo : function ()
						{
							return cEventListener.search.returnQueueListener(
								new cEventListener.basicMessage(
									"element",
									this.listenTo
								));
						}
					};

					cEventListener.listenerRegistrationQueue.push(_registrationContent);

					/*
					var _listenerContents = new cEventListener.basicMessage("button", _button);
					var _listenToContents = new cEventListener.basicMessage("element", _elementsInfo[a].id);
					var _messageContents = new cEventListener.basicMessage(_type, _elementsInfo[a]);

					cEventListener.listenerRegistrationQueue.push(
						new cEventListener.listenerQueuerInfo(
							new cEventListener.basicMessage(_listenerContents, _messageContents),
							new cEventListener.basicMessage(_listenToContents, _messageContents)
						)
					);
					*/
				}
			}
		}
	}

	//==============Event Handlers=================
	//MODIFY THIS TO BE UPDATED AND POSSIBLY SIMPLER
	this.registerButtonToElement = function registerButtonToElement(_tabElements, _button, _type)
	{	
		//check if _tabElements exists
		if (_tabElements)
		{
			//check if _tabElements has values
			if (_tabElements.length > 0)
			{
				//loop through _tabElements and register them to _button
				for (var e = 0; e < _tabElements.length; e++)
				{
					//check if element needs to be split up
					if (typeof _tabElements[e] == "string")
					{
						//register _tabElements to _button
						var elementSplit = _tabElements[e].split("-");
	
						var _listenerContents = new cEventListener.basicMessage("element", elementSplit[0]);
						var _listenToContents = new cEventListener.basicMessage("button", _button);
						var _messageContents = new cEventListener.basicMessage(_type, null);
						
						//check if element has extra data
						if (elementSplit.length > 1)
						{
							//setup message data 
							var _elementMessageData = [];
							_elementMessageData.push(new cEventListener.basicMessage("disableData", elementSplit[1]));
	
							_messageContents.message = _elementMessageData;
						}
	
						cEventListener.listenerRegistrationQueue.push(
							new cEventListener.listenerQueuerInfo(
								new cEventListener.basicMessage(_listenerContents, _messageContents),
								new cEventListener.basicMessage(_listenToContents, _messageContents)
							)
						);
					}
					else
					{
						var _listenerContents = new cEventListener.basicMessage("element", _tabElements[e]);
						var _listenToContents = new cEventListener.basicMessage("button", _button);
	
						var _messageContents = new cEventListener.basicMessage(_type, _tabElements[e]);
	
						//register _tabElements to _button
						cEventListener.listenerRegistrationQueue.push(
							new cEventListener.listenerQueuerInfo(
								new cEventListener.basicMessage(_listenerContents, _messageContents),
								new cEventListener.basicMessage(_listenToContents, _messageContents)
							)
						);
					}
				}
			}
		}
	}
	
	//MODIFY THIS TO BE UPDATED AND POSSIBLY SIMPLER
	this.registerElementToButton = function registerElementToButton(_tabElements, _button, _type)
	{	
		//check if _tabElements exists
		if (_tabElements)
		{
			//check if _tabElements has values
			if (_tabElements.length > 0)
			{
				//loop through _tabElements
				for (var e = 0; e < _tabElements.length; e++)
				{
					//check if element needs to be split up
					if (typeof _tabElements[e] == "string")
					{
						//register _tabElements to _button
						var elementSplit = _tabElements[e].split("-");
	
						var _listenerContents = new cEventListener.basicMessage("button", _button);
						var _listenToContents = new cEventListener.basicMessage("element", elementSplit[0]);
						var _messageContents = new cEventListener.basicMessage(_type, null);
						
						//check if element has extra data
						if (elementSplit.length > 1)
						{
							//setup message data 
							var _buttonMessageData = [];
							_buttonMessageData.push(new cEventListener.basicMessage("disableData", elementSplit[1]));
							
							_messageContents.message = _buttonMessageData;
						}
	
						cEventListener.listenerRegistrationQueue.push(
							new cEventListener.listenerQueuerInfo(
								new cEventListener.basicMessage(_listenerContents, _messageContents),
								new cEventListener.basicMessage(_listenToContents, _messageContents)
							)
						);
					}
					else
					{
						var _listenerContents = new cEventListener.basicMessage("button", _button);
						var _listenToContents = new cEventListener.basicMessage("element", _tabElements[e]);
	
						var _messageContents = new cEventListener.basicMessage(_type, _tabElements[e]);

						//register _button to _tabElements
						cEventListener.listenerRegistrationQueue.push(
							new cEventListener.listenerQueuerInfo(
								new cEventListener.basicMessage(_listenerContents, _messageContents),
								new cEventListener.basicMessage(_listenToContents, _messageContents)
							)
						);
	
					}
				}
			}
		}
	}
}

function cButtonSearchFunctions() 
{
	this.checkButtonExists = function checkButtonExists(_htmlButtonID, _moodButtonID)
	{
		//loop through every button in the array
		for (var i = 0; i < cButton.buttonArray.length; i++)
		{
			//check if the ButtonID and ButtonNames match
			if (cButton.buttonArray[i].htmlButtonID == _htmlButtonID &&
				cButton.buttonArray[i].moodButtonID == _moodButtonID)
			{
				//return the current index in the array
				return i;
			}
		}
		//return -1 if not found
		return -1;
	}

	this.getButtonFromID = function getButtonFromID(_ID)
	{
		//loop through every elementGroup in the array
		for (var i = 0; i < cButton.buttonArray.length; i++)
		{
			//check if the IDs match
			if (cButton.buttonArray[i].buttonElementID == _ID)
			{
				//return the button in the array
				return cButton.buttonArray[i];
			}
		}

		//return null if not found
		console.log("Button with ID: " + _ID + " Doesn't exist");
		return null;
	}
	
	this.getButtonFromHTMLID = function getButtonFromHTMLID(_ID)
	{
		//loop through every button in the array
		for (var i = 0; i < cButton.buttonArray.length; i++)
		{
			//check if the IDs match
			if (cButton.buttonArray[i].htmlButtonID == _ID)
			{
				//return the button in the array
				return cButton.buttonArray[i];
			}
		}

		//return null if not found
		console.log("Button with ID: " + _ID + " Doesn't exist");
		return null;
	}
	
	//evaluate listener to variable
	this.returnButtonListener = function returnButtonListener(_listener)
	{
		//check type of input and return based on that
		if (typeof _listener.message == "string" || typeof _listener.message == "number")
		{
			//search for element
			var _element = cElement.search.getElementID(_listener.message);
			
			//if the element exists return the element's listener
			if (_element)
			{
				return _element.eventListener;
			}
		}
		else if (_listener.message instanceof cButton.button)
		{
			//return the listener associated with the button
			return _listener.message.elementOwned.eventListener;
		}
		
		return null;
		
	}
}

function cButtonModifyFunctions() 
{
	//Handles setting custom css for buttons
	this.updateButtonEnabledDisabled = function updateButtonEnabledDisabled(_button, _enabled, _tabEnabled)
	{
		//set enabled to _enabled
		_button.buttonEnabled = _enabled;

		//find button assosciated with _button
		var buttons = cUtility.findHTMLObjects(cElement.search.getElementID(_button.buttonElementID));
		
		//check if tab button exists
		if (buttons)
		{
			//loop through tab buttons
			for (var b = 0; b < buttons.length; b++)
			{
				//update button html class
				buttons[b].classList.remove('CustomTabDisabled');
				buttons[b].classList.remove('CustomTabPartEnabled');
				buttons[b].classList.remove('CustomTabEnabled');
				
				//set css to _tabEnabled
				buttons[b].classList.add(_tabEnabled);
			}
		}
		
		return true;
	}

	//toggles button on and off
	this.toggleButtonClick = function toggleButtonClick(_htmlButton, _setValue)
	{
		var htmlButtonIndex = -1;
		
		//loop through buttons
		for (var g = 0; g < cButton.buttonArray.length; g++)
		{
			//check both _htmlButton and button at current index
			//are setup correctly
			if (cButton.buttonArray[g].buttonElementID != null
				&& _htmlButton != null)
			{
				//check id of button matches stored
				if (cButton.buttonArray[g].buttonElementID == _htmlButton)
				{
					//set the html button index to be current index
					//and break out of the loop
					htmlButtonIndex = g;
					break;
				}
			}
		}
		
		//check button exists
		if (htmlButtonIndex != -1)
		{
			
			//get the current button being referenced
			var htmlButton = cButton.buttonArray[htmlButtonIndex];
			
			//setup switch value to be toggle
			var switchValue = htmlButton.buttonEnabled;

			switch (switchValue)
			{
				case "true":
					switchValue = "false";
					break;
				case "false":
					switchValue = "true";
					break;
			}
			
			//set switch value to _setValue if not null
			if (_setValue != null)
			{
				switchValue = _setValue;
			}

			//remove any additional "" in switch value
			switchValue = switchValue.replace(/"/g, '');

			//setup message types to decresae the typing later
			var _messages = [new cEventListener.basicMessage("listenToToggleElementToEnableStatus", "enable"),
								new cEventListener.basicMessage("listenToToggleElementToEnableStatus", "disable"),
								new cEventListener.basicMessage("listenToToggleElementToDisableStatus", "enable"),
								new cEventListener.basicMessage("listenToToggleElementToDisableStatus", "disable")]
			
			//enable or disable correct elementGroups
			//EDIT THIS LATER SO THAT IT IS MORE DYNAMIC? POSSIBLY DO NOT RE-ENABLE DISABLED ELEMENTS
			switch(switchValue)
			{
				case "true":
					//enable itself and disable element it disables
					cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[0]);
					cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[3]);
					break;
				case "false":
					if ((htmlButton.canDisableSelf == true || htmlButton.canDisableSelf == "true") && htmlButton.buttonEnabled == "true")
					{
						//disable the button's elements and enable any elements it disables
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[1]);
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[2]);
					}
					break;
				case "partially":
					//if button can disable itself then disable 
					if ((htmlButton.canDisableSelf == true || htmlButton.canDisableSelf == "true") && htmlButton.buttonEnabled == "true")
					{
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[1]);
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[2]);
					}
					else
					{
						//otherwise enable itself and disable element it disables
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[0]);
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[3]);
					}
					break;
				default:
					console.warn("Warning: Button does not have an enabled or disabled attribute");
			}
			return true;
		}
		console.log("Button Connected With Button: " + htmlButton.buttonElementID + " Doesn't Exist");
		return false;	
	}

}