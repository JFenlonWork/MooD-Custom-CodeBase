# cPageResizer.js
### This code allows a webpage's height to be changed dynamically to match object positions on the page.
#

#### <a id="codeprefix"/> Code Prefix:
    cPageResizer.  

* <a id="properties"/> <h2> Properties: </h2>

* <a id="lowestoffset"/> lowestOffset <p style="padding-left: 20px;"> An extra padding added onto the bottom of the lowest point found. </p>

* <a id="endofpageoffset"/> endOfPageOffset <p style="padding-left: 20px;"> An extra padding added onto the bottom of the lowest point, respecting [lowestOffset](#lowestoffset). </p>

* <a id="functions"/> <h2> Functions: </h2>

* <a id="resizepage"/> resizePage <p style="padding-left: 20px;"> Calculates lowest point from [findLowestPoint](#findlowestpoint) and changes page css/styles. </p>

* <a id="findlowestpoint"/> findLowestPoint <p style="padding-left: 20px;"> Determines if lowest point should be grabbed from a marker on the page or if it should be calculated using [findLowestHTMLObject](#findlowesthtmlobject). </p>

* <a id="findlowesthtmlobject"/> findLowestHTMLObject <p style="padding-left: 20px;"> Searches through all HTML Elements and finds the lowest position on the page. </p>

#### References: 
  
[Return to parent](/README.md)