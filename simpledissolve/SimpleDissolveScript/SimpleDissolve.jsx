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

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>Simple Dissolve Extension...</name>
<menu>filter</menu>
<eventid>6F17BFA7-EFC8-11EA-B850-7B95ED8EA713</eventid>
<enableinfo> in (PSHOP_ImageMode, RGBMode, CMYKMode, HSLMode, HSBMode, LabMode, RGB48Mode)  &amp;&amp; (PSHOP_IsTargetVisible  &amp;&amp;  ! PSHOP_IsTargetSection)</enableinfo>
<category>filter</category>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/



#target photoshop

/*********************************/

var gExitLoop = false

try {
	var xLib = new ExternalObject("lib:\PlugPlugExternalObject");
	displayExtensionDlg()
} catch(e) {
	alert(e.line + " - " + e);
}

/*********************************/

function displayExtensionDlg() {
	if (app.documents.length == 0) {
		return;
	}
	var selectedLayers = getSelectedLayers()
	if (selectedLayers.length == 0) {
		alert("No layers selected.");
		return;
	} else if (selectedLayers.length > 1) {
		alert("Too many layers selected.");
		return;
	}
	var activeLayer = activeDocument.activeLayer
	var previewInfoObj = createPreviews(activeDocument,hasLayerMaskSelected())
	if (previewInfoObj.url == "") {
		return;
	}
	// save preview info in special place where UI can read it later
	$.setenv('com.adobe.SimpleDissolve.preview',previewInfoObj.toSource());
	activeDocument.activeLayer = activeLayer;
	loadDialog();
}

/*********************************/

function loadDialog() {
		var eventObj = new CSXSEvent();
		eventObj.type = "com.adobe.event.loadSimpleDissolve";
		eventObj.message = ""
		eventObj.dispatch()
}

/*********************************/

function createPreviews(in_doc,in_isLayerMaskSelected) {
	
		blockRefresh();
		var hasSelection = false;
		var rulerUnits = app.preferences.rulerUnits;
		if (app.preferences.rulerUnits != Units.PIXELS) {
			app.preferences.rulerUnits = Units.PIXELS;
		}
		var retVal = 
		{
			url: "", resolution:in_doc.resolution, width:in_doc.width.value, height:in_doc.height.value,
			selection: {url: "", resolution:0, rect:{x:0, y:0, width:0, height:0}}
		}
		var totalSteps = 10; // for progress bar

		// doProgress() uses heuristics that keep it from showing unnecessarily (for example, during very short tasks). 
		// in this case most of time will consume saveToPNG on the end so we use doForcedProgress to disable heuristics
		// Other progress APIs must be called periodically to update the progress bar and allow canceling.
		// app.doProgress returns nothing so we use variable in parent scope
		app.doForcedProgress("Preparing Preview...",'subTask()');
		function subTask(){
			try {
				if(!app.updateProgress(1,totalSteps)){return false;}
				var visibleLayers = hideLayers(in_doc)
				var selectBounds = in_doc.selection.bounds
				retVal.selection.rect.x = selectBounds[0].value
				retVal.selection.rect.y = selectBounds[1].value
				if(!app.updateProgress(2,totalSteps)){return false;}
				in_doc.selection.makeWorkPath(0.5);
				copy()
				if(!app.updateProgress(3,totalSteps)){return false;}
				var selectionDoc = app.documents.add(
							selectBounds[2] - selectBounds[0], 
							selectBounds[3] - selectBounds[1],
							in_doc.resolution,
							"selection",
							NewDocumentMode.RGB, 
							DocumentFill.WHITE );
				retVal.selection.resolution = selectionDoc.resolution;
				retVal.selection.rect.width = selectionDoc.width.value;
				retVal.selection.rect.height = selectionDoc.height.value;
				if(!app.updateProgress(4,totalSteps)){return false;}
				if (selectionDoc.artLayers[0].isBackgroundLayer) {
						selectionDoc.artLayers[0].isBackgroundLayer = false;
				}
				paste()
				var selectionFile = File(Folder.temp+"/selection.png");
				saveToPNG(selectionDoc, selectionFile);
				if (selectionFile.exists) {
					retVal.selection.url = getURL(selectionFile);
				}
				// yes we skipped some steps because export image takes longer
				if(!app.updateProgress(6,totalSteps)){return false;}
				selectionDoc.close(SaveOptions.DONOTSAVECHANGES);
				var pathItems = in_doc.pathItems["Work Path"];
				if(!app.updateProgress(7,totalSteps)){return false;}
				if (! in_isLayerMaskSelected) {
					pathItems.makeSelection();
					pathItems.remove();
				}
				hasSelection = true
			}
			catch(e) {
				if(!app.updateProgress(7,totalSteps)){return false;}	
			}
			var previewFile = File(Folder.temp+"/preview.png");
			if (in_isLayerMaskSelected) {
				saveLayerMaskToPNG(in_doc,previewFile)
				if (hasSelection) {
					pathItems.makeSelection();
					pathItems.remove();
				}
				retVal.isMask = 1
			} else {
				saveToPNG(in_doc, previewFile);
				retVal.isMask = 0;
			}
			if (previewFile.exists) {
					retVal.url =  getURL(previewFile)
			}
			if(!app.updateProgress(8,totalSteps)){return false;}
			reinstateLayersVisibility(in_doc,visibleLayers)
		}
	if (app.preferences.rulerUnits != rulerUnits) {
		app.preferences.rulerUnits = rulerUnits
	}
	return retVal
}

