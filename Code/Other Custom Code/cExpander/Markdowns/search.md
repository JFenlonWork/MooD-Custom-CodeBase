# <a id="title"/> cExpanderSearchFunctions
### <a id="description"/> Holds functions related to searching through [expansionData](#INSERT_LINK) and [calculatedObjectData](#INSERT_LINK).
#

#### <a id="codeprefix"/> Code Prefix:
    cExpander.search.

* <a id="methods"/> <h2> Methods: </h2>

    * <a id="returnexpansiondatafromobject"/> [returnExpansionDataFromObject(_objectToExpand, _expansionCreationData)](#returnexpansiondatafromobjectexample) <p style="padding-left: 20px;"> Find/Create expansion data from a DOM and returns the result. </p>

	<br>

    * <a id="returnexpansiondatafromid"/> [returnExpansionDataFromID(_id, _expansionCreationData)](#returnexpansiondatafromidexample) <p style="padding-left: 20px;"> Find/Create expansion data from an ID and returns the result. </p>

	<br>

    * <a id="returncalculatedobjectdatafromobject"/> [returnCalculatedObjectDataFromObject(_object, _createOnFailID)](#returncalculatedobjectdatafromobjectexample) <p style="padding-left: 20px;"> Find/Create calculated object data from a DOM and returns the result. </p>

	<br>

    * <a id="returncalculatedobjectdatafromid"/> [returnCalculatedObjectDataFromID(_id, _createOnFailObject)](#returncalculatedobjectdatafromidexample) <p style="padding-left: 20px;"> Find/Create calculated object data from an ID and returns the result. </p>


* <a id="examples"/> <h2> Examples: </h2>

  * <a id="returnexpansiondatafromobjectexample"/>
	returnExpansionDataFromObject
	
	```Javascript
	var _DOM = document.getElementById("Example");

	// _expansionCreationData can be null if you don't
	// want to create an expansionData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_DOM, _expansionCreationData);
	```
	reference: [_expansionCreationData](expansion.md#createexpansiondata)
	<hr>

  * <a id="returnexpansiondatafromidexample"/>
	returnExpansionDataFromID
	
	```Javascript
	var _ID = 1;

	// _expansionCreationData can be null if you don't
	// want to create an expansionData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_ID, _expansionCreationData);
	```
	reference: [_expansionCreationData](expansion.md#createexpansiondata)
	
	<hr>

  * <a id="returncalculatedobjectdatafromobjectexample"/>
	returnCalculatedObjectDataFromObject
	
	```Javascript
	var _DOM = document.getElementById("Example");

	// _createOnFailID can be null if you don't
	// want to create an calculatedObjectData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_DOM, _createOnFailID);
	```
	reference: [_createOnFailID](expansion.md#createcalculateddata)
	<hr>

  * <a id="returncalculatedobjectdatafromidexample"/>
	returnCalculatedObjectDataFromObject
	
	```Javascript
	var _ID = 1;

	// _createOnFailObject can be null if you don't
	// want to create an calculatedObjectData if it doesn't exist
	var _expansionData = cExpander.search.returnExpansionDataFromObject(_ID, _createOnFailObject);
	```
	reference: [_createOnFailObject](expansion.md#createcalculateddata)
	

#### References: 
  
[Return to parent](/README.md)