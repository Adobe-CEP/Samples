var csInterface = null;
var selectedItemInfoList = null;

function onLoaded() {
	csInterface = new CSInterface();
	loadJSX();
    
	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);
	csInterface.addEventListener("com.adobe.host.notification.ExportAssetStatus", getExportStatus);
	
	$("#content").accordion({collapsible: true});
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
			
			$("#content").accordion( "refresh" );
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

function submitExportAsset()
{
	var event = new CSEvent("com.adobe.browser.event.ExportAsset", "APPLICATION");
	var taskID = newGuid();
	var msgID = newGuid();
	var assetID = "";
	var type = "";
	var aliasName = "";
	var path = "";
	var name = "";
	var assetMediaInfoList = '<assetMediaInfoList>';
	var assetItemList = '<assetItemList>';
	var mediaUseLocalFile = "true";
	var roughCutUseLocalFile = "true";
	
	for (var i=0; i<selectedItemInfoList.length; i++)
	{
		var assetID = newGuid();
		type = selectedItemInfoList[i].getElementsByTagName("type")[0].firstChild.nodeValue;
		aliasName = selectedItemInfoList[i].getElementsByTagName("aliasName")[0].firstChild.nodeValue;
		path = selectedItemInfoList[i].getElementsByTagName("filePath")[0].attributes["path"].value;
		name = path.split("\\").pop().split("/").pop();
		
		assetMediaInfoList += '<assetMediaInfo>';
		assetMediaInfoList += '<filePath path="' + path + '"/>';
		assetMediaInfoList += '<assetID ID="' + assetID + '"/>';
		assetMediaInfoList += '<type>' + type + '</type>';
		assetMediaInfoList += '<aliasName>' + aliasName + '</aliasName>';
		assetMediaInfoList += '<fileMetadata><xmp><![CDATA[...]]></xmp></fileMetadata>';
		assetMediaInfoList += '</assetMediaInfo>';
		
		assetItemList += '<assetItem order="' + (i+1) + '">';
		assetItemList += '<filePath path="' + path + '"/>';
		assetItemList += '<mediaInfoID ID="' + assetID + '"/>';
		assetItemList += '<parentAssetID ID="' + assetID + '"/>';
		assetItemList += '<assetID ID="' + assetID + '"/>';
		assetItemList += '<name>' + name + '</name>';
		assetItemList += '<type>' + type + '</type>';
		assetItemList += '</assetItem>';
	}
	assetMediaInfoList += '</assetMediaInfoList>';
	assetItemList += '</assetItemList>';
	
	var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/>' + assetMediaInfoList + assetItemList + '<mediaUseLocalFile>' + mediaUseLocalFile + '</mediaUseLocalFile><roughCutUseLocalFile>' + roughCutUseLocalFile + '</roughCutUseLocalFile></browserMessage>';
	console.log("[Send message to browser to export asset]: %s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function getExportStatus(event)
{
	var xmpContent = event.data;
	console.log("[Response to export status event], received data is: %s", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		var resultExportStatus = parseExportStatus(xmlDoc);
		var o = document.getElementById("result");
		o.value = resultExportStatus;
	}
	else
	{
		console.log("[Can not parse xml document]");
	}
}

function parseExportStatus(xmlDoc)
{
	var resultExportStatus = "";
	if (xmlDoc != null)
	{
		resultExportStatus = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
	}
	
	return resultExportStatus;
}

function clearTextArea()
{
	$('#apimessage').val("");
}