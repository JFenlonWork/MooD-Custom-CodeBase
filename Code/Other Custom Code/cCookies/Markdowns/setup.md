<a id="cookies"/> <h2> setup </h1> 
  <p style="padding-left: 20px;"> Stores all "setup" functions for [cCookies](../README.md). </p>

#### <a id="codeprefix"/> Code Prefix:
    cCookies.setup

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="addcookielistener"/> [addCookieListner](#addcookielistnerexample) <p style="padding-left: 20px;"> Add callback listener to [cookie data](cookieData.md#listeners). </p>

    * <a id="removecookielistener"/> [removeCookieListner](#removecookielistnerexample) <p style="padding-left: 20px;"> Remove callback listener to [cookie data](cookieData.md#listeners). </p>

* <a id="examples"/> <h2> Examples: </h2>
  
  * <a id="addcookielistener"/> addCookieListner:
    ```Javascript
      var _callbackFunc = function callBack(_value) {
          //Do stuff from cookie
      };

      //Listen to any change on example cookie and invoke _callbackFunc
      var _callbackData = new cCookies.cookieCallback("Example callback", this, "Example cookie", _callbackFunc, null);

      cCookies.setup.addCookieListner(_callbackData);
    ``` 
    <hr>

  * <a id="removecookielistener"/> removeCookieListener:
    ```Javascript
      //Listen to any change on example cookie
      var _callbackData = new cCookies.cookieCallback("Example callback", this, "Example cookie", null, null);

      //remove _callbackData from cCookies
      cCookies.setup.removeCookieListener(_callbackData);
    ```

    <hr>

#### References:
 * <a id="timerlist"/> [cookieCallback](cookieCallback.md)
  
[Return to parent](../README.md)