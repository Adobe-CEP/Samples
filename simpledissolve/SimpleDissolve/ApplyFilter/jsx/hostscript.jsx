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

//------------------------------------------------------------------------------
// Globals
//------------------------------------------------------------------------------
var gProgressBar = null;
var gLib = null;
//
var gApplySuccessful = false


//------------------------------------------------------------------------------
// Initialize PlugPLugExternal lib
// Allows us to dispatch CEP Events
//------------------------------------------------------------------------------

try {
	var xLib = new ExternalObject("lib:\PlugPlugExternalObject")
} catch (e) {
	alert(e);
}
blockRefresh();

//------------------------------------------------------------------------------
// applyDissolve - Don't leave trace of the operations executed by
// applyDissolveFilter()
//------------------------------------------------------------------------------

function applyDissolve(in_isLayerMask) {
	activeDocument.suspendHistory("Simple Dissolve", "applyDissolveFilter(" + in_isLayerMask + ")");
	return gApplySuccessful;
}

//------------------------------------------------------------------------------
// Get the dissolve.png and apply it to layer or selection
//------------------------------------------------------------------------------

function applyDissolveFilter(in_isLayerMask) {
	var totalSteps = 10; // for progress bar
	app.doForcedProgress('Applying Simple Dissolve...', 'subTask()');

	function subTask() {
		try {
			gApplySuccessful = false
			if (!app.updateProgress(2, totalSteps)) {
				return false;
			}
			var doc = app.activeDocument;
			var hiddenChannels = getHiddenChannels(doc);
			var dissolveFile = File(Folder.temp + "/dissolve.png");
			if (!dissolveFile.exists) {
				alert("Cannot find file: " + dissolveFile.fsName);
				return;
			}
			var dissolveDoc = app.open(dissolveFile);
			if (!app.updateProgress(4, totalSteps)) {
				return false;
			}
			dissolveDoc.selection.selectAll();
			dissolveDoc.selection.copy(true);
			if (!app.updateProgress(5, totalSteps)) {
				return false;
			}
			dissolveDoc.close(SaveOptions.DONOTSAVECHANGES);
			app.activeDocument = doc;
			if (!app.updateProgress(6, totalSteps)) {
				return false;
			}
			var hasSelection = false;
			if (in_isLayerMask) {
				showMaskChannel(true);
				hideLayers(doc);
			}
			try {
				makeWorkPath();
				var pathItems = doc.pathItems["Work Path"];
				pathItems.makeSelection();
				if (doc.activeLayer.allLocked) {
					doc.activeLayer.allLocked = false;
				}
				doc.paste(true);
				hasSelection = true;
			} catch (e) {
				doc.paste();
			}
			if (!app.updateProgress(8, totalSteps)) {
				return false;
			}
			// Merge down layer
			var idMrgtwo = charIDToTypeID("Mrg2");
			var desc163 = new ActionDescriptor();
			executeAction(idMrgtwo, desc163, DialogModes.NO);
			if (!app.updateProgress(9, totalSteps)) {
				return false;
			}
			if (hasSelection) {
				pathItems.makeSelection();
			}
			gApplySuccessful = true;


			if (in_isLayerMask) {
				showMaskChannel(false);
			}
			reinstateHiddenChannels(hiddenChannels);

		} catch (e) {
			alert("Line: " + e.line + " - " + e);
		}
	}
}

//------------------------------------------------------------------------------
// makeWorkPath - selection.makeWorkPath() does not seem to have the same effect.
//------------------------------------------------------------------------------

function makeWorkPath() {
	var idMk = charIDToTypeID("Mk  ");
	var desc92 = new ActionDescriptor();
	var idnull = charIDToTypeID("null");
	var ref34 = new ActionReference();
	var idPath = charIDToTypeID("Path");
	ref34.putClass(idPath);
	desc92.putReference(idnull, ref34);
	var idFrom = charIDToTypeID("From");
	var ref35 = new ActionReference();
	var idcsel = charIDToTypeID("csel");
	var idfsel = charIDToTypeID("fsel");
	ref35.putProperty(idcsel, idfsel);
	desc92.putReference(idFrom, ref35);
	var idTlrn = charIDToTypeID("Tlrn");
	var idPxl = charIDToTypeID("#Pxl");
	desc92.putUnitDouble(idTlrn, idPxl, 2);
	executeAction(idMk, desc92, DialogModes.NO);
}

