/*  
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.
 * 
 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a 
 * source other than Adobe, then your use, modification, or distribution of it requires the prior 
 * written permission of Adobe.
 * 
 * ---
 * 
 * This file contains ExtendScript utilities that interact with the application DOM
 * and provide access to Anywhere related functionality in Premiere. 
 * 
 * 
 */

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