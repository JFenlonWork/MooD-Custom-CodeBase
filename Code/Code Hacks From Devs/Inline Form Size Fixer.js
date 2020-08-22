/*
	Title:
		Inline Form Size Fixer
	
	Description:
		Modify Inline Forms To Make Relatinships Size Correct
*/

(function hideEmptyReadOnlyHTMLFields() {
    if (Salamander.lang.isSysDefined())
	{		
		if (Sys.WebForms)
		{
			if (Sys.WebForms.PageRequestManager)
			{
				if (Sys.WebForms.PageRequestManager.getInstance())
				{
                   Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(
                        function(sender, args) {
                            $("div.HtmlEditorReadOnly").each(function(index, element)
                            {
                                var editorElement = $(element);

                                if (editorElement.outerHeight() === 0) {
                                    editorElement.closest("div.fieldContainer").css('display', 'none');
                                }
                            });
                        }
                    );

                    return;
                }
            }
        }
    }
                   
    setTimeout(function() { hideEmptyReadOnlyHTMLFields(); }, 10);
})();

function modifyInlineFields ()
{
    var width = "75em";

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
            $(this).removeClass("widthSingle").css("width",width);
            $(this).closest(".fieldContainer").removeClass("widthSingle").css("width",width);
        });

    });

}