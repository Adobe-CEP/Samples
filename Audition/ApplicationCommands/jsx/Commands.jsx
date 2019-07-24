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
// Retrieve all application commands from the system
// All available applications command are provided as static properties at the
// application object. The name of all application command properties do have the
// format: COMMAND_category_feature
//
function getCommands()
{
    var commands = [];
    var propRef = Application.reflect.properties;

	// for each static property of the application object which
	// has a name starting with 'COMMAND_'
	//
    for (var p=0; p<propRef.length; ++p)
    {
        var propName = propRef[p].name;
        
        if (propName.indexOf('COMMAND_') == 0)
        {
        	// property value
            var txt = Application[propName];
            // help text of property
            var description = propRef[p].help;
            var out = '';

			// iterate over all characters of the property value
			// and create a label string out of it
			//
            for (var i=0; i<txt.length; ++i)
            {
                var c = txt.charAt(i);
                
                // the dot is the separator between the category- and
                // the feature-string
                //
                if (c == '.')
                {
                    out += ':';
                }
                else
                {
                    var cc = c.charCodeAt(0);
                    
                    // just take alphanumeric characters
                    //
                    if ((cc>47 && cc<58) || (cc>64 && cc<91) || (cc>96 && cc<123))
                    {
                        if (i == 0)
                        {
                            c = c.toUpperCase();
                        }
                        else if (c == c.toUpperCase())
                        {
                            out += ' ';
                        }
                    
                        out += c;
                    }
                }
            }

			// store property name & value, label and description in a vanilla object
			// and add to an array
			//
            commands.push({property : propName, value : txt, label : out, help : description});
        }
    }

	// return the array of all command objects
    return commands;
}

function getCommandStr()
{
    var cmds = getCommands();
    
    // return the command array as a JSON string
    return cmds.toSource();
}
