/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2020 Adobe
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe.
**************************************************************************/

// time display types

var TIMEDISPLAY_24Timecode				= 100;
var TIMEDISPLAY_25Timecode				= 101;
var TIMEDISPLAY_2997DropTimecode		= 102;
var TIMEDISPLAY_2997NonDropTimecode		= 103;
var TIMEDISPLAY_30Timecode				= 104;
var TIMEDISPLAY_50Timecode				= 105;
var TIMEDISPLAY_5994DropTimecode		= 106;
var TIMEDISPLAY_5994NonDropTimecode		= 107;
var TIMEDISPLAY_60Timecode				= 108;
var TIMEDISPLAY_Frames					= 109;
var TIMEDISPLAY_23976Timecode			= 110;
var TIMEDISPLAY_16mmFeetFrames			= 111;
var TIMEDISPLAY_35mmFeetFrames			= 112;
var TIMEDISPLAY_48Timecode				= 113;
var TIMEDISPLAY_AudioSamplesTimecode	= 200;
var TIMEDISPLAY_AudioMsTimecode			= 201;

var KF_Interp_Mode_Linear				= 0;
var KF_Interp_Mode_Hold					= 4;
var KF_Interp_Mode_Bezier				= 5;
var KF_Interp_Mode_Time					= 6;

// field type constants

var FIELDTYPE_Progressive	= 0;
var FIELDTYPE_UpperFirst	= 1;
var FIELDTYPE_LowerFirst	= 2;

// audio channel types

var AUDIOCHANNELTYPE_Mono			= 0;
var AUDIOCHANNELTYPE_Stereo			= 1;
var AUDIOCHANNELTYPE_51				= 2;
var AUDIOCHANNELTYPE_Multichannel	= 3;
var AUDIOCHANNELTYPE_4Channel		= 4;
var AUDIOCHANNELTYPE_8Channel		= 5;

// vr projection type

var VRPROJECTIONTYPE_None				= 0;
var VRPROJECTIONTYPE_Equirectangular	= 1;

// vr stereoscopic type

var VRSTEREOSCOPICTYPE_Monoscopic		= 0;
var VRSTEREOSCOPICTYPE_OverUnder		= 1;
var VRSTEREOSCOPICTYPE_SideBySide		= 2;

// constants used when clearing cache

var MediaType_VIDEO		= "228CDA18-3625-4d2d-951E-348879E4ED93"; // Magical constants from Premiere Pro's internal automation.
var MediaType_AUDIO		= "80B8E3D5-6DCA-4195-AEFB-CB5F407AB009";
var MediaType_ANY		= "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";

var MediaType_Audio = 0;	// Constants for working with setting value.
var MediaType_Video = 1;

var Colorspace_601 		= 0;
var Colorspace_709 		= 1;
var Colorspace_2020		= 2;
var Colorspace_2100HLG	= 3;

var BitPrecision_8bit	= 0;
var BitPrecision_10bit	= 1;
var BitPrecision_Float	= 2;
var BitPrecision_HDR	= 3;

var NOT_SET = "-400000";

