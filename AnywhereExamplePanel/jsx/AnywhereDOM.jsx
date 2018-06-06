/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

if(typeof($)=='undefined')
	$={};

/***************************************************************************************
 * -- $.ANYWHERE ----------------------------------------------------------------------------
 * 
 * A client facing utility that provides access to Anywhere specific DOM calls.
 * $.ANYWHERE provide access to the anywhere object in the DOM that
 * provides Anywhere tools.
 * 
 **************************************************************************************/
$.ANYWHERE = (function(exports) {
    
    /**
    * returns the correct authentication token in the form key=value
    * so it can stored in a cookie as it is
    */
    exports.getAuthenticationToken = function() {
        var token = app.anywhere.getAuthenticationToken();
        return token;
    };
    
    /**
    * returns if a production is open (false if a local project is open)
    */
    exports.isProductionOpen = function() {
        return app.anywhere.isProductionOpen()
    };
    
    /**
    * returns the current editing (user) session URL
    */
    exports.getCurrentEditingSessionURL = function() {
        var url = app.anywhere.getCurrentEditingSessionURL();
        return url;
    };
return exports;
})($.ANYWHERE || {});