var csInterface = null;
var selectedItemInfoList = null;

function onLoaded() {
	csInterface = new CSInterface();
	loadJSX();
    
	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);
	csInterface.addEventListener("com.adobe.host.notification.GetAssociatedFilesStatus", getAssociatedFilesStatus);
	
	$("#content").accordion({collapsible: true});
}

function getAssociatedFiles()
{
	if (selectedItemInfoList.length>1)
	{
		$('#result').html('<font color=red>Only one asset should be selected.</font>');
	}
	else
	{
		var path = selectedItemInfoList[0].getElementsByTagName("filePath")[0].getAttribute("path");
		var event = new CSEvent("com.adobe.browser.event.GetAssociatedFiles", "APPLICATION");
		var taskID = newGuid();
		var msgID = newGuid();
		
		var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/><filePath path="' + path + '"/></browserMessage>';
		console.log("[Send message to browser to get associated files]: %s", messageXML);
		event.data = messageXML;
		csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
	}
}

function refreshSelectedAsset(event)
{
		var xmpContent = event.data;
		console.log("[Response to asset selected event], received data is: %s", xmpContent);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
		
		var xmlDoc = createXMLDocObject(xmpContent);
		if (xmlDoc != null)
		{
			var selectedItemHTML = parseSelectedAsset(xmlDoc);
			$('#content').html(selectedItemHTML);
			
			
			if (selectedItemInfoList.length==0)
			{
				$('#content').html("<h3>No Selection</h3>");
			}
			
			$("#content").accordion("refresh");
		}
		else
		{
			console.log("[Can not parse xml document]");
		}
		
		$("#result" ).text("");
}

function parseSelectedAsset(xmlDoc)
{
	var table = "";
	var type = "";
	var aliasName = "";
	var path = "";

	if (xmlDoc != null)
	{
		selectedItemInfoList = xmlDoc.getElementsByTagName("selectedItemInfo");
		
		var table = "";
		for (var i=0; i<selectedItemInfoList.length; i++)
		{
			
			type = selectedItemInfoList[i].getElementsByTagName("type")[0].firstChild.nodeValue;
			aliasName = selectedItemInfoList[i].getElementsByTagName("aliasName")[0].firstChild.nodeValue;
			path = selectedItemInfoList[i].getElementsByTagName("filePath")[0].attributes["path"].value;
			
			table += "<h3>" + aliasName + "</h3>";
			table += "<div><p><b>Path</b> : " + path + "<br>";
			table += "<b>Type</b> : " + type + '<br>';
			table += "<b>Alias Name</b> : " + aliasName + "</p>";
			if (type == "subClip")
			{
				
				subClipInfo = selectedItemInfoList[i].getElementsByTagName('subClipInfo')[0];
				table += '<ul><li>StartTime : '+subClipInfo.getElementsByTagName('startTime')[0].firstChild.nodeValue+'</li>';
				table += '<li>EndTime : '+subClipInfo.getElementsByTagName('duration')[0].firstChild.nodeValue+'</li>'
				table += '<li>MarkerID : '+subClipInfo.getElementsByTagName('markerID')[0].firstChild.nodeValue+'</li></ul>';
			}
			table += "</div>"
		}
	}

	return table;
}

function getAssociatedFilesStatus(event)
{
	var xmpContent = event.data;
	console.log("[Response to get associated files status event], received data is: %s", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		var resultGetAssociatedFilesStatus = parseGetAssociatedFilesStatus(xmlDoc);
		console.log(resultGetAssociatedFilesStatus);
		$('#result').html(resultGetAssociatedFilesStatus);
	}
	else
	{
		console.log("[Can not parse xml document]");
		$('#result').html("");
	}
	
	//$("#result").accordion("refresh");
}

function parseGetAssociatedFilesStatus(xmlDoc)
{
	var resultGetAssociatedFilesStatus = "";
	if (xmlDoc != null)
	{
		var parseSucceed = false;
		var files = xmlDoc.getElementsByTagName('fileList')[0];
		if (files)
		{
			var filesNodes = files.childNodes;
			if (filesNodes)
			{
				if (filesNodes.length > 0)
				{
					resultGetAssociatedFilesStatus = '<ul>';
					for (var i = 0; i < filesNodes.length; i++)
					{
						resultGetAssociatedFilesStatus += '<li>' + filesNodes[i].getAttribute("path") + '</li>';
					}
					resultGetAssociatedFilesStatus += '</ul>';
					parseSucceed = true;
				}
			}
		}
		if (!parseSucceed)
		{
			console.log("[Can not find fileList in xml document]");
			resultGetAssociatedFilesStatus = 'Associated Files Not Found';
		}
	}
	
	return resultGetAssociatedFilesStatus;
}

function clearTextArea()
{
	$('#apimessage').val("");
}
