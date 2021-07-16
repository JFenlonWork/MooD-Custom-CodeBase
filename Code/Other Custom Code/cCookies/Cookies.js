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
            _this.updateCookieTimer = new cTimer.timer("Cookie Update Timer", new cTimer.callback(window.cCookies.internal.updateCookies, null, null), 10, true, null, false);
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
            for (var prop in _this.listeners) {
                if (Object.prototype.hasOwnProperty.call(_this.listeners, prop)) {
                    if (prop.listenFor == null || value == prop.listenFor) {
                        cCookies.generic.invokeCallback(prop, value);
                    }
                }
            }
        }
    }
}

function cCookiesSetupFunctions() {

    this.addCookieListner = function addCookieListner(_cookieCallback) {
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
        for (var prop in window.cCookies.lastUpdatedCookies) {
            if (Object.prototype.hasOwnProperty.call(window.cCookies.lastUpdatedCookies, prop)) {
                var exists = window.cCookies.currentUpdateCookies[prop.cookie];

                //check if the cookie has been deleted
                if (exists == null) {
                    cCookies.generic.cookieChanged(prop.cookie, null);
                }
                //otherwise check if the cookie has been changed
                else if (exists.value != prop.value) {
                    cCookies.generic.cookieChanged(prop.cookie, exists.value);
                }
            }
        }

        //loop through all current cookies
        for (var prop in window.cCookies.currentUpdateCookies) {
            if (Object.prototype.hasOwnProperty.call(window.cCookies.currentUpdateCookies, prop)) {
                var exists = window.cCookies.lastUpdatedCookies[prop.cookie];

                //check if the cookie has been added this update
                if (exists == null) {
                    cCookies.generic.cookieChanged(prop.cookie, null);
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
                return _cookieCallback.callback.call(_cookieCallback.caller, value);
            } else {
                //invoke callback with timer as "this"
                return _cookieCallback.callback.call(this, value);
            }
        }

        //return null if no callback
        return null;
    }

    //send update to any cookies that have changed
    this.cookieChanged = function cookieChanged(_cookie, _value) {
        //loop through all cookie data
        for (var prop in window.cCookies.cookieData) {
            if (Object.prototype.hasOwnProperty.call(window.cCookies.cookieData, prop)) {
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

        //check document.cookies if cookie
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
        document.cookies = _cookie + "=" + _value + ";";
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