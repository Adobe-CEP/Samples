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

$._AA_={

	getVersionInfo : function() {
		return 'PPro ' + app.version + 'x' + app.build;
	},

    getSep : function() {
		if (Folder.fs == 'Macintosh') {
		    return '/';
		} else {
			return '\\';
		}
	},

	saveProject : function() {
		app.project.save();
	},

	getActiveSequenceName : function() {
    	if (app.project.activeSequence) {
		    return app.project.activeSequence.name;
		} else {
	    	return "No active sequence."
		}
    },

	searchForBinWithName : function (nameToFind) {

        var numItemsAtRoot	= app.project.rootItem.children.numItems;
        var foundBin 		= 0;
          
            for (var i = 0; (numItemsAtRoot >0) && (i < numItemsAtRoot) && (foundBin == 0); i++) {
                var currentItem = app.project.rootItem.children[i];
          
                if ((currentItem) && currentItem.name == nameToFind) {
                    foundBin = currentItem;
                }
            }
            return foundBin;
    },

	updateEventPanel : function() {
		app.setSDKEventMessage('Here is some information.', 'info');
		app.setSDKEventMessage('Here is a warning.', 'warning');
		//app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use wisely.
	},

	walkAllBinsForFootage : function(parentItem, outPath){
		for (var j = 0; j < parentItem.children.numItems; j++){
			var currentChild = parentItem.children[j];
			if (currentChild){
				if (currentChild.type == ProjectItemType.BIN){
					$._AA_.walkAllBinsForFootage(currentChild, outPath);		// warning; recursion!
				} else {
					$._AA_.dumpProjectItemXMP(currentChild, outPath);
				}
			}
		}
	},

	searchBinForProjItemByName : function(i, currentItem, nameToFind){

		for (var j = 0; j < currentItem.children.numItems; j++){
			var currentChild = currentItem.children[j];
			if (currentChild){
				if (currentChild.type == ProjectItemType.BIN){
					return $._AA_.searchBinForProjItemByName(j, currentChild, nameToFind);		// warning; recursion!
				} else {
                     if (currentChild.name == nameToFind){
                        return currentChild;
                     } else {
                         currentChild = currentItem.children[j+1];
                         if (currentChild){
                             return $._AA_.searchBinForProjItemByName(0, currentChild, nameToFind);
                         }  
                     }
				}
			}
		}
	},

	auditActiveSequence : function (){
		app.enableQE();

		var activeSeq = qe.project.getActiveSequence();

		if (activeSeq){

			var audioTrackCount     = activeSeq.numAudioTracks;
			var numWavFilesFound    = 0;

			for (var currentAudioTrack = 0; currentAudioTrack < audioTrackCount; currentAudioTrack++){

				var track = activeSeq.getAudioTrackAt(currentAudioTrack);	

				if (track) {

					for (var i = 0; i < track.numItems; i++){

						var currentItem = track.getItemAt(i); // has a projectItem member!

						if ((currentItem) && (currentItem.type != 'Empty')) {
		                    
		                     var projItem = currentItem.getProjectItem();
		                     
		                     if (projItem){
		                         var pos = projItem.filePath.lastIndexOf(".");
		                         
		                         if (pos > -1){
		                            var extension =  projItem.filePath.substr( (pos + 1), 3);
		                            if (extension == 'wav'){
                                        
                                        var startTimecode   = currentItem.start.timecode;
                                        var endTimecode     = currentItem.end.timecode;

		                            	numWavFilesFound++;

		                            	var outPath 			= new File('~/Desktop');
										var outFileName 		= activeSeq.name + '_cuesheet.txt';
		        						var completeOutputPath 	= outPath.fsName + $._AA_.getSep() + outFileName;

										var outFile 			= new File(completeOutputPath);

										if (outFile){
											outFile.encoding = "UTF8";
											outFile.open("a", "TEXT", "????");
											outFile.writeln(projItem.filePath);
											outFile.close();
										}
		                            }
		                         }
		                     }
						}
					}
				}
            
			}
			if (numWavFilesFound){
				var blahBlahBlah = "Detected " + numWavFilesFound + " .wav files, in " + activeSeq.name + ". Saved report to " + completeOutputPath + "." ;
			} else {
				var blahBlahBlah = "No .wav files found in sequence " + activeSeq.name + ".";
			}
			app.setSDKEventMessage(blahBlahBlah, "info");
        } else {
			alert("No active sequence.");
		}
	},

	message : function (msg) {
		 //$.writeln(msg);	 // Using '$' object will invoke ExtendScript Toolkit, if installed.
	},
};
