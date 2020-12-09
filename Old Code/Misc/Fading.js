/*
	Title:
		Custom Fading functions
	
	Description:
		Attempt at making a fading image slideshow
*/
window.cFadingImages = window.cFadingImages || new function cFadingImages()
{
    //===LOCAL VARIABLES===//
    this.fadeUniqueID = 10000;
    this.fadingImagesArray = fadingImagesArray = [];

    //====DATA TYPES====//
    this.dataTypes = new cFadingDataTypes();

    this.FadingImages = this.dataTypes.fadingImages.prototype;
    this.fadingImages = this.dataTypes.fadingImages;

    //====FUNCTIONS====//
    this.setup = new cSetupFadingFunctions();
    this.generic = new cGernericFadingFunctions();
    this.search = new cSearchFadingFunctions();

    //===RUN-TIME FUNCTIONS===//
    (function setupFadingListener()
    {
        //check cEventListener Exists
        if (typeof cEventListener !== 'undefined')
        {
            //add fading image setup to "EventListenerCreation" 
            cEventListener.generic.addFunctionToWaitingForMessage("afterEventListenerCreation",
                { 
                    setupFunction : 
                        function () 
                        {
                            window.cFadingImages.setup.fadingImagesSetup();
                        }
                }
            );
            //setupFunctionListeners.push(new basicMessage("afterElementSetup","fadingImagesSetup()"));
        }
        else
        {
            setTimeout(function() { setupFadingListener(); }, 10);
        }
        
    })();
}

function cFadingDataTypes()
{
    //holds basic information for fading images
    this.fadingImages = function fadingImages (_imagesToFadeThrough, _fadeCss, _fadeDelay, _fadeID)
    {
        this.imagesToFadeThrough = _imagesToFadeThrough || [];
        this.fadeCss = _fadeCss;
        this.fadeDelay = _fadeDelay;
        this.fadingID = _fadeID || fadeUniqueID;
        this.isFading = false;
        this.currentImage = 0;
        
        //increase uniqueID if
        //this ID is the same
        if (_fadeID == fadeUniqueID)
        {
            fadeUniqueID++;
        }
    }
}