//------------------------------------------------------------------------------
// getHiddenChannels - get the hidden channels into an array so they can be
// reinstate.
//------------------------------------------------------------------------------

function getHiddenChannels(in_doc) {
	retVal = []
	for (var idx = 0; idx < in_doc.channels.length; idx++) {
		var channel = in_doc.channels[idx];
		if (!channel.visible) {
			retVal.push(channel);
		}
	}
	return retVal
}


//------------------------------------------------------------------------------
// reinstateHiddenChannels - get the hidden channels into an array so they can be
// reinstate.
//------------------------------------------------------------------------------

function reinstateHiddenChannels(in_channels) {
	if (in_channels) {
		for (var idx = 0; idx < in_channels.length; idx++) {
			in_channels[idx].visible = false;
		}
	}
}

//------------------------------------------------------------------------------
// hideLayers - If we are dealing with a layer mask we need hide the layers
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// showMaskChannel - Shows or hides the layer mask channel 
// in_show = true to show the layer mask channel (and false to hide)
//------------------------------------------------------------------------------

function showMaskChannel(in_show) {
	var idShw = charIDToTypeID((in_show ? "Shw " : "Hd  "));
	var desc90 = new ActionDescriptor();
	var idnull = charIDToTypeID("null");
	var list12 = new ActionList();
	var ref82 = new ActionReference();
	var idChnl = charIDToTypeID("Chnl");
	var idChnl = charIDToTypeID("Chnl");
	var idMsk = charIDToTypeID("Msk ");
	ref82.putEnumerated(idChnl, idChnl, idMsk);
	list12.putReference(ref82);
	desc90.putList(idnull, list12);
	executeAction(idShw, desc90, DialogModes.NO);
}

//------------------------------------------------------------------------------
// dispatchEvent - dispatches a CEP event
//------------------------------------------------------------------------------

function dispatchEvent(in_type, in_message) {
	var eventObj = new CSXSEvent();
	eventObj.type = in_type;
	eventObj.message = in_message;
	eventObj.dispatch();
}

//------------------------------------------------------------------------------
// storeDissolveImage - Creates the png with the dissolve that will be applied
// to the layer or selection
//------------------------------------------------------------------------------

function storeDissolveImage(in_contents) {
	var retVal = false
	var dissolveFile = File(Folder.temp + "/dissolve.png")
	if (dissolveFile.exists) {
		dissolveFile.remove();
	}
	dissolveFile.encoding = "BINARY";
	if (!dissolveFile.open('w')) {
		return retVal.toString();
	}
	dissolveFile.write(unescape(in_contents));
	dissolveFile.close();
	retVal = dissolveFile.exists;

	return retVal.toString();
}

//------------------------------------------------------------------------------
// blockRefresh - Main menu > Window > Actions > Flyout menu > Playback Options > Performance > Accelerated
// Because if someone set something else for his actions then it also applied for scripts
//------------------------------------------------------------------------------

function blockRefresh() {
	var idsetd = charIDToTypeID("setd");
	var desc = new ActionDescriptor();
	var idnull = charIDToTypeID("null");
	var ref = new ActionReference();
	var idPrpr = charIDToTypeID("Prpr");
	var idPbkO = charIDToTypeID("PbkO");
	ref.putProperty(idPrpr, idPbkO);
	var idcapp = charIDToTypeID("capp");
	var idOrdn = charIDToTypeID("Ordn");
	var idTrgt = charIDToTypeID("Trgt");
	ref.putEnumerated(idcapp, idOrdn, idTrgt);
	desc.putReference(idnull, ref);
	var idT = charIDToTypeID("T   ");
	var desc2 = new ActionDescriptor();
	var idperformance = stringIDToTypeID("performance");
	var idaccelerated = stringIDToTypeID("accelerated");
	desc2.putEnumerated(idperformance, idperformance, idaccelerated);
	var idPbkO = charIDToTypeID("PbkO");
	desc.putObject(idT, idPbkO, desc2);
	executeAction(idsetd, desc, DialogModes.NO);
}