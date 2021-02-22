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
	var _elementData = {
		name : "",
		extra : "",
		type : "",
		id : 0
	};

	var _buttonData = {
		name : "",
		id : 0,
		elementsToEnable : [],
		elementsToDisable : [],
		enabledOnDefault : false,
		canDisableSelf : false,
		onClick :  null
	};

	//create elements/buttons and then modify data
	//elementID and buttonID auto increments so 
    //no need to modify id after initial setup,
    // just order creation correctly
		
	//create elements
	_elementData.name = "Button2";
	_elementData.type = "mood-button";
	_elementData.id = 1;
	cElement.setup.createElement(_elementData);

	_elementData.name = "Button3";
	_elementData.type = "mood-button";
	_elementData.id = 2;
	cElement.setup.createElement(_elementData);

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
	
}