/*********************************/

function getURL(in_file) {
	if ($.os.match(/^mac/gi) != null) {
		var retVal = "file://" + in_file.absoluteURI;
	} else {
		var retVal = "file:///" + in_file.fsName.replace(/\\/g,"/");
	}
	return retVal
}

/*********************************/

function paste() {
	var idpast = charIDToTypeID( "past" );
	executeAction( idpast, undefined, DialogModes.NO );
}

/*********************************/

function copy() {
	var idcopy = charIDToTypeID( "copy" );
	executeAction( idcopy, undefined, DialogModes.NO );
}
/*********************************/

function saveLayerMaskToPNG(in_doc,in_pngFile){
		showMaskChannel(true)
		var hiddenChannels = getHiddenChannels(in_doc)
		hideAllChannels(in_doc);
		maskChannelToDocument();
		saveToPNG(activeDocument,in_pngFile);
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
		reinstateHiddenChannels(hiddenChannels);
		showMaskChannel(false);
}

/*********************************/

function maskChannelToDocument() {
	// Copies the Layer Mask channel into a new document
	var idMk = charIDToTypeID( "Mk  " );
			var desc74 = new ActionDescriptor();
			var idNw = charIDToTypeID( "Nw  " );
					var desc75 = new ActionDescriptor();
					var idNm = charIDToTypeID( "Nm  " );
					desc75.putString( idNm, "preview" );
			var idDcmn = charIDToTypeID( "Dcmn" );
			desc74.putObject( idNw, idDcmn, desc75 );
			var idUsng = charIDToTypeID( "Usng" );
					var ref67 = new ActionReference();
					var idChnl = charIDToTypeID( "Chnl" );
					var idOrdn = charIDToTypeID( "Ordn" );
					var idTrgt = charIDToTypeID( "Trgt" );
					ref67.putEnumerated( idChnl, idOrdn, idTrgt );
			desc74.putReference( idUsng, ref67 );
	executeAction( idMk, desc74, DialogModes.NO );
	// Converts the document to Grayscale
	var idCnvM = charIDToTypeID( "CnvM" );
			var desc76 = new ActionDescriptor();
			var idT = charIDToTypeID( "T   " );
			var idGrys = charIDToTypeID( "Grys" );
			desc76.putClass( idT, idGrys );
	executeAction( idCnvM, desc76, DialogModes.NO );
}

/*********************************/

function hideAllChannels(in_doc) {
	for (var idx = 0; idx < in_doc.channels.length; idx++) {
		in_doc.channels[idx].visible = false
	}
}

/*********************************/

function getHiddenChannels(in_doc) {
	retVal = []
	for (var idx = 0; idx < in_doc.channels.length; idx++) {
		var channel = in_doc.channels[idx];
		if (! channel.visible) {
			retVal.push(channel);
		}
	}
	return retVal
}

/*********************************/

function reinstateHiddenChannels(in_channels) {
	if (in_channels) {
		for (var idx = 0; idx < in_channels.length; idx++) {
			in_channels[idx].visible = false;
		}
	}
}

/*********************************/

