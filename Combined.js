/**********************************************************************************
* This is a concatenation of all the selected files, including files in subfolders.
* The start and end of each file contains a comment with its name, as well as a
* print statement.
***********************************************************************************
* These are the line numbers for the included files:
* 16
* 1025
* 1387
* 2013
* 2634
* 2808
* 3636
* 3917
***********************************************************************************/

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
						cButton.modify.toggleButtonClick(buttonGenerated.buttonElementID, _enabled);
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
			cButton.modify.addOnClickToElement(buttonGenerated.buttonElementID, _buttonData.onClick, true);
	
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
					//if switch value is true and the button can disable itself then disable
					if (htmlButton.canDisableSelf == true || htmlButton.canDisableSelf == "true")
					{
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[1]);
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[2]);
					}
					break;
				case "false":
					//disable the button's elements and enable any elements it disables
					cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[0]);
					cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[3]);
					break;
				case "partially":
					//if button can disable itself then disable 
					if (htmlButton.canDisableSelf == true || htmlButton.canDisableSelf == "true")
					{
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener,_messages[1]);
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
				cButton.modify.addOnClickToHTML(elementObjs[e], _function, _addOrCreate);

				if (_css)
				{
					//Add css based on button
					elementObjs[e].classList.add(_css);
				}
			}
		}
	}

	this.addOnClickToHTML = function addOnClickToHTML(_elementObj, _function, _addOrCreate)
	{
		//add onto onclick
		if (_addOrCreate)
		{
			//check if onclick exists and is add
			if (_elementObj.getAttribute("onclick"))
			{
				//add onto onclick
				_elementObj.setAttribute("onclick", _elementObj.getAttribute("onclick") + ";" + _function);
			}
			else
			{
				//set onclick to be _function
				_elementObj.setAttribute("onclick", _function);
			}
		}
		else
		{
			//create on click to be _function
			_elementObj.setAttribute("onclick", _function);
		}
	}

}


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


/*
	Title:
		Custom Maths
	
	Description:
		Holds all information for Maths
*/

//store custom math seperations
window.cMaths = new function customMathFunctions()
{
    //functions/classes
    this.lineMaths = new lineMathFunctions();
    this.collision = new collisionFunctions();
    this.maths = new mathFunctions();

    //data types
    this.dataTypes = new customTypeData();
    
    this.Vector2 = this.dataTypes.vector2.prototype;
    this.vector2 = this.dataTypes.vector2;

    this.Line = this.dataTypes.line.prototype;
    this.line = this.dataTypes.line;

    this.Vector3 = this.dataTypes.vector3.prototype;
    this.vector3 = this.dataTypes.vector3;

    this.Vector4 = this.dataTypes.vector4.prototype;
    this.Vector4 = this.dataTypes.Vector4;

    this.Bounds = this.dataTypes.bounds.prototype;
    this.bounds = this.dataTypes.bounds;

}

