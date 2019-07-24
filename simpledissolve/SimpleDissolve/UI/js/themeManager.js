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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global window, document, CSInterface*/

var themeManager = (function () {
    'use strict';
     
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
            
            computedValue = Math.floor(computedValue);
    
            computedValue = Math.round(computedValue).toString(16);
            return computedValue.length === 1 ? "0" + computedValue : computedValue;
        }
    
        var hex = "";
        if (color) {
            hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
        }
        return hex;
    }

    function reverseColor(color, delta) {
        return toHex({
            red: Math.abs(255 - color.red),
            green: Math.abs(255 - color.green),
            blue: Math.abs(255 - color.blue)
        },
            delta);
    }
            

    function addRule(stylesheetId, selector, rule) {
        var stylesheet = document.getElementById(stylesheetId);
        
        if (stylesheet) {
            stylesheet = stylesheet.sheet;
            if (stylesheet.addRule) {
                stylesheet.addRule(selector, rule);
            } else if (stylesheet.insertRule) {
                stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
            }
        }
    }
                
    /**
     * Update the theme with the AppSkinInfo retrieved from the host product.
     */
    function updateThemeWithAppSkinInfo(appSkinInfo) {
 
        // always the same background color for dialogs
        var bgdColor = "d6d6d6"

        var baseFontFamily = appSkinInfo.baseFontFamily

        // appSkinInfo.baseFontFamily reports the wrong font in OS X
        if (window.navigator.platform.toLowerCase().indexOf('mac') > -1) {
            var baseFontFamily = "LucidaGrande" 
        }
        
        var panelBgColor = appSkinInfo.panelBackgroundColor.color; 
        var eltBgdColor = toHex(panelBgColor, 20);
           
        var styleId = "hostStyle";

        addRule(styleId, "body", "background-color: #" + bgdColor);
        addRule(styleId, "body", "font-family: " + baseFontFamily);

        addRule(styleId, "button", "font-size: inherit")
        addRule(styleId, "button", "font-family: inherit");

        addRule(styleId, "input[type=number]", "font-size: inherit");
        addRule(styleId, "input[type=number]", "font-family: inherit");
    }
        
    function onAppThemeColorChanged(event) {
        var skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
        updateThemeWithAppSkinInfo(skinInfo);
    }


    function init() {       
        var csInterface = new CSInterface(); 
        updateThemeWithAppSkinInfo(csInterface.hostEnvironment.appSkinInfo);
        csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
    }
    
    return {
        init: init
    };
    
}());
