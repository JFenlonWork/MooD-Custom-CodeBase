# <a id="title"/> cInlineForms.js
### <a id="description"/> A combination of functions to improve the visuals of inline forms when displayed on the web
#

#### <a id="codeprefix"/> Code Prefix:
    cInlineForm.  
	
    enableRelationshipNavigation = true;
    enableKnowledgeActivatedDocumentsNavigation = true;
    enableInlineFormWidthChanges = true;
    enableHideEmptyInlineForms = true;
    fieldAndDescriptionSameLine = true;
    fieldOuterWidth = "75em";
    fieldInnerWidth = "95%";


* <a id="properties"/> <h2>  Properties: </h2>

  * <a id="enablerelationshipnavigation"/> enableRelationshipNavigation <p style="padding-left: 20px;"> Enables/Disables the ability to navigate to relationship elements on click. </p>

  * <a id="enableknowledgeactivateddocumentsnavigation"/> enableKnowledgeActivatedDocumentsNavigation <p style="padding-left: 20px;"> Enables/Disables the ability to navigate to knowledge activated elements on click. </p>

  * <a id="enableknowledgeactivateddocumentsnavigation"/> enableKnowledgeActivatedDocumentsNavigation <p style="padding-left: 20px;"> Enables/Disables the ability to navigate to knowledge activated elements on click. </p>

  * <a id="enableinlineformwidthchanges"/> enableInlineFormWidthChanges <p style="padding-left: 20px;"> Enables/Disables the modification of inline form widths to be equal to [inlineFormsWidth](#inlineformswidth). </p>

  * <a id="enablehideemptyinlineforms"/> enableHideEmptyInlineForms <p style="padding-left: 20px;"> Enables/Disables the removal of empty inline form fields. </p>

  * <a id="fieldanddescriptionsameline"/> fieldAndDescriptionSameLine <p style="padding-left: 20px;"> Enables/Disables field title and description being adjacent. </p>

  * <a id="fieldouterwidth"/> fieldOuterWidth <p style="padding-left: 20px;"> Determines the outer width of inline form fields when [enableInlineFormWidthChanges](#enableinlineformwidthchanges) is enabled. </p>

  * <a id="fieldinnerwidth"/> fieldInnerWidth <p style="padding-left: 20px;"> Determines the inner width of inline form fields when [enableInlineFormWidthChanges](#enableinlineformwidthchanges) is enabled. </p>

* <a id="methods"/> <h2> Methods: </h2>

  * <a id="hideemptyhtmlfields"/> hideEmptyHTMLFields <p style="padding-left: 20px;"> Removes any empty read-only inline form fields. </p>

  * <a id="setupinlinerelationships"/> setupInlineRelationships <p style="padding-left: 20px;"> Removes any excess visuals from navigatable relationships. </p>

  * <a id="modifyinlinefields"/> modifyInlineFields <p style="padding-left: 20px;"> Applies width changes to inline form fields and "inlineFormTitleModified" css to the field's title. </p>

* <a id="privatemethods"/> <h2> Private Methods: </h2>

  * <a id="enableinlineoptions"/> enableInlineOptions <p style="padding-left: 20px;"> Runs on instantiation and applies any options from [properties](#properties)</p>

* <a id="examples"/> <h2> Examples: </h2>

#### References: 
  
[Return to parent](/README.md)