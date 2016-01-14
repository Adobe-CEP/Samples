var csInterface = null;
var taskID = null;
var selectedItemInfoList = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
    
    var appName = csInterface.hostEnvironment.appName;
    
    //updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    //Update the color of the panel when the theme color of the product changed.
	//csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);
	csInterface.addEventListener("com.adobe.host.notification.GetMediaPropertyInfoStatus", getMediaPropertyInfoStatus);
}

/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
    //Update the background color of the panel
    var panelBgColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBgColor);

    //Update the default text style with pp values    
    var styleId = "ppstyle";
    
    addRule(styleId, ".textStyle", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + "#" + reverseColor(panelBgColor));
    addRule(styleId, ".controlBg", "background-color:" + "#" + toHex(panelBgColor, 20));
    addRule(styleId, "button", "border-color: " + "#" + toHex(panelBgColor, -50));

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


function reverseColor(color, delta) {
    return toHex({red:Math.abs(255-color.red), green:Math.abs(255-color.green), blue:Math.abs(255-color.blue)}, delta);
}

/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = Math.round(computedValue).toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with (color) {
             hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        };
    }
    return hex;
}

function onAppThemeColorChanged(event) {
    // Should get a latest HostEnvironment object from application.
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
} 

function refreshSelectedAsset(event) {

	var xmpContent = event.data;	
	console.log("[Response to asset selected event], received data is%s:", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	//xmpContent = '<hostNotification><browserID ID="MediaCollection"/><msgID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><taskID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><selectedItemInfoList><selectedItemInfo><filePath path="D:\Workspace\testmedia\XDCAMHD250\Clip\C0001.MXF"/><aliasName>C0001</aliasName><type>masterClip</type></selectedItemInfo></selectedItemInfoList></hostNotification>';
	//xmpContent = '<hostNotification><browserID ID="MediaCollection"/><msgID ID="8d2b5bf8-f6be-495e-aced-9a5838be3909"/><taskID ID="8d2b5bf8-f6be-495e-aced-9a5838be3909"/><selectedItemInfoList><selectedItemInfo><filePath path="D:\\Workspace\\testmedia\\XDCAMHD250\\Clip\\C0001.MXF"/><aliasName> C0001_01</aliasName><type>subClip</type><subClipInfo><startTime>00;00;26;20</startTime><duration>00;00;11;18</duration><markerID>bd648833-551d-466d-83e6-16645c37f482</markerID></subClipInfo></selectedItemInfo></selectedItemInfoList></hostNotification>';
	//xmpContent = '<?xml version="1.0" encoding="UTF-16" standalone="no" ?><hostNotification><browserID ID="MediaCollection"/><msgID ID="a0a252a9-05d4-4170-87f0-5a37eefa52fb"/><taskID ID="a0a252a9-05d4-4170-87f0-5a37eefa52fb"/><selectedItemInfoList><selectedItemInfo><filePath path="C:\\Users\\dell09\\Documents\\Adobe\\Prelude\\2.0\\Rough Cuts\\Untitled Rough Cut_29.arcut"/><aliasName>Untitled Rough Cut_29</aliasName><type>roughCut</type></selectedItemInfo></selectedItemInfoList></hostNotification>';
	var xmlDoc = getXMLDoc(xmpContent);
	if (xmlDoc != null)
	{
		parseSelectedAsset(xmlDoc);

		if (selectedItemInfoList.length>1)
		{
			$('#properties').html("");
			taskID = null;
		}
		else if (selectedItemInfoList.length == 0)
		{
			$('#properties').html("");
			taskID = null;
		}
		else
		{
			getMediaPropertyInfo();
		}
	}
	else
	{
		console.log("[can not parse ]");
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
	}

	return table;
}

function getMediaPropertyInfo()
{
	var table = '';
	if (selectedItemInfoList != null)
	{
		if (selectedItemInfoList.length == 1)
		{
			var event = new CSEvent("com.adobe.browser.event.GetMediaPropertyInfo", "APPLICATION");
	
			taskID = newGuid();
			var messageID = newGuid();
			var assetID = newGuid();
			mediaPath = selectedItemInfoList[0].getElementsByTagName('filePath')[0].attributes['path'].value;
			$("#properties").html("Trying to get media info of<br /> "+mediaPath+"<br />Plese Wait. ");

			var messageXML = '<browserMessage><browserID ID="EABROWSER"/><taskID ID="'+taskID+'"/><msgID ID="'+messageID+'"/><mediaPropertyInfo><assetID ID="'+assetID+'"/><filePath path="'+mediaPath+'"/></mediaPropertyInfo></browserMessage>';
			console.log("[Send message to browser to get media info]:%s", messageXML);
			event.data = messageXML;
			csInterface.dispatchEvent(event);
			$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
		}
	}
}

function getMediaPropertyInfoStatus(event)
{
	var xmpContent = event.data;	
	//xmpContent = '<hostNotification><browserID ID="MediaCollection"/><msgID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><taskID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><selectedItemInfoList><selectedItemInfo><filePath path="D:\Workspace\testmedia\XDCAMHD250\Clip\C0001.MXF"/><aliasName>C0001</aliasName><type>masterClip</type></selectedItemInfo></selectedItemInfoList></hostNotification>';

	var xmlDoc = getXMLDoc(xmpContent);
	console.log("[Response to transfer status changed event], received data is%s:", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	if (xmlDoc != null)
	{
		var resultHTML = parsePropertiesFromReponse(xmlDoc);

		if (resultHTML != "")
		{
			$("#properties").html(resultHTML);
		}
	}
	else
	{

	}
}

function parsePropertiesFromReponse(xmlDoc)
{
	
	var result = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
	var ret_taskID = xmlDoc.getElementsByTagName('taskID')[0].attributes['ID'].value;

	if (ret_taskID == taskID)
	{
		if (result == 'ERROR')
		{
			return "Failed to get media info.";
		}
		else
		{
			var mediaPropertyInfo = xmlDoc.getElementsByTagName('mediaPropertyInfo')[0];
			filePath = mediaPropertyInfo.getElementsByTagName('filePath')[0].attributes['path'].value;

			frameRate = "None";
			if (mediaPropertyInfo.getElementsByTagName('frameRate').length != 0)
			{
				frameRate = mediaPropertyInfo.getElementsByTagName('frameRate')[0].firstChild.nodeValue;
			}
			
			startTime = mediaPropertyInfo.getElementsByTagName('startTime')[0].firstChild.nodeValue;
			duration = mediaPropertyInfo.getElementsByTagName('duration')[0].firstChild.nodeValue;

			resultHTML = '<ul><li><b>FilePath</b>&nbsp;:&nbsp;'+filePath+'</li><li><b>frameRate</b>&nbsp;:&nbsp;'+frameRate+'</li><li><b>startTime</b>&nbsp;:&nbsp;'+startTime+'</li><li><b>duration</b>&nbsp;:&nbsp;'+duration+'</li></ul>';
			return resultHTML;
		}
	}
	else
	{
		return "";
	}
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
