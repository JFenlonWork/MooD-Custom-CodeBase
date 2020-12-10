/*
	Title:
		Custom Fading functions
	
	Description:
		Attempt at making a fading image slideshow
*/


window.cFader = window.cFader || new function customFader()
{
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
}

function cFaderDataTypes () 
{

    this.faderData = function faderData(_fadingData, _startIndex, _faderID, _startOnCreation)
    {
        if (_fadingData == null) { return null; }

        this.fadingData = [];
        this.id = _faderID || cFader.uniqueFaderID;

        if (this.id == cFader.uniqueFaderID)
        {
            cFader.uniqueFaderID++;
        }

        this.index = _startIndex || 0;
        this.isFading = false;
        var _this = this;
        
        this.updateFadedCallback = function updateFadedCallback()
        {
            var _ret = false;
            var _previousIndex = _this.index;

            _this.fadingData[_this.index].toggleObject(false);

            if (_this.index++ >= _this.fadingData.length - 1)
            {
                _this.index = 0;
                _ret = true;
            }

            _this.fadingData[_this.index].toggleObject(true);
            return _ret;
        }

        this.calculateScaledTimerTime = function calculateScaledTimerTime()
        {
            var _ret = [];
            for (var l = 0; l < this.fadingData.length; l++)
            {
                _ret.push(new cTimer.scaledTime(l, this.fadingData[l].timeActive));
            }
            return _ret;
        }

        this.updateTimerTimes = function updateTimerTimes()
        {
            if (this.faderTimer == null) { return null; }
            this.faderTimer.scaledTime = this.calculateScaledTimerTime();
        }

        this.toggleFading = function toggleFading(_toggle)
        {
            if (_toggle)
            {
                this.isFading = true;
                this.faderTimer.start();
            }
            else
            {
                this.isFading = false;
                this.faderTimer.stop();
            }
        }

        this.addFadingData = function addFadingData(_fadingData)
        {
            if (_fadingData instanceof Array)
            {
                for (var l = 0; l < _fadingData.length; l++)
                {
                    this.addFadingData(_fadingData[l]);
                }
                this.updateTimerTimes();
                return true;
            }
            else if (_fadingData instanceof cFader.fadingData)
            {
                _fadingData.faderDataParent = _this;
                this.fadingData.push(_fadingData);
                this.updateTimerTimes();
                return true;
            }
            
            return false;
        }

        this.findFadingIndexFromObject = function findFadingIndexFromObject(_object)
        {
            for (var l = 0; l < _this.fadingData.length; l++)
            {
                if (_this.fadingData[l].objectToFade == _object)
                {
                    return l;
                }
            }

            return -1;
        }

        this.destroy = function destroy()
        {
            this.faderTimer.destroy();
            var index = cFader.search.findFaderDataIndexFromID(this.id);
            cFader.allFaderData.splice(index, 1);
        }

        this.addFadingData(_fadingData);
        this.faderTimer = new cTimer.scaledTimer(new cTimer.callback(this.updateFadedCallback), false, this.calculateScaledTimerTime(), null, true);

        if (_startOnCreation)
        {
            this.toggleFading(true);
        }

    }

    this.fadingData = function fadingData(_objectToFade, _timeToFade)
    {
        if (_objectToFade == null) { return null; }
        this.objectToFade = _objectToFade;
        this.timeActive = _timeToFade[0]
        this.timeToFadeIn = _timeToFade[1];
        this.timeToFadeOut = _timeToFade[2];
        this.id = cFader.uniqueFadingDataID++;
        this.faderDataParent = null;

        this.toggleObject = function toggleObject(_toggle)
        {
            if (_toggle)
            {
                this.enableObject();
            }
            else
            {
                this.disableObject();
            }
        }

        this.enableObject = function enableObject()
        {
            if (this.faderDataParent == null) { return null; }

            this.modifyTransformOpacity(this.timeToFadeIn);
            this.modifyOpacity(1);
            
            $(this.objectToFade).addClass("Fader" + this.faderDataParent.id + "Transition" + this.id);
        }

        this.disableObject = function disableObject()
        {
            if (this.faderDataParent == null) { return null; }

            this.modifyTransformOpacity(this.timeToFadeOut);
            this.modifyOpacity(0);

            $(this.objectToFade).addClass("Fader" + this.faderDataParent.id + "Transition" + this.id);
        }

        this.disableOnStart = function disableOnStart()
        {
            if (this.faderDataParent == null) { return null; }
            this.modifyOpacity(0);

            $(this.objectToFade).addClass("Fader" + this.faderDataParent.id + "Transition" + this.id);
       }

        this.modifyOpacity = function modifyOpacity(_opacity)
        {
            var _styleData = new cCss.styleSheetModificationData("opacity", null, false, -1, _opacity, -1, false);
            cCss.styleSheet.replaceCssStyle("MainFaderStyles", ".Fader" + this.faderDataParent.id + "Transition" + this.id, _styleData);
        }

        this.modifyTransformOpacity = function modifyTransformOpacity(_time)
        {
            var _styleData = new cCss.styleSheetModificationData("transition", "opacity", true, 2, _time, -1, false);
            cCss.styleSheet.replaceCssStyle("MainFaderStyles", ".Fader" + this.faderDataParent.id + "Transition" + this.id, _styleData);

        }
    }

}



