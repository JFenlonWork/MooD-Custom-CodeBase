<a id="cookies"/> <h2> generic </h1> 
  <p style="padding-left: 20px;"> Stores all "generic" functions for cCookies. </p>

#### <a id="codeprefix"/> Code Prefix:
    cCookies.generic

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="getcookie"/> [getCookie(_cookie, _checkNow)](#getcookieexample) <p style="padding-left: 20px;"> Return cookie data for _cookie and if _checkNow is true then return document.cookies version. </p>

    * <a id="addcookie"/> [addCookie(_cookie, _value, _additionalCookieData)](#cookieexample) <p style="padding-left: 20px;"> Add _cookie to document.cookie with _value. See [References](#cookiereference) for mor details. </p>

    * <a id="changecookie"/> [changeCookie(_cookie, _value, _additionalCookieData)](#cookieexample) <p style="padding-left: 20px;"> Alternative for addCookie as modifiying cookies is the same as adding. </p>

    * <a id="removecookie"/> [removeCookie(_cookie)](#cookieexample) <p style="padding-left: 20px;"> Remove _cookie by calling add as removing is just setting the cookie value to nothing. </p>

* <a id="examples"/> <h2> Examples: </h2>

  * <a id="getcookieexample"/> getCookie:
    ```Javascript
      cCookies.generic.addCookie("Cookie_Example", "I_Exist", null);

      if (cCookies.generic.getCookie("Cookie_Example", false) == "I_Exist") {
        //Do cool stuff here
      }
    ``` 
  
  * <a id="cookieexample"/> add/change/remove Cookie:
    ```Javascript
      cCookies.generic.addCookie("Cookie_Example", "I_Exist", "Secure;");

      cCookies.generic.changeCookie("Cookie_Example", "I_Still_Exist", null);

      cCookies.generic.removeCookie("Cookie_Example");
    ``` 
    <hr>

#### References:
 * <a id="cookiereference"/> [document.cookie](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
  
[Return to parent](../README.md)