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
	if (app.activeDocument && app.activeDocument.reflect.name = 'WaveDocument')
	{
		app.activeDocument.playheadPosition = app.activeDocument.duration * percent;
	}
}
