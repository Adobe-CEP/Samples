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


if(typeof($)=='undefined')
	$={};

/***************************************************************************************
 * -- DELEGATES ------------------------------------------------------------------------
 * 
 * Each supported application must be addressed by a dedicated delegate object, which
 * handles operations that require application specific code. Those are identified by 
 * a unique key and are being registered with the $.delegates map.
 * 
 * Keys currently used are:
 * 
 * PHXS = Photoshop
 * IDSN = InDesign
 * PPRO = Premiere Pro
 * ILST = Illustrator
 * AUDT = Audition
 * 
 * Those correspond to the application ID that can be obtained via the CEP JavaScript 
 * interface.
 * 
 * e.g.: new CSInterface().getApplicationID()
 * 
 **************************************************************************************/
$.delegates = (function(exports) {
	
	function findOrCreateDocument() {
		if(!app.documents.length) {
			app.documents.add();
		}
		
		return app.activeDocument;
	}
	
// -- metadata access strategies -------------------------------------------------------
	
	/**
	 * The XMPScript library provides full access to the data model and support for
	 * parsing and serializing XMP packets. 
	 * 
	 * This adapter is a generic delegate implementation that can be constructed with
	 * a specialized accessor object that acts as a proxy to the application DOM. Every
	 * accessor must satisfy the following API contract:
	 * 
	 * 
	 * getTarget() [OPTIONAL]
	 * 		Returns a reference to an object which's metadata shall be displayed 
	 * 		in the panel. e.g. some footage, the active document, ...
	 * 		Default: app.activeDocument
	 * 
	 * getTargetName(target) [OPTIONAL]
	 * 		A descriptive name of the target item that is currently being displayed
	 * 		by the panel.
	 * 		Default: target.name
	 * 
	 * getXmpPacket() [REQUIRED]
	 * 		The full XML/RDF serialized XMP packet.
	 * 
	 * setXmpPacket(target, xmpPacket) [REQUIRED]
	 * 		Replaces the target's metadata in the application DOM with xmpPacket.
	 */
	function XMPScriptAdapter(accessor) {

		// load the XMPScript library
		if (ExternalObject.AdobeXMPScript == undefined) {
			ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
		}

		// private ---
		
		function getPropertyAsString(xmp, namespaceUri, propertyName) {
	    	var property = xmp.getProperty(namespaceUri, propertyName);
	    	if(property.options & XMPConst.PROP_IS_ARRAY) {
	    		return xmp.getLocalizedText(namespaceUri, propertyName, "", "en");
	    	} else {
	    		return property.value;
	    	}
		}

		function setPropertyAsString(xmp, namespaceUri, propertyName, value) {
	    	var property = xmp.getProperty(namespaceUri, propertyName, XMPConst.STRING);
	    	
	    	if(property && property.options & XMPConst.PROP_IS_ARRAY) {
	    		xmp.setLocalizedText(namespaceUri, propertyName, "", "en", value);
	    	} else {
	    		xmp.setProperty(namespaceUri, propertyName, value);
	    	}
		}
		
		// public ---
		
		this.open = function() {
			var target = accessor.getTarget ? accessor.getTarget() : findOrCreateDocument();
			
			// if no target could be retrieved, we don't expose the API.
			if(!target) return;
			
			var xmp = new XMPMeta(accessor.getXmpPacket(target));
			
			return {
				getTargetName: function() {
					return accessor.getTargetName ? accessor.getTargetName(target) : target.name;
				},
				
				read: function(namespaceUri, propertyName) {
					if(xmp.doesPropertyExist(namespaceUri, propertyName)) {
						return getPropertyAsString(xmp, namespaceUri, propertyName);
					} else {
						return "";
			        }
				},
				
				write: function(namespaceUri, propertyName, value) {
					setPropertyAsString(xmp, namespaceUri, propertyName, value);
				},
				
				commit: function() {
					var packet = xmp.serialize(XMPConst.SERIALIZE_USE_COMPACT_FORMAT);
					accessor.setXmpPacket(target, packet);
    			}
			};
		};
	}
	
	/**
	 * As opposed to other applications the InDesign object model does not expose the
	 * raw XMP data. Still we can leverage the capabilities of XMPScript by wrapping the
	 * XMPScriptAdapter and implementing the following workaround:
	 * 
	 * 1. Dump XMP to a temporary file on disc.
	 * 2. Parse the file content with XMPScript
	 * 3. Work with the data model as required.
	 * 4. Serialize the XMP back to a temporary file.
	 * 5. Replace the document's metadata with the file content.
	 * 
	 */
	function InDesignAdapter() {
		var PACKET = undefined;
		
		// private ---
		
		function createTempFile() {
			// determine platform-dependent temp dir from environment.
			var tempDir = $.getenv('TMPDIR') ||  $.getenv('TEMP'); 
			
			var file = new File(tempDir + "/" + Date.now() + ".xmp");
			return file;
		}

		function withTempFile(callback) {
			var tempFile = createTempFile();
			tempFile.encoding = "UTF8"; 
			var result = callback(tempFile);
			tempFile.remove();
			return result;
		}
		
		function readFrom(file) {
			file.open('r');
			var content = file.read();
			file.close();
			
			return content;
		}
		
		function writeTo(file, content) {
			file.open('w', 'TEXT');
			var isOk = file.write(content);
			file.close();
			
			return isOk;
		}
		
		var wrapped = new XMPScriptAdapter({
			getTarget: function() {
				var doc = findOrCreateDocument();
				return doc.metadataPreferences;
			},
			
			getTargetName: function(target) {
				return target.documentTitle;
			},
			
			getXmpPacket : function(metadata) {
				if(!PACKET) {
					withTempFile(function(file) {
						metadata.save(file);
						PACKET = readFrom(file);
					});
				}
				
				return PACKET;
		    },
		
		    setXmpPacket : function(metadata, xmpPacket) {
				withTempFile(function(file) {
					writeTo(file, xmpPacket);
					metadata.replace(file);
					PACKET = undefined;
				});
		    }
		});
		
		// public ---
		
		this.open = wrapped.open;
		
	}
	
// -- public delegate API exports -------------------------------------------------------
		
	exports["PHXS"] = new XMPScriptAdapter({
		getXmpPacket : function(doc) {
	    	return doc.xmpMetadata.rawData;
	    },
	
	    setXmpPacket : function(doc, xmpPacket) {
	    	doc.xmpMetadata.rawData = xmpPacket;
	    }
	});
		
	exports["ILST"] = new XMPScriptAdapter({
		getXmpPacket : function(doc) {
			return doc.XMPString;
	    },
	
	    setXmpPacket : function(doc, xmpPacket) {
	    	doc.XMPString = xmpPacket;
	    }
	});
	
	exports["IDSN"] = new InDesignAdapter();

	exports["PPRO"] = new XMPScriptAdapter({
		getTarget: function() {
			// assuming that the first project item is footage.
			return app.project.rootItem.children[0]; 
		},

		getXmpPacket : function(item) {
			return item.getXMPMetadata(); 	    
		},
	
	    setXmpPacket : function(item, xmpPacket) {
			item.setXMPMetadata(xmpPacket); 
	    }
	});
	
	exports["AUDT"] = new XMPScriptAdapter({
		getTarget: function() {	
            if (app.activeDocument && app.activeDocument.reflect.name == "WaveDocument") {
			     return app.activeDocument;
            }
            
            return null;
		},

		getTargetName: function(target) {
			return target.displayName;
		},

		getXmpPacket : function(doc) {
			return doc.metadata.xmp;
		},
	
		setXmpPacket : function(doc, xmpPacket) {
			doc.metadata.xmp = xmpPacket;
		}
	});
	
	return exports;
	
})($.delegates || {});


