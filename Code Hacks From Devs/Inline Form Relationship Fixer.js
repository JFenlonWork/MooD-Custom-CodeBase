/*
	Title:
		Inline Form Relationship Fixer
	
	Description:
		Modify Inline Forms To Make Relatinships Navigable
*/

/*CSS for relationship text:

.inlineFormRelationshipTextModified
{
	font-size: 11px;
	font-family: "Arial";
	color: black;

	text-decoration: underline;
	text-decoration-color: blue;

	width: fit-content;
	cursor: pointer;
}

.inlineFormRelationshipTextModified::after
{
	color: rgb(0,0,0,0) !important;
}

*/

(function () {

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

	(function waitUntilMooDLoaded() {

		//check if Salamander (mood?) has been setup
		if (Salamander.lang.isSysDefined()) {
			if (Sys.WebForms) {
				if (Sys.WebForms.PageRequestManager) {
					if (Sys.WebForms.PageRequestManager.getInstance()) {
						Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(setupInlineRelationships);
						return;
					}
				}
			}
		}

		setTimeout(function () { waitUntilMooDLoaded(); }, 10);

	})();

})();

//remove check boxes and excess relationships
function setupInlineRelationships() {

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