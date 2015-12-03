var csInterface = null;
var taskID = null;
var selectedItemInfoList = null;
var concatEnabled = true;
var input_focus_id = "sourcePath1";

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
    
    var appName = csInterface.hostEnvironment.appName;
    initConcat();
    
    //updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    //Update the color of the panel when the theme color of the product changed.
	//csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	csInterface.addEventListener("com.adobe.host.notification.SelectedAssetInfo", refreshSelectedAsset);    
	csInterface.addEventListener("com.adobe.host.notification.ConcatenationProgress", refreshProgressBar);
	csInterface.addEventListener("com.adobe.host.notification.ConcatenationStatus", refreshConcatStatus);
    
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

    if (concatEnabled)
    {
        $("#triggerSaveAssetResult").html("");
        var xmpContent = event.data;	
        console.log("[Response to asset selected event], received data is%s:", xmpContent);
        //xmpContent = '<hostNotification><browserID ID="MediaCollection"/><msgID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><taskID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><selectedItemInfoList><selectedItemInfo><filePath path="D:\Workspace\testmedia\XDCAMHD250\Clip\C0001.MXF"/><aliasName>C0001</aliasName><type>masterClip</type></selectedItemInfo></selectedItemInfoList></hostNotification>';
        //xmpContent = '<hostNotification><browserID ID="MediaCollection"/><msgID ID="8d2b5bf8-f6be-495e-aced-9a5838be3909"/><taskID ID="8d2b5bf8-f6be-495e-aced-9a5838be3909"/><selectedItemInfoList><selectedItemInfo><filePath path="D:\\Workspace\\testmedia\\XDCAMHD250\\Clip\\C0001.MXF"/><aliasName> C0001_01</aliasName><type>subClip</type><subClipInfo><startTime>00;00;26;20</startTime><duration>00;00;11;18</duration><markerID>bd648833-551d-466d-83e6-16645c37f482</markerID></subClipInfo></selectedItemInfo></selectedItemInfoList></hostNotification>';
        //xmpContent = '<?xml version="1.0" encoding="UTF-16" standalone="no" ?><hostNotification><browserID ID="MediaCollection"/><msgID ID="a0a252a9-05d4-4170-87f0-5a37eefa52fb"/><taskID ID="a0a252a9-05d4-4170-87f0-5a37eefa52fb"/><selectedItemInfoList><selectedItemInfo><filePath path="C:\\Users\\dell09\\Documents\\Adobe\\Prelude\\2.0\\Rough Cuts\\Untitled Rough Cut_29.arcut"/><aliasName>Untitled Rough Cut_29</aliasName><type>roughCut</type></selectedItemInfo></selectedItemInfoList></hostNotification>';
        var xmlDoc = getXMLDoc(xmpContent);
        if (xmlDoc != null)
        {
            parseSelectedAsset(xmlDoc);
    
            if (selectedItemInfoList.length != 1)
            {
                taskID = null;
            }
            else
            {
                var mediaPath = selectedItemInfoList[0].getElementsByTagName('filePath')[0].attributes['path'].value;
                
                if (input_focus_id != "")
                {
                    $("#"+input_focus_id).val(mediaPath);
                }               
            }
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
	if (xmlDoc != null)
	{
		selectedItemInfoList = xmlDoc.getElementsByTagName('selectedItemInfo');
	}
}

function concatToDst()
{
	$("#result" ).text("");

	if (concatEnabled == true)
	{
        $("#progressbar").progressbar("value", 0);
        var sourcePath1 = $("#sourcePath1").val();
        var startTime1 = $("#startTime1").val();
        var duration1 = $("#duration1").val();
        var frameRate1 = $("#frameRate1").val();
        var sourcePath2 = $("#sourcePath2").val();
        var startTime2 = $("#startTime2").val();
        var duration2 = $("#duration2").val();
        var frameRate2 = $("#frameRate2").val();
        var outputDirectory = $("#outputDirectory").val();
        var presetPath = $("#presetPath").val();
        var outputFilename = $("#outputFilename").val();
		var outputXMP = $('input[type="radio"][name="outputXMP"]:checked').val();
        console.log("[Preset path]:%s", presetPath);
        var error = false;
        $("#startConcat").attr("disabled", "disabled");
        concatEnabled = false;
        
        if (sourcePath1 == "")
        {
            $("#sourcePath1").toggle( "highlight" );
            $("#sourcePath1").toggle( "highlight" );
            error = true;
        }
    
        if (startTime1 == "")
        {
            $("#startTime1").toggle( "highlight" );
            $("#startTime1").toggle( "highlight" );
            error = true;
        }
        
        if (duration1 == "")
        {
            $("#duration1").toggle( "highlight" );
            $("#duration1").toggle( "highlight" );
            error = true;
        }
    
        if (frameRate1 == "")
        {
            $("#frameRate1").toggle( "highlight" );
            $("#frameRate1").toggle( "highlight" );
            error = true;
        }
            
        if (sourcePath2 == "")
        {
            $("#sourcePath2").toggle( "highlight" );
            $("#sourcePath2").toggle( "highlight" );
            error = true;
        }
    
        if (startTime2 == "")
        {
            $("#startTime2").toggle( "highlight" );
            $("#startTime2").toggle( "highlight" );
            error = true;
        }
        
        if (duration2 == "")
        {
            $("#duration2").toggle( "highlight" );
            $("#duration2").toggle( "highlight" );
            error = true;
        }
    
        if (frameRate2 == "")
        {
            $("#frameRate2").toggle( "highlight" );
            $("#frameRate2").toggle( "highlight" );
            error = true;
        }
        
        if (error == true)
        {
            $("#startConcat").attr("disabled", "disabled");
            $("#progressbar" ).hide();
            concatEnabled = true;
            return;
        }
        
        $("#progressbar" ).show();
        
        var event = new CSEvent("com.adobe.browser.event.ConcatenationRequest", "APPLICATION");
        taskID = newGuid();
        var msgID = newGuid();  
        
        var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'+taskID+'"/><msgID ID="'+msgID+'"/><presetPath>'+presetPath+'</presetPath><outputDirectory path="'+outputDirectory+'"/><outputFileName>'+outputFilename+'</outputFileName><outputXMP>' + outputXMP + '</outputXMP><concatenationItemList><concatenationItem order="2"><filePath path="'+sourcePath2+'"/><frameRate>'+frameRate2+'</frameRate><startTime>'+startTime2+'</startTime><duration>'+duration2+'</duration></concatenationItem><concatenationItem order="1"><filePath path="'+sourcePath1+'"/><frameRate>'+frameRate1+'</frameRate><startTime>'+startTime1+'</startTime><duration>'+duration1+'</duration></concatenationItem></concatenationItemList></browserMessage>';
        
        console.log("[Send message to browser to start concat]:%s", messageXML);
        event.data = messageXML;
        csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
	}
    else
    {
        // do something such as providing a prompt
    }

}

function cancelConcat()
{
	if (taskID != null)
	{
		var event = new CSEvent("com.adobe.browser.event.ConcatenationCancel", "APPLICATION");
		var msgID = newGuid();

		var messageXML = '<browserMessage><browserID ID="EABROWSER_SOURCE"/><taskID ID="'+taskID+'"/><msgID ID="'+msgID+'"/></browserMessage>';
		event.data = messageXML;

		console.log("[Send message to browser to cancel concat]:%s", messageXML);
		csInterface.dispatchEvent(event);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
	}
	
	taskID = null;
	concatEnabled = true;
	$("#startConcat").removeAttr("disabled");
}

function refreshProgressBar(event)
{
	var xmpContent = event.data;
	//xmpContent = '<hostNotification><browserID ID="EABROWSER_SOURCE"/><msgID ID="9063fb99-169d-4053-a889-bc0733f1eabc"/><taskID ID="672be504-39b2-3bd8-5156-44c826ce2288"/><percentage>10</percentage></hostNotification>';
	
	var xmlDoc = getXMLDoc(xmpContent);
	console.log("[Response to concat progress changed event], received data is%s:", xmpContent);
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

function refreshConcatStatus(event)
{
	var xmpContent = event.data;	
	//xmpContent = '<hostNotification><browserID ID="MediaCollection"/><msgID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><taskID ID="879a2379-fdbc-4107-86fe-5abbb4c62940"/><selectedItemInfoList><selectedItemInfo><filePath path="D:\Workspace\testmedia\XDCAMHD250\Clip\C0001.MXF"/><aliasName>C0001</aliasName><type>masterClip</type></selectedItemInfo></selectedItemInfoList></hostNotification>';

	var xmlDoc = getXMLDoc(xmpContent);
	console.log("[Response to concat status changed event], received data is%s:", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	if (xmlDoc != null)
	{
		var result = parseConcatStatus(xmlDoc);
		$("#result" ).text(result);
		concatEnabled = true;
	}
	else
	{

	}
	taskID = null;
	$("#startConcat").removeAttr("disabled");	
	$("#progressbar" ).progressbar("value",100);
}


function parseConcatStatus(xmlDoc)
{
    var result = "";
    
	if (xmlDoc != null)
	{
        result = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue;
        var ret_taskID = xmlDoc.getElementsByTagName('taskID')[0].attributes['ID'].value;
        
        if (ret_taskID == taskID)
        {                        
            if (result != null)
            {
                return result;
            }
             else
            {
                result = 'Error';
            }
        }

	}

	return result;
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

function initConcat()
{
	$("#progressbar").progressbar({
		value: false,
		change: function() {
			console.log("[Progress change]");
			$(".progress-label").text($("#progressbar").progressbar( "value" ) + "%" );
		}
	});
    
    $("#sourcePath1").focusin(function(){        
        input_focus_id = 'sourcePath1';
    });
        
    $("#sourcePath2").focusin(function(){        
        input_focus_id = 'sourcePath2';
    });   
    
    $("input[type=text]").focusin(function(){        
        if (this.id != 'sourcePath1' && this.id != 'sourcePath2')
        {
            input_focus_id = '';
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
