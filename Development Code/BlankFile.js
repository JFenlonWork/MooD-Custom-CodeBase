function initateDropdown() {
	if (Salamander.lang.isSysDefined())
	{
		if (Sys.WebForms)
		{
			if (Sys.WebForms.PageRequestManager)
			{
				/*
				function updateDOM() {
					setTimeout(function() {
						var menu = $(".MenuBar");
                        menu.appendTo($(ctl00_ContentPlaceHolder1_InteractiveModel1)[0]);

                        var menuBar = $(".MenuBarMenu")[0];

                        menu[0].addEventListener("mouseover", function(e) {
                             e.stopPropagation();
                             currentHover = menuBar;
                             closeAllMenuItems(e, menuBar);
                             expandMenuItem(menuBar);
                             keepParentsExpanded(menuBar);
                        });
 					}, 200);
					return;
				}
				Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(updateDOM);
				*/

				Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(updateMenu);
				return;
			}
		}
	}
	setTimeout(function() { return initateDropdown() }, 100);
}

initateDropdown();

var menu = function menu(id, cssClass, chevron, menuType)
{
	this.topLevelMenuItems = [];
	this.DOMElement = null;
	this.menuDOMJQuery = null;
	this.waitingForParent = [];
	this.id = id;
	this.cssClass = cssClass;
	this.defaultChevron = chevron;
	this.menuType = menuType;

	var waitingForParent = function(_menuItem, parent) {
		this.menuItem = _menuItem;
		this.parent = parent;
	}

	this.addMenuItem = function(_menuItem, parent)
	{
		if (parent != null)
		{
			var parentFound = null;
			if (typeof parent === "string")
			{
				parentFound = this.searchMenuForText(parent);
			}
			else
			{
				parentFound = parent;
			}

			if (parentFound == null) {
				this.waitingForParent.push(new waitingForParent(_menuItem, parent));
				return;
			}

			if (parentFound instanceof menuItem)
			{
				menuLevel(parentFound);
				parentFound.setupChevron(this.defaultChevron);
			}

			parentFound.addChild(_menuItem, true);
		}
		else
		{
			_menuItem.updateParent(this);
		}

		this.setupChildrenToParent(_menuItem);
	}

	this.addChild = function(child, updateChild)
	{
		for (var i = 0; i < this.topLevelMenuItems.length; i++)
		{
			if (this.topLevelMenuItems[i] == child)
			{
				return;
			}
		}

		if (updateChild)
		{
			child.updateParent(this);
		}
		else
		{
			this.topLevelMenuItems.push(child);
		}
	}

	this.setupChildrenToParent = function(_menuItem)
	{
		var _menuText = _menuItem.getMenuText();
		for (var i = 0; i < this.waitingForParent.length; i++) {
			if (this.waitingForParent[i].parent === _menuText) {
				this.addMenuItem(this.waitingForParent[i].menuItem, _menuItem);
				this.waitingForParent.splice(i, 1);
				i--;
			}
		}
	}

	this.removeMenuItem = function(_menuItem, restructure)
	{
		if (typeof _menuItem["destroyAll"] === "function")
		{
			if (restructure == false) 
			{
				child.destroyAll();
			}
			else
			{
				child.destroy();
			}
		}
		else
		{
			child.destroy();
		}
	}

	this.append = function(DOMElement)
	{
		this.menuDOMJQuery.append(DOMElement);
	}

	this.createMenuDOMs = function()
	{
		if (this.menuDOM == null) {
			this.menuDOM = document.createElement("div");
			this.menuDOM.setAttribute("id", this.id);
		}

		if (this.menuDOMJQuery == null) {
			this.menuDOMJQuery = $(this.menuDOM);
			this.menuDOMJQuery.addClass(this.cssClass);
			this.menuDOMJQuery.appendTo($(ctl00_ContentPlaceHolder1_InteractiveModel1)[0]);
		}

		var _this = this;
		this.topLevelMenuItems.forEach(function(_menuItem) {
			_menuItem.createMenuDOMs(_this.menuType);
		});
	}

	this.searchMenuForText = function(_menuText)
	{
		this.topLevelMenuItems.forEach(function(_menuItem) {

			var menuItemReturn = _menuItem.searchMenuForText(_menuText);
			if (menuItemReturn != null) { return menuItemReturn };

		});

		return null;
	}

	this.searchMenuForObject = function(DOMElement)
	{
		this.topLevelMenuItems.forEach(function(_menuItem) {

			var menuItemReturn = _menuItem.searchMenuForObject(DOMElement);
			if (menuItemReturn != null) { return menuItemReturn };

		});

		return null;
	}
}

