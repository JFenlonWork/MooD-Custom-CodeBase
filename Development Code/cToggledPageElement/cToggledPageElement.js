/*
    Title:
        TogglePageElement

    Description:
        Used to allow page elements to be
        enable/disabled on startup based on
        field/relationships stored on MooD element
*/

window.cTogglePageElement = window.cTogglePageElement || new function cTogglePageElement()
{
    //===LOCAL VARIABLES===//
    this.toggleElementList = [];

	//====DATA TYPES====//
    this.dataTypes = new cTogglePageElementDataTypes();
    
    this.ToggledElementData = this.dataTypes.toggledElementData.prototype;
    this.toggledElementData = this.dataTypes.toggledElementData;
    
    this.ToggledElementDataGroup = this.dataTypes.toggledElementDataGroup.prototype;
    this.toggledElementDataGroup = this.dataTypes.toggledElementDataGroup;
    
    //holds basic message information that is used by the event listener
	
    //====FUNCTIONS====//
    this.generic = new cTogglePageElementGeneric();
    this.search = new cTogglePageElementSearch();
	
    //===RUN-TIME FUNCTIONS===//
}

function cTogglePageElementDataTypes()
{

    this.toggledElementData = function toggledElementData(parentToggleGroup, elementName, value, requirementFunctionString)
    {
        this.parentToggleGroup = parentToggleGroup;
        this.elementName = elementName;
        this.value = value;

        this.setupRequirementsFunction = function setupRequirementsFunction(requirementFunctionString)
        {
            this.requirementFunctionString = requirementFunctionString || null;
            this.requirementFunction = requirementFunctionString == null ? function() { return true; } : window[requirementFunctionString];
            this.requirement = this.requirementFunction == null ? false : true;
        }

        this.setupRequirementsFunction(requirementFunctionString);

        this.updateElementValue = function updateElementValue(value)
        {
            if (value != this.value) {
                if (this.requirementFunction != null) {
                    if (this.requirementFunction()) {
                        this.value = value;
                        this.parentToggleGroup.updateTextBoxValue();
                        return true;
                    }
                }
            }

            return false;
        }
    }

    this.toggledElementDataGroup = function toggledElementDataGroup(name, searchBoxToSearch, updateButton)
    {
        var _elementGroup = this;
        this.name = name;
        this.searchBoxToSearch = searchBoxToSearch;
        this.generatedData = false;
        this.updateButton = updateButton;
        this.toggledElementDataList = [];

        this.generateData = function generateData()
        {
            if ($(_elementGroup.searchBoxToSearch).find("textArea").length != 0)
            {
                var stringData = $(_elementGroup.searchBoxToSearch).find("textArea")[0].value.split(",");

                stringData.forEach(function(str) {
                    var strValues = str.split(":");
                    if (strValues.length != 3) { return; }
                    for (var i = 0; i < _elementGroup.toggledElementDataList.length; i++)
                    {
                        if (_elementGroup.toggledElementDataList[i].elementName == strValues[0])
                        { 
                            _elementGroup.toggledElementDataList[i].value = strValues[1];
                            _elementGroup.toggledElementDataList[i].setupRequirementsFunction(strValues[2]);
                            return;
                        }
                    }
                    _elementGroup.toggledElementDataList.push(new cTogglePageElement.toggledElementData(_elementGroup, strValues[0], strValues[1], strValues[2]));
                });

                _elementGroup.generatedData = true;
                return true;
            }

            return setTimeout(function() { return _elementGroup.generateData(); }, 100);
        }

        this.generateData();

        this.generateElementString = function generateElementString()
        {
            var ret = "";

            this.toggledElementDataList.forEach(function(element) {
                ret += element.elementName + ":" + element.value + ":" + element.requirementFunctionString + ",";
            });

            return ret.substring(0, ret.length - 1);
        }

        this.searchForElementData = function searchForElementData(elementName)
        {
            var ret = null;

            this.toggledElementDataList.forEach(function(element) {
                if (element.elementName == elementName) { ret = element; return; }
            });

            return ret;
        }

        this.addElementData = function addElementData(elementName, value, requirementFunction)
        {
            var element = this.searchForElementData(elementName);

            if (element == null)
            {    
                element = new cTogglePageElement.toggledElementData(this, elementName, value, requirementFunction)
                this.toggledElementDataList.push(element);
            }

            return element;
        }

        this.updateElementValue = function updateElementValue(elementName, value, requirementFunction)
        {
            var element = this.searchForElementData(elementName);

            if (element == null)
            {    
                return false;
            }
            else if (requirementFunction != null)
            {
                element.setupRequirementsFunction(requirementFunction);
            }

            element.updateElementValue(value);
        }

        this.updateTextBoxValue = function updateTextBoxValue()
        {
            if ($(this.searchBoxToSearch).length != 0)
            {
                var updateStr = this.generateElementString();
                $(this.searchBoxToSearch).find("textArea")[0].value = updateStr;
                $(updateButton).find(".dx-button-content").click();
            }
            else
            {
                setTimeout(function() { return _elementGroup.updateTextBoxValue(); }, 100);
            }
        }
    }

}

