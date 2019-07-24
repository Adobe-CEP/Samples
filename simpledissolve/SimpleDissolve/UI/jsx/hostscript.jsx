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
// readPreviewInfo 
// previewInfo contains an object with the
//		height
//		width
// 		url of the preview 
//		selection (if any).
//------------------------------------------------------------------------------

function readPreviewInfo ()
{
	var retVal = $.getenv('com.adobe.SimpleDissolve.preview');
	return retVal;
}

