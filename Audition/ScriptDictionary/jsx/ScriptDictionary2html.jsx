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


//@include "./utils.jsx"
//@include "./ScriptDictionary.jsx"

function ScriptDictionary2html()
{
    this.html = '';
    this.errors = '';
    
    this.convert2Html = function(includeTOC)
    {
        var dict = new ScriptDictionary();
        var classDefs = dict.getDictionary();
        
        processClassInfo(classDefs, includeTOC);
        
        return html;
    }

	// private ----------------------------------------------------------------
	    
    var html = '';
    var currentClasses = null;
    var dbg = false;
    
    function processClassInfo(classes, includeTOC)
    {
        if (classes != null)
        {
            currentClasses = classes
            
            if (includeTOC)
            {
                writeTOC(classes);
            }
        
            writeClasses(classes);
            
            currentClasses = null;
        }
    }

    function writeTOC(classes)
    {
        writeElement("h2", "Overview");
        classes.sort(compareByName);

        startElement("ul");
        
        for (var i=0; i<classes.length; i++)
        {
            startElement("li")
            writeElement("a", classes[i].name, [{name : "href", value : "#" + classes[i].name}]);
            endElement("li");
        }
    
        endElement("ul");
    }

    function writeClasses(classes)
    {
        writeElement("h2", "Classes");
        write2Output('\n');
        classes.sort(compareByName);
        for (var i=0; i<classes.length; i++)
        {
            writeClass(classes[i]);
        }
    
        write2Output('\n');
    }

    function writeClass(inClassdef)
    {
        writeElement("h3", inClassdef.name, [{name : "id", value : inClassdef.name}]);
        
        if (inClassdef.shortDescription.length)
        {
            writeElement("p", inClassdef.shortDescription);
        }
        if (inClassdef.description.length)
        {
            writeElement("p", inClassdef.description);
        }
        writeElement("p", "");    

        // Constructor
        //
        if (inClassdef.ctor)
        {
            writeElement("h4", "Constructor");
            writeMethod(inClassdef.ctor);
            writeElement("p", "");
        }

        // Class Properties
        //
        if (inClassdef.classProperties.length)
        {
            writeElement("h4", "Class Properties");
            
            for (var i=0; i<inClassdef.classProperties.length; i++)
            {
                writeProperty(inClassdef.classProperties[i]);
                writeElement("p", "");
            }
        }

        // Class Methods
        //
        if (inClassdef.classMethods.length)
        {
            writeElement("h4", "Class Methods");
            
            for (var i=0; i<inClassdef.classMethods.length; i++)
            {
                writeMethod(inClassdef.classMethods[i]);
                writeElement("p", "");
            }
        }

        // Instance Properties
        //
        if (inClassdef.instanceProperties.length)
        {
            writeElement("h4", "Instance Properties");
            
            for (var i=0; i<inClassdef.instanceProperties.length; i++)
            {
                writeProperty(inClassdef.instanceProperties[i]);
                writeElement("p", "");
            }
        }

        // Instance Methods
        //
        if (inClassdef.instanceMethods.length)
        {
            writeElement("h4", "Instance Methods");
            
            for (var i=0; i<inClassdef.instanceMethods.length; i++)
            {
                writeMethod(inClassdef.instanceMethods[i]);
                writeElement("p", "");
            }
        }
    }

    function writeProperty(inPropertydef)
    {
        var name = inPropertydef.name;
        name += (inPropertydef.readonly) ? " (read only)" : " (read/write)";
        
        writeElement("code", name + "  ["+ createDatatypeString(inPropertydef.datatype) + "]");
        
        if (inPropertydef.shortDescription.length)
        {
            writeElement("p", inPropertydef.shortDescription); 
        }
        
        if (inPropertydef.description.length)
        {
            writeElement("p", inPropertydef.description); 
        }
    }

    function writeMethod(inMethodef)
    {
        write2Output('<code>');
        write2Output('[' + createDatatypeString(inMethodef.datatype) + ']');
        write2Output(' ');
        write2Output(inMethodef.name);

        write2Output('(');
        
        if (inMethodef.parameters.length)
        {
            for (var i=0; i<inMethodef.parameters.length; i++)
            {
                writeParam(inMethodef.parameters[i]);
                
                if (i < (inMethodef.parameters.length - 1))
                {
                    write2Output(", ");
                }
            }
        }
    
        write2Output(')');
        write2Output('</code>'); 
        
        if (inMethodef.shortDescription.length)
        {
            writeElement('p', inMethodef.shortDescription); 
        }
        
        if (inMethodef.description.length)
        {
            writeElement('p', inMethodef.description); 
        }
    }

    function writeParam(inParamdef)
    {
        write2Output(inParamdef.name + " [" + createDatatypeString(inParamdef.datatype) + "]");
    }

    function createDatatypeString(inDatatype)
    {
        var datatypeStr = inDatatype;
        
        if (currentClasses)
        {
            for (var i=0; i<currentClasses.length; i++)
            {
                if (currentClasses[i].name == inDatatype)
                {
                    datatypeStr = createElement("a", currentClasses[i].name, [{name : "href", value : "#" + currentClasses[i].name}]);
                    break;
                }
            }
        }
    
        return datatypeStr;
    }

    function startElement(elementName, attributes)
    {
        var out = "<" + elementName;
        
        if (__isValid__(attributes) && attributes.length)
        {
            for (var i=0; i<attributes.length; i++)
            {
                out += " ";
                out += attributes[i].name;
                out += "=\"";
                out += attributes[i].value;
                out += "\""
            }
        }
    
        out += ">";
        
        write2Output(out);
    }

    function endElement(elementName)
    {
        var out = "</" + elementName + ">\n";        
        write2Output(out);
    }

    function createElement(elementName, elementContent, attributes)
    {
        var out = "<" + elementName;
        
        if (__isValid__(attributes) && attributes.length)
        {
            for (var i=0; i<attributes.length; i++)
            {
                out += " ";
                out += attributes[i].name;
                out += "=\"";
                out += attributes[i].value;
                out += "\""
            }
        }
    
        out += ">";
        
        if (__isValid__(elementContent))
        {
            out += elementContent;
        }
    
        out += "</" + elementName + ">\n";
        
        return out;
    }

    function writeElement(elementName, elementContent, attributes)
    {
        write2Output(createElement(elementName, elementContent, attributes));
    }

    function write2Output(txt)
    {
        if (dbg)
        {
            $.write(txt);
        }
        else
        {
            html += txt;
        }
    }

    function compareByName(inObj1, inObj2)
    {
        if (!__isValid__(inObj1))   return 1;
        if (!__isValid__(inObj2))   return -1;
        if (!__isValid__(inObj1.name))   return 1;
        if (!__isValid__(inObj2.name))   return -1;
        if (inObj1.name > inObj2.name) return 1;
        else if (inObj1.name < inObj2.name) return -1;
        else return 0;
    }
}
