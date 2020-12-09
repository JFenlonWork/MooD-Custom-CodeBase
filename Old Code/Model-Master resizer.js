/*
	Title:
		Resize Model Masters
	
	Description:
		script for auto-resizing model based on lowest elements or page marker
*/

//Add resizing to page load
(function initiateResizer()
{
	//check if Salamander (mood?) has been setup
	if (Salamander.lang.isSysDefined())
	{		
		if (Sys.WebForms)
		{
			if (Sys.WebForms.PageRequestManager)
			{
				if (Sys.WebForms.PageRequestManager.getInstance())
				{
					Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(resizePage);
					return;
				}
			}
		}	
	}
	
	setTimeout(function() { initiateResizer(); },10);
	
})();

//resize page and add offsets to end of page
function resizePage() 
{
	//find the lowest object or marker if placed
	//higher = lower due to Y starting from top of the page
	var lowest = findLowestPoint();
	
	//store offsets for page end and screen end
	var lowestOffset = 32;
	var endOfPageOffset = 32;

	//This is just an extra 32px on the
	//bottom of the screen so it doesn't feel too close
	lowest += lowestOffset; 

	//this next part sets the two html parents of the page to hide the overflow(bit after max height)
	//and to set the height of the entire page 
	$("#ctl00_ContentPlaceHolder1_Container").addClass("modelMasterResizer");
	$("#ctl00_ContentPlaceHolder1_InteractiveModel1").addClass("modelMasterResizer");

	$("#ctl00_ContentPlaceHolder1_Container").css("overflow","hidden").css("height",lowest + endOfPageOffset +"px");
	$("#ctl00_ContentPlaceHolder1_InteractiveModel1").css("overflow","hidden").css("height",lowest+"px");

	//force browser to be within page view
	if (window.scrollY > lowest)
	{
		window.moveTo(window.scrollX, lowest);
	}
}

//find the lowest position on the page
function findLowestPoint()
{
	//check if a marker exists on the page
	var marker = $(".mood-node-name-page-marker");
	
	//if marker exists go to manual resizing
	if (marker.length > 0) 
	{
		return findMarkerPosition(marker[0]);
	}
	
	//else calculate the lowest point
	return findLowestHTMLObject();
}

//return the top offset of marker
function findMarkerPosition(_marker)
{
	return parseInt(_marker.style.top.replace("px",""));
}

//calculate the lowest positioned object in HTML
function findLowestHTMLObject()
{
	var lowest = 0;
	
	//loop through all the main element html in page (the containers for each element)
	$(ctl00_ContentPlaceHolder1_InteractiveModel1).children().each(function() {

        //skip if child is an image or the shadow of the page
		if (this == $("img[usemap='#ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0] ||
			this == $("map[name='ctl00$ContentPlaceHolder1$InteractiveModel1$ctl01']")[0] ||
			 this == $(ctl00_ContentPlaceHolder1_InteractiveModel1_shadow)[0])
        { 
            return;
        }

		var currentBounds = cMaths.Bounds.fromObject(this, "document", ".scroller");
		var currentHeight = currentBounds.y2;

		//check if the currentHeight is a valid value
		if (currentHeight)
		{
			//check currentHeight is greater than the
			//lowest point(top to bottom so technically lower)
			if (currentHeight > lowest)
			{
				//set new lowest to be currentHeight
				lowest = currentHeight;
			}
		}
	});  
	
	return lowest;
}