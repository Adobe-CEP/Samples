/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe Inc.
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe. 
**************************************************************************/

/**
 * Create a guid
 */
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random()*16.0).toString(16);
      guid +=   n;
      if((i==8)||(i==12)||(i==16)||(i==20))
        guid += "-";
    }
    return guid;    
}

/**
 * Convert xml string to dom object
 */
function createXMLDocObject(xmlString) {
	var xmlDoc = null;

	try //Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xmlString);
	}
	catch(e)
	{
		try //Firefox, Mozilla, Opera, Chrome, etc.
		{
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(xmlString,"text/xml");
		}
		catch(e) {
			console.log("[Error occurred when creating a xml object from a string]%s", xmlString);
		}
	}

	return xmlDoc;
}

/**
 * Convert dom object to json object
 */
function convertXMLDocToJSON(xmlDoc) {
    var jsonObj = {};  
   
    if (xmlDoc != null && typeof(xmlDoc) != "undefined") {
        /*
        ELEMENT TYPE    NODE TYPE
        element             1
        attr                2
        text                3
        comments            8
        document            9
        */
        if (xmlDoc.nodeType == 1) { // if the node is an element node  
            
            if (xmlDoc.attributes.length > 0) { // add attributes to the return json object         
                jsonObj["@attributes"] = {};  
                for (var i = 0; i < xmlDoc.attributes.length; i++) {  
                    var attribute = xmlDoc.attributes.item(i);  
                    jsonObj["@attributes"][attribute.nodeName] = attribute.nodeValue;  
                }  
            }  
        } else if (xmlDoc.nodeType == 3) { // if the node is a text node  
            jsonObj = xmlDoc.nodeValue;  
        }  
       
        if (xmlDoc.hasChildNodes()) {// if the node has child nodes, resolve them recursively  
            for(var i = 0; i < xmlDoc.childNodes.length; i++) {  
                var child = xmlDoc.childNodes.item(i);  
                var nodeName = child.nodeName;  
                
                if (typeof(jsonObj[nodeName]) == "undefined") {                      
                    jsonObj[nodeName] = convertXMLDocToJSON(child);  
                }else  {  
                    if (typeof(jsonObj[nodeName].length) == "undefined") { // convert the node to a list to contain more homonymic child nodes
                      
                        var oldNode = jsonObj[nodeName];  
                        jsonObj[nodeName] = [];  
                        jsonObj[nodeName].push(oldNode);  
                    }  
                    obj[nodeName].push(convertXMLDocToJSON(child));  
                }  
            }  
        } 
    }else {
        console.log("[Error occurred when convert a dom object to a json object] The dom object is null or its type is undefined.");
    }
    
    return jsonObj;  
}

/**
 * Convert xml string to json object
 */
function convertXMLToJSON(xmlString) {
    var jsonObj = {};
    
    var xmlDoc = null;
    xmlDoc = createXMLDocObject(xmlString)
    
    if (xmlDoc != null) {
        jsonObj = convertXMLDocToJSON(xmlDoc);
    }else{
        console.log("[Error occurred when convert a xml string to json]%s", xmlString);
    }
    
    return jsonObj;
}

/**
 * Encode HTML String
 */
function encodeHTML(htmlString) {
    var converter = document.createElement("div");
    var text = document.createTextNode(htmlString);
    converter.appendChild(text);
    return converter.innerHTML;    
}

/**
 * Decode HTML String
 */
function decodeHTML(encodeString) {
    var converter = document.createElement("div");
    converter.innerHTML = encodeString;
    return converter.innerHTML;   
}

/**
 * Load JSX file into the scripting context of the product. All the jsx files in 
 * folder [ExtensionRoot]/jsx will be loaded. 
 */
function loadJSX() {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    console.log('[Extension Root]%s'+extensionRoot);
    new CSInterface().evalScript('$._ext.evalFiles("' + extensionRoot + '")');
}

/**
 *  execute script fragment and set the callback
 */
function evalScript(script, callback) {
    new CSInterface().evalScript(script, callback);
}

/**
 * Auto update color according to the theme of Prelude
 */
function autoUpdateColor() {
    var csInterface = new CSInterface();
    updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
    //Update the color of the panel when the theme color of the product changed.
	csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);    
}

/**
 * Update the theme with the AppSkinInfo retrieved from the host product.
 */
function updateThemeWithAppSkinInfo(appSkinInfo) {
    //Update the background color of the panel
    var panelBgColor = appSkinInfo.panelBackgroundColor.color;
    document.body.bgColor = toHex(panelBgColor);

    //Update the default text style with pp values    
    var styleId = "autoUpdateTheme";
    
    var head = document.getElementsByTagName('head')[0];
    if (head != null && typeof(head) != "undefined")
    {
        var autoUpdateStyleSheet = head.getElementById(styleId);        
        if (autoUpdateStyleSheet == null || typeof(autoUpdateStyleSheet) == "undefined"){
            var autoUpdateStyleSheet = document.createElement("style");
            autoUpdateStyleSheet.type = 'text/css';
            autoUpdateStyleSheet.id = styleId;
            head.appendChild(autoUpdateStyleSheet);
        }
        
        addRule(styleId, "body", "font-size:" + appSkinInfo.baseFontSize + "px" + "; color:" + "#" + reverseColor(panelBgColor) + "; background-color:" + "#" + toHex(panelBgColor, 20));
        addRule(styleId, "button", "border-color: " + "#" + toHex(panelBgColor, -50));

    }
}    

/**
 * Add a rule to the stylesheet
 */
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

/**
 * Reverse the color 
 */
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

/*
 * Listen to app theme color changed event  
 */
function onAppThemeColorChanged(event) {
    // Should get a latest HostEnvironment object from application.
    var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    // Gets the style information such as color info from the skinInfo, 
    // and redraw all UI controls of your extension according to the style info.
    updateThemeWithAppSkinInfo(skinInfo);
} 

function sendFocusInCSXSEvent()
{
	var event = new CSEvent("com.adobe.events.TextFieldFocusIn", "APPLICATION");
	new CSInterface().dispatchEvent(event);
}
			
function sendFocusOutCSXSEvent()
{
	var event = new CSEvent("com.adobe.events.TextFieldFocusOut", "APPLICATION");
	new CSInterface().dispatchEvent(event);
}




