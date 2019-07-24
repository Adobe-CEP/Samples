/*  
 * ADOBE INC.
 * Copyright 2014 Adobe Inc.
 * All Rights Reserved.
 * 
 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a 
 * source other than Adobe, then your use, modification, or distribution of it requires the prior 
 * written permission of Adobe.
 */

/***************************************************************************************
 * -- XMPBridge ------------------------------------------------------------------------
 * 
 * The ExtendScript libraries are not directly accessible from the CEP HTML5 JavaScript 
 * engine. Interactions with the application DOM or other ExtendScript components need 
 * to be tunneled through the CSInterface. That component supports submitting
 * ExtendScript expressions to be evaluated within the application's scripting context 
 * and registering a callback function to capture the results. 
 * 
 * In order to provide a more convenient and high-level API the XMPBridge acts as a 
 * plain JavaScript proxy to the $.XMP utility that lives inside the ExtendScript 
 * environment.
 * 
 * As the communication happens in an asynchronous fashion you need to make sure that
 * you don't try to access XMP properties before the component is initialized properly
 * (e.g. the setup() method has completed). To address this the XMPBridge provides
 * an onInit() method, so you can register a callback that will be called once 
 * everything is ready to use.
 * 
 * sample usage:
 * 
 * XMPBridge.onInit(function(readyState) {
 * 
 * 		if(!readyState.isError) {
 * 		
 * 			// now we're ready to go.
 * 			XMPBridge.toNamespaceURI('NS_DC', function(namespaceUri) {
 * 				XMPBridge.read(namespaceUri, 'title');
 * 			});
 * 		
 * 		} else {
 * 			// error handling.
 * 		}
 * 
 * });
 * 
 **************************************************************************************/
var XMPBridge = (function(exports) {
	
	var CS_INTERFACE = new CSInterface();
	var NAMESPACE_CACHE = {};

	function escapeArgument(arg) {
		// handle multi-line string arguments.
		return arg.replace(/\r\n?|\n/g, "\\n");
	}
	
	/**
	 * helper function that constructs an ExtendScript expression dynamically from 
	 * the arguments of its current invocation. All arguments are passed through
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
				params.push(escapeArgument(arg));
			}
		}
	
		var functionArgs = params.length ? '("' + params.join('","') + '")' : '()';
		var script = method + functionArgs;
		
		// evaluate against the ExtendScript context.
		CS_INTERFACE.evalScript(script, callback);
	}
			
// public methods -----------------------------------------------------------------------
	
	/**
	 * Initiates the setup process and accepts an event handler function that will be 
	 * invoked once all components are ready to use. The callback is called with a single
	 * argument that reports any error that occurred during the initialization.
	 *  
	 * e.g. sample readyState parameter:
	 * 
	 *  {
	 *  	isError: true,
	 *  	statusMessage "Application not supported."
	 *  }
	 */
	exports.onInit = (function() {
		
		var readyState = undefined;
		var callback = undefined;
		
		// kick off setup phase regardless whether onInit() was called or not.
		// Note: this is a self-executing function closure.
		callExtendScript('$.XMP.setup', CS_INTERFACE.getApplicationID(), function(result) {
			readyState = { 
				isError: result != 'undefined' && result.trim() != '',
				statusMessage: result
			};
			
			callback && callback(readyState);
		});

		// The actual onInit() method. 
		// Will execute the initHandler immediately if setup() has already 
		// been completed or wait otherwise.
		return function(initHandler) {
			if(readyState) {
				initHandler(readyState);
			} else {
				callback = initHandler;
			}
		};
		
	})();

	/**
	 * @see $.XMP#toNamespaceURI()
	 */
	exports.toNamespaceURI = function(namespaceRef, callback) {
		if(NAMESPACE_CACHE[namespaceRef]) {
			callback(NAMESPACE_CACHE[namespaceRef]);
		} else {
			callExtendScript('$.XMP.toNamespaceURI', namespaceRef, function(namespaceURI) {
				NAMESPACE_CACHE[namespaceRef] = namespaceURI;
				callback(namespaceURI);		
			});
		}
	};

	/**
	 * @see $.XMP#getTargetName()
	 */
	exports.getTargetName = function(callback) {
		callExtendScript('$.XMP.getTargetName', callback);	
	};

	/**
	 * @see $.XMP#read()
	 */
	exports.read = function(namespaceUri, propertyName, callback) {
		callExtendScript('$.XMP.read', namespaceUri, propertyName, function(value) {
			callback && callback(value);
		});		
	};

	/**
	 * @see $.XMP#write()
	 */
	exports.write = function(namespaceUri, propertyName, value) {
		callExtendScript('$.XMP.write', namespaceUri, propertyName, value);	
	};

	/**
	 * @see $.XMP#commit()
	 */
	exports.commit = function() {
		callExtendScript('$.XMP.commit');	
	};
	
	return exports;
	
})(XMPBridge || {});
