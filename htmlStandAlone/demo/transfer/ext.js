var transferEnabled = true;
var selectedItemInfoList = null;
var taskID = null;
var csInterface = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
    
    var appName = csInterface.hostEnvironment.appName;
    
    //updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    //Update the color of the panel when the theme color of the product changed.
	//csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);
	csInterface.addEventListener("com.adobe.host.notification.TransferProgress", refreshProgressBar);
	csInterface.addEventListener("com.adobe.host.notification.TransferStatus", refreshTransferStatus);
	
	$( "#tabs" ).tabs({
		collapsible: true
	});

	initTransfer();
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

	if (transferEnabled)
	{	
		var xmpContent = event.data;	
		console.log("[Response to asset selected event], received data is%s:", xmpContent);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
		
		var xmlDoc = getXMLDoc(xmpContent);
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
		
		$("#result" ).text("");
		$("#progressbar").progressbar("value", 0);
		$("#progressbar").hide();
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
				table += '<li>MarkerID : '+subClipInfo.getElementsByTagName('markerID')[0].firstChild.nodeValue+'</li></ul>';				
			}
			table += '</div>'
		}
	}

	return table;
}

function TransferFilesToDst()
{
	$("#result" ).text("");

	if (transferEnabled == true)
	{
		if (selectedItemInfoList != null && selectedItemInfoList.length>0)
		{
			$("#startTransfer").attr("disabled", "disabled");
			transferEnabled = false;

			if ($("#transferType").val() == "local")
			{
				TransferToLocal();
			}
			else if ($("#transferType").val() == "ftp")
			{
				TransferToFTP();
			}
			else
			{
				// do nothing
			}
		}
		else
		{
			$("#content").toggle( "highlight" );
			$("#content").toggle( "highlight" );		
		}
	}

}

function TransferToLocal()
{
	var dst = $("#dest").val();
	if (dst != "")
	{		
		var transferItemList = '';

		for (var i=0; i<selectedItemInfoList.length; i++)
		{		
			transferItemList += '<transferItem src="'+selectedItemInfoList[i].getElementsByTagName('filePath')[0].attributes['path'].value+'" dstParent="'+dst+'"/>';
		}

		var event = new CSEvent("com.adobe.browser.event.TransferRequest", "APPLICATION");
		taskID = newGuid();
		var msgID = newGuid();

		var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'+taskID+'"/><msgID ID="'+msgID+'"/><transferItemList>'+transferItemList+'</transferItemList><transferOption>Overwrite</transferOption></browserMessage>';
		console.log("[Send message to browser to start transfer]:%s", messageXML);
		event.data = messageXML;
		csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
		$("#progressbar").show();
		$("#progressbar" ).progressbar("value", 0);
	}
	else
	{
		transferEnabled = true;
		$("#startTransfer").removeAttr("disabled");
		$("#dest").toggle( "highlight" );
		$("#dest").toggle( "highlight" );
		console.log("[Empty distination is not allowed]");
	}
}