function cSetupFadingFunctions()
{
    this.addFadingImages = function addFadingImages(_imagesToFadeThrough, _fadeCss, _fadeDelay, _fadeID)
    {
        //check if fade exists
        var fadeIndex = cFadingImages.search.findFadeIndex(_fadeID);
        
        if (fadeIndex == null)
        {
            //create new fading image
            var tempFadingImage = new cFadingImages.fadingImages(_imagesToFadeThrough, _fadeCss, _fadeDelay, _fadeID);
            
            //add fading images to array
            cFadingImages.fadingImagesArray.push(tempFadingImage);
        }
    }

    this.removeFadingImages = function removeFadingImages(_fadeID)
    {
        //check if fade exists
        var fadeIndex = cFadingImages.search.findFadeIndex(_fadeID);
        
        if (fadeIndex != null)
        {
            //remove fading images from array
            cFadingImages.fadingImagesArray.splice(fadeIndex,1);
        }
    }

    //add image from fading image
    this.addToFadingImage = function addToFadingImage(_imageID, _fadeID)
    {
        //check if fade exists
        var fadeIndex = cFadingImages.search.findFadeIndex(_fadeID);
        
        if (fadeIndex != null)
        {
            //add image to fading image array
            cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough.push(_imageID);
        }
    }

    //remove image from fading image
    this.removeFromFadingImage = function removeFromFadingImage(_imageID, _fadeID)
    {
        //check if fade exists
        var fadeIndex = cFadingImages.search.findFadeIndex(_fadeID);
        
        if (fadeIndex != null)
        {
            //loop through all images in fader
            for (var i = 0; i < cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough.length; i++)
            {
                //check if image is equal to _imageID
                if (cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough[i] == _imageID)
                {
                    //remove image from list
                    cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough.splice(i,1);
                }
            }
        }
    }

    //MODIFY THIS SO THAT IT TAKES THE NEW JAVASCRIPT SETUP
    //default function to setup fading based on HTML
    this.fadingImagesSetup = function fadingImagesSetup()
    {
        //find main custom div
        var divHeaders = $('[title="CustomTab"]');
        
        //setup fading images from main divs
        for (var i = 0; i < divHeaders.length; i++)
        {		
            //find all fading images on header
            var headerFadingString = divHeaders[i].getAttribute( "fadingImageSetup" );
                
            //check headerFadingString exists
            if (headerFadingString)
            {
                
                //Split header string into header elements
                var headerFaders = headerFadingString.split("\n");
                
                //loop through all elements on header
                for (var faderIndex = 0; faderIndex < headerFaders.length; faderIndex++)
                {
                    //parse HTML data
                    var faderInfo = cEventListener.message.parseCustomHTMLData(headerFaders[faderIndex]);
                
                    if (faderInfo[0])
                    {
                        cFadingImages.setup.addFadingImages(faderInfo[1].split(' '), faderInfo[2].replace(/'/g, ""), faderInfo[3], faderInfo[0]);
                        
                        if (faderInfo[4])
                        {
                            cFadingImages.generic.startFade(faderInfo[0]);
                        }
                    }
                }
            }
        }

    }

}

function cGernericFadingFunctions()
{
    //find fade and set it to fading
    this.startFade = function startFade(_fadeID)
    {
        //check if fade exists
        var fadeIndex = cFadingImages.search.findFadeIndex(_fadeID);
        
        if (fadeIndex != null)
        {
            //loop through all images and set them to be hidden and give them the css for fading image
            for (var i = 0; i < fadingImagesArray[fadeIndex].imagesToFadeThrough.length; i++)
            {			
                var elementObj = cUtility.findHTMLObjects(
                    cElement.search.getElementID(
                        cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough[i]
                        )
                    );
            
                if (elementObj)
                {
                    elementObj[0].classList.add(cFadingImages.fadingImagesArray[fadeIndex].fadeCss);
                    
                    //check if image is the currently shown image
                    if (i == cFadingImages.fadingImagesArray[fadeIndex].currentImage)
                    {
                        //set it to enabled if it is
                        cElement.modify.toggleElement(
                            cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough[i],
                            new basicMessage("","enable"),
                            null);
                        elementObj[0].style.opacity = 1;
                    }
                    else
                    {
                        //set it to disabled if it isn't
                        cElement.modify.toggleElement(
                            cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough[i],
                            new basicMessage("","disable"),
                            null);
                        elementObj[0].style.opacity = 0;
                    }
                }
            
            }
            
            //set fading images isFading to true and start fading
            cFadingImages.fadingImagesArray[fadeIndex].isFading = true;
            setTimeout(
                function() 
                { 
                    cFadingImages.generic.continueFade(_fadeID); 
                }, 
                cFadingImages.fadingImagesArray[fadeIndex].fadeDelay
            );
        }
    }

    //find fade and continue fading
    this.continueFade = function continueFade(_fadeID)
    {
        var fadeIndex = cFadingImages.search.findFadeIndex(_fadeID);
        
        //check fade ID exists
        if (fadeIndex != null)
        {
            //check image is still fading
            if (cFadingImages.fadingImagesArray[fadeIndex].isFading)
            {			
        
                //toggle element to disable after transition
                (function ()
                {
                    //setup variables at run time as timeout grabs current variables at that time when ran
                    this.elementToToggle = cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough[
                        cFadingImages.fadingImagesArray[fadeIndex].currentImage
                    ];
                    this.elementObj = cUtility.findHTMLObjects(cElement.search.getElementByID(elementToToggle));
                    this.disableDelay = 0;
                    
                    //check if element exists
                    if (elementObj.length > 0)
                    {
                        //grab transition time from css
                        this.disableDelay = parseInt(getComputedStyle(elementObj[0]).transitionDuration);
                        
                        //if transition time isn't above then try webkit version (IE, edge?)
                        if (this.disableDelay == 0)
                        {
                            this.disableDelay = parseInt(getComputedStyle(elementObj[0]).webkitTransitionDuration);
                        }
                    }

                    var currentFunc = this;
                    
                    //set previous image to hidden after transtion delay * 1000 due to time being in milliseconds
                    setTimeout(function()
                    {
                        
                        cElement.modify.toggleElement(currentFunc.elementToToggle, new basicMessage("","disable"), null);
                    
                    }, currentFunc.disableDelay * 1000);
                    
                })();

                //set previous image opacity to 0
                cFadingImages.gerneric.setFadingElementOpacity(
                    cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough[
                        cFadingImages.fadingImagesArray[fadeIndex].currentImage
                    ],0);
                
                //increase current image index
                cFadingImages.fadingImagesArray[fadeIndex].currentImage++;
                
                //check if current image is above max fading image array
                if (cFadingImages.fadingImagesArray[fadeIndex].currentImage >=
                     cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough.length)
                {
                    cFadingImages.fadingImagesArray[fadeIndex].currentImage = 0;
                }
                
                //set current image to visible
                cElement.modify.toggleElement(
                    cFadingImages.fadingImagesArray[fadeIndex].imagesToFadeThrough[
                        cFadingImages.fadingImagesArray[fadeIndex].currentImage
                    ], new basicMessage("","enable"), null);
                
                cFadingImages.generic.setFadingElementOpacity(
                    fadingImagesArray[fadeIndex].imagesToFadeThrough[
                        cFadingImages.fadingImagesArray[fadeIndex].currentImage
                    ],1);
                
                //setup timeout to continue fade
                setTimeout(function() 
                {
                    cFadingImages.generic.continueFade(_fadeID);
                }, cFadingImages.fadingImagesArray[fadeIndex].fadeDelay);
            }
        }
    }

    this.setFadingElementOpacity = function setFadingElementOpacity(_elementID, _opacity)
    {
        var elementObj = cUtility.findHTMLObjects(cElement.search.getElementID(_elementID));
            
        if (elementObj)
        {
            elementObj[0].style.opacity = _opacity;
        }
    }

    //find fade and set it to not fading
    this.endFade = function endFade(_fadeID)
    {
        //check if fade exists
        var fadeIndex = cFadingImages.search.findFadeIndex(_fadeID);
        
        if (fadeIndex != null)
        {
            //set fading images isFading to false to stop fading
            cFadingImages.fadingImagesArray[fadeIndex].isFading = false;
        }
    }
}

function cSearchFadingFunctions()
{
    //find fading images index
    this.findFadeIndex = function findFadeIndex(_fadeID)
    {
        //loop through fading images
        for (var i = 0; i < cFadingImage.fadingImagesArray.length; i++)
        {
            //check if fading ID is the same as _fadeID
            if (cFadingImages.fadingImagesArray[i].fadingID == _fadeID)
            {
                return i;
            }
        }
        return null;
    }
}