/***************************************************************************************
 * -- $.XMP ----------------------------------------------------------------------------
 * 
 * A client facing utility that supports read and write operations on the current 
 * document's metadata properties.
 * 
 * Remember to call $.XMP.setup(appId) first and commit your changes afterwards 
 * with $.XMP.commit()
 * 
 **************************************************************************************/
$.XMP = (function(exports) {
	
	var DELEGATE_API = undefined;
		
	/**
	 * Needs to be invoked before accessing any XMP property. 
	 * Expects the application Id to be passed in in order to choose the right
	 * delegate object that supports the current application.
	 * 
	 * Will return an error message if the initialization fails. Otherwise errors
	 * cannot be propagated gracefully to the calling JavaScript context.
	 */
	exports.setup = function(appName) {
		if(!$.delegates || !$.delegates[appName]) {
			return "Application [" + appName + "] not supported yet!";
		}
		
		var delegate = $.delegates[appName];
		DELEGATE_API = delegate.open();
		
		if(!DELEGATE_API) {
			return "No metadata accessible.";
		}
	};

	/**
	 * Obtains the full namespace URI from XMPConst.
	 * See "JavaScript Tools Guide CC" (p. 262) for a complete list of namespace constants.
	 */
	exports.toNamespaceURI = function(namespaceRef) {
		return XMPConst[namespaceRef];
	},
	
	/**
	 * Returns a descriptive name for the displayed doc or project item.
	 */
	exports.getTargetName = function() {
		return DELEGATE_API.getTargetName();
	},
	
	/**
	 * Returns a string representation of the properties value.
	 * If empty or not present, an empty string is returned.
	 */
	exports.read = function(namespaceUri, propertyName) {
		var result = DELEGATE_API.read(namespaceUri, propertyName);
		
		// force implicit string conversion due to inconsistent data types.
		return "" + result;
	};

	/**
	 * Adds or updates a property with the given namespace and value.
	 * Note that you need to call commit() in to serialize the changes back to the active document.
	 */
	exports.write = function(namespaceUri, propertyName, value) {
		return DELEGATE_API.write(namespaceUri, propertyName, value);
	};
	
	/**
	 * Serializes the current XMP metadata and writes it back into the application DOM.
	 */
	exports.commit = function() {
		DELEGATE_API.commit();
	};
	
 	return exports;
	
})($.XMP || {});