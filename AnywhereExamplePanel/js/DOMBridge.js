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

/***************************************************************************************
 * -- DOMBridge ------------------------------------------------------------------------
 * 
 * The ExtendScript libraries are not directly accessible from the CEP HTML5 JavaScript 
 * engine. Interactions with the application DOM or other ExtendScript components need 
 * to be tunneled through the CSInterface. That component supports submitting
 * ExtendScript expressions to be evaluated within the application's scripting context 
 * and registering a callback function to capture the results. 
 * 
 * In order to provide a more convenient and high-level API the DOMBridge acts as a 
 * plain JavaScript proxy to the $.PREMIERE and $.ANYWHERE utility that lives inside the ExtendScript 
 * environment.
 * 
 * Add more DOM functionality here.
 * 
 **************************************************************************************/
var DOMBridge = (function(exports) {
    var CS_INTERFACE = new CSInterface();
    
    /**
	 * helper function that constructs an ExtendScript expression dynamically from 
	 * the arguments of its current invocation. All string arguments are passed through
	 * the escapeArgument() function which supports basic validation.
	 * 
	 * Expects the first argument to be a method/function name that is requested 
	 * to be called. Any function argument will be registered as a callback.
	 */
	function callExtendScript(method) {
		var args = [].splice.call(arguments,1);
		var callback = undefined;

		var params = [];
		for(var idx in args) {
			var arg = args[idx];
			if(typeof(arg) == 'function') {
				callback = arg;
			} else {
                params.push( JSON.stringify(arg) );
            }
		}
		var functionArgs = params.length ? '(' + params.join(',') + ')' : '()';
		var script = method + functionArgs;
        
		// evaluate against the ExtendScript context.
		CS_INTERFACE.evalScript(script, callback);
	}
    
    
    // public methods -----------------------------------------------------------------------
    /**
    * initializes the jsx files used in this wrapper
    */
    exports.init = function(callback) {
        var extensionRoot = CS_INTERFACE.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
        callExtendScript('$._ext.evalFiles',extensionRoot, callback);
    }
    
    /**
    * returns the application ID
    */
    exports.getApplicationID = function(callback) {
        return  CS_INTERFACE.getApplicationID();
    };
    // wrap Anywhere specific DOM calls $.PREMIERE.ANYWHERE in an own object 
    // PremiereDOMBridge.anywhere
    var anywhere = {};
    
    /**
	 * @see $.ANYWHERE#getAuthenticationToken
	 */
    anywhere.getAuthenticationToken = function(callback) {
        callExtendScript('$.ANYWHERE.getAuthenticationToken', callback);
    };
    
     /**
	 * @see $.ANYWHERE#isProductionOpen
	 */
    anywhere.isProductionOpen = function(callback) {
        callExtendScript('$.ANYWHERE.isProductionOpen', callback);
    };
    
    /**
	 * @see $.ANYWHERE#getCurrentEditingSessionURL
	 */
    anywhere.getCurrentEditingSessionURL = function(callback) {
        callExtendScript('$.ANYWHERE.getCurrentEditingSessionURL', callback);
    }
    
    exports.anywhere = anywhere;
    
    /**
	 * @see $.PREMIERE#version
	 */
    exports.version = function( callback) {
        callExtendScript('$.PREMIERE.version', callback);
    };
    
    /**
	 * @see $.PREMIERE#openInSource
	 */
    exports.openInSourceAndPlay = function(path, callback) {
        callExtendScript('$.PREMIERE.openInSourceAndPlay', path, callback);
    };
    
    /**
	 * @see $.PREMIERE#importFiles
	 */
    exports.importFiles = function(paths, callback) {
        callExtendScript('$.PREMIERE.importFiles', paths, callback);
    };
    
     /**
	 * @see $.PREMIERE#importFile
	 */
    exports.importFile = function(path, callback) {
        callExtendScript('$.PREMIERE.importFile', path, callback);
    };

    return exports;
})(DOMBridge || {});