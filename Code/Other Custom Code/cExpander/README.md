# <a id="title"/> cExpander.js
### <a id="description"/> This code handles resizing DOM object's height to remove the need for vertical scrollbar
#

#### <a id="codeprefix"/> Code Prefix:
    cExpander.  

* <a id="properties"/> <h2> Properties: </h2>

  * <a id="allexpansiondata"/> allExpansionData <p style="padding-left: 20px;"> Array of all DOM objects that have been expanded along with relavent data. </p> <br>

  * <a id="allcalculatedobjects"/> allCalculatedObjects <p style="padding-left: 20px;"> Array of all DOM objects that have modified by cExpander at some point. </p> <br>

  * <a id="uniqueid"/> uniqueID <p style="padding-left: 20px;"> A unique integer that is used by [expansion data](#expansiondata) to enable searchability. </p> <br>

  * <a id="uniquecalculatedid"/> uniqueCalculatedID <p style="padding-left: 20px;"> A unique integer that is used by [calculated data](#calculateddata) to enable searchability. </p> <br>

* <a id="datatypes"/> <h2> Data Types: </h2>

	* ".dataTypes" contains original functions for below.
  <br>

	* Protoypes of below start with capital instead of lowercase.
  <br>

	* ".expansionData" is an is a reference to [expansion data](./Markdowns/expansionData.md).
  <br>

	* ".calculatedObjectData" is a reference to [calculated object data](./Markdowns/calculatedObjectData.md).

* <a id="functions"/> <h2> Functions: </h2>

  * [".expansion"](./Markdowns/expansion.md) is a collection of basic functions for cExpander.
  <br>

  * [".search"](./Markdowns/search.md) is a collection of functions for finding data within allExpansionData and allCalculatedObjects.

#### References: 
  
[Return to parent](/README.md)