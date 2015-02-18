var csInterface = null;

function onLoaded() {
	csInterface = new CSInterface();
	loadJSX();
    
	csInterface.addEventListener("com.adobe.host.notification.RenameStatus", getRenameStatus);
}

function submitRenameRequest()
{
	var newName = $("#newname").val();
	var filePath1 = $('#filepath1').val();
	var filePath2 = $('#filepath2').val();
	var newName1 = $("#newname1").val();
	var newName2 = $("#newname2").val();
	var renameItemList = "";
	
	if (filePath1 != "" && newName1 != "")
	{
		renameItemList += '<renameItem src="' + filePath1 + '" newName="' + newName1 + '"/>';
	}
	
	if (filePath2 != "" && newName2 != "")
	{
		renameItemList += '<renameItem src="' + filePath2 + '" newName="' + newName2 + '"/>';
	}
	
	if (renameItemList != "")
	{
		var event = new CSEvent("com.adobe.browser.event.RenameRequest", "APPLICATION");
		var taskID = newGuid();
		var msgID = newGuid();
		
		var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/><renameItemList>' + renameItemList + '</renameItemList></browserMessage>';
		console.log("[Send message to browser to rename]: %s", messageXML);
		event.data = messageXML;
		csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
	}
	else
	{
		$('#result').html("");
	}
}

function getRenameStatus(event)
{
	var xmpContent = event.data;
	console.log("[Response to rename status event], received data is: %s", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		var resultRenameStatus = parseRenameStatus(xmlDoc);
		$('#result').html(resultRenameStatus);
	}
	else
	{
		console.log("[Can not parse xml document]");
		$('#result').html("");
	}
}

function parseRenameStatus(xmlDoc)
{
	var resultRenameStatus = "";
	if (xmlDoc != null)
	{
		resultRenameStatus = "<b>" + xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue + "</b>";
		var renameItems = xmlDoc.getElementsByTagName('actionResultList')[0];
		var renameItemsNodes = renameItems.childNodes;
		if (renameItemsNodes)
		{
			resultRenameStatus += '<ol type="1">';
			for (var i = 0; i < renameItemsNodes.length; i++)
			{
				resultRenameStatus += '<li>Result: ' + renameItemsNodes[i].getElementsByTagName('result')[0].firstChild.nodeValue + '<br>';
				resultRenameStatus += 'Source: ' + renameItemsNodes[i].getElementsByTagName('src')[0].getAttribute("path") + '<br>';
				resultRenameStatus += 'Destination: ' + renameItemsNodes[i].getElementsByTagName('dst')[0].getAttribute("path") + '</li>';
			}
			resultRenameStatus += '</ol>';
		}
	}
	
	return resultRenameStatus;
}

function clearTextArea()
{
	$('#apimessage').val("");
}
