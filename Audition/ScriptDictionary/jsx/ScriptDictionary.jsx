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


//@include "./ScriptDictionaryElements.jsx"

function ScriptDictionary()
{
    this.classDefs = [];
    this.errors = [];
    
    this.getDictionary = function()
    {
        this.classDefs = [];
        this.errors = [];

        try
        {
            var groups = $.dictionary.getGroups();
            var classes = $.dictionary.getClasses((groups[0].length ? groups[0] : ''));

            for (var c=0; c<classes.length; c++)
            {
                var classname = classes[c].split("\t");
                
                try
                {
                    var classDef = createClassDef(classname[0]);
                    this.classDefs.push(classDef);
                }
                catch(e)
                {
                    // this came unexpected, just skip the class and make a note
                    this.errors.push(e);
                }
            }
        }
        catch(e)
        {
            // this came unexpected, make a note
            this.errors.push(e);
        }
    
        return this.classDefs;
    }

	// private ----------------------------------------------------------------
	
    function createPropertyDef(propertyRef)
    {
        var propDef = new Property(propertyRef.name, propertyRef.type);
        
        if (propertyRef.dataType.length)
        {
            propDef.datatype = propertyRef.dataType;
        }

        if (propertyRef.description.length)
        {
            propDef.description = propertyRef.description;
        }
        else if (propertyRef.help.length)
        {
            propDef.shortDescription = propertyRef.help;
        }

        return propDef;
    }

    function createMethodDef(methodRef)
    {
        var methodDef = new Method(methodRef.name);
        
        if (methodRef.dataType.length)
        {
            methodDef.datatype = methodRef.dataType;
        }

        var help = methodRef.help;
        var desc = methodRef.description;
        
        if (methodRef.arguments && methodRef.arguments.length)
        {
            // there seems to be a bug in reflection interface
            help = methodRef.arguments[methodRef.arguments.length-1].help;
            desc = methodRef.arguments[methodRef.arguments.length-1].description;
        
            for (var a=0; a<methodRef.arguments.length; a++)
            {
                if (methodRef.arguments[a].name != ("arg" + (a+1)))
                {
                    var paramDef = new ParameterDef(methodRef.arguments[a].name);
                    paramDef.datatype = methodRef.arguments[a].dataType;
                    methodDef.addParameter(paramDef);
                }
            }
        }

        methodDef.description = desc;
        methodDef.shortDescription = help;

        return methodDef;
    }

    function createClassDef(className)
    {
        var classDef = new Classdef(className);
        
        var classRef = $.dictionary.getClass(className);
        if (classRef != null)
        {
            if (classRef.description.length)
            {
                classDef.description = classRef.description;
            }
            else if (classRef.help.length)
            {
                classDef.shortDescription = classRef.help;
            }

            if (classRef.staticProperties.length)
            {
                for (var p=0; p<classRef.staticProperties.length; p++)
                {
                    var propDef = createPropertyDef(classRef.staticProperties[p]);
                    classDef.addProperty('class', propDef);
                }
            }
        
            if (classRef.staticMethods.length)
            {
                for (var m=0; m<classRef.staticMethods.length; m++)
                {
                    var methodDef = createMethodDef(classRef.staticMethods[m]);
                    classDef.addMethod((classDef.name == methodDef.name ? 'constructor' : 'class'), methodDef);
                }
            }
        
            if (classRef.properties.length)
            {
                for (var p=0; p<classRef.properties.length; p++)
                {
                    var propDef = createPropertyDef(classRef.properties[p]);
                    classDef.addProperty('instance', propDef);
                }
            }
        
            if (classRef.methods.length)
            {
                for (var m=0; m<classRef.methods.length; m++)
                {
                    var methodDef = createMethodDef(classRef.methods[m]);
                    classDef.addMethod((classDef.name == methodDef.name ? 'constructor' : 'instance'), methodDef);
                }
            }
        }

        return classDef;
    }
}