function cTogglePageElementGeneric()
{
    this.addToggleElementGroup = function addToggleElementGroup(groupName, searchBoxToSearch, updateButton)
    {
        var elementGroup = cTogglePageElement.search.findToggledElementDataGroupFromName(groupName);
        if (elementGroup == null)
        {
            elementGroup = new cTogglePageElement.toggledElementDataGroup(groupName, searchBoxToSearch, updateButton);
            cTogglePageElement.toggleElementList.push(elementGroup);
        }
        return elementGroup;
    }

    this.addToggleElementDataToGroupFromName = function addToggleElementDataToGroup(elementGroupName, elementName, value, requirementFunction)
    {
        var toggledElementGroup = cTogglePageElement.search.findToggledElementDataGroupFromName(elementGroupName);
        
        if (toggledElementGroup != null)
        {
            return toggledElementGroup.addElementData(elementName, value, requirementFunction);
        }

        console.log("Could not find toggledElementGroup: " + elementGroupName);
        return null;
    }

    this.addToggleElementDataToGroup = function addToggleElementDataToGroup(elementGroup, elementName, value, requirementFunction)
    {
        if (elementGroup != null)
        {
            return elementGroup.addElementData(elementName, value, requirementFunction);
        }

        console.log("Can not add elementData to NULL group");
        return null;
    }

    this.toggleToggledElement = function toggleToggledElement(elementID, elementGroupName, elementName, toggle, requirementFunction, ignoreRequirementFunction)
    {
        var toggledElementGroup = cTogglePageElement.search.findToggledElementDataGroupFromName(elementGroupName);
        var toggledElement = toggledElementGroup.searchForElementData(elementName);
    
        if (toggledElement != null) {
            if (ignoreRequirementFunction ||
                (toggledElement.requirementFunction != null && toggledElement.requirementFunction())) {
                cElement.modify.toggleElement(elementID, { message: toggle }, null);
            }
        } else {
            toggledElementGroup.updateElementValue(elementName, toggle, requirementFunction);
        }
    }

    this.toggleToggledElementBasedOnValue = function toggleToggledElementBasedOnValue(elementID, elementGroupName, elementName, requirementFunction, ignoreRequirementFunction)
    {
        var toggledElementGroup = cTogglePageElement.search.findToggledElementDataGroupFromName(elementGroupName);
        var toggledElement = toggledElementGroup.searchForElementData(elementName);

        if (toggledElement != null) {
            if (ignoreRequirementFunction ||
                (toggledElement.requirementFunction != null && toggledElement.requirementFunction())) {
                cElement.modify.toggleElement(elementID, toggledElement.value, null);
            }
        } else {
            toggledElementGroup.updateElementValue(elementName, true, requirementFunction);
        }
    }
}

function cTogglePageElementSearch()
{
    this.findToggledElementDataFromName = function findToggledElementDataFromName(groupName, name)
    {
        var element = cTogglePageElement.search.findToggledElementDataGroupFromName(groupName);
        if (element.searchForElementData == null) { return null; }
        var element = element.searchForElementData(name);
        return element;
    }

    this.returnToggledElementValueBaseOnName = function returnToggledElementValueBaseOnName(groupName, name)
    {
        var element = cTogglePageElement.search.findToggledElementDataGroupFromName(groupName);
        if (element.searchForElementData == null) { return null; }
        var element = element.searchForElementData(name);
        if (element == null) { return null; }
        return element.value;
    }

    this.findToggledElementDataGroupFromName = function findToggledElementDataGroupFromName(name)
    {
        var ret = null;
        cTogglePageElement.toggleElementList.forEach(function(elementData) {
            if (elementData.name == name) { ret = elementData; return; }
        });
        return ret;
    }
}