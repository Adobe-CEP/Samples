$._ext_PPRO={

	getVersionInfo : function() {
		return 'PPro ' + app.version + 'x' + app.build;
	},

	updateGrowingFile : function() {
		var numItems = app.project.rootItem.children.numItems;

		var currentItem = 0;

		for (var i = 0; i < numItems; i++){
		    currentItem = app.project.rootItem.children[i];
		    if (currentItem != null){
		        currentItem.refreshMedia();
		    }
		}
	},

	saveProject : function() {
		app.project.save();
	},

    exportCurrentFrameAsPNG : function() {
        app.enableQE();	 									// enables QE DOM, including sequence objects with super powers

        var seq 		= qe.project.getActiveSequence(); 	// note: make sure a sequence is active in PPro UI

        if (seq != null) {
	        var time 		= seq.CTI.timecode; 			// CTI = Current Time Indicator.
	        var out_path   	= new File("~/Desktop");

			var sep         = '\\';
			         
			if (qe.platform == 'Macintosh') {
			    sep = '/';
			}

			var output_filename = out_path.fsName + sep + seq.name;
			seq.exportFramePNG(time, output_filename);    
		} else {
			alert("Active sequence required.");
		}
	},

    renameFootage : function() {
		
		// Warning: Currently, sample code assumes the zero-th item in the project is footage.

		var item = app.project.rootItem.children[0]; 
		
		if (item == null) {
			alert("The first item in the project needs to be footage.")
		} else {
			alert("Changing name of " + item.name + ".");

			item.name = "PPro Panel sample touched " + item.name;

			item.refreshMedia(); // This is how you refresh a growing file, using the API.
		}
	},

	getActiveSequenceName : function() {
    	var return_msg = "No active sequence."

    	var active_seq = app.project.activeSequence;

    	if (active_seq != null) {
		    return_msg = active_seq.name;
		}
		
		return return_msg;
    },
    
    exportSequenceAsPrProj : function() {
		app.enableQE();
		
		var project = app.project;
	
		if (project.activeSequence != null) {
		    
			// Here's how to get the start time offset to a sequence.

			var start_time_offset = project.activeSequence.zeroPoint;

			var out_name    = project.activeSequence.name;
		    var extension   = '.prproj';
		    
			var sep         = '\\';
            
            if (qe.platform == 'Macintosh') {
                sep = '/';
            }
		    
			var outFolder = Folder.selectDialog();
		
		    if (outFolder != null) {
                var entire_out_path =	outFolder.fsName + 
                                      	sep +
                                      	out_name +
                                      	extension;

				project.activeSequence.exportAsProject(entire_out_path);
		
			    var info = "Exported " + project.activeSequence.name + " to " + entire_out_path + ".";
			
			    alert(info);
			}
			// Here's how to import JUST that sequence from a project.
			//
			// var seqIDsToBeImported = new Array;
			// seqIDsToBeImported[0] = ID1;
			// ...
			// seqIDsToBeImported[N] = IDN;
			//
			//app.project.importSequences(pathToPrProj, seqIDsToBeImported);
		} else {
		    alert("No active sequence.");
		}
	},

	createSequenceMarkers : function() {
	    var active_seq = app.project.activeSequence;
	    
	    if (active_seq != null) {
		    var markers		= active_seq.markers; 
	
		    if (markers != null) {
			    var numMarkers	= markers.numMarkers;

                if (numMarkers > 0) {
                    var marker_index = 1;
                    
                    for(var current_marker = 	markers.getFirstMarker(); 
                    		current_marker !=	undefined; 
							current_marker =	markers.getNextMarker(current_marker)){
                        if (current_marker.name != "") {
                            alert(	'Marker ' + 
                            		marker_index + 
                            		' name = ' +
                            		current_marker.name + 
                            		'.');
                        } else {
                            alert(	'Marker ' + 
                            		marker_index + 
                            		' has no name.');
                        }
                    
                        if (current_marker.end.seconds > 0) {
                            alert(	'Marker ' + 
                            		marker_index + 
                            		' duration = ' +
                            		(current_marker.end.seconds - current_marker.start.seconds) + 
                            		' seconds.');
                        } else {
                            alert(	'Marker ' + 
                            		marker_index + 
                            		' has no duration.');
                        }

                        alert(	'Marker ' + 
                        		marker_index + 
                        		' starts at ' + 
                        		current_marker.start.seconds + 
                        		' seconds.');
                        
                        marker_index = marker_index + 1;
				    }
				 }
			}
	
			var new_comment_marker  		= markers.createMarker(12.345);
			new_comment_marker.name 		= 'Marker created by PProPanel.';
			new_comment_marker.comments 	= 'Here are some comments, inserted by PProPanel.';
			new_comment_marker.end.seconds 	= 15.6789;


			var new_web_marker  		= markers.createMarker(14.345);
			new_web_marker.name 		= 'Web marker created by PProPanel.';
			new_web_marker.comments 	= 'Here are some comments, inserted by PProPanel.';
			new_web_marker.end.seconds 	= 15.6789;
			new_web_marker.setTypeAsWebLink("http://www.adobe.com", "frame target");
	    }
	},
	
    exportFCPXML : function() {
        app.enableQE();
        
        var project = app.project;
        
        if (project.activeSequence != null) {
            var proj_path   = new File(project.path);
            var parent_dir  = proj_path.parent;
            var out_name    = project.activeSequence.name;
        	var extension   = '.xml';
            var sep         = '\\';

            if (qe.platform == 'Macintosh') {
                sep = '/';
            }
            
            var output_path = Folder.selectDialog("Choose the output directory");
		
			if (output_path != null) {

	            var entire_out_path = output_path.fsName + sep + out_name + extension;
	        	
	        	project.activeSequence.exportAsFinalCutProXML(entire_out_path, 1); // 1 == suppress UI
	        	
	            var info = 	"Exported FCP XML for " + 
	            			project.activeSequence.name + 
	            			" to " + 
	            			entire_out_path + 
	            			", next to the project.";

	            alert(info);
	        } else {
	        	alert("No output path chosen.")
	        }
        } else {
        	alert("No active sequence.");
        }
    },
	
	openInSource : function() {
        app.enableQE();
		
		var file_to_open = File.openDialog ("Choose file to open.", 0, false);

		if (file_to_open != null) {
			qe.source.openFilePath(file_to_open.fsName);
			qe.source.player.play(); 
		}
	},

	importFiles : function() {

		function searchForBinWithName(name) {
            var numItemsAtRoot = app.project.rootItem.children.numItems;
            var foundBin = 0;
          
            for (var i = 0; i < numItemsAtRoot && foundBin == 0; i++) {
                var currentItem = app.project.rootItem.children[i];
          
                if (currentItem != null && currentItem.name == nameToFind) {
                    foundBin = currentItem;
                }
            }
            return foundBin;
        }

		var proj = app.project;
        
        // Find or create a target bin.

        var nameToFind = 'Targeted by PProPanel import';

        var targetBin = searchForBinWithName(nameToFind);

        if (targetBin == 0) {
            app.project.rootItem.createBin(nameToFind);
        }
		
        if (proj != null) {
            targetBin = searchForBinWithName(nameToFind);
            targetBin.select();
            
			var file_or_files_to_import = File.openDialog ("Choose files to import", 0, true);
			
            if (file_or_files_to_import != null) {
				// We have an array of File objects; importFiles() takes an array of paths.
						
				var import_these = new Array;
				
                for (var i = 0; i < file_or_files_to_import.length; i++) {
					import_these[i] = file_or_files_to_import[i].fsName;
				}
				proj.importFiles(import_these);	
			}	
		}	
	},
	
	replaceMedia : function() {
		// Warning: Currently, sample code assumes the zero-th item in the project is footage.

		var item = app.project.rootItem.children[0]; 
		
		if (item.canChangeMediaPath()) {
			var replacement_media = File.openDialog(	"Choose new media file, for project item " + 
														item.name, 
														0, 
														false);
			
			if (replacement_media != null) {
				item.name = replacement_media.name + ", formerly known as " + item.name;

				item.changeMediaPath(replacement_media.fsName);

				replacement_media.close(); 
			}
		} else {
			alert("Couldn't change path. replaceMedia() can't act on merged clips, or maybe the zero-th item isn't footage.");
		}
	},
	
	openProject : function() {
		app.enableQE();

		if (qe.platform == 'Macintosh'){
			var filterString = "";
		} else {
			var filterString = "All files:*.*";
		}

		var proj_to_open = File.openDialog ("Choose project:", filterString, false);

		if (proj_to_open != null && proj_to_open.exists) {
			app.openDocument(proj_to_open.fsName);
			proj_to_open.close();
		}	
	},

	createSequence : function(name) {
		var some_arbitrary_id_value = "xyz123";
		app.project.createNewSequence("Some Sequence Name", some_arbitrary_id_value);
	},

	createSequenceFromPreset : function(preset_path) {
		app.enableQE();
		qe.project.newSequence("Some Sequence Name", preset_path);
	},

	render : function() {
		app.enableQE();
		
		var active_seq = qe.project.getActiveSequence();
		
		if (active_seq != null)	{
			// Just for reference, here's how to access the CTI 
			// position, for the active sequence. 

			var time_in_secs                = active_seq.CTI.secs;
			var time_in_frames              = active_seq.CTI.frames;
			var time_in_ticks               = active_seq.CTI.ticks;
			var time_as_formatted_string    = active_seq.CTI.timecode;


			// Define a couple of callback functions, for AME to use during render.
			
			function message(msg) {
				// $.writeln(msg);	 uncomment, to invoke ESTK!
			}
			
			function onEncoderJobComplete(jobID, outputFilePath) {
				app.enableQE();
				if (qe.platform == 'Macintosh') {
					var eoName = "PlugPlugExternalObject";							
				} else {
					var eoName = "PlugPlugExternalObject.dll";
				}
						
				var mylib 	 = new ExternalObject('lib:' + eoName);
				var eventObj = new CSXSEvent();

				eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
				eventObj.data = "Rendered Job " + jobID + ", to " + outputFilePath + ".";
	        	eventObj.dispatch();
			}
			
			function onEncoderJobError(jobID) {
				app.enableQE();
				if (qe.platform == 'Macintosh')
				{
					var eoName = "PlugPlugExternalObject";							
				} 
				else
				{
					var eoName = "PlugPlugExternalObject.dll";
				}
						
				var mylib 	 = new ExternalObject('lib:' + eoName);
				var eventObj = new CSXSEvent();

				eventObj.type = "com.adobe.csxs.events.PProPanelRenderEvent";
				eventObj.data = "Job " + jobID + ", to " + outputFilePath + ", FAILED. :(";
	        	eventObj.dispatch();
			}
			
			function onEncoderJobProgress(jobID, progress) {
				var msg = 	'onEncoderJobProgress called' +
							'. jobID = ' + 
							jobID +
							'. progress = ' + 
							progress;
							
				message(msg);
			}

			function onEncoderJobQueued(jobID) {
			    app.encoder.startBatch();
			}

			var proj_path   	= new File(app.project.path);
			var out_path    	= new File("~/Desktop");
			var sep         	= '\\';
			var out_preset_path	= "C:\Program Files\Adobe\Adobe Media Encoder CC 2014\MediaIO\systempresets\58444341_4d584658\XDCAMHD 50 NTSC 60i.epr";
			
			if (qe.platform == 'Macintosh') {
				var out_preset_path = "/Applications/Adobe Premiere Pro CC 2014/Adobe Premiere Pro CC 2014.app/MediaIO/systempresets/58444341_4d584658/XDCAMHD 50 NTSC 60i.epr";
				sep = '/';
			}
			
			var out_preset  = new File(out_preset_path);
			
			var extension   			= active_seq.getExportFileExtension(out_preset.fsName);
			var filename_plus_extension = active_seq.name + "." + extension;
			var full_path_to_file 		= 	out_path.fsName + 
											sep + 
											active_seq.name + 
											"." + 
											extension;			
			
			app.encoder.bind('onEncoderJobComplete',	onEncoderJobComplete);
			app.encoder.bind('onEncoderJobError', 		onEncoderJobError);
			app.encoder.bind('onEncoderJobProgress', 	onEncoderJobProgress);
			app.encoder.bind('onEncoderJobQueued', 		onEncoderJobQueued);

			var output_dir = new File('~/Desktop');

			// use these 0 or 1 settings to disable some/all metadata creation.

			app.encoder.setSidecarXMPEnabled(0);
			app.encoder.setEmbeddedXMPEnabled(0);

			var jobID = app.encoder.encodeSequence(	app.project.activeSequence,
													full_path_to_file,
													out_preset.fsName,
													app.encoder.ENCODE_WORKAREA); // app.encoder.ENCODE_ENTIRE, app.encoder.ENCODE_IN_TO_OUT);
			message('jobID = ' + jobID);

			proj_path.close();
			output_dir.close();
			out_preset.close();
		} else {
			alert("No active sequence.");
		}
	},

    saveProjectAs : function() {
		app.enableQE();
			
		var session_counter = 1;
		var output_path 	= Folder.selectDialog("Choose the output directory");
		var sep         	= '\\';
        
        if (qe.platform == 'Macintosh') {
            sep = '/';
        }
		    
		if (output_path != null) {
			var abs_path 	= output_path.fsName;
		    var outname 	= new String(app.project.name);
		    var array 		= outname.split('.', 2);

		    outname = array[0]+ session_counter + '.' + array[1]; 
		    session_counter++;
			
		    var full_out_path = abs_path + sep + outname;
		    app.project.saveAs(full_out_path);
		    app.openDocument(full_out_path);
		}
	},
		
	mungeXMP : function()
	{
		var proj_item = app.project.rootItem.children[0]; // assumes first item is footage.

		if (proj_item != null) {
			if (ExternalObject.AdobeXMPScript == undefined) {
				ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript'); 
			}
	
			if(ExternalObject.AdobeXMPScript != undefined) { 	// safety-conscious!
				var xmp_blob = proj_item.getXMPMetadata();
				var xmp = new XMPMeta(xmp_blob);
				var have_a_scene = xmp.doesPropertyExist(XMPConst.NS_DM, "scene");
				var oldVal = "";
				
				if (have_a_scene == true){
					var myScene = xmp.getProperty(XMPConst.NS_DM, "scene");
					oldVal 		= myScene.value;
				}
			
				// Regardless of whether there WAS scene data, set scene data. 
				
				xmp.setProperty(XMPConst.NS_DM, "scene", oldVal + " Added by PProPanel sample!");
				
				// Now, let's mess with the description! Multi-line field == slightly more complicated. 
				
    			var descriptionProp 			= "description";
    			var have_a_description 			= xmp.doesPropertyExist(XMPConst.NS_DC, descriptionProp);
				var firstDescription 			= "PProPanel wrote the first value into description.";
				var numDescriptionValuesPresent = xmp.countArrayItems(XMPConst.NS_DC, descriptionProp);
			
    			if( numDescriptionValuesPresent == 0) {
    				xmp.appendArrayItem(XMPConst.NS_DC, 
    									descriptionProp, 
    									null, 
    									XMPConst.PROP_IS_ARRAY, 
    									XMPConst.ARRAY_IS_ORDERED);

    				xmp.insertArrayItem(XMPConst.NS_DC, 
    									descriptionProp, 
    									1, 
    									firstDescription);
    			} else {
    				var appendedText 	= '...blahblahblah added by PProPanel.';

    				oldDescriptionValue = xmp.getArrayItem(XMPConst.NS_DC, descriptionProp, 1);

    				xmp.setArrayItem(	XMPConst.NS_DC, 
    									descriptionProp, 
    									1, 
    									(oldDescriptionValue.value + appendedText));
    			}

				var xmp_as_str = xmp.serialize();		// either way, serialize and write XMP.
				proj_item.setXMPMetadata(xmp_as_str);
			}
		}
	},
	
	pokeAnywhere : function() {
		function getProductionByName(nameToGet) {
			for (var i = 0; i < prod_list.numProductions; i++) {
				this_prod = prod_list[i];

				if (this_prod.name == nameToGet) {
					return this_prod;
				}
			}
			return undefined;
		}

		var token 				= app.anywhere.getAuthenticationToken();
		var prod_list 			= app.anywhere.listProductions();
		var isProductionOpen	= app.anywhere.isProductionOpen();
		
		if (isProductionOpen == true) {
			var sessionURL		= app.anywhere.getCurrentEditingSessionURL();
			var selectionURL	= app.anywhere.getCurrentEditingSessionSelectionURL();
			var active_seqURL	= app.anywhere.getCurrentEditingSessionActiveSequenceURL();
			
			var theOneIAskedFor = getProductionByName("test");
		
			if (theOneIAskedFor != null) {
				var out = theOneIAskedFor.name + ", " + theOneIAskedFor.description;

				alert(out);	// todo: put useful code here.
		}
		} else {
			alert("No Production open.");
		}
	},

	getMethods: function(obj) {
		var ps = "Methods: ";
		for (var ii=0; ii < obj.reflect.methods.length; ii++) {
			ps +=  obj.reflect.methods[ii].name + "; ";
		}
		return ps;
	},

	getProps: function(obj) {
		var ps = "Properties: ";
		for (var ii=0; ii < obj.reflect.properties.length; ii++) {
			ps +=  obj.reflect.properties[ii].name + "; ";
		}
		return ps;
	},

	dumpOMF : function() {
		app.enableQE();
		
		var active_seq = qe.project.getActiveSequence();
		
		if (active_seq != null) {
			var output_path = Folder.selectDialog("Choose the output directory");
		
			if (output_path != null){
				var abs_path = output_path.fsName;
			    var outname  = new String(active_seq.name) + '.omf';

                var sep         = '\\';

                if (qe.platform == 'Macintosh') {
                	sep = '/';
                }
                
                var full_out_path_with_name = abs_path + sep + outname;

				app.project.exportOMF(	app.project.activeSequence,            // sequence
										full_out_path_with_name, 						// output file path
										'OMFTitle',                    // OMF title
										48000,                    // sample rate (48000 or 96000)
										16,                        // bits per sample (16 or 24)
										1,                        // audio encapsulated flag (1 : yes or 0 : no)
										0,                        // audio file format (0 : AIFF or 1 : WAV)
										0,                        // trim audio files (0 : no or 1 : yes)
										0,                        // handle frames (if trim is 1, handle frames from 0 to 1000)
										0);                        // include pan flag (0 : no or 1 : yes)
			}
		} else {
			alert("No active sequence.");
		}
	},
	
	renderForiPad : function () {
		app.enableQE();

		var active_seq = qe.project.getActiveSequence();
		
		if (active_seq != null)	{
			// Define some callback functions, for AME to use during render.
			
			function message(msg) {
				// $.writeln(msg);	If you'd like to launch ESTK, uncomment this.
			}
			
			function onEncoderJobComplete(jobID, outputFilePath) {
				var msg = 	'onEncoderJobComplete called' +
							'. jobID = ' + 
							jobID +
							'. outputFilePath = ' + 
							outputFilePath;
							
				message(msg);
			}
			
			function onEncoderJobError(jobID) {
				var msg = 	'onEncoderJobError called' +
							'. jobID = ' + 
							jobID;
							
				message(msg);
			}
			
			function onEncoderJobProgress(jobID, progress) {
				var msg = 	'onEncoderJobProgress called' +
							'. jobID = ' + 
							jobID +
							'. progress = ' + 
							progress;
							
				message(msg);
			}
			
			function onEncoderJobQueued(jobID) {
			    app.encoder.startBatch();
			}

			var output_path = Folder.selectDialog("Choose the output directory");
		
			if (output_path != null && output_path.exists) {
			    var sep = '\\';
			     
				if (qe.platform == 'Macintosh') {
					var out_preset_path = "Applications/Adobe Premiere Pro CC 2014/Adobe Premiere Pro CC 2014.app/MediaIO/systempresets/4E49434B_48323634/Apple TV, iPad, iPhone 4 and newer - 960x540 29.97.epr";
					sep = '/';
				} else {
					var out_preset_path  = "C:\Program Files\Adobe\Adobe Media Encoder CC 2014\MediaIO\systempresets\4E49434B_48323634\Apple TV, iPad, iPhone 4 and newer - 960x540 29.97.epr";
				}
				
				var out_preset  = new File(out_preset_path);
				
				var extension   			= 	active_seq.getExportFileExtension(out_preset.fsName);
				var filename_plus_extension = 	active_seq.name + "." + extension;
				var full_path_to_file 		= 	output_path.fsName + 
												sep + 
												active_seq.name + 
												"." + 
												extension;			
				
				app.encoder.bind('onEncoderJobComplete', onEncoderJobComplete);
				app.encoder.bind('onEncoderJobError', onEncoderJobError);
				app.encoder.bind('onEncoderJobProgress', onEncoderJobProgress);
				app.encoder.bind('onEncoderJobQueued', onEncoderJobQueued);

				// use these 0 or 1 settings to disable some/all metadata creation.

				app.encoder.setSideCarXMPEnabled(0);
				app.encoder.setEmbeddedXMPEnabled(0);

				var jobID = app.encoder.encodeSequence(	app.project.activeSequence,
														full_path_to_file,
														out_preset.fsName,
														app.encoder.ENCODE_WORKAREA); // app.encoder.ENCODE_ENTIRE, app.encoder.ENCODE_IN_TO_OUT
				message('jobID = ' + jobID);
			
				out_preset.close();
		}
		} else {
			alert("No active sequence.");
		}
	},
	
	addClipMarkers : function () {
		var proj_item = app.project.rootItem.children[0]; // assumes first item is footage.

		if (proj_item != null) {
            if (proj_item.type == ProjectItemType.CLIP ||
                proj_item.type == ProjectItemType.FILE) {
                
			markers = proj_item.getMarkers();

				if (markers != null) {
					var num_markers 	= markers.numMarkers;

					var new_marker  	= markers.createMarker(12.345);
					new_marker.name 	= 'Marker created by PProPanel.';
					new_marker.comments = 'Here are some comments, inserted by PProPanel.';
					new_marker.end 		= 15.6789;

					//default marker type == comment. To change marker type, call one of these:

				// new_marker.setTypeAsChapter();
				// new_marker.setTypeAsWebLink();
				// new_marker.setTypeAsSegmentation();
				// new_marker.setTypeAsComment();
				}
			} else {
           		alert("Can only add markers to clips or files.");
			}
		}    
	},

	modifyProjectMetadata : function () {
		
		var kPProPrivateProjectMetadataURI = "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/";

		var namefield = "Column.Intrinsic.Name";
		var tapename  = "Column.Intrinsic.TapeName";
		var desc      = "Column.PropertyText.Description";

		if (app.isDocumentOpen()) {
			var projectItem = app.project.rootItem.children[0];

			if (projectItem != null) {
				if (ExternalObject.AdobeXMPScript == undefined) {
					ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
				}

				if (ExternalObject.AdobeXMPScript != undefined) {	// safety-conscious!
					var projectMetadata = projectItem.getProjectMetadata();

					var xmp = new XMPMeta(projectMetadata);
					var obj = xmp.dumpObject();

					// var aliases = xmp.dumpAliases();

					var namespaces = XMPMeta.dumpNamespaces();

					 // if these contain data, they're all found, in 7.2.3 and 8.0.1 (not 8.0.0)

					var found_name      = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, namefield);
					var found_tapename  = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, tapename);
					var found_desc      = xmp.doesPropertyExist(kPProPrivateProjectMetadataURI, desc);

					xmp.setProperty(kPProPrivateProjectMetadataURI, tapename, 	"***TAPENAME***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, desc, 		"***DESCRIPTION***");
					xmp.setProperty(kPProPrivateProjectMetadataURI, namefield, 	"***NEWNAME***");

					var str = xmp.serialize();

					var array = new Array();
					array[0] = tapename;
					array[1] = desc;
					array[2] = namefield;

					projectItem.setProjectMetadata(str, array);
				}
			}
		}
	},

	updatePAR : function() {
		alert('in updatePAR');
		var item = app.project.rootItem.children[0]; 
		if (item != null){

		/* 	

			0 = Use the value from the actual clip

			1 = kPixelAspectRatio_Square
			2 = kPixelAspectRatio_DVNTSC
			3 = kPixelAspectRatio_DVNTSCWide
			4 = dvamediatypes::kPixelAspectRatio_DVPAL
			5 = kPixelAspectRatio_DVPALWide
			6 = kPixelAspectRatio_Anamorphic
			7 = kPixelAspectRatio_HDAnamorphic1080
			8 = kPixelAspectRatio_DVCProHD	

		*/
			item.setOverridePixelAspectRatio(6);
		}
	},

	getnumAEProjectItems : function() {
		var bt = new BridgeTalk;
		bt.target = 'aftereffects';
		bt.body =	'alert(app.project.rootFolder.numItems);'
		bt.send();
	},
};
