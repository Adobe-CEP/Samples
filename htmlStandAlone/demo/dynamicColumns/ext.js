var selectedItemInfoList = null;
var csInterface = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
    
    var appName = csInterface.hostEnvironment.appName;
    
	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);
	csInterface.addEventListener("com.adobe.host.notification.InsertDynamicColumnsStatus", refreshReceivedMessage);
	csInterface.addEventListener("com.adobe.host.notification.DeleteDynamicColumnsStatus", refreshReceivedMessage);
	csInterface.addEventListener("com.adobe.host.notification.UpdateDynamicColumnFieldsStatus", refreshReceivedMessage);
}

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
    
    if (stylesheet) {
        stylesheet = stylesheet.sheet;
           if( stylesheet.addRule ){
               stylesheet.addRule(selector, rule);
           } else if( stylesheet.insertRule ){
               stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
           }
    }
}

function refreshReceivedMessage(event)
{
	var xmpContent = event.data;
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = createXMLDocObject(xmpContent);
	if (xmlDoc != null)
	{
		resultCode = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
		var o = document.getElementById("result");
		o.value = resultCode;
	}
	else
	{
	}
}

var formatXml = this.formatXml = function (xml) {
	var reg = /(>)(<)(\/*)/g;
	var wsexp = / *(.*) +\n/g;
	var contexp = /(<.+>)(.+\n)/g;
	xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
	var pad = 0;
	var formatted = '';
	var lines = xml.split('\n');
	var indent = 0;
	var lastType = 'other';
	// 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions 
	var transitions = {
		'single->single': 0,
		'single->closing': -1,
		'single->opening': 0,
		'single->other': 0,
		'closing->single': 0,
		'closing->closing': -1,
		'closing->opening': 0,
		'closing->other': 0,
		'opening->single': 1,
		'opening->closing': 0,
		'opening->opening': 1,
		'opening->other': 1,
		'other->single': 0,
		'other->closing': -1,
		'other->opening': 0,
		'other->other': 0
	};

	for (var i = 0; i < lines.length; i++) {
		var ln = lines[i];
		var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
		var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
		var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
		var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
		var fromTo = lastType + '->' + type;
		lastType = type;
		var padding = '';

		indent += transitions[fromTo];
		for (var j = 0; j < indent; j++) {
			padding += '\t';
		}
		if (fromTo == 'opening->closing')
			formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
		else
			formatted += padding + ln + '\n';
	}

	return {str:formatted, lines:lines.length};
};

function refreshSelectedAsset(event) 
{
	var xmpContent = event.data;	
	console.log("[Response to asset selected event], received data is%s:", xmpContent);
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

		$( "#content" ).accordion( "refresh" );
	}
	else
	{
		console.log("[can not parse ]");
	}
}

function parseSelectedAsset(xmlDoc)
{
	var table = '';
	var type = '';
	var aliasName = '';
	var path = '';
	var selectedAssetID = '';

	if (xmlDoc != null)
	{
		selectedItemInfoList = xmlDoc.getElementsByTagName('selectedItemInfo');

		var table = '';
		for (var i=0; i<selectedItemInfoList.length; i++)
		{
			aliasName = selectedItemInfoList[i].getElementsByTagName('aliasName')[0].firstChild.nodeValue;
			selectedAssetID = selectedItemInfoList[i].getElementsByTagName('assetID')[0].attributes['ID'].value;

			table += '<h3>'+aliasName+'</h3>';
			table += '<div>'
			table += '<b>assetID</b> : '+selectedAssetID+'<br />';
			table += '</div>'
		}
	}

	return table;
}

var columnNameIDs = {
	col_A:"B4DF7D80-76A8-43B7-9377-345A80B881E4",
	col_B:"1B93CE78-1069-4638-829A-9048E8FDD1E1",
	col_C:"1B93CE78-1069-4638-829A-9048E8FDD1E2",
}

function InsertColumns(columnName)
{
	var event = new CSEvent("com.adobe.browser.event.InsertDynamicColumns", "APPLICATION");
	taskID = newGuid();
	var msgID = newGuid();
	
	var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'
		+taskID
		+'"/><msgID ID="'
		+msgID
		+'"/>'
		+'<newDynamicColumns>'
			+'<dynamicColumn \n'
				+'ID="'+columnNameIDs[columnName]+'"\n'
				+'name="'+columnName+'"\n'
				+'previousColumnName="Name">\n'
				+'</dynamicColumn>\n'
		+'</newDynamicColumns>'
		+'</browserMessage>';
	console.log("[Send message to browser to start InsertDynamicColumns]:%s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function DeleteColumns(columnName)
{
	var event = new CSEvent("com.adobe.browser.event.DeleteDynamicColumns", "APPLICATION");
	taskID = newGuid();
	var msgID = newGuid();

	var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'
		+taskID
		+'"/><msgID ID="'
		+msgID
		+'"/>'
		+'<deleteDynamicColumns>'
			+'<dynamicColumn ID="'+columnNameIDs[columnName]+'"></dynamicColumn>'
		+'</deleteDynamicColumns>'
		+'</browserMessage>';
	console.log("[Send message to browser to start DeleteDynamicColumns]:%s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function UpdateFieldValues(columnName)
{
    var value = $("#fieldValue").val();
	if (selectedItemInfoList == null || selectedItemInfoList.length == 0 || value == "")
		return;

	var event = new CSEvent("com.adobe.browser.event.UpdateDynamicColumnFields", "APPLICATION");
	taskID = newGuid();
	var msgID = newGuid();

	var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'
		+taskID
		+'"/><msgID ID="'
		+msgID
		+'"/>'
		+'<dynamicColumnFieldValues>';

	for (var i=0; i<selectedItemInfoList.length; i++)
	{
		selectedAssetID = selectedItemInfoList[i].getElementsByTagName('assetID')[0].attributes['ID'].value;
		messageXML += '<dynamicColumnFieldValue fieldValue="'+value+'">'
				+'<dynamicColumn ID="'+columnNameIDs[columnName]+'"></dynamicColumn>'
				+'<assetID ID="'+selectedAssetID+'"></assetID>'
				+'</dynamicColumnFieldValue>';
	}
	
	messageXML += '</dynamicColumnFieldValues></browserMessage>';
	console.log("[Send message to browser to start UpdateDynamicColumnFields]:%s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
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
