/**********************************************************************************
* This is a concatenation of all the selected files, including files in subfolders.
* The start and end of each file contains a comment with its name, as well as a
* print statement.
***********************************************************************************

* 21
* 874
* 1628
* 2173
* 2322
* 3102
* 4123
* 4573
* 4655
* 4896
* 5253
* 5555
* 5804
***********************************************************************************/

/*
	Title:
		Buttons
	
	Description:
		Attempt at making an array to hold buttons dynamcally
*/

window.cButton = window.cButton || new function cButton() {
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
	(function setupButtonListenerCreation() {

		//check if cEventListener has been defined
		if (typeof cEventListener !== 'undefined') {
			//add button setup to "EventListenerCreation" 
			cEventListener.generic.addFunctionToWaitingForMessage("afterElementSetup", {
				setupFunction: function () {
					window.cButton.setup.buttonSetup();
				}
			});

			//add button registration to event listeners
			cEventListener.generic.addRegistrationFunction("button", {
				getRegisterQueueType: function (_data) {
					return window.cButton.search.returnButtonListener(_data.type);
				}
			});
		} else {
			//retry in 10ms if undefined
			setTimeout(function () {
				setupButtonListenerCreation();
			}, 10);
		}

	})();
}();

function cButtonDataTypes() {
	this.button = function button(_buttonName, _buttonHTML, _htmlButtonID, _moodButtonID, _buttonElementID, _buttonEnabledByDefault, _canDisableSelf, _onClick, _stopPropagation, _element) {
		this.htmlButtonID = _htmlButtonID;
		this.moodButtonID = _moodButtonID;

		this.tabElementEnabledCount = 0;
		this.tabElementEnabledMax = 0;

		this.elementObj = '';

		this.buttonEnabledByDefault = _buttonEnabledByDefault || false;
		this.canDisableSelf = _canDisableSelf || false;
		this.buttonEnabled = "false";

		this.elementOwned = _element || cElement.generic.addElement({
			name: _buttonName,
			id: _buttonElementID,
			htmlObj: _buttonHTML
		}, _moodButtonID == null ? false : true, null, _buttonElementID);
		this.buttonElementID = this.elementOwned.ID || uniqueID;

		this.onClick = _onClick;
		this.stopProagation = _stopPropagation || false;

		//check if the button has no special onClick
		//if so set it to default toggleButton
		if (this.onClick == null) {
			this.onClick = function () {
				cButton.modify.toggleButtonClick(buttonElementID);
			};
		}

		//check if onClick is in string
		if (typeof this.onClick == "string") {
			//remove quotes from start and end
			this.onClick = this.onClick.substr(1, _buttonData.onClick.length - 2);
		}

		//store a link to this current element for functions below
		var currentButton = this;

		//add on click to object
		$(this.elementOwned.elementObject).click(function (event) {
			currentButton.onClick();
			if (currentButton.stopPropagation) {
				event.stopPropagation();
			}
		});

		this.enable = function () {
			window.cButton.modify.toggleButtonClick(_htmlButtonID, true);
		}

		this.disable = function () {
			window.cButton.modify.toggleButtonClick(_htmlButtonID, false);
		}

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('registerListenerSuccesful', {
				receiveMessage: function (_data) {
					cButton.generic.buttonRegistered(true, currentButton.buttonElementID, _data.message);
				}
			}));

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('deregisterListenerSuccesful', {
				receiveMessage: function (_data) {
					cButton.generic.buttonRegistered(false, currentButton.buttonElementID, _data.message);
				}
			}));

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('listenToElementEnableChange', {
				receiveMessage: function (_data) {
					cButton.generic.buttonUpdateElementCount(currentButton.buttonElementID, _data.message);
				}
			}));

		this.elementOwned.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('updateElementCount', {
				receiveMessage: function (_data) {
					cButton.generic.buttonUpdateElementCount(currentButton.buttonElementID, _data.message);
				}
			}));

	}
}