var menuLevel = function menuLevel(_callMenuItem)
{
	if (_callMenuItem != null)
	{
		if (_callMenuItem !== true)
		{
			menuLevel.call(_callMenuItem, true);
			return;
		}
	}
	else 
	{
		menuItem.call(this);
	}
	this.children = [];
	this.chevronElement = new menuChevron();

	this.setupChevron = function(_chevron)
	{
		this.chevronElement.setup(_chevron, this);
	}

	var oldCreateMenuDOMs = this.createMenuDOMs;
	this.createMenuDOMs = function()
	{
		oldCreateMenuDOMs.call(this);
		this.updateDOMClass(false, "MenuItem");
		this.updateDOMClass(true, "MenuLevel");
		this.updateDOMID("menuLevel");

		this.chevronElement.createMenuDOMs();

		this.children.forEach(function(child) {
			child.createMenuDOMs();
		});
	}

	this.addChild = function(child, updateChild)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			if (this.children[i] == child)
			{
				return;
			}
		}

		if (updateChild)
		{
			child.updateParent(this);
		}
		else
		{
			this.children.push(child);
		}
	}

	this.removeChild = function(child, updateChild)
	{
		if (updateChild)
		{
			child.updateParent(null);
		}

		for (var i = 0; i < this.children.length; i++)
		{
			if (this.children[i] == child)
			{
				this.children.splice(i, 1);
				i--;
			}
		}
	}

	var itemSearchText = this.searchMenuForText;
	this.searchMenuForText = function(_menuText)
	{
		if (itemSearchText.call(this, _menuText) != null) { return this };

		this.children.forEach(function(child) {

			var childReturn = child.searchMenuForText(_menuText);
			if (childReturn != null) { return childReturn };

		});

		return null;
	}

	var itemSearchObject = this.searchMenuForObject;
	this.searchMenuForObject = function(DOMElement)
	{
		if (itemSearchObject.call(this, DOMElement) != null) { return this };

		this.children.forEach(function(child) {

			var childReturn = child.searchMenuForObject(DOMElement);
			if (childReturn != null) { return childReturn };

		});

		return null;
	}

	this.destroy = function()
	{
		this.menuTextElement.destroy();
		this.updateParent(null);

		if (this.DOMJquery != null)
		{
			this.DOMJquery.remove();
		}

		var _parent = this.parent;
		this.children.forEach(function(child) {
			child.updateParent(_parent);
		});

	}

	this.destroyAll = function()
	{
		this.children.forEach(function(child) {
			if (typeof child["destroyAll"] === "function")
			{
				child.destroyAll();
			}
			else
			{
				child.destroy();
			}
		});
	}
}

var menuItem = function menuItem()
{
	this.menuTextElement = new menuText();
	this.DOMJquery = null;
	this.DOMElement = null;
	this.parent = null;

	this.setup = function(_menuText, parent)
	{
		this.menuTextElement.setup(_menuText, this);
		this.parent = parent;
	}

	this.createMenuDOMs = function()
	{
		if (this.DOMElement == null) {
			this.DOMElement = document.createElement("div");
			this.updateDOMID("menuItem");
		}

		if (this.DOMJquery == null) {
			this.DOMJquery = $(this.DOMElement);
			this.updateDOMClass(true, "MenuItem");
		}

		
		this.parent.append(this.DOMElement);
		this.menuTextElement.createMenuDOMs();
	}

	this.getMenuText = function()
	{
		return this.menuTextElement.getMenuText();
	}

	this.updateDOMClass = function(addOrRemove, classToAdd)
	{
		if (addOrRemove)
		{
			this.DOMJquery.addClass(classToAdd);
		}
		else
		{
			this.DOMJquery.removeClass(classToAdd);
		}
	}

	this.updateParent = function(parent)
	{
		if (parent != null)
		{
			if (this.parent != null && this.parent != parent)
			{
				this.parent.removeChild(this, false);
			}

			this.parent = parent;
			parent.addChild(this, false);
		}

		if (this.DOMElement != null)
		{
			if (parent instanceof menuLevel ||
				parent instanceof menu)
			{
				this.DOMJquery.appendTo(parent.DOMElement);
				console.log("parent menu item to menu");
				return true;
			}
			else if (parent == null)
			{
				this.DOMJquery.appendTo(window);
				console.log("Unparented menu item from menu");
				return true;
			}

			console.error("Failed to set DOM element parent as parent isn't a valid type");
			return false;
		}
	}

	this.updateDOMID = function(id)
	{
		this.DOMElement.setAttribute("id", id);
	}

	this.append = function(DOMElement)
	{
		this.DOMJquery.append(DOMElement);
	}

	this.searchMenuForText = function(_menuText)
	{
		if (this.menuTextElement.menuText == _menuText) { return this };
		return null;
	}

	this.searchMenuForObject = function(DOMElement)
	{
		if (this.DOMElement == DOMElement) { return this };
		return null;
	}

	this.destroy = function()
	{
		this.menuTextElement.destroy();
		this.updateParent(null);

		if (this.DOMJquery != null)
		{
			this.DOMJquery.remove();
		}
	}
}