function showMaskChannel(in_show) {
	var idShw = charIDToTypeID( (in_show ? "Shw " : "Hd  "));
    var desc90 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var list12 = new ActionList();
            var ref82 = new ActionReference();
            var idChnl = charIDToTypeID( "Chnl" );
            var idChnl = charIDToTypeID( "Chnl" );
            var idMsk = charIDToTypeID( "Msk " );
            ref82.putEnumerated( idChnl, idChnl, idMsk );
        list12.putReference( ref82 );
    desc90.putList( idnull, list12 );
executeAction( idShw, desc90, DialogModes.NO );
}

/*********************************/

function saveToPNG(in_doc,in_pngFile){
	if (in_pngFile.exists) {
			in_pngFile.remove()
	}
	// SaveForWeb fails consistently on Windows.
	pngSaveOptions = new PNGSaveOptions()
	in_doc.saveAs(in_pngFile,pngSaveOptions,true,Extension.LOWERCASE);
}

/*********************************/

function hideLayers(in_doc) {
	var retVal = [];
	for (var idx = 0; idx < in_doc.artLayers.length; idx++) {
		var artLayer = in_doc.artLayers[idx]
		if (in_doc.activeLayer != artLayer && artLayer.visible) {
			artLayer.visible = false;
			retVal.push(artLayer);
		}
	}
	return retVal;
}

/*********************************/

function reinstateLayersVisibility(in_doc,in_layers) {
	if (in_layers) {
		for (var idx = 0; idx < in_layers.length; idx++) {
			try {
				var artLayer = in_layers[idx];
				artLayer.visible = true
			} catch(e) {}
		}
	}
}

/*********************************/

function getSelectedLayers() {
	var retVal = [];
	try {
		var backGroundCounter = activeDocument.layers[activeDocument.layers.length-1].isBackgroundLayer ? 1 : 0;
		var ref = new ActionReference();
		var keyTargetLayers = app.stringIDToTypeID( 'targetLayers' );
		ref.putProperty( app.charIDToTypeID( 'Prpr' ), keyTargetLayers );
		ref.putEnumerated( app.charIDToTypeID( 'Dcmn' ), app.charIDToTypeID( 'Ordn' ), app.charIDToTypeID( 'Trgt' ) );
		var desc = executeActionGet( ref );
		if ( desc.hasKey( keyTargetLayers ) ) {
			var layersList = desc.getList( keyTargetLayers );
			for ( var i = 0; i < layersList.count; i++) {
				var listRef = layersList.getReference( i );
				retVal.push( listRef.getIndex() + backGroundCounter );
			}
		}
	} catch(e) {
		
	}
	return retVal;
}

/*********************************/

function hasLayerMaskSelected() {
	var retVal = false;
	try {
		var ref = new ActionReference();
		var keyUserMaskEnabled = app.charIDToTypeID( 'UsrM' );
		ref.putProperty( app.charIDToTypeID( 'Prpr' ), keyUserMaskEnabled );
		ref.putEnumerated( app.charIDToTypeID( 'Lyr ' ), app.charIDToTypeID( 'Ordn' ), app.charIDToTypeID( 'Trgt' ) );
		var desc = executeActionGet( ref );
		retVal = desc.hasKey( keyUserMaskEnabled );
	}catch(e) {
		retVal = false;
	}
	if (retVal) {
		try {
			retVal = ! (activeDocument.activeChannels.length > 0)
		}
		catch(e) {
			retVal = true
		}
	}
	return retVal;
}

/*********************************/

function blockRefresh(){
	var idsetd = charIDToTypeID( "setd" );
	var desc = new ActionDescriptor();
	var idnull = charIDToTypeID( "null" );
	var ref = new ActionReference();
	var idPrpr = charIDToTypeID( "Prpr" );
	var idPbkO = charIDToTypeID( "PbkO" );
	ref.putProperty( idPrpr, idPbkO );
	var idcapp = charIDToTypeID( "capp" );
	var idOrdn = charIDToTypeID( "Ordn" );
	var idTrgt = charIDToTypeID( "Trgt" );
	ref.putEnumerated( idcapp, idOrdn, idTrgt );
	desc.putReference( idnull, ref );
	var idT = charIDToTypeID( "T   " );
	var desc2 = new ActionDescriptor();
	var idperformance = stringIDToTypeID( "performance" );
	var idaccelerated = stringIDToTypeID( "accelerated" );
	desc2.putEnumerated( idperformance, idperformance, idaccelerated );
	var idPbkO = charIDToTypeID( "PbkO" );
	desc.putObject( idT, idPbkO, desc2 );
	executeAction( idsetd, desc, DialogModes.NO );
}