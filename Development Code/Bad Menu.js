function initateDropdown() {
	if (Salamander.lang.isSysDefined())
	{
		if (Sys.WebForms)
		{
			if (Sys.WebForms.PageRequestManager)
			{
				function updateDOM() {
					setTimeout(function() {
						var menu = $(".MenuBar");
						menu.appendTo($(ctl00_ContentPlaceHolder1_InteractiveModel1)[0]);

                        var menuBar = $(".MenuBarMenu")[0];

                        menu[0].addEventListener("mouseover", function(e) {
                             e.stopPropagation();
							 $(document.body).closest("html")[0].classList.add("noScroll");
                             currentHover = menuBar;
                             closeAllMenuItems(e, menuBar);
                             expandMenuItem(menuBar);
                             keepParentsExpanded(menuBar);
                        });

						menu[0].addEventListener("mouseout", function(e) {
							e.stopPropagation();
							$(document.body).closest("html")[0].classList.remove("noScroll");
						});  

						menuBar[0].addEventListener("mouseover", function(e) {
							e.stopPropagation();
							$(document.body).closest("html")[0].classList.add("noScroll");
						});  

						menuBar[0].addEventListener("mouseout", function(e) {
							e.stopPropagation();
							$(document.body).closest("html")[0].classList.remove("noScroll");
						});  

 					}, 200);
					return;
				}
				Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(updateDOM);

				Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(updateMenu);
				return;
			}
		}
	}
	setTimeout(function() { return initateDropdown() }, 100);
}

initateDropdown();

function updateMenu()
{
	var menuMatrix = $(".mood-node-name-menu-items-find-all-menu-items");
	if (menuMatrix.length != 0)
	{
		Sys.WebForms.PageRequestManager.getInstance().remove_pageLoaded(updateMenu);

		(function calculateMenuItems() {

			var menuStructure = { topLevel: [] };
			var menuItems = menuMatrix.find(".RowHeading").closest("tr");

			if (menuItems.length != 0)
			{
				menuItems.each(function() {
					var menuDataAll = $(this).children("td");
					var title = menuDataAll[0].innerText;
					var menuText = menuDataAll[1].innerText;
					var menuParent = $(menuDataAll[2]).find("tr").children("td");

					if (title == "") return;

					//handle null and I.E empty field
					if (menuText == null || menuText.length < 2)
					{
						menuText = title;
					}

					if (menuParent.length >= 2)
					{
						menuParent = menuParent[1].innerText;
					}
					else
					{
						menuParent = null;
					}
			
					if (menuStructure[title] != null)
					{
						menuStructure[title].owner= title;
						menuStructure[title].text = menuText;
					}
					else
					{
						menuStructure[title] = { "owner": title, "text": menuText, "children": [] };
					}
		
					if (menuParent != null) {
						if (menuStructure[menuParent] != null)
						{
							menuStructure[menuParent].children.push(title);
						}
						else
						{
							menuStructure[menuParent] = { "owner": menuParent, "children": [title] };
						}
					}
					else
					{
						menuStructure.topLevel.push(title);
					}
				});

				createMenu(menuStructure);

			}
			else
			{
				setTimeout(function() { return calculateMenuItems() }, 100);
			}
		})();
	}
}

function createMenu(menuStructure)
{
	console.log(menuStructure);

	var parentDOM = $(".MenuBarMenu");

	if (parentDOM.length > 0)
	{
		menuStructure.topLevel.forEach(function(item) { createMenuItem(parentDOM[0], item, menuStructure); });
	}
	else
	{
		setTimeout(function() { return createMenu(menuStructure); }, 100);
	}

}

function createMenuItem(parentDOM, menuItem, menuStructure)
{
	var DOMElement = document.createElement("div");

	$(DOMElement).data("navigateText", menuStructure[menuItem].text);

	var DOMElementText = document.createElement("p");
	$(DOMElementText).addClass("MenuItemText");
	DOMElementText.setAttribute("id", "menuText");
	DOMElementText.innerText = menuStructure[menuItem].text;
	$(DOMElement).append(DOMElementText);

	//remove <br /> that is added in I.E
	$(DOMElementText).find("br").each(function() {
		$(this).remove();
	});

	var splitLine = document.createElement("div");
	$(splitLine).addClass("SplitLine");
	splitLine.setAttribute("id", "splitLine");

	if (menuStructure[menuItem].children.length == 0)
	{
		//add menu item class
		$(DOMElement).addClass("MenuBarItem");
		$(DOMElement).append(splitLine);
	}
	else
	{
		//add menu level class
		$(DOMElement).addClass("MenuBarLevel");

		//add chevron
		var DOMChevron = document.createElement("p");
		$(DOMChevron).addClass("Chevron");
		DOMChevron.setAttribute("id", "chevron");
		DOMChevron.innerText = ">";
		$(DOMElement).append(DOMChevron);
		$(DOMElement).append(splitLine);
		
		//add children
		menuStructure[menuItem].children.forEach(function(item) { createMenuItem(DOMElement, item, menuStructure); });
	
	}

	splitLine.addEventListener("mouseover", function(e) {
		e.stopPropagation();
		currentHover = this;
		$(document.body).closest("html")[0].classList.add("noScroll");
	});
	
	splitLine.addEventListener("mouseout", function(e) {
		e.stopPropagation();
		$(document.body).closest("html")[0].classList.remove("noScroll");
	});

	DOMElement.addEventListener("mouseover", function(e) {
		e.stopPropagation();
		onMenuHover(e, this);
		$(document.body).closest("html")[0].classList.add("noScroll");
	});
    //DOMElement.addEventListener("mouseout", function(e) { e.stopPropagation();  onMenuHoverLeave(e, this, true); });  

	DOMElement.addEventListener("mouseout", function(e) {
		e.stopPropagation();
		$(document.body).closest("html")[0].classList.remove("noScroll");
	});

	$(DOMElement).addClass("MenuDisabled")
	$(DOMElement).click(function(e) { e.stopPropagation(); navigateOnClick(this); })
	
	$(parentDOM).append(DOMElement);
}

