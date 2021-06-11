function initiateTab() {
	
	if (typeof cEventListener != "undefined" && 
		typeof cElement != "undefined" && 
		typeof cButton != "undefined")
	{
		cEventListener.generic.addFunctionToWaitingForMessage("afterEventListenerCreation",{ setupFunction: function () { setupTab(); } });
	}
	else
	{
		setTimeout(function() { initiateTab(); }, 10);
	}
	
}

initiateTab();

function setupTab()
{

	//store element and button data
	/*
		var _elementData = {
			id : (int), The unique ID to represent this data to be used in searching
			isMoodObject : (boolean), Controls if elementParentObject defaults to elementObject or "WebPanelOverlay"
			elementObject : (HTML object or JQuery result), The HTML object for the object you are searching for
			elementParentObject : (HTML object or Jquery result), The HTML object that element controls use
			enabledOnDefault : (boolean), Controls if the element is enabled/disabled at the start (Need to setup css)
		};
		
		cElement.setup.createElement(_elementData);
	*/

	/*
	var _buttonData = {
		id : (int), The unique ID to represent this data to be used in searching
		elementsToEnable : (object array), Stores details about elements to enable (see below for data)
		elementsToDisable : (object array), Stores details about elements to disable (see below for data)
		enabledOnDefault : (boolean), Controls if the button should be enabled/disabled on start
		canDisableSelf : (boolean), Controls if the button can disable it's enabled elements
		onClick :  (string), Controls the HTML onClick
	};


		Button Element Data

		opacity (int), Controls the css stylesheet opacity for this element
		opacityTime (float), Controls how long it takes for opacity to change
		opacityTiming (float), -----------------------------------------------
		opacityDelay (float), Controls the css transition delay for opacity

		zIndex (int), Determines the zIndex of the element for this activation
		zIndexImportance (boolean), Controls if the zIndex stylesheet should be !imporant

		posX (int), Controls the "left" position of this element on activation
		generatePosX(), If posX is empty then this can be used to generate a posX with a function

		posY (int), Controls the "left" position of this element on activation
		generatePosY(), If posX is empty then this can be used to generate a posX with a function

		positionMoveTime (float), Controls how long it takes for position to change
		positionTiming (float), -----------------------------------------------
		positionDelay (float), Controls the css transition delay for opacity

	*/

	/*

		Example

		//create elements/buttons and then modify data
		//elementID and buttonID auto increments so 
		//no need to modify id after initial setup,
		//just order creation correctly
			
		//create elements
		/*
		_elementData.name = "Button2";
		_elementData.type = "mood-button";
		_elementData.id = 1;

		_buttonData = {
			name : "Button1",
			id : 10,
			elementsToEnable : [{id: 1, posX: 100, posY: 100, opacityTime: 2000, panel: function(obj) {return $(obj).closest('.WebPanelOverlay')}}],
			elementsToDisable : [{id: 2, posX: 100, posY: 100, opacityTime: 2000}],
			enabledOnDefault : true,
			canDisableSelf : true,
			onClick :  null
		};

		cButton.setup.createButton(_buttonData);
	*/
	
}