//hold data types
function customTypeData()
{

    function vector2(_x, _y)
    {
        this.x = _x || 0;
        this.y = _y || 0;
    }

    vector2.prototype = 
    {
        set: function(_x, _y)
        {
            this.x = _x || 0;
            this.y = _y || 0;
        },

        clone: function()
        {
            return new vector2(this.x, this.y);
        },

        add: function(_vector)
        {
            return new vector2(this.x + _vector.x, this.y + _vector.y);
        },

        subtract: function(_vector)
        {
            return new vector2(this.x - _vector.x, this.y - _vector.y);
        },

        scale: function(_scalar)
        {
            return new vector2(this.x * _scalar, this.y * _scalar);
        },

        dot: function(_vector)
        {
            return new vector2(this.x * _vector.x, this.y * _vector.y);
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },
    
        distanceSqr: function (_vector) {
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            return (deltaX * deltaX + deltaY * deltaY);
        }
    }

    this.vector2 = vector2;

    function vector3(_x, _y, _z)
    {
        this.x = _x || 0;
        this.y = _y || 0;
        this.z = _z || 0;
    }

    vector3.prototype = 
    {
        set: function(_x, _y, _z)
        {
            this.x = _x || 0;
            this.y = _y || 0;
            this.z = _z || 0;
        },

        clone: function()
        {
            return new vector3(this.x, this.y, this.z);
        },

        vector2: function()
        {
            return new vector2(this.x, this.y);
        },

        add: function(_vector)
        {
            return new vector3(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z);
        },

        subtract: function(_vector)
        {
            return new vector3(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z);
        },

        scale: function(_scalar)
        {
            return new vector3(this.x * _scalar, this.y * _scalar, this.z * _scalar);
        },

        dot: function(_vector)
        {
            return new vector3(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z);
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },
    
        distanceSqr: function (_vector) {
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            var deltaZ = this.z - _vector.z;
            return (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        }
    }

    this.vector3 = vector3;

    function vector4(_x, _y, _z, _w)
    {
        this.x = _x || 0;
        this.y = _y || 0;
        this.z = _z || 0;
        this.w = _w || 0;
    }

    vector4.prototype = 
    {
        set: function(_x, _y, _z, _w)
        {
            this.x = _x || 0;
            this.y = _y || 0;
            this.z = _z || 0;
            this.w = _w || 0;
        },

        clone: function()
        {
            return new vector4(this.x, this.y, this.z, this.w);
        },

        vector2: function()
        {
            return new vector2(this.x, this.y);
        },

        vector3: function()
        {
            return new vector3(this.x, this.y, this.z);
        },

        add: function(_vector)
        {
            return new vector4(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z, this.w + _vector.w);
        },

        subtract: function(_vector)
        {
            return new vector4(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z, this.w - _vector.w);
        },

        scale: function(_scalar)
        {
            return new vector4(this.x * _scalar, this.y * _scalar, this.z * _scalar, this.w * _scalar);
        },

        dot: function(_vector)
        {
            return new vector4(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z, this.w * _vector.w);
        }
    }

    this.vector4 = vector4;

    function bounds(_x1, _y1, _x2, _y2)
    {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
        this.topLeft = new vector2(_x1, _y1);
        this.topRight = new vector2(_x2, _y1);
        this.bottomRight = new vector2(_x2, _y2);
        this.bottomLeft = new vector2(_x1, _y2);
    }

    bounds.prototype =
    {
        set: function(_x1, _y1, _x2, _y2)
        {
            this.x1 = _x1;
            this.y1 = _y1;
            this.x2 = _x2;
            this.y2 = _y2;
            this.topLeft.set(_x1, _y1);
            this.topRight.set(_x2, _y1);
            this.bottomRight.set(_x2, _y2);
            this.bottomLeft.set(_x1, _y2);
        },

        clone: function()
        {
            return new bounds(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
        },

        add: function(_bounds)
        {
            return new bounds(this.x1 + _bounds.x1, this.y1 + _bounds.y1, this.x2 + _bounds.x2, this.y2 + _bounds.y2);
        },

        subtract: function(_bounds)
        {
            return new bounds(this.x1 - _bounds.x1, this.y1 - _bounds.y1, this.x2 - _bounds.x2, this.y2 - _bounds.y2);
        },

        scale: function(_scalar)
        {
            return new bounds(this.x1 * _scalar, this.y1 * _scalar, this.x2 * _scalar, this.y2 * _scalar);
        },

        dot: function(_bounds)
        {
            return new bounds(this.x1 * _bounds.x, this.y1 * _bounds.y, this.x2 * _bounds.x2, this.y2 * _bounds.y2);
        },

        fromVector2s: function(_pos1, _pos2)
        {
            return new bounds(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromObject: function(_object, _relative, _includeChildren)
        {
            //setup object bounds
            var _objectBounds =
            {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }

            //setup relative
            var _relative = _relative || "document";

            //setup JQuery object and add css class
            var _objectJQuery = $(_object);
            _objectJQuery[0].classList.add("notransition");

            //get object bounds based on relative
            if (_relative == "document")
            {
                //get bounds with global position
                _objectBounds.left = _objectJQuery.offset().left;
                _objectBounds.top = _objectJQuery.offset().top;

                _objectBounds.right = _objectBounds.left + _objectJQuery.outerWidth();
                _objectBounds.bottom = _objectBounds.top + _objectJQuery.outerHeight();
            }
            else if (_relative == "parent")
            {
                //get bounds with local position
                _objectBounds.left = _objectJQuery.position().left;
                _objectBounds.top = _objectJQuery.position().top;

                _objectBounds.right = _objectBounds.left + _objectJQuery.outerWidth();
                _objectBounds.bottom = _objectBounds.top + _objectJQuery.outerHeight();
            }
            else if (_relative == "screen")
            {
                //get bounds with screen position
                _objectBounds = _object.getBoundingClientRect();
            }
            else
            {
                console.warn("Bounds relative: " + _relative + " is not an option");
                return null;
            }

            //remove css class and check children
            _objectJQuery[0].classList.remove("notransition");

            if (_includeChildren)
            {
                //loop through all children and find largest bounds
                $(_object).find(_includeChildren).each(function() {

                    //get child bounds and check if child bounds are outside parent bounds
                    var _tempBounds = cMaths.Bounds.fromObject(this, "document");

                    if (_tempBounds.x1 < _objectBounds.left)
                    {
                        _objectBounds.left = _tempBounds.x1;
                    }

                    if (_tempBounds.y1 < _objectBounds.top)
                    {
                        _objectBounds.top = _tempBounds.y1;
                    }

                    if (_tempBounds.x2 < _objectBounds.right)
                    {
                        _objectBounds.right = _tempBounds.x2;
                    }

                    if (_tempBounds.y2 < _objectBounds.bottom)
                    {
                        _objectBounds.bottom = _tempBounds.y2;
                    }
                });
            }

            return new bounds(_objectBounds.left,
                                _objectBounds.top,
                                _objectBounds.right,
                                _objectBounds.bottom);
        }
    }

    this.bounds = bounds;

    function line(_x1, _y1, _x2, _y2)
    {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
    }

    line.prototype =
    {
        fromVector2s: function(_pos1, _pos2)
        {
            return new line(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromVector4: function(_vector)
        {
            return new line(_vector.x, _vector.y, _vector.z, _vector.w);
        },

        distance: function () {
            return Math.sqrt(this.distanceSqr());
        },
    
        distanceSqr: function () {
            var deltaX = this.x1 - this.x2;
            var deltaY = this.y1 - this.y2;
            return (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        }
    }

    this.line = line;

}

//hold collision/bounds testing functions
function collisionFunctions()
{

    //return any objects from _objects where object's bounds are within _areaBounds
    this.returnObjectsWithinArea = function(_areaBounds, _objects)
    {
        var ret = [];

        for (var i = 0; i < _objects.length; i++)
        {
            //get object's bounds
            var _otherBounds = cMaths.Bounds.fromObject(_objects[i], false);

            //check if object bounds is within _areaBounds
            if (this.checkAreaWithinArea(_areaBounds, _otherBounds))
            {
                ret.push(_objects[i]);
            }
        }

        return ret;
    }

    //return any objects from _objects where object's bounds intersect _areaBounds
    this.returnObjectsIntersectArea = function(_areaBounds, _objects)
    {
        var ret = [];

        for (var i = 0; i < _objects.length; i++)
        {
            //get object's bounds
            var _otherBounds = cMaths.Bounds.fromObject(_objects[i], false);

            //check if object bounds intersects _areaBounds
            if (this.checkAreaIntersectsArea(_areaBounds, _otherBounds))
            {
                ret.push(_objects[i]);
            }
        }

        return ret;
    }

    //check if a point is within bounds
    this.checkPointWithinArea = function(_areaBounds, _point)
    {
        if (_areaBounds.topLeft.x <= _point.x &&
            _areaBounds.topLeft.y <= _point.y &&
            _areaBounds.bottomRight.x >= _point.x &&
            _areaBounds.bottomRight.y >= _point.y)
        {

            return true;
            
        }

        return false;
    }

    //check if an area is completly within another
    this.checkAreaWithinArea = function(_areaBounds, _otherBounds)
    {
        var _cornersWithin = 0;

        //setup corners to test
        var _pointsToCheck = [_otherBounds.topLeft, _otherBounds.topRight,
                             _otherBounds.bottomLeft, _otherBounds.bottomRight];
             
        //loop through corners and test if they are within the area
        for (var _pointIndex = 0; _pointIndex < 4; _pointIndex++)
        {
            if (this.checkPointWithinArea(_areaBounds, _pointsToCheck[_pointIndex]))
            {
                _cornersWithin++;
            }
        }

        //if all 4 corners within area return true
        if (_cornersWithin == 4)
        {
            return true;
        }

        return false;
    }

    //check if an area is completly enveloped by another
    this.checkAreaEnvelopedByArea = function(_areaBounds, _otherBounds)
    {
        return this.checkAreaWithinArea(_otherBounds, _areaBounds);
    }

    //check if an area intersects another anywhere
    this.checkAreaIntersectsArea = function(_areaBounds, _otherBounds)
    {

        //setup corners of _otherBounds and check if they are inside _areaBounds
        var _pointsToCheck = [new cMaths.vector2(_otherBounds.topLeft.x, _otherBounds.topLeft.y),
                                new cMaths.vector2(_otherBounds.bottomRight.x, _otherBounds.topLeft.y),
                                new cMaths.vector2(_otherBounds.bottomRight.x, _otherBounds.bottomRight.y),
                                new cMaths.vector2(_otherBounds.topLeft.x, _otherBounds.bottomRight.y)];

        for (var i = 0; i < 4; i++)
        {
            if (this.checkPointWithinArea(_areaBounds, _pointsToCheck[i]))
            {
                return true;
            }
        }

        //setup all lines from _areaBounds and _otherBounds and check if they intersect
        var _linesToCheck = [cMaths.Line.fromVector2s(_otherBounds.topLeft, _otherBounds.topRight),
            cMaths.Line.fromVector2s(_otherBounds.topRight, _otherBounds.bottomRight),
            cMaths.Line.fromVector2s(_otherBounds.bottomRight, _otherBounds.bottomLeft),
            cMaths.Line.fromVector2s(_otherBounds.bottomLeft, _otherBounds.topLeft)];

        var _linesToCheckAgainst = [cMaths.Line.fromVector2s(_areaBounds.topLeft, _areaBounds.topRight),
            cMaths.Line.fromVector2s(_areaBounds.topRight, _areaBounds.bottomRight),
            cMaths.Line.fromVector2s(_areaBounds.bottomRight, _areaBounds.bottomLeft),
            cMaths.Line.fromVector2s(_areaBounds.bottomLeft, _areaBounds.topLeft)];

        //do line intersect tests
        for (var line1 = 0; line1 < 4; line1++)
        {
            for (var line2 = 0; line2 < 4; line2++)
            {
                if (cMaths.lineMaths.lineIntersectionWithin(_linesToCheck[line1],_linesToCheckAgainst[line2]))
                {
                    return true;
                }
            }
        }

        return false;
    }

}

//Holds line functions
function lineMathFunctions()
{

    //find and return intersection point of lines if result is
    //within the two lines
    this.lineIntersectionWithin = function(_line1, _line2)
    {
        var _intersection = this.lineIntersection(_line1, _line2);

        if (_intersection == null) {return null;}

        //check if line interception is within line 1 x
        if (_line1.x1 >= _line1.x2)
        {
            if (cMaths.maths.between(_line1.x2, _intersection.x, _line1.x1, 0.000002) == false) {return null;}
        } else {
            if (cMaths.maths.between(_line1.x1, _intersection.x, _line1.x2, 0.000002) == false) {return null;}
        }

        //check if line interception is within line 1 y
        if (_line1.y1 >= _line1.y2)
        {
            if (cMaths.maths.between(_line1.y2, _intersection.y, _line1.y1, 0.000002) == false) {return null;}
        }
        else
        {
            if (cMaths.maths.between(_line1.y1, _intersection.y, _line1.y2, 0.000002) == false) {return null;}
        }

        //check if line interception is within line 2 x
        if (_line2.x1 >= _line2.x2)
        {
            if (cMaths.maths.between(_line2.x2, _intersection.x, _line2.x1, 0.000002) == false) {return null;}
        } else {
            if (cMaths.maths.between(_line1.x1, _intersection.x, _line1.x2, 0.000002) == false) {return null;}
        }

        //check if line interception is within line 2 y
        if (_line2.y1 >= _line2.y2)
        {
            if (cMaths.maths.between(_line2.y2, _intersection.y, _line2.y1, 0.000002) == false) {return null;}
        }
        else
        {
            if (cMaths.maths.between(_line2.y1, _intersection.y, _line2.y2, 0.000002) == false) {return null;}
        }

        return _intersection;
    }

    //return the line intersection point
    this.lineIntersection = function(_line1, _line2)
    {
        //Do line intersection calculation stuff? 
        //en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Mathematics

        var _lineIntersect = {
            x : null,
            y : null
        }

        var div = (_line1.x1 - _line1.x2) * (_line2.y1 - _line2.y2)
                - (_line1.y1 - _line1.y2) * (_line2.x1 - _line2.x2);

        _lineIntersect.x = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.x1 - _line2.x2) 
            - (_line1.x1 - _line1.x2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.x /= div;
        
        _lineIntersect.y = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.y1 - _line2.y2) 
            - (_line1.y1 - _line1.y2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.y /= div;

        //check values are valid
        if (isNaN(_lineIntersect.x) || isNaN(_lineIntersect.y) )
        {
            return null;
        }

        return _lineIntersect;
    }
    
}

//Holds math functions
function mathFunctions()
{

    //check if value between min/max with epsilon accuracy
    this.between = function(_min, _val, _max, _eps)
    {
        var _eps = _eps || 0;
        return (_min - _eps < _val  && _val < _max + _eps);
    }

}


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

            function opacityChange(_tick)
            {
                if (_tick < currentDelay)
                {
                    if (element.elementEnabled == true)
                    {
                        return false;
                    }
                }
                else
                {
                    if (element.elementEnabled == false)
                    {
                        htmlOverlayPanel.style.visibility = "hidden";
                        cCss.style.addStyleProperty(htmlOverlayPanel,
                            new cCss.styleModificationData("z-index",
                                0
                            )
                        );
                    }

                    return false;
                }
            }
            
            new cTimer.realtimeTimer(opacityChange, true, currentDelay + 1);
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
}


/*
	Title:
		Elements Groups
	
	Description:
		Attempt at making a grouping system to hold elements
*/

var cElementGroup = window.cElementGroup || new function cElementGroup()
{
	//===LOCAL VARIABLES===//
	this.elementGroupArray = [];

    //====DATA TYPES====//
	this.dataTypes = new cElementGroupDataTypes();
	
	this.ElementGroup = this.dataTypes.elementGroup.prototype;
	this.elementGroup = this.dataTypes.elementGroup;

	//====FUNCTIONS====//
	this.setup = cElementGroupSetupFunctions();
	this.search = cElementGroupSearchFunctions();

	//===RUN-TIME FUNCTIONS===//
	(function setupElementGroupListenerCreation()
    {
        
        //check if cEventListener has been defined
        if (typeof cEventListener !== 'undefined')
        {           
            //add element group registration to event listeners
            cEventListener.generic.addRegistrationFunction("elementGroup",
                { 
                    getRegisterQueueType : 
                        function (_data) 
                        {
                            return window.cElementGroup.search.returnElementGroupFromID(_data.message).eventListener;
                        }  
                }
            );
        }
        else
        {
            //retry in 10ms if undefined
            setTimeout(function() { setupElementGroupListenerCreation(); }, 10);
        }
        
    })();
}

function cElementGroupDataTypes()
{
	this.elementGroup = function elementGroup(_ID, _elementsInGroup, _eventListener)
	{
		this.ID = _ID || cElement.uniqueID;
		this.elementsInGroup = _elementsInGroup || [];
		this.eventListener = _eventListener || new cEventListener.listener();

		var currentElementGroup = this;
        
        this.eventListener.messagesListeningTo.push(
            new cEventListener.basicMessage('listenToToggleElementToEnableStatus', 
            { 
                receiveMessage : function (_data) 
                {
					/*
                    cElement.modify.toggleElement(currentElement.ID,
                                                    _data.message,
                                                    _data.senderListener.message.message
												);
					*/
					//Relay Message Data To Elements
                }
            }
            )
        );

        this.eventListener.messagesListeningTo.push(
            new cEventListener.basicMessage('listenToToggleElementToDisableStatus', 
            { 
                receiveMessage : function (_data) 
                {
					/*
                    cElement.modify.toggleElement(currentElement.ID,
                                                    _data.message,
                                                    _data.senderListener.message.message
												);
					*/
					//Relay Message Data To Elements
                }
            }
            )
        );}
}

function cElementGroupSetupFunctions()
{
	//add a new element group to the array
	this.addElementGroup = function addElementGroup(_ID, _elementsInGroup)
	{
		//find if element group exists
		var _elementGroupExists = cElementGroup.search.returnElementGroupIndexFromID(_ID);

		if (_elementGroupExists == -1)
		{
			//element group doesn't exist so add it to array and return the new group
			var _elementGroup = new cElementGroup.elementGroup(_ID, _elementsInGroup);
			cElementGroup.elementGroupArray.push(_elementGroup);

			return _elementGroup;
		}
		
		//element group already exists so exit
		return null;
	}

	//remove an element group from the array
	this.removeElementGroup = function removeElementGroup(_ID)
	{
		//find if element group exists
		var _elementGroupExists = cElementGroup.search.returnElementGroupIndexFromID(_ID);

		if (_elementGroupExists == -1)
		{
			//remove the element group and return true
			cElementGroup.elementGroupArray.splice(_elementGroupExists, 1);

			return true;
		}

		//element group doesn't exist so return false
		return false;
	}
}

function cElementGroupSearchFunctions()
{
	//return the element group with _ID
	this.returnElementGroupFromID = function returnElementGroupFromID(_ID)
	{
		//find the index for the element group
		var _index = cElementGroup.search.returnElementGroupIndexFromID(_ID);

		//check index is valid
		if (_index != -1)
		{
			//return the element group at index
			return cElementGroup.elementGroupArray[_index];
		}

		//return null as no element group exists
		return null;
	}

	//return the index of element group with _ID
	this.returnElementGroupIndexFromID = function returnElementGroupIndexFromID(_ID)
	{
		//loop through all element groups and find the index with _ID
		for (var i = 0; i < cElementGroup.elementGroupArray.length; i++)
		{
			//check ID's match
			if (cElementGroup.elementGroupArray[i].ID == _ID)
			{
				//return index;
				return i;
			}
		}

		//return -1 as no element group exists
		return -1;
	}
}


/*
	Title:
		Custom Event Listener
	
	Description:
		Attempt at making an event listener 
*/

//Main Type
window.cEventListener = window.cEventListener || new function customEventListener() 
{
    //====VARIABLES====//

    //setup variables
    //default listener ID to stop IDs from overlapping
    this.uniqueListenerID = 0;

    //store all listeners in an easy to access place
    this.allListeners = [];

    //store all listeners waiting to be registered
    //also store any custom functions that have been added to
    //handle the registration of listeners
    this.listenerRegistrationQueue = [];
    this.listenerRegistrationFunctions = [];

    //store scaled time for timer for registering queue listeners
    this.listenerRegistrationQueueScaledTimer = 
    [
        {threshold : 0, interval : 500},
        {threshold : 10, interval : 1000},
        {threshold : 65, interval : 2000},
        {threshold : 185, interval : 5000}
    ];

    //store timer for registering queue listeners
    this.listenerRegistrationQueueTimer = null;

    //store any messages to be broadcasted (change to priortiy queue list?)
    this.functionWaitingForMessageQueue = [];

    //====DATA TYPES====//
    this.dataTypes = new cEventListenerDataTypes();
    
    //holds basic message information that is used by the event listener
    this.BasicMessage = this.dataTypes.basicMessage.prototype;
    this.basicMessage = this.dataTypes.basicMessage;

    //holds basic listener specific message information
    this.ListenerMessage = this.dataTypes.listenerMessage.prototype;
    this.listenerMessage = this.dataTypes.listenerMessage;

    //holds basic listener specific information for the queue register
    this.listenerQueuerInfo = this.dataTypes.listenerQueuerInfo.prototype;
    this.listenerQueuerInfo = this.dataTypes.listenerQueuerInfo;

    //holds all the main listener specfic information
    this.Listener = this.dataTypes.listener.prototype;
    this.listener = this.dataTypes.listener;

    //====FUNCTIONS====//
    this.generic = new cEventListenerGenericFunctions();
    this.queue = new cEventListenerQueueFunctions();
    this.search = new cEventListenerSearchFunctions();
    this.message = new cEventListenerMessageFunctions();

    //===RUN TIME===//
    //initiate and run event listener on MooD page load
    (function initiateEventListener()
    {
        //check if Salamander/MooD has been setup
        if (Salamander.lang.isSysDefined())
        {		
            if (Sys.WebForms)
            {
                if (Sys.WebForms.PageRequestManager)
                {
                    if (Sys.WebForms.PageRequestManager.getInstance())
                    {
                        //add eventListenerPageLoaded to run on page load
                        Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cEventListener.generic.eventListenerPageLoaded);
                        return;
                    }
                }
            }	
        }
        
        //if Salamander/MooD hasn't been setup then retry in 10ms
        setTimeout(function() { initiateEventListener(); },10);
    })();
}

function cEventListenerDataTypes()
{
    //structure of the messages the event listener uses
    //hold basic message data
    this.basicMessage = function basicMessage(_type, _message)
    {
        //force inputted variables to be valid
        this.type = _type || '';
        this.message = _message || '';
    
        //run _messageFunction on _message if available, otherwise return message
        this.evaluateMessage =  function evaluateMessage(_messageFunction, _messageExtras)
        {
            //check if _messageFunction exists otherwise set it to null
            _messageFunction = _messageFunction || 'null';
            _messageExtras = _messageExtras || "";
    
            //check if the message is a custom object
            if (this.message === Object(this.message))
            {
                //check that the custom message function exists
                if (typeof this.message[_messageFunction] === "function")
                {
                    //invoke custom message function on the message
                    return this.message[_messageFunction].call(this.message, _messageExtras);
                }
                
                //return the messageFunction as it isn't
                //a function and is probably a value instead
                return this.message[_messageFunction];
            }
            
            //return evaluated message as the
            //message is a primative type
            //return this.message;

            //return null as no function found
            return null;
        }
    }

    //Holds basic listener messaging information
    this.listenerMessage = function listenerMessage(_listener, _message)
    {	
        this.listener = _listener;
        this.message = _message || new cEventListener.basicMessage('','');
    }

    //holds basic listener information inside a queue to setup listener at intervals
    this.listenerQueuerInfo = function listenerQueuerInfo(_listenerInfo, _listenToInfo)
    {
        this.listenerInfo = _listenerInfo || new cEventListener.listenerMessage(null, null);
        this.listenToInfo = _listenToInfo || new cEventListener.listenerMessage(null, null);
    }

    //hold all information to do with individual listeners
    this.listener = function listener()
    {
        //setup basic variables
        //store what is listening to this listener
        this.listeners = [];

        //store what this listener is listening to
        this.listeningTo = [];

        //store the messages this listener is looking for
        this.messagesListeningTo = [];

        //store ID for listener and increment global listener ID
        this.listenerID = cEventListener.uniqueListenerID;
        var _currentListener = this;

        cEventListener.uniqueListenerID++;

        //handle recieving messages
        this.receiveMessage = function receiveMessage(_sender, _message)
        {
            //loop through all messages this listener is listening to
            for (var i = 0; i < this.messagesListeningTo.length; i++)
            {
                //check if the message type is on of the messages this listener is listening to
                if (_message.type == this.messagesListeningTo[i].type)
                {
                    //check if this listener has a method of handling the message type
                    if (this.messagesListeningTo[i].message != null)
                    {
                        //find any listener specific data attached to this message
                        //NEEDS EDITING LATER                        
                        var _messageType = _message.evaluateMessage(_message.type) || _message.type;

                        var senderListenerIndex = 
                            _currentListener.findListeningTo(
                                _sender.listenerID,
                                _messageType
                            );

                        var senderListenerData = _currentListener.listeningTo[senderListenerIndex];

                        //return the result of the method used to handle this message
                        return this.messagesListeningTo[i].evaluateMessage
                        (
                            "receiveMessage",
                            {   //sender extra message data
                                message: _message,
                                sender: _sender,
                                senderListener: senderListenerData
                            }
                        );
                    }
                }
            }
        }

        //find listener from ID and Type
        this.findListener = function findListener(_id, _type)
        {
            return _currentListener.findListenerIndexInList(_id, _type, _currentListener.listeners);
        }

        //check if listener exists
        this.checkListenerExists = function checkListenerExists(_id, _type)
        {
            return (_currentListener.findListener(_id, _type) != -1)
        }

        //find listeningTo from ID and Type
        this.findListeningTo = function findListeningTo(_id, _type)
        {
            return _currentListener.findListenerIndexInList(_id, _type, _currentListener.listeningTo);
        }

        //check if listenTo exists
        this.checkListeningToExists = function checkListeningToExists(_id, _type)
        {
            return (_currentListener.findListeningTo(_id, _type) != -1)
        }

        //find listener information in list
        this.findListenerIndexInList = function findListenerIndexInList(_id, _type, _list)
        {
            //loop through all _list listeners
            for (var l = 0; l < _list.length; l++)
            {
                //check if listenerID and listenerType are the same
                if (_list[l].listener.listenerID == _id
                    && _list[l].message.type == _type)
                {
                    return l;
                }
            }

            //return -1 if no listener exists
            return -1;
        }
    }
}

function cEventListenerGenericFunctions()
{
    //run any functions needed on page load (Salamader/MooD finished setup)
    this.eventListenerPageLoaded = function eventListenerPageLoaded()
    {
        //remove eventListenerPageLoaded from page loading to stop duplicate responses
        Sys.WebForms.PageRequestManager.getInstance().remove_pageLoaded(cEventListener.generic.eventListenerPageLoaded);
        
        //broadcast ready signal to anything listening
        (function invokeAfterCreation() {
            setTimeout(function() {
                return cEventListener.queue.invokeMessageQueue("afterEventListenerCreation");
            }, 500);
        })();

        /*
        setTimeout(function() 
        {
            cEventListener.queue.invokeMessageQueue("afterEventListenerCreation");
        },100);
        */
        
        //setup interval for registering any listeners in the queue, run every 500ms
        //setInterval(function() { cEventListener.queue.registerListenersInQueue(); },500)
        (function setupScaledTimer() {
            //check if timer exists
            if (cTimer)
            {
                //setup scaled timer
                cEventListener.listenerRegistrationQueueTimer 
                = new cTimer.scaledTimer(
                                            function() {return cEventListener.queue.registerListenersInQueue()}, true, 
                                            cEventListener.listenerRegistrationQueueScaledTimer
                                        );
            }
            else
            {
                //wait until scaled timer exists
                setTimeout(function() { return setupScaledTimer()}, 10);
            }
        })();

    }

    //handle registering listener to "listen to"
    this.registerListener = function registerListener(_listenTo, _listener, _listenerMessage)
    {
        //check if both inputs are valid
        if (_listener && _listenTo)
        {
            //check if listener is not already registered to _listenTo
            if (!_listenTo.checkListenerExists(_listener.listenerID, _listenerMessage.type))
            {
                //add listener to _listenTo listeners
                //and add _listeningTo to listener's listeningTo
                _listenTo.listeners.push(new cEventListener.listenerMessage(_listener, _listenerMessage));
                _listener.listeningTo.push(new cEventListener.listenerMessage(_listenTo, _listenerMessage));

                var message = new cEventListener.basicMessage("registerListenerSuccesful",
                {
                    listeningTo: _listenTo,
                    listener: _listener,
                    message: _listenerMessage,
                    registerListenerSuccesful: function() {
                        return this.message.type;
                    }
                });

                //call register succesful on listener
                cEventListener.message.sendMessage(_listenTo, _listener, message);
                
                return true;

            }
            else
            {
                //log a warning that the _listener is already listening to the _listeningTo with the same message type
                console.warn("Listener already exists with ID: " + _listener.listenerID + " and Type:" + _listenerInfo.type + " Listening to: " + _listenTo.listenerID);
                return false;
            }
        }
        else //log a warning that one of the inputted values does not exist
        {
            console.warn("Listener: " + _listener + " or " + _listenTo + " does not exists");
            return false;
        }
    
    }

    //handle de-registering listener from "listen to"
    this.deregisterListener = function deregisterListener(_listenTo, _listener, _listenerInfo)
    {
        //setup temporary listenerMessages
        var tempListener = new cEventListener.listenerMessage(_listener, _listenerMessage);
        var tempListeningTo = new cEventListener.listenerMessage(_listenTo, _listenerMessage);
        
        //check the listener is valid
        if (_listener)
        {
            //find where the listener is inside _listenTo's listeners
            var listenerIndex = cEventListener.search.findListenerIndexFromIDType(_listener.id, _listener.tpye, _listenTo.listeners);
            
            //check if listener is registered to _listenTo
            if (listenerIndex != -1)
            {
                //remove listener from listenTo
                _listenTo.listeners.splice(listenerIndex,1);
                
                //check if _listenTo exists
                if (_listenTo)
                {
                    //find index for _listenTo inside what _listener is listening too
                    var listeningToIndex = cEventListener.search.findListenerIndexFromIDType(_listenTo.id, _listenerInfo.type, _listener.listeningTo);
                    
                    //check if listenTo is within _listener's listenTo
                    if (listeningToIndex != -1) 
                    {
                        
                        var message = new cEventListener.basicMessage("deregisterListenerSuccesful",
                        {
                            listeningTo: tempListeningTo,
                            listener: tempListener
                        });

                        /*
                        //setup deregister successful message
                        var messageContents = {
                            listeningTo: tempListeningTo,
                            listener: tempListener,
                            message: "deregisterListenerSuccesful"
                        }

                        //create message with type deregister successful and the above message contents
                        var message = new cEventListener.basicMessage("deregisterListenerSuccesful", messageContents);
                        */

                        //call deregister succesful on listener
                        cEventListener.message.sendMessage(_listenTo, _listener, message);
                        
                        //remove listenTo from listener
                        _listener.listeningTo.splice(listeningToIndex,1);
                    }
                }
                
                //NEEDS EDITING LATER
                return true;
            }
            else
            {
                console.warn (_listener + " Does not exist within " + _listenTo + "'s listeners");
                return false;
            }
        }
        
        console.warn ("_listener is an invalid input: " + _listener);
        return false;
    }

    //add queue registration function
    this.addRegistrationFunction = function addRegistrationFunction(_queueType, _queueFunction)
    {
            //find queueFunction index
            var registraitonFunction = cEventListener.search.findRegistrationFunction(_queueType);
            
            //check index exists
            if (registraitonFunction == null)
            {
                //add new function to the list of registration functions
                cEventListener.listenerRegistrationFunctions.push(new cEventListener.basicMessage(_queueType, _queueFunction));
                return true;
            }
            
            //display warning that there is already a function with the same type 
            console.warn("Queue Registration Function Already Exists With Type: " + _queueType);
    }
    
    //remove queue registration function
    this.removeRegistrationFunction = function removeRegistrationFunction(_queueType)
    {
            //find queueFunction index
            var registraitonFunction = cEventListener.search.findRegistrationFunction(_queueType);
            
            //check index exists
            if (registraitonFunction != null)
            {
                //remove function from the list of registration functions
                cEventListener.listenerRegistrationFunctions.splice(registraitonFunction, 1);
                return true;
            }
            
            //display warning that the function doesn't exist with _queueType
            console.warn("Queue Registration Function Does Not Exist With Type: " + _queueType);
    }

    //add waiting for message functions to array
    this.addFunctionToWaitingForMessage = function addFunctionToWaitingForMessage(_messageType, _messageFunction)
    {
        //add message to function array
        cEventListener.functionWaitingForMessageQueue.push(new cEventListener.basicMessage(_messageType, _messageFunction));
    }

    //remove waiting for message functions
    this.removeFunctionFromWaitingForMessage = function removeFunctionFromWaitingForMessage(_messageType, _messageFunction)
    {
        //store current index of message
        var currentIndex = -1;

        //loop until all messages have been removed
        do {

            //store the next index of _messageType/_messageFunction
            currentIndex = cEventListener.search.returnFunctionWaitingForMessageIndex(_messageType, _messageFunction);

            //check if current index is not null
            if (currentIndex != -1)
            {
                //remove current index from array
                cEventListener.functionWaitingForMessageQueue.splice(currentIndex, 1);
            }

        } while (currentIndex != -1);

    }
}

function cEventListenerQueueFunctions()
{
    //run all setup listener functions
    this.invokeMessageQueue = function invokeMessageQueue(_functionType)
    {
        //loop through all functions within the current message queue
        for (var l = 0; l < cEventListener.functionWaitingForMessageQueue.length; l++)
        {
            //check if message type is the same as _functionType
            if (cEventListener.functionWaitingForMessageQueue[l].type == _functionType)
            {
                //invoke the "setupFunction" of that message
                cEventListener.functionWaitingForMessageQueue[l].evaluateMessage("setupFunction");
                cEventListener.functionWaitingForMessageQueue.splice(l,1);
                l--;
            }
        }
    }

    //loop through listeners waiting to be registered and register them
    this.registerListenersInQueue = function registerListenersInQueue () 
    {
        console.log("Executed Queue Register");

        //store if any listener has been registered for scaled timer purposes
        var _listenerHasBeenRegistered = false;

        //run any functions that are waiting for registration of listeners to start
        cEventListener.queue.invokeMessageQueue("registeringListeners");
	
        //loop through all listeners in queue
        for (var l = 0; l < cEventListener.listenerRegistrationQueue.length; l++)
        {
        
            //check listener data exists
            var listener = null;
            if (typeof cEventListener.listenerRegistrationQueue[l].returnListener != "undefined")
            {
                //get listener data based on registration function information
                //listener = cEventListener.search.returnQueueListener(cEventListener.listenerRegistrationQueue[l].listenerInfo);
                if (typeof cEventListener.listenerRegistrationQueue[l].returnListener == "function")
                {
                    listener = cEventListener.listenerRegistrationQueue[l].returnListener();
                }
                else
                {
                    listener = cEventListener.listenerRegistrationQueue[l].returnListener;
                }
            }
            else
            {
                //warn that some of the information doesn't exist and then remove it from the list
                console.warn("Warning: Failed To Register Due To Listener Data Not Existing");
                console.warn(cEventListener.listenerRegistrationQueue[l]);
                cEventListener.listenerRegistrationQueue.splice(l,1);
                continue;
            }
            
            //check listenTo data exists
            var listenTo = null;
            if (typeof cEventListener.listenerRegistrationQueue[l].returnListenTo != "undefined")
            {
                //get listener data based on registration function information
                //listener = cEventListener.search.returnQueueListener(cEventListener.listenerRegistrationQueue[l].listenerInfo);
                if (typeof cEventListener.listenerRegistrationQueue[l].returnListenTo == "function")
                {
                    listenTo = cEventListener.listenerRegistrationQueue[l].returnListenTo();
                }
                else
                {
                    listenTo = cEventListener.listenerRegistrationQueue[l].returnListenTo;
                }
            }
            else
            {
                //warn that some of the information doesn't exist and then remove it from the list
                console.warn("Warning: Failed To Register Due To ListenTo Data Not Existing");
                console.warn(cEventListener.listenerRegistrationQueue[l]);
                cEventListener.listenerRegistrationQueue.splice(l,1);
                continue;
            }
            
            //check if listener and listenTo exist
            if (listener && listenTo)
            {
                //try to register listener
                if (cEventListener.generic.registerListener(listenTo, listener, cEventListener.listenerRegistrationQueue[l].message))
                {
                    //if succesful then pop listener from register
                    cEventListener.listenerRegistrationQueue.splice(l,1);
                    l--;
                    _listenerHasBeenRegistered = true;
                }
            }
        }
        
        //run any functions that are waiting for registration of listeners to finish
        cEventListener.queue.invokeMessageQueue("registeredListeners");

        return _listenerHasBeenRegistered;
    }
}

function cEventListenerSearchFunctions()
{
    //return if the listener is in a list
    this.checkListenerInList = function checkListenerInList(_ID, _type, _list)
    {
        //return true if index exists otherwise return false
        return cEventListener.search.findListenerIndexFromIDType(_ID, _type, _list) != -1;
    }

    //return the index of a listener in a list
    this.findListenerIndex = function findListenerIndex(_listenerMessage, _list)
    {
        //loop through _list
        for (var l = 0; l < _list.length; l++)
        {
            //check if listenerID and listenerType are the same
            if (_list[l].listener.listenerID == _listenerMessage.listener.listenerID
                && _list[l].message.type == _listenerMessage.message.type)
            {
                return l;
            }
        }

        console.warn(_listenerMessage.listener.listenerID + " does not exist in list");
        return -1;
    }

    //return the index of a listener in a list from ID/type
    this.findListenerIndexFromIDType = function findListenerIndexFromIDType(_ID, _type, _list)
    {
        //loop through _list
        for (var l = 0; l < _list.length; l++)
        {
            //check if listenerID and listenerType are the same
            if (_list[l].listener.listenerID == _ID
                && _list[l].message.type == _type)
            {
                return l;
            }
        }

        console.warn("Either: ID: " + _ID + " Or Type: " + _type + " does not exist in List: " + _list);
        return -1;
    }

    //return the index of a registration function with the type _queueType
    this.findRegistrationFunction = function findRegistrationFunction(_queuerType)
    {
        //Loop through all registration functions
        for (var l = 0; l < cEventListener.listenerRegistrationFunctions.length; l++)
        {
            //check if function type is the same as _queueType
            if (cEventListener.listenerRegistrationFunctions[l].type == _queuerType)
            {
                return l;
            }
        }
        
        return null;
    }

    //returns queueListener based on custom registration functions
    this.returnQueueListener = function returnQueueListener(_data)
    {
        //find queueFunction index
        var registraitonFunction = cEventListener.search.findRegistrationFunction(_data.type);
        
        //check index exists
        if (registraitonFunction != null)
        {
            //return the queue listener based on _data
            return cEventListener.listenerRegistrationFunctions[registraitonFunction].evaluateMessage("getRegisterQueueType", _data);
        }
        
        //return null if no custom type found
        return null;
    }

    //returns the message 
    this.returnFunctionWaitingForMessageIndex = function returnFunctionWaitingForMessageIndex(_messageType, _messageFunction)
    {
        //check if message function has been entered
        var _messageFunction = _messageFunction || "";

        //loop through all messages in the "waiting" array
        for (var a = 0; a < cEventListener.functionWaitingForMessageQueue.length; a++)
        {
            //store the current array index to shorten typing
            var currentFunction = cEventListener.functionWaitingForMessageQueue[a];

            //check if _messageFunction is empty
            if (_messageFunction != "")
            {
                //check the _messageType's match
                if (_messageType == currentFunction.type)
                {
                    //return current index
                    return a;
                }
            }
            else
            {
                //check if _messageType's and _messageFunction's match
                if (_messageType == currentFunction.type &&
                    _messageFunction == currentFunction.message.toString())
                {
                    //return current index
                    return a;
                }
            }
        }

        //return null
        return -1;
    }
}

function cEventListenerMessageFunctions()
{
    //handle sending _message from _sender to _listener
    this.sendMessage = function sendMessage(_sender, _listener, _message)
    {
        //invoke receiveMessage on listener
        _listener.receiveMessage(_sender, _message);
    }

    //handle sending _message to all listeners listening to _sender
    this.broadcastMessageAll = function broadcastMessageAll(_sender, _message)
    {
        //loop through all listeners and send message
        for (var l = 0; l < _sender.listeners.length; l++)
        {
            //send message to current listener
            cEventListener.message.sendMessage(_sender, _sender.listeners[l].listener, _message);
        }
    }

    //send message to all of type _listenerType
    this.sendMessageToType = function sendMessageToType(_sender, _message)
    {
        //loop through all listeners
        for (var l = 0; l < _sender.listeners.length; l++)
        {
            //check if listener type is the same as the message type
            if (_sender.listeners[l].message.type == _message.type)
            {
                //send message to current listener
                cEventListener.message.sendMessage(_sender, _sender.listeners[l].listener, _message);
            }
        }
    }

    //handle custom message seperation
    this.parseCustomHTMLData = function parseCustomHTMLData(_infoToParse) 
    {
        //split html to correct format
        var infoParsedString = _infoToParse.replace(/\t/g, "");
        var infoSplitStrings = infoParsedString.split("|");
        var parsedInfo = [];
                    
        //loop through inputted strings and pull out useable data from them
        for (var parsedInfoIndex = 0; parsedInfoIndex < infoSplitStrings.length; parsedInfoIndex++)
        {
            parsedInfo.push(infoSplitStrings[parsedInfoIndex].split("=")[1]);
        }
        
        //return parsed data
        return parsedInfo || [];
    }

    //handle parsing single message into sub messages
    this.parseIntoMessages = function parseIntoMessages(_message)
    {
        var _messages = [];
    
        //check message exists
        if (_message)
        {
            this._actualMessage = null;
    
            //check if message has a function to return data
            if (_message instanceof Function)
            {
                _message(this);
            }
            else
            {
                this._actualMessage = _message;
            }
    
            //check if actual message exists
            if (this._actualMessage)
            {
                if (this._actualMessage instanceof Array)
                {
                    //if message is already an array
                    //presume it's already messages
                    return this._actualMessage;
                }
                else
                {
                    //add message to return as it is in
                    //a message format
                    _messages.push(this._actualMessage);
                }
            }
        }
    
        //if element messages exist then return that
        //otherwise return null
        if (_messages.length != 0)
        {
            return _messages;
        }
        return null;
        
    }

    //find and return messages of type from message list
    this.findMessageOfType = function findMessageOfType (_type, _messages)
    {
        //check if messages exists
        if (_messages)
        {
            //convert messages into array
            var parsedMessages = cEventListener.message.parseIntoMessages(_messages);

            //check parsed messages exist
            if (parsedMessages)
            {
                //check if messages is an array
                if (parsedMessages instanceof Array)
                {
                    //loop through messages and return of type
                    for (var i = 0; i < parsedMessages.length; i++)
                    {
                        if (parsedMessages[i].messageType == _type)
                        {
                            return parsedMessages[i].message;
                        }
                    }
                }
            }
        }

        //no message of type exists
        return null;
    }
}


/*
    Title:
        Timer

    Description:
        Used to allow better timing controls over setInterval
*/

window.cTimer = window.cTimer || new function cTimer()
{
    //====VARIABLES====//
    this.timers = [];
    this.uniqueTimerID = 10000;

    //====DATA TYPES====//
    this.dataTypes = new cTimerDataTypes();

    this.Timer = this.dataTypes.timer.prototype;
    this.timer = this.dataTypes.timer;

    this.ScaledTimer = this.dataTypes.scaledTimer.prototype;
    this.scaledTimer = this.dataTypes.scaledTimer;

    this.RealtimeTimer = this.dataTypes.realtimeTimer.prototype;
    this.realtimeTimer = this.dataTypes.realtimeTimer;

    //====FUNCTIONS====//
    this.generic = new cTimerFunctions();

}

function cTimerDataTypes()
{
    //holds specific timer data for individual timers
    this.timer = function timer(_callBack, _timing, _startOnCreation)
    {
        //store basic variables for timer
        this.interval = _timing || 0;
        this.running = _startOnCreation || false;
        this.pausedAt = 0;
        this.lastCompletion = 0;
        this.callBack = _callBack || null;
        this.timeout = null;
        this.timerID = cTimer.uniqueTimerID++;

        //will start the timer
        this.start = function()
        {
            this.running = true;
            this.loop();
        }

        //will stop the timer
        //and reset pausedAt
        this.stop = function()
        {
            this.running = false;
            this.pausedAt = 0;
            window.clearTimeout(this.timeout);
        }

        //will stop and then start
        //the timer again
        this.restart = function()
        {
            this.stop();
            this.start();
        }

        //will stop the timer and
        //record when it was paused
        this.pause = function()
        {
            if (this.running)
            {
                this.stop();
                this.pausedAt = Date.now();
            }
        }

        //will run start, only if timer is
        //currently not running
        this.resume = function()
        {
            if (!this.running)
            {
                this.start();
            }
        }
        //allow both unpause and resume
        //to do the same thing
        this.unpause = this.resume;

        //On start of timer calculate
        //the required timeout time,
        //start and store the timeout
        this.loop = function()
        {
            var currentInterval = this.interval;

            if (this.pausedAt != 0)
            {
                currentInterval = currentInterval - (this.pausedAt - this.lastCompletion);
                this.pausedAt = 0;
            }

            var _this = this;
            this.timeout = window.setTimeout(function() { _this.runLoop() }, currentInterval);
        }

        //on the end of every loop run this function
        //to calculate 
        this.runLoop = function()
        {
            this.lastCompletion = Date.now();
            this.callBack();
            if (this.running)
            {
                this.loop();
            }
        }

        //add current timer to list of timers
        cTimer.timers.push(this);

        //if start on creation is true then
        //run the timer when it is created
        if (_startOnCreation === true)
        {
            this.start();
        }

        return this.timerID;
    }

    //holds specific timer data with scaling time based on results
    this.scaledTimer = function scaledTimer(_callBack, _startOnCreation, _timeScalers)
    {
        //setup timer for current scaled timer
        this.scaledCallBack = _callBack;

        //store time scaling variables
        this.currentFailedCount = 0;
        this.timeScalers = _timeScalers || [];

        //function as intermediary for
        //time scaling
        var _this = this;

        //loop through all time scalers and find current
        //scaled time for failed count
        this.findCurrentTimeScaler = function findCurrentTimeScaler()
        {
            //loop through all time scalers
            for (var s = 0; s < this.timeScalers.length - 1; s++)
            {
                //check if current the time scaler threshold is above failed count
                if (this.timeScalers[s + 1].threshold >= this.currentFailedCount)
                {
                    //store previous level of
                    //time scaler
                    return this.timeScalers[s];
                }
            }

            //check if timeScalers length is greater than 0
            if (this.timeScalers.length == 0)
            {
                //No time scalers supplied
                console.warn("No time scalers supplied to timer");
                return null;
            }

            //couldn't find scaler so return last possible scaler
            return this.timeScalers[this.timeScalers.length - 1];
        }
        
        this.waitForTimer = function waitForTimer()
        {
            //invoke the original callback and store
            //the value to see if it has succeeded
            var succeeded = _this.scaledCallBack();

            //check if the above succeeded
            if (succeeded == false)
            {
                //add to current failed count
                _this.currentFailedCount++;

                //change interval of timer to new scaled interval
                //use "this" as current function is timer's callback
                this.interval = _this.findCurrentTimeScaler().interval;
            }
            else
            {
                //check if the function had failed before
                if (_this.currentFailedCount != 0)
                {     
                    //reset failed count
                    //once it has succeeded
                    _this.currentFailedCount = 0;

                    //change interval of timer to new scaled interval
                    //use "this" as current function is timer's callback
                    this.interval = _this.findCurrentTimeScaler().interval;
                }
            }
        }

        //create timer with the callback of "waitForTimer"
        cTimer.timer.call(this, this.waitForTimer, _timeScalers[0].interval, _startOnCreation);
    }

    //holds specific real-time timer data
    this.realtimeTimer = function realtimeTimer(_callBack, _startOnCreation, _runTime)
    {
        //setup timer for current scaled timer
        this.realtimeCallBack = _callBack;

        //store timer variables
        this.currentTick = 0;
        this.maxTick = _runTime || Number.MAX_SAFE_INTEGER;
        var _this = this;

        //wait and respond to timer
        this.waitForTimer = function waitForTimer()
        {
            //update callback and test if continue
            var _cont = _this.realtimeCallBack(_this.currentTick);

            //check if timer has ran out or continue is false
            if (_this.currentTick == _this.maxTick || _cont == false)
            {
                //stop the timer
                //EDIT ADD TIMER REMOVAL
                //cTimer.timers[cTimer.generic.findTimerByID(_this.timerID)].stop();
                _this.stop();
            }
        }

        //create a 1ms timer with the callback wait for timer
        //this.timerID = new cTimer.timer(this.waitForTimer, 1, _startOnCreation);
        cTimer.timer.call(this, this.waitForTimer, 1, _startOnCreation);
    }
}

function cTimerFunctions()
{
    //return the timer with _id
    this.findTimerByID = function (_id)
    {
        //loop through all timer in cTimer
        for (var t = 0; t < cTimer.timers.length; t++)
        {
            //check if the timerID is _id
            if (cTimer.timers[t].timerID == _id)
            {
                //return the timer if it is
                return cTimer.timers[t];
            }
        }
    }

    //run timer function
    this.runTimerFunction = function runTimerFunction(_function, _id)
    {
        //find timer
        var _timer = cTimer.generic.findTimerByID(_id);

        //check timer exists
        if (_timer)
        {
            if (typeof _timer[_function] == "function")
            {
                _timer[_function]();
            }
        }
    }
}


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
				return null;
				break;
		}
		
		//return search to save on typing
		return $('[' + typePrefix + '="' + lowerCaseElementName + '"]');

    }

}
