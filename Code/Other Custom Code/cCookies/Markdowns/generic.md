<a id="cookies"/> <h2> generic </h1> 
  <p style="padding-left: 20px;"> Stores all "generic" functions for [cCookies](../README.md). </p>

#### <a id="codeprefix"/> Code Prefix:
    cCookies.generic

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="getcookie"/> [getCookie(_cookie, _checkNow)](#getcookieexample) <p style="padding-left: 20px;"> Return cookie data for _cookie and if _checkNow is true then return document.cookies version. </p>

    * <a id="addcookie"/> [addCookie(_cookie, _value)](#cookieexample) <p style="padding-left: 20px;"> Add _cookie to document.cookies with _value. </p>

    * <a id="changecookie"/> [changeCookie(_cookie, _value)](#cookieexample) <p style="padding-left: 20px;"> Alternative for addCookie as modifiying cookies is the same as adding. </p>

    * <a id="removecookie"/> [removeCookie(_cookie)](#cookieexample) <p style="padding-left: 20px;"> Remove _cookie by calling add as removing is just setting the cookie value to nothing. </p>

* <a id="examples"/> <h2> Examples: </h2>

  * <a id="getcookieexample"/> getCookie:
    ```Javascript
      cCookies.generic.addCookie("Cookie_Example", "I_Exist");

      if (cCookies.generic.getCookie("Cookie_Example", false) == "I_Exist") {
        //Do cool stuff here
      }
    ``` 
  
  * <a id="cookieexample"/> add/change/remove Cookie:
    ```Javascript
      cCookies.generic.addCookie("Cookie_Example", "I_Exist");

      cCookies.generic.changeCookie("Cookie_Example", "I_Still_Exist");

      cCookies.generic.removeCookie("Cookie_Example");
    ``` 
    <hr>

#### References:
  
[Return to parent](../README.md)