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
 * -- $.PREMIERE ----------------------------------------------------------------------------
 * 
 * A client facing utility that provides access to Anywhere specific DOM calls.
 * $.PREMIERE.ANYWHERE provide access to the anywhere object in the DOM that
 * provides Anywhere tools.
 * 
 **************************************************************************************/
$.PREMIERE  = (function(exports) {

    /**
    * get Premiere version
    */
    exports.version = function() {
        return app.version;
    }
    
    /**
    * see $.PREMIERE#importFiles
    * the same but only for one file path
    * path - string
    */
    exports.importFile = function(path) {
        app.project.importFiles( [ path ]);
    }
    
    /**
    * import an array of files into the project or production
    * paths - array
    * For an Anywhere production a single path in the array can be:
    *  # a local file path, which will trigger a transfer to shared location
    *  # a eamedia:// path, which will add an existing clip from the shared storage without 
    * having direct access to it.
    * 
    */
    exports.importFiles = function(paths) {
        app.project.importFiles(paths);
    }
    
    /**
    * opens a path in the source monitor and plays it
    * can be a local path or a eamedia:// path
    */
    exports.openInSourceAndPlay = function(mediaUrl) {
        app.enableQE();
    	if (qe.source.openFilePath(mediaUrl)) {
            qe.source.player.play();
        } else {
            alert("Error resolving filepath!")
        };
    	
    };
    
    return exports;
})($.PREMIERE || {});
