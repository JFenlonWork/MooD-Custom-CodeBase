/*
	Title:
		Resize Model Masters
	
	Description:
		script for auto-resizing model based on lowest elements or page marker
*/

window.cPageResizer = window.cPageResizer || new function customPageResizer()
{

    //store offsets for page end and screen end
    this.lowestOffset = 32;
    this.endOfPageOffset = 32;

    this.resizePage = function resizePage()
    {
        //find the lowest object or marker if placed
        //higher = lower due to Y starting from top of the page
        var lowest = cPageResizer.findLowestPoint();
        
        //This is just an extra 32px on the
        //bottom of the screen so it doesn't feel too close
        lowest += cPageResizer.lowestOffset; 
    
        //this next part sets the two html parents of the page to hide the overflow(bit after max height)
        //and to set the height of the entire page 
        $("#ctl00_ContentPlaceHolder1_Container").addClass("modelMasterResizer");
        $("#ctl00_ContentPlaceHolder1_InteractiveModel1").addClass("modelMasterResizer");
        $("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]").addClass("modelMasterResizer");
    
        $("#ctl00_ContentPlaceHolder1_Container").css("overflow","hidden").css("height",lowest + cPageResizer.endOfPageOffset +"px");
        $("#ctl00_ContentPlaceHolder1_InteractiveModel1").css("overflow","hidden").css("height",lowest+"px");
        $("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]").css("top",(lowest - 8)+"px");
    
        //force browser to be within page view
        if (window.scrollY > lowest)
        {
            window.moveTo(window.scrollX, lowest);
        }
    }

    //find the lowest position on the page
    this.findLowestPoint = function findLowestPoint()
    {
        //check if a marker exists on the page
        var marker = $(".mood-node-name-page-marker");

        marker.sort(function(a, b) {
            var _heightA = cMaths.Bounds.fromObject(a, document);
            var _heightB = cMaths.Bounds.fromObject(b, document);
            return _heightA.y2 < _heightB.y2;
        })
        
        //if marker exists go to manual resizing
        if (marker.length > 0) 
        {
            return cMaths.Bounds.fromObject(marker[0], document).y2;
        }
        
        //else calculate the lowest point
        return cPageResizer.findLowestHTMLObject();
    }

    //calculate the lowest positioned object in HTML
    this.findLowestHTMLObject = function findLowestHTMLObject()
    {
        var _lowest = 0;

        var _objToIgnore = [$("img[usemap='#ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0],
								$("map[name='ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0],
								$("[id=ctl00_ContentPlaceHolder1_InteractiveModel1_shadow]")[0]]
        
        //loop through all the main element html in page (the containers for each element)
        $("[id=ctl00_ContentPlaceHolder1_InteractiveModel1]").children().each(function() {

            if (_objToIgnore.includes(this)) { return; }

            if ($(this).is("div"))
			{
                var _currentBounds = cMaths.Bounds.fromObject(this, document);
                var _currentHeight = _currentBounds.y2;

                //check if the currentHeight is a valid value
                if (_currentHeight)
                {
                    //check currentHeight is greater than the
                    //lowest point(top to bottom so technically lower)
                    if (_currentHeight > _lowest)
                    {
                        //set new lowest to be currentHeight
                        _lowest = _currentHeight;
                    }
                }
            }
        });  
        
        return _lowest;
    }
}