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
        this.evaluateMessage =  function evaluateMessage(_messageFunction, _messageExtras, _comparison)
        {
            //check if _messageFunction exists otherwise set it to null
            _messageFunction = _messageFunction || 'null';
            _messageExtras = _messageExtras || "";
            _comparison = _comparison || false;
    
            //check if the message is a custom object
            if (this.message === Object(this.message))
            {
                //check that the custom message function exists
                if (typeof this.message[_messageFunction] === "function")
                {
                    //check if evaluate message is being used for comparison
                    if (_comparison)
                    {
                        //return the function itself
                        return this.message[_messageFunction];
                    }
                    else 
                    {
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
        
        //setup interval for registering any listeners in the queue,
        //run based on a slowdown timer
        (function setupScaledTimer() {
            //check if timer exists
            if (cTimer)
            {
                //setup scaled timer
                cEventListener.listenerRegistrationQueueTimer 
                = new cTimer.scaledTimer( new cTimer.callback(
                                            function() {return cEventListener.queue.registerListenersInQueue()} ), true, 
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
        //store any messages that have been invoked
        var _messagesInvoked = [];

        //loop through all functions within the current message queue
        for (var l = 0; l < cEventListener.functionWaitingForMessageQueue.length; l++)
        {
            //check if message type is the same as _functionType
            if (cEventListener.functionWaitingForMessageQueue[l].type == _functionType)
            {
                //invoke the "setupFunction" of that message
                cEventListener.functionWaitingForMessageQueue[l].evaluateMessage("setupFunction");

                //add this individual to be removed
                _messagesInvoked.push(
                    new cEventListener.basicMessage(_functionType,
                        cEventListener.functionWaitingForMessageQueue[l].evaluateMessage(
                            "setupFunction", null, true)
                    )
                );
            }
        }

        //loop through all messages that have been invoked and remove them
        for (var m = 0; m < _messagesInvoked.length; m++)
        {
            cEventListener.queue.removeFromMessageQueue(_messagesInvoked[m]);
        }
    }

    this.removeFromMessageQueue = function removeFromMessageQueue(_message)
    {
        //loop through all functions within the current message queue
        for (var l = 0; l < cEventListener.functionWaitingForMessageQueue.length; l++)
        {
            //check if message type is the same as _functionType
            if (cEventListener.functionWaitingForMessageQueue[l].type == _message.type &&
                cEventListener.functionWaitingForMessageQueue[l].evaluateMessage("setupFunction", null, true) == _message.message)
            {
                //remove the message as removing it within the
                //loop can cause array mismatches
                cEventListener.functionWaitingForMessageQueue.splice(l,1);
                return;
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