function cButtonSetupFunctions() {
	//used to create button from other files
	this.createButton = function createButton(_buttonData) {
		//create or find element for button
		var _elementGenerated = cElement.generic.addElement(_buttonData.buttonHTML, _buttonData.isMoodObject, _buttonData.buttonParentObject, _buttonData.id, _buttonData.shownOnDefault);

		//find html data for button
		var moodButton = _elementGenerated.elementObject;
		var buttonGenerated = null;

		//if no element supplied with button
		//then create empty button
		if (moodButton == null) {
			//add and/or get button 
			buttonGenerated = cButton.generic.addButton(_buttonData.name, _buttonData.buttonHTML, _elementGenerated.ID, _elementGenerated.ID,
				_buttonData.elementsToEnable,
				_buttonData.elementsToDisable, _buttonData.enabledOnDefault,
				_buttonData.canDisableSelf, _buttonData.onClick, _buttonData.stopProagation, _buttonData.id);
		} else {
			//add and/or get button 
			buttonGenerated = cButton.generic.addButton(_buttonData.name, _buttonData.buttonHTML, moodButton.id, moodButton.id,
				_buttonData.elementsToEnable,
				_buttonData.elementsToDisable, _buttonData.enabledOnDefault,
				_buttonData.canDisableSelf, _buttonData.onClick, _buttonData.stopProagation, _buttonData.id);
		}

		//modify original id to increase to shorten creation code
		_buttonData.id++;

		//check html data exists
		if (buttonGenerated) {
			//add button activate/deactivate to registeredListeners so it
			//activates/deactivates whenever a new listener is added

			//if enableOnDefault is false then _enable is "true" (disable on toggle)
			//else "false" (enable on toggle)
			var _enabled = '"' + (_buttonData.enabledOnDefault === "false" ||
				_buttonData.enabledOnDefault === false).toString() + '"';

			//toggle button to _enabled status on default
			cEventListener.generic.addFunctionToWaitingForMessage(
				"registeredListeners", {
					setupFunction: function () {
						cButton.modify.toggleButtonClick(buttonGenerated.buttonElementID, _buttonData.enabledOnDefault.toString());
					}
				}
			);

			//return succeeded
			return true;

		}

		//output warning
		console.warn("Warning: Button could not be found: " + _buttonData.name +
			" Check HTML/JS Is Correct Or Button Is Named Correctly In MooD");

		//return failed
		return false;
	}

	//run first pass
	this.buttonSetup = function buttonSetup() {
		//call any functions listening to "beforeButtonSetup"			
		cEventListener.queue.invokeMessageQueue("beforeButtonSetup");

		//find main custom div
		var divHeaders = $('[title="CustomTab"]');

		//setup buttons from main divs
		for (var i = 0; i < divHeaders.length; i++) {
			//find all mood buttons on header
			var headerButtonString = divHeaders[i].getAttribute("moodButtonSetup");

			//check moodButtonSetup exists
			if (headerButtonString) {
				//split header string into header buttons
				var headerButtons = headerButtonString.split("\n");

				//loop through all buttons
				for (var moodIndex = 0; moodIndex < headerButtons.length; moodIndex++) {
					//parse html data
					var buttonInfo = cEventListener.message.parseCustomHTMLData(headerButtons[moodIndex]);

					//check if button info actually has anything in it
					if (buttonInfo[0]) {

						//setup button data for createButton function
						var _buttonData = {
							name: buttonInfo[0],
							id: buttonInfo[1],
							elementsToEnable: buttonInfo[2].split(" "),
							elementsToDisable: buttonInfo[3].split(" "),
							enabledOnDefault: buttonInfo[4],
							canDisableSelf: buttonInfo[5],
							onClick: ('"' + buttonInfo[6] + '"') || null
						};

						//create button 
						cButton.setup.createButton(_buttonData);

					} else {
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
			for (var htmlButtonIndex = 0; htmlButtonIndex < buttons.length; htmlButtonIndex++) {
				//store basic variables for button
				var buttonToCopyStyle = buttons[htmlButtonIndex].getAttribute("buttonToCopyStyle");
				var buttonEnabledByDefault = buttons[htmlButtonIndex].getAttribute("buttonEnabled");
				var buttonCanDisableSelf = buttons[htmlButtonIndex].getAttribute("buttonCanDisable");
				var buttonID = buttons[htmlButtonIndex].getAttribute("elementID");

				//setup button button and add elementGroups
				var elementsToEnable = buttons[htmlButtonIndex].getAttribute("elementsToEnable").split(" ");
				var elementsToDisable = buttons[htmlButtonIndex].getAttribute("elementsToDisable").split(" ");

				//create element for button
				var elementGenerated = cElement.generic.addElement(buttons[htmlButtonIndex].id, "", "tab-button", buttonID);

				//check if style copy exists
				if (buttonToCopyStyle) {
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
				} else {
					//add button with no mood button link
					cButton.generic.addButton(buttons[htmlButtonIndex].id, -1, elementGenerated.ID, elementsToEnable, elementsToDisable, buttonEnabledByDefault, buttonCanDisableSelf, elementGenerated.ID);
				}

				//setup button message for enabledByDefault
				var _buttonEnabledMessage =
					"cButton.modify.toggleButtonClick(" +
					"cUility.findHTMLObjects(" +
					"cElement.search.getElementID(" +
					elementGenerated.ID +
					")))[0],";

				//toggle button on if trueOnDefault is true
				if (buttonEnabledByDefault == "true") {
					//uses 'false' because it's going through a toggle function
					cEventListener.generic.addFunctionToWaitingForMessage("registeredListeners", _buttonEnabledMessage + "'false')");
				} else {
					//uses 'true' because it's going through a toggle function
					cEventListener.generic.addFunctionToWaitingForMessage("registeredListeners", _buttonEnabledMessage + "'true')");
				}
			}

		}

		cEventListener.queue.invokeMessageQueue("afterButtonSetup");
	}
}

function cButtonGenericFunctions() {
	//function to handle when button listener is registered/deregistered
	this.buttonRegistered = function buttonRegistered(_successful, _button, _message) {
		var _registeredMessageType = _message.message.message.type;

		switch (_message.type) {
			//if listener is listening to deregistered element 
			case "registerListenerSuccesful":
			case "degregisterListenerSuccesful":

				if (_registeredMessageType == "listenToElementEnableChange") {

					//var listenerElement = cElement.search.getElementID(_message.message.message.message.id);
					var listenerElement = cElement.search.getElementByListener(_message.message.listener);

					if (listenerElement) {
						if (_successful) {
							if (listenerElement.elementEnabled) {
								//if element was enabled then increase both max and current count
								cButton.generic.buttonUpdateElementCount(_button, new cEventListener.basicMessage(null, "increaseBoth"));
							} else {
								//if element was disabled then increase max count
								cButton.generic.buttonUpdateElementCount(_button, new cEventListener.basicMessage(null, "increase"));
							}
						} else {
							if (listenerElement.elementEnabled) {
								//if element was enabled then decrease both max and current count
								cButton.generic.buttonUpdateElementCount(_button, new cEventListener.basicMessage(null, "decreaseBoth"));
							} else {
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
	this.buttonUpdateElementCount = function buttonUpdateElementCount(_button, _message) {

		var _button = cButton.search.getButtonFromID(_button);
		switch (_message.message) {
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
	this.checkButtonStyle = function checkButtonStyle(_button) {
		if (_button.tabElementEnabledCount <= 0) {
			//if 0 or less elements enabled set style to disabled
			cButton.modify.updateButtonEnabledDisabled(_button, "false", "CustomTabDisabled");
		} else if (_button.tabElementEnabledCount >= _button.tabElementEnabledMax) {
			//if more than or equal to max elements enabled set style to enabled
			cButton.modify.updateButtonEnabledDisabled(_button, "true", "CustomTabEnabled");
		} else {
			//if more than 0 but less than max elements enabled set style to partial
			cButton.modify.updateButtonEnabledDisabled(_button, "partially", "CustomTabPartEnabled");
		}
	}

	//function to add button
	this.addButton = function addButton(_buttonName, _buttonHTML, _htmlButtonID, _moodButtonID, _tabElementsToEnable, _tabElementsToDisable, _buttonEnabledByDefault, _canDisableSelf, _onClick, _stopProagation, _ID) {

		var _buttonEnabledByDefault = _buttonEnabledByDefault || false;
		var _canDisableSelf = _canDisableSelf || false;

		var button = null;

		//check if button exists in buttonArray
		var exists = cButton.search.checkButtonExists(_htmlButtonID, _moodButtonID);
		if (exists == -1) {
			//setup button and add to buttonArray
			button = new cButton.button(_buttonName, _buttonHTML, _htmlButtonID, _moodButtonID, _ID,
				_buttonEnabledByDefault, _canDisableSelf, _onClick, _stopProagation,
				cElement.search.getElementID(_ID));
			cButton.buttonArray.push(button);

			console.log("Created Button with ID: " + _ID);
		} else {
			button = cButton.buttonArray[exists];
			console.log("Button: " + _ID + " Already exists");
		}

		if (_tabElementsToEnable) {
			//register _tabElementsToEnable to listen to button "elementToggleEnable"
			cButton.registration.registerButton(_tabElementsToEnable, button, "listenToToggleElementToEnableStatus");

			//register button to listen to _tabElementsToEnable "elementToggleEnable"
			cButton.registration.registerElement(_tabElementsToEnable, button, "listenToElementEnableChange");
		}

		if (_tabElementsToDisable) {
			//register button to listen to _tabElementsToDisable "elementToggleEnable"
			cButton.registration.registerButton(_tabElementsToDisable, button, "listenToToggleElementToDisableStatus");
		}

		return button;
	}

	//function to remove button
	this.removeButton = function removeButton(_htmlButtonID, _moodButtonID) {
		//check if button exists in buttonArray
		var exists = cButton.search.checkButtonExists(_htmlButtonID, _moodButtonID);

		//check if button exists
		if (exists != -1) {
			//loop through listeners and deregister them
			while (buttonArray[exists].eventListener.listeners.length > 0) {
				cEventListener.generic.deregisterListener(buttonArray[exists], buttonArray[exists].eventListener.listeners[0].listener, buttonArray[exists].eventListener.listeners[0].listenerType, buttonArray[exists].eventListener.listeners[0].listenerExtra);
			}

			//loop through listening too and deregister self from them
			while (buttonArray[exists].listeningTo.length > 0) {
				cEventListener.generic.deregisterListener(buttonArray[exists].eventListener.listeningTo[0].listener, buttonArray[exists], buttonArray[exists].eventListener.listeningTo[0].listenerType, buttonArray[exists].eventListener.listeningTo[0].listenerExtra);
			}

			//Find element attached to button
			var buttonElement = cElement.search.getElementID(buttonArray[exists].buttonElementID);

			///check if button exists
			if (buttonElement) {
				//remove button if it does exist
				cButton.generic.removeElement(buttonElement.elementName, buttonElement.elementExtra, buttonElement.elementType);
			}

			//remove button from buttonArray
			cButton.buttonArray.splice(exists, 1);
			return true;
		}

		//log that button doesn't exsist and return false
		console.log("Button: " + _ID + " Doesn't exist");
		return false;
	}

}

function cButtonRegistrationFunctions() {
	//handle registering the element to listen to the button
	this.registerButton = function registerButton(_elementsInfo, _button, _type) {
		//check if _elementsInfo exists
		if (_elementsInfo) {
			//check _elementsInfo has values
			if (_elementsInfo.length > 0) {
				//loop through all _elementsInfo
				for (var a = 0; a < _elementsInfo.length; a++) {

					//register the button to the element 
					var _registrationContent = {
						listener: _elementsInfo[a].id,
						listenTo: _button,
						message: new cEventListener.basicMessage(_type, _elementsInfo[a]),

						returnListener: function () {
							return cEventListener.search.returnQueueListener(
								new cEventListener.basicMessage(
									"element",
									this.listener
								));
						},

						returnListenTo: function () {
							return this.listenTo.elementOwned.eventListener;
						}
					};

					cEventListener.listenerRegistrationQueue.push(_registrationContent);
				}
			}
		}
	}

	//handle registering the button to listen to element 
	this.registerElement = function registerElement(_elementsInfo, _button, _type) {
		//check if _elementsInfo exists
		if (_elementsInfo) {
			//check _elementsInfo has values
			if (_elementsInfo.length > 0) {
				//loop through all _elementsInfo
				for (var a = 0; a < _elementsInfo.length; a++) {
					//register the button to the element 
					var _registrationContent = {
						listener: _button,
						listenTo: _elementsInfo[a].id,
						message: new cEventListener.basicMessage(_type, _elementsInfo[a]),

						returnListener: function () {
							return this.listener.elementOwned.eventListener;
						},

						returnListenTo: function () {
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
	this.registerButtonToElement = function registerButtonToElement(_tabElements, _button, _type) {
		//check if _tabElements exists
		if (_tabElements) {
			//check if _tabElements has values
			if (_tabElements.length > 0) {
				//loop through _tabElements and register them to _button
				for (var e = 0; e < _tabElements.length; e++) {
					//check if element needs to be split up
					if (typeof _tabElements[e] == "string") {
						//register _tabElements to _button
						var elementSplit = _tabElements[e].split("-");

						var _listenerContents = new cEventListener.basicMessage("element", elementSplit[0]);
						var _listenToContents = new cEventListener.basicMessage("button", _button);
						var _messageContents = new cEventListener.basicMessage(_type, null);

						//check if element has extra data
						if (elementSplit.length > 1) {
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
					} else {
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
	this.registerElementToButton = function registerElementToButton(_tabElements, _button, _type) {
		//check if _tabElements exists
		if (_tabElements) {
			//check if _tabElements has values
			if (_tabElements.length > 0) {
				//loop through _tabElements
				for (var e = 0; e < _tabElements.length; e++) {
					//check if element needs to be split up
					if (typeof _tabElements[e] == "string") {
						//register _tabElements to _button
						var elementSplit = _tabElements[e].split("-");

						var _listenerContents = new cEventListener.basicMessage("button", _button);
						var _listenToContents = new cEventListener.basicMessage("element", elementSplit[0]);
						var _messageContents = new cEventListener.basicMessage(_type, null);

						//check if element has extra data
						if (elementSplit.length > 1) {
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
					} else {
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

function cButtonSearchFunctions() {
	this.checkButtonExists = function checkButtonExists(_htmlButtonID, _moodButtonID) {
		//loop through every button in the array
		for (var i = 0; i < cButton.buttonArray.length; i++) {
			//check if the ButtonID and ButtonNames match
			if (cButton.buttonArray[i].htmlButtonID == _htmlButtonID &&
				cButton.buttonArray[i].moodButtonID == _moodButtonID) {
				//return the current index in the array
				return i;
			}
		}
		//return -1 if not found
		return -1;
	}

	this.getButtonFromID = function getButtonFromID(_ID) {
		//loop through every elementGroup in the array
		for (var i = 0; i < cButton.buttonArray.length; i++) {
			//check if the IDs match
			if (cButton.buttonArray[i].buttonElementID == _ID) {
				//return the button in the array
				return cButton.buttonArray[i];
			}
		}

		//return null if not found
		console.log("Button with ID: " + _ID + " Doesn't exist");
		return null;
	}

	this.getButtonFromHTMLID = function getButtonFromHTMLID(_ID) {
		//loop through every button in the array
		for (var i = 0; i < cButton.buttonArray.length; i++) {
			//check if the IDs match
			if (cButton.buttonArray[i].htmlButtonID == _ID) {
				//return the button in the array
				return cButton.buttonArray[i];
			}
		}

		//return null if not found
		console.log("Button with ID: " + _ID + " Doesn't exist");
		return null;
	}

	//evaluate listener to variable
	this.returnButtonListener = function returnButtonListener(_listener) {
		//check type of input and return based on that
		if (typeof _listener.message == "string" || typeof _listener.message == "number") {
			//search for element
			var _element = cElement.search.getElementID(_listener.message);

			//if the element exists return the element's listener
			if (_element) {
				return _element.eventListener;
			}
		} else if (_listener.message instanceof cButton.button) {
			//return the listener associated with the button
			return _listener.message.elementOwned.eventListener;
		}

		return null;

	}
}

function cButtonModifyFunctions() {
	//Handles setting custom css for buttons
	this.updateButtonEnabledDisabled = function updateButtonEnabledDisabled(_button, _enabled, _tabEnabled) {
		//set enabled to _enabled
		_button.buttonEnabled = _enabled;

		//find button assosciated with _button
		var buttons = cElement.search.getElementID(_button.buttonElementID).elementObject;

		//check if tab button exists
		if (buttons) {
			//loop through tab buttons
			for (var b = 0; b < buttons.length; b++) {
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
	this.toggleButtonClick = function toggleButtonClick(_htmlButton, _setValue) {
		var htmlButtonIndex = -1;

		//loop through buttons
		for (var g = 0; g < cButton.buttonArray.length; g++) {
			//check both _htmlButton and button at current index
			//are setup correctly
			if (cButton.buttonArray[g].buttonElementID != null &&
				_htmlButton != null) {
				//check id of button matches stored
				if (cButton.buttonArray[g].buttonElementID == _htmlButton) {
					//set the html button index to be current index
					//and break out of the loop
					htmlButtonIndex = g;
					break;
				}
			}
		}

		//check button exists
		if (htmlButtonIndex != -1) {

			//get the current button being referenced
			var htmlButton = cButton.buttonArray[htmlButtonIndex];

			//setup switch value to be toggle
			var switchValue = htmlButton.buttonEnabled;

			switch (switchValue) {
				case "true":
					switchValue = "false";
					break;
				case "false":
					switchValue = "true";
					break;
			}

			//set switch value to _setValue if not null
			if (_setValue != null) {
				switchValue = _setValue;
			}

			//remove any additional "" in switch value
			switchValue = switchValue.replace(/"/g, '');

			//setup message types to decresae the typing later
			var _messages = [new cEventListener.basicMessage("listenToToggleElementToEnableStatus", "enable"),
				new cEventListener.basicMessage("listenToToggleElementToEnableStatus", "disable"),
				new cEventListener.basicMessage("listenToToggleElementToDisableStatus", "enable"),
				new cEventListener.basicMessage("listenToToggleElementToDisableStatus", "disable")
			]

			//enable or disable correct elementGroups
			//EDIT THIS LATER SO THAT IT IS MORE DYNAMIC? POSSIBLY DO NOT RE-ENABLE DISABLED ELEMENTS
			switch (switchValue) {
				case "true":
					//enable itself and disable element it disables
					cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[0]);
					cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[3]);
					break;
				case "false":
					if ((htmlButton.canDisableSelf == true || htmlButton.canDisableSelf == "true") && htmlButton.buttonEnabled == "true") {
						//disable the button's elements and enable any elements it disables
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[1]);
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[2]);
					}
					break;
				case "partially":
					//if button can disable itself then disable 
					if ((htmlButton.canDisableSelf == true || htmlButton.canDisableSelf == "true") && htmlButton.buttonEnabled == "true") {
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[1]);
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[2]);
					} else {
						//otherwise enable itself and disable element it disables
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[0]);
						cEventListener.message.sendMessageToType(htmlButton.elementOwned.eventListener, _messages[3]);
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


/*
	Title:
		Elements
	
	Description:
		Attempt at making an array to hold elements dynamcally
*/

window.cElement = window.cElement || new function cElement() {

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
    (function setupElementListenerCreation() {

        //check if cEventListener has been defined
        if (typeof cEventListener !== 'undefined' &&
                typeof cTimer !== 'undefined') {
            //add element setup to "EventListenerCreation" 
            cEventListener.generic.addFunctionToWaitingForMessage("afterEventListenerCreation", {
                setupFunction: function () {
                    //call any functions listening to "afterElementSetup"
                    new cTimer.timer("Element Wait For Message",
                        new cTimer.callback(
                            function () {
                                cEventListener.queue.invokeMessageQueue("afterElementSetup");
                            }), 100, 10);
                }
            });

            //add element registration to event listeners
            cEventListener.generic.addRegistrationFunction("element", {
                getRegisterQueueType: function (_data) {
                    return window.cElement.search.getElementID(_data.message).eventListener;
                }
            });
        } else {
            //retry in 10ms if undefined
            setTimeout(function () {
                setupElementListenerCreation();
            }, 10);
        }

    })();

}();

function cElementDataTypes() {
    this.element = function element(_elementObject, _moodObject, _elementParentObject, _ID, _enabledByDefault) {
        this.elementObject = _elementObject;
        this.elementParentObject = _elementParentObject || (_moodObject === true ? $(_elementObject).closest(".WebPanelOverlay") : this.elementObject);
        this.ID = _ID || cElement.uniqueID;
        this.elementEnabled = (_enabledByDefault != null ? _enabledByDefault : true);

        if (_ID == cElement.uniqueID) {
            cElement.uniqueID++;
        }

        this.eventListener = new cEventListener.listener();

        //store a link to this current element for functions below
        var currentElement = this;

        this.enable = function () {
            window.cElement.modify.toggleElement(currentElement, new cEventListener.basicMessage(null, true), null);
        }

        this.disable = function () {
            window.cElement.modify.toggleElement(currentElement, new cEventListener.basicMessage(null, false), null);
        }

        if (this.elementEnabled) {
            this.enable();
        } else {
            this.disable();
        }

        this.eventListener.messagesListeningTo.push(
            new cEventListener.basicMessage('listenToToggleElementToEnableStatus', {
                receiveMessage: function (_data) {
                    cElement.modify.toggleElement(currentElement.ID,
                        _data.message,
                        _data.senderListener.message.message
                    );
                }
            })
        );

        this.eventListener.messagesListeningTo.push(
            new cEventListener.basicMessage('listenToToggleElementToDisableStatus', {
                receiveMessage: function (_data) {
                    cElement.modify.toggleElement(currentElement.ID,
                        _data.message,
                        _data.senderListener.message.message
                    );
                }
            })
        );
    }
}

function cElementSetupFunctions() {
    this.createElement = function createElement(_elementData) {
        //check if element info actually has anything in it
        if (_elementData) {
            //create element
            cElement.generic.addElement(_elementData.elementObject, _elementData.isMoodObject, _elementData.elementParentObject, _elementData.id, _elementData.enabledByDefault);

            if (_elementData.onClick) {
                cElement.modify.addOnClickToElement(_elementData.id, _elementData.onClick, true, _elementData.css);
            }

            //modify original id to increase to shorten creation code
            _elementData.id++;
        } else {
            console.warn("Warning: HTML/JS is empty, if not adding elements ignore this");
        }
    }
}

function cElementGenericFunctions() {
    this.addElement = function addElement(_elementObject, _moodObject, _elementParentObject, _ID, _enabledByDefault) {
        var _ID = _ID || cElement.uniqueID;

        var exists = cElement.search.checkElementExists(_elementObject);
        if (exists == -1) {
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
        console.log("Element with id: " + _ID + " Exists");
        return cElement.elementArray[exists];
    }

    this.removeElement = function removeElement(_elementName, _elementExtra, _elementType) {
        //check if the element exists in the array and where
        var exists = cElement.search.checkElementExists(_elementName, _elementExtra, _elementType)
        if (exists != -1) {
            //if the element exists remove it and return true
            var currentElement = cElement.elementArray[exists];

            //loop through all listeners attached to element and remove them
            while (currentElement.listener.length > 0) {
                cEventListener.generic.deregisterListener(currentElement, currentElement.listeners[0].listener, currentElement.listener[0].listenerType, currentElement.listener[0].listenerExtra);
            }

            //loop through all things the element is listening too and remove them
            while (currentElement.listeningTo.length > 0) {
                cEventListener.generic.deregisterListener(currentElement.listeningTo[0].listener, currentElement, currentElement.listeningTo[0].listenerType, currentElement.listeningTo[0].listenerExtra)
            }

            //remove the element from the element array and return true
            cElement.elementArray.splice(exists, 1);
            return true;
        }

        //return false because element doesn't exist
        console.log("Element with name: " + _elementName + " Doesn't Exist");
        return false;
    }
}

function cElementSearchFunctions() {

    //return the element associated with a listener
    this.returnElementListener = function returnElementListener(_listener) {
        //check type of input and return based on that
        if (typeof _listener.message == "string" || typeof _listener.messages == "number") {
            //find the element from an ID
            var _element = cElement.search.getElementID(_listener.message);

            //check if element exists, if so return the listener
            if (_element) {
                return _element.eventListener;
            }
        } else if (_listener.message instanceof cElement.element) {
            return _listener.message.eventListener;
        }

        return null;
    }

    //check element exists and return the index
    this.checkElementExists = function checkElementExists(_elementObject) {
        if (_elementObject == null) return -1;
        for (var i = 0; i < cElement.elementArray.length; i++) {
            //check if the names and role match
            if (cElement.elementArray[i].elementObject == _elementObject) {
                //return the position in the array
                return i;
            }
        }

        //return -1 if not found
        return -1;
    }

    //search for and return the elements with _elementName
    this.getElementByName = function getElementByName(_elementName) {
        //store elements
        var ret = [];

        //loop through every element in the array
        cElement.elementArray.forEach(function (_element, _index, _arr) {
            if (_element.elementName == _elementName) {
                ret.push(_arr[_index]);
            }
        });

        if (ret.length <= 0) {
            //return null if not found
            console.log("Element with name: " + _elementName + " Doesn't exist");
        }

        return ret;
    }

    //return the element with _ID
    this.getElementID = function getElementID(_ID) {
        //loop through every element in the array
        var _ret = null;
        cElement.elementArray.forEach(function (_element, _index, _arr) {
            if (_element.ID == _ID) {
                return _ret = _arr[_index];
            }
        });

        if (_ret) {
            return _ret;
        }

        //return null if not found
        console.log("Element with ID: " + _ID + " Doesn't Exists");
        return null;
    }

    //return the listener 
    this.getElementByListener = function getElementByListener(_listener) {
        //loop through every element in the array
        var _ret = null;
        cElement.elementArray.forEach(function (_element, _index, _arr) {
            if (_element.eventListener.ID == _listener.ID) {
                return _ret = _arr[_index];
            }
        });

        if (_ret) {
            return _ret;
        }
        //return null if not found
        console.log("Element with listener: " + _listener + " Doesn't Exist");
        return null;
    }

}

function cElementModifyFunctions() {
    this.toggleElement = function toggleElement(_element, _enabled, _messageData) {
        var _element = typeof _element == "number" ? cElement.search.getElementID(_element) : _element;

        var _messageData = _messageData || {};

        //check if element isn't null
        if (_element) {
            //find HTML object attached to element
            //var htmlObject = _element.elementObject;

            if (_element.elementObject) {
                //turn message enable/disable into bool
                var _toEnable = (_enabled.message === "enable" || _enabled.message === true);

                //modify the element's extras I.E position and zIndex
                cElement.modify.modifyElementOpacity(_element, _messageData, _toEnable);
                cElement.modify.modifyElementPosition(_element, _messageData);
                cElement.modify.modifyElementSize(_element, _messageData);

                //check if the element now has a different active status and modify
                if (_enabled.message == "enable" && !_element.elementEnabled ||
                    _enabled.message == "disable" && _element.elementEnabled) {
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

    this.modifyElementOpacity = function modifyElementOpacity(_element, _messageData, _enabled) {
        if (_messageData.opacityTime) {
            var _transitionData = ((_messageData.opacityTime || 0) / 1000).toString() + "s";
            _transitionData += " " + (_messageData.opacityTiming || "linear");
            _transitionData += " " + ((_messageData.opacityDelay || 0) / 1000).toString() + "s";

            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "opacity"
            }, true, 2, _transitionData, -1);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        } else {
            var _transitionData = "0s linear 0s";
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "opacity"
            }, true, 2, _transitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        }

        var _opacityTimer = cTimer.generic.findTimerByName("ElementOpacityTimer" + _element.ID);

        if (_opacityTimer) {
            _opacityTimer.destroy();
        }

        if (_enabled) {
            var _zIndexToSet = (_messageData.zIndex == null ? "9000" : _messageData.zIndex);
            var _zIndexImportanceToSet = (_messageData.zIndexImportance == null ? true : _messageData.zIndexImportance);
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
            }, false, null, _opacityToSet.toString(), -1, false, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "visibility",
                cssProp: "visibility"
            }, false, null, "visible", -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

        } else {
            //change html style to be visiblie and set zIndex to default
            var _opacityToSet = _messageData.opacity == null ? 0 : _messageData.opacity;
            var _styleData = new cCss.styleSheetModificationData({
                prop: "opacity",
                cssProp: "opacity"
            }, false, null, _opacityToSet.toString(), -1, false, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            if (_element.elementEnabled == true && _enabled == false) {
                var currentDelay = (_messageData.opacityTime || 0) + (_messageData.opacityDelay || 0);

                var opacityChange = function opacityChange(_args) {
                    if (_args.ticksElapsed < currentDelay) return true;

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

                    return false;
                }

                new cTimer.realtimeTimer("ElementOpacityTimer" + _element.ID, new cTimer.callback(opacityChange, this), true, currentDelay + 1, true);
            } else {
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

    this.modifyElementPosition = function modifyElementPosition(_element, _messageData) {
        //setup position variables
        var _posX = _messageData.posX != null ? _messageData.posX : typeof _messageData.generatePosX == "function" ? _messageData.generatePosX() : null;
        var _posY = _messageData.posY != null ? _messageData.posY : typeof _messageData.generatePosY == "function" ? _messageData.generatePosY() : null;

        var _posXTransitionData = ((_messageData.posXMoveTime || 0) / 1000).toString() + "s" +
            " " + (_messageData.posXTiming || "linear") + " " +
            ((_messageData.posXDelay || 0) / 1000).toString() + "s";

        var _posYTransitionData = ((_messageData.posYMoveTime || 0) / 1000).toString() + "s" +
            " " + (_messageData.posYTiming || "linear") + " " +
            ((_messageData.posYDelay || 0) / 1000).toString() + "s";

        if (_posX) {
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "left"
            }, true, 2, _posXTransitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "left",
                cssProp: "left"
            }, false, 0, _posX + "px", -1, true, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        }

        if (_posY) {
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "top"
            }, true, 2, _posYTransitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "top",
                cssProp: "top"
            }, false, 0, _posY + "px", -1, true, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".Element" + _element.ID, _styleData);
        }
    }

    this.modifyElementSize = function modifyElementSize(_element, _messageData) {
        //setup size variables
        var _width = _messageData.width != null ? _messageData.width : typeof _messageData.generateWidth == "function" ? _messageData.generateWidth() : null;
        var _height = _messageData.height != null ? _messageData.height : typeof _messageData.generateHeight == "function" ? _messageData.generateHeight() : null;

        var _widthTransitionData = ((_messageData.widthChangeTime || 0) / 1000).toString() + "s" +
            " " + (_messageData.widthChangeTiming || "linear") + " " +
            ((_messageData.widthChangeDelay || 0) / 1000).toString() + "s";

        var _heightTransitionData = ((_messageData.heightChangeTime || 0) / 1000).toString() + "s" +
            " " + (_messageData.heightChangeTiming || "linear") + " " +
            ((_messageData.heightChangeDelay || 0) / 1000).toString() + "s";

        if (_width) {
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "width"
            }, true, 2, _widthTransitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".ElementSize" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "width",
                cssProp: "width"
            }, false, 0, _width + "px", -1, true, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".ElementSize" + _element.ID, _styleData);

            $(_messageData.sizeChangePanel).addClass("ElementSize" + _element.ID);
        }

        if (_height) {
            var _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "height"
            }, true, 2, _heightTransitionData, -1, false);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".ElementSize" + _element.ID, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "height",
                cssProp: "height"
            }, false, 0, _height + "px", -1, true, true);
            cCss.styleSheet.replaceCssStyle("MainElementStyles", ".ElementSize" + _element.ID, _styleData);

            $(_messageData.sizeChangePanel).addClass("ElementSize" + _element.ID);
        }
    }

    //add onClick to element's html
    this.addOnClickToElement = function addOnClickToElement(_elementID, _function, _addOrCreate, _css) {
        var _css = _css || null;
        //find all html objects from ID
        var elementObj = cElement.search.getElementID(_elementID)

        if (elementObj) {
            if (elementObj.elementObject == null) {
                console.error("No HTML supplied for: " + _elementID);
                return;
            };
            //add onto onclick
            cUtility.addOnClickToHTML(elementObj.elementObject, _function, _addOrCreate);

            if (_css) {
                //Add css based on button
                elementObj.elementObject.classList.add(_css);
            }
        }
    }
}


/*
	Title:
		Elements Groups
	
	Description:
		Attempt at making a grouping system to hold elements
*/

var cElementGroup = window.cElementGroup || new function cElementGroup() {
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
	(function setupElementGroupListenerCreation() {

		//check if cEventListener has been defined
		if (typeof cEventListener !== 'undefined') {
			//add element group registration to event listeners
			cEventListener.generic.addRegistrationFunction("elementGroup", {
				getRegisterQueueType: function (_data) {
					return window.cElementGroup.search.returnElementGroupFromID(_data.message).eventListener;
				}
			});
		} else {
			//retry in 10ms if undefined
			setTimeout(function () {
				setupElementGroupListenerCreation();
			}, 10);
		}

	})();
}();

function cElementGroupDataTypes() {
	this.elementGroup = function elementGroup(_ID, _elementsInGroup, _eventListener) {
		this.ID = _ID || cElement.uniqueID;
		this.elementsInGroup = _elementsInGroup || [];
		this.eventListener = _eventListener || new cEventListener.listener();

		var currentElementGroup = this;

		this.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('listenToToggleElementToEnableStatus', {
				receiveMessage: function (_data) {
					/*
                    cElement.modify.toggleElement(currentElement.ID,
                                                    _data.message,
                                                    _data.senderListener.message.message
												);
					*/
					//Relay Message Data To Elements
				}
			})
		);

		this.eventListener.messagesListeningTo.push(
			new cEventListener.basicMessage('listenToToggleElementToDisableStatus', {
				receiveMessage: function (_data) {
					/*
                    cElement.modify.toggleElement(currentElement.ID,
                                                    _data.message,
                                                    _data.senderListener.message.message
												);
					*/
					//Relay Message Data To Elements
				}
			})
		);
	}
}

function cElementGroupSetupFunctions() {
	//add a new element group to the array
	this.addElementGroup = function addElementGroup(_ID, _elementsInGroup) {
		//find if element group exists
		var _elementGroupExists = cElementGroup.search.returnElementGroupIndexFromID(_ID);

		if (_elementGroupExists == -1) {
			//element group doesn't exist so add it to array and return the new group
			var _elementGroup = new cElementGroup.elementGroup(_ID, _elementsInGroup);
			cElementGroup.elementGroupArray.push(_elementGroup);

			return _elementGroup;
		}

		//element group already exists so exit
		return null;
	}

	//remove an element group from the array
	this.removeElementGroup = function removeElementGroup(_ID) {
		//find if element group exists
		var _elementGroupExists = cElementGroup.search.returnElementGroupIndexFromID(_ID);

		if (_elementGroupExists == -1) {
			//remove the element group and return true
			cElementGroup.elementGroupArray.splice(_elementGroupExists, 1);

			return true;
		}

		//element group doesn't exist so return false
		return false;
	}
}

function cElementGroupSearchFunctions() {
	//return the element group with _ID
	this.returnElementGroupFromID = function returnElementGroupFromID(_ID) {
		//find the index for the element group
		var _index = cElementGroup.search.returnElementGroupIndexFromID(_ID);

		//check index is valid
		if (_index != -1) {
			//return the element group at index
			return cElementGroup.elementGroupArray[_index];
		}

		//return null as no element group exists
		return null;
	}

	//return the index of element group with _ID
	this.returnElementGroupIndexFromID = function returnElementGroupIndexFromID(_ID) {
		//loop through all element groups and find the index with _ID
		for (var i = 0; i < cElementGroup.elementGroupArray.length; i++) {
			//check ID's match
			if (cElementGroup.elementGroupArray[i].ID == _ID) {
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
window.cEventListener = window.cEventListener || new function customEventListener() {
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
    this.listenerRegistrationQueueScaledTimer = [{
            threshold: 0,
            interval: 500
        },
        {
            threshold: 10,
            interval: 1000
        },
        {
            threshold: 65,
            interval: 2000
        },
        {
            threshold: 185,
            interval: 5000
        }
    ];

    //store timer for registering queue listeners
    this.listenerRegistrationQueueTimer = null;

    //store any messages to be broadcasted (change to priortiy queue list?)
    this.functionWaitingForMessageQueue = [];

    //store any messages broadcasted and ready to be removed
    this.functionWaitingInvoked = [];

    //store if queue invoke process has started
    this.functionQueueProcessStarted = 0;

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
    (function initiateEventListener() {
        //check if Salamander/MooD has been setup
        if (Salamander.lang.isSysDefined()) {
            if (Sys.WebForms) {
                if (Sys.WebForms.PageRequestManager) {
                    if (Sys.WebForms.PageRequestManager.getInstance()) {
                        //add eventListenerPageLoaded to run on page load
                        Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cEventListener.generic.eventListenerPageLoaded);
                        return;
                    }
                }
            }
        }

        //if Salamander/MooD hasn't been setup then retry in 10ms
        setTimeout(function () {
            return initiateEventListener();
        }, 10);
    })();
}();

function cEventListenerDataTypes() {
    //structure of the messages the event listener uses
    //hold basic message data
    this.basicMessage = function basicMessage(_type, _message) {
        //force inputted variables to be valid
        this.type = _type || '';
        this.message = _message || '';

        //run _messageFunction on _message if available, otherwise return message
        this.evaluateMessage = function evaluateMessage(_messageFunction, _messageExtras, _comparison) {
            //check if _messageFunction exists otherwise set it to null
            _messageFunction = _messageFunction || 'null';
            _messageExtras = _messageExtras || "";
            _comparison = _comparison || false;

            //check if the message is a custom object
            if (this.message === Object(this.message)) {
                //check that the custom message function exists
                if (typeof this.message[_messageFunction] === "function") {
                    //check if evaluate message is being used for comparison
                    if (_comparison) {
                        //return the function itself
                        return this.message[_messageFunction];
                    } else {
                        //otherwise invoke custom message function on the message
                        return this.message[_messageFunction].call(this.message, _messageExtras);
                    }
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
    this.listenerMessage = function listenerMessage(_listener, _message) {
        this.listener = _listener;
        this.message = _message || new cEventListener.basicMessage('', '');
    }

    //holds basic listener information inside a queue to setup listener at intervals
    this.listenerQueuerInfo = function listenerQueuerInfo(_listenerInfo, _listenToInfo) {
        this.listenerInfo = _listenerInfo || new cEventListener.listenerMessage(null, null);
        this.listenToInfo = _listenToInfo || new cEventListener.listenerMessage(null, null);
    }

    //hold all information to do with individual listeners
    this.listener = function listener() {
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
        this.receiveMessage = function receiveMessage(_sender, _message) {
            //loop through all messages this listener is listening to
            for (var i = 0; i < this.messagesListeningTo.length; i++) {
                //check if the message type is on of the messages this listener is listening to
                if (_message.type == this.messagesListeningTo[i].type) {
                    //check if this listener has a method of handling the message type
                    if (this.messagesListeningTo[i].message != null) {
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
                        return this.messagesListeningTo[i].evaluateMessage(
                            "receiveMessage", { //sender extra message data
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
        this.findListener = function findListener(_id, _type) {
            return _currentListener.findListenerIndexInList(_id, _type, _currentListener.listeners);
        }

        //check if listener exists
        this.checkListenerExists = function checkListenerExists(_id, _type) {
            return (_currentListener.findListener(_id, _type) != -1)
        }

        //find listeningTo from ID and Type
        this.findListeningTo = function findListeningTo(_id, _type) {
            return _currentListener.findListenerIndexInList(_id, _type, _currentListener.listeningTo);
        }

        //check if listenTo exists
        this.checkListeningToExists = function checkListeningToExists(_id, _type) {
            return (_currentListener.findListeningTo(_id, _type) != -1)
        }

        //find listener information in list
        this.findListenerIndexInList = function findListenerIndexInList(_id, _type, _list) {
            //loop through all _list listeners
            for (var l = 0; l < _list.length; l++) {
                //check if listenerID and listenerType are the same
                if (_list[l].listener.listenerID == _id &&
                    _list[l].message.type == _type) {
                    return l;
                }
            }

            //return -1 if no listener exists
            return -1;
        }
    }
}

function cEventListenerGenericFunctions() {
    //run any functions needed on page load (Salamader/MooD finished setup)
    this.eventListenerPageLoaded = function eventListenerPageLoaded() {
        //remove eventListenerPageLoaded from page loading to stop duplicate responses
        Sys.WebForms.PageRequestManager.getInstance().remove_pageLoaded(cEventListener.generic.eventListenerPageLoaded);

        //broadcast ready signal to anything listening
        (function invokeAfterCreation() {
            setTimeout(function () {
                return cEventListener.queue.invokeMessageQueue("afterEventListenerCreation");
            }, 500);
        })();

        //setup interval for registering any listeners in the queue,
        //run based on a slowdown timer
        (function setupScaledTimer() {
            //check if timer exists
            if (typeof cTimer !== 'undefined') {
                //setup scaled timer
                cEventListener.listenerRegistrationQueueTimer = new cTimer.scaledTimer("EventListenerRegistrationQueueTimer", new cTimer.callback(
                        function () {
                            return cEventListener.queue.registerListenersInQueue();
                        }), true,
                    cEventListener.listenerRegistrationQueueScaledTimer
                );
            } else {
                //wait until scaled timer exists
                setTimeout(function () {
                    return setupScaledTimer()
                }, 10);
            }
        })();

    }

    //handle registering listener to "listen to"
    this.registerListener = function registerListener(_listenTo, _listener, _listenerMessage) {
        //check if both inputs are valid
        if (_listener && _listenTo) {
            //check if listener is not already registered to _listenTo
            if (!_listenTo.checkListenerExists(_listener.listenerID, _listenerMessage.type)) {
                //add listener to _listenTo listeners
                //and add _listeningTo to listener's listeningTo
                _listenTo.listeners.push(new cEventListener.listenerMessage(_listener, _listenerMessage));
                _listener.listeningTo.push(new cEventListener.listenerMessage(_listenTo, _listenerMessage));

                var message = new cEventListener.basicMessage("registerListenerSuccesful", {
                    listeningTo: _listenTo,
                    listener: _listener,
                    message: _listenerMessage,
                    registerListenerSuccesful: function () {
                        return this.message.type;
                    }
                });

                //call register succesful on listener
                cEventListener.message.sendMessage(_listenTo, _listener, message);

                return true;

            } else {
                //log a warning that the _listener is already listening to the _listeningTo with the same message type
                console.warn("Listener already exists with ID: " + _listener.listenerID + " and Type:" + _listenerMessage.type + " Listening to: " + _listenTo.listenerID);
                return false;
            }
        } else //log a warning that one of the inputted values does not exist
        {
            console.warn("Listener: " + _listener + " or " + _listenTo + " does not exists");
            return false;
        }

    }

    //handle de-registering listener from "listen to"
    this.deregisterListener = function deregisterListener(_listenTo, _listener, _listenerMessage) {
        //setup temporary listenerMessages
        var tempListener = new cEventListener.listenerMessage(_listener, _listenerMessage);
        var tempListeningTo = new cEventListener.listenerMessage(_listenTo, _listenerMessage);

        //check the listener is valid
        if (_listener) {
            //find where the listener is inside _listenTo's listeners
            var listenerIndex = cEventListener.search.findListenerIndexFromIDType(_listener.id, _listener.type, _listenTo.listeners);

            //check if listener is registered to _listenTo
            if (listenerIndex != -1) {
                //remove listener from listenTo
                _listenTo.listeners.splice(listenerIndex, 1);

                //check if _listenTo exists
                if (_listenTo) {
                    //find index for _listenTo inside what _listener is listening too
                    var listeningToIndex = cEventListener.search.findListenerIndexFromIDType(_listenTo.id, _listenerMessage.type, _listener.listeningTo);

                    //check if listenTo is within _listener's listenTo
                    if (listeningToIndex != -1) {

                        var message = new cEventListener.basicMessage("deregisterListenerSuccesful", {
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
                        _listener.listeningTo.splice(listeningToIndex, 1);
                    }
                }

                //NEEDS EDITING LATER
                return true;
            } else {
                console.warn(_listener + " Does not exist within " + _listenTo + "'s listeners");
                return false;
            }
        }

        console.warn("_listener is an invalid input: " + _listener);
        return false;
    }

    //add queue registration function
    this.addRegistrationFunction = function addRegistrationFunction(_queueType, _queueFunction) {
        //find queueFunction index
        var registraitonFunction = cEventListener.search.findRegistrationFunction(_queueType);

        //check index exists
        if (registraitonFunction == null) {
            //add new function to the list of registration functions
            cEventListener.listenerRegistrationFunctions.push(new cEventListener.basicMessage(_queueType, _queueFunction));
            return true;
        }

        //display warning that there is already a function with the same type 
        console.warn("Queue Registration Function Already Exists With Type: " + _queueType);
    }

    //remove queue registration function
    this.removeRegistrationFunction = function removeRegistrationFunction(_queueType) {
        //find queueFunction index
        var registraitonFunction = cEventListener.search.findRegistrationFunction(_queueType);

        //check index exists
        if (registraitonFunction != null) {
            //remove function from the list of registration functions
            cEventListener.listenerRegistrationFunctions.splice(registraitonFunction, 1);
            return true;
        }

        //display warning that the function doesn't exist with _queueType
        console.warn("Queue Registration Function Does Not Exist With Type: " + _queueType);
    }

    //add waiting for message functions to array
    this.addFunctionToWaitingForMessage = function addFunctionToWaitingForMessage(_messageType, _messageFunction) {
        //add message to function array
        cEventListener.functionWaitingForMessageQueue.push(new cEventListener.basicMessage(_messageType, _messageFunction));
    }

    //remove waiting for message functions
    this.removeFunctionFromWaitingForMessage = function removeFunctionFromWaitingForMessage(_messageType, _messageFunction) {
        //store current index of message
        var currentIndex = -1;

        //loop until all messages have been removed
        do {

            //store the next index of _messageType/_messageFunction
            currentIndex = cEventListener.search.returnFunctionWaitingForMessageIndex(_messageType, _messageFunction);

            //check if current index is not null
            if (currentIndex != -1) {
                //remove current index from array
                cEventListener.functionWaitingForMessageQueue.splice(currentIndex, 1);
            }

        } while (currentIndex != -1);

    }
}

function cEventListenerQueueFunctions() {
    //run all setup listener functions
    this.invokeMessageQueue = function invokeMessageQueue(_functionType) {
        //store any messages that have been invoked
        cEventListener.functionQueueProcessStarted += 1;

        //loop through all functions within the current message queue
        for (var l = 0; l < cEventListener.functionWaitingForMessageQueue.length; l++) {
            //check if message type is the same as _functionType
            if (cEventListener.functionWaitingForMessageQueue[l].type == _functionType) {

                if (cEventListener.queue.checkMessageQueueInvoked(cEventListener.functionWaitingForMessageQueue[l]) == -1) {
                    //invoke the "setupFunction" of that message
                    cEventListener.functionWaitingForMessageQueue[l].evaluateMessage("setupFunction");

                    //add this individual to be removed
                    cEventListener.functionWaitingInvoked.push(
                        new cEventListener.basicMessage(_functionType,
                            cEventListener.functionWaitingForMessageQueue[l].evaluateMessage(
                                "setupFunction", null, true)
                        )
                    );

                }
            }
        }

        cEventListener.functionQueueProcessStarted -= 1;

        if (cEventListener.functionQueueProcessStarted == 0) {
            //loop through all messages that have been invoked and remove them
            for (var m = 0; m < cEventListener.functionWaitingInvoked.length; m++) {
                cEventListener.queue.removeFromMessageQueue(cEventListener.functionWaitingInvoked[m]);
                cEventListener.functionWaitingInvoked.splice(m, 1);
                m--;
            }
        }
    }

    this.checkMessageQueueInvoked = function checkMessageQueueInvoked(_messageQueuer) {
        //loop through all messages that have been invoked and remove them
        for (var m = 0; m < cEventListener.functionWaitingInvoked.length; m++) {
            if (cEventListener.functionWaitingInvoked[m] == _messageQueuer) {
                return m;
            }
        }

        //otherwise return -1 because it doesn't exist
        return -1;
    }

    this.removeFromMessageQueue = function removeFromMessageQueue(_message) {
        //loop through all functions within the current message queue
        for (var l = 0; l < cEventListener.functionWaitingForMessageQueue.length; l++) {
            //check if message type is the same as _functionType
            if (cEventListener.functionWaitingForMessageQueue[l].type == _message.type &&
                cEventListener.functionWaitingForMessageQueue[l].evaluateMessage("setupFunction", null, true) == _message.message) {
                //remove the message as removing it within the
                //loop can cause array mismatches
                cEventListener.functionWaitingForMessageQueue.splice(l, 1);
                return;
            }
        }
    }

    //loop through listeners waiting to be registered and register them
    this.registerListenersInQueue = function registerListenersInQueue() {
        console.log("Executed Queue Register");

        //store if any listener has been registered for scaled timer purposes
        var _listenerHasBeenRegistered = false;

        //run any functions that are waiting for registration of listeners to start
        cEventListener.queue.invokeMessageQueue("registeringListeners");

        //loop through all listeners in queue
        for (var l = 0; l < cEventListener.listenerRegistrationQueue.length; l++) {

            //check listener data exists
            var listener = null;
            if (typeof cEventListener.listenerRegistrationQueue[l].returnListener != "undefined") {
                //get listener data based on registration function information
                //listener = cEventListener.search.returnQueueListener(cEventListener.listenerRegistrationQueue[l].listenerInfo);
                if (typeof cEventListener.listenerRegistrationQueue[l].returnListener == "function") {
                    listener = cEventListener.listenerRegistrationQueue[l].returnListener();
                } else {
                    listener = cEventListener.listenerRegistrationQueue[l].returnListener;
                }
            } else {
                //warn that some of the information doesn't exist and then remove it from the list
                console.warn("Warning: Failed To Register Due To Listener Data Not Existing");
                console.warn(cEventListener.listenerRegistrationQueue[l]);
                cEventListener.listenerRegistrationQueue.splice(l, 1);
                continue;
            }

            //check listenTo data exists
            var listenTo = null;
            if (typeof cEventListener.listenerRegistrationQueue[l].returnListenTo != "undefined") {
                //get listener data based on registration function information
                //listener = cEventListener.search.returnQueueListener(cEventListener.listenerRegistrationQueue[l].listenerInfo);
                if (typeof cEventListener.listenerRegistrationQueue[l].returnListenTo == "function") {
                    listenTo = cEventListener.listenerRegistrationQueue[l].returnListenTo();
                } else {
                    listenTo = cEventListener.listenerRegistrationQueue[l].returnListenTo;
                }
            } else {
                //warn that some of the information doesn't exist and then remove it from the list
                console.warn("Warning: Failed To Register Due To ListenTo Data Not Existing");
                console.warn(cEventListener.listenerRegistrationQueue[l]);
                cEventListener.listenerRegistrationQueue.splice(l, 1);
                continue;
            }

            //check if listener and listenTo exist
            if (listener && listenTo) {
                //try to register listener
                if (cEventListener.generic.registerListener(listenTo, listener, cEventListener.listenerRegistrationQueue[l].message)) {
                    //if succesful then pop listener from register
                    cEventListener.listenerRegistrationQueue.splice(l, 1);
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

function cEventListenerSearchFunctions() {
    //return if the listener is in a list
    this.checkListenerInList = function checkListenerInList(_ID, _type, _list) {
        //return true if index exists otherwise return false
        return cEventListener.search.findListenerIndexFromIDType(_ID, _type, _list) != -1;
    }

    //return the index of a listener in a list
    this.findListenerIndex = function findListenerIndex(_listenerMessage, _list) {
        //loop through _list
        for (var l = 0; l < _list.length; l++) {
            //check if listenerID and listenerType are the same
            if (_list[l].listener.listenerID == _listenerMessage.listener.listenerID &&
                _list[l].message.type == _listenerMessage.message.type) {
                return l;
            }
        }

        console.warn(_listenerMessage.listener.listenerID + " does not exist in list");
        return -1;
    }

    //return the index of a listener in a list from ID/type
    this.findListenerIndexFromIDType = function findListenerIndexFromIDType(_ID, _type, _list) {
        //loop through _list
        for (var l = 0; l < _list.length; l++) {
            //check if listenerID and listenerType are the same
            if (_list[l].listener.listenerID == _ID &&
                _list[l].message.type == _type) {
                return l;
            }
        }

        console.warn("Either: ID: " + _ID + " Or Type: " + _type + " does not exist in List: " + _list);
        return -1;
    }

    //return the index of a registration function with the type _queueType
    this.findRegistrationFunction = function findRegistrationFunction(_queuerType) {
        //Loop through all registration functions
        for (var l = 0; l < cEventListener.listenerRegistrationFunctions.length; l++) {
            //check if function type is the same as _queueType
            if (cEventListener.listenerRegistrationFunctions[l].type == _queuerType) {
                return l;
            }
        }

        return null;
    }

    //returns queueListener based on custom registration functions
    this.returnQueueListener = function returnQueueListener(_data) {
        //find queueFunction index
        var registraitonFunction = cEventListener.search.findRegistrationFunction(_data.type);

        //check index exists
        if (registraitonFunction != null) {
            //return the queue listener based on _data
            return cEventListener.listenerRegistrationFunctions[registraitonFunction].evaluateMessage("getRegisterQueueType", _data);
        }

        //return null if no custom type found
        return null;
    }

    //returns the message 
    this.returnFunctionWaitingForMessageIndex = function returnFunctionWaitingForMessageIndex(_messageType, _messageFunction) {
        //check if message function has been entered
        var _messageFunction = _messageFunction || "";

        //loop through all messages in the "waiting" array
        for (var a = 0; a < cEventListener.functionWaitingForMessageQueue.length; a++) {
            //store the current array index to shorten typing
            var currentFunction = cEventListener.functionWaitingForMessageQueue[a];

            //check if _messageFunction is empty
            if (_messageFunction != "") {
                //check the _messageType's match
                if (_messageType == currentFunction.type) {
                    //return current index
                    return a;
                }
            } else {
                //check if _messageType's and _messageFunction's match
                if (_messageType == currentFunction.type &&
                    _messageFunction == currentFunction.message.toString()) {
                    //return current index
                    return a;
                }
            }
        }

        //return null
        return -1;
    }
}

function cEventListenerMessageFunctions() {
    //handle sending _message from _sender to _listener
    this.sendMessage = function sendMessage(_sender, _listener, _message) {
        //invoke receiveMessage on listener
        _listener.receiveMessage(_sender, _message);
    }

    //handle sending _message to all listeners listening to _sender
    this.broadcastMessageAll = function broadcastMessageAll(_sender, _message) {
        //loop through all listeners and send message
        for (var l = 0; l < _sender.listeners.length; l++) {
            //send message to current listener
            cEventListener.message.sendMessage(_sender, _sender.listeners[l].listener, _message);
        }
    }

    //send message to all of type _listenerType
    this.sendMessageToType = function sendMessageToType(_sender, _message) {
        //loop through all listeners
        for (var l = 0; l < _sender.listeners.length; l++) {
            //check if listener type is the same as the message type
            if (_sender.listeners[l].message.type == _message.type) {
                //send message to current listener
                cEventListener.message.sendMessage(_sender, _sender.listeners[l].listener, _message);
            }
        }
    }

    //handle custom message seperation
    this.parseCustomHTMLData = function parseCustomHTMLData(_infoToParse) {
        //split html to correct format
        var infoParsedString = _infoToParse.replace(/\t/g, "");
        var infoSplitStrings = infoParsedString.split("|");
        var parsedInfo = [];

        //loop through inputted strings and pull out useable data from them
        for (var parsedInfoIndex = 0; parsedInfoIndex < infoSplitStrings.length; parsedInfoIndex++) {
            parsedInfo.push(infoSplitStrings[parsedInfoIndex].split("=")[1]);
        }

        //return parsed data
        return parsedInfo || [];
    }

    //handle parsing single message into sub messages
    this.parseIntoMessages = function parseIntoMessages(_message) {
        var _messages = [];

        //check message exists
        if (_message) {
            this._actualMessage = null;

            //check if message has a function to return data
            if (_message instanceof Function) {
                _message(this);
            } else {
                this._actualMessage = _message;
            }

            //check if actual message exists
            if (this._actualMessage) {
                if (this._actualMessage instanceof Array) {
                    //if message is already an array
                    //presume it's already messages
                    return this._actualMessage;
                } else {
                    //add message to return as it is in
                    //a message format
                    _messages.push(this._actualMessage);
                }
            }
        }

        //if element messages exist then return that
        //otherwise return null
        if (_messages.length != 0) {
            return _messages;
        }
        return null;

    }

    //find and return messages of type from message list
    this.findMessageOfType = function findMessageOfType(_type, _messages) {
        //check if messages exists
        if (_messages) {
            //convert messages into array
            var parsedMessages = cEventListener.message.parseIntoMessages(_messages);

            //check parsed messages exist
            if (parsedMessages) {
                //check if messages is an array
                if (parsedMessages instanceof Array) {
                    //loop through messages and return of type
                    for (var i = 0; i < parsedMessages.length; i++) {
                        if (parsedMessages[i].messageType == _type) {
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
		Custom Maths
	
	Description:
		Holds all information for Maths
*/

//store custom math seperations
window.cMaths = new function customMathFunctions() {
    //functions/classes
    this.lineMaths = new customMathLineMathFunctions();
    this.collision = new customMathCollisionFunctions();
    this.maths = new customMathGenericFunctions();
    this.position = new customMathPositioningFunctions();

    //data types
    this.dataTypes = new customMathTypeData();

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

    //realtime data
    this.viewportOffset = new this.vector2();

    function updateViewportOffset() {
        cMaths.viewportOffset = cMaths.position.getPageViewportOffsetFromPage();
    }

    window.addEventListener("scroll", updateViewportOffset);
    window.addEventListener("resize", updateViewportOffset);

}();

//hold data types
function customMathTypeData() {

    this.vector2 = function vector2(_x, _y) {
        this.x = _x === undefined ? null : _x;
        this.y = _y === undefined ? null : _y;
    }

    this.vector2.prototype = {
        set: function (_x, _y) {
            this.x = _x === undefined ? null : _x;
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setX: function (_x) {
            this.x = _x === undefined ? null : _x;
            return this;
        },

        setY: function (_y) {
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setVector: function (_vector) {
            if (_vector == null) {
                return null;
            }

            this.x = _vector.x === undefined ? null : _vector.x;
            this.y = _vector.y === undefined ? null : _vector.y;

            return this;
        },

        clone: function () {
            return new cMaths.vector2(this.x, this.y);
        },

        add: function (_vector) {
            return _vector == null ? this.clone() : new cMaths.vector2(this.x + _vector.x, this.y + _vector.y);
        },

        Add: function (_vector) {
            if (_vector != null) {
                this.x += _vector.x;
                this.y += _vector.y;
            }

            return this;
        },

        subtract: function (_vector) {
            return _vector == null ? this.clone() : new cMaths.vector2(this.x - _vector.x, this.y - _vector.y);
        },

        Subtract: function (_vector) {
            if (_vector != null) {
                this.x -= _vector.x;
                this.y -= _vector.y;
            }

            return this;
        },

        scale: function (_scalar) {
            return _scalar == null ? null : new cMaths.vector2(this.x * _scalar, this.y * _scalar);
        },

        Scale: function (_scalar) {
            this.x *= _scalar;
            this.y *= _scalar;

            return this;
        },

        dot: function (_vector) {
            return _vector == null ? null : new cMaths.vector2(this.x * _vector.x, this.y * _vector.y);
        },

        Dot: function (_vector) {
            if (_vector != null) {
                this.x *= _vector.x;
                this.y *= _vector.y;
            }

            return this;
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },

        distanceSqr: function (_vector) {
            if (_vector == null) {
                return NaN;
            }
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            return (deltaX * deltaX + deltaY * deltaY);
        }
    }

    this.vector3 = function vector3(_x, _y, _z) {
        this.x = _x === undefined ? null : _x;
        this.y = _y === undefined ? null : _y;
        this.z = _z === undefined ? null : _z;
    }

    this.vector3.prototype = {
        set: function (_x, _y, _z) {
            this.x = _x === undefined ? null : _x;
            this.y = _y === undefined ? null : _y;
            this.z = _z === undefined ? null : _z;
            return this;
        },

        setX: function (_x) {
            this.x = _x === undefined ? null : _x;
            return this;
        },

        setY: function (_y) {
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setZ: function (_z) {
            this.z = _z === undefined ? null : _z;
            return this;
        },

        setVector: function (_vector) {
            if (_vector == null) {
                return null;
            }

            this.x = _vector.x === undefined ? null : _vector.x;
            this.y = _vector.y === undefined ? null : _vector.y;
            this.z = _vector.z === undefined ? null : _vector.z;

            return this;
        },

        clone: function () {
            return new cMaths.vector3(this.x, this.y, this.z);
        },

        vector2: function () {
            return new cMaths.vector2(this.x, this.y);
        },

        add: function (_vector) {
            return _vector == null ? this.clone() :
                new cMaths.vector3(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z);
        },

        Add: function (_vector) {
            if (_vector != null) {
                this.x += _vector.x;
                this.y += _vector.y;
                this.z += _vector.z;
            }

            return this;
        },

        subtract: function (_vector) {
            return _vector == null ? this.clone() :
                new cMaths.vector3(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z);
        },

        Subtract: function (_vector) {
            if (_vector != null) {
                this.x -= _vector.x;
                this.y -= _vector.y;
                this.z -= _vector.z;
            }

            return this;
        },

        scale: function (_scalar) {
            return _vector == null ? null :
                new cMaths.vector3(this.x * _scalar, this.y * _scalar, this.z * _scalar);
        },

        Scale: function (_scalar) {
            this.x *= _scalar;
            this.y *= _scalar;
            this.z *= _scalar;

            return this;
        },

        dot: function (_vector) {
            return _vector == null ? null :
                new cMaths.vector3(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z);
        },

        distance: function (_vector) {
            return Math.sqrt(this.distanceSqr(_vector));
        },

        distanceSqr: function (_vector) {
            if (_vector == null) {
                return NaN;
            }
            var deltaX = this.x - _vector.x;
            var deltaY = this.y - _vector.y;
            var deltaZ = this.z - _vector.z;
            return (deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
        }
    }

    this.vector4 = function vector4(_x, _y, _z, _w) {
        this.x = _x === undefined ? null : _x;
        this.y = _y === undefined ? null : _y;
        this.z = _z === undefined ? null : _z;
        this.w = _w === undefined ? null : _w;
    }

    this.vector4.prototype = {
        set: function (_x, _y, _z, _w) {
            this.x = _x === undefined ? null : _x;
            this.y = _y === undefined ? null : _y;
            this.z = _z === undefined ? null : _z;
            this.w = _w === undefined ? null : _w;
            return true;
        },

        setX: function (_x) {
            this.x = _x === undefined ? null : _x;
            return this;
        },

        setY: function (_y) {
            this.y = _y === undefined ? null : _y;
            return this;
        },

        setZ: function (_z) {
            this.z = _z === undefined ? null : _z;
            return this;
        },

        setW: function (_w) {
            this.w = _w === undefined ? null : _w;
            return this;
        },

        setVector: function (_vector) {
            if (_vector == null) {
                return null;
            }

            this.x = _vector.x === undefined ? null : _vector.x;
            this.y = _vector.y === undefined ? null : _vector.y;
            this.z = _vector.z === undefined ? null : _vector.z;
            this.w = _vector.w === undefined ? null : _vector.w;

            return this;
        },

        clone: function () {
            return new cMaths.vector4(this.x, this.y, this.z, this.w);
        },

        vector2: function () {
            return new cMaths.vector2(this.x, this.y);
        },

        vector3: function () {
            return new cMaths.vector3(this.x, this.y, this.z);
        },

        add: function (_vector) {
            return _vector == null ? this.clone() :
                new cMaths.vector4(this.x + _vector.x, this.y + _vector.y, this.z + _vector.z, this.w + _vector.w);
        },

        Add: function (_vector) {
            if (_vector != null) {
                this.x += _vector.x;
                this.y += _vector.y;
                this.z += _vector.z;
                this.w += _vector.w;
            }

            return this;
        },

        subtract: function (_vector) {
            return _vector == null ? this.clone() :
                new cMaths.vector4(this.x - _vector.x, this.y - _vector.y, this.z - _vector.z, this.w - _vector.w);
        },

        Subtract: function (_vector) {
            if (_vector != null) {
                this.x -= _vector.x;
                this.y -= _vector.y;
                this.z -= _vector.z;
                this.w -= _vector.w;
            }

            return this;
        },

        scale: function (_scalar) {
            return _scalar == null ? null :
                new cMaths.vector4(this.x * _scalar, this.y * _scalar, this.z * _scalar, this.w * _scalar);
        },

        Scale: function (_scalar) {
            this.x *= _scalar;
            this.y *= _scalar;
            this.z *= _scalar;
            this.w *= _scalar;

            return this;
        },

        dot: function (_vector) {
            return _vector == null ? null :
                new cMaths.vector4(this.x * _vector.x, this.y * _vector.y, this.z * _vector.z, this.w * _vector.w);
        },

        Dot: function (_vector) {
            if (_vector != null) {
                this.x *= _vector.x;
                this.y *= _vector.y;
                this.z *= _vector.z;
                this.w *= _vector.w;
            }

            return this;
        },
    }

    this.bounds = function bounds(_x1, _y1, _x2, _y2, _flippedY) {
        this.x1 = _x1 === undefined ? null : _x1;
        this.y1 = _y1 === undefined ? null : _y1;
        this.x2 = _x2 === undefined ? null : _x2;
        this.y2 = _y2 === undefined ? null : _y2;

        //calculate positions and size
        this.updateExtras = function () {
            var _this = this;

            function updateSides(lowestX, lowestY, highestX, highestY) {
                this.bottomRight = new cMaths.vector2(lowestX, lowestY);
                this.bottomLeft = new cMaths.vector2(highestX, lowestY);
                this.topRight = new cMaths.vector2(highestX, highestY);
                this.topLeft = new cMaths.vector2(lowestX, highestY);
            }

            updateSides(this.x1 < this.x2 ? this.x1 : this.x2,
                this.y1 < this.y2 ? this.y1 : this.y2,
                this.x1 < this.x2 ? this.x2 : this.x1,
                this.y1 < this.y2 ? this.y2 : this.y1);

            this.size = new cMaths.vector2(this.topRight.x - this.topLeft.x, this.topRight.y - this.bottomRight.y);
        }

        this.updateExtras();
    }

    this.bounds.prototype = {
        set: function (_x1, _y1, _x2, _y2) {
            this.x1 = _x1 === undefined ? null : _x1;
            this.y1 = _y1 === undefined ? null : _y1;
            this.x2 = _x2 === undefined ? null : _x2;
            this.y2 = _y2 === undefined ? null : _y2;
            this.updateExtras();
            return true;
        },

        setX1: function (_x1) {
            this.x1 = _x1 === undefined ? null : _x1;
            this.updateExtras();
            return this;
        },

        setY1: function (_y1) {
            this.y1 = _y1 === undefined ? null : _y1;
            this.updateExtras();
            return this;
        },

        setX2: function (_x2) {
            this.x2 = _x2 === undefined ? null : _x2;
            this.updateExtras();
            return this;
        },

        setY2: function (_y2) {
            this.y2 = _y2 === undefined ? null : _y2;
            this.updateExtras();
            return this;
        },

        setBound: function (_bound) {
            this.x1 = _x1 === undefined ? null : _x1;
            this.y1 = _y1 === undefined ? null : _y1;
            this.x2 = _x2 === undefined ? null : _x2;
            this.y2 = _y2 === undefined ? null : _y2;
            this.updateExtras();
            return this;
        },

        clone: function () {
            return new cMaths.bounds(this.x1, this.y1, this.x2, this.y2);
        },

        add: function (_bounds) {
            return _bounds == null ? this.clone() :
                new cMaths.bounds(this.x1 + _bounds.x1, this.y1 + _bounds.y1, this.x2 + _bounds.x2, this.y2 + _bounds.y2);
        },

        Add: function (_bounds) {
            if (_bounds != null) {
                this.x1 += _bounds.x1;
                this.y1 += _bounds.y1;
                this.x2 += _bounds.x2;
                this.y2 += _bounds.y2;
                this.updateExtras();
            }

            return this;
        },

        subtract: function (_bounds) {
            return _bounds == null ? this.clone() :
                new cMaths.bounds(this.x1 - _bounds.x1, this.y1 - _bounds.y1, this.x2 - _bounds.x2, this.y2 - _bounds.y2);
        },

        Subtract: function (_bounds) {
            if (_bounds != null) {
                this.x1 -= _bounds.x1;
                this.y1 -= _bounds.y1;
                this.x2 -= _bounds.x2;
                this.y2 -= _bounds.y2;
                this.updateExtras();
            }

            return this;
        },

        scale: function (_scalar) {
            return _scalar == null ? null :
                new cMaths.bounds(this.x1 * _scalar, this.y1 * _scalar, this.x2 * _scalar, this.y2 * _scalar);
        },

        Scale: function (_scalar) {
            if (_scalar != null) {
                this.x1 *= _scalar;
                this.y1 *= _scalar;
                this.x2 *= _scalar;
                this.y2 *= _scalar;
                this.updateExtras();
                return this;
            }

            this.set(null, null, null, null);
            this.updateExtras();
            return this;
        },

        dot: function (_bounds) {
            return _bounds == null ? null :
                new cMaths.bounds(this.x1 * _bounds.x, this.y1 * _bounds.y, this.x2 * _bounds.x2, this.y2 * _bounds.y2);
        },

        Dot: function (_bounds) {
            if (_bounds != null) {
                this.x1 *= _bounds.x1;
                this.y1 *= _bounds.y1;
                this.x2 *= _bounds.x2;
                this.y2 *= _bounds.y2;
                this.updateExtras();
                return this;
            }

            this.set(null, null, null, null);
            this.updateExtras();
            return this;
        },

        fromVector2s: function (_pos1, _pos2) {
            return (_pos1 == null || _pos2 == null) ? null :
                new cMaths.bounds(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromVector4: function (_vector) {
            return _vector == null ? null :
                new cMaths.bounds(_vector.x, _vector.y, _vector.z, _vector.w);
        },

        fromObject: function (_object, _relative, _includeChildren) {

            if (_object == null) {
                return null;
            }

            //setup object bounds
            var _objectBounds = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }

            //setup relative
            var _relative = _relative || document;

            var _includeChildren = _includeChildren || null;

            //setup JQuery object and add css class
            var _objectJQuery = $(_object);

            //get object bounds based on relative
            if (_relative !== null) {

                if (_objectJQuery.attr("type") !== "hidden" && _objectJQuery.attr("display") !== "hidden") {

                    var _position = cMaths.position.getCoords(_objectJQuery[0], _relative);

                    var _computedStyle = _object.currentStyle || window.getComputedStyle(_object);
                    var height = _object.clientHeight;

                    height += cMaths.position.translateCssSizes(_object, "marginTop", _computedStyle);
                    height += cMaths.position.translateCssSizes(_object, "marginBottom", _computedStyle);
                    height += cMaths.position.translateCssSizes(_object, "borderTopWidth", _computedStyle);
                    height += cMaths.position.translateCssSizes(_object, "borderBottomWidth", _computedStyle);

                    var width = _object.clientWidth;

                    width += cMaths.position.translateCssSizes(_object, "marginLeft", _computedStyle);
                    width += cMaths.position.translateCssSizes(_object, "marginRight", _computedStyle);
                    width += cMaths.position.translateCssSizes(_object, "borderLeftWidth", _computedStyle);
                    width += cMaths.position.translateCssSizes(_object, "borderRightWidth", _computedStyle);

                    _objectBounds.left = _position.x;
                    _objectBounds.top = _position.y;
                    _objectBounds.right = _objectBounds.left + width;
                    _objectBounds.bottom = _objectBounds.top + height;

                } else {
                    return null;
                }
            } else {
                console.warn("Bounds relative: " + _relative + " is not an option");
                return null;
            }

            if (_includeChildren !== null && _includeChildren.length > 0) {

                for (var l = 0; l < _includeChildren.length; l++) {

                    var _childrenJQuery = _objectJQuery.find(_includeChildren[l]);
                    if (_childrenJQuery.length > 0) {
                        //loop through all children and find largest bounds
                        _childrenJQuery.each(function () {

                            //get child bounds and check if child bounds are outside parent bounds
                            var _tempBounds = cMaths.Bounds.fromObject(this);

                            if (_tempBounds !== null) {
                                if (_tempBounds.x1 < _objectBounds.left) {
                                    _objectBounds.left = _tempBounds.x1;
                                }

                                if (_tempBounds.y1 < _objectBounds.top) {
                                    _objectBounds.top = _tempBounds.y1;
                                }

                                if (_tempBounds.x2 > _objectBounds.right) {
                                    _objectBounds.right = _tempBounds.x2;
                                }

                                if (_tempBounds.y2 > _objectBounds.bottom) {
                                    _objectBounds.bottom = _tempBounds.y2;
                                }
                            }
                        });

                        break;
                    }
                }
            }

            return new cMaths.bounds(_objectBounds.left,
                _objectBounds.top,
                _objectBounds.right,
                _objectBounds.bottom);
        }
    }

    this.line = function line(_x1, _y1, _x2, _y2) {
        this.x1 = _x1 === undefined ? null : _x1;
        this.y1 = _y1 === undefined ? null : _y1;
        this.x2 = _x2 === undefined ? null : _x2;
        this.y2 = _y2 === undefined ? null : _y2;
    }

    this.line.prototype = {
        set: function (_x1, _y1, _x2, _y2) {
            this.x1 = _x1 === undefined ? null : _x1;
            this.y1 = _y1 === undefined ? null : _y1;
            this.x2 = _x2 === undefined ? null : _x2;
            this.y2 = _y2 === undefined ? null : _y2;
        },

        fromVector2s: function (_pos1, _pos2) {
            return (_pos1 == null || _pos2 == null) ? null :
                new cMaths.line(_pos1.x, _pos1.y, _pos2.x, _pos2.y);
        },

        fromVector4: function (_vector) {
            return _vector == null ? null :
                new cMaths.line(_vector.x, _vector.y, _vector.z, _vector.w);
        },

        distance: function () {
            return Math.sqrt(this.distanceSqr());
        },

        distanceSqr: function () {
            if (this.x1 == null || this.x2 == null || this.y1 == null || this.y2 == null) {
                return NaN;
            }
            var deltaX = this.x1 - this.x2;
            var deltaY = this.y1 - this.y2;
            return (deltaX * deltaX + deltaY * deltaY);
        }
    }

}

//hold collision/bounds testing functions
function customMathCollisionFunctions() {

    //return any objects from _objects where object's bounds are within _areaBounds
    this.returnObjectsWithinArea = function (_areaBounds, _objects) {
        var _ret = [];

        if (_objects != null && _areaBounds != null) {

            for (var i = 0; i < _objects.length; i++) {
                //get object's bounds
                var _otherBounds = cMaths.Bounds.fromObject(_objects[i]);

                //check if object bounds is within _areaBounds
                if (this.checkAreaWithinArea(_areaBounds, _otherBounds)) {
                    _ret.push({
                        _object: _objects[i],
                        _bounds: _otherBounds
                    });
                }
            }

        }

        return _ret;
    }

    //return any objects from _objects where object's bounds intersect _areaBounds
    this.returnObjectsIntersectArea = function (_areaBounds, _objects) {
        var _ret = [];

        if (_areaBounds != null && _objects != null) {

            for (var i = 0; i < _objects.length; i++) {
                //get object's bounds
                var _otherBounds = cMaths.Bounds.fromObject(_objects[i]);

                //check if object bounds intersects _areaBounds
                if (this.checkAreaIntersectsArea(_areaBounds, _otherBounds)) {
                    _ret.push({
                        _object: _objects[i],
                        _bounds: _otherBounds
                    });
                }
            }

        }

        return _ret;
    }

    //check if a point is within bounds
    this.checkPointWithinArea = function (_areaBounds, _point) {
        if (_areaBounds == null || _point == null) {
            return false;
        }

        if (_areaBounds.topLeft.x <= _point.x &&
            _areaBounds.topLeft.y <= _point.y &&
            _areaBounds.bottomRight.x >= _point.x &&
            _areaBounds.bottomRight.y >= _point.y) {

            return true;

        }

        return false;
    }

    //check if an area is completly within another
    this.checkAreaWithinArea = function (_areaBounds, _otherBounds) {

        if (_areaBounds == null || _otherBounds == null) {
            return false;
        }

        var _cornersWithin = 0;

        //setup corners to test
        var _pointsToCheck = [_otherBounds.topLeft, _otherBounds.topRight,
            _otherBounds.bottomLeft, _otherBounds.bottomRight
        ];

        //loop through corners and test if they are within the area
        for (var _pointIndex = 0; _pointIndex < 4; _pointIndex++) {
            if (this.checkPointWithinArea(_areaBounds, _pointsToCheck[_pointIndex])) {
                _cornersWithin++;
            }
        }

        //if all 4 corners within area return true
        if (_cornersWithin == 4) {
            return true;
        }

        return false;
    }

    //check if an area is completly enveloped by another
    this.checkAreaEnvelopedByArea = function (_areaBounds, _otherBounds) {
        return this.checkAreaWithinArea(_otherBounds, _areaBounds);
    }

    //check if an area intersects another anywhere
    this.checkAreaIntersectsArea = function (_areaBounds, _otherBounds) {

        if (_areaBounds == null || _otherBounds == null) {
            return false;
        }

        //setup corners of _otherBounds and check if they are inside _areaBounds
        var _pointsToCheck = [new cMaths.vector2(_otherBounds.topLeft.x, _otherBounds.topLeft.y),
            new cMaths.vector2(_otherBounds.bottomRight.x, _otherBounds.topLeft.y),
            new cMaths.vector2(_otherBounds.bottomRight.x, _otherBounds.bottomRight.y),
            new cMaths.vector2(_otherBounds.topLeft.x, _otherBounds.bottomRight.y)
        ];

        for (var i = 0; i < 4; i++) {
            if (this.checkPointWithinArea(_areaBounds, _pointsToCheck[i])) {
                return true;
            }
        }

        //setup all lines from _areaBounds and _otherBounds and check if they intersect
        var _linesToCheck = [cMaths.Line.fromVector2s(_otherBounds.topLeft, _otherBounds.topRight),
            cMaths.Line.fromVector2s(_otherBounds.topRight, _otherBounds.bottomRight),
            cMaths.Line.fromVector2s(_otherBounds.bottomRight, _otherBounds.bottomLeft),
            cMaths.Line.fromVector2s(_otherBounds.bottomLeft, _otherBounds.topLeft)
        ];

        var _linesToCheckAgainst = [cMaths.Line.fromVector2s(_areaBounds.topLeft, _areaBounds.topRight),
            cMaths.Line.fromVector2s(_areaBounds.topRight, _areaBounds.bottomRight),
            cMaths.Line.fromVector2s(_areaBounds.bottomRight, _areaBounds.bottomLeft),
            cMaths.Line.fromVector2s(_areaBounds.bottomLeft, _areaBounds.topLeft)
        ];

        //do line intersect tests
        for (var line1 = 0; line1 < 4; line1++) {
            for (var line2 = 0; line2 < 4; line2++) {
                if (cMaths.lineMaths.lineIntersectionWithin(_linesToCheck[line1], _linesToCheckAgainst[line2])) {
                    return true;
                }
            }
        }

        return false;
    }

}

//Holds line functions
function customMathLineMathFunctions() {

    //find and return intersection point of lines if result is
    //within the two lines
    this.lineIntersectionWithin = function (_line1, _line2) {
        var _intersection = this.lineIntersection(_line1, _line2);

        if (_intersection == null) {
            return null;
        }

        //check if line interception is within line 1 x
        if (_line1.x1 >= _line1.x2) {
            if (cMaths.maths.between(_line1.x2, _intersection.x, _line1.x1, 0.000002) == false) {
                return null;
            }
        } else {
            if (cMaths.maths.between(_line1.x1, _intersection.x, _line1.x2, 0.000002) == false) {
                return null;
            }
        }

        //check if line interception is within line 1 y
        if (_line1.y1 >= _line1.y2) {
            if (cMaths.maths.between(_line1.y2, _intersection.y, _line1.y1, 0.000002) == false) {
                return null;
            }
        } else {
            if (cMaths.maths.between(_line1.y1, _intersection.y, _line1.y2, 0.000002) == false) {
                return null;
            }
        }

        //check if line interception is within line 2 x
        if (_line2.x1 >= _line2.x2) {
            if (cMaths.maths.between(_line2.x2, _intersection.x, _line2.x1, 0.000002) == false) {
                return null;
            }
        } else {
            if (cMaths.maths.between(_line1.x1, _intersection.x, _line1.x2, 0.000002) == false) {
                return null;
            }
        }

        //check if line interception is within line 2 y
        if (_line2.y1 >= _line2.y2) {
            if (cMaths.maths.between(_line2.y2, _intersection.y, _line2.y1, 0.000002) == false) {
                return null;
            }
        } else {
            if (cMaths.maths.between(_line2.y1, _intersection.y, _line2.y2, 0.000002) == false) {
                return null;
            }
        }

        return _intersection;
    }

    //return the line intersection point
    this.lineIntersection = function (_line1, _line2) {
        //Do line intersection calculation stuff? 
        //en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Mathematics

        if (_line1 == null || _line2 == null) {
            return null;
        }

        var _lineIntersect = new cMaths.vector2(null, null);

        var div = (_line1.x1 - _line1.x2) * (_line2.y1 - _line2.y2) -
            (_line1.y1 - _line1.y2) * (_line2.x1 - _line2.x2);

        _lineIntersect.x = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.x1 - _line2.x2) -
            (_line1.x1 - _line1.x2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.x /= div;

        _lineIntersect.y = ((_line1.x1 * _line1.y2 - _line1.y1 * _line1.x2) * (_line2.y1 - _line2.y2) -
            (_line1.y1 - _line1.y2) * (_line2.x1 * _line2.y2 - _line2.y1 * _line2.x2));
        _lineIntersect.y /= div;

        //check values are valid
        if (isNaN(_lineIntersect.x) || isNaN(_lineIntersect.y)) {
            return null;
        }

        return _lineIntersect;
    }

}

//Holds math functions
function customMathGenericFunctions() {

    //check if value between min/max with epsilon accuracy
    this.between = function (_min, _val, _max, _eps) {
        if (_min == null || _val == null || _max == null) {
            return NaN;
        }
        var _eps = _eps || 0;
        return (_min - _eps < _val && _val < _max + _eps);
    }

}

function customMathPositioningFunctions() {

    this.getPageViewportOffsetFromPage = function getPageViewportOffsetFromPage() {
        var body = document.body;
        var docEl = document.documentElement;

        return new cMaths.vector2(
            (window.pageXOffset || docEl.scrollLeft || body.scrollLeft) - (docEl.clientLeft || body.clientLeft || 0), (window.pageYOffset || docEl.scrollTop || body.scrollTop) - (docEl.clientTop || body.clientTop || 0));
    }

    this.getCoords = function getCoords(_object, _relativeTo) {

        if (_object == null) {
            return null;
        }

        var _objectPosition = new cMaths.vector2();

        if (_relativeTo === "screen") {
            var box = _object.getBoundingClientRect();

            _objectPosition.x = box.left;
            _objectPosition.y = box.top;
        } else {

            if (_relativeTo === _object.offsetParent) {
                _objectPosition.x = _object.offsetLeft;
                _objectPosition.y = _object.offsetTop;
            } else {
                //calculate position offset from viewport 
                var box = _object.getBoundingClientRect();

                _objectPosition.x = box.left;
                _objectPosition.y = box.top;

                //if relative to exists then calculate offset from that
                if (_relativeTo !== null && _relativeTo !== document) {
                    var _otherBox = _relativeTo.getBoundingClientRect();

                    _objectPosition.x -= _otherBox.left;
                    _objectPosition.y -= _otherBox.top;
                }

                _objectPosition.Add(cMaths.viewportOffset);
            }

        }

        return _objectPosition;
    }

    this.translateCssSizes = function translateCssSizes(_object, _css, _computedStyle) {

        if (_css == null || (_object == null && _computedStyle == null)) {
            return NaN;
        }

        var _computedStyle = _computedStyle || _object.currentStyle || window.getComputedStyle(_object);

        switch (_computedStyle[_css]) {
            case "thin":
                return 1;
            case "medium":
                return 2.5;
            case "thick":
                return 5;
            case "auto":
                return 0;
            case "inherit":
                if (_object) {
                    return translateCssSizes(_object.offsetParent, _css, null)
                }
                return NaN;
            default:
                return parseInt(_computedStyle[_css], 10);
        }
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

    this.Callback = this.dataTypes.callback.prototype;
    this.callback = this.dataTypes.callback;

    this.Timer = this.dataTypes.timer.prototype;
    this.timer = this.dataTypes.timer;

    this.ScaledTime = this.dataTypes.scaledTime.prototype;
    this.scaledTime = this.dataTypes.scaledTime; 

    this.ScaledTimer = this.dataTypes.scaledTimer.prototype;
    this.scaledTimer = this.dataTypes.scaledTimer;

    this.RealtimeTimer = this.dataTypes.realtimeTimer.prototype;
    this.realtimeTimer = this.dataTypes.realtimeTimer;

    //====FUNCTIONS====//
    this.generic = new cTimerFunctions();

}

function cTimerDataTypes()
{
    //holds specific callback data for use in timer
    this.callback = function callback(_callback, _caller, _args)
    {
        this.callback = _callback || null;
        this.caller = _caller || null;
        this.args = _args || {};
    }

    //holds specific timer data for individual timers
    this.timer = function timer(_name, _callback, _timing, _startOnCreation, _runTime, _enableOffset)
    {
        //store basic variables for timer
        this.name = _name;
        this.running = _startOnCreation || false;
        this.pausedAt = 0;
        this.lastCompletion = 0;
        this.callback = _callback || null;
        this.timeout = null;
        this.timerID = cTimer.uniqueTimerID++;

        //function to get the current system time
        this.time = function time()
        {
            return new Date().getTime();
        }

        //store timer time variables
        //anything below 4ms will be capped at 4ms
        //after 5 iterations due to ancient browser stuff
        this.interval = _timing || 0;
        this.currentInterval = 0;
        this.startDate = this.time();
        
        this.lastTickDate = this.startDate;
        this.ticksRemaining = _runTime || Number.MAX_SAFE_INTEGER;
        this.ticksElapsed = 0;
        
        //allow timeout offset to enable interval-like
        //mechanics without using interval to enable
        //realtime with script order
        this.enableOffset = _enableOffset || false;
        this.intervalOffset = 0;
        this.skipOffset = true;
        this.skipOffsetIfTooLarge = false;

        //will start the timer
        this.start = function start()
        {
            if (this.interval == null) { return false; }
            this.running = true;
            this.lastTickDate = this.time();
            this.skipOffset = true;
            this.loop();
        }

        //will stop the timer
        //and reset pausedAt
        this.stop = function stop()
        {
            this.running = false;
            this.pausedAt = 0;
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }

        //will stop and then start
        //the timer again
        this.restart = function restart()
        {
            this.stop();
            this.start();
        }

        //will stop the timer and
        //record when it was paused
        this.pause = function pause()
        {
            if (this.running)
            {
                this.stop();
                this.pausedAt = this.time();
            }
        }

        //will run start, only if timer is
        //currently not running
        this.resume = function resume()
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
        this.loop = function loop()
        {
            if (this.interval == null) { return false; }
            //reset interval
            this.currentInterval = this.interval;

            //check if previously paused
            if (this.pausedAt != 0)
            {
                //set current interval to restart at paused state
                this.currentInterval = this.currentInterval - (this.pausedAt - this.lastCompletion);
                this.pausedAt = 0;
            }

            //add on the time it has taken since the last tick
            var _time = this.time();

            var timeSinceLastUpdate = _time - this.lastTickDate;
            this.lastTickDate = _time;
            this.ticksElapsed += timeSinceLastUpdate;
            this.ticksRemaining -= timeSinceLastUpdate;

            //check if enable offset is enabled and if a new offset is needed
            if (this.enableOffset == true
                 && timeSinceLastUpdate != this.currentInterval
                 && this.skipOffset == false)
            {
                //calculate new offset to get closer to interval timings
                this.intervalOffset = this.currentInterval - timeSinceLastUpdate;

                //if offset is more than interval total
                //limit offset to be interval (instant loop)
                if (this.intervalOffset < -this.currentInterval)
                {
                    if (this.skipOffsetIfTooLarge)
                    {
                        this.intervalOffset = -(this.currentInterval % this.intervalOffset);
                    }
                    else
                    {
                        this.intervalOffset = -this.currentInterval;
                    }
                }
            }
            else
            {
                //set interval to be 0 and reset skip offset
                this.intervalOffset = 0;
                this.skipOffset = false;
            }

            //continue loop
            var _this = this;
            this.timeout = window.setTimeout(function() { _this.runLoop() }, this.currentInterval + this.intervalOffset);
        }

        //run callback based on input callback
        this.invokeCallback = function (_callback)
        {
            //check callback exists
            if (_callback != null && _callback.callback != null)
            {
                //check if caller suppied with callback
                if (_callback.caller != null)
                {
                    //invoke callback with caller as "this"
                    return _callback.callback.call(_callback.caller, _callback.args);
                }
                else
                {
                    //invoke callback with timer as "this"
                    return _callback.callback.call(this, _callback.args);
                }
            }

            //return null if no callback
            return null;
        }

        //on the end of every loop run this function
        //to calculate if it should continue
        this.runLoop = function runLoop()
        {
            //invoke callback
            this.invokeCallback(this.callback);
            this.lastCompletion = this.time();

            if (this.running)
            {
                //check timer should still be running
                if (this.ticksRemaining - this.currentInterval < 0)
                {
                    //destroy the timer if it should stop
                    this.destroy();
                    return;
                }
                this.loop();
            }
        }

        //on destroy call, find index of timer
        //and remove it from array
        this.destroy = function destroy()
        {
            this.stop();
            var index = cTimer.generic.findTimerIndexByID(this.timerID);
            cTimer.timers.splice(index, 1);
            delete this;
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

    this.scaledTime = function scaledTime(_threshold, _interval)
    {
        if (_threshold == null || _interval == null) { return null; }
        this.threshold = _threshold;
        this.interval = _interval;
    }

    //holds specific timer data with scaling time based on results
    this.scaledTimer = function scaledTimer(_name, _callback, _startOnCreation, _timeScalers, _runTime, _enableOffset)
    {
        //setup timer for current scaled timer
        this.scaledCallBack = _callback;

        //store time scaling variables
        this.currentFailedCount = 0;
        this.timeScalers = _timeScalers || [new cTimer.timeScalers(null,null)];
        this.resetSkipOffset = null;

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
            var succeeded = this.invokeCallback(this.scaledCallBack);

            this.currentInterval = this.interval;

            //check if the above succeeded
            if (succeeded == false)
            {
                //add to current failed count
                this.currentFailedCount++;

                //change interval of timer to new scaled interval
                //use "this" as current function is timer's callback
                this.interval = this.findCurrentTimeScaler().interval;
            }
            else
            {
                //check if the function had failed before
                if (this.currentFailedCount != 0)
                {     
                    //reset failed count
                    //once it has succeeded
                    this.currentFailedCount = 0;

                    //change interval of timer to new scaled interval
                    //use "this" as current function is timer's callback
                    this.interval = this.findCurrentTimeScaler().interval;
                }
            }

            //reset skip offset if it was previous active
            if (this.skipOffset != null)
            {
                this.skipOffset = this.resetSkipOffset;
                this.skipOffset = null;
            }

            //check if interval is changing, then
            //force offset skipping to allow interval change without instant call
            if (this.currentInterval != this.interval)
            {
                this.resetSkipOffset = this.skipOffset;
                this.skipOffset = true;
            }

        }

        //create timer with the callback of "waitForTimer"
        cTimer.timer.call(this, _name, new cTimer.callback(this.waitForTimer),
                        _timeScalers[0].interval, _startOnCreation, 
                        _runTime, _enableOffset);
    }

    //holds specific real-time timer data (10ms fastest realtime due to ancient browser stuff)
    this.realtimeTimer = function realtimeTimer(_name, _callback, _startOnCreation, _runTime, _destroyOnStop)
    {
        //setup timer for current scaled timer
        this.realtimeCallback = _callback;
        this.destroyOnStop = _destroyOnStop || false;

        //wait and respond to timer
        this.waitForTimer = function waitForTimer()
        {
            //update callback and test if continue
            this.realtimeCallback.args.ticksElapsed = this.ticksElapsed;
            var _cont = this.invokeCallback(this.realtimeCallback);

            if (!_cont)
            {
                if (this.destroyOnStop)
                {
                    this.destroy();
                }
                else
                {
                    this.stop();
                }
            }
        }

        //create a 10ms timer with the callback "waitForTimer"
        cTimer.timer.call(this, _name, new cTimer.callback(this.waitForTimer), 
            10, _startOnCreation, _runTime, true);
    }
}

function cTimerFunctions()
{
    this.findTimerByName = function findTimerByName(_name)
    {
        var _ret = null;
        cTimer.timers.forEach(function(_timer, _index, _arr) {
            if (_timer.name == _name) { return _ret = _arr[_index]; }
        });
        return _ret;
    }

    //return the timer with _id
    this.findTimerByID = function findTimerByID(_id)
    {
        //find index of timer with id
        var index = cTimer.generic.findTimerIndexByID(_id);
        
        //check index exists
        if (index != null)
        {
            return cTimer.timers[index];
        }
    }

    this.findTimerIndexByID = function findTimerIndexByID(_id)
    {
        var _ret = null;
        cTimer.timers.forEach(function(_timer, _index, _arr) {
            if (_timer.timerID == _id) { return _ret = _arr[_index]; }
        });
        return _ret;
    }

    /* Depricated Due to not needing it anymore

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
    } */
}


/*
    Title:
        Utility

    Description:
        Used to assist other classes with non-class specific things
*/

window.cUtility = window.cUtility || new function cUtility() {
    this.findHTMLObjectsFromClassName = function findHTMLObjectsFromClassName(name) {
        var nameParsed = (name.replace(/[.,\/#!$%\^&\*;:{}=_`~() ]/g, "-")).toLowerCase();
        return $("[class*=-" + nameParsed + "]");
    }

    this.compareMooDValue = function compareMooDValue(_toCheckElement, _toCheckJQuery, _toCheckValue, _compareValue) {
        //setup basic variables
        var _toCheckJQuery = _toCheckJQuery || "";
        var _toCheckHTML;

        //find the html that is supposed to be checked
        if (_toCheckJQuery && _toCheckJQuery != "") {
            _toCheckHTML = window.cUtility.findHTMLObjects(_toCheckElement).find(_toCheckJQuery);
        } else {
            _toCheckHTML = window.cUtility.findHTMLObjects(_toCheckElement);
        }

        //loop through all results found
        for (var h = 0; h < _toCheckHTML.length; h++) {
            //check if value to check exists
            if (_toCheckValue && _toCheckHTML[h][_toCheckValue]) {
                //compare value to compare value
                if (_toCheckHTML[h][_toCheckValue] == _compareValue) {
                    //return true if compared
                    return true;
                }
            }
        }

        //return false because compare failed
        return false;
    }

    //add onClick to HTML
    this.addOnClickToHTML = function addOnClickToHTML(_htmlObj, _function, _addOrCreate) {
        //add onto onclick
        if (_addOrCreate) {
            if (_htmlObj.length != null) {
                $(_htmlObj).each(function () {
                    if (this.getAttribute("onclick")) {
                        //add onto onclick
                        this.setAttribute("onclick", this.getAttribute("onclick") + ";" + _function);
                    } else {
                        //set onclick to be _function
                        this.setAttribute("onclick", _function);
                    }
                });
            } else {
                //check if onclick exists and is add
                if (_htmlObj.getAttribute("onclick")) {
                    //add onto onclick
                    _htmlObj.setAttribute("onclick", _htmlObj.getAttribute("onclick") + ";" + _function);
                } else {
                    //set onclick to be _function
                    _htmlObj.setAttribute("onclick", _function);
                }
            }
        } else {
            if (_htmlObj.length != null) {
                $(_htmlObj).each(function () {
                    //add onto onclick
                    this.setAttribute("onclick", _function);
                });
            } else {
                //create on click to be _function
                _htmlObj.setAttribute("onclick", _function);
            }
        }
    }

}();


/*
    Title:
        Cookies

    Description:
        Used to allow easy listening to specific cookies without using onCookieChange
*/

window.cCookies = window.cCookies || new function cCookies() {

    //====VARIABLES====//
    this.lastUpdatedCookies = {};
    this.currentUpdateCookies = {};
    this.cookieData = {};

    //====DATA TYPES====//
    this.dataTypes = new cCookieDataTypes();

    this.CookieCallback = this.dataTypes.cookieCallback.prototype;
    this.cookieCallback = this.dataTypes.cookieCallback;

    this.CookieData = this.dataTypes.cookieData.prototype;
    this.cookieData = this.dataTypes.cookieData;

    //====FUNCTIONS====//
    this.internal = new cCookiesInternalFunctions();
    this.setup = new cCookiesSetupFunctions();
    this.generic = new cCookiesGenericFunctions();

    this.updateCookieTimer = null;
    var _this = this;

    (function setupTimer() {
        if (typeof cTimer !== 'undefined') {
            _this.updateCookieTimer = new cTimer.timer("Cookie Update Timer", new cTimer.callback(_this.internal.updateCookies, null, null), 10, true, null, false);
        } else {
            setTimeout(function () {
                return setupTimer();
            }, 10);
        }
    })();
}

function cCookieDataTypes() {

    //holds specific callback data for use in cookie
    this.cookieCallback = function cookieCallback(_callbackName, _caller, _listenToCookie, _callback, _listenFor) {
        this.callbackName = _callbackName || null;
        this.caller = _caller || null;
        this.listenToCookie = _listenToCookie || null;
        this.callback = _callback || null;
        this.listenFor = _listenFor || null;
    }

    //holds specific callback data for use with cookie listeners
    this.cookieData = function cookieCallback(_cookieName) {
        this.cookieName = _cookieName || null;
        this.listeners = {};
        var _this = this;

        this.addListener = function addListener(_listener) {
            this.listeners[_listener.callbackName] = _listener;
        }

        this.removeListener = function addListener(_listener) {
            this.listeners[_listener.callbackName] = null;
        }

        //loop through all listeners and invoke callback on them
        //if they are listening for the value
        this.sendUpdate = function sendUpdate(_value) {
            _value = _value || null;
            for (var key in _this.listeners) {
                if (Object.prototype.hasOwnProperty.call(_this.listeners, key)) {
                    var prop = _this.listeners[key];
                    if (prop.listenFor == null || _value == prop.listenFor) {
                        cCookies.internal.invokeCallback(prop, _value);
                    }
                }
            }
        }
    }
}

function cCookiesSetupFunctions() {

    this.addCookieListener = function addCookieListener(_cookieCallback) {
        //make sure cookie data exists before adding
        if (cCookies.cookieData[_cookieCallback.listenToCookie] == null) {
            cCookies.cookieData[_cookieCallback.listenToCookie] = new cCookies.cookieData(_cookieCallback.listenToCookie);
        }

        //add _cookieCallback to cookie data
        cCookies.cookieData[_cookieCallback.listenToCookie].addListener(_cookieCallback);
    }

    this.removeCookieListener = function removeCookieListener(_cookieCallback) {
        //if cookie data exists remove _cookieCallback from its listeners
        if (cCookies.cookieData[_cookieCallback.listenToCookie] != null) {
            cCookies.cookieData[_cookieCallback.listenToCookie].removeListener(_cookieCallback);
        }
    }
}

function cCookiesInternalFunctions() {

    //keep cookies up to date
    this.updateCookies = function updateCookies() {
        //reset current cookies and update previous cookies
        cCookies.lastUpdatedCookies = cCookies.currentUpdateCookies;
        cCookies.currentUpdateCookies = {};

        //read cookies into current cookies
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];

            //remove any leading empty characters
            while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);

            //grab relevant cookie data
            var cookieName = cookie.slice(0, cookie.indexOf('='));
            var cookieValue = cookie.slice(cookie.indexOf('=') + 1, cookie.length);

            //add cookie to current cookies
            cCookies.currentUpdateCookies[cookieName] = {
                cookie: cookieName,
                value: cookieValue
            };
        }

        //loop through all previous cookies
        for (var key in window.cCookies.lastUpdatedCookies) {
            if (Object.prototype.hasOwnProperty.call(window.cCookies.lastUpdatedCookies, key)) {
                var prop = window.cCookies.lastUpdatedCookies[key];
                var exists = window.cCookies.currentUpdateCookies[prop.cookie];

                //check if the cookie has been deleted
                if (exists == null) {
                    cCookies.internal.cookieChanged(prop.cookie, null);
                }
                //otherwise check if the cookie has been changed
                else if (exists.value != prop.value) {
                    cCookies.internal.cookieChanged(prop.cookie, exists.value);
                }
            }
        }

        //loop through all current cookies
        for (var key in window.cCookies.currentUpdateCookies) {
            if (Object.prototype.hasOwnProperty.call(window.cCookies.currentUpdateCookies, key)) {
                var prop = window.cCookies.currentUpdateCookies[key];
                var exists = window.cCookies.lastUpdatedCookies[prop.cookie];

                //check if the cookie has been added this update
                if (exists == null) {
                    cCookies.internal.cookieChanged(prop.cookie, null);
                }
            }
        }
    }

    //run callback based on input callback
    this.invokeCallback = function (_cookieCallback, _value) {
        //check callback exists
        if (_cookieCallback != null && _cookieCallback.callback != null) {
            //check if caller suppied with callback
            if (_cookieCallback.caller != null) {
                //invoke callback with caller as "this"
                return _cookieCallback.callback.call(_cookieCallback.caller, _value);
            } else {
                //invoke callback with timer as "this"
                return _cookieCallback.callback.call(this, _value);
            }
        }

        //return null if no callback
        return null;
    }

    //send update to any cookies that have changed
    this.cookieChanged = function cookieChanged(_cookie, _value) {
        //loop through all cookie data
        for (var key in window.cCookies.cookieData) {
            if (Object.prototype.hasOwnProperty.call(window.cCookies.cookieData, key)) {
                var prop = window.cCookies.cookieData[key];
                //check if the cookie data is for cookie
                if (prop.cookieName == _cookie) {
                    //send update message to listeners
                    prop.sendUpdate(_value);
                    return;
                }
            }
        }
    }
}

function cCookiesGenericFunctions() {

    //get cookie from current cookies or document.cookie
    this.getCookie = function getCookie(_cookie, _checkNow) {

        _checkNow = _checkNow || false;

        //check previous values if requested
        if (_checkNow != true && cCookies.currentUpdateCookies[_cookie] != null) {
            return cCookies.currentUpdateCookies[_cookie].value;
        }

        //check document.cookie if cookie
        // doesn't exist or _checkNow is true
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];

            //remove any leading empty characters
            while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);

            //check if cookie is _cookie and return
            if (cookie.indexOf(_cookie + '=') == 0) return cookie.substring(_cookie.length + 1, cookie.length);
        }
    }

    //add cookie to cookies
    this.addCookie = function addCookie(_cookie, _value) {
        document.cookie = _cookie + "=" + _value + ";";
        cCookies.internal.updateCookies();
    }

    this.changeCookie = function addCookie(_cookie, _value) {
        cCookies.generic.addCookie(_cookie, _value);
    }

    //remove cookie from cookies
    this.removeCookie = function removeCookie(_cookie) {
        cCookies.generic.addCookie(_cookie, "");
    }

}


/*
	Title:
		cExpander
	
	Description:
        Handle size expandable functions to
        resize DOM objects to remove scrollers
*/

window.cExpander = window.cExpander || new function customExpander() {

	//====DATA TYPES====//
	this.dataTypes = new cExpanderDataTypes();

	this.ExpansionData = this.dataTypes.expansionData.prototype;
	this.expansionData = this.dataTypes.expansionData;

	this.CalculatedObjectData = this.dataTypes.calculatedObjectData.prototype;
	this.calculatedObjectData = this.dataTypes.calculatedObjectData;

	//====FUNCTIONS====//
	this.expansion = new cExpanderFunctions();
	this.search = new cExpanderSearchFunctions();

	//====VARIABLES====//
	this.allExpansionData = [];
	this.allCalculatedObjects = [];
	this.uniqueID = 1;
	this.uniqueCalculatedID = 1;

	//====RUN-TIME FUNCTIONS====//

}();

function cExpanderDataTypes() {

	this.expansionData = function expansionData(_objectToExpand, _scroller, _expandToHeight, _scrollerWidthOffset, _expanderIncludes, _expansionCssClass, _expansionID) {
		if (_objectToExpand == null) {
			return null;
		}

		var _this = this;
		this.ID = _expansionID || cExpander.uniqueID;

		if (this.ID >= cExpander.uniqueID) {
			cExpander.uniqueID = this.ID + 1;
		}

		this.objectToExpand = _objectToExpand;
		this.objectToExpandDOM = this.objectToExpand;
		this.usesElement = false;

		if (typeof this.objectToExpand === "object") {
			if (typeof window.cElement != "undefined") {
				if (this.objectToExpand instanceof cElement.element) {
					this.usesElement = true;
					this.objectToExpandDOM = cUtility.findHTMLObjects(_this.objectToExpand);
				}
			}
		} else {
			this.objectToExpandDOM = $(this.objectToExpand);
		}

		this.scroller = _scroller || ".scroller, .matrix-Scroller";
		this.scrollerDOM = this.objectToExpandDOM.find(_this.scroller);
		this.scrollerWidthOffset = _scrollerWidthOffset || 0;

		if (this.objectToExpandDOM.length && this.objectToExpandDOM.length > 0) {
			this.objectToExpandDOM = this.objectToExpandDOM[0];
		}

		this.expanderIncludes = _expanderIncludes || "*";

		this.expansionCssClass = _expansionCssClass || "defaultExpansion";

		$(_this.objectToExpandDOM).addClass(_this.expansionCssClass);
		this.scrollerDOM.addClass(_this.expansionCssClass);

		this.expandToHeight = _expandToHeight == null ? -1 : _expandToHeight;
		this.originalHeight = -1;
		this.heightChanged = -1;
		this.expanded = false;
		this.previousExpanded = false;

		this.objectsMovedDOM = [];

		this.checkMovedExists = function checkMovedExists(_toCheck) {
			for (var i = 0; i < _this.objectsMovedDOM.length; i++) {
				if (_this.objectsMovedDOM[i] == _toCheck) {
					return true;
				}
			}
		}

		this.resetMoved = function resetMoved() {
			while (_this.objectsMovedDOM.length > 0) {
				var _styleData = new cCss.styleSheetModificationData({
					prop: "transform",
					cssProp: "transform",
					insidePropProp: "translateY"
				}, true, 1, null, 0, true);
				var _objectStyleID = cExpander.search.returnCalculatedObjectDataFromObject(_this.objectsMovedDOM[0], cExpander.uniqueCalculatedID);
				var _selector = cCss.styleSheet.translateCssSelector(".ExpansionMoved" + _objectStyleID.ID, "MainExpansionStyles");
				var _currentTransform = cCss.styleSheet.getCssStyle(_selector.style, _styleData, 2);

				_styleData.value = (_currentTransform.values.length > 0) ? parseInt(_currentTransform.values[0].replace(/\(|\)/gi, ""), 10) - _this.heightChanged : 0;
				_styleData.value += "px";

				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", ".ExpansionMoved" + _objectStyleID.ID, _styleData);

				_this.objectsMovedDOM.shift();
			}
		}
	}

	this.calculatedObjectData = function calculatedObjectData(_object, _id) {
		if (_object == null) {
			return null;
		}
		this.object = _object;
		this.ID = _id || cExpander.uniqueCalculatedID;

		if (this.ID >= cExpander.uniqueCalculatedID) {
			cExpander.uniqueCalculatedID = this.ID + 1;
		}
	}

}

function cExpanderSearchFunctions() {
	this.returnExpansionDataFromObject = function returnExpansionData(_objectToExpand, _expansionCreationData) {
		for (var l = 0; l < cExpander.allExpansionData.length; l++) {
			if (cExpander.allExpansionData[l].objectToExpand == _objectToExpand ||
				cExpander.allExpansionData[l].objectToExpandDOM == _objectToExpand) {
				return cExpander.allExpansionData[l];
			}
		}

		if (_expansionCreationData != null) {
			return cExpander.expansion.createExpansionData(_expansionCreationData);
		}

		return null;
	}

	this.returnExpansionDataFromID = function returnExpansionDataFromID(_id, _expansionCreationData) {
		for (var l = 0; l < cExpander.allExpansionData.length; l++) {
			if (cExpander.allExpansionData[l].ID == _id) {
				return cExpander.allExpansionData[l];
			}
		}

		if (_expansionCreationData != null) {
			return cExpander.expansion.createExpansionData(_expansionCreationData);
		}

		return null;
	}

	this.returnCalculatedObjectDataFromObject = function returnCalculatedObjectDataFromObject(_object, _createOnFailID) {
		for (var l = 0; l < cExpander.allCalculatedObjects.length; l++) {
			if (cExpander.allCalculatedObjects[l].object == _object) {
				return cExpander.allCalculatedObjects[l];
			}
		}

		if (_createOnFailID) {
			return cExpander.expansion.createCalculatedData(_object, _createOnFailID);
		}

		return null;
	}

	this.returnCalculatedObjectDataFromID = function returnCalculatedObjectDataFromID(_id, _createOnFailObject) {
		for (var l = 0; l < cExpander.allCalculatedObjects.length; l++) {
			if (cExpander.allCalculatedObjects[l].ID == _id) {
				return cExpander.allCalculatedObjects[l];
			}
		}

		if (_createOnFailObject) {
			return cExpander.expansion.createCalculatedData(_createOnFailObject, _id);
		}

		return null;
	}
}

function cExpanderFunctions() {

	this.createExpansionData = function createExpansionData(_expansionCreationData) {
		var _expansionData = new cExpander.expansionData(
			_expansionCreationData._objectToExpand, _expansionCreationData._scroller, _expansionCreationData._expandToHeight, _expansionCreationData._scrollerWidthOffset, _expansionCreationData._expanderIncludes, _expansionCreationData._expansionCssClass, _expansionCreationData._id);

		cExpander.allExpansionData.push(_expansionData);
		return _expansionData;
	}

	this.createCalculatedData = function createCalculatedData(_object, _id) {
		var _calculatedData = new cExpander.calculatedObjectData(_object, _id);
		cExpander.allCalculatedObjects.push(_calculatedData);
		return _calculatedData;
	}

	this.toggleExpansionID = function toggleExpansionID(_id, _expanded) {
		return cExpander.expansion.toggleExpansion(cExpander.search.returnExpansionDataFromID(_id), _expanded);
	}

	this.toggleExpansionObject = function toggleExpansion(_object, _expanded) {
		return cExpander.expansion.toggleExpansion(cExpander.search.returnExpansionDataFromObject(_object), _expanded);
	}

	this.toggleExpansion = function toggleExpansion(_expansionData, _expanded) {
		if (_expansionData == null) {
			return false;
		}

		_expansionData.previousExpanded = _expansionData.expanded;

		if (_expanded) {
			_expansionData.expanded = _expanded;
		} else {
			_expansionData.expanded = !_expansionData.expanded;
		}

		cExpander.expansion.updateExpansion(_expansionData);
		return true;
	}

	this.updateExpansion = function updateExpansion(_expansionData) {

		var _styleData = {};

		if (_expansionData.expanded) {
			//get total size of all items inside the inline form
			var totalSize = cMaths.Bounds.fromObject(_expansionData.objectToExpandDOM, document, _expansionData.expanderIncludes).size.y;

			if (_expansionData.expandToHeight != -1) {
				if (totalSize > _expansionData.expandToHeight) {
					totalSize = _expansionData.expandToHeight;
				}
			}

			if (_expansionData.previousExpanded == false) {
				totalSize += _expansionData.scrollerWidthOffset;
			}

			if (_expansionData.previousExpanded != _expansionData.expanded) {
				_expansionData.originalHeight = cMaths.Bounds.fromObject(_expansionData.scrollerDOM[0], document, null).size.y;
				_expansionData.heightChanged = totalSize - _expansionData.originalHeight;
			}

			//set height to be total size
			_styleData = new cCss.styleSheetModificationData({
				prop: "height",
				cssProp: "height"
			}, false, 0, totalSize + "px", -1, true);
			cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);

			//move all other html that might've been affected
			cExpander.expansion.moveHTMLToNotOverlap(_expansionData)

		} else {
			if (_expansionData.originalHeight != -1) {
				_styleData = new cCss.styleSheetModificationData({
					prop: "height",
					cssProp: "height"
				}, false, 0, _expansionData.originalHeight + "px", -1, true);
				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", "." + _expansionData.expansionCssClass, _styleData);

				//move all other html that might've been affected
				_expansionData.resetMoved();
			}
		}

		if (cPageResizer != null) {
			cPageResizer.resizePage();
		}
	}

	this.moveHTMLToNotOverlap = function moveHTMLToNotOverlap(_expansionData, _object, _allElements) {
		var _objectBounds = cMaths.Bounds.fromObject(_object, document);

		if (!_allElements) {
			_allElements = [];
			_expansionData.moved = [];
			_objectBounds = cMaths.Bounds.fromObject(_expansionData.objectToExpandDOM, document);

			var _objToIgnore = [$("img[usemap='#ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']" [0]),
				$("map[name='ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']" [0]),
				$("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]")[0],
				_expansionData.objectToExpandDOM
			]

			_allElements = $(".InteractiveModel").children().filter(function () {

				if ($.inArray(this, _objToIgnore) != -1) {
					return false;
				}

				if ($(this).is("div")) {
					var _bounds = cMaths.Bounds.fromObject(this, document);

					if (_bounds.y2 > _objectBounds.y1) {
						return true;
					}
				}

				return false;

			}).toArray();
		}

		var _allWithin = null;
		var _lastLowest = null;
		var _completeBounds = _objectBounds.clone();

		do {
			_lastLowest = _allWithin == null ? null : _allWithin.length > 0 ? _allWithin[0].object : null;
			_allWithin = cMaths.collision.returnObjectsIntersectArea(_completeBounds, _allElements).sort(function (a, b) {
				return (a.y2 > b.y2);
			});

			if (_allWithin.length > 0) {
				_completeBounds.y2 = _allWithin[0].y2;
				_completeBounds.updateExtras();
			}
		} while (_allWithin.length != 0 && _allWithin[0].object != _lastLowest)

		for (var i = 0; i < _allWithin.length; i++) {
			if (!(_expansionData.checkMovedExists(_allWithin[i]._object))) {

				var _styleData = new cCss.styleSheetModificationData({
					prop: "transform",
					cssProp: "transform",
					insidePropProp: "translateY"
				}, true, 1, null, 0, true);
				var _objectStyleID = cExpander.search.returnCalculatedObjectDataFromObject(_allWithin[i]._object, cExpander.uniqueCalculatedID);
				var _selector = cCss.styleSheet.translateCssSelector(".ExpansionMoved" + _objectStyleID.ID, "MainExpansionStyles");

				var _currentTransform = cCss.styleSheet.getCssStyle(_selector.style, _styleData, 2);

				_styleData.value = (_currentTransform.values.length > 0) ? parseInt(_currentTransform.values[0].replace(/\(|\)/gi, ""), 10) + _expansionData.heightChanged : _expansionData.heightChanged;
				_styleData.value += "px";

				cCss.styleSheet.replaceCssStyle("MainExpansionStyles", ".ExpansionMoved" + _objectStyleID.ID, _styleData);

				_expansionData.objectsMovedDOM.push(_allWithin[i]._object);
				$(_allWithin[i]._object).addClass("ExpansionMoved" + _objectStyleID.ID);
			}
		}

	}

}


/*
	Title:
		Custom Fading functions
	
	Description:
		Attempt at making a fading image slideshow
*/


window.cFader = window.cFader || new function customFader() {
    //====VARIABLES====//
    this.allFaderData = [];
    this.uniqueFaderID = 10000;
    this.uniqueFadingDataID = 1;

    //====DATA TYPES====//
    this.dataTypes = new cFaderDataTypes();

    this.FaderData = this.dataTypes.faderData.prototype;
    this.faderData = this.dataTypes.faderData;

    this.FadingData = this.dataTypes.fadingData.prototype;
    this.fadingData = this.dataTypes.fadingData;

    //====FUNCTIONS====//
    this.generic = new cFaderGenericFunctions();
    this.search = new cFaderSearchFunctions();
}();

function cFaderDataTypes() {

    this.faderData = function faderData(_fadingData, _startIndex, _faderID, _startOnCreation) {
        if (_fadingData == null) {
            return null;
        }

        this.fadingData = [];
        this.id = _faderID || cFader.uniqueFaderID;

        if (this.id == cFader.uniqueFaderID) {
            cFader.uniqueFaderID++;
        }

        this.index = _startIndex || 0;
        this.isFading = false;
        var _this = this;

        this.updateFadedCallback = function updateFadedCallback() {
            var _ret = false;

            _this.fadingData[_this.index].toggleObject(false);

            if (_this.index++ >= _this.fadingData.length - 1) {
                _this.index = 0;
                _ret = true;
            }

            _this.fadingData[_this.index].toggleObject(true);
            return _ret;
        }

        this.calculateScaledTimerTime = function calculateScaledTimerTime() {
            var _ret = [];
            for (var l = 0; l < this.fadingData.length; l++) {
                _ret.push(new cTimer.scaledTime(l, this.fadingData[l].timeActive));
            }
            return _ret;
        }

        this.updateTimerTimes = function updateTimerTimes() {
            if (this.faderTimer == null) {
                return null;
            }
            this.faderTimer.scaledTime = this.calculateScaledTimerTime();
        }

        this.toggleFading = function toggleFading(_toggle) {
            if (_toggle) {
                this.isFading = true;
                this.faderTimer.start();
            } else {
                this.isFading = false;
                this.faderTimer.stop();
            }
        }

        this.addFadingData = function addFadingData(_fadingData) {
            if (_fadingData instanceof Array) {
                for (var l = 0; l < _fadingData.length; l++) {
                    this.addFadingData(_fadingData[l]);
                }
                this.updateTimerTimes();
                return true;
            } else if (_fadingData instanceof cFader.fadingData) {
                _fadingData.faderDataParent = _this;
                this.fadingData.push(_fadingData);
                this.updateTimerTimes();
                return true;
            }

            return false;
        }

        this.findFadingIndexFromObject = function findFadingIndexFromObject(_object) {
            for (var l = 0; l < _this.fadingData.length; l++) {
                if (_this.fadingData[l].objectToFade == _object) {
                    return l;
                }
            }

            return -1;
        }

        this.destroy = function destroy() {
            this.faderTimer.destroy();
            var index = cFader.search.findFaderDataIndexFromID(this.id);
            cFader.allFaderData.splice(index, 1);
        }

        this.addFadingData(_fadingData);
        this.faderTimer = new cTimer.scaledTimer("FaderTimer" + this.id, new cTimer.callback(this.updateFadedCallback), false, this.calculateScaledTimerTime(), null, true);

        if (_startOnCreation) {
            this.toggleFading(true);
        }

    }

    this.fadingData = function fadingData(_objectToFade, _timeActive, _cssFadeIn, _cssFadeOut, _cssStart) {
        if (_objectToFade == null) {
            return null;
        }
        this.objectToFade = _objectToFade;
        this.timeActive = _timeActive;
        this.cssFadeIn = _cssFadeIn;
        this.cssFadeOut = _cssFadeOut;
        this.cssStart = _cssStart;
        this.id = cFader.uniqueFadingDataID++;
        this.faderDataParent = null;

        this.toggleObject = function toggleObject(_toggle) {
            if (_toggle) {
                this.enableObject();
            } else {
                this.disableObject();
            }
        }

        this.enableObject = function enableObject() {
            this.removeClass(this.cssFadeOut);
            this.removeClass(this.cssStart);
            this.applyClass(this.cssFadeIn);
        }

        this.disableObject = function disableObject() {
            this.removeClass(this.cssFadeIn);
            this.removeClass(this.cssStart);
            this.applyClass(this.cssFadeOut);
        }

        this.disableOnStart = function disableOnStart() {
            if (this.faderDataParent == null) {
                return null;
            }

            var _styleData = new cCss.styleSheetModificationData({
                prop: "opacity",
                cssProp: "opacity"
            }, false, -1, 0, -1, false);
            cCss.styleSheet.replaceCssStyle("MainFaderStyles", ".Fader" + this.faderDataParent.id + "Startup" + this.id, _styleData);

            _styleData = new cCss.styleSheetModificationData({
                prop: "transition",
                cssProp: "transition",
                insidePropProp: "opacity"
            }, true, 2, 0, -1, false);
            cCss.styleSheet.replaceCssStyle("MainFaderStyles", ".Fader" + this.faderDataParent.id + "Startup" + this.id, _styleData);

            $(this.objectToFade).addClass("Fader" + this.faderDataParent.id + "Startup" + this.id);
        }

        this.applyClass = function applyClass(_class) {
            if (_class != null && this.objectToFade != null) {
                $(this.objectToFade).addClass(_class);
            }
        }

        this.removeClass = function removeClass(_class) {
            if (_class != null && this.objectToFade != null) {
                $(this.objectToFade).removeClass(_class);
            }
        }

        this.clearElementClass = function clearElementClass() {
            if (this.objectToFade != null) {
                if (typeof window.cElement != "undefined") {
                    //var _elementData = cElement.search.findEleme
                }
            }
        }

        if (this.cssStart) {
            this.applyClass(this.cssStart);
        }
    }

}



function cFaderGenericFunctions() {
    this.toggleFaderID = function toggleFader(_id, _toggle) {
        var _fader = cFader.search.findFaderDataFromID(_id);

        if (_fader) {
            _fader.toggleFader(_toggle);
            return true;
        }

        return false;
    }

    this.toggleFaderObject = function toggleFaderObject(_object, _toggle) {
        var _fader = cFader.search.findFaderDataFromObject(_object);

        if (_fader) {
            _fader.toggleFader(_toggle);
            return true;
        }

        return false;
    }

    this.createFader = function createFader(_fadingData, _startIndex, _faderID, _startOnCreation) {
        var _faderData = new cFader.faderData(_fadingData, _startIndex, _faderID, _startOnCreation);
        cFader.allFaderData.push(_faderData);
    }

    this.destroyFaderID = function destroyFaderID(_id) {
        var _fader = cFader.search.findFaderDataFromID(_id);

        if (_fader) {
            _fader.destroy();
            return true;
        }

        return false;
    }

    this.destroyFaderObject = function destroyFaderObject(_object) {
        var _fader = cFader.search.findFaderDataFromObject(_object);

        if (_fader) {
            _fader.destroy();
            return true;
        }

        return false;
    }
}

function cFaderSearchFunctions() {
    this.findFaderDataFromObject = function findFaderDataFromObject(_object) {
        var _faderIndex = cFader.search.findFaderDataIndexFromObject(_object);
        if (_faderIndex != -1) {
            return cFader.allFaderData[_faderIndex];
        }

        return null;
    }

    this.findFaderDataIndexFromObject = function findFaderDataIndexFromObject(_object) {
        for (var l = 0; l < cFader.allFaderData.length; l++) {
            if (cFader.allFaderData[l].findFadingIndexFromObject(_object) != -1) {
                return l;
            }
        }

        return -1;
    }

    this.findFaderDataFromID = function findFaderDataFromID(_faderID) {
        var _faderIndex = cFader.search.findFaderDataIndexFromID(_faderID);
        if (_faderIndex != -1) {
            return cFader.allFaderData[_faderIndex];
        }

        return null;
    }

    this.findFaderDataIndexFromID = function findFaderDataIndexFromID(_faderID) {
        for (var l = 0; l < cFader.allFaderData.length; l++) {
            if (cFader.allFaderData[l].id == _faderID) {
                return l;
            }
        }

        return -1;
    }
}


/*
	Title:
		Inline Form Code
	
	Description:
		Modify Inline Forms To Make Relatinships Navigable
		Modify Inline Forms To Make Relatinships Size Correct
*/

window.cInlineForm = window.cInlineForm || new function customInlineForm() {

    this.enableRelationshipNavigation = false;
    this.enableKnowledgeActivatedDocumentsNavigation = false;
    this.enableInlineFormWidthChanges = false;

    this.enableHideEmptyInlineForms = false;
    this.emptyInlineSearchTerm = "div.fieldControlContainer";

    this.fieldAndDescriptionSameLine = true;
    this.fieldOuterWidth = "75em";
    this.fieldInnerWidth = "95%";

    this.generic = new cInlineFormFunctions();
}();

function cInlineFormFunctions() {
    this.hideEmptyHTMLFields = function hideEmptyHTMLFields() {
        $(window.cInlineForm.emptyInlineSearchTerm).each(function (index, element) {
            var editorElement = $(element);

            if (editorElement.outerHeight() === 0) {

                var parent = editorElement.closest("div.fieldContainer");
                parent.css('display', 'none');

                var separator = parent.prev(".separator")
                if (separator) {
                    $(separator).css('display', 'none');
                }
            }
        });
    }

    //applies any width changes and titles css changes to inline forms
    this.modifyInlineFields = function modifyInlineFields() {
        $(".mood-inlineformelementeditor").each(function () {

            var currentInlineForm = this;

            //wait until the inline form has been populated
            (function checkSize() {
                var totalSize = 0;

                $(currentInlineForm).find(".editorContainer").each(function () {

                    totalSize += $(this).outerHeight();

                });

                if (totalSize == 0) {
                    setTimeout(checkSize, 100);
                }
            });

            $(this).find(".fieldLabel").each(function () {
                this.classList.add("inlineFormTitleModified");
            });

            $(this).find(".fieldDescription").each(function () {
                this.classList.add("inlineFormDescriptionModified");
            });

            $(this).find(".fieldControlContainer").each(function () {
                $(this).removeClass("widthSingle").css("width", cInlineForm.fieldInnerWidth);
                if (cInlineForm.fieldAndDescriptionSameLine) {
                    $(this).siblings(".fieldInformation").removeClass("widthSingle").css("width", "auto").css("max-width", "45%");
                } else {
                    $(this).siblings(".fieldInformation").removeClass("widthSingle").css("width", "auto").css("max-width", "100%");
                }
                $(this).closest(".fieldContainer").removeClass("widthSingle").css("width", cInlineForm.fieldOuterWidth).css("padding-right", "0%");
            });

            $(this).find(".editorContainer").each(function () {
                $(this).css("padding-right", "0%");
            });

            $(this).find(".HtmlEditorReadOnly").each(function () {
                $(this).children("div").css("overflow-y", "hidden");
            });

            if (cInlineForm.fieldAndDescriptionSameLine) {
                $(this).find(".fieldLabel").each(function () {
                    var _this = $(this).parent(".fieldInformation").length > 0 ? $(this).parent(".fieldInformation") : this;
                    $(_this).css("display", "inline-block").css("max-width", "45%").css("width", "auto").css("margin-bottom", "0%");
                });

                $(this).find(".fieldDescription").each(function () {
                    $(this).css("display", "inline-block").css("max-width", "45%").css("width", "auto").css("margin-left", "5%");
                });
            }

        });

    }

    //remove check boxes and excess relationships visuals
    this.setupInlineRelationships = function setupInlineRelationships() {

        //search for all relationship tick/radio lists
        $(".RelationshipTickListFieldControl, .RelationshipRadioListFieldControl").each(function () {

            //force opacity to be full on disabled relationship links
            $(this).find(".dx-state-disable.dx-list.dx-widget").each(function () {
                this.style.opacity = 1;
            });

            //remove all of the "none" options
            $(this).find(".list-item-text[title='None']").closest(".dx-list-item").each(function () {

                this.remove();

            });

            //remove all of the checkboxes
            $(this).find(".dx-list-item-before-bag").each(function () {

                this.remove();

            });

            //set all of the remaining items width to "auto"
            //and make cursor change to pointer when selecting
            //and add css class to text
            $(this).find(".dx-list-item").each(function () {

                this.style.width = "auto";

                $(this).find(".list-item-text").each(function () {
                    $(this).addClass("inlineFormRelationshipTextModified");
                });

            });

        });

    }
}

function enableInlineOptions() {
    if (Salamander.lang.isSysDefined()) {
        if (Sys.WebForms) {
            if (Sys.WebForms.PageRequestManager) {
                if (Sys.WebForms.PageRequestManager.getInstance()) {
                    if (cInlineForm.enableHideEmptyInlineForms) {
                        Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineForm.generic.hideEmptyHTMLFields);
                    }

                    if (cInlineForm.enableInlineFormWidthChanges) {
                        Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineForm.generic.modifyInlineFields);
                    }

                    if (cInlineForm.enableRelationshipNavigation) {
                        var doit = function notready() {
                            window.alert("Ooops");
                        };

                        doit = function ready() {
                            if (Salamander.lang.isNullOrUndefined(Salamander.widget.List)) {
                                setTimeout(doit);
                            } else {

                                Salamander.widget.List.prototype.alternativeTemplate = function alternativeTemplate(data) {
                                    if (data.Value && data.Value.length) {
                                        var parts = data.Value.split('-');
                                        var elementType = parts[0];
                                        var elementId = parts[1];
                                        return Salamander.dx.templates.listItemTemplate(data.Text, data.IconUrl, "Controller.aspx?elementId=" + elementId + "&elementType=" + elementType);
                                    } else {
                                        return null;
                                    }
                                };

                                var ensureConfiguration = Salamander.widget.List.prototype.ensureConfiguration;

                                Salamander.widget.List.prototype.ensureConfiguration = function ensureconfiguration(config) {
                                    var result = ensureConfiguration.call(this, config);
                                    result.itemTemplate = this.alternativeTemplate;
                                    result.enabled = false;
                                    return result;
                                };

                            }


                        };

                        doit();

                    }

                    if (cInlineForm.enableKnowledgeActivatedDocumentsNavigation) {
                        var dothat = function notready() {
                            window.alert("Not ready");
                        };

                        dothat = function ready() {
                            if (Salamander.lang.isNullOrUndefined(Salamander.dx) || Salamander.lang.isNullOrUndefined(Salamander.dx.templates)) {
                                setTimeout(dothat);
                            } else {
                                Salamander.dx.templates.navigateAndStopClick = function isKnowledgeActivated(event, url) {
                                    if (event.preventDefault) {
                                        event.preventDefault();
                                    }
                                    if (event.stopPropagation) {
                                        event.stopPropagation();
                                    }
                                    if (event.returnValue) {
                                        event.returnValue();
                                    }
                                    if (Salamander.util.DetermineLocation(url)) {
                                        return window.location.href = url;
                                    }

                                    return false;
                                };
                            }
                        };

                        dothat();
                    }

                    if (cInlineForm.enableRelationshipNavigation || cInlineForm.enableKnowledgeActivatedDocumentsNavigation) {
                        Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineForm.generic.setupInlineRelationships);
                    }

                    return;
                }
            }
        }
    }

    setTimeout(function () {
        enableInlineOptions();
    }, 10);
}

enableInlineOptions();


/*
	Title:
		Resize Model Masters
	
	Description:
		script for auto-resizing model based on lowest elements or page marker
*/

window.cPageResizer = window.cPageResizer || new function customPageResizer() {

    this.enablePageResizer = false;

    //store offsets for page end and screen end
    this.lowestOffset = 32;
    this.endOfPageOffset = 32;

    this.resizePage = function resizePage() {
        //find the lowest object or marker if placed
        //higher = lower due to Y starting from top of the page
        var lowest = cPageResizer.findLowestPoint();

        //This is just an extra 32px on the
        //bottom of the screen so it doesn't feel too close
        lowest += cPageResizer.lowestOffset;

        //this next part sets the two html parents of the page to hide the overflow(bit after max height)
        //and to set the height of the entire page 
        $("#ctl00_ContentPlaceHolder1_Container").addClass("modelMasterResizer");
        $("#ctl00_ContentPlaceHolder1_InteractiveModel1").addClass("modelMasterResizer");
        $("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]").addClass("modelMasterResizer");

        $("#ctl00_ContentPlaceHolder1_Container").css("overflow", "hidden").css("height", lowest + cPageResizer.endOfPageOffset + "px");
        $("#ctl00_ContentPlaceHolder1_InteractiveModel1").css("overflow", "hidden").css("height", lowest + "px");
        $("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]").css("top", (lowest - 8) + "px");

        //force browser to be within page view
        if (window.scrollY > lowest) {
            window.moveTo(window.scrollX, lowest);
        }
    }

    //find the lowest position on the page
    this.findLowestPoint = function findLowestPoint() {
        //check if a marker exists on the page
        var marker = $(".mood-node-name-page-marker");

        marker.sort(function (a, b) {
            var _heightA = cMaths.Bounds.fromObject(a, document);
            var _heightB = cMaths.Bounds.fromObject(b, document);
            return _heightA.y2 < _heightB.y2;
        })

        //if marker exists go to manual resizing
        if (marker.length > 0) {
            return cMaths.Bounds.fromObject(marker[0], document).y2;
        }

        //else calculate the lowest point
        return cPageResizer.findLowestHTMLObject();
    }

    //calculate the lowest positioned object in HTML
    this.findLowestHTMLObject = function findLowestHTMLObject() {
        var _lowest = 0;

        var _objToIgnore = [$("img[usemap='#ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0],
            $("map[name='ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0],
            $("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]")[0]
        ]

        //loop through all the main element html in page (the containers for each element)
        $("[id=ctl00_ContentPlaceHolder1_InteractiveModel1]").children().each(function () {

            if ($.inArray(this, _objToIgnore) != -1) {
                return;
            }

            if ($(this).is("div")) {
                var _currentBounds = cMaths.Bounds.fromObject(this, document);
                var _currentHeight = _currentBounds.y2;

                //check if the currentHeight is a valid value
                if (_currentHeight) {
                    //check currentHeight is greater than the
                    //lowest point(top to bottom so technically lower)
                    if (_currentHeight > _lowest) {
                        //set new lowest to be currentHeight
                        _lowest = _currentHeight;
                    }
                }
            }
        });

        return _lowest;
    }

    function initiatePageResizer() {
        //check if Salamander/MooD has been setup
        if (Salamander.lang.isSysDefined()) {
            if (Sys.WebForms) {
                if (Sys.WebForms.PageRequestManager) {
                    if (Sys.WebForms.PageRequestManager.getInstance()) {
                        //add resizePage to run on page load
                        Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cPageResizer.resizePage);
                        return;
                    }
                }
            }
        }

        //if Salamander/MooD hasn't been setup then retry in 10ms
        setTimeout(function () {
            return initiatePageResizer();
        }, 10);
    }

    if (this.enablePageResizer) {
        setTimeout(function () {
            return initiatePageResizer();
        }, 10);
    }
}();

