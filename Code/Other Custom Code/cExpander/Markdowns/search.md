# <a id="title"/> cExpanderSearchFunctions
### <a id="description"/> Holds functions related to searching through [expansionData](#INSERT_LINK) and [calculatedObjectData](#INSERT_LINK).
#

#### <a id="codeprefix"/> Code Prefix:
    cExpander.search.

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="returnexpansiondatafromobject"/> [returnExpansionDataFromObject](#returnexpansiondatafromobjectexample) <p style="padding-left: 20px;"> Find/Create expansion data from a DOM and returns the result. </p>

	<br>

    * <a id="returnexpansiondatafromid"/> [returnExpansionDataFromID](#returnexpansiondatafromidexample) <p style="padding-left: 20px;"> Find/Create expansion data from an ID and returns the result. </p>

	<br>

    * <a id="returncalculatedobjectdatafromobject"/> [returnCalculatedObjectDataFromObject](#returncalculatedobjectdatafromobjectexample) <p style="padding-left: 20px;"> Find/Create calculated object data from a DOM and returns the result. </p>

	<br>

    * <a id="returncalculatedobjectdatafromid"/> [returnCalculatedObjectDataFromID](#returncalculatedobjectdatafromidexample) <p style="padding-left: 20px;"> Find/Create calculated object data from an ID and returns the result. </p>


* <a id="examples"/> <h2> Examples: </h2>

 * <a id="returnexpansiondatafromobjectexample"/>
	returnExpansionDataFromObject
	
	reference: [_expansionCreationData](#INSERT_LINK)
	```Javascript
	var _DOM = document.getElementById("Example");

	// _expansionCreationData can be null if you don't
	// want to create an expansionData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_DOM, _expansionCreationData);
	```
	<hr>

 * <a id="returnexpansiondatafromidexample"/>
	returnExpansionDataFromID
	
	reference: [_expansionCreationData](#INSERT_LINK)
	```Javascript
	var _ID = 1;

	// _expansionCreationData can be null if you don't
	// want to create an expansionData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_ID, _expansionCreationData);
	```
	<hr>

 * <a id="returncalculatedobjectdatafromobjectexample"/>
	returnCalculatedObjectDataFromObject
	
	reference: [_createOnFailID](#INSERT_LINK)
	```Javascript
	var _DOM = document.getElementById("Example");

	// _createOnFailID can be null if you don't
	// want to create an calculatedObjectData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_DOM, _createOnFailID);
	```
	<hr>

 * <a id="returncalculatedobjectdatafromidexample"/>
	returnCalculatedObjectDataFromObject
	
	reference: [_createOnFailObject](#INSERT_LINK)
	```Javascript
	var _ID = 1;

	// _createOnFailObject can be null if you don't
	// want to create an calculatedObjectData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_ID, _createOnFailObject);
	```
	

#### References: 
  
[Return to parent](/README.md)