/*
	Title:
		Inline Form Code
	
	Description:
		Modify Inline Forms To Make Relatinships Navigable
		Modify Inline Forms To Make Relatinships Size Correct
*/

window.cInlineForm = window.cInlineForm || new function customInlineForm()
{

    this.enableRelationshipNavigation = false;
    this.enableKnowledgeActivatedDocumentsNavigation = false;
    this.enableInlineFormWidthChanges = false;

    this.enableHideEmptyInlineForms = false;
    this.emptyInlineSearchTerm = "div.fieldControlContainer";

    this.fieldAndDescriptionSameLine = true;
    this.fieldOuterWidth = "75em";
    this.fieldInnerWidth = "95%";

    this.generic = new cInlineFormFunctions();
}

function cInlineFormFunctions() {
    this.hideEmptyHTMLFields = function hideEmptyHTMLFields()
    {
        $(window.cInlineForm.emptyInlineSearchTerm).each(function(index, element)
        {
            var editorElement = $(element);

            if (editorElement.outerHeight() === 0) {

                var parent = editorElement.closest("div.fieldContainer");
                parent.css('display', 'none');

                var separator = parent.prev(".separator")
                if (separator)
                {
                    $(separator).css('display','none');
                }
            }
        });
    }

    //applies any width changes and titles css changes to inline forms
    this.modifyInlineFields = function modifyInlineFields ()
    {
        $(".mood-inlineformelementeditor").each(function () {

            var currentInlineForm = this;

            //wait until the inline form has been populated
            (function checkSize()
            {
                var totalSize = 0;

                $(currentInlineForm).find(".editorContainer").each(function() {

                    totalSize += $(this).outerHeight();

                });

                if (totalSize == 0)
                {
                    setTimeout(checkSize, 100);
                }
            });

            $(this).find(".fieldLabel").each(function () {
                this.classList.add("inlineFormTitleModified");
            });

            $(this).find(".fieldDescription").each(function () {
                this.classList.add("inlineFormDescriptionModified");
            });

            $(this).find(".fieldControlContainer").each(function() {
                $(this).removeClass("widthSingle").css("width", cInlineForm.fieldInnerWidth);
                if (cInlineForm.fieldAndDescriptionSameLine) {
                    $(this).siblings(".fieldInformation").removeClass("widthSingle").css("width", "auto").css("max-width", "45%");
                } else {
                    $(this).siblings(".fieldInformation").removeClass("widthSingle").css("width", "auto").css("max-width", "100%");
                }
                $(this).closest(".fieldContainer").removeClass("widthSingle").css("width", cInlineForm.fieldOuterWidth).css("padding-right", "0%");
            });

            $(this).find(".editorContainer").each(function() {
                $(this).css("padding-right", "0%");
            });

            $(this).find(".HtmlEditorReadOnly").each(function() {
                $(this).children("div").css("overflow-y", "hidden");
            });

            if (cInlineForm.fieldAndDescriptionSameLine) {
                $(this).find(".fieldLabel").each(function() {
                    var _this = $(this).parent(".fieldInformation").length > 0 ? $(this).parent(".fieldInformation") : this;
                    $(_this).css("display", "inline-block").css("max-width", "45%").css("width", "auto").css("margin-bottom", "0%");
                });

                $(this).find(".fieldDescription").each(function() {
                    $(this).css("display", "inline-block").css("max-width", "45%").css("width", "auto").css("margin-left", "5%");
                });
            }

        });

    }

    //remove check boxes and excess relationships visuals
    this.setupInlineRelationships = function setupInlineRelationships() {
    
        //search for all relationship tick/radio lists
        $(".RelationshipTickListFieldControl, .RelationshipRadioListFieldControl").each(function () {
    
            //force opacity to be full on disabled relationship links
            $(this).find(".dx-state-disable.dx-list.dx-widget").each(function () {
                this.style.opacity = 1;
            });
    
            //remove all of the "none" options
            $(this).find(".list-item-text[title='None']").closest(".dx-list-item").each(function () {
    
                this.remove();
    
            });
    
            //remove all of the checkboxes
            $(this).find(".dx-list-item-before-bag").each(function () {
    
                this.remove();
    
            });
    
            //set all of the remaining items width to "auto"
            //and make cursor change to pointer when selecting
            //and add css class to text
            $(this).find(".dx-list-item").each(function () {
    
                this.style.width = "auto";
    
                $(this).find(".list-item-text").each(function () {
                    $(this).addClass("inlineFormRelationshipTextModified");
                });
    
            });
    
        });
        
    }
}

function enableInlineOptions()
{
    if (Salamander.lang.isSysDefined())
        {		
            if (Sys.WebForms)
            {
                if (Sys.WebForms.PageRequestManager)
                {
                    if (Sys.WebForms.PageRequestManager.getInstance())
                    {
                        if (cInlineForm.enableHideEmptyInlineForms)
                        {
                            Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineForm.generic.hideEmptyHTMLFields);
                        }

                        if (cInlineForm.enableInlineFormWidthChanges)
                        {
                            Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineForm.generic.modifyInlineFields);
                        }

                        if (cInlineForm.enableRelationshipNavigation)
                        {
                            var doit = function notready() { window.alert("Ooops"); };

                            doit = function ready() {
                                if (Salamander.lang.isNullOrUndefined(Salamander.widget.List)) {
                                    setTimeout(doit);
                                } else {

                                    Salamander.widget.List.prototype.alternativeTemplate = function alternativeTemplate(data) {
                                        if (data.Value && data.Value.length) {
                                            var parts = data.Value.split('-');
                                            var elementType = parts[0];
                                            var elementId = parts[1];
                                            return Salamander.dx.templates.listItemTemplate(data.Text, data.IconUrl, "Controller.aspx?elementId=" + elementId + "&elementType=" + elementType);
                                        } else {
                                            return null;
                                        }
                                    };

                                    var ensureConfiguration = Salamander.widget.List.prototype.ensureConfiguration;

                                    Salamander.widget.List.prototype.ensureConfiguration = function ensureconfiguration(config) {
                                        var result = ensureConfiguration.call(this, config);
                                        result.itemTemplate = this.alternativeTemplate;
                                        result.enabled = false;
                                        return result;
                                    };

                                }


                            };

                            doit();

                        }

                        if (cInlineForm.enableKnowledgeActivatedDocumentsNavigation)
                        {
                            var dothat = function notready() { window.alert("Not ready"); };

                            dothat = function ready()
                            {
                                if (Salamander.lang.isNullOrUndefined(Salamander.dx) || Salamander.lang.isNullOrUndefined(Salamander.dx.templates))
                                {
                                    setTimeout(dothat);
                                } else {
                                    Salamander.dx.templates.navigateAndStopClick = function isKnowledgeActivated(event, url) {
                                        if (event.preventDefault)
                                        {
                                            event.preventDefault();
                                        }
                                        if (event.stopPropagation)
                                        {
                                            event.stopPropagation();
                                        }
                                        if (event.returnValue)
                                        {
                                            event.returnValue();
                                        }
                                        if (Salamander.util.DetermineLocation(url))
                                        {
                                            return window.location.href = url;
                                        }

                                        return false;
                                    };
                                }
                            };

                            dothat();
                        }

                        if (cInlineForm.enableRelationshipNavigation || cInlineForm.enableKnowledgeActivatedDocumentsNavigation)
                        {
                            Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineForm.generic.setupInlineRelationships);                            
                        }
    
                        return;
                    }
                }
            }
        }
                       
        setTimeout(function() { enableInlineOptions(); }, 10);
}

enableInlineOptions();