var menuText = function menuText()
{
	this.menuText = null;
	this.menuTextDOMElement = null;
	this.menuTextJQuery = null;
	this.menuItemElement = null;

	this.setup = function(_menuText, _menuItem)
	{
		this.menuText = _menuText;
		this.menuItemElement = _menuItem;
	}

	this.getMenuText = function() {
		return this.menuText;
	}

	this.createMenuDOMs = function()
	{
		if (this.menuTextDOMElement == null) {
			this.menuTextDOMElement = document.createElement("p");
			this.menuTextDOMElement.setAttribute("id", "menuText");
			this.menuTextDOMElement.innerText = this.menuText;
		}

		if (this.menuTextJQuery == null) {
			this.menuTextJQuery = $(this.menuTextDOMElement);
			this.menuTextJQuery.addClass("MenuText");
		}


		this.menuItemElement.append(this.menuTextDOMElement);
	}

	this.destroy = function()
	{
		if (this.menuTextJQuery != null)
		{
			menuTextJQuery.remove();
		}
	}
}

var menuChevron = function menuChevron()
{
	this.menuChevron = null;
	this.menuChevronDOMElement = null;
	this.menuChevronJQuery = null;
	this.menuItemElement = null;

	this.setup = function(_menuChevron, _menuItem)
	{
		this.menuChevron = _menuChevron;
		this.menuItemElement = _menuItem;
	}

	this.createMenuDOMs = function()
	{
		if (this.menuChevronDOMElement == null) {
			this.menuChevronDOMElement = document.createElement("p");
			this.menuChevronDOMElement.setAttribute("id", "menuChevron");
			this.menuChevronDOMElement.innerText = this.menuChevron;
		}

		if (this.menuChevronJQuery == null) {
			this.menuChevronJQuery = $(this.menuChevronDOMElement);
			this.menuChevronJQuery.addClass("MenuChevron");
		}

		this.menuItemElement.append(this.menuChevronDOMElement);
	}

	this.destroy = function()
	{
		if (this.menuChevronJQuery != null)
		{
			menuChevronJQuery.remove();
		}
	}
}

var currentMenu = new menu("MainMenuTest", "MainMenu", ">");

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
					var _menuText = menuDataAll[1].innerText;
					var menuParent = $(menuDataAll[2]).find("tr").children("td");

					if (title == "") return;

					//handle null and I.E empty field
					if (menuText == null || menuText.length < 2)
					{
						_menuText = title;
					}

					if (menuParent.length >= 2)
					{
						menuParent = menuParent[1].innerText;
					}
					else
					{
						menuParent = null;
					}

					var _menuItem = new menuItem();
					_menuItem.setup(_menuText, null);
					currentMenu.addMenuItem(_menuItem, menuParent);

					/*
			
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
					*/
				});

				currentMenu.createMenuDOMs();
				//createMenu(menuStructure);

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

	splitLine.addEventListener("mouseover", function(e) { e.stopPropagation(); currentHover = this; });
	
	DOMElement.addEventListener("mouseover", function(e) { e.stopPropagation(); onMenuHover(e, this); });
    //DOMElement.addEventListener("mouseout", function(e) { e.stopPropagation();  onMenuHoverLeave(e, this, true); });  

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
		})
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