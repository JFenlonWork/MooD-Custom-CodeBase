# <a name="title"/> cInlineForms.js
### <a name="description"/> A combination of functions to improve the visuals of inline forms when displayed on the web
#

#### <a name="codeprefix"/> Code Prefix:
    cInlineForm.  
	
    this.enableRelationshipNavigation = true;
    this.enableKnowledgeActivatedDocumentsNavigation = true;
    this.enableInlineFormWidthChanges = true;
    this.enableHideEmptyInlineForms = true;
    this.inlineFormsWidth = "75em";


* <a name="properties"/> <h2>  Properties: </h2>

  * <a name="enablerelationshipnavigation"/> enableRelationshipNavigation <p style="padding-left: 20px;"> Enables/Disables the ability to navigate to relationship elements on click. </p>

  * <a name="enableknowledgeactivateddocumentsnavigation"/> enableKnowledgeActivatedDocumentsNavigation <p style="padding-left: 20px;"> Enables/Disables the ability to navigate to knowledge activated elements on click. </p>

  * <a name="enableknowledgeactivateddocumentsnavigation"/> enableKnowledgeActivatedDocumentsNavigation <p style="padding-left: 20px;"> Enables/Disables the ability to navigate to knowledge activated elements on click. </p>

  * <a name="enableinlineformwidthchanges"/> enableInlineFormWidthChanges <p style="padding-left: 20px;"> Enables/Disables the modification of inline form widths to be equal to [inlineFormsWidth](#inlineformswidth). </p>

  * <a name="enablehideemptyinlineforms"/> enableHideEmptyInlineForms <p style="padding-left: 20px;"> Enables/Disables the removal of empty inline form fields. </p>

  * <a name="inlineformswidth"/> inlineFormsWidth <p style="padding-left: 20px;"> Determines the width of inline form fields when [enableInlineFormWidthChanges](#enableinlineformwidthchanges) is enabled. </p>

* <a name="methods"/> <h2> Methods: </h2>

  * <a name="hideemptyhtmlfields"/> hideEmptyHTMLFields <p style="padding-left: 20px;"> Removes any empty read-only inline form fields. </p>

  * <a name="setupinlinerelationships"/> setupInlineRelationships <p style="padding-left: 20px;"> Removes any excess visuals from navigatable relationships. </p>

  * <a name="modifyinlinefields"/> modifyInlineFields <p style="padding-left: 20px;"> Applies width changes to inline form fields and "inlineFormTitleModified" css to the field's title. </p>

* <a name="privatemethods"/> <h2> Private Methods: </h2>

  * <a name="enableinlineoptions"/> enableInlineOptions <p style="padding-left: 20px;"> Runs on instantiation and applies any options from [properties](#properties)</p>

* <a name="examples"/> <h2> Examples: </h2>

#### References: 
  
[Return to parent](/README.md)