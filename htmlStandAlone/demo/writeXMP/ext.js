var csInterface = null;
var selectedItemInfoList = null;

function onLoaded() {
	csInterface = new CSInterface();
	loadJSX();
    
	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);
	csInterface.addEventListener("com.adobe.host.notification.ReadXMPFromDiskStatus", getReadXMPFromDiskStatus);
	csInterface.addEventListener("com.adobe.host.notification.WriteXMPToDiskStatus", getWriteXMPToDiskStatus);
	
	$("#content").accordion({collapsible: true});
	
    $("#import").change(function(evt)
	{
		var files = evt.target.files;
		var reader = new FileReader();
		
		reader.onload = function()
		{
			$("#xmpcontent").val("");
			$("#xmpcontent").val(this.result);
		};
		if (files.length != 0)
		{
			reader.readAsText(files[0]);
		}
	});
}

function writeXMPToDisk()
{
	var arrayFile = getAssetPathAndType();
	var path = arrayFile.sPath;
	var type = arrayFile.sType;
	
	if (path != "")
	{
		var event = new CSEvent("com.adobe.browser.event.WriteXMPToDisk", "APPLICATION");
		var taskID = newGuid();
		var msgID = newGuid();
		var assetID = newGuid();
		var xmpContent = $('#xmpcontent').val();
		
		var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/><assetMediaInfoList><assetMediaInfo><filePath path="' + path + '"/><assetID ID="' + assetID + '"/><type>' + type + '</type><changePath path=""/><fileMetadata><xmp><![CDATA[' + xmpContent + ']]></xmp></fileMetadata></assetMediaInfo></assetMediaInfoList></browserMessage>';
		console.log("[Send message to browser to write XMP to disk]: %s", messageXML);
		event.data = messageXML;
		csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
	}
	else
	{
		$('#result').html("");
	}
}

function getWriteXMPToDiskStatus(event)
{
	var xmlContent = event.data;
	console.log("[Response to write XMP to disk status event], received data is: %s", xmlContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmlContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmlContent);
	if (xmlDoc != null)
	{
		var resultWriteXMPStatus = parseWriteXMPStatus(xmlDoc);
		console.log(resultWriteXMPStatus);
		$('#result').html(resultWriteXMPStatus);
	}
	else
	{
		console.log("[Can not parse xml document]");
		$('#result').html("");
	}
}

function parseWriteXMPStatus(xmlDoc)
{
	var resultWriteXMPStatus = "";
	if (xmlDoc != null)
	{
		resultWriteXMPStatus = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
	}
	
	return resultWriteXMPStatus;
}

function getAssetPathAndType()
{
	var path = "";
	var type = "";
	var filePath = $('#filepath').val();
	
	if (filePath != "")
	{
		path = filePath;
		type = "masterClip";
	}
	else
	{
		if (selectedItemInfoList != null)
		{
			if (selectedItemInfoList.length>1)
			{
				$('#result').html('<font color=red>Only one asset should be selected.</font>');
			}
			else
			{
				path = selectedItemInfoList[0].getElementsByTagName("filePath")[0].getAttribute("path");
				type = selectedItemInfoList[0].getElementsByTagName("type")[0].firstChild.nodeValue;
			}
		}
	}
	
	return {
		sPath: path,
		sType: type
	};
}

function getReadXMPFromDiskStatus(event)
{
	var xmlContent = event.data;
	console.log("[Response to read XMP from disk status event], received data is: %s", xmlContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmlContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmlContent);
	if (xmlDoc != null)
	{
		var resultReadXMPStatus = parseReadXMPStatus(xmlDoc);
		console.log(resultReadXMPStatus);
		$('#xmpcontent').val(resultReadXMPStatus);
	}
	else
	{
		console.log("[Can not parse xml document]");
		$('#xmpcontent').val("");
	}
}

function parseReadXMPStatus(xmlDoc)
{
	var resultReadXMPStatus = "";
	if (xmlDoc != null)
	{
		resultReadXMPStatus = xmlDoc.getElementsByTagName('xmp')[0].firstChild.nodeValue;
	}
	
	return resultReadXMPStatus;
}

function refreshSelectedAsset(event)
{
		var xmlContent = event.data;
		console.log("[Response to asset selected event], received data is: %s", xmlContent);
		
		var xmlDoc = createXMLDocObject(xmlContent);
		if (xmlDoc != null)
		{
			var selectedItemHTML = parseSelectedAsset(xmlDoc);
			$("#content").html(selectedItemHTML);
			$('#xmpcontent').val("");
			readXMPFromDisk();
			
			if (selectedItemInfoList.length==0)
			{
				$("#content").html("<h3>No Selection</h3>");
			}
			
			$("#content").accordion("refresh");
		}
		else
		{
			console.log("[Can not parse xml document]");
		}
		
		$("#result").html("");
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
			
			table += '<h3>' + aliasName + '</h3>';
			table += '<div><p><b>Path</b> : ' + path + '<br>';
			table += '<b>Type</b> : ' + type + '<br>';
			table += '<b>Alias Name</b> : ' + aliasName + '</p>';
			if (type == "subClip")
			{
				
				subClipInfo = selectedItemInfoList[i].getElementsByTagName('subClipInfo')[0];
				table += '<ul><li>StartTime : '+subClipInfo.getElementsByTagName('startTime')[0].firstChild.nodeValue+'</li>';
				table += '<li>EndTime : '+subClipInfo.getElementsByTagName('duration')[0].firstChild.nodeValue+'</li>'
				table += '<li>MarkerID : '+subClipInfo.getElementsByTagName('markerID')[0].firstChild.nodeValue+'</li></ul>';
			}
			table += '</div>';
		}
	}

	return table;
}

function readXMPFromDisk()
{
	var arrayFile = getAssetPathAndType();
	var path = arrayFile.sPath;
	var type = arrayFile.sType;
	
	if (path != "")
	{
		var event = new CSEvent("com.adobe.browser.event.ReadXMPFromDisk", "APPLICATION");
		var taskID = newGuid();
		var msgID = newGuid();
		
		var assetID = newGuid();
		var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/><assetMediaInfoList><assetMediaInfo><filePath path="' + path + '"/><assetID ID="' + assetID + '"/><type>' + type + '</type><fileMetadata><xmp/></fileMetadata></assetMediaInfo></assetMediaInfoList></browserMessage>';
		console.log("[Send message to browser to read XMP from disk]: %s", messageXML);
		event.data = messageXML;
		csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
	}
	else
	{
		$('#result').html("");
	}
}

function clearTextArea()
{
	$('#apimessage').val("");
}
