var csInterface = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();
}

function getSystemPrefPath()
{
	evalScript('$._ext_PPRO.getAppSystemPrefPath()', getSystemPrefPathCallback);
}

function getSystemPrefPathCallback(args)
{
	if (args) {		
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [getAppSystemPrefPath()] ***\n" + args + "\n\n");
		var o = document.getElementById("result");
		o.value = args;
	} else {
		$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [getAppSystemPrefPath()] ***\n" + "ERROR!!! \n\n");
	}
}

function clearTextArea()
{
	$('#apimessage').val("");
}
