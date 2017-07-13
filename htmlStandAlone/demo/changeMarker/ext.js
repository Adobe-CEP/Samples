var csInterface = null;
var markerList = null;
var latestMarkerID = null;
var cuePointParamMap = null;
var customCuePointKey = 'customKey';

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
    
    var appName = csInterface.hostEnvironment.appName;
    
    //updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    //Update the color of the panel when the theme color of the product changed.
	//csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
	csInterface.addEventListener("com.adobe.host.notification.MarkerSelectionChanged", refreshMarkerList);
	csInterface.addEventListener("com.adobe.host.notification.MarkerChanged", refreshMarkerList);
	csInterface.addEventListener("com.adobe.host.notification.MarkerAdded", refreshMarkerList);
	csInterface.addEventListener("com.adobe.host.notification.MarkerDeleted", markerDeleted);
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

function markerDeleted(event) {
	var xmlContent = event.data;
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmlContent + "\n\n");
	
	$('#markerList').html("<h3>No Selection</h3>");
}

function refreshMarkerList(event) {

	var changeEnable = true;
	if (changeEnable)
	{	
		var xmpContent = event.data;	
		console.log("[Response to marker selected event], received data is%s:", xmpContent);
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
		
		var xmlDoc = getXMLDoc(xmpContent);
		if (xmlDoc != null)
		{
			var selectedItemHTML = parseSelectedMarker(xmlDoc);
				
			if (markerList.length>0)
			{
				$('#markerList').html(selectedItemHTML);
			}
			else
			{
				$('#markerList').html("<h3>No Selection</h3>");
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

function parseSelectedMarker(xmlDoc)
{
	var markerListHTML = '<ol>';
	var path = '';
	var comment = '';
	var inPoint = '';
	var frameRate = '';
	var duration = '';
	var typeClass = '';
	var name = '';

	if (xmlDoc != null)
	{
		markerList = xmlDoc.getElementsByTagName('markerInfo');

		var markerHTML = '';
		for (var i=0; i<markerList.length; i++)
		{
			path = markerList[i].getElementsByTagName('ownerClipPath')[0].textContent;
			comment = '';
			inPoint = '';
			frameRate = '';
			duration = '';
			typeClass = '';
			name = '';
			var marker = markerList[i].getElementsByTagName('marker');
			var serializer = new XMLSerializer();
			$("#changedMarkerContent").val(serializer.serializeToString(marker[0]));
			var propList = marker[0].getElementsByTagName('prop.pair');
			for (var j=0; j<propList.length; j++)
			{
				var key = '';
				var value = '';

				if (propList[j].getElementsByTagName('key').length > 0)
				{
					key = propList[j].getElementsByTagName('key')[0].textContent;
				}

				if (key == 'cuePointParams')
				{
					cuePointParamMap = {};
					$("#CuePointParam").val('');
					var cuePointParams = propList[j].getElementsByTagName('prop.pair');
					for (var t=0; t<cuePointParams.length; ++t)
					{
						var paramKey = '';
						if (cuePointParams[t].getElementsByTagName('key').length > 0)
						{
							paramKey = cuePointParams[t].getElementsByTagName('key')[0].textContent;
						}
						var paramValue = '';
						if (cuePointParams[t].getElementsByTagName('string').length > 0)
						{
							paramValue = cuePointParams[t].getElementsByTagName('string')[0].textContent;
						}
						if (paramKey != '')
						{
							cuePointParamMap[paramKey]= paramValue;
							if (paramKey == customCuePointKey)
							{
								$("#CuePointParam").val(paramValue);
							}
						}
					}
				}

				if (propList[j].getElementsByTagName('string').length > 0)
				{
					value = propList[j].getElementsByTagName('string')[0].textContent;
				}
				
				if (key == 'comment')
				{
					comment = value;
					$("#Comment").val(value);
				}
				else if (key == 'startTime')
				{
					inPoint = value;
					$("#InPoint").val(value);
				}
				else if (key == 'guid')
				{
					latestMarkerID = value;
				}
				else if (key == 'duration')
				{
					duration = value;
					$("#Duration").val(value);
				}
				else if (key == 'frameRate')
				{
					frameRate = value;
				}
				else if (key == 'name')
				{
					name = value;
					$("#Name").val(value);
				}
				else if (key == 'type')
				{
					$("#Type").val(value);
					if (value == 'InOut')
					{
						typeClass = 'markerColor_subclip';
					}
					else if (value == 'Comment')
					{
						typeClass = 'markerColor_comment';
					}
					else if (value == 'FLVCuePoint')
					{
						typeClass = 'markerColor_flashCuePoint';
					} 
					else if (value == 'WebLink')
					{
						typeClass = 'markerColor_webLink';
					} 
					else if (value == 'Chapter')
					{
						typeClass = 'markerColor_chapter';
					}
					else if (value == 'Speech')
					{
						typeClass = 'markerColor_speechTranscription';
					}
					else
					{
						$("#Type").val('Custom');
						typeClass = 'markerColor_customer';
					}
				}
				else
				{
					// do nothing
				}
			}

			markerHTML +=  '<li>'
			markerHTML += ' <ul>';
			markerHTML += '		<li class="markerColor '+typeClass+'"></li>';
			markerHTML += '		<li class="markerTime">';
			markerHTML += '			<ul>';
			markerHTML += '				<li>';
			markerHTML += '					<label>frameRate:'+frameRate+'</label>';
			markerHTML += '				</li>';
			markerHTML += '				<li>';
			markerHTML += '					<label>In: '+inPoint+'</label>';
			markerHTML += '				</li>';
			markerHTML += '				<li>';
			markerHTML += '					<label>Dur:'+duration+'</label>';
			markerHTML += '				</li>';
			markerHTML += '			</ul>';
			markerHTML += '		</li>';
			markerHTML += '		<li class="description">';
			markerHTML += '			<p>'+name+'</p>';
			markerHTML += '			<textarea disabled="disabled">'+encodeHTML(comment)+'</textarea>';
			markerHTML += '		</li>';					
			markerHTML += '		<li class="path">';
			markerHTML += '			<label>path:'+path+'</label>';
			markerHTML += '		</li>';
			markerHTML += '	</ul>';
			markerHTML += '</li>';		
		}

		markerListHTML += markerHTML + '</ol>';
	}

	return markerListHTML;
}

function encodeHTML(inText)
{
	var converter = document.createElement("div");
	converter.innerText = inText;
	var outEncodeHTML = converter.innerHTML;
	converter = null;
	return outEncodeHTML;
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

function addMarkerForPartParam() {
	var markerContent = "<marker><prop.list><prop.pair><key>comment</key><string>" + $("#Comment").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>startTime</key><string>" + $("#InPoint").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>duration</key><string>" + $("#Duration").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>name</key><string>" + $("#Name").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>type</key><string>" + $("#Type").val() + "</string></prop.pair>";
	if ($("#CuePointParam").val() != '')
	{
		markerContent += "<prop.pair><key>cuePointParams</key><prop.list><prop.pair><key>" + customCuePointKey + "</key><string>" + $("#CuePointParam").val() + "</string></prop.pair></prop.list></prop.pair>";
	}
	markerContent += "<prop.pair><key>guid</key><string>" + newGuid() + "</string></prop.pair></prop.list></marker>";
	evalScript('$._ext_PPRO.addMarker("' + markerContent + '")');
}

function addMarker() {
	var markerContent = $("#changedMarkerContent").val();
	markerContent = markerContent.replace(/\r/g, "");
	markerContent = markerContent.replace(/\n/g, "");
	evalScript('$._ext_PPRO.addMarker("' + markerContent + '")');
}

function updateMarkerForPartParam() {
	var markerContent = "<marker><prop.list><prop.pair><key>comment</key><string>" + $("#Comment").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>startTime</key><string>" + $("#InPoint").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>duration</key><string>" + $("#Duration").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>name</key><string>" + $("#Name").val() + "</string></prop.pair>";
	markerContent += "<prop.pair><key>type</key><string>" + $("#Type").val() + "</string></prop.pair>";
	if (($("#CuePointParam").val() != '' && cuePointParamMap[customCuePointKey] == undefined)
		|| (cuePointParamMap[customCuePointKey] != undefined && $("#CuePointParam").val() != cuePointParamMap[customCuePointKey]))
	{
		cuePointParamMap[customCuePointKey] = $("#CuePointParam").val();
		markerContent += "<prop.pair><key>cuePointParams</key><prop.list>";
		$.each(cuePointParamMap, function(key, value){
			markerContent += "<prop.pair><key>" + key + "</key><string>" + value + "</string></prop.pair>";
		});
		markerContent += "</prop.list></prop.pair>";
	}
	markerContent += "<prop.pair><key>guid</key><string>" + latestMarkerID + "</string></prop.pair></prop.list></marker>";
	evalScript('$._ext_PPRO.updateMarker("' + markerContent + '")');
}

function deleteMarkerForPartParam() {
	var markerContent = "<marker><prop.list><prop.pair><key>guid</key><string>" + latestMarkerID + "</string></prop.pair></prop.list></marker>";
	evalScript('$._ext_PPRO.deleteMarker("' + markerContent + '")');
}

function updateMarker() {
	var markerContent = $("#changedMarkerContent").val();
	markerContent = markerContent.replace(/\r/g, "");
	markerContent = markerContent.replace(/\n/g, "");
	evalScript('$._ext_PPRO.updateMarker("' + markerContent + '")');
}

function clearTextArea()
{
	$('#apimessage').val("");
}
