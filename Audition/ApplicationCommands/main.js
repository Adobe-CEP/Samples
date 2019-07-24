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

var commands = {};
var descriptions = {};
var currentSelection = '';

///////////////////////////////////////////////////////////////////////////////
//
// Fill the popup with application command strings and store the actual
// commands in the global variable 'commands'
//
function fillList()
{
	initAppearance();
	
	//
	// retrieve application commands
	//
	var csInterface = new CSInterface();
	csInterface.evalScript('getCommandStr();', function(result)
	{
		try
		{
			//
			// The return value is a JSON string in the form
			//	
			//  [
			//  	{property : commandValue, value : commandID, label : commandLabel, help : commandDescription}
			//  	{property : commandValue, value : commandID, label : commandLabel, help : commandDescription}
			//  	{property : commandValue, value : commandID, label : commandLabel, help : commandDescription}
			//		:
			//		:
			//		:
			//  ]
			var cmds = eval(result);	
			var entries = '';
			
			for (var e=0; e<cmds.length; ++e)
			{
				entries += '<option value="' + cmds[e].value + '">' + cmds[e].label + '</option>';
				commands[cmds[e].value] = cmds[e].property;
				descriptions[cmds[e].value] = cmds[e].help;
			}
			
			document.getElementById('popup').innerHTML = entries;
			document.getElementById("popup").selectedIndex = "0";
			onSelected(document.getElementById("popup"));
		}
		catch(e)
		{
		}
	});  
}

///////////////////////////////////////////////////////////////////////////////
//
// Popup control selection handler
// Called whenever a new entry was selected from the popup control
//
function onSelected(obj)
{
	document.getElementById('propname').innerHTML = 'Application.' + commands[obj.value];
	document.getElementById('help').innerHTML = descriptions[obj.value];
	currentSelection = obj.value;
	isCurrentEnabled();
}

///////////////////////////////////////////////////////////////////////////////
//
// Invoke the currently selected command
//
function invokeCurrent()
{
	if (currentSelection != '')
	{
		var cmd = "app.invokeCommand('" + currentSelection + "');";
		var csInterface = new CSInterface();
		csInterface.evalScript(cmd);
	}
}

///////////////////////////////////////////////////////////////////////////////
//
// Check whether the currently selected command is enabled or disabled
// and set the enabled state of the popup control accordantly
//
function isCurrentEnabled()
{
	if (currentSelection != '')
	{
		var cmd = "app.isCommandEnabled('" + currentSelection + "');";
		var csInterface = new CSInterface();
		csInterface.evalScript(cmd, function(result)
		{
			document.getElementById("button").disabled = (result != 'true');
			
			setTimeout(isCurrentEnabled, 3000);
		});
	}
}
