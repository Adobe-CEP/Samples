var csInterface = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
    
    var appName = csInterface.hostEnvironment.appName;
    
    // updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    // Update the color of the panel when the theme color of the product changed.
	// csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	csInterface.addEventListener("com.adobe.host.notification.IsPremiereProInstalledStatus", getIsPremiereProInstalledStatus);
}

function isPremiereProInstalled()
{
	var event = new CSEvent("com.adobe.browser.event.IsPremiereProInstalled", "APPLICATION");
	var taskID = newGuid();
	var msgID = newGuid();

	var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/></browserMessage>';
	console.log("[Send message to browser to get Premiere Pro installed]: %s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function getIsPremiereProInstalledStatus(event)
{
	var xmpContent = event.data;
	console.log("[Response to Premiere Pro installed status changed event], received data is: %s", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		var resultIsPremiereProInstalled = parseIsPremiereProInstalledStatus(xmlDoc);
		var o = document.getElementById("result");
		o.value = resultIsPremiereProInstalled;
	}
	else
	{
	}
}

function parseIsPremiereProInstalledStatus(xmlDoc)
{
	var resultIsPremiereProInstalled = "";
	if (xmlDoc != null)
	{
		resultIsPremiereProInstalled = xmlDoc.getElementsByTagName('installed')[0].firstChild.nodeValue;
	}

	return resultIsPremiereProInstalled;
}

function clearTextArea()
{
	$('#apimessage').val("");
}