function cFaderGenericFunctions()
{
    this.toggleFaderID = function toggleFader(_id, _toggle)
    {
        var _fader = cFader.search.findFaderDataFromID(_id);

        if (_fader)
        {
            _fader.toggleFader(_toggle);
            return true;
        }

        return false;
    }

    this.toggleFaderObject = function toggleFaderObject(_object, _toggle)
    {
        var _fader = cFader.search.findFaderDataFromObject(_object);
        
        if (_fader)
        {
            _fader.toggleFader(_toggle);
            return true;
        }

        return false;
    }

    this.createFader = function createFader(_fadingData, _startIndex, _faderID, _startOnCreation)
    {
        var _faderData = new cFader.faderData(_fadingData, _startIndex, _faderID, _startOnCreation);
        cFader.allFaderData.push(_faderData);
    }

    this.destroyFaderID = function destroyFaderID(_id)
    {
        var _fader = cFader.search.findFaderDataFromID(_id);

        if (_fader)
        {
            _fader.destroy();
            return true;
        }

        return false;
    }

    this.destroyFaderObject = function destroyFaderObject(_object)
    {
        var _fader = cFader.search.findFaderDataFromObject(_object);
        
        if (_fader)
        {
            _fader.destroy();
            return true;
        }

        return false;
    }
}

function cFaderSearchFunctions() 
{
    this.findFaderDataFromObject = function findFaderDataFromObject(_object)
    {
        var _faderIndex = cFader.search.findFaderDataIndexFromObject(_object);
        if (_faderIndex != -1)
        {
            return cFader.allFaderData[_faderIndex];
        }

        return null;
    }

    this.findFaderDataIndexFromObject = function findFaderDataIndexFromObject(_object)
    {
        for (var l = 0; l < cFader.allFaderData.length; l++)
        {
            if (cFader.allFaderData[l].findFadingIndexFromObject(_object) != -1)
            {
                return l;
            }
        }

        return -1;
    }

    this.findFaderDataFromID = function findFaderDataFromID(_faderID)
    {
        var _faderIndex = cFader.search.findFaderDataIndexFromID(_faderID);
        if (_faderIndex != -1)
        {
            return cFader.allFaderData[_faderIndex];
        }

        return null;
    }
    
    this.findFaderDataIndexFromID = function findFaderDataIndexFromID(_faderID)
    {
        for (var l = 0; l < cFader.allFaderData.length; l++)
        {
            if (cFader.allFaderData[l].id == _faderID)
            {
                return l;
            }
        }

        return -1;
    }
}