$._PPP_={

	getVersionInfo : function () {
		return 'PPro ' + app.version + 'x' + app.build;
	},

	getUserName : function () {
		var userName	= "User name not found.";
		var homeDir		= new File('~/');
		if (homeDir) {
			userName = homeDir.displayName;
			homeDir.close();
		}
		return userName;
	},

	keepPanelLoaded : function () {
		app.setExtensionPersistent("com.adobe.PProPanel", 0); // 0, while testing (to enable rapid reload); 1 for "Never unload me, even when not visible."
	},

	updateAllProjectItems : function () {
		var numItems = app.project.rootItem.children.numItems;
		for (var i = 0; i < numItems; i++) {
			var currentItem = app.project.rootItem.children[i];
			if (currentItem) {
				currentItem.refreshMedia();
			}
		}
	},

	getSep : function () {
		if (Folder.fs === 'Macintosh') {
			return '/';
		} else {
			return '\\';
		}
	},

	saveProject : function () {
		app.project.save();
	},

	exportCurrentFrameAsPNG : function (presetPath) {
		var seq = app.project.activeSequence;
		if (seq) {
			var currentSeqSettings	= app.project.activeSequence.getSettings();
			if (currentSeqSettings){
				var currentTime	= seq.getPlayerPosition();
				if (currentTime){
					var oldInPoint 			= seq.getInPointAsTime();
					var oldOutPoint 		= seq.getOutPointAsTime();
					var offsetTime 			= currentTime.seconds + 0.033;  // Todo: Add fancy timecode math, to get one frame, given current sequence timebase
					
					seq.setInPoint(currentTime.seconds);
					seq.setOutPoint(offsetTime);

					// Create a file name, based on timecode of frame.
					var timeAsText				= currentTime.getFormatted(currentSeqSettings.videoFrameRate, app.project.activeSequence.videoDisplayFormat);
					var removeThese 			= /:|;/ig; 				// Why? Because Windows chokes on colons in file names.
					var tidyTime 				= timeAsText.replace(removeThese, '_');
					var outputPathInToOut 		= new File("~/Desktop/output/in_to_out");
					var outputFileNameInToOut	= outputPathInToOut.fsName + $._PPP_.getSep() + seq.name + '___' + tidyTime  + '___' + ".png";

					var removeUponCompletion 	= 1;
					var startQueueImmediately 	= false;
					var jobID_InToOut 			= app.encoder.encodeSequence(	seq, 
																				outputFileNameInToOut, 
																				presetPath, 
																				app.encoder.ENCODE_IN_TO_OUT, 
																				removeUponCompletion,
																				startQueueImmediately);
					
					// put in and out points back where we found them.

					seq.setInPoint(oldInPoint.seconds);
					seq.setOutPoint(oldOutPoint.seconds);
				}
			}
		}
	},

	renameProjectItem : function () {
		var item = app.project.rootItem.children[0]; // assumes the zero-th item in the project is footage.
		if (item) {
			item.name = item.name + ", updated by PProPanel.";
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	getActiveSequenceName : function () {
		if (app.project.activeSequence) {
			return app.project.activeSequence.name;
		} else {
			return "No active sequence.";
		}
	},

	projectPanelSelectionChanged : function (eventObj) { // Note: This message is also triggered when the user opens or creates a new project.
		var message 		= "";
		var projectItems	= eventObj;
		if (projectItems) {
			if (projectItems.length) {
				var remainingArgs	=	projectItems.length;
				var view			=	eventObj.viewID;
				message				=	remainingArgs + " items selected: ";

				for (var i = 0; i < projectItems.length; i++) {		// Concatenate selected project item names, into message.
					message += projectItems[i].name;
					remainingArgs--;
					if (remainingArgs > 1) {
						message += ', ';
					}
					if (remainingArgs === 1) {
						message += ", and ";
					}
					if (remainingArgs === 0) {
						message += ".";
					}
				}
			} else {
				message = 'No items selected.';
			}
		}
		$._PPP_.updateEventPanel(message);
	},

	registerProjectPanelSelectionChangedFxn : function () {
		app.bind("onSourceClipSelectedInProjectPanel", $._PPP_.projectPanelSelectionChanged);
	},

	registerItemsAddedToProjectFxn : function () {
		app.bind("onItemsAddedToProjectSuccess", $._PPP_.onItemsAddedToProject);
	},

	saveCurrentProjectLayout : function () {
		var currentProjPanelDisplay = app.project.getProjectPanelMetadata();
		if (currentProjPanelDisplay) {
			var outFileName			= app.project.name + '_Previous_Project_Panel_Display_Settings.xml';
			var actualProjectPath	= new File(app.project.path);
			var projDir 			= actualProjectPath.parent;
			if (actualProjectPath) {
				var completeOutputPath	= projDir + $._PPP_.getSep() + outFileName;
				var outFile				= new File(completeOutputPath);
				if (outFile) {
					outFile.encoding = "UTF8";
					outFile.open("w", "TEXT", "????");
					outFile.write(currentProjPanelDisplay);
					$._PPP_.updateEventPanel("Saved layout to next to the project.");
					outFile.close();
				}
				actualProjectPath.close();
			}
		} else {
			$._PPP_.updateEventPanel("Could not retrieve current project layout.");
		}
	},

	setProjectPanelMeta : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "XML files:*.xml";
		}


		var runningOnWindows = (Folder.fs === 'Windows');

		if (runningOnWindows){
			var fileToOpen = File.openDialog(	"Choose Project panel layout to open.",
												filterString,
												false);
		} else {
			var fileToOpen = File.openDialog(	"Choose Project panel layout to open.",
												checkMacFileType,
												false);
		}

		if (fileToOpen) {
			if (fileToOpen.fsName.indexOf('.xml')) { // We should really be more careful, but hey, it says it's XML!
				fileToOpen.encoding = "UTF8";
				fileToOpen.open("r", "TEXT", "????");
				var fileContents = fileToOpen.read();
				if (fileContents) {
					app.project.setProjectPanelMetadata(fileContents);
					$._PPP_.updateEventPanel("Updated layout from .xml file.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No valid layout file chosen.");
		}
	},

	exportSequenceAsPrProj : function () {
		var activeSequence	= app.project.activeSequence;
		if (activeSequence) {
			var startTimeOffset	= activeSequence.zeroPoint;
			var prProjExtension	= '.prproj';
			var outputName		= activeSequence.name;
			var outFolder		= Folder.selectDialog();
			if (outFolder) {
				var completeOutputPath = 	outFolder.fsName +
											$._PPP_.getSep() +
											outputName +
											prProjExtension;

				app.project.activeSequence.exportAsProject(completeOutputPath);

				$._PPP_.updateEventPanel("Exported " + app.project.activeSequence.name + " to " + completeOutputPath + ".");
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

		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	createSequenceMarkers : function () {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var markers = activeSequence.markers;
			if (markers) {
				var numMarkers = markers.numMarkers;
				if (numMarkers > 0) {
					var marker_index = 1;
					for (var current_marker = markers.getFirstMarker(); current_marker !== undefined; current_marker = markers.getNextMarker(current_marker)) {
						if (current_marker.name !== "") {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' name = ' + current_marker.name + '.');
						} else {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' has no name.');
						}
						$._PPP_.updateEventPanel('Marker ' + marker_index + ' GUID = ' + current_marker.guid + '.');

						if (current_marker.end.seconds > 0) {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' duration = ' + (current_marker.end.seconds - current_marker.start.seconds) + ' seconds.');
						} else {
							$._PPP_.updateEventPanel('Marker ' + marker_index + ' has no duration.');
						}
						$._PPP_.updateEventPanel('Marker ' + marker_index + ' starts at ' + current_marker.start.seconds + ' seconds.');
						marker_index = marker_index + 1;
					}
				}
			}
			var newCommentMarker			= markers.createMarker(12.345);
			newCommentMarker.name			= 'Marker created by PProPanel.';
			newCommentMarker.comments		= 'Here are some comments, inserted by PProPanel.';
			newCommentMarker.end			= (newCommentMarker.seconds + 5.0);

			var newWebMarker				= markers.createMarker(14.345);
			newWebMarker.name				= 'Web marker created by PProPanel.';
			newWebMarker.comments			= 'Here are some comments, inserted by PProPanel.';
			newWebMarker.end				=  (newWebMarker.seconds + 3.0);
			newWebMarker.setTypeAsWebLink("http://www.adobe.com", "frame target");
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	exportFCPXML : function () {
		if (app.project.activeSequence) {
			var projPath 		= new File(app.project.path);
			var parentDir 		= projPath.parent;
			var outputName 		= app.project.activeSequence.name;
			var xmlExtension 	= '.xml';
			var outputPath 		= Folder.selectDialog("Choose the output directory");

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

	openInSource : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "All files:*.*";
		}
		var fileToOpen = File.openDialog("Choose file to open.", filterString, false);
		if (fileToOpen) {

			// It's often desirable to preview media in the source monitor, without forcing the
			// generation of audio peak files. Here's how to do so.

			var property		= 'BE.Prefs.Audio.AutoPeakGeneration';
			var initialValue	= app.properties.getProperty(property);
			var propValue		= false;
			var persistent		= 1;
			var allowToCreate	= true;
			if (initialValue === 'true') {
				app.properties.setProperty('BE.Prefs.Audio.AutoPeakGeneration', propValue, persistent, allowToCreate);
			}

			app.sourceMonitor.openFilePath(fileToOpen.fsName);

			if (initialValue === 'true') {
				app.properties.setProperty(property, initialValue, persistent, allowToCreate);
			}
			app.sourceMonitor.play(1.0); // playback speed as float, 1.0 = normal speed forward
			var position = app.sourceMonitor.getPosition();
			$._PPP_.updateEventPanel("Current Source monitor position: " + position.seconds + " seconds.");

			/* Example code for controlling scrubbing in Source monitor.

			app.enableQE();
			qe.source.player.startScrubbing();
			qe.source.player.scrubTo('00;00;00;11');
			qe.source.player.endScrubbing();
			qe.source.player.step();

			qe.source.player.play(playbackSpeed) // playbackSpeed must be between -4.0 and 4.0

			*/

			fileToOpen.close();
		} else {
			$._PPP_.updateEventPanel("No file chosen.");
		}
	},

	searchForBinWithName : function (nameToFind) {
		// deep-search a folder by name in project
		var deepSearchBin = function (inFolder) {
			if (inFolder && inFolder.name === nameToFind && inFolder.type === 2) {
				return inFolder;
			} else {
				for (var i = 0; i < inFolder.children.numItems; i++) {
					if (inFolder.children[i] && inFolder.children[i].type === 2) {
						var foundBin = deepSearchBin(inFolder.children[i]);
						if (foundBin) {
							return foundBin;
						}
					}
				}
			}
		};
		return deepSearchBin(app.project.rootItem);
	},

	importFiles : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "All files:*.*";
		}
		if (app.project) {
			var fileOrFilesToImport = File.openDialog(	"Choose files to import", // title
														filterString, // filter available files?
														true); // allow multiple?
			if (fileOrFilesToImport) {
				// We have an array of File objects; importFiles() takes an array of paths.
				var importThese = [];
				if (importThese) {
					for (var i = 0; i < fileOrFilesToImport.length; i++) {
						importThese[i] = fileOrFilesToImport[i].fsName;
					}
					var suppressWarnings 	= true;
					var importAsStills		= false;
					app.project.importFiles(importThese,
											suppressWarnings,
											app.project.getInsertionBin(),
											importAsStills);
				}
			} else {
				$._PPP_.updateEventPanel("No files to import.");
			}
		}
	},

	muteFun : function () {
		if (app.project.activeSequence) {
			for (var i = 0; i < app.project.activeSequence.audioTracks.numTracks; i++) {
				var currentTrack = app.project.activeSequence.audioTracks[i];
				if (Math.random() > 0.5) {
					var muteState = 0;
					if (currentTrack.isMuted()) {
						muteState = 1;
					}
					currentTrack.setMute(muteState);
				}
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	disableImportWorkspaceWithProjects : function () {
		var prefToModify 		= 'FE.Prefs.ImportWorkspace';
		var propertyExists 		= app.properties.doesPropertyExist(prefToModify);
		var propertyIsReadOnly 	= app.properties.isPropertyReadOnly(prefToModify);
		var propertyValue 		= app.properties.getProperty(prefToModify);

		app.properties.setProperty(prefToModify, "0", 1, false);
		var safetyCheck	= app.properties.getProperty(prefToModify);
		if (safetyCheck != propertyValue) {
			$._PPP_.updateEventPanel("Changed \'Import Workspaces with Projects\' from " + propertyValue + " to " + safetyCheck + ".");
		}
	},

	setWorkspace : function() {
		var desiredWSName 	= prompt('Which workspace would you like?', 'Editing', 'Which workspace?');
		var workspaces		= app.getWorkspaces();
		var foundIt			= false;
		if (workspaces) {
			$._PPP_.updateEventPanel(workspaces.length + " workspaces found.");
			for (var i = 0; ((i < workspaces.length) && (foundIt === false)); i++) {
				var currentWS = workspaces[i];
				if (currentWS === desiredWSName) {
					app.setWorkspace(currentWS);
					foundIt = true;
					$._PPP_.updateEventPanel("Workspace set to " + currentWS + ".");
				}
			}
			if (foundIt === false) {
				$._PPP_.updateEventPanel("Workspace named " + desiredWSName + " was not found.");
			}
		}
	},

	turnOffStartDialog : function () {
		var prefToModify 		= 'MZ.Prefs.ShowQuickstartDialog';
		var propertyExists 		= app.properties.doesPropertyExist(prefToModify);
		var propertyIsReadOnly 	= app.properties.isPropertyReadOnly(prefToModify);
		var originalValue 		= app.properties.getProperty(prefToModify);

		app.properties.setProperty(prefToModify, "0", 1, true); // optional 4th param:0 = non-persistent,  1 = persistent (default)
		var safetyCheck = app.properties.getProperty(prefToModify);
		if (safetyCheck != originalValue) {
			$._PPP_.updateEventPanel("Start dialog now OFF. Enjoy!");
		} else {
			$._PPP_.updateEventPanel("Start dialog was already OFF.");
		}
	},

	replaceMedia : function () {

		// 	Note: 	This method of changing paths for projectItems is from the time
		//			before PPro supported full-res AND proxy paths for each projectItem.
		//			This can still be used, and will change the hi-res projectItem path, but
		//			if your panel supports proxy workflows, it should rely instead upon
		//			projectItem.setProxyPath() instead.

		var firstProjectItem = app.project.rootItem.children[0];
		if (firstProjectItem) {
			if (firstProjectItem.canChangeMediaPath()) {

				// 	setScaleToFrameSize() ensures that for all clips created from this footage,
				//	auto scale to frame size will be ON, regardless of the current user preference.
				//	This is	important for proxy workflows, to avoid mis-scaling upon replacement.

				//	Addendum: This setting will be in effect the NEXT time the projectItem is added to a
				//	sequence; it will not affect or reinterpret clips from this projectItem, already in
				//	sequences.

				firstProjectItem.setScaleToFrameSize();
				var filterString = "";
				if (Folder.fs === 'Windows') {
					filterString = "All files:*.*";
				}
				var replacementMedia = File.openDialog( "Choose new media file, for " +
														firstProjectItem.name,
														filterString, // file filter
														false); // allow multiple?

				if (replacementMedia) {
					var suppressWarnings 	= true;
					firstProjectItem.name 	= replacementMedia.name + ", formerly known as " + firstProjectItem.name;
					firstProjectItem.changeMediaPath(replacementMedia.fsName, suppressWarnings);
					replacementMedia.close();
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't change path of " + firstProjectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	openProject : function () {
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "Premiere Pro project files:*.prproj";
		}
		var projToOpen = File.openDialog(	"Choose project:",
											filterString,
											false);
		if ((projToOpen) && projToOpen.exists) {
			app.openDocument(	projToOpen.fsName,	// Path to project
								false,				// suppress 'Convert Project' dialogs?
								false,				// suppress 'Locate Files' dialogs?
								false,				// suppress warning dialogs?
								false);				// prevent document from getting added to MRU list?
			projToOpen.close();
		}
	},

	exportFramesForMarkers : function () {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var markers 	= activeSequence.markers;
			var markerCount = markers.numMarkers;
			if (markerCount) {
				var firstMarker = markers.getFirstMarker();
				if (firstMarker){
					var previousMarker;
					activeSequence.setPlayerPosition(firstMarker.start.ticks);
					$._PPP_.exportCurrentFrameAsPNG();
					var currentMarker;
					for (var i = 0; i < markerCount; i++) {
						if (i === 0) {
							currentMarker = markers.getNextMarker(firstMarker);
						} else {
							currentMarker = markers.getNextMarker(previousMarker);
						}
						if (currentMarker) {
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

	createSequence : function (name) {
		var someID	= "xyz123";
		var seqName	= prompt('Name of sequence?', '<<<default>>>', 'Sequence Naming Prompt');
		app.project.createNewSequence(seqName, someID);
	},

	createSequenceFromPreset : function (presetPath) {
		app.enableQE();
		var seqName = prompt('Name of sequence?', '<<<default>>>', 'Sequence Naming Prompt');
		if (seqName) {
			qe.project.newSequence(seqName, presetPath);
		}
	},

	transcode : function (outputPresetPath) {
		app.encoder.bind('onEncoderJobComplete', 	$._PPP_.onEncoderJobComplete);
		app.encoder.bind('onEncoderJobError', 		$._PPP_.onEncoderJobError);
		app.encoder.bind('onEncoderJobProgress', 	$._PPP_.onEncoderJobProgress);
		app.encoder.bind('onEncoderJobQueued', 		$._PPP_.onEncoderJobQueued);
		app.encoder.bind('onEncoderJobCanceled', 	$._PPP_.onEncoderJobCanceled);

		var projRoot = app.project.rootItem.children;

		if (projRoot.numItems) {
			var firstProjectItem = app.project.rootItem.children[0];
			if (firstProjectItem) {

				app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.

				var fileOutputPath = Folder.selectDialog("Choose the output directory");
				if (fileOutputPath) {
					var regExp 		= new RegExp('[.]');
					var outputName 	= firstProjectItem.name.search(regExp);
					if (outputName 	== -1) {
						outputName 	= firstProjectItem.name.length;
					}
					var outFileName			= firstProjectItem.name.substr(0, outputName);
					outFileName				= outFileName.replace('/', '-');
					var completeOutputPath	= fileOutputPath.fsName + $._PPP_.getSep() + outFileName + '.mxf';
					var removeFromQueue		= 1;
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
		} else {
			$._PPP_.updateEventPanel("Project is empty.");
		}
	},

	transcodeExternal : function (outputPresetPath) {
		app.encoder.launchEncoder();
		var filterString = "";
		if (Folder.fs === 'Windows') {
			filterString = "All files:*.*";
		}
		var fileToTranscode = File.openDialog("Choose file to open.",
			filterString,
			false);
		if (fileToTranscode) {
			var fileOutputPath = Folder.selectDialog("Choose the output directory");
			if (fileOutputPath) {

				var srcInPoint = new Time();
				srcInPoint.seconds = 1.0; // encode start time at 1s (optional--if omitted, encode entire file)
				var srcOutPoint = new Time();
				srcOutPoint.seconds = 3.0; // encode stop time at 3s (optional--if omitted, encode entire file)
				var removeFromQueue = 0;

				var result = app.encoder.encodeFile(fileToTranscode.fsName,
													fileOutputPath.fsName,
													outputPresetPath,
													removeFromQueue,
													srcInPoint,
													srcOutPoint);
			}
		}
	},

	render : function (outputPresetPath) {
		app.enableQE();
		var activeSequence = qe.project.getActiveSequence(); // we use a QE DOM function, to determine the output extension.
		if (activeSequence) {
			var ameInstalled = false;
			var ameStatus = BridgeTalk.getStatus("ame");
			if (ameStatus == "ISNOTINSTALLED") {
				$._PPP_.updateEventPanel("AME is not installed.");
			} else {
				if (ameStatus == 'ISNOTRUNNING') {
					app.encoder.launchEncoder(); // This can take a while; let's get the ball rolling.
				}
				var seqInPointAsTime 	= app.project.activeSequence.getInPointAsTime();
				var seqOutPointAsTime 	= app.project.activeSequence.getOutPointAsTime();
				var useLast 			= false;
				var outputPath = app.encoder.lastExportMediaFolder();
				if (outputPath) {
					useLast = confirm("Use most recent output folder", false, "Use most recent?");
				} else {
					if (useLast === false) {
						var outFolder = Folder.selectDialog("Choose the output directory");
						if (outFolder) {
							outputPath = outFolder.fsName;
						}
					}
				}
				var outPreset = new File(outputPresetPath);
				if (outPreset.exists === true) {
					var outputFormatExtension = activeSequence.getExportFileExtension(outPreset.fsName);
					if (outputFormatExtension) {
						var outputFilename = activeSequence.name + '.' + outputFormatExtension;

						var fullPathToFile = 	outputPath +
												activeSequence.name +
												"." +
												outputFormatExtension;

						var outFileTest = new File(fullPathToFile);
						if (outFileTest.exists) {
							var destroyExisting = confirm("A file with that name already exists; overwrite?", false, "Are you sure...?");
							if (destroyExisting) {
								outFileTest.remove();
								outFileTest.close();
							}
						}

						app.encoder.bind('onEncoderJobComplete', 	$._PPP_.onEncoderJobComplete);
						app.encoder.bind('onEncoderJobError', 		$._PPP_.onEncoderJobError);
						app.encoder.bind('onEncoderJobProgress', 	$._PPP_.onEncoderJobProgress);
						app.encoder.bind('onEncoderJobQueued', 		$._PPP_.onEncoderJobQueued);
						app.encoder.bind('onEncoderJobCanceled', 	$._PPP_.onEncoderJobCanceled);

						app.encoder.setSidecarXMPEnabled(0);	// use these 0 or 1 settings to disable some/all metadata creation.
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

						var removeFromQueueUponSuccess = 1;
						var jobID = app.encoder.encodeSequence(	app.project.activeSequence,
																fullPathToFile,
																outPreset.fsName,
																app.encoder.ENCODE_WORKAREA,
																removeFromQueueUponSuccess);

						$._PPP_.updateEventPanel('jobID = ' + jobID);
						outPreset.close();
					}
				} else {
					$._PPP_.updateEventPanel("Could not find output preset.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	saveProjectCopy : function () {
		var sessionCounter	= 1;
		var originalPath	= app.project.path;
		var outputPath		= Folder.selectDialog("Choose the output directory");

		if (outputPath) {
			var absPath		= outputPath.fsName;
			var outputName	= String(app.project.name);
			var array		= outputName.split('.', 2);

			outputName		= array[0] + sessionCounter + '.' + array[1];
			sessionCounter++;

			var fullOutPath = absPath + $._PPP_.getSep() + outputName;

			app.project.saveAs(fullOutPath);

			for (var a = 0; a < app.projects.numProjects; a++) {
				var currentProject = app.projects[a];
				if (currentProject.path === fullOutPath) {
					// Why do this first? So we don't frighten the user by making PPro's front-most window disappear. :)
					app.openDocument(originalPath, true, true, true, true);
					currentProject.closeDocument();
				}
			}
		} else {
			$._PPP_.updateEventPanel("No output path chosen.");
		}
	},

	mungeXMP : function () {
		var projectItem = app.project.rootItem.children[0]; // assumes first item is footage.
		if (projectItem) {
			if (ExternalObject.AdobeXMPScript === undefined) {
				ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
			}
			if (ExternalObject.AdobeXMPScript !== undefined) {

				var xmpBlob = projectItem.getXMPMetadata();
				var xmp = new XMPMeta(xmpBlob);
				var oldSceneVal = "";
				var oldDMCreatorVal = "";

				if (xmp.doesPropertyExist(XMPConst.NS_DM, "scene") === true) {
					var myScene = xmp.getProperty(XMPConst.NS_DM, "scene");
					oldSceneVal = myScene.value;
				}

				if (xmp.doesPropertyExist(XMPConst.NS_DM, "creator") === true) {
					var myCreator	= xmp.getProperty(XMPConst.NS_DM, "creator");
					oldDMCreatorVal	= myCreator.value;
				}

				// Regardless of whether there WAS scene or creator data, set scene and creator data.

				xmp.setProperty(XMPConst.NS_DM, "scene", oldSceneVal + " Added by PProPanel sample!");
				xmp.setProperty(XMPConst.NS_DM, "creator", oldDMCreatorVal + " Added by PProPanel sample!");

				// That was the NS_DM creator; here's the NS_DC creator.

				var creatorProp 					= "creator";
				var containsDMCreatorValue			= xmp.doesPropertyExist(XMPConst.NS_DC, creatorProp);
				var numCreatorValuesPresent			= xmp.countArrayItems(XMPConst.NS_DC, creatorProp);
				var CreatorsSeparatedBy4PoundSigns	= "";

				if (numCreatorValuesPresent > 0) {

					// If there are existing entries, append
					for (var z = 0; z < numCreatorValuesPresent; z++) {
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
					// If this is the first entry, write something else.
					xmp.appendArrayItem(XMPConst.NS_DC,
										creatorProp,
										"PProPanel wrote the first value into NS_DC creator field.",
										null,
										XMPConst.ARRAY_IS_ORDERED);
				}
				var xmpAsString = xmp.serialize(); // either way, serialize and write XMP.
				projectItem.setXMPMetadata(xmpAsString);
			}
		} else {
			$._PPP_.updateEventPanel("Project item required.");
		}
	},

	getProductionByName : function (nameToGet) {
		var production;
		var allProductions = app.anywhere.listProductions();
		for (var i = 0; i < allProductions.numProductions; i++) {
			var currentProduction = allProductions[i];
			if (currentProduction.name === nameToGet) {
				production = currentProduction;
			}
		}
		return production;
	},

	pokeAnywhere : function () {
		var token				= app.anywhere.getAuthenticationToken();
		var productionList		= app.anywhere.listProductions();
		if (app.anywhere.isProductionOpen()) {
			var sessionURL			= app.anywhere.getCurrentEditingSessionURL();
			var selectionURL 		= app.anywhere.getCurrentEditingSessionSelectionURL();
			var activeSequenceURL 	= app.anywhere.getCurrentEditingSessionActiveSequenceURL();
			var theOneIAskedFor		= $._PPP_.getProductionByName("test");
			if (theOneIAskedFor) {
				var out = theOneIAskedFor.name + ", " + theOneIAskedFor.description;
				$._PPP_.updateEventPanel("Found: " + out); // todo: put useful code here.
			}
		} else {
			$._PPP_.updateEventPanel("No Production open.");
		}
	},

	dumpOMF : function () {
		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var outputPath = Folder.selectDialog("Choose the output directory");
			if (outputPath) {
				var absPath				= outputPath.fsName;
				var outputName 			= String(activeSequence.name) + '.omf';
				var fullOutPathWithName	= absPath + $._PPP_.getSep() + outputName;

				app.project.exportOMF(	app.project.activeSequence, // sequence
										fullOutPathWithName, 		// output file path
										'OMFTitle', 				// OMF title
										48000, 						// sample rate (48000 or 96000)
										16, 						// bits per sample (16 or 24)
										1, 							// audio encapsulated flag (1:yes or 0:no)
										0, 							// audio file format (0:AIFF or 1:WAV)
										0, 							// trim audio files (0:no or 1:yes)
										0, 							// handle frames (if trim is 1, handle frames from 0 to 1000)
										0); 						// include pan flag (0:no or 1:yes)
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	addClipMarkers : function () {
		if (app.project.rootItem.children.numItems > 0) {
			var projectItem = app.project.rootItem.children[0]; // assumes first item is footage.
			if (projectItem) {
				if (projectItem.type == ProjectItemType.CLIP || projectItem.type == ProjectItemType.FILE) {
					var markers = projectItem.getMarkers();
					if (markers) {
						var numMarkers			= markers.numMarkers;
						var newMarker			= markers.createMarker(12.345);
						var guid 				= newMarker.guid;
						newMarker.name			= 'Marker created by PProPanel.';
						newMarker.comments		= 'Here are some comments, inserted by PProPanel.';
						newMarker.end			= (newMarker.start.seconds + 5.0);

						//default marker type == comment. To change marker type, call one of these:
						// newMarker.setTypeAsChapter();
						// newMarker.setTypeAsWebLink();
						// newMarker.setTypeAsSegmentation();
						// newMarker.setTypeAsComment();
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
		var nameField						= "Column.Intrinsic.Name";
		var tapeName						= "Column.Intrinsic.TapeName";
		var logNote							= "Column.Intrinsic.LogNote";
		var newField						= "ExampleFieldName";
		var desc							= "Column.PropertyText.Description";

		if (app.isDocumentOpen()) {
			var projectItem = app.project.rootItem.children[0]; // just grabs first projectItem.
			if (projectItem) {
				if (ExternalObject.AdobeXMPScript === undefined) {
					ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
				}
				if (ExternalObject.AdobeXMPScript !== undefined) { // safety-conscious!
					var projectMetadata 			= projectItem.getProjectMetadata();
					var successfullyAdded 			= app.project.addPropertyToProjectMetadataSchema(newField, "ExampleFieldLabel", 2);
					var xmp							= new XMPMeta(projectMetadata);
					var obj							= xmp.dumpObject();
					var foundLogNote				= xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, logNote);
					var oldLogValue 				= "";
					var appendThis 					= "This log note inserted by PProPanel.";
					var appendTextWasActuallyNew 	= false;

					if (foundLogNote) {
						var oldLogNote = xmp.getProperty(kPProPrivateProjectMetadataURI, logNote);
						if (oldLogNote) {
							oldLogValue = oldLogNote.value;
						}
					}
					xmp.setProperty(kPProPrivateProjectMetadataURI, tapeName, 	"***TAPENAME***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, desc, 		"***DESCRIPTION***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, nameField, 	"***NEWNAME***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, newField, 	"PProPanel set this, using addPropertyToProjectMetadataSchema().");

					var array 	= [];
					array[0] 	= tapeName;
					array[1] 	= desc;
					array[2] 	= nameField;
					array[3] 	= newField;

					var concatenatedLogNotes = "";

					if (oldLogValue != appendThis) { // if that value is not exactly what we were going to add
						if (oldLogValue.length > 0) { // if we have a valid value
							concatenatedLogNotes += "Previous log notes: " + oldLogValue + "    ||||    ";
						}
						concatenatedLogNotes += appendThis;
						xmp.setProperty(kPProPrivateProjectMetadataURI, logNote, concatenatedLogNotes);
						array[4] = logNote;
					}
					var str = xmp.serialize();
					projectItem.setProjectMetadata(str, array);

					// test: is it in there?

					var newblob = projectItem.getProjectMetadata();
					var newXMP = new XMPMeta(newblob);
					var foundYet = newXMP.doesPropertyExist(kPProPrivateProjectMetadataURI, newField);

					if (foundYet) {
						$._PPP_.updateEventPanel("PProPanel successfully added a field to the project metadata schema, and set a value for it.");
					}
				}
			} else {
				$._PPP_.updateEventPanel("No project items found.");
			}
		}
	},

	updatePAR : function () {
		var item = app.project.rootItem.children[0];
		if (item) {
			if ((item.type == ProjectItemType.FILE) || (item.type == ProjectItemType.CLIP)) {
				// If there is an item, and it's either a clip or file...
				item.setOverridePixelAspectRatio(185, 100); // anamorphic is BACK!	  ;)
			} else {
				$._PPP_.updateEventPanel('You cannot override the PAR of bins or sequences.');
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	getnumAEProjectItems : function () {
		var bt		= new BridgeTalk();
		bt.target	= 'aftereffects';
		bt.body		= 'alert("Items in AE project: " + app.project.rootFolder.numItems);app.quit();';
		bt.send();
	},

	updateEventPanel : function (message) {
		app.setSDKEventMessage(message, 'info');
		/*app.setSDKEventMessage('Here is some information.', 'info');
		app.setSDKEventMessage('Here is a warning.', 'warning');
		app.setSDKEventMessage('Here is an error.', 'error');  // Very annoying; use sparingly.*/
	},

	walkAllBinsDumpingXMP : function (parentItem, outPath) {
		for (var j = 0; j < parentItem.children.numItems; j++) {
			var currentChild = parentItem.children[j];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					$._PPP_.walkAllBinsDumpingXMP(currentChild, outPath); // warning; recursion!
				} else {
					var isMultiCam		= currentChild.isMulticamClip();
					var isMergedClip	= currentChild.isMergedClip();
					if ((isMergedClip === false) && (isMultiCam === false)) {
						$._PPP_.dumpProjectItemXMP(currentChild, outPath);
					}
				}
			}
		}
	},

	walkAllBinsUpdatingPaths : function (parentItem, outPath) {
		for (var j = 0; j < parentItem.children.numItems; j++) {
			var currentChild = parentItem.children[j];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					$._PPP_.walkAllBinsUpdatingPaths(currentChild, outPath); // warning; recursion!
				} else {
					$._PPP_.updateProjectItemPath(currentChild, outPath);
				}
			}
		}
	},

	searchBinForProjItemByName : function (i, containingBin, nameToFind) {
		for (var j = i; j < containingBin.children.numItems; j++) {
			var currentChild = containingBin.children[j];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					return $._PPP_.searchBinForProjItemByName(j, currentChild, nameToFind); // warning; recursion!
				} else {
					if (currentChild.name === nameToFind) {
						return currentChild;
					} else {
						currentChild = currentChild.children[j + 1];
						if (currentChild) {
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

		if (outFile) {
			outFile.encoding = "UTF8";
			outFile.open("w", "TEXT", "????");
			outFile.write(xmpBlob.toString());
			outFile.close();
		}
	},

	addSubClip : function () {
		var startTime 			= new Time();
		startTime.seconds		= 0.0;
		var endTime				= new Time();
		endTime.seconds			= 3.21;
		var hasHardBoundaries	= 0;
		var sessionCounter		= 1;
		var takeVideo			= 1; // optional, defaults to 1
		var takeAudio			= 1; //	optional, defaults to 1
		var projectItem 		= app.project.rootItem.children[0]; // just grabs the first item
		if (projectItem) {
			if ((projectItem.type === ProjectItemType.CLIP) || (projectItem.type === ProjectItemType.FILE)) {
				var newSubClipName = prompt('Name of subclip?', projectItem.name + '_' + sessionCounter, 'Name your subclip');
				if (newSubClipName) {
					var newSubClip = projectItem.createSubClip(	newSubClipName,
																startTime,
																endTime,
																hasHardBoundaries,
																takeVideo,
																takeAudio);
					if (newSubClip) {
						var newStartTime		=	new Time();
						newStartTime.seconds	=	12.345;
						newSubClip.setStartTime(newStartTime);
					}
				} else {
					$._PPP_.updateEventPanel("No name provided for sub-clip.");
				}
			} else {
				$._PPP_.updateEventPanel("Could not sub-clip " + projectItem.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No project item found.");
		}
	},

	dumpXMPFromAllProjectItems : function () {
		var numItemsInRoot = app.project.rootItem.children.numItems;
		if (numItemsInRoot > 0) {
			var outPath = Folder.selectDialog("Choose the output directory");
			if (outPath) {
				for (var i = 0; i < numItemsInRoot; i++) {
					var currentItem = app.project.rootItem.children[i];
					if (currentItem) {
						if (currentItem.type == ProjectItemType.BIN) {
							$._PPP_.walkAllBinsDumpingXMP(currentItem, outPath.fsName);
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

	exportAAF : function () {
		var sessionCounter = 1;
		if (app.project.activeSequence) {
			var outputPath = Folder.selectDialog("Choose the output directory");
			if (outputPath) {
				var absPath		= outputPath.fsName;
				var outputName	= String(app.project.name);
				var array		= outputName.split('.', 2);
				outputName		= array[0] + sessionCounter + '.' + array[1];
				var fullOutPath = absPath + $._PPP_.getSep() + outputName + '.aaf';

				//var optionalPathToOutputPreset = null;  you can specify an output preset.

				app.project.exportAAF(	app.project.activeSequence, // which sequence
										fullOutPath, 	// output path
										1, 				// mix down video?
										0, 				// explode to mono?
										96000, 			// sample rate
										16, 			// bits per sample
										0, 				// embed audio?
										0, 				// audio file format? 0 = aiff, 1 = wav
										0, 				// number of 'handle' frames
										0/*
										optionalPathToOutputPreset*/); // optional; .epr file to use
				sessionCounter++;
			} else {
				$._PPP_.updateEventPanel("Couldn't create AAF output.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	setScratchDisk : function () {
		var scratchPath = Folder.selectDialog("Choose new scratch disk directory");
		if ((scratchPath) && scratchPath.exists) {
			app.setScratchDiskPath(scratchPath.fsName, ScratchDiskType.FirstAutoSaveFolder); // see ScratchDiskType object, in ESTK.
		}
	},

	getProjectProxySetting : function () {
		var returnVal = "";
		if (app.project) {
			returnVal = "No sequence detected in " + app.project.name + ".";
			if (app.getEnableProxies()) {
				returnVal = 'true';
			} else {
				returnVal = 'false';
			}
		} else {
			returnVal = "No project available.";
		}
		return returnVal;
	},

	toggleProxyState : function () {
		var update = "Proxies for " + app.project.name + " turned ";
		if (app.getEnableProxies()) {
			app.setEnableProxies(0);
			update = update + "OFF.";
		} else {
			app.setEnableProxies(1);
			update = update + "ON.";
		}
		$._PPP_.updateEventPanel(update);
	},

	setProxiesON : function () {
		var firstProjectItem = app.project.rootItem.children[0];
		if (firstProjectItem) {
			if (firstProjectItem.canProxy()) {
				var shouldAttachProxy = true;
				var detachProxy = true;
				if (firstProjectItem.hasProxy()) {
					detachProxy = confirm(firstProjectItem.name + " already has an assigned proxy. Detach?", false, "Are you sure...?");
					if (detachProxy) {
						firstProjectItem.detachProxy();
					}
				}
				if (shouldAttachProxy) {
					var filterString = "";
					if (Folder.fs === 'Windows') {
						filterString = "All files:*.*";
					}
					var proxyPath = File.openDialog("Choose proxy for " + firstProjectItem.name + ":",
						filterString,
						false);
					if (proxyPath.exists) {
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
		qe.project.deletePreviewFiles(MediaType_ANY);
		$._PPP_.updateEventPanel("All video and audio preview files deleted.");
	},

	randomizeSequenceSelection : function () {
		var sequence = app.project.activeSequence;
		if (sequence) {
			var trackGroups 	= [sequence.audioTracks, sequence.videoTracks];
			var trackGroupNames = ["audioTracks", "videoTracks"];
			var updateUI 		= true;

			for (var groupIndex = 0; groupIndex < 2; groupIndex++) {
				$._PPP_.updateEventPanel(trackGroupNames[groupIndex]);
				var group = trackGroups[groupIndex];
				for (var trackIndex = 0; trackIndex < group.numTracks; trackIndex++) {
					var track			= group[trackIndex];
					var clips			= track.clips;
					var transitions		= track.transitions;
					var beforeSelected;
					var afterSelected;
					var initialSelectState;

					$._PPP_.updateEventPanel("track:" + trackIndex + "	 clip count: " + clips.numItems + "	  transition count: " + transitions.numItems);

					for (var clipIndex = 0; clipIndex < clips.numItems; clipIndex++) {
						var clip = clips[clipIndex];
						var name = (clip.projectItem === undefined ? "<null>":clip.projectItem.name);
						initialSelectState = clip.isSelected();
						var oldOut = clip.outPoint;
						oldOut.seconds = oldOut.seconds - 2.0;
						clip.outPoint.ticks = oldOut.ticks;



						// randomly select clips
						var setIt = (Math.random() > 0.5);
						clip.setSelected((Math.random() > 0.5), updateUI);

						if (clip.isAdjustmentLayer()) {
							$._PPP_.updateEventPanel("Clip named \"" + clip.name + "\" is an adjustment layer.");
						}

						// Note; there's no good place to exercise this code yet, but
						// I wanted to provide example usage.

						var allClipsInThisSequenceFromSameSource = clip.getLinkedItems();

						if (allClipsInThisSequenceFromSameSource) {
							$._PPP_.updateEventPanel("Found " + allClipsInThisSequenceFromSameSource.numItems + " clips from " + clip.projectItem.name + ", in this sequence.");
						}
						beforeSelected	= initialSelectState ? "Y" : "N";
						afterSelected	= clip.isSelected() ? "Y" : "N";
						$._PPP_.updateEventPanel("clip:" + clipIndex + "	 " + name + "		" + beforeSelected + " -> " + afterSelected);
					}

					for (var tni = 0; tni < transitions.numItems; ++tni) {
						var transition 		= transitions[tni];
						var doIt 			= false;
						initialSelectState	= transition.isSelected();
						// randomly select transitions
						if ((Math.random() > 0.5)) {
							doIt = true;
						}
						transition.setSelected(doIt, updateUI);
						beforeSelected	= initialSelectState ? "Y" : "N";
						afterSelected	= transition.isSelected() ? "Y" : "N";
						$._PPP_.updateEventPanel('transition: ' + tni + "		" + beforeSelected + " -> " + afterSelected);
					}
				}
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	// Define a couple of callback functions, for AME to use during render.

	onEncoderJobComplete : function (jobID, outputFilePath) {
		$._PPP_.updateEventPanel('onEncoderJobComplete called. jobID = ' + jobID + '.');
	},

	onEncoderJobError : function (jobID, errorMessage) {
		var eoName = "";
		if (Folder.fs === 'Macintosh') {
			eoName = "PlugPlugExternalObject";
		} else {
			eoName = "PlugPlugExternalObject.dll";
		}
		var plugplugLibrary = new ExternalObject( "lib:" + eoName );
		if (plugplugLibrary){
			var eventObj	= new CSXSEvent();
			eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
			eventObj.data	= "Job " + jobID + " failed, due to " + errorMessage + ".";
			eventObj.dispatch();
		}
	},

	onEncoderJobProgress : function (jobID, progress) {
		$._PPP_.updateEventPanel('onEncoderJobProgress called. jobID = ' + jobID + '. progress = ' + progress + '.');
	},

	onEncoderJobQueued : function (jobID) {
		var eoName = "";
		if (Folder.fs === 'Macintosh') {
			eoName = "PlugPlugExternalObject";
		} else {
			eoName = "PlugPlugExternalObject.dll";
		}		
		var plugplugLibrary = new ExternalObject( "lib:" + eoName );
		if (plugplugLibrary){
			var eventObj	= new CSXSEvent();
			eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
			eventObj.data	= "Job " + jobID + " queued.";
			eventObj.dispatch();
			$._PPP_.updateEventPanel('jobID ' + jobID + 'successfully queued.');
			app.encoder.startBatch();
		}
	},

	onEncoderJobCanceled : function (jobID) {
		var eoName = "";
		if (Folder.fs === 'Macintosh') {
			eoName = "PlugPlugExternalObject";
		} else {
			eoName = "PlugPlugExternalObject.dll";
		}
		var plugplugLibrary = new ExternalObject( "lib:" + eoName );
		if (plugplugLibrary){
			var eventObj	= new CSXSEvent();
			eventObj.type	= "com.adobe.csxs.events.PProPanelRenderEvent";
			eventObj.data	= "Job " + jobID + " canceled.";
			eventObj.dispatch();
			$._PPP_.updateEventPanel('OnEncoderJobCanceled called. jobID = ' + jobID + '.');
		}
	},

	

	onPlayWithKeyframes : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var firstVideoTrack = seq.videoTracks[0];
			if (firstVideoTrack) {
				var firstClip = firstVideoTrack.clips[0];
				if (firstClip) {
					var clipComponents = firstClip.components;
					if (clipComponents) {
						for (var i = 0; i < clipComponents.numItems; ++i) {
							$._PPP_.updateEventPanel('component ' + i + ' = ' + clipComponents[i].matchName + ' : ' + clipComponents[i].displayName);
						}
						if (clipComponents.numItems > 2) {

							// 0 = clip
							// 1 = Opacity
							// N effects, then...

							var updateUI	= true;
							var blur		= clipComponents[2]; // Assume Gaussian Blur is the first effect applied to the clip.
							if (blur) {
								var blurProps = blur.properties;
								if (blurProps) {
									for (var j = 0; j < blurProps.numItems; ++j) {
										$._PPP_.updateEventPanel('param ' + j + ' = ' + blurProps[j].displayName);
									}
									var blurriness = blurProps[0];

									/* Sample code showing how to get and set the values of a color parameter.

									var colorToChange = change_colorProps[N]; // where 'N' is the index of the effect with a color param.

									var colorVal = colorToChange.getColorValue();

									var alpha = colorVal[0];
									var red   = colorVal[1];
									var blue  = colorVal[2];
									var green = colorVal[3];

                                  	colorToChange.setColorValue(255, 33, 222, 111); // a, r, g, b

									*/

									if (blurriness) {
										if (!blurriness.isTimeVarying()) {
											blurriness.setTimeVarying(true);
										}
										var allKeys = blurriness.getKeys();
										if (allKeys.length) {
											for (var k = 0; k < allKeys.length; ++k) {
												var thisKey = allKeys[k];
												if (thisKey){
													blurriness.setInterpolationTypeAtKey(thisKey, 4, true);
												}
											}
											
											/*blurriness.addKey(k);
											var blurVal	= Math.sin(3.14159 * i / 5) * 20 + 25;
											blurriness.setValueAtKey(k, blurVal, true);
											var time			= app.project.activeSequence.getPlayerPosition();
											var interpType = 5;
											blurriness.setInterpolationTypeAtKey(time, interpType, true);*/
										}
										var safety = blurriness.getKeys();
									}

									var repeatEdgePixels = blurProps[2];
									if (repeatEdgePixels) {
										if (!repeatEdgePixels.getValue()) {
											repeatEdgePixels.setValue(true, updateUI);
										}
									}

									// look for keyframe nearest to 4s with 1/10 second tolerance

									var keyFrameTime = blurriness.findNearestKey(4.0, 0.1);
									if (keyFrameTime !== undefined) {
										$._PPP_.updateEventPanel('Found keyframe = ' + keyFrameTime.seconds);
									} else {
										$._PPP_.updateEventPanel('Keyframe not found.');
									}

									// scan keyframes, forward

									keyFrameTime = blurriness.findNearestKey(0.0, 0.1);
									var lastKeyFrameTime = keyFrameTime;
									while (keyFrameTime !== undefined) {
										$._PPP_.updateEventPanel('keyframe @ ' + keyFrameTime.seconds);
										lastKeyFrameTime	= keyFrameTime;
										keyFrameTime 		= blurriness.findNextKey(keyFrameTime);
									}

									// scan keyframes, backward
									keyFrameTime = lastKeyFrameTime;
									while (keyFrameTime !== undefined) {
										$._PPP_.updateEventPanel('keyframe @ ' + keyFrameTime.seconds);
										lastKeyFrameTime	= keyFrameTime;
										keyFrameTime		= blurriness.findPreviousKey(keyFrameTime);
									}

									var blurKeyframesArray = blurriness.getKeys(); // get all keyframes
									if (blurKeyframesArray) {
										$._PPP_.updateEventPanel(blurKeyframesArray.length + ' keyframes found');
									}

									blurriness.removeKey(19); // remove keyframe at 19s

									blurriness.removeKeyRange(0, 5, updateUI); // remove keyframes in range from 0s to 5s
								}
							} else {
								$._PPP_.updateEventPanel("To make this sample code work, please apply the Gaussian Blur effect to the first clip in the first video track of the active sequence.");
							}
						}
					}
				}
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	extractFileNameFromPath : function (fullPath) {
		var lastDot = fullPath.lastIndexOf(".");
		var lastSep = fullPath.lastIndexOf("/");
		if (lastDot > -1) {
			return fullPath.substr((lastSep + 1), (fullPath.length - (lastDot + 1)));
		} else {
			return fullPath;
		}
	},

	onProxyTranscodeJobComplete : function (jobID, outputFilePath) {
		var suffixAddedByPPro	= '_1'; // You should really test for any suffix.
		var withoutExtension	= outputFilePath.slice(0, -4); // trusting 3 char extension
		var lastIndex			= outputFilePath.lastIndexOf(".");
		var extension			= outputFilePath.substr(lastIndex + 1);
		var wrapper				= [];
		wrapper[0] 				= outputFilePath;
		var nameToFind			= 'Proxies generated by PProPanel';
		var targetBin 			= $._PPP_.getPPPInsertionBin();
		if (targetBin) {
			app.project.importFiles(wrapper, true, null, false);
		}
	},

	onProxyTranscodeJobError : function (jobID, errorMessage) {
		$._PPP_.updateEventPanel(errorMessage);
	},

	onProxyTranscodeJobQueued : function (jobID) {
		app.encoder.startBatch();
	},

	ingestFiles : function (outputPresetPath) {
		app.encoder.bind('onEncoderJobComplete',	$._PPP_.onProxyTranscodeJobComplete);
		app.encoder.bind('onEncoderJobError',		$._PPP_.onProxyTranscodeJobError);
		app.encoder.bind('onEncoderJobQueued',		$._PPP_.onProxyTranscodeJobQueued);
		app.encoder.bind('onEncoderJobCanceled',	$._PPP_.onEncoderJobCanceled);

		if (app.project) {
			var filterString = "";
			if (Folder.fs === 'Windows') {
				filterString = "All files:*.*";
			}
			var fileOrFilesToImport = File.openDialog(	"Choose full resolution files to import", 	// title
														filterString, 								// filter available files?
														true); 										// allow multiple fiels to be selected?
			if (fileOrFilesToImport) {
				var nameToFind = 'Proxies generated by PProPanel';
				var targetBin = $._PPP_.searchForBinWithName(nameToFind);
				if (targetBin === 0) {
					// If panel can't find the target bin, it creates it.
					app.project.rootItem.createBin(nameToFind);
					targetBin = $._PPP_.searchForBinWithName(nameToFind);
				}
				if (targetBin) {
					targetBin.select();
					var importThese = []; // We have an array of File objects; importFiles() takes an array of paths.
					if (importThese) {
						for (var i = 0; i < fileOrFilesToImport.length; i++) {
							var removeUponCompletion 	= 0;
							importThese[i] 				= fileOrFilesToImport[i].fsName;
							var justFileName 			= $._PPP_.extractFileNameFromPath(importThese[i]);
							var suffix 					= '_PROXY.mp4';
							var containingPath 			= fileOrFilesToImport[i].parent.fsName;
							var completeProxyPath 		= containingPath + $._PPP_.getSep() + justFileName + suffix;

							var jobID = app.encoder.encodeFile(	fileOrFilesToImport[i].fsName,
																completeProxyPath,
																outputPresetPath,
																removeUponCompletion);
						}

						app.project.importFiles(importThese,	// array of file paths to be imported
												true, 			// suppress warnings
												targetBin,		// destination bin
												false); 		// import as numbered stills
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

	insertOrAppend : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var first = app.project.rootItem.children[0];
			if (first) {
				if (!first.isSequence()) {
					if (first.type !== ProjectItemType.BIN) {
						var numVTracks = seq.videoTracks.numTracks;
						var targetVTrack = seq.videoTracks[(numVTracks - 1)];
						if (targetVTrack) {
							// If there are already clips in this track, append this one to the end. Otherwise, insert at start time.
							if (targetVTrack.clips.numItems > 0) {
								var lastClip = targetVTrack.clips[(targetVTrack.clips.numItems - 1)];
								if (lastClip) {
									targetVTrack.insertClip(first, lastClip.end.seconds);
								}
							} else {
								var timeAtZero = new Time();
								targetVTrack.insertClip(first, timeAtZero.seconds);
								// Using linkSelection/unlinkSelection calls, panels can remove just the audio (or video) of a given clip.
								var newlyAddedClip = targetVTrack.clips[(targetVTrack.clips.numItems - 1)];
								if (newlyAddedClip) {
									newlyAddedClip.setSelected(true, true);
									seq.unlinkSelection();
									newlyAddedClip.remove(true, true);
									seq.linkSelection();
								} else {
									$._PPP_.updateEventPanel("Could not add clip.");
								}
							}
						} else {
							$._PPP_.updateEventPanel("Could not find first video track.");
						}
					} else {
						$._PPP_.updateEventPanel(first.name + " is a bin.");
					}
				} else {
					$._PPP_.updateEventPanel(first.name + " is a sequence.");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	overWrite : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var first = app.project.rootItem.children[0];
			if (first) {
				var vTrack1 = seq.videoTracks[0];
				if (vTrack1) {
					var now = seq.getPlayerPosition();
					vTrack1.overwriteClip(first, now.seconds);
				} else {
					$._PPP_.updateEventPanel("Could not find first video track.");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	closeFrontSourceClip : function () {
		app.sourceMonitor.closeClip();
	},

	closeAllClipsInSourceMonitor : function () {
		app.sourceMonitor.closeAllClips();
	},

	changeLabel : function () {
		var first = app.project.rootItem.children[0];
		if (first) {
			var currentLabel 	= first.getColorLabel();
			var newLabel 		= currentLabel + 1; // 4 = Cerulean. 0 = Violet, 15 = Yellow.
			if (newLabel > 15) {
				newLabel = newLabel - 16;
			}
			$._PPP_.updateEventPanel("Previous Label color = " + currentLabel + ".");
			first.setColorLabel(newLabel);
			$._PPP_.updateEventPanel("New Label color = " + newLabel + ".");
		} else {
			$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
		}
	},

	getPPPInsertionBin : function () {
		var nameToFind	= "Here's where PProPanel puts things.";
		var targetBin	= $._PPP_.searchForBinWithName(nameToFind);

		if (targetBin === undefined) {
			// If panel can't find the target bin, it creates it.
			app.project.rootItem.createBin(nameToFind);
			targetBin = $._PPP_.searchForBinWithName(nameToFind);
		}
		if (targetBin) {
			targetBin.select();
			return targetBin;
		} else {
			$._PPP_.updateEventPanel("Couldn't find or create a target bin.");
		}
	},

	importComps : function () {
		var targetBin = $._PPP_.getPPPInsertionBin();
		if (targetBin) {
			var filterString = "";
			if (Folder.fs === 'Windows') {
				filterString = "All files:*.*";
			}
			var compNamesToImport	= [];
			var aepToImport			= File.openDialog(	"Choose After Effects project", // title
														filterString, 					// filter available files?
														false); 						// allow multiple?
			if (aepToImport) {
				var importAll = confirm("Import all compositions in project?", false, "Import all?");
				if (importAll) {
					var result = app.project.importAllAEComps(aepToImport.fsName, targetBin);
				} else {
					var compName = prompt('Name of composition to import?', '', 'Which Comp to import');
					if (compName) {
						compNamesToImport[0] 	= compName;
						var importAECompResult 	= app.project.importAEComps(aepToImport.fsName, compNamesToImport, targetBin);
					} else {
						$._PPP_.updateEventPanel("No composition specified.");
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

		if (app.project.sequences.numSequences) {
			if (pmo) {
				var filterString = "";
				if (Folder.fs === 'Windows') {
					filterString = "Output Presets:*.epr";
				}
				var outFolder = Folder.selectDialog("Choose output directory.");
				if (outFolder) {
					var presetPath = "";
					var useSpecificPreset = confirm("Would you like to select an output preset?", false, "Are you sure...?");
					if (useSpecificPreset) {
						var useThisEPR = File.openDialog(	"Choose output preset (.epr file)", // title
															filterString, 						// filter available files?
															false); 							// allow multiple?
						if (useThisEPR) {
							pmo.clipTranscoderOption	= pmo.CLIP_TRANSCODE_MATCH_PRESET;
							pmo.encoderPresetFilePath	= useThisEPR.fsName;
						} else {
							$._PPP_.updateEventPanel("Couldn't find specified .epr file.");
						}
					} else {
						pmo.clipTranscoderOption = pmo.CLIP_TRANSCODE_MATCH_SEQUENCE;
					}
					var processAllSequences = confirm("Process all sequences? No = just the first sequence found.", true, "Process all?");
					if (processAllSequences) {
						pmo.includeAllSequences = true;
					} else {
						pmo.includeAllSequences	= false;
						pmo.affectedSequences	= [app.project.sequences[0]];
					}

					pmo.clipTransferOption 			= pmo.CLIP_TRANSFER_TRANSCODE;
					pmo.convertAECompsToClips 		= false;
					pmo.convertSyntheticsToClips 	= false;
					pmo.copyToPreventAlphaLoss 		= false;
					pmo.destinationPath 			= outFolder.fsName;
					pmo.excludeUnused 				= false;
					pmo.handleFrameCount 			= 0;
					pmo.includeConformedAudio 		= true;
					pmo.includePreviews 			= true;
					pmo.renameMedia 				= false;

					var result		= app.projectManager.process(app.project);
					var errorList	= app.projectManager.errors;

					if (errorList.length) {
						for (var k = 0; k < errorList.length; k++) {
							$._PPP_.updateEventPanel(errorList[k][0]);
						}
					} else {
						$._PPP_.updateEventPanel(app.project.name + " successfully processed to " + outFolder.fsName + ".");
					}
					return result;
				}
			} else {
				$._PPP_.updateEventPanel("Could not get Project Manager options.");
			}
		} else {
			$._PPP_.updateEventPanel("No sequences available.");
		}
	},

	importMoGRT : function () {
		var activeSeq = app.project.activeSequence;
		if (activeSeq) {
			var filterString = "";
			if (Folder.fs === 'Windows') {
				filterString = "Motion Graphics Templates:*.mogrt";
			}
			var mogrtToImport = File.openDialog("Choose MoGRT",	// title
												filterString,	// filter available files?
												false);			// allow multiple?
			if (mogrtToImport) {
				var targetTime 		= activeSeq.getPlayerPosition();
				var vidTrackOffset 	= 0;
				var audTrackOffset 	= 0;
				var newTrackItem 	= activeSeq.importMGT(	mogrtToImport.fsName,
															targetTime.ticks,
															vidTrackOffset,
															audTrackOffset);
				if (newTrackItem) {
					var moComp = newTrackItem.getMGTComponent();
					if (moComp) {
						var params = moComp.properties;
						for (var z = 0; z < params.numItems; z++) {
							var thisParam = params[z];
							if (thisParam) {
								$._PPP_.updateEventPanel('Parameter ' + (z + 1) + ' name: ' + thisParam.name + '.');
							}
						}
						var srcTextParam = params.getParamForDisplayName("Source Text");
						if (srcTextParam) {
							var val = srcTextParam.getValue();
							srcTextParam.setValue("New value set by PProPanel!");
						}
					}
				}
			} else {
				$._PPP_.updateEventPanel('Unable to import specified .mogrt file.');
			}
		} else {
			$._PPP_.updateEventPanel('No active sequence.');
		}
	},

	reportCurrentProjectSelection : function () {
		var viewIDs 		= app.getProjectViewIDs();
		var viewSelection 	= app.getProjectViewSelection(viewIDs[0]); // sample code optimized for a single open project
		$._PPP_.projectPanelSelectionChanged(viewSelection, viewIDs[0]);
	},

	randomizeProjectSelection : function () {
		var viewIDs						= app.getProjectViewIDs();
		var firstProject				= app.getProjectFromViewID(viewIDs[0]);
		var arrayOfRandomProjectItems	= [];

		for (var b = 0; b < app.project.rootItem.children.numItems; b++) {
			var currentProjectItem = app.project.rootItem.children[b];
			if (Math.random() > 0.5) {
				arrayOfRandomProjectItems.push(currentProjectItem);
			}
		}
		if (arrayOfRandomProjectItems.length > 0) {
			app.setProjectViewSelection(arrayOfRandomProjectItems, viewIDs[0]);
		}
	},

	setAllProjectItemsOnline : function (startingBin) {
		for (var k = 0; k < startingBin.children.numItems; k++) {
			var currentChild = startingBin.children[k];
			if (currentChild) {
				if (currentChild.type === ProjectItemType.BIN) {
					$._PPP_.setAllProjectItemsOnline(currentChild); // warning; recursion!
				} else if (currentChild.isOffline()) {
					currentChild.changeMediaPath(currentChild.getMediaPath(), true);
					if (currentChild.isOffline()) {
						$._PPP_.updateEventPanel("Failed to bring \'" + currentChild.name + "\' online.");
					} else {
						$._PPP_.updateEventPanel("\'" + currentChild.name + "\' is once again online.");
					}
				}
			}
		}
	},

	setAllOnline : function () {
		var startingBin = app.project.rootItem;
		$._PPP_.setAllProjectItemsOnline(startingBin);
	},

	setOffline : function () {
		var viewIDs = app.getProjectViewIDs();
		for (var a = 0; a < app.projects.numProjects; a++) {
			var currentProject = app.getProjectFromViewID(viewIDs[a]);
			if (currentProject) {
				if (currentProject.documentID === app.project.documentID) { // We're in the right project!
					var selectedItems = app.getProjectViewSelection(viewIDs[a]);
					if (selectedItems && selectedItems.length > 0) {
						for (var b = 0; b < selectedItems.length; b++) {
							var currentItem = selectedItems[b];
							if (currentItem) {
								if ((!currentItem.isSequence()) && (currentItem.type !== ProjectItemType.BIN)) { // For every selected item which isn't a bin or sequence...
									if (currentItem.isOffline()) {
										$._PPP_.updateEventPanel("\'" + currentItem.name + "\'was already offline.");
									} else {
										var result = currentItem.setOffline();
										$._PPP_.updateEventPanel("\'" + currentItem.name + "\' is now offline.");
									}
								}
							}
						}
					}
				}
			}
		}
	},

	updateFrameRate : function () {
		var item = app.project.rootItem.children[0];
		if (item) {
			if ((item.type == ProjectItemType.FILE) || (item.type == ProjectItemType.CLIP)) {
				// If there is an item, and it's either a clip or file...
				item.setOverrideFrameRate(23.976);
			} else {
				$._PPP_.updateEventPanel('You cannot override the frame rate of bins or sequences.');
			}
		} else {
			$._PPP_.updateEventPanel("No project items found.");
		}
	},

	onItemAddedToProject : function (whichProject, addedProjectItem) {
		var msg = addedProjectItem.name + " was added to " + whichProject + ".";
		$._PPP_.updateEventPanel(msg);
	},

	registerItemAddedFxn : function () {
		app.onItemAddedToProjectSuccess = $._PPP_.onItemAddedToProject;
	},

	myOnProjectChanged : function (documentID) {
		var msg = 'Project with ID ' + documentID + ' changed, in some way.';
		$._PPP_.updateEventPanel(msg);
	},

	registerProjectChangedFxn : function () {
		app.bind('onProjectChanged', $._PPP_.myOnProjectChanged);
	},

	confirmPProHostVersion : function () {
		var version = parseFloat(app.version);
		if (version < 14.0) {
			$._PPP_.updateEventPanel("Note: PProPanel relies on features added in 14.0, but is currently running in " + version + ".");
		}
	},

	changeMarkerColors : function () {
		if (app.project.rootItem.children.numItems > 0) {
			var projectItem = app.project.rootItem.children[0]; // assumes first item is footage.
			if (projectItem) {
				if (projectItem.type == ProjectItemType.CLIP ||	projectItem.type == ProjectItemType.FILE) {
					var markers = projectItem.getMarkers();
					if (markers) {
						var markerCount = markers.numMarkers;
						if (markerCount) {
							for (var thisMarker = markers.getFirstMarker(); thisMarker !== undefined; thisMarker = markers.getNextMarker(thisMarker)) {
								var oldColor = thisMarker.getColorByIndex();
								var newColor = oldColor + 1;
								if (newColor > 7) {		// clamp to valid values
									newColor = 0;
								}
								thisMarker.setColorByIndex(newColor);
								$._PPP_.updateEventPanel("Changed color of marker named \'" + thisMarker.name + "\' from " + oldColor + " to " + newColor + ".");
							}
						}
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

	changeSeqTimeCodeDisplay : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var currentSeqSettings	= app.project.activeSequence.getSettings();
			if (currentSeqSettings) {
				var oldVidSetting	= currentSeqSettings.videoDisplayFormat;
				var timeAsText		= seq.getPlayerPosition().getFormatted(currentSeqSettings.videoFrameRate, app.project.activeSequence.videoDisplayFormat);

				currentSeqSettings.videoDisplayFormat = oldVidSetting + 1;
				if (currentSeqSettings.videoDisplayFormat > TIMEDISPLAY_48Timecode) {	// clamp to valid values
					currentSeqSettings.videoDisplayFormat = TIMEDISPLAY_24Timecode;
				}
				app.project.activeSequence.setSettings(currentSeqSettings);
				$._PPP_.updateEventPanel("Changed timecode display format for \'" + app.project.activeSequence.name + "\'.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	myActiveSequenceChangedFxn : function () {
		$._PPP_.updateEventPanel(app.project.activeSequence.name + " changed, in some way.");
	},

	mySequenceActivatedFxn : function () {
		$._PPP_.updateEventPanel("Active sequence is now " + app.project.activeSequence.name + ", in Project " + app.project.name + ".");
	},

	myActiveSequenceSelectionChangedFxn : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var sel = seq.getSelection();
			if (sel) {
				$._PPP_.updateEventPanel(sel.length + ' track items selected in ' + app.project.activeSequence.name + '.');
				for (var i = 0; i < sel.length; i++) {
					if (sel[i].name !== 'anonymous') {
						$._PPP_.updateEventPanel('Selected item ' + (i + 1) + ' == ' + sel[i].name + '.');
					}
				}
			} else {
				$._PPP_.updateEventPanel('No clips selected.');
			}
		} else {
			$._PPP_.updateEventPanel('No active sequence.');
		}
	},

	myActiveSequenceStructureChangedFxn : function () {
		$._PPP_.updateEventPanel('Something in  ' + app.project.activeSequence.name + 'changed.');
	},

	registerActiveSequenceStructureChangedFxn : function () {
		var success	=	app.bind("onActiveSequenceStructureChanged", $._PPP_.myActiveSequenceStructureChangedFxn);
	},

	registerActiveSequenceChangedFxn : function () {
		var success	=	app.bind("onActiveSequenceChanged", $._PPP_.myActiveSequenceChangedFxn);
	},

	registerSequenceSelectionChangedFxn : function () {
		var success = app.bind('onActiveSequenceSelectionChanged', $._PPP_.myActiveSequenceSelectionChangedFxn);
	},

	registerSequenceActivatedFxn : function () {
		var success = app.bind('onSequenceActivated', $._PPP_.mySequenceActivatedFxn);
	},

	forceLogfilesOn : function () {
		app.enableQE();
		var previousLogFilesValue = qe.getDebugDatabaseEntry("CreateLogFilesThatDoNotExist");

		if (previousLogFilesValue === 'true') {
			$._PPP_.updateEventPanel("Force create Log files was already ON.");
		} else {
			qe.setDebugDatabaseEntry("CreateLogFilesThatDoNotExist", "true");
			$._PPP_.updateEventPanel("Set Force create Log files to ON.");
		}
	},

	insertOrAppendToTopTracks : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var first = app.project.rootItem.children[0];
			if (first) {
				var time	= seq.getPlayerPosition();
				var newClip = seq.insertClip(first, time, (seq.videoTracks.numTracks - 1), (seq.audioTracks.numTracks - 1));
				if (newClip) {
					$._PPP_.updateEventPanel("Inserted " + newClip.name + ", into " + seq.name + ".");
				}
			} else {
				$._PPP_.updateEventPanel("Couldn't locate first projectItem.");
			}
		} else {
			$._PPP_.updateEventPanel("no active sequence.");
		}
	},

	closeAllProjectsOtherThanActiveProject : function () {
		var viewIDs				= app.getProjectViewIDs();
		var closeTheseProjects	= [];
		for (var a = 0; a < viewIDs.length; a++) {
			var thisProj = app.getProjectFromViewID(viewIDs[a]);
			if (thisProj.documentID !== app.project.documentID) {
				closeTheseProjects[a] = thisProj;
			}
		}
		// Why do this afterward? Because if we close projects in that loop [above], we change the active project, and scare the user. :)
		for (var b = 0; b < closeTheseProjects.length; b++) {
			$._PPP_.updateEventPanel("Closed " + closeTheseProjects[b].name);
			closeTheseProjects[b].closeDocument();
		}
	},

	countAdjustmentLayersInBin : function (parentItem, arrayOfAdjustmentLayerNames, foundSoFar) {
		for (var j = 0; j < parentItem.children.numItems; j++) {
			var currentChild = parentItem.children[j];
			if (currentChild) {
				if (currentChild.type == ProjectItemType.BIN) {
					$._PPP_.countAdjustmentLayersInBin(currentChild, arrayOfAdjustmentLayerNames, foundSoFar); // warning; recursion!
				} else {
					if (currentChild.isAdjustmentLayer()) {
						arrayOfAdjustmentLayerNames[foundSoFar] = currentChild.name;
						foundSoFar++;
					}
				}
			}
		}
		$._PPP_.updateEventPanel(foundSoFar + " adjustment layers found in " + app.project.name + ".");
	},

	findAllAdjustmentLayersInProject : function () {
		var arrayOfAdjustmentLayerNames	= [];
		var foundSoFar					= 0;
		var startingBin					= app.project.rootItem;

		$._PPP_.countAdjustmentLayersInBin(startingBin, arrayOfAdjustmentLayerNames, foundSoFar);

		if (arrayOfAdjustmentLayerNames.length) {
			var remainingArgs	= arrayOfAdjustmentLayerNames.length;
			var message			= remainingArgs + " adjustment layers found: ";

			for (var i = 0; i < arrayOfAdjustmentLayerNames.length; i++) {
				message += arrayOfAdjustmentLayerNames[i];
				remainingArgs--;
				if (remainingArgs > 1) {
					message += ', ';
				}
				if (remainingArgs === 1) {
					message += ", and ";
				}
				if (remainingArgs === 0) {
					message += ".";
				}
			}
			$._PPP_.updateEventPanel(message);
		} else {
			$._PPP_.updateEventPanel("No adjustment layers found in " + app.project.name + ".");
		}
	},

	consolidateDuplicates : function () {
		var result = app.project.consolidateDuplicates();
		$._PPP_.updateEventPanel("Duplicates consolidated in " + app.project.name + ".");
	},

	closeAllSequences : function () {
		var seqList = app.project.sequences;
		if (seqList.numSequences) {
			for (var a = 0; a < seqList.numSequences; a++) {
				var currentSeq = seqList[a];
				if (currentSeq) {
					currentSeq.close();
				} else {
					$._PPP_.updateEventPanel("No sequences from " + app.project.name + " were open.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No sequences found in " + app.project.name + ".");
		}
	},

	dumpAllPresets : function () {
		var desktopPath		= new File("~/Desktop");
		var outputFileName	= desktopPath.fsName + $._PPP_.getSep() + 'available_presets.txt';
		var exporters		= app.encoder.getExporters();
		var outFile			= new File(outputFileName);
		outFile.encoding	= "UTF8";

		outFile.open("w", "TEXT", "????");

		for (var i = 0; i < exporters.length; i++) {
			var exporter = exporters[i];
			if (exporter) {
				outFile.writeln('-----------------------------------------------');
				outFile.writeln(i + ': ' + exporter.name + ' : ' + exporter.classID + ' : ' + exporter.fileType);
				var presets = exporter.getPresets();
				if (presets) {
					outFile.writeln(presets.length + ' presets found.');
					outFile.writeln('+++++++++');
					outFile.writeln('+++++++++');
					for (var j = 0; j < presets.length; j++) {
						var preset = presets[j];
						if (preset) {
							outFile.writeln('matchName: ' + preset.matchName + '(' + preset.name + ')');
							outFile.writeln('+++++++++');
						}
					}
				}
			}
		}
		$._PPP_.updateEventPanel("List of available presets saved to desktop as \'available_presets.txt\'.");
		desktopPath.close();
		outFile.close();
	},

	reportSequenceVRSettings : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var settings = seq.getSettings();
			if (settings) {
				$._PPP_.updateEventPanel("====================================================");
				$._PPP_.updateEventPanel("VR Settings for \'" + seq.name + "\':");
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("	Horizontal captured view: "	+ settings.vrHorzCapturedView);
				$._PPP_.updateEventPanel("	Vertical captured view: "	+ settings.vrVertCapturedView);
				$._PPP_.updateEventPanel("	Layout: "					+ settings.vrLayout);
				$._PPP_.updateEventPanel("	Projection: "				+ settings.vrProjection);
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("");
				$._PPP_.updateEventPanel("====================================================");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	openProjectItemInSource : function () {
		var viewIDs = app.getProjectViewIDs();
		if (viewIDs) {
			for (var a = 0; a < app.projects.numProjects; a++) {
				var currentProject = app.getProjectFromViewID(viewIDs[a]);
				if (currentProject) {
					if (currentProject.documentID === app.project.documentID) { // We're in the right project!
						var selectedItems = app.getProjectViewSelection(viewIDs[a]);
						if (selectedItems) {
							for (var b = 0; b < selectedItems.length; b++) {
								var currentItem = selectedItems[b];
								if (currentItem) {
									if (currentItem.type !== ProjectItemType.BIN) { // For every selected item which isn't a bin or sequence...
										app.sourceMonitor.openProjectItem(currentItem);
									}
								} else {
									$._PPP_.updateEventPanel("No item available.");
								}
							}
						}
					}
				} else {
					$._PPP_.updateEventPanel("No project available.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No view IDs available.");
		}
	},

	reinterpretFootage : function () {
		var viewIDs = app.getProjectViewIDs();
		if (viewIDs) {
			for (var a = 0; a < app.projects.numProjects; a++) {
				var currentProject = app.getProjectFromViewID(viewIDs[a]);
				if (currentProject) {
					if (currentProject.documentID === app.project.documentID) { // We're in the right project!
						var selectedItems = app.getProjectViewSelection(viewIDs[a]);
						if (selectedItems.length) {
							for (var b = 0; b < selectedItems.length; b++) {
								var currentItem = selectedItems[b];
								if (currentItem) {
									if ((currentItem.type !== ProjectItemType.BIN) &&
										(currentItem.isSequence() === false)) {
										var interp = currentItem.getFootageInterpretation();
										if (interp) {
											interp.frameRate		= 17.868;
											interp.pixelAspectRatio	= 1.2121;
											currentItem.setFootageInterpretation(interp);
											$._PPP_.updateEventPanel("Changed frame rate and PAR for " + currentItem.name + ".");
										} else {
											$._PPP_.updateEventPanel("Unable to get interpretation for " + currentItem.name + ".");
										}
										var mapping = currentItem.getAudioChannelMapping;
										if (mapping) {
											mapping.audioChannelsType	= AUDIOCHANNELTYPE_Stereo;
											mapping.audioClipsNumber	= 1;
											mapping.setMappingForChannel(0, 4); // 1st param = channel index, 2nd param = source index
											mapping.setMappingForChannel(1, 5);
											currentItem.setAudioChannelMapping(mapping); // submit changed mapping object
											$._PPP_.updateEventPanel("Modified audio channel type and channel mapping for " + currentItem.name + ".");
										}
									}
								} else {
									$._PPP_.updateEventPanel("No project item available.");
								}
							}
						} else {
							$._PPP_.updateEventPanel("No items selected.");
						}
					}
				} else {
					$._PPP_.updateEventPanel("No project available.");
				}
			}
		} else {
			$._PPP_.updateEventPanel("No view IDs available.");
		}
	},

	createSubSequence : function () {

		/* 	Behavioral Note

			createSubSequence() uses track targeting to select clips when there is
			no current clip selection, in the sequence. To create a subsequence with
			clips on tracks that are currently NOT targeted, either select some clips
			(on any track), or temporarily target all desired tracks.

		*/

		var activeSequence = app.project.activeSequence;
		if (activeSequence) {
			var targetTrackFound	= false;
			var cloneAnyway			= true;
			for (var a = 0;	(a < activeSequence.videoTracks.numTracks && targetTrackFound === false); a++) {
				if (activeSequence.videoTracks[a].isTargeted()) {
					targetTrackFound = true;
				}
			}
			// If no targeted track was found, just target the first (zero-th) track, for demo purposes
			if (targetTrackFound === false) {
				activeSequence.videoTracks[0].setTargeted(true, true);
			}
			if ((activeSequence.getInPoint() === NOT_SET) && (activeSequence.getOutPoint() === NOT_SET)) {
				cloneAnyway = confirm("No in or out points set; clone entire sequence?", false, "Clone the whole thing?");
			}
			if (cloneAnyway) {
				var ignoreMapping	= confirm("Ignore track mapping?", false, "Ignore track mapping?");
				var newSeq			= activeSequence.createSubsequence(ignoreMapping);
				newSeq.name 		= newSeq.name + ", cloned by PProPanel.";
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	selectAllRetimedClips : function () {
		var activeSeq 		= app.project.activeSequence;
		var numRetimedClips = 0;
		if (activeSeq) {
			var trackGroups		= [activeSeq.audioTracks, activeSeq.videoTracks];
			var trackGroupNames = ["audioTracks", "videoTracks"];
			var updateUI 		= true;
			for (var groupIndex = 0; groupIndex < 2; groupIndex++) {
				var group = trackGroups[groupIndex];
				for (var trackIndex = 0; trackIndex < group.numTracks; trackIndex++) {
					var track = group[trackIndex];
					var clips = track.clips;
					for (var clipIndex = 0; clipIndex < clips.numItems; clipIndex++) {
						var clip = clips[clipIndex];
						if (clip.getSpeed() !== 1) {
							clip.setSelected(true, updateUI);
							numRetimedClips++;
						}
					}
				}
			}
			$._PPP_.updateEventPanel(numRetimedClips + " retimed clips found.");
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	selectReversedClips : function () {
		var sequence			= app.project.activeSequence;
		var numReversedClips	= 0;
		if (sequence) {
			var trackGroups		= [sequence.audioTracks, sequence.videoTracks];
			var trackGroupNames	= ["audioTracks", "videoTracks"];
			var updateUI = true;

			for (var groupIndex = 0; groupIndex < 2; groupIndex++) {
				var group = trackGroups[groupIndex];
				if (group){
					for (var trackIndex = 0; trackIndex < group.numTracks; trackIndex++) {
						for (var clipIndex = 0; clipIndex < group[trackIndex].clips.numItems; clipIndex++) {
							var clip		= group[trackIndex].clips[clipIndex];
							var isReversed	= clip.isSpeedReversed();
							if (isReversed) {
								clip.setSelected(isReversed, updateUI);
								numReversedClips++;
							}
						}
					}
				}
			}
			$._PPP_.updateEventPanel(numReversedClips + " reversed clips found.");
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	logConsoleOutput : function () {
		app.enableQE();
		var logFileName	= "PPro_Console_output.txt";
		var outFolder	= Folder.selectDialog("Where do you want to save the log file?");
		if (outFolder) {
			var entireOutputPath	= outFolder.fsName + $._PPP_.getSep() + logFileName;
			var result				= qe.executeConsoleCommand("con.openlog " + entireOutputPath);
			$._PPP_.updateEventPanel("Log opened at " + entireOutputPath + ".");
		} else {
			$._PPP_.updateEventPanel("No output folder selected.");
		}
	},

	closeLog : function () {
		app.enableQE();
		qe.executeConsoleCommand("con.closelog");
	},

	stitch : function (presetPath) {
		var viewIDs = app.getProjectViewIDs();
		var allPathsToStitch = "";
		
		for (var a = 0; a < app.projects.numProjects; a++) {
			var currentProject = app.getProjectFromViewID(viewIDs[a]);
			if (currentProject) {
				if (currentProject.documentID === app.project.documentID) { // We're in the right project!
					var selectedItems = app.getProjectViewSelection(viewIDs[a]);
					if (selectedItems.length > 1) {
						for (var b = 0; b < selectedItems.length; b++) {
							var currentItem = selectedItems[b];
							if (currentItem) {
								if ((!currentItem.isSequence()) && (currentItem.type !== ProjectItemType.BIN)) { // For every selected item which isn't a bin or sequence...
									allPathsToStitch += currentItem.getMediaPath();
									allPathsToStitch += ";";
								}
							}
						}
						var AMEString	= "var fe = app.getFrontend(); fe.stitchFiles(\"" + allPathsToStitch + "\"";
						var addendum	= ", \"H.264\", \"" + presetPath + "\", " + "\"(This path parameter is never used)\");";

						AMEString	+= addendum;
						var bt		= new BridgeTalk();
						bt.target	= 'ame';
						bt.body		= AMEString;
						bt.send();
					} else {
						$._PPP_.updateEventPanel("Select more than one render-able item, then try stitching again.");
					}
				}
			}
		}
	},

	myTrackItemAdded : function (track, trackItem) {
		$._PPP_.updateEventPanel('onActiveSequenceTrackItemAdded: ' + track.name + ' : ' + trackItem.name + ' : ' + trackItem.nodeId + ".");
	},

	myTrackItemRemoved : function (track, trackItem) {
		$._PPP_.updateEventPanel('onActiveSequenceTrackItemRemoved: ' + track.name + ' : ' + trackItem.name + ' : ' + trackItem.nodeId + ".");
	},

	mySequenceStructureChanged : function () {
		$._PPP_.updateEventPanel('onActiveSequenceStructureChanged.');
	},

	registerSequenceMessaging : function () {
		app.bind('onActiveSequenceTrackItemRemoved',	$._PPP_.myTrackItemRemoved);
		app.bind('onActiveSequenceTrackItemAdded',		$._PPP_.myTrackItemAdded);
		app.bind('onActiveSequenceStructureChanged',	$._PPP_.mySequenceStructureChanged);
	},

	enumerateTeamProjects : function () {
		var numTeamProjectsOpen = 0;
		for (var i = 0; i < app.projects.numProjects; i++) {
			var project = app.projects[i];
			if (project.isCloudProject) {
				numTeamProjectsOpen++;
				$._PPP_.updateEventPanel(project.name + " is a cloud-based project.");
				var localHubID = project.cloudProjectLocalID;
				$._PPP_.updateEventPanel("LocalHub Id is " + localHubID + ".");
				var production = qe.ea.getProductionByID(localHubID);
				$._PPP_.updateEventPanel("Production Name is " + production.name + ".");
				var remoteID = production.getRemoteProductionID();
				$._PPP_.updateEventPanel("Remote Production Id is " + remoteID + ".");
			}
		}
		if (numTeamProjectsOpen === 0) {
			$._PPP_.updateEventPanel("No open Team Projects found.");
		} else {
			$._PPP_.updateEventPanel(numTeamProjectsOpen + " open Team Projects Team Projects found.");
		}
	},

	enableWorkArea : function (enable) {
		var seq = app.project.activeSequence;
		if (seq) {
			var newStateString = "undefined";
			seq.setWorkAreaEnabled(enable);
			var newState = seq.isWorkAreaEnabled();
			if (newState) {
				newStateString = "ON";
			} else {
				newStateString = "OFF";
			}
			var update = "Work area for " + app.project.activeSequence.name + " is now " + newStateString + ".";
			$._PPP_.updateEventPanel(update);
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	modifyWorkArea : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			var workAreaIsEnabled = seq.isWorkAreaEnabled();
			if (!workAreaIsEnabled) {
				var confirmString	= "Enable work area for " + seq.name + "?";
				var turnOn			= confirm(confirmString, true, "Are you sure...?");
				if (turnOn) {
					$._PPP_.enableWorkArea(true);
				}
			}
			var oldIn 		= seq.getWorkAreaInPointAsTime();
			var oldOut 		= seq.getWorkAreaOutPointAsTime();
			var newIn 		= oldIn;
			var newOut 		= oldOut;
			var duration 	= oldOut.seconds	- oldIn.seconds;
			newIn.seconds 	= oldIn.seconds		+ 10;
			newOut.seconds 	= oldOut.seconds	- 10;

			seq.setWorkAreaInPoint(newIn.seconds);
			seq.setWorkAreaOutPoint(newOut.seconds);
		}
	},

	setLocale : function (localeFromCEP) {
		$.locale = localeFromCEP;
		$._PPP_.updateEventPanel("ExtendScript Locale set to " + localeFromCEP + ".");
	},

	disableTranscodeOnIngest : function(newValue) {
		return app.setEnableTranscodeOnIngest(newValue);
	},

	generateSystemCompatibilityReport : function() {
		var outputPath 		= new File("~/Desktop");
		var outputFileName 	= outputPath.fsName + $._PPP_.getSep() + "System_Compatibility_Report.txt";
		SystemCompatibilityReport.CreateReport(outputFileName);
		$._PPP_.updateEventPanel("System Compatibility report and project analysis report saved to user's Desktop.");
	},

	changeSequenceColorSpace : function() {
		var seq = app.project.activeSequence;
		if (seq) {
			var currentSeqSettings = seq.getSettings();
			if (currentSeqSettings) {
				if (currentSeqSettings.workingColorSpace === currentSeqSettings.workingColorSpaceList[0]) {
					currentSeqSettings.videoFrameRate.seconds	= 0.04;
					currentSeqSettings.videoDisplayFormat		= 101;
					currentSeqSettings.workingColorSpace		= currentSeqSettings.workingColorSpaceList[1];
					seq.setSettings(currentSeqSettings);
					$._PPP_.updateEventPanel("Changed sequence colorspace from \'" + currentSeqSettings.workingColorSpaceList[0] + "\' to \'" + currentSeqSettings.workingColorSpaceList[1] + "\'.");
				} else {
					currentSeqSettings.workingColorSpace = currentSeqSettings.workingColorSpaceList[0];
					seq.setSettings(currentSeqSettings);
					$._PPP_.updateEventPanel("Changed sequence colorspace to \'" + currentSeqSettings.workingColorSpaceList[0] + "\'.");
				}
				// Now, let's make sure all video clips in the sequence match the sequence's new colorspace.
				for (var trackIndex = 0; trackIndex < seq.videoTracks.numTracks; trackIndex++) {
					var track = seq.videoTracks[trackIndex];
					var clips = track.clips;
					for (var clipIndex = 0; clipIndex < clips.numItems; clipIndex++) {
						var clip = clips[clipIndex];
						if (clip.projectItem) {
							var oldColorSpace = clip.projectItem.getColorSpace();
							clip.projectItem.setOverrideColorSpace(currentSeqSettings.workingColorSpace);
							$._PPP_.updateEventPanel("Previous color space for " + clip.projectItem.name + " was: " + oldColorSpace + ".");
							$._PPP_.updateEventPanel(clip.name + " colorspace changed to \'" + currentSeqSettings.workingColorSpace + "\'.");
						} else {
							$._PPP_.updateEventPanel("No project item available, from " + clip.name + ".");
						}
					}
				}
			} else {
				$._PPP_.updateEventPanel("Could not obtain settings for " + seq.name + ".");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	autoReframeActiveSequence : function () {
		var seq = app.project.activeSequence;
		if (seq) {
			if (seq.isDoneAnalyzingForVideoEffects()) {
				var numerator		= 1;
				var denominator		= 1;
				var motionPreset	= "default"; // valid values = "default", "faster", and "slower"
				var newName 		= seq.name + ", auto-reframed by PProPanel.";
				var useNestedSeqs	= false;

				var newSequence = seq.autoReframeSequence(	numerator,
															denominator,
															motionPreset,
															newName,
															useNestedSeqs);

				if (newSequence) {
					$._PPP_.updateEventPanel("Created reframed sequence: " + newName + ".");
				} else {
					$._PPP_.updateEventPanel("Failed to create re-framed sequence: " + newName + ".");
				}
			} else {
				$._PPP_.updateEventPanel("Analysis incomplete; try again later.");
			}
		} else {
			$._PPP_.updateEventPanel("No active sequence.");
		}
	},

	createNewProject : function () {
		var outPath		= Folder.selectDialog("Choose the output directory");
		if (outPath) {
			var projName	= prompt('Name of project?', '', 'Project Naming Prompt');
			if (projName) {
				var completeOutputPath = outPath.fsName + $._PPP_.getSep() + projName;
				var result = app.newProject(completeOutputPath);
				if (result === true) {
					$._PPP_.updateEventPanel("Created project: " + projName + ".");
				} else {
					$._PPP_.updateEventPanel("Failed to create project: " + projName + ".");
				}
			}
		}
	},

	openProduction : function () {
		var openProduction = app.production;
		if (openProduction) {
			var closeFirst = confirm("Close " + openProduction.name + "?", true, "Close open Production?");
			if (closeFirst) {
				openProduction.close();
			}
		}
		var prodFolder		= Folder.selectDialog("Select the Production folder to open.");
		if (prodFolder) {
			var someProduction = app.openPrProduction(prodFolder.fsName);
			if (someProduction) {
				$._PPP_.updateEventPanel("Opened production: " + someProduction.name + ".");
			} else {
				$._PPP_.updateEventPanel("Failed to open production at path: " + prodFolder.fsName + ".");
			}
		}
	},

	toggleProductionLockState : function () {
		var openProduction = app.production;
		if (openProduction) {
			var numOpenProductionProjects = openProduction.projects.length;
			if (numOpenProductionProjects) {
				var preSuffix	= "uninitialized.";
				var postSuffix	= "uninitialized.";
				for (var a = 0; a < numOpenProductionProjects; a++) {
					var currentProject = openProduction.projects[a];
					if (currentProject) {
						var currentLockState = openProduction.getLocked(currentProject);
						if (currentLockState) {
							preSuffix	= "locked.";
							postSuffix	= "unlocked.";
						} else {
							preSuffix	= "unlocked.";
							postSuffix	= "locked.";
						}
						$._PPP_.updateEventPanel(currentProject.name + " was " + preSuffix);
						openProduction.setLocked(currentProject, !currentLockState);
						$._PPP_.updateEventPanel(currentProject.name + " is now " + postSuffix);
					}
				}
			} else {
				$._PPP_.updateEventPanel("No Production projects open.");
			}
		} else {
			$._PPP_.updateEventPanel("No production open.");
		}
	},

	closeAllOpenProductionProjects : function () {
		var openProduction = app.production;
		if (openProduction) {
			var numOpenProductionProjects = openProduction.projects.length;
			if (numOpenProductionProjects) {
				var projArray = [];
				for (var a = 0; a < numOpenProductionProjects; a++) {
					projArray[a] = openProduction.projects[a];
				}
				for (var b = 0; b < numOpenProductionProjects; b++) {
					var currentProject = projArray[b];
					if (currentProject) {
						var saveFirst		=	true;
						var promptIfDirty	=	false;
						$._PPP_.updateEventPanel(currentProject.name + " closed.");
						currentProject.closeDocument(saveFirst, promptIfDirty);
					}
				}
			} else {
				$._PPP_.updateEventPanel("No Production projects open.");
			}
		} else {
			$._PPP_.updateEventPanel("No production open.");
		}
	},

	moveProductionProjectsToTrash : function () {
		var openProduction = app.production;
		if (openProduction) {
			var numOpenProductionProjects = openProduction.projects.length;
			if (numOpenProductionProjects) {
				var projArray = [];
				for (var a = 0; a < numOpenProductionProjects; a++) {
					projArray[a] = openProduction.projects[a];
				}
				for(var c = 0; c < projArray.length; c++) {
					var currentProject = projArray[c];
					$._PPP_.updateEventPanel(currentProject.name + " moved to Trash.");
					var result = openProduction.moveToTrash(currentProject.path, true, true);
				}
			} else {
				$._PPP_.updateEventPanel("No Production projects open.");
			}
		} else {
			$._PPP_.updateEventPanel("No production open.");
		}
	},

	performCutDetection : function () {
		var activeSeq = app.project.activeSequence;
		if (activeSeq) {
			var sel = activeSeq.getSelection();
			if (sel) {
				var action 							= 'ApplyCuts';	//'ApplyCuts', 'CreateMarkers'
				var shouldApplyCutsToLinkedAudio	= true;
				var sensitivity 					= 'LowSensitivity'; //'LowSensitivity', 'MediumSensitivity', 'HighSensitivity'
				var result = activeSeq.performSceneEditDetectionOnSelection(action, shouldApplyCutsToLinkedAudio, sensitivity);
			} else {
				$._PPP_.updateEventPanel("performSceneEditDetectionOnSelection: Nothing selected, in sequence.");
			}
		} else {
			$._PPP_.updateEventPanel("performSceneEditDetectionOnSelection: No active sequence.");
		}
	},

	newSequenceFromProjectSelection : function () {
		var viewIDs         = app.getProjectViewIDs();
        var viewSelection   = app.getProjectViewSelection(viewIDs[0]); // sample code optimized for a single open project
		if (viewSelection) {
			// Note: The sample code doesn't work with bins. Todo: Add code that adds all footage contained in bins to the sequence
			var newSequence = app.project.createNewSequenceFromClips("new sequence", viewSelection, app.project.rootItem);
		} else {
			$._PPP_.updateEventPanel("No project items selected (or a bin was selected).");
		}
	},

	adjustGraphicsWhiteLuminance : function () {
		var supportedValues = app.project.getSupportedGraphicsWhiteLuminances();
		var currentGWL		= app.project.getGraphicsWhiteLuminance();
		var result			= false;

		if (supportedValues && currentGWL) {
			$._PPP_.updateEventPanel("Graphics White Luminance was: " + currentGWL + ".");
			if (currentGWL === 100) {
				result = app.project.setGraphicsWhiteLuminance(supportedValues[1]);
			} else {
				result = app.project.setGraphicsWhiteLuminance(supportedValues[0]);
			}
			$._PPP_.updateEventPanel("Graphics White Luminance changed to: " + app.project.getGraphicsWhiteLuminance() + ".");
		} else {
			$._PPP_.updateEventPanel("Could not obtain valid white luminance values.");
		}
	},

	enableAllDisabledClips : function () { 			
		var clips = app.project.sequences[0].videoTracks[0].clips;
		var numClips = clips.numItems;
		for (var i = 0; i < numClips; i++) {
			var currentClip = clips[i];
			if (currentClip) {
				if (currentClip.disabled === true){ //using new trackItem property, disabled
				currentClip.disabled = false;	
				}
			}
		}
	},
	
	showColorspaceInEvents : function () { 
		var colorSpace 		= app.project.rootItem.children[0].getColorSpace();
		var origColorSpace 	= app.project.rootItem.children[0].getOriginalColorSpace();
		var lutID 			= app.project.rootItem.children[0].getEmbeddedLUTID();
		var inputLutID 		= app.project.rootItem.children[0].getInputLUTID();

		//get the color space info and record it in the events panel
		if (colorSpace){
			if (origColorSpace){
				if (lutID){
					if (inputLutID){
						app.setSDKEventMessage("Color Space " + " = " + colorSpace.name, 'info');
						app.setSDKEventMessage("Transfer Characteristic " + " = " + colorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Color Primaries " + " = " + colorSpace.primaries, 'info');
						app.setSDKEventMessage("Matrix Equation " + " = " + colorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("Original Color Space " + " = " + origColorSpace.name, 'info');
						app.setSDKEventMessage("Original Transfer Characteristic " + " = " + origColorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Original Color Primaries " + " = " + origColorSpace.primaries, 'info');
						app.setSDKEventMessage("Original Matrix Equation " + " = " + origColorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("LutID " + " = " + lutID, 'info');
						app.setSDKEventMessage("input LutID " + " = " + inputLutID, 'info');
					} else {
						alert("Input LUT ID not found.");
					}
				} else {
					alert("LUT ID not found.");
				}
			} else {
				alert("Original colorspace not available.");
			}
		} else {
			alert("No colorspace available.");
		}
		//get the color space info and record it in the events panel
		if (colorSpace){
			if (origColorSpace){
				if (lutID){
					if (inputLutID){
						app.setSDKEventMessage("Color Space " + " = " + colorSpace.name, 'info');
						app.setSDKEventMessage("Transfer Characteristic " + " = " + colorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Color Primaries " + " = " + colorSpace.primaries, 'info');
						app.setSDKEventMessage("Matrix Equation " + " = " + colorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("Original Color Space " + " = " + origColorSpace.name, 'info');
						app.setSDKEventMessage("Original Transfer Characteristic " + " = " + origColorSpace.transferCharacteristic, 'info');
						app.setSDKEventMessage("Original Color Primaries " + " = " + origColorSpace.primaries, 'info');
						app.setSDKEventMessage("Original Matrix Equation " + " = " + origColorSpace.matrixEquation, 'info');
				
						app.setSDKEventMessage("LutID " + " = " + lutID, 'info');
						app.setSDKEventMessage("input LutID " + " = " + inputLutID, 'info');
					} else {
						alert("Input LUT ID not found.");
					}
				} else {
					alert("LUT ID not found.");
				}
			} else {
				alert("Original colorspace not available.");
			}
		} else {
			alert("No colorspace available.");
		}
	},
	moveTrackItemOnTimeline : function () {	
		app.project.sequences[0].audioTracks[0].clips[0].move(13);
 		app.project.sequences[0].videoTracks[0].clips[0].move(13);
	},

	importSrtAddToCaptionTrack: function() {
        var destBin = app.project.getInsertionBin();
        if (destBin) {
            var prevItemCount = destBin.children.numItems;

            var filterString = "";
            if (Folder.fs === 'Windows') {
                filterString = "All files:*.*";
            }
            if (app.project) {
                var importThese = [];
                var fileOrFilesToImport = File.openDialog("Choose files to import", // title
                    filterString, // filter available files?
                    true); // allow multiple?
                if (fileOrFilesToImport) {
                    // We have an array of File objects; importFiles() takes an array of paths.
                    if (importThese) {
                        for (var i = 0; i < fileOrFilesToImport.length; i++) {
                            importThese[i] = fileOrFilesToImport[i].fsName;
                        }
                        var suppressWarnings = true;
                        var importAsStills = false;
                        app.project.importFiles(importThese,
                            suppressWarnings,
                            app.project.getInsertionBin(),
                            importAsStills);

                    } else {
                        $._PPP_.updateEventPanel("No files to import.");
                    }
                }

                if (importThese) {
                    var newItemCount = destBin.children.numItems;
                    if (newItemCount > prevItemCount) {
                        var importedSRT = destBin.children[(newItemCount - 1)];
                        if (importedSRT) {
                            var activeSeq = app.project.activeSequence;
                            if (activeSeq) {
                                var startAtTime = 0;
                                var result = app.project.activeSequence.createCaptionTrack(importedSRT, startAtTime);
                            } else {
                                $._PPP_.updateEventPanel("No active sequence.");
                            }
                        } else {
                            $._PPP_.updateEventPanel("Whoops, couldn't find imported .srt file.");
                        }
                    } else {
                        $._PPP_.updateEventPanel("Whoa, no new item? How'd THAT happen?!");
                    }
                } else {
                    $._PPP_.updateEventPanel("importFiles() failed to import, OR return an error message. I quit!");
                }
            } else {
                $._PPP_.updateEventPanel("No destination bin available");
            }
        }
    },

	checkMacFileType : function(file) {
		if (!file instanceof Folder){
			return true;
		} 
		
		var index = file.name.lastIndexOf(".");
		var ext = file.name.substring(index + 1);
		
		if(ext == "xml" || ext == "XML") {
			return true;
		} else {
			return false;
		}
	}
}
