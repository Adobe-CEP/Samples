var csInterface = null;
var selectedItemInfoList = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
    
 	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);
}

function refreshSelectedAsset(event) {

	var changeEnable = true;
	if (changeEnable)
	{	
		var xmpContent = event.data;	
		console.log("[Response to asset selected event], received data is%s:", xmpContent);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
		
		var xmlDoc = getXMLDoc(xmpContent);
		if (xmlDoc != null)
		{
			var selectedItemHTML = parseSelectedAsset(xmlDoc);
				
			if (selectedItemInfoList.length>0)
			{
				$('#content').html(selectedItemHTML);
			}
			else
			{
				$('#content').html("<h3>No Selection</h3>");
			}

			$( "#content" ).accordion( "refresh" );
		}
		else
		{
			console.log("[can not parse ]");
		}
	}
	else 
	{
		console.log("[Response to asset selected event is disabled]");
	}
}

function getXMLDoc(xmlText)
{
	var xmlDoc = null;

	try //Internet Explorer
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(xmlText);
	}
	catch(e)
	{
		try //Firefox, Mozilla, Opera, etc.
		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(xmlText,"text/xml");
		}
		catch(e) {
			console.log("[Error occurred when create a xml object for a string]");
		}
	}

	return xmlDoc;
}

function parseSelectedAsset(xmlDoc)
{
	var table = '';
	var type = '';
	var aliasName = '';
	var path = '';

	if (xmlDoc != null)
	{
		selectedItemInfoList = xmlDoc.getElementsByTagName('selectedItemInfo');

		var table = '';
		for (var i=0; i<selectedItemInfoList.length; i++)
		{
			
			type = selectedItemInfoList[i].getElementsByTagName('type')[0].firstChild.nodeValue;
			aliasName = selectedItemInfoList[i].getElementsByTagName('aliasName')[0].firstChild.nodeValue;
			path = selectedItemInfoList[i].getElementsByTagName('filePath')[0].attributes['path'].value;

			table += '<h3>'+aliasName+'</h3>';
			table += '<div>'
			table += '<p><b>Path</b> : '+path+'<br />';
			table += '<b>Type</b> : '+type+'<br />';
			table += '<b>Alias Name</b> : '+aliasName+'</p>';
			if (type == "subClip")
			{
				
				subClipInfo = selectedItemInfoList[i].getElementsByTagName('subClipInfo')[0];
				table += '<ul><li>StartTime : '+subClipInfo.getElementsByTagName('startTime')[0].firstChild.nodeValue+'</li>';
				table += '<li>EndTime : '+subClipInfo.getElementsByTagName('duration')[0].firstChild.nodeValue+'</li>'
				table += '<li>FrameRate : '+subClipInfo.getElementsByTagName('frameRate')[0].firstChild.nodeValue+'</li>'
				table += '<li>MarkerID : '+subClipInfo.getElementsByTagName('markerID')[0].firstChild.nodeValue+'</li></ul>';				
			}
			table += '</div>'
		}
	}

	return table;
}

function clearTextArea()
{
	$('#apimessage').val("");
}

/**
 * Load JSX file into the scripting context of the product. All the jsx files in 
 * folder [ExtensionRoot]/jsx will be loaded. 
 */
function loadJSX() {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$._ext.evalFiles("' + extensionRoot + '")');
}

function evalScript(script, callback) {
    new CSInterface().evalScript(script, callback);
}

function newGuid()
{
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;    
}

function deleteSelectedAsset() {
	var path = selectedItemInfoList[0].getElementsByTagName("filePath")[0].getAttribute("path");
	path = path.replace(/\\/g, "\\\\");
	evalScript('$._ext_PPRO.deleteAsset("' + path + '")');
}
