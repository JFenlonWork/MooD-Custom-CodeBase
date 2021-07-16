<a id="cookies"/> <h2> cookieData </h1> 
  <p style="padding-left: 20px;"> Struct to hold information for [cCookies](../README.md) cookie data and listeners. </p>

  ```Javascript
  cCookies.cookieData(_cookieName) 
  ```

  * <a id="parameters"/> <h3> Parameters: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="_cookiename"/> _cookieName <p style="padding-left: 20px;"> The name of the cookie that this data represents. </p>

  * <a id="properties"/> <h3> Properties: </h3> <hr style="height:2px;border:none;margin-top: -10px;">

    * <a id="cookiename"/> cookieName <p style="padding-left: 20px;"> The name of the cookie that this data represents. </p>

    * <a id="listeners"/> listeners <p style="padding-left: 20px;"> An array of all [callback](cookieCallback.md) data for listeners of this cookie. </p>


* <a id="methods"/> <h2> Methods: </h2>

    * <a id="addlistener"/> addListener(_listener) <p style="padding-left: 20px;"> Adds _listener to [listeners](#listeners). </p>

    * <a id="removelistener"/> removeListener(_listener) <p style="padding-left: 20px;"> Removes _listener from [listeners](#listeners). </p>

    * <a id="sendupdate"/> sendUpdate(_value) <p style="padding-left: 20px;"> Iterate through listeners and call listener callback based on what it is [listenFor](cookieCallback.md#listenfor). </p>

#### References:
  
[Return to parent](../README.md)