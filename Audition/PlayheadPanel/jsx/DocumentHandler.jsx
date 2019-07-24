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


///////////////////////////////////////////////////////////////////////////////
//
// Retrieve information of the current active document
//
function getDocumentInfo()
{
	var ret = { 
				document : false,		// document information are valid
				start : 0,				// start time
				end : 0,				// end time
				current : 0				// current playhead position
			  };

	// consider only WaveDocuments
	//			  
	if (app.activeDocument && app.activeDocument.reflect.name == 'WaveDocument')
	{
		ret.document = true;
		ret.start = 0;
		ret.end = (app.activeDocument.sampleRate == 0 ? 0 : (app.activeDocument.duration / app.activeDocument.sampleRate));
		ret.current = (app.activeDocument.sampleRate == 0 ? 0 : (app.activeDocument.playheadPosition / app.activeDocument.sampleRate));
	}
	
	return ret.toSource();
}

///////////////////////////////////////////////////////////////////////////////
//
// Set playhead position
//
function setCTI(percent)
{
	if (app.activeDocument && app.activeDocument.reflect.name === 'WaveDocument')
	{
		app.activeDocument.playheadPosition = app.activeDocument.duration * percent;
	}
}
