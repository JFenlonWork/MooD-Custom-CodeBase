/*
	Title:
		Fixed Navigation bar
	
	Description:
		Find Navigation bar and make it fixed/scaled to page
*/
var navigationBarFixed = new navigationBarFixer();

function navigationBarFixer()
{

    //holds all navigation bars
    this.allNavBars = [];

    //hold navigationBar data
    this.navBarData = function(_navBarName, _navBarHTML, _originalSize, _position)
    {
        this.navBarName = _navBarName || "";
        this.navBarHTML = _navBarHTML || null;
        this.originalSize = _originalSize || { x: 0, y: 0 };
        this.position = _postion || { x: 0, y: 0 };
        this.navBarItems = [];
    }

    //hold individual navigation bar item data
    this.navBarItemData = function(_html, _size, _offset)
    {
        this.html = _html || "";
        this.orignalSize = { x: _size.x, y: _size.y };
        this.originalOffset = { x: _offset.x, y: _offset.y };
    }

    //get navigation bar
    this.getNavBar = function (_navBarName)
    {
        for (var i = 0; i < this.allNavBars.length; i++)
        {
            if (this.allNavBars[i].navBarName == _navBarName)
            {
                return allNavBars[i];
            }
        }
        return null;
    }

    //setup within
    this.setupBar = function (_navBarName, _areaBounds, _position)
    {
        var _navBarData = this.getNavBar(_navBarName);

        //check nav bar data doesn't exist
        if (_navBarData != null)
        {
            var _navBarSize = { x: _areaBounds.x2 - _areaBounds.x1,
                                y: _areaBounds.y2 - _areaBounds.y1 };
            
            var _navBarHtml = $(".mood-node-name-" + _navBarName).first()[0];
            
            _navBarData = new this.navBarData(_navBarName, _navBarHtml, _navBarSize, _position);

            var _allElements = $(".InteractiveModel").children();
        
            //loop through all page elements
            for (var i = 0; i < _allElements.length; i++)
            {
                var _elementBounds = cMaths.Bounds.fromObject(_allElements[i], "document", "*");

                //check if element is within selection
                if (cMaths.collision.checkAreaWithinArea(_areaBounds, _elementBounds))
                {
                    //setup size and offset of elements and add item to nav bar
                    var _size = {   x: _elementBounds.x2 - _elementBounds.x1,
                                    y: _elementBounds.y2 - _elementBounds.y1};

                    var _offset = { x: _areaBounds.x1 - _elementBounds.x1,
                                    y: _areaBounds.y1 - _elementBounds.y1};

                    _navBarData.navBarItems.push(new this.navBarItemData(_elementsWithin[i], _size, _offset));
                }
            }

            this.allNavBars.push(_navBarData);

        }
        
        return _navBarData;
    }

    //update position and size of nav bar elements
    this.updateBar = function (_navBarName)
    {
        var _navBar = this.getNavBar(_navBarName);

        //check if nav bar exists
        if (_navBar != null)
        {
            //find position and size of navbar 
            var _currentBounds = cMaths.Bounds.fromObject(_navBar.html);

            var _currentSize = {x: _currentBounds.x2 - _currentBounds.x1,
                                y: _currentBounds.y2 - _currentBounds.y1};

            //find scaled size of object vs current size
            var _scaler = { x: _navBar.originalSize.x / _currentSize.x,
                            y: _navBar.originalSize.y / _currentSize.y};

            //update the navigation bar transforms
            for (var i = 0; i < _navBar.navBarItems.length; i++)
            {
                cCss.style.modifyTransformVariables(_navBar.navBarItems[i], "scale", [_scaler.x, _scaler.y]);
            }
        }
    }

    //get all within

    //fix all within relative to within

    //scale all within relative to within

}