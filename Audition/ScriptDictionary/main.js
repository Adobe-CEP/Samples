/*************************************************************************
* 
* ADOBE INC.
*  Copyright 2016 Adobe Inc.
*  All Rights Reserved.
* 
* NOTICE:  Adobe permits you to use, modify, and distribute this file in 
* accordance with the terms of the Adobe license agreement accompanying it.  
* If you have received this file from a source other than Adobe, then your 
* use, modification, or distribution of it requires the prior written 
* permission of Adobe.
* 
**************************************************************************/

function onLoaded() 
{
    var csInterface = new CSInterface();
    
    var jsx = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/ScriptDictionaryCache.jsx";
    csInterface.evalScript('var f = new File("' + jsx + '"); $.evalFile(f);', function()
    {
		csInterface.evalScript('var d = new ScriptDictionaryCache(); d.getDictionaryHtml(true, false);', function(result)
		{
			document.getElementById('dictionary').innerHTML = result;
		});  
	});
}
