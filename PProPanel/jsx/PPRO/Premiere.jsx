/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe. 
**************************************************************************/
#include "PPro_API_Constants.jsx"

$._PPP_={

	createDeepFolderStructure : function(foldersArray, maxDepth) {
		if (typeof foldersArray !== 'object' || foldersArray.length <= 0) {
			throw new Error('No valid folders array was provided!');
		}

		// if the first folder already exists, throw error
		for (var i = 0; i < app.project.rootItem.children.numItems; i++) {
			var curChild = app.project.rootItem.children[i];
			if (curChild.type === ProjectItemType.BIN && curChild.name === foldersArray[0]) {
				throw new Error('Folder with name "' + curChild.name + '" already exists!');
			}
		}

		// create the deep folder structure
		var currentBin = app.project.rootItem.createBin(foldersArray[0]);
		for (var m = 1; m < foldersArray.length && m < maxDepth; i++) {
			currentBin = currentBin.createBin(foldersArray[i]);
		}
	},

	getVersionInfo : function() {
		return 'PPro ' + app.version + 'x' + app.build;
	},

	getUserName : function() {
		var	homeDir		= new File('~/');
		var	userName	= homeDir.displayName;
		homeDir.close();
		return userName;
	},

	keepPanelLoaded : function() {
		app.setExtensionPersistent("com.adobe.PProPanel", 0); // 0, while testing (to enable rapid reload); 1 for "Never unload me, even when not visible."
	},

	updateGrowingFile : function() {
		var numItems	= app.project.rootItem.children.numItems;
		for (var i = 0; i < numItems; i++){
			var currentItem = app.project.rootItem.children[i];
			if (currentItem){
				currentItem.refreshMedia();
			}
		}
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

	exportCurrentFrameAsPNG : function() {
		app.enableQE();
		var activeSequence	= qe.project.getActiveSequence(); 	// note: make sure a sequence is active in PPro UI
		if (activeSequence) {
			// Create a file name based on timecode of frame.
			var time			= activeSequence.CTI.timecode; 	// CTI = Current Time Indicator.
			var removeThese 	= /:|;/ig;    // Why? Because Windows chokes on colons.
			time = time.replace(removeThese, '_');
			var outputPath		= new File("~/Desktop");
			var outputFileName	= outputPath.fsName + $._PPP_.getSep() + time + '___' + activeSequence.name;
			activeSequence.exportFramePNG(time, outputFileName);
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	renameFootage : function() {
		var item = app.project.rootItem.children[0]; // assumes the zero-th item in the project is footage.
		if (item) {
			item.name = item.name + ", updated by PProPanel.";
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	getActiveSequenceName : function() {
		if (app.project.activeSequence) {
			return app.project.activeSequence.name;
		} else {
			return "No active sequence.";
		}
	},
	
	projectPanelSelectionChanged : function(projectItems, viewID) {
		
		var remainingArgs 	= projectItems.length;
        var message 		= remainingArgs + " items selected: ";
		var view 			= viewID;
        
		// Concatenate selected project item names, into message. 

		for (var i = 0; i < projectItems.length; i++) {
            message += projectItems[i].name;
			remainingArgs--;
            if (remainingArgs > 1) {
                message += ', ';
            }
            if (remainingArgs === 1){
                message += ", and ";
			} 
            if (remainingArgs === 0) {
                message += ".";
            }
        }
        app.setSDKEventMessage(message, 'info');
    },

	registerProjectPanelChangedFxn : function() {
		var success = app.bind("onSourceClipSelectedInProjectPanel", $._PPP_.projectPanelSelectionChanged);
	},


	getProjectPanelMeta : function() {
		$._PPP_.updateEventPanel(app.project.getProjectPanelMetadata());
	},

	setProjectPanelMeta : function() {
		metadata = "<?xml version='1.0'?><md.paths version='1.0'><metadata_path><internal>true</internal><namespace>http://ns.adobe.com/exif/1.0/</namespace><description>ColorSpace</description><entry_name>ColorSpace</entry_name><parent_id>http://ns.adobe.com/exif/1.0/</parent_id></metadata_path><metadata_path><internal>false</internal><namespace>http://amwa.tv/mxf/as/11/core/</namespace><description>audioTrackLayout</description><entry_name>audioTrackLayout</entry_name><parent_id>http://amwa.tv/mxf/as/11/core/</parent_id></metadata_path><metadata_path><internal>false</internal><namespace>http://ns.useplus.org/ldf/xmp/1.0/</namespace><description>ImageCreator</description><entry_name>ImageCreator</entry_name><parent_id>http://ns.useplus.org/ldf/xmp/1.0/</parent_id></metadata_path></md.paths>";
		app.project.setProjectPanelMetadata(metadata);
	},
	
	exportSequenceAsPrProj : function() {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var startTimeOffset		= activeSequence.zeroPoint;  
			var prProjExtension		= '.prproj';
			var outputName			= activeSequence.name;
			var outFolder			= Folder.selectDialog();
		
			if (outFolder) {
				var completeOutputPath =	outFolder.fsName + 
											$._PPP_.getSep() +
											outputName +
											prProjExtension;
			
				app.project.activeSequence.exportAsProject(completeOutputPath);
		
				$._PPP_.updateEventPanel("Exported " + app.project.activeSequence.name + " to " +completeOutputPath + ".");
			} else {
				$._PPP_.updateEventPanel("Could not find or create output folder.");
			}

			// Here's how to import N sequences from a project.
			//
			// var seqIDsToBeImported = new Array;
			// seqIDsToBeImported[0] = ID1;
			// ...
			// seqIDsToBeImported[N] = IDN;
			//
			//app.project.importSequences(pathToPrProj, seqIDsToBeImported);
			
		}else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	createSequenceMarkers : function() {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var markers		= activeSequence.markers; 
			if (markers) {
				var numMarkers	= markers.numMarkers;
				if (numMarkers > 0) {
					var marker_index = 1;
					for(var current_marker	=	markers.getFirstMarker();
							current_marker	!==	undefined; 
							current_marker	=	markers.getNextMarker(current_marker)){
						if (current_marker.name !== "") {
							$._PPP_.updateEventPanel(	'Marker ' + marker_index + ' name = ' + current_marker.name + '.');
						} else {
							$._PPP_.updateEventPanel(	'Marker ' + marker_index + ' has no name.');
						}

						if (current_marker.end.seconds > 0) {
							$._PPP_.updateEventPanel(	'Marker ' + marker_index + ' duration = ' + (current_marker.end.seconds - current_marker.start.seconds) + ' seconds.');
						} else {
							$._PPP_.updateEventPanel(	'Marker ' + marker_index + ' has no duration.');
						}
						$._PPP_.updateEventPanel('Marker ' + marker_index + ' starts at ' + current_marker.start.seconds + ' seconds.');
						marker_index = marker_index + 1;
					}
				}
			}
	
			var newCommentMarker			= markers.createMarker(12.345);
			newCommentMarker.name			= 'Marker created by PProPanel.';
			newCommentMarker.comments		= 'Here are some comments, inserted by PProPanel.';
			newCommentMarker.end			= 15.6789;

			var newWebMarker				= markers.createMarker(14.345);
			newWebMarker.name				= 'Web marker created by PProPanel.';
			newWebMarker.comments			= 'Here are some comments, inserted by PProPanel.';
			newWebMarker.end				= 17.6789;
			newWebMarker.setTypeAsWebLink("http://www.adobe.com", "frame target");
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},
	
	exportFCPXML : function() {
		if (app.project.activeSequence) {
			var projPath			= new File(app.project.path);
			var parentDir			= projPath.parent;
			var outputName			= app.project.activeSequence.name;
			var xmlExtension		= '.xml';
			var outputPath			= Folder.selectDialog("Choose the output directory");
		
			if (outputPath) {
				var completeOutputPath = outputPath.fsName + $._PPP_.getSep() + outputName + xmlExtension;
				app.project.activeSequence.exportAsFinalCutProXML(completeOutputPath, 1); // 1 == suppress UI
				var info = 	"Exported FCP XML for " + 
							app.project.activeSequence.name + 
							" to " + 
							completeOutputPath + 
							".";
				$._PPP_.updateEventPanel(info);
			} else {
				$._PPP_.updateEventPanel("No output path chosen.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	openInSource : function() {
		var fileToOpen = File.openDialog ("Choose file to open.", 0, false);
		if (fileToOpen) {
			app.sourceMonitor.openFilePath(fileToOpen.fsName);
			app.sourceMonitor.play(1.73); // playback speed as float, 1.0 = normal speed forward
			fileToOpen.close(); 
		} else {
			$._PPP_.updateEventPanel("No file chosen.");		
		}
	},

	searchForBinWithName : function (nameToFind) {
		// deep-search a folder by name in project
		var deepSearchBin = function(inFolder) {
		  if (inFolder && inFolder.name === nameToFind && inFolder.type === 2) {
		    return inFolder;
		  } else {
		    for (var i = 0; i < inFolder.children.numItems; i++) {
		      if (inFolder.children[i] && inFolder.children[i].type === 2) {
		        var foundBin = deepSearchBin(inFolder.children[i]);
		        if (foundBin) return foundBin;
		      }
		    }
		  }
		  return undefined;
		};
		return deepSearchBin(app.project.rootItem);
	},

	importFiles : function() {
		if (app.project) {
			var fileOrFilesToImport	= File.openDialog (	"Choose files to import", 	// title
														0, 							// filter available files? 
														true); 						// allow multiple?
			if (fileOrFilesToImport) {
				// We have an array of File objects; importFiles() takes an array of paths.
				var importThese = [];
				if (importThese){
					for (var i = 0; i < fileOrFilesToImport.length; i++) {
						importThese[i] = fileOrFilesToImport[i].fsName;
					}
					app.project.importFiles(importThese, 
											1,				// suppress warnings 
											app.project.getInsertionBin(),
											0);				// import as numbered stills
				}
			} else {
				$._PPP_.updateEventPanel("No files to import.");
			} 
		}
	},

	muteFun : function() {
		if (app.project.activeSequence){
			for (var i = 0; i < app.project.activeSequence.audioTracks.numTracks; i++){
				var currentTrack	= app.project.activeSequence.audioTracks[i];
				if (Math.random() > 0.5){
					currentTrack.setMute(!(currentTrack.isMuted()));
				 }
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence found.");
		}
	},

	disableImportWorkspaceWithProjects : function() {
		var prefToModify	= 'FE.Prefs.ImportWorkspace';
		var appProperties 	= app.properties;
		
		if (appProperties){
			var propertyExists 		= app.properties.doesPropertyExist(prefToModify);
			var propertyIsReadOnly 	= app.properties.isPropertyReadOnly(prefToModify);
			var propertyValue 		= app.properties.getProperty(prefToModify);
		
			appProperties.setProperty(prefToModify, false, 1); // optional 3rd param : 0 = non-persistent,  1 = persistent (default)
			var safetyCheck = app.properties.getProperty(prefToModify);
			if (safetyCheck != propertyValue){
				$._PPP_.updateEventPanel("Changed \'Import Workspaces with Projects\' from " + propertyValue + " to " + safetyCheck + ".");
			}
		} else {
			$._PPP_.updateEventPanel("Properties not found.");
		}
	},

	turnOffStartDialog : function (){
		var prefToModify	= 'MZ.Prefs.ShowQuickstartDialog';
		var appProperties 	= app.properties;
		if (appProperties){
			var propertyExists 		= app.properties.doesPropertyExist(prefToModify);
			var propertyIsReadOnly 	= app.properties.isPropertyReadOnly(prefToModify);
			var originalValue 		 = app.properties.getProperty(prefToModify);
		
			appProperties.setProperty(prefToModify, true, 1, 2); // optional 3rd param : 0 = non-persistent,  1 = persistent (default)
			var safetyCheck = app.properties.getProperty(prefToModify);
			if (safetyCheck != originalValue){
				$._PPP_.updateEventPanel("Start dialog now OFF. Enjoy!");
			}
		} else {
			$._PPP_.updateEventPanel("Properties not found.");
		}
	},

	replaceMedia : function() {
		
		// 	Note: 	This method of changing paths for projectItems is from the time
		//			before PPro supported full-res AND proxy paths for each projectItem. 
		//			This can still be used, and will change the hi-res projectItem path, but
		//			if your panel supports proxy workflows, it should rely instead upon
		//			projectItem.setProxyPath() instead. 

		var firstProjectItem = app.project.rootItem.children[0]; 
		if (firstProjectItem) {
			if (firstProjectItem.canChangeMediaPath()) {
			
				// 	NEW in 9.0: setScaleToFrameSize() ensures that for all clips created from this footage, 
				//	auto scale to frame size will be ON, regardless of the current user preference. 
				//	This is	important for proxy workflows, to avoid mis-scaling upon replacement. 

				//	Addendum: This setting will be in effect the NEXT time the projectItem is added to a 
				//	sequence; it will not affect or reinterpret clips from this projectItem, already in
				//	sequences.

				firstProjectItem.setScaleToFrameSize();
				
				var replacementMedia = File.openDialog(	"Choose new media file, for " + 
														firstProjectItem.name, 
														0, 						// file filter
														false); 				// allow multiple?
				
				if (replacementMedia) {
					var forceAttempt	= true;
					firstProjectItem.name	= replacementMedia.name + ", formerly known as " + firstProjectItem.name;
					firstProjectItem.changeMediaPath(replacementMedia.fsName, forceAttempt);  // 'forceAttempt' param new in 12.1
					replacementMedia.close(); 
				} 
			} else {
				$._PPP_.updateEventPanel("Couldn't change path of " + firstProjectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},
	
	openProject : function() {
		var filterString = "";
		if (Folder.fs === 'Windows'){
			filterString = "All files:*.*";
		}
		var projToOpen	= File.openDialog ("Choose project:", filterString, false);
		if ((projToOpen) && projToOpen.exists) {
			app.openDocument(	projToOpen.fsName,
								1,					// suppress 'Convert Project' dialogs?
								1,					// suppress 'Locate Files' dialogs?
								1);					// suppress warning dialogs?
			projToOpen.close();
		}	
	},

	exportFramesForMarkers : function (){
		app.enableQE();
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var markers			= activeSequence.markers; 
			var markerCount		= markers.numMarkers;
			if (markerCount){
				var firstMarker = markers.getFirstMarker();
				activeSequence.setPlayerPosition(firstMarker.start.ticks);
				$._PPP_.exportCurrentFrameAsPNG();

				var previousMarker = 0; 
				if (firstMarker){
					for(var i = 0; i < markerCount; i++){
						if (i === 0){
							currentMarker = markers.getNextMarker(firstMarker);
						} else {
							currentMarker = markers.getNextMarker(previousMarker);
						}
						if (currentMarker){
							activeSequence.setPlayerPosition(currentMarker.start.ticks);
							previousMarker = currentMarker;
							$._PPP_.exportCurrentFrameAsPNG();
						}
					}
				}
			} else {
				$._PPP_.updateEventPanel("No markers applied to " + activeSequence.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	createSequence : function(name) {
		var someID	= "xyz123";
		var seqName = prompt('Name of sequence?',	 'Some Descriptive Name', 'Sequence Naming Prompt');
		app.project.createNewSequence(seqName, someID);
	},

	createSequenceFromPreset : function(presetPath) {
		app.enableQE();
		var seqName = prompt('Name of sequence?',	 'Some Descriptive Name', 'Sequence Naming Prompt');
		if (seqName) {
			qe.project.newSequence(seqName, presetPath);
		}
	},

	transcode : function(outputPresetPath) {
		app.encoder.bind('onEncoderJobComplete',	$._PPP_.onEncoderJobComplete);
		app.encoder.bind('onEncoderJobError', 		$._PPP_.onEncoderJobError);
		app.encoder.bind('onEncoderJobProgress', 	$._PPP_.onEncoderJobProgress);
		app.encoder.bind('onEncoderJobQueued', 		$._PPP_.onEncoderJobQueued);
		app.encoder.bind('onEncoderJobCanceled',	$._PPP_.onEncoderJobCanceled);

		var firstProjectItem = app.project.rootItem.children[0];
		if (firstProjectItem){

			app.encoder.launchEncoder();	// This can take a while; let's get the ball rolling.
	
			var fileOutputPath	= Folder.selectDialog("Choose the output directory");
			if (fileOutputPath){
				var outputName	= firstProjectItem.name.search('[.]');
				if (outputName == -1){
					outputName	= firstProjectItem.name.length;
				}
				outFileName	= firstProjectItem.name.substr(0, outputName);
				outFileName	= outFileName.replace('/', '-');
				var completeOutputPath	= fileOutputPath.fsName + $._PPP_.getSep() + outFileName + '.mxf';
				var removeFromQueue		= false;
				var rangeToEncode		= app.encoder.ENCODE_IN_TO_OUT;
				app.encoder.encodeProjectItem(	firstProjectItem, 
												completeOutputPath, 
												outputPresetPath, 
												rangeToEncode, 
												removeFromQueue); 
				app.encoder.startBatch();
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	transcodeExternal : function (outputPresetPath){
		app.encoder.launchEncoder();
		var fileToTranscode = File.openDialog ("Choose file to open.", 0, false);
		if (fileToTranscode) {
			var fileOutputPath = Folder.selectDialog("Choose the output directory");
			if (fileOutputPath){

				var srcInPoint		= 1.0; 	// encode start time at 1s (optional--if omitted, encode entire file)
				var srcOutPoint		= 3.0; // encode stop time at 3s (optional--if omitted, encode entire file)
				var removeFromQueue	= false;

				var result = app.encoder.encodeFile(fileToTranscode.fsName, 
													fileOutputPath.fsName, 
													outputPresetPath, 
													removeFromQueue, 
													srcInPoint, 
													srcOutPoint);
			}
		}
	},

	render : function(outputPresetPath) {
		app.enableQE();
		var activeSequence = qe.project.getActiveSequence();	// we use a QE DOM function, to determine the output extension.
		if (activeSequence)	{
			app.encoder.launchEncoder();	// This can take a while; let's get the ball rolling.

			var timeSecs	= activeSequence.CTI.secs;		// Just for reference, here's how to access the CTI 
			var timeFrames	= activeSequence.CTI.frames;	// (Current Time Indicator), for the active sequence. 
			var timeTicks	= activeSequence.CTI.ticks;
			var timeString	= activeSequence.CTI.timecode;

			var seqInPoint	= app.project.activeSequence.getInPoint();	// new in 9.0
			var seqOutPoint	= app.project.activeSequence.getOutPoint();	// new in 9.0

			var seqInPointAsTime = app.project.activeSequence.getInPointAsTime();	// new in 12.0
			var seqOutPointAsTime = app.project.activeSequence.getOutPointAsTime(); // new in 12.0
			
			var projPath	= new File(app.project.path);
			var outputPath  = Folder.selectDialog("Choose the output directory");

			if ((outputPath) && projPath.exists){
				var outPreset		= new File(outputPresetPath);
				if (outPreset.exists === true){
					var outputFormatExtension		=	activeSequence.getExportFileExtension(outPreset.fsName);
					if (outputFormatExtension){
						var outputFilename	= 	activeSequence.name + '.' + outputFormatExtension;

						var fullPathToFile	= 	outputPath.fsName 	+ 
												$._PPP_.getSep() 	+ 
												activeSequence.name + 
												"." + 
												outputFormatExtension;			

						var outFileTest = new File(fullPathToFile);

						if (outFileTest.exists){
							var destroyExisting	= confirm("A file with that name already exists; overwrite?", false, "Are you sure...?");
							if (destroyExisting){
								outFileTest.remove();
								outFileTest.close();
							}
						}

						app.encoder.bind('onEncoderJobComplete',	$._PPP_.onEncoderJobComplete);
						app.encoder.bind('onEncoderJobError', 		$._PPP_.onEncoderJobError);
						app.encoder.bind('onEncoderJobProgress', 	$._PPP_.onEncoderJobProgress);
						app.encoder.bind('onEncoderJobQueued', 		$._PPP_.onEncoderJobQueued);
						app.encoder.bind('onEncoderJobCanceled',	$._PPP_.onEncoderJobCanceled);


						// use these 0 or 1 settings to disable some/all metadata creation.

						app.encoder.setSidecarXMPEnabled(0);
						app.encoder.setEmbeddedXMPEnabled(0);

						/* 

						For reference, here's how to export from within PPro (blocking further user interaction).
						
						var seq = app.project.activeSequence; 
						
						if (seq) {
							seq.exportAsMediaDirect(fullPathToFile,  
													outPreset.fsName, 
													app.encoder.ENCODE_WORKAREA);

							Bonus: Here's how to compute a sequence's duration, in ticks. 254016000000 ticks/second.
							var sequenceDuration = app.project.activeSequence.end - app.project.activeSequence.zeroPoint;						
						}
						
						*/
						
						var jobID = app.encoder.encodeSequence(	app.project.activeSequence,
																fullPathToFile,
																outPreset.fsName,
																app.encoder.ENCODE_WORKAREA, 
																1);	   // Remove from queue upon successful completion?					
						$._PPP_.message('jobID = ' + jobID);
						outPreset.close();
					}
				} else {
					$._PPP_.updateEventPanel("Could not find output preset.");
				}
			} else {
				$._PPP_.updateEventPanel("Could not find/create output path.");
			}
			projPath.close();
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	saveProjectCopy : function() {
		var sessionCounter	= 1;
		var originalPath	= app.project.path;
		var outputPath		= Folder.selectDialog("Choose the output directory");

		if (outputPath) {
			var absPath		= outputPath.fsName;
			var outputName	= String(app.project.name);
			var array		= outputName.split('.', 2);

			outputName = array[0]+ sessionCounter + '.' + array[1]; 
			sessionCounter++;

			var fullOutPath = absPath + $._PPP_.getSep() + outputName;

			app.project.saveAs(fullOutPath);

			for (var a = 0; a < app.projects.numProjects; a++){ 
				var currentProject = app.projects[a]; 
				if (currentProject.path === fullOutPath){ 
					app.openDocument(originalPath);		// Why first? So we don't frighten the user by making PPro's window disappear. :)
					currentProject.closeDocument(); 
				} 
			}
		} else {
			$._PPP_.updateEventPanel("No output path chosen.");
		}
	},

	mungeXMP : function(){
		var projectItem	= app.project.rootItem.children[0]; // assumes first item is footage.
		if (projectItem) {
			if (ExternalObject.AdobeXMPScript === undefined) {
				ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript'); 
			}
			if (ExternalObject.AdobeXMPScript !== undefined) { 	// safety-conscious!
				
				var xmpBlob					= projectItem.getXMPMetadata();
				var xmp						= new XMPMeta(xmpBlob);
				var oldSceneVal				= "";
				var oldDMCreatorVal 		= "";

				if (xmp.doesPropertyExist(XMPConst.NS_DM, "scene") === true){
					var myScene = xmp.getProperty(XMPConst.NS_DM, "scene");
					oldSceneVal	= myScene.value;
				}
				
				if (xmp.doesPropertyExist(XMPConst.NS_DM, "creator") === true){
					var myCreator = xmp.getProperty(XMPConst.NS_DM, "creator");
					oldCreatorVal	= myCreator.value;
				}

				// Regardless of whether there WAS scene or creator data, set scene and creator data. 

				xmp.setProperty(XMPConst.NS_DM, "scene",	oldSceneVal 	+ " Added by PProPanel sample!");
				xmp.setProperty(XMPConst.NS_DM, "creator",	oldDMCreatorVal + " Added by PProPanel sample!");

				// That was the NS_DM creator; here's the NS_DC creator.

				var creatorProp             = "creator";
				var containsDMCreatorValue  = xmp.doesPropertyExist(XMPConst.NS_DC, creatorProp);
				var numCreatorValuesPresent = xmp.countArrayItems(XMPConst.NS_DC, creatorProp);
				var CreatorsSeparatedBy4PoundSigns = "";

				if(numCreatorValuesPresent > 0) {
					for (var z = 0; z < numCreatorValuesPresent; z++){
						CreatorsSeparatedBy4PoundSigns = CreatorsSeparatedBy4PoundSigns + xmp.getArrayItem(XMPConst.NS_DC, creatorProp, z + 1);
						CreatorsSeparatedBy4PoundSigns = CreatorsSeparatedBy4PoundSigns + "####";
					}
					$._PPP_.updateEventPanel(CreatorsSeparatedBy4PoundSigns);

					if (confirm("Replace previous?", false, "Replace existing Creator?")) {
						xmp.deleteProperty(XMPConst.NS_DC, "creator");
					}
					xmp.appendArrayItem(XMPConst.NS_DC, // If no values exist, appendArrayItem will create a value.
										creatorProp,
										numCreatorValuesPresent + " creator values were already present.",
										null, 
										XMPConst.ARRAY_IS_ORDERED);

				} else {
					
					xmp.appendArrayItem(XMPConst.NS_DC, 
										creatorProp,
										"PProPanel wrote the first value into NS_DC creator field.",
										null, 
										XMPConst.ARRAY_IS_ORDERED);
				}
				var xmpAsString = xmp.serialize();			// either way, serialize and write XMP.
				projectItem.setXMPMetadata(xmpAsString);
			}
		} else {
			$._PPP_.updateEventPanel("Project item required.");
		}
	},
	
	getProductionByName : function(nameToGet) {
		var production;
		for (var i = 0; i < productionList.numProductions; i++) {
			var currentProduction = productionList[i];

			if (currentProduction.name == nameToGet) {
				production = currentProduction;
			}
		}
		return production;
	},

	pokeAnywhere : function() {
		var token				= app.anywhere.getAuthenticationToken();
		var productionList		= app.anywhere.listProductions();
		var isProductionOpen	= app.anywhere.isProductionOpen();
		if (isProductionOpen === true) {
			var sessionURL			= app.anywhere.getCurrentEditingSessionURL();
			var selectionURL		= app.anywhere.getCurrentEditingSessionSelectionURL();
			var activeSequenceURL	= app.anywhere.getCurrentEditingSessionActiveSequenceURL();

			var theOneIAskedFor = $._PPP_.getProductionByName("test");

			if (theOneIAskedFor) {
				var out	= theOneIAskedFor.name + ", " + theOneIAskedFor.description;
				$._PPP_.updateEventPanel("Found: " + out);	// todo: put useful code here.
			}
		} else {
			$._PPP_.updateEventPanel("No Production open.");
		}
	},

	dumpOMF : function() {
		var activeSequence	= app.project.activeSequence;
		if (activeSequence) {
			var outputPath	= Folder.selectDialog("Choose the output directory");
			if (outputPath){
				var absPath				= outputPath.fsName;
				var outputName			= String(activeSequence.name) + '.omf';
				var fullOutPathWithName = absPath + $._PPP_.getSep() + outputName;

				app.project.exportOMF(	app.project.activeSequence,		// sequence
										fullOutPathWithName, 		// output file path
										'OMFTitle',						// OMF title
										48000,							// sample rate (48000 or 96000)
										16,								// bits per sample (16 or 24)
										1,								// audio encapsulated flag (1 : yes or 0 : no)
										0,								// audio file format (0 : AIFF or 1 : WAV)
										0,								// trim audio files (0 : no or 1 : yes)
										0,								// handle frames (if trim is 1, handle frames from 0 to 1000)
										0);								// include pan flag (0 : no or 1 : yes)
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	addClipMarkers : function () {
		if (app.project.rootItem.children.numItems > 0){
			var projectItem	= app.project.rootItem.children[0]; // assumes first item is footage.
			if (projectItem) {
				if (projectItem.type == ProjectItemType.CLIP ||	projectItem.type == ProjectItemType.FILE) {
					
					markers	= projectItem.getMarkers();

					if (markers) {
						var num_markers		= markers.numMarkers;
						var new_marker		= markers.createMarker(12.345);
						var guid 			= new_marker.guid; // new in 11.1
						
						new_marker.name		= 'Marker created by PProPanel.';
						new_marker.comments	= 'Here are some comments, inserted by PProPanel.';
						new_marker.end		= 15.6789;

						//default marker type == comment. To change marker type, call one of these:

						// new_marker.setTypeAsChapter();
						// new_marker.setTypeAsWebLink();
						// new_marker.setTypeAsSegmentation();
						// new_marker.setTypeAsComment();
					}
				} else {
					$._PPP_.updateEventPanel("Can only add markers to footage items.");
				}
			} else {
				$._PPP_.updateEventPanel("Could not find first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("Project is empty.");
		}
	},

	modifyProjectMetadata : function () {
		var kPProPrivateProjectMetadataURI	= "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";

		var namefield	= "Column.Intrinsic.Name";
		var tapename	= "Column.Intrinsic.TapeName";
		var desc		= "Column.PropertyText.Description";
		var logNote    	= "Column.Intrinsic.LogNote";
		var newField	= "ExampleFieldName";

		if (app.isDocumentOpen()) {
			var projectItem	= app.project.rootItem.children[0]; // just grabs first projectItem.
			if (projectItem) {
				if (ExternalObject.AdobeXMPScript === undefined) {
					ExternalObject.AdobeXMPScript	= new ExternalObject('lib:AdobeXMPScript');
				}
				if (ExternalObject.AdobeXMPScript !== undefined) {	// safety-conscious!
					var projectMetadata		= projectItem.getProjectMetadata();
					var successfullyAdded	= app.project.addPropertyToProjectMetadataSchema(newField, "ExampleFieldLabel",	2);

					var xmp	= new XMPMeta(projectMetadata);
					var obj	= xmp.dumpObject();

					// var aliases = xmp.dumpAliases();

					var namespaces					= XMPMeta.dumpNamespaces();
					var found_name					= xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, namefield);
					var found_tapename				= xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, tapename);
					var found_desc					= xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, desc);
					var found_custom				= xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, newField);
					var foundLogNote       			= xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, logNote);
					var oldLogValue        			= "";
					var appendThis          		= "This log note inserted by PProPanel.";
					var appendTextWasActuallyNew	= false;
					 
					 if(foundLogNote){
						var oldLogNote = xmp.getProperty(kPProPrivateProjectMetadataURI, logNote);
						if (oldLogNote){
							oldLogValue = oldLogNote.value;
						}
					 }

					xmp.setProperty(kPProPrivateProjectMetadataURI, tapename, 	"***TAPENAME***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, desc, 		"***DESCRIPTION***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, namefield, 	"***NEWNAME***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, newField, 	"PProPanel set this, using addPropertyToProjectMetadataSchema().");


					var array	= [];
					array[0]	= tapename;
					array[1]	= desc;
					array[2]	= namefield;
					array[3]	= newField;

					var concatenatedLogNotes = "";

					if (oldLogValue != appendThis){ 		// if that value is not exactly what we were going to add
						if (oldLogValue.length > 0){		// if we have a valid value
							concatenatedLogNotes += "Previous log notes: " + oldLogValue + "    ||||    ";
						}
						concatenatedLogNotes += appendThis;
						xmp.setProperty(kPProPrivateProjectMetadataURI, logNote, concatenatedLogNotes);
						array[4]    = logNote;
					}

					var str = xmp.serialize();
					projectItem.setProjectMetadata(str, array);

					// test: is it in there?

					var newblob		= projectItem.getProjectMetadata();
					var newXMP		= new XMPMeta(newblob);
					var foundYet	= newXMP.doesPropertyExist(kPProPrivateProjectMetadataURI, newField);

					if (foundYet){
						$._PPP_.updateEventPanel("PProPanel successfully added a field to the project metadata schema, and set a value for it.");
					}
				}
			} else {
				$._PPP_.updateEventPanel("No project items found.");
			}
		}
	},

	updatePAR : function() {
		var item = app.project.rootItem.children[0]; 
		if (item) {
			if ((item.type == ProjectItemType.FILE) || (item.type == ProjectItemType.CLIP)){
				// If there is an item, and it's either a clip or file...
				item.setOverridePixelAspectRatio(185,  100); // anamorphic is BACK!	  ;)
			} else {
				$._PPP_.updateEventPanel('You cannot override the PAR of bins or sequences.');
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},
	
	getnumAEProjectItems : function() {
		var bt		= new BridgeTalk();
		bt.target	= 'aftereffects';
		bt.body		= //'$._PPP_.updateEventPanel("Items in AE project: " + app.project.rootFolder.numItems);app.quit();';
					  'alert("Items in AE project: " + app.project.rootFolder.numItems);app.quit();';
		bt.send();
	},

	updateEventPanel : function(message) {
		app.setSDKEventMessage(message, 'info');
		//app.setSDKEventMessage('Here is some information.', 'info');
		//app.setSDKEventMessage('Here is a warning.', 'warning');
		//app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use sparingly.
	},

	walkAllBinsForFootage : function(parentItem, outPath){
		for (var j = 0; j < parentItem.children.numItems; j++){
			var currentChild	= parentItem.children[j];
			if (currentChild){
				if (currentChild.type == ProjectItemType.BIN){
					$._PPP_.walkAllBinsForFootage(currentChild, outPath);		// warning; recursion!
				} else {
					$._PPP_.dumpProjectItemXMP(currentChild, outPath);
				}
			}
		}
	},

	searchBinForProjItemByName : function(i, containingBin, nameToFind){
		for (var j = i; j < containingBin.children.numItems; j++){
			var currentChild	= containingBin.children[j];
			if (currentChild){
				if (currentChild.type == ProjectItemType.BIN){
					return $._PPP_.searchBinForProjItemByName(j, currentChild, nameToFind);		// warning; recursion!
				} else {
					 if (currentChild.name == nameToFind){
						return currentChild;
					 } else {
						currentChild = currentItem.children[j+1];
						if (currentChild){
							return $._PPP_.searchBinForProjItemByName(0, currentChild, nameToFind);
						}
					}
				}
			}
		}
	},

	dumpProjectItemXMP : function (projectItem, outPath) {
		var xmpBlob				= projectItem.getXMPMetadata();
		var outFileName			= projectItem.name + '.xmp';
		var completeOutputPath	= outPath + $._PPP_.getSep() + outFileName;
		var outFile				= new File(completeOutputPath);

		var isThisASequence		= projectItem.isSequence();
		
		if (outFile){
			outFile.encoding = "UTF8";
			outFile.open("w", "TEXT", "????");
			outFile.write(xmpBlob.toString());
			outFile.close();
		}
	},

	addSubClip : function() {
		var startTimeSeconds	= 1.23743;
		var endTimeSeconds		= 3.5235;
		var hasHardBoundaries	= 0;
		var sessionCounter		= 1;
		var takeVideo			= 1; // optional, defaults to 1
		var takeAudio			= 1; //	optional, defaults to 1
		var projectItem			= app.project.rootItem.children[0]; // just grabs the first item
		if (projectItem) {
			if ((projectItem.type == ProjectItemType.CLIP)	|| (projectItem.type == ProjectItemType.FILE)) {
				var newSubClipName	= prompt('Name of subclip?',	projectItem.name + '_' + sessionCounter, 'Name your subclip');
				
				var newSubClip 	= projectItem.createSubClip(newSubClipName, 
															startTimeSeconds, 
															endTimeSeconds, 
															hasHardBoundaries,
															takeVideo,
															takeAudio);

				if (newSubClip){
					newSubClip.setStartTime(12.345);
				}
			} else {
				$._PPP_.updateEventPanel("Could not sub-clip " + projectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project item found.");
		}
	},

	dumpXMPFromAllProjectItems : function() {
		var	numItemsInRoot	= app.project.rootItem.children.numItems;
		if (numItemsInRoot > 0) {
			var outPath = Folder.selectDialog("Choose the output directory");
			if (outPath) {
				for (var i = 0; i < numItemsInRoot; i++){
					var currentItem	= app.project.rootItem.children[i];
					if (currentItem){
						if (currentItem.type == ProjectItemType.BIN){
							$._PPP_.walkAllBinsForFootage(currentItem, outPath.fsName);
						} else {
							$._PPP_.dumpProjectItemXMP(currentItem, outPath.fsName);
						}
					}
				}
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	exportAAF : function() {
		var sessionCounter	= 1;
		if (app.project.activeSequence){
			var outputPath	= Folder.selectDialog("Choose the output directory");
			if (outputPath) {
				var absPath			= outputPath.fsName;
				var outputName		= String(app.project.name);
				var array			= outputName.split('.', 2);
				outputName 			= array[0]+ sessionCounter + '.' + array[1]; 

				sessionCounter++;
				var fullOutPath 	= absPath + $._PPP_.getSep() + outputName + '.aaf';
				//var optionalPathToOutputPreset = null;  New in 11.0.0, you can specify an output preset.

				app.project.exportAAF(	app.project.activeSequence,			// which sequence
										fullOutPath,						// output path
										1,									// mix down video?
										0,									// explode to mono?
										96000,								// sample rate
										16,									// bits per sample
										0,									// embed audio? 
										0,									// audio file format? 0 = aiff, 1 = wav
										0,									// trim sources? 
										0/*,								// number of 'handle' frames
										optionalPathToOutputPreset*/);		// optional; .epr file to use
			} else {
				$._PPP_.updateEventPanel("Couldn't create AAF output.");
			 }
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	setScratchDisk : function (){
		var scratchPath = Folder.selectDialog("Choose new scratch disk directory");
		if ((scratchPath) && scratchPath.exists) {
			app.setScratchDiskPath(scratchPath.fsName, ScratchDiskType.FirstAutoSaveFolder); // see ScratchDiskType object, in ESTK.
		}
	},

	getSequenceProxySetting : function() {
		var returnVal	= 'No sequence detected.';
		var seq			= app.project.activeSequence;
		if (seq) {
			if (seq.getEnableProxies() > 0) {
				returnVal	= 'true';
			} else {
				returnVal	= 'false';
			}
		}
		return returnVal;
	},

	toggleProxyState : function() {
		var seq	= app.project.activeSequence;
		if (seq) {
			var update	= "Proxies for " + seq.name + " turned ";
			if (seq.getEnableProxies() > 0) {
				seq.setEnableProxies(false);
				update	= update + "OFF.";
				app.setSDKEventMessage(update, 'info');
			} else {
				seq.setEnableProxies(true);
				update	= update + "ON.";
				app.setSDKEventMessage(update, 'info');
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	setProxiesON : function () {
		var firstProjectItem = app.project.rootItem.children[0]; 
		if (firstProjectItem) {
			if (firstProjectItem.canProxy()){
				var shouldAttachProxy	= true;
				if (firstProjectItem.hasProxy()) {
					shouldAttachProxy	= confirm(firstProjectItem.name + " already has an assigned proxy. Re-assign anyway?", false, "Are you sure...?");
				}
				if (shouldAttachProxy) {
					var proxyPath	= File.openDialog("Choose proxy for " + firstProjectItem.name + ":" );
					if (proxyPath.exists){
						firstProjectItem.attachProxy(proxyPath.fsName, 0);
					} else {
						$._PPP_.updateEventPanel("Could not attach proxy from " + proxyPath + ".");
					}
				}
			} else {
				$._PPP_.updateEventPanel("Cannot attach a proxy to " + firstProjectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project item available.");
		}
	},

	clearCache : function () {
		app.enableQE();
		MediaType 	= {};

		// Magical constants from Premiere Pro's internal automation.

		MediaType.VIDEO = "228CDA18-3625-4d2d-951E-348879E4ED93";
		MediaType.AUDIO = "80B8E3D5-6DCA-4195-AEFB-CB5F407AB009";
		MediaType.ANY	= "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";
		qe.project.deletePreviewFiles(MediaType.ANY);
		$._PPP_.updateEventPanel("All video and audio preview files deleted.");
	},
	
	randomizeSequenceSelection : function (){
		var sequence			= app.project.activeSequence;

		if (sequence){
			var trackGroups			= [ sequence.audioTracks, sequence.videoTracks ];
			var trackGroupNames		= [ "audioTracks", "videoTracks" ];
			var updateUI			= true;
			var before;

			for(var gi = 0; gi<2; gi++)	{
				$._PPP_.message(trackGroupNames[gi]);
				group	= trackGroups[gi];
				for(var ti=0; ti<group.numTracks; ti++){
					var track		= group[ti];
					var clips		= track.clips;
					var transitions	= track.transitions;
					var beforeSelected;
					var afterSelected;

					$._PPP_.message("track : " + ti + "	 clip count: " + clips.numTracks + "	  transition count: " + transitions.numTracks);	 

					for(var ci=0; ci<clips.numTracks; ci++){
						var clip	= clips[ci];
						name		= (clip.projectItem === undefined ? "<null>" : clip.projectItem.name);
						before		= clip.isSelected();

						// randomly select clips
						clip.setSelected((Math.random() > 0.5), updateUI);

						// Note; there's no good place to exercise this code yet, but
						// I wanted to provide example usage. 

						var allClipsInThisSequenceFromSameSource = clip.getLinkedItems();
						
						$._PPP_.message("Found " + allClipsInThisSequenceFromSameSource.numItems + " clips from " + clip.projectItem.name + ", in this sequence.");	 

						beforeSelected	= before ? "Y" : "N";			  
						afterSelected	= clip.selected ? "Y" : "N";
						$._PPP_.message("clip : " + ci + "	 " + name + "		" + beforeSelected + " -> " + afterSelected);		 
					}

					for(var tni=0; tni<transitions.numTracks; ++tni){
						var transition	= transitions[tni];
						before			= transition.isSelected();
			
						// randomly select transitions
						transition.setSelected((Math.random() > 0.5), updateUI);

						beforeSelected	= before ? "Y" : "N";			  
						afterSelected	= transition.selected ? "Y" : "N";

						$._PPP_.message('transition: ' + tni + "		" + beforeSelected + " -> " + afterSelected);
					}
				}
			}			
		} else {
			$._PPP_.updateEventPanel("No active sequence found.");
		}
		
	},

	// Define a couple of callback functions, for AME to use during render.
	
	message : function (msg) {
		$.writeln(msg);	 // Using '$' object will invoke ExtendScript Toolkit, if installed.
	},
	
	onEncoderJobComplete : function (jobID, outputFilePath) {
		var eoName;

		if (Folder.fs == 'Macintosh') {
			eoName = "PlugPlugExternalObject";							
		} else {
			eoName = "PlugPlugExternalObject.dll";
		}
				
		var suffixAddedByPPro	= '_1'; // You should really test for any suffix.
		var withoutExtension	= outputFilePath.slice(0,-4); // trusting 3 char extension
		var lastIndex			= outputFilePath.lastIndexOf(".");
		var extension			= outputFilePath.substr(lastIndex + 1);

		if (outputFilePath.indexOf(suffixAddedByPPro)){
			$._PPP_.updateEventPanel(" Output filename was changed: the output preset name may have been added, or there may have been an existing file with that name. This would be a good place to deal with such occurrences.");
		}
				
		var mylib		= new ExternalObject('lib:' + eoName);
		var eventObj	= new CSXSEvent();

		eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
		eventObj.data	= "Rendered Job " + jobID + ", to " + outputFilePath + ".";

		eventObj.dispatch();
	},

	onEncoderJobError : function (jobID, errorMessage) {
		var eoName; 

		if (Folder.fs === 'Macintosh') {
			eoName	= "PlugPlugExternalObject";							
		} else {
			eoName	= "PlugPlugExternalObject.dll";
		}
				
		var mylib		= new ExternalObject('lib:' + eoName);
		var eventObj	= new CSXSEvent();

		eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
		eventObj.data	= "Job " + jobID + " failed, due to " + errorMessage + ".";
		eventObj.dispatch();
	},
	
	onEncoderJobProgress : function (jobID, progress) {
		$._PPP_.message('onEncoderJobProgress called. jobID = ' + jobID + '. progress = ' + progress + '.');
	},

	onEncoderJobQueued : function (jobID) {
		app.encoder.startBatch();
	},

	onEncoderJobCanceled : function (jobID) {
		$._PPP_.message('OnEncoderJobCanceled called. jobID = ' + jobID +  '.');
	},

	onPlayWithKeyframes  : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var firstVideoTrack	= seq.videoTracks[0];
			if (firstVideoTrack){
				var firstClip	= firstVideoTrack.clips[0];
				if (firstClip){
					var clipComponents	= firstClip.components;
					if (clipComponents){
						for (var i = 0; i < clipComponents.numItems; ++i){
							$._PPP_.message('component ' + i + ' = ' + clipComponents[i].matchName + ' : ' + clipComponents[i].displayName);
						}
						if (clipComponents.numItems > 2){
							
							// 0 = clip
							// 1 = Opacity
							var blur	= clipComponents[2]; // Assume Gaussian Blur is the first effect applied to the clip.
							if (blur){
								var blurProps	= blur.properties;
								if (blurProps){
									for( var j = 0; j < blurProps.numItems; ++j){
										$._PPP_.message('param ' + j + ' = ' + blurProps[j].displayName);
									}
									var blurriness	= blurProps[0];
									if (blurriness){
										if (!blurriness.isTimeVarying()){
											blurriness.setTimeVarying(true);
										}
										for(var k = 0; k < 20; ++k){
											updateUI	= (k==9);  		// Decide how often to update PPro's UI
											blurriness.addKey(k);
											var blurVal	= Math.sin(3.14159*i/5)*20+25;
											blurriness.setValueAtKey(k, blurVal, updateUI);
										}
									}
									var repeatEdgePixels	= blurProps[2];
									if (repeatEdgePixels){
										if (!repeatEdgePixels.getValue()){
											updateUI	= true;
											repeatEdgePixels.setValue(true, updateUI);
										}
									}
									// look for keyframe nearest to 4s with 1/10 second tolerance
									var keyFrameTime	= blurriness.findNearestKey(4.0, 0.1);
									if (keyFrameTime !== undefined){
										$._PPP_.message('Found keyframe = ' + keyFrameTime.seconds);
									} else {
										$._PPP_.message('Keyframe not found.');
									}

									// scan keyframes, forward

									keyFrameTime	= blurriness.findNearestKey(0.0, 0.1);
									var lastKeyFrameTime	= keyFrameTime;
									while(keyFrameTime !== undefined){
										$._PPP_.message('keyframe @ ' + keyFrameTime.seconds);
										lastKeyFrameTime	= keyFrameTime;
										keyFrameTime		= blurriness.findNextKey(keyFrameTime);
									}

									// scan keyframes, backward
									keyFrameTime	= lastKeyFrameTime;
									while(keyFrameTime	!== undefined){
										$._PPP_.message('keyframe @ ' + keyFrameTime.seconds);
										lastKeyFrameTime	= keyFrameTime;
										keyFrameTime		= blurriness.findPreviousKey(keyFrameTime);
									}

									// get all keyframes

									var blurKeyframesArray	= blurriness.getKeys();
									if (blurKeyframesArray){
										$._PPP_.message(blurKeyframesArray.length + ' keyframes found');
									}

									// remove keyframe at 19s
									blurriness.removeKey(19);

									// remove keyframes in range from 0s to 5s
									var shouldUpdateUI	= true;
									blurriness.removeKeyRange(0,5, shouldUpdateUI);
								}

						} else {
								$._PPP_.updateEventPanel("Please apply the Gaussian Blur effect to the first clip in the first video track of the active sequence.");
					}
						}
					}
				}
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence found.");
		}
	},

	extractFileNameFromPath : function (fullPath){
		var lastDot	= fullPath.lastIndexOf(".");
		var lastSep	= fullPath.lastIndexOf("/");

		if (lastDot > -1){
			return fullPath.substr( (lastSep +1), (fullPath.length - (lastDot + 1)));
		} else {
			return fullPath;
		}
	},

	onProxyTranscodeJobComplete : function (jobID, outputFilePath) {
		var suffixAddedByPPro	= '_1'; // You should really test for any suffix.
		var withoutExtension	= outputFilePath.slice(0,-4); // trusting 3 char extension
		var lastIndex			= outputFilePath.lastIndexOf(".");
		var extension			= outputFilePath.substr(lastIndex + 1);

		var wrapper		= [];
		wrapper[0]		= outputFilePath;
		
		var nameToFind	= 'Proxies generated by PProPanel';
		var targetBin	= $._PPP_.getPPPInsertionBin();
		if (targetBin){
			app.project.importFiles(wrapper);
		}
	},

	onProxyTranscodeJobError : function  (jobID, errorMessage) {
			$._PPP_.updateEventPanel(errorMessage);
	},

	onProxyTranscodeJobQueued : function (jobID) {
		 app.encoder.startBatch();
	},

	ingestFiles : function(outputPresetPath) {
		app.encoder.bind('onEncoderJobComplete',	$._PPP_.onProxyTranscodeJobComplete);
		app.encoder.bind('onEncoderJobError',		$._PPP_.onProxyTranscodeJobError);
		app.encoder.bind('onEncoderJobQueued',		$._PPP_.onProxyTranscodeJobQueued);
		app.encoder.bind('onEncoderJobCanceled',	$._PPP_.onEncoderJobCanceled);

		if (app.project) {
			var fileOrFilesToImport	= File.openDialog (	"Choose full resolution files to import", 	// title
														0, 											// filter available files? 
														true); 										// allow multiple?
			if (fileOrFilesToImport) {
 				var nameToFind	= 'Proxies generated by PProPanel';
				var targetBin	= $._PPP_.searchForBinWithName(nameToFind);
				if (targetBin === 0) {
					// If panel can't find the target bin, it creates it.
					app.project.rootItem.createBin(nameToFind);
					targetBin = $._PPP_.searchForBinWithName(nameToFind);
				}	
				if (targetBin){
					targetBin.select();
					var importThese = []; // We have an array of File objects; importFiles() takes an array of paths.
					if (importThese){
						for (var i = 0; i < fileOrFilesToImport.length; i++) {
							importThese[i]			= fileOrFilesToImport[i].fsName;
							var justFileName		= extractFileNameFromPath(importThese[i]);
							var suffix				= '_PROXY.mp4'; 
							var containingPath		= fileOrFilesToImport[i].parent.fsName;
							var completeProxyPath	= containingPath + $._PPP_.getSep() + justFileName + suffix; 

							var jobID				=	app.encoder.encodeFile(fileOrFilesToImport[i].fsName, 
														completeProxyPath, 
														outputPresetPath, 
														0);
						}

						app.project.importFiles(importThese, 
												1,				// suppress warnings 
												targetBin,
												0);				// import as numbered stills
					}
				} else {
					$._PPP_.updateEventPanel("Could not find or create target bin.");
				}
			} else {
				$._PPP_.updateEventPanel("No files to import.");
			}
		} else {
			$._PPP_.updateEventPanel("No project found.");
		}
	},

	insertOrAppend : function() {
		var seq = app.project.activeSequence;
		if (seq){
			var first = app.project.rootItem.children[0];
			if (first){
				var vTrack1 = seq.videoTracks[0];
				if (vTrack1){
					
					// If there are already clips in this track,
					// append this one to the end. Otherwise, 
					// insert at start time.

					if (vTrack1.clips.numItems > 0){
						var lastClip = vTrack1.clips[(vTrack1.clips.numItems - 1)];
						if (lastClip){
							vTrack1.insertClip(first, lastClip.end.seconds);
						}
					}else {
							vTrack1.insertClip(first, '00;00;00;00');
					}
				} else {
					$._PPP_.updateEventPanel("Could not find first video track.");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence found.");
		}
	},

	overWrite : function() {
		var seq = app.project.activeSequence;
		if (seq){
			var first = app.project.rootItem.children[0];
			if (first) {
				var vTrack1 = seq.videoTracks[0];
				if (vTrack1){
					var now = seq.getPlayerPosition();
					vTrack1.overwriteClip(first, now.seconds);
				} else {
					$._PPP_.updateEventPanel("Could not find first video track.");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence found.");
		}
	},

	closeFrontSourceClip : function() {
		app.sourceMonitor.closeClip();
	},
	
	closeAllClipsInSourceMonitor : function() {
		app.sourceMonitor.closeAllClips();
	},

	changeLabel : function () {
		var first = app.project.rootItem.children[0];
		if (first){
			var newLabel = 4;  // 4 = Cerulean. 0 = Violet, 15 = Yellow.
			var currentLabel = first.getColorLabel();
			app.setSDKEventMessage("Previous Label color = " + currentLabel + ".", 'info');
			first.setColorLabel(newLabel);
			app.setSDKEventMessage("New Label color = " + newLabel + ".", 'info');
		} else {
			$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
		}
	},

	getPPPInsertionBin : function () {
		var nameToFind = "Here's where PProPanel puts things.";

		var targetBin	= $._PPP_.searchForBinWithName(nameToFind);

		if (targetBin === 0) {
			// If panel can't find the target bin, it creates it.
			app.project.rootItem.createBin(nameToFind);
			targetBin	= $._PPP_.searchForBinWithName(nameToFind);
		}
		if (targetBin) {
			targetBin.select();
			return targetBin;
		}
	},

	importComps : function () {
		var targetBin = $._PPP_.getPPPInsertionBin();
		if (targetBin){
			var filterString = "";
			if (Folder.fs === 'Windows'){
				filterString = "All files:*.*";
			}
			var aepToImport	= 	File.openDialog (	"Choose After Effects project", 	// title
													filterString,						// filter available files? 
													false);								// allow multiple?
			if (aepToImport) {
				var importAll 	=	confirm("Import all compositions in project?", false, "Import all?");
				if (importAll){
					var result 	= 	app.project.importAllAEComps(aepToImport.fsName, targetBin);
				} else {
					var compName = 	prompt(	'Name of composition to import?',	 
											'', 
											'Which Comp to import');
					if (compName){
						var importAECompResult = app.project.importAEComps(aepToImport.fsName, [compName], targetBin);
					} else {
						$._PPP_.updateEventPanel("Could not find Composition.");
					}
				}
			} else {
				$._PPP_.updateEventPanel("Could not open project.");
			}
		} else {
			$._PPP_.updateEventPanel("Could not find or create target bin.");
		}
	},
	
	consolidateProject : function () {
		var pmo = app.projectManager.options;

		if (pmo) {
			var filterString = "";
			if (Folder.fs === 'Windows'){
				filterString = "Output Presets:*.epr";
			}
	
			var outFolder			= Folder.selectDialog("Choose output directory.");
			if (outFolder) {

				var presetPath 			= "";
				var useSpecificPreset	= confirm("Would you like to select an output preset?", false, "Are you sure...?");
				if (useSpecificPreset){
					var useThisEPR	= File.openDialog (	"Choose output preset (.epr file)", 	// title
														filterString, 							// filter available files? 
														false); 								// allow multiple?

					if (useThisEPR){
						pmo.clipTranscoderOption = pmo.CLIP_TRANSCODE_MATCH_PRESET;	
						pmo.encoderPresetFilePath 		=	useThisEPR.fsName;
					}
				} else {
					pmo.clipTranscoderOption = pmo.CLIP_TRANSCODE_MATCH_SEQUENCE;	
				}
			
				var processAllSequences	= confirm("Process all sequences? No = just the first sequence found.", true, "Process all?");
				
				if (processAllSequences){
					pmo.includeAllSequences = true;
				} else {
					pmo.includeAllSequences = false;
					pmo.affectedSequences 	= [app.project.sequences[0]];
				}
			
				pmo.clipTransferOption 			= 	pmo.CLIP_TRANSFER_TRANSCODE;
				pmo.convertAECompsToClips		=	false;
				pmo.convertSyntheticsToClips 	=	false;
				pmo.copyToPreventAlphaLoss 		=	false;
				pmo.destinationPath 			=	outFolder.fsName;
				pmo.excludeUnused 				=	false;
				pmo.handleFrameCount 			=	0;
				pmo.includeConformedAudio		=	false;
				pmo.includePreviews 			=	false;
				pmo.renameMedia					=	false;

				var result		= app.projectManager.process(app.project);
				var errorList 	= app.projectManager.errors;
				
				if(errorList.length){
					for (var k = 0; k < errorList.length; k++){
						$._PPP_.updateEventPanel(errorList[k][1]);
					}
				} else {
					$._PPP_.updateEventPanel(app.project.name + " successfully processed to " + outFolder.fsName + ".");
				}
				return result;
			}
		}
	},

	importMoGRT : function () {
		var activeSeq = app.project.activeSequence;
		if (activeSeq) {
			var filterString = "";
			if (Folder.fs === 'Windows'){
				filterString = "Motion Graphics Templates:*.mogrt";
			}
			var mogrtToImport	= 	File.openDialog (	"Choose MoGRT", 	// title
														0, 					// filter available files? 
														false);				// allow multiple?
			if (mogrtToImport){
				var targetTime		= activeSeq.getPlayerPosition();
				var vidTrackOffset  = 0;
				var audTrackOffset	= 0;
				var newTrackItem 	= activeSeq.importMGT(	mogrtToImport.fsName, 
															targetTime.ticks, 
															vidTrackOffset,
															audTrackOffset);
				if (newTrackItem){
					var moComp = newTrackItem.getMGTComponent();
					if (moComp){
						var params			= 	moComp.properties;
						var srcTextParam	=	params.getParamForDisplayName("Source Text");
						if (srcTextParam){
							var val	= srcTextParam.getValue();
							srcTextParam.setValue("New value set by PProPanel!");
						}
					}
				}
			} else {
				app.setSDKEventMessage('Unable to import ' + mogrtToImport.fsName + '.', 'error');  
			}
		} 
	},

	reportCurrentProjectSelection : function() {
		var viewIDs = app.getProjectViewIDs(); // sample code optimized for a single open project
		viewSelection = app.getProjectViewSelection(viewIDs[0]);
		$._PPP_.projectPanelSelectionChanged(viewSelection, viewIDs[0]);
	},

	randomizeProjectSelection : function() {
		var viewIDs 					= app.getProjectViewIDs();
		var firstProject 				= app.getProjectFromViewID(viewIDs[0]);
		var arrayOfRandomProjectItems 	= [];
		
		for (var b = 0; b < app.project.rootItem.children.numItems; b++){
			var currentProjectItem = app.project.rootItem.children[b];
			if (Math.random() > 0.5){
				arrayOfRandomProjectItems.push(currentProjectItem);
			}
		}
		if (arrayOfRandomProjectItems.length > 0){
			app.setProjectViewSelection(arrayOfRandomProjectItems, viewIDs[0]);
		}
	},

	updateFrameRate : function() {
		var item = app.project.rootItem.children[0]; 
		if (item) {
			if ((item.type == ProjectItemType.FILE) || (item.type == ProjectItemType.CLIP)){
				// If there is an item, and it's either a clip or file...
				item.setOverrideFrameRate(23.976); 
			} else {
				$._PPP_.updateEventPanel('You cannot override the frame rate of bins or sequences.');
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	onItemAddedToProject : function(whichProject, addedProjectItem) {
		var msg = addedProjectItem.name + " was added to " + whichProject + "."
		$._PPP_.updateEventPanel(msg);
	},

	registerItemAddedFxn : function() {
		app.onItemAddedToProjectSuccess = $._PPP_.onItemAddedToProject;
	},

	myOnProjectChanged : function(documentID){
        var msg = 'Project with ID ' + documentID + ' Changed.';
		// Commented out, as this happens a LOT.
		// $._PPP_.updateEventPanel(msg);
	},

	registerProjectChangedFxn : function() {
		app.bind('onProjectChanged', $._PPP_.myOnProjectChanged);
	},

	confirmPProHostVersion : function() {
		var version = parseFloat(app.version);
		if (version < 12.1){
			$._PPP_.updateEventPanel("Note: PProPanel relies on features added in 12.1, but is currently running in " + version + ".");
		}
	},
};
