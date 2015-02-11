var csInterface = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
	
	csInterface.addEventListener("com.adobe.host.notification.GetCurrentWorkModeStatus", getCurrentWorkModeStatus);
}

function getCurrentWorkMode()
{
	var event = new CSEvent("com.adobe.browser.event.GetCurrentWorkMode", "APPLICATION");
	var taskID = newGuid();
	var msgID = newGuid();

	var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/></browserMessage>';
	console.log("[Send message to browser to get current work mode]: %s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function getCurrentWorkModeStatus(event)
{
	var xmpContent = event.data;
	console.log("[Response to current work mode status changed event], received data is: %s", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		var resultCurrentWorkMode = parseCurrentWorkModeStatus(xmlDoc);
		var o = document.getElementById("result");
		o.value = resultCurrentWorkMode;
	}
	else
	{
	}
}

function parseCurrentWorkModeStatus(xmlDoc)
{
	var resultCurrentWorkMode = "";
	if (xmlDoc != null)
	{
		resultCurrentWorkMode = xmlDoc.getElementsByTagName('currentWorkMode')[0].firstChild.nodeValue;
	}

	return resultCurrentWorkMode;
}

function clearTextArea()
{
	$('#apimessage').val("");
}
