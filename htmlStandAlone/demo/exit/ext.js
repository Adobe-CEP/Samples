var csInterface = null;

function onLoaded() {
	csInterface = new CSInterface();
	loadJSX();
	
	csInterface.addEventListener("com.adobe.host.notification.AppExit", getAppExit);
}

function getAppExit(event)
{
	var xmlContent = event.data;
	console.log("[Response to app exit event], received data is: %s", xmlContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmlContent + "\n\n");
		
	var xmlDoc = createXMLDocObject(xmlContent);
	var browserID = xmlDoc.getElementsByTagName("browserID")[0].getAttribute("ID");
	var taskID = xmlDoc.getElementsByTagName("taskID")[0].getAttribute("ID");
	var msgID = xmlDoc.getElementsByTagName("msgID")[0].getAttribute("ID");
	var allowExit = $('input[type="radio"][name="allowexit"]:checked').val();
	
	
	var event2 = new CSEvent("com.adobe.browser.event.ExitApp", "APPLICATION");
	var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/><assetMediaInfoList><allowExit>' + allowExit + '</allowExit></browserMessage>';
	
	if (allowExit != "true")
	{
		console.log("[Send message to browser to exit app]: %s", messageXML);
		event2.data = messageXML;
		csInterface.dispatchEvent(event2);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event2.type + "] ***\n" + messageXML + "\n\n");
		
		$('#result').html('Exit is interrupted.');
	}
	else
	{
		$('#result').html('Exiting ...');
	}
}

function clearTextArea()
{
	$('#apimessage').val("");
}
