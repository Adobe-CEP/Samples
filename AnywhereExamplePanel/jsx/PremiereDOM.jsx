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
