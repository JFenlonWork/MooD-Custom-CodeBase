/*
	Title:
		Inline Form Code
	
	Description:
		Modify Inline Forms To Make Relatinships Navigable
		Modify Inline Forms To Make Relatinships Size Correct
*/

var _enableRelationshipNavigation = true;
var _enableKnowledgeActivatedDocumentsNavigation = true;
var _enableInlineFormWidthChanges = true;
var _enableHideEmptyInlineForms = true;

window.cInlineFormCode = window.cInlineFormCode || new function customInlineForm()
{
    var _width = "75em";

    this.hideEmptyHTMLFields = function hideEmptyHTMLFields()
    {
        $("div.HtmlEditorReadOnly").each(function(index, element)
        {
            var editorElement = $(element);

            if (editorElement.outerHeight() === 0) {
                editorElement.closest("div.fieldContainer").css('display', 'none');
            }
        });
    }

    this.modifyInlineFields = function modifyInlineFields ()
    {
        $(".mood-inlineformelementeditor").each(function () {

            var currentInlineForm = this;

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

            $(this).find("HtmlFieldControl").each(function() {

                var _remove = false;

                if ($(this).outerHeight() == 0)
                {
                    _remove = true;
                }

                if (this.innerText == "" || this.innerText == " " || this.innerText == String.fromCharCode(160))
                {
                    _remove = true;
                }

                if (_remove)
                {
                    var parentContainer = $(this).closest(".fieldContainer");
                    var previousElement = parentContainer.prev(".separator");

                    if (previousElement)
                    {
                        previousElement.remove();
                    }
                    else
                    {
                        var nextElement = parentContainer.next(".separator");

                        if (nextElement)
                        {
                            nextElement.remove();
                        }
                    }

                    parentContainer.remove();
                }

            });

            $(this).find(".fieldContainer").find("input").each(function() {

                var _value = this.getAttribute("value");

                if (_value == "0|" || _value == "")
                {
                    var parentContainer = $(this).closest(".fieldContainer");
                    var previousElement = parentContainer.prev(".separator");

                    if (previousElement)
                    {
                        previousElement.remove();
                    }
                    else
                    {
                        var nextElement = parentContainer.next(".separator");

                        if (nextElement)
                        {
                            nextElement.remove();
                        }
                    }
        
                    parentContainer.remove();
                }

            });

            $(this).find(".fieldControlContainer").each(function() {
                $(this).removeClass("widthSingle").css("width",_width);
                $(this).closest(".fieldContainer").removeClass("widthSingle").css("width",_width);
            });

        });

    }

    //remove check boxes and excess relationships
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

(function enableInlineOptions()
{
    if (Salamander.lang.isSysDefined())
        {		
            if (Sys.WebForms)
            {
                if (Sys.WebForms.PageRequestManager)
                {
                    if (Sys.WebForms.PageRequestManager.getInstance())
                    {
                        if (_enableHideEmptyInlineForms)
                        {
                            Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineFormCode.hideEmptyHTMLFields);
                        }

                        if (_enableInlineFormWidthChanges)
                        {
                            Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineFormCode.modifyInlineFields);
                        }

                        if (_enableRelationshipNavigation)
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

                        if (_enableKnowledgeActivatedDocumentsNavigation)
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

                        if (_enableRelationshipNavigation || _enableKnowledgeActivatedDocumentsNavigation)
                        {
                            Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(cInlineFormCode.setupInlineRelationships);                            
                        }
    
                        return;
                    }
                }
            }
        }
                       
        setTimeout(function() { hideEmptyReadOnlyHTMLFields(); }, 10);
})();
