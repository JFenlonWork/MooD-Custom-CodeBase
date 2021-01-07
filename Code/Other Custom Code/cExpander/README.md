# <a name="title"/> cExpander.js
### <a name="description"/> This code handles resizing DOM object's height to remove the need for vertical scrollbar
#

#### <a name="codeprefix"/> Code Prefix:
    cExpander.  

* <a name="properties"/> <h2> Properties: </h2>

  * <a name="allexpansiondata"/> allExpansionData <p style="padding-left: 20px;"> Array of all DOM objects that have been expanded along with relavent data. </p>

  * <a name="allcalculatedobjects"/> allCalculatedObjects <p style="padding-left: 20px;"> Array of all DOM objects that have modified by cExpander at some point. </p>

  * <a name="uniqueid"/> uniqueID <p style="padding-left: 20px;"> A unique integer that is used by [expansion data](#expansiondata) to enable searchability. </p>

  * <a name="uniquecalculatedid"/> uniqueCalculatedID <p style="padding-left: 20px;"> A unique integer that is used by [calculated data](#calculateddata) to enable searchability. </p>

* <a name="datatypes"/> <h2> Data Types: </h2>

	* ".dataTypes" contains original functions for below.
	* Protoypes of below start with capital instead of lowercase.
	* ".expansionData" is an instance of [expansion data]()

* <a name="functions"/> <h2> Functions: </h2>

  * [expansion](./Markdowns/expansion.md)
  * [search](./Markdowns/search.md)

#### References: 
  
[Return to parent](/README.md)