function TransferToFTP()
{
	var serverDest = $("#serverDest").val();
	var serverName = $("#serverName").val();
	var port = $("#port").val();
	var userName = $("#userName").val();
	var password = $("#password").val();
	var error = false;
	
	if (serverDest == "")
	{
		$("#serverDest").toggle( "highlight" );
		$("#serverDest").toggle( "highlight" );
		error = true;
	}

	if (serverName == "")
	{
		$("#serverName").toggle( "highlight" );
		$("#serverName").toggle( "highlight" );
		error = true;
	}
	
	if (port == "")
	{
		$("#port").toggle( "highlight" );
		$("#port").toggle( "highlight" );
		error = true;
	}

	if (userName == "")
	{
		$("#userName").toggle( "highlight" );
		$("#userName").toggle( "highlight" );
		error = true;
	}

	if (password == "")
	{
		$("#password").toggle( "highlight" );
		$("#password").toggle( "highlight" );
		error = true;
	}

	if (error == true)
	{
		$("#startTransfer").removeAttr("disabled");
		transferEnabled = true;
		return;
	}

	$("#progressbar").show();
	$("#progressbar" ).progressbar("value", 0);

	var transferItemList = '';

	for (var i=0; i<selectedItemInfoList.length; i++)
	{		
		transferItemList += '<transferItem src="'+selectedItemInfoList[i].getElementsByTagName('filePath')[0].attributes['path'].value+'" dstParent="'+serverDest+'"/>';
	}

	var event = new CSEvent("com.adobe.browser.event.TransferRequest", "APPLICATION");
	taskID = newGuid();
	var msgID = newGuid();

	var serverInfo = '<transferType>ftp|local</transferType><ftpSetting ftpServerName="'+serverName+'" ftpPort="'+port+'" ftpUserName="'+userName+'" ftpPassword="'+password+'"/>';

	var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'+taskID+'"/><msgID ID="'+msgID+'"/><transferItemList>'+transferItemList+'</transferItemList><transferOption>Overwrite</transferOption>'+serverInfo+'</browserMessage>';
	console.log("[Send message to browser to start transfer]:%s", messageXML);
	event.data = messageXML;
	csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function CancelTransferFiles()
{
	if (taskID != null)
	{
		var event = new CSEvent("com.adobe.browser.event.TransferCancel", "APPLICATION");
		var msgID = newGuid();

		var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'+taskID+'"/><msgID ID="'+msgID+'"/></browserMessage>';
		event.data = messageXML;
		console.log("[Send message to browser to cancel transfer]:%s", messageXML);
		csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
	}
	
	taskID = null;
	transferEnabled = true;
	$("#startTransfer").removeAttr("disabled");
}

function refreshProgressBar(event)
{
	var xmpContent = event.data;	
	//xmpContent = '<hostNotification><browserID ID="EABROWSER_SOURCE"/><msgID ID="9063fb99-169d-4053-a889-bc0733f1eabc"/><taskID ID="672be504-39b2-3bd8-5156-44c826ce2288"/><percentage>10</percentage></hostNotification>';
	
	var xmlDoc = getXMLDoc(xmpContent);
	console.log("[Response to transfer progress changed event], received data is%s:", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	if (xmlDoc != null)
	{
		var percent = parseTransfterProgress(xmlDoc);
		$("#progressbar" ).progressbar("value", parseInt(percent));
	}
	else
	{
	}
}

function refreshTransferStatus(event)
{
	var xmpContent = event.data;	
	//xmpContent = '<hostNotification><browserID ID="MediaCollection"/><msgID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><taskID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><selectedItemInfoList><selectedItemInfo><filePath path="D:\Workspace\testmedia\XDCAMHD250\Clip\C0001.MXF"/><aliasName>C0001</aliasName><type>masterClip</type></selectedItemInfo></selectedItemInfoList></hostNotification>';

	var xmlDoc = getXMLDoc(xmpContent);
	console.log("[Response to transfer status changed event], received data is%s:", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	if (xmlDoc != null)
	{
		var resultList = parseTransferStatus(xmlDoc);
		$("#result" ).text(resultList["ERROR"]+" failed, "+resultList["OK"]+" succeeded.");
		transferEnabled = true;
	}
	else
	{

	}
	taskID = null;
	$("#startTransfer").removeAttr("disabled");	
	$("#progressbar" ).progressbar("value",100);
}


function parseTransferStatus(xmlDoc)
{
	var resultList = {'OK':0, 'ERROR':0};
	if (xmlDoc != null)
	{
		var actionResultList = xmlDoc.getElementsByTagName('actionResult');

		for (var i=0; i<actionResultList.length; i++)
		{
			result = actionResultList[i].getElementsByTagName('result')[0].firstChild.nodeValue;
			
			if (result != null)
			{
				resultList[result] += 1;
			}	
		}
	}

	return resultList;
}

function parseTransfterProgress(xmlDoc)
{
	var percent = 0;

	if (xmlDoc != null)
	{
		 percentList = xmlDoc.getElementsByTagName('percentage');

		 if (percentList.length>0)
		 {
			 percent = percentList[0].firstChild.nodeValue;
		 }
	}

	return percent;
}

function initTransfer()
{
	$( "#content" ).accordion({collapsible: true});
	$( "#destination" ).tabs({
		activate: function(event, ui)
		{
			if(ui.newPanel.selector == "#local")
		    {
		        $("#transferType").val("local");
		    }   
		    else if(ui.newPanel.selector == "#ftp")
		    {
		        $("#transferType").val("ftp");    
		    }
		    else
		    {
		        // do nothing		  
		    };
		}
	});

	$("#progressbar").progressbar({
		value: false,
		change: function() {
			console.log("[Progress change]");
			$(".progress-label").text($("#progressbar").progressbar( "value" ) + "%" );
		}
	});

	$("#progressbar").hide();
	$("#progressbar").progressbar("value", 0);
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