function closeAllMenuItems(event, menuItem)
{
    if (menuItem != null) {
		//var menuItemOffsetTop = $(menuItem).offset().top;

        var array = $(".MenuActive").filter(function() {
			return !$(this).parent().hasClass("MenuBarMenu") &&
				 	$(this).offset().top > event.pageY;
        }).each(function() {
				$(this).removeClass("MenuActive").addClass("MenuDisabled");
		});

		$(".MenuActive").each(function() {
			
		});

		$(".MenuBarLevel").each(function() {
			if ($(this).children(".MenuActive").length == 0)
			{
				if ($(this).hasClass("MenuBarLevel"))
				{
					$(this).children("p[id=chevron]").removeClass("ChevronActive");
				}
			}
		});

    } else
    {
        $(".MenuActive").each(function() {
			$(this).removeClass("MenuActive").addClass("MenuDisabled");
			if ($(this).hasClass("MenuBarLevel"))
			{
				$(this).children("p[id=chevron]").removeClass("ChevronActive");
			}
        });
    }
}

function expandMenuItem(menuItem)
{
    $(menuItem).children().filter(function() {
		return ($(this).attr("id") != "chevron" &&
				$(this).attr("id") != "menuText" &&
				$(this).attr("id") != "splitLine");
	}).each(function() {
		$(this).addClass("MenuActive").removeClass("MenuDisabled");
	});

    if (!($(menuItem).hasClass("MenuBarMenu"))) {
        $(menuItem).addClass("MenuActive").removeClass("MenuDisabled");
	}
	
	if ($(menuItem).hasClass("MenuBarLevel"))
	{
		$(menuItem).children("p[id=chevron]").addClass("ChevronActive");
	}
}

function keepParentsExpanded(menuItem)
{
    if ($(menuItem).parent(".MenuBarLevel").length != 0)
	{
		$(menuItem).parent(".MenuBarLevel").each(function() {
			keepParentsExpanded(this);
			expandMenuItem(this);
		});
	}
}

var hoverForMS = 500;
var currentHover = null;
var currentHoverTimeouts = [];

function onMenuHover(event, menuItem)
{
	var hoverForMSActual = hoverForMS;
	if (menuItem == currentHover)
	{
		hoverForMSActual = 0;
	}
	currentHover = menuItem;
	clearMenuTimeouts();
	currentHoverTimeouts.push(
		window.setTimeout(function() {
			if (currentHover == menuItem)
			{
				closeAllMenuItems(event, menuItem);
				expandMenuItem(menuItem);
				keepParentsExpanded(menuItem);
			}
		}, hoverForMSActual)
	);
}

function clearMenuTimeouts() {
	while (currentHoverTimeouts.length > 0)
	{
		window.clearTimeout(currentHoverTimeouts[currentHoverTimeouts.length]);
		currentHoverTimeouts.pop();
	}
}

function onMenuHoverLeave(event, menuItem, repeat)
{
    var repeat = repeat || false;
    if (currentHover == menuItem ||
        currentHover == null)
    {
        if (repeat)
        {
            currentHoverTimeouts.push(
				setTimeout(function() {
                	return onMenuHoverLeave(event, menuItem, false);
				}, 20)
			);
        }
        else
        {
			clearMenuTimeouts();
            closeAllMenuItems(event);
        }
    }
}

function navigateOnClick(target)
{
	var menuMatrix = $(".mood-node-name-menu-items-find-all-menu-items");
	var menuItems = menuMatrix.find(".RowHeading").closest("tr");
	var targetText = $(target).data("navigateText");

	menuItems.each(function() {
		var menuDataAll = $(this).children("td");
		var title = menuDataAll[0].innerText;
		var menuText = menuDataAll[1].innerText;

		if (menuText == targetText || title == targetText)
		{
			$(menuDataAll[0]).find("a")[0].click();
		}
	});
}