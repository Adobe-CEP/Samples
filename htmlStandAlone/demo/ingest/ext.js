var csInterface = null;

function onLoaded() {
	csInterface = new CSInterface();
	loadJSX();
    
	csInterface.addEventListener("com.adobe.host.notification.OpenIngestDialogStatus", getOpenIngestDialogStatus);
	csInterface.addEventListener("com.adobe.host.notification.IngestItemsReady", getIngestItemsReady);
}

function getOpenIngestDialog()
{
	var event = new CSEvent("com.adobe.browser.event.OpenIngestDialog", "APPLICATION");
	var taskID = newGuid();
	var msgID = newGuid();
	
	var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/></browserMessage>';
	console.log("[Send message to browser to open ingest dialog]: %s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function getOpenIngestDialogStatus(event)
{
	var xmpContent = event.data;
	console.log("[Response to open ingest dialog status changed event], received data is: %s", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		var resultOpenIngestDialog = parseOpenIngestDialogStatus(xmlDoc);
		var o = document.getElementById("result");
		o.value = resultOpenIngestDialog;
	}
	else
	{
		console.log("[Can not parse xml document]");
	}
}

function getIngestItemsReady(event)
{
	var xmpContent = event.data;
	console.log("[Response to open ingest items ready event], received data is: %s", xmpContent);
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		var resultIngestItemsReady = parseIngestItemsReady(xmlDoc);
		$('#itemlist').html(resultIngestItemsReady);
	}
	else
	{
		console.log("[Can not parse xml document]");
		$('#itemlist').html("");
	}
	
	$("#itemlist").accordion("refresh");
}

function parseOpenIngestDialogStatus(xmlDoc)
{
	var resultOpenIngestDialog = "";
	if (xmlDoc != null)
	{
		resultOpenIngestDialog = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
	}
	
	return resultOpenIngestDialog;
}

function parseIngestItemsReady(xmlDoc)
{
	var resultIngestItemsReady = "";
	if (xmlDoc != null)
	{
		var ingestItems = xmlDoc.getElementsByTagName('ingestItemList')[0];
		var ingestItemsNodes = ingestItems.childNodes;
		if (ingestItemsNodes)
		{
			resultIngestItemsReady = '<ol type="1">';
			for (var i = 0; i < ingestItemsNodes.length; i++)
			{
				resultIngestItemsReady += '<li><b>Path</b>: ' + ingestItemsNodes[i].getElementsByTagName('filePath')[0].getAttribute("path") + '<br>';
				resultIngestItemsReady += '<b>Alias Name</b>: ' + ingestItemsNodes[i].getElementsByTagName('aliasName')[0].firstChild.nodeValue + '</li>';
			}
			resultIngestItemsReady += '</ol>';
		}
	}
	
	return resultIngestItemsReady;
}

function clearTextArea()
{
	$('#apimessage').val("");
}
