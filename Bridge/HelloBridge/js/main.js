// Get a reference to a CSInterface object
var csInterface = new CSInterface();
	
// Add an event listener to update the background colour of Extension to match the Bridge Theme.
csInterface.addEventListener("com.adobe.csxs.events.ThemeColorChanged", themeChangedEventListener);


//Listener for ThemeColorChanged event. 
function themeChangedEventListener(event)
{  
	changeThemeColor();
}

//Gets Bridge Theme information and updates the body colour
function changeThemeColor()
{
    var hostEnv = csInterface.getHostEnvironment();
    var UIColorObj = new UIColor();
    UIColorObj = hostEnv.appSkinInfo.appBarBackgroundColor;
    var red = Math.round(UIColorObj.color.red);
    var green = Math.round(UIColorObj.color.green);
    var blue = Math.round(UIColorObj.color.blue);
    var alpha = Math.round(UIColorObj.color.alpha);
    var colorRGB = "#" + red.toString(16) + green.toString(16) + blue.toString(16);

    if ("#535353" != colorRGB) /* "#535353" is the original color */
    {
        document.body.style.backgroundImage = "none";
    }   
    document.body.style.backgroundColor = colorRGB;
    document.body.style.opacity = alpha / 255;
}


//Opens link in the default browser
function OpenGitHubInBrowser()
{
    window.cep.util.openURLInDefaultBrowser("https://github.com/Adobe-CEP/");
}