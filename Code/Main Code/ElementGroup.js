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