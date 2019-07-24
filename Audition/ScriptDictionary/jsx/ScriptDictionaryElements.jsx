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


function Classdef(inName /*string*/)
{
    this.name = inName;             // string
    this.shortDescription = "";     // string
    this.description = "";          // string
    
    this.instanceMethods = [];      // Array of Method
    this.classMethods = [];         // Array of Method
    this.ctor = null;               // Method

    this.instanceProperties = [];   // Array of Property
    this.classProperties = [];      // Array of Property

    this.addMethod = function(inType /*string*/, inMethod /*Method*/)
    {
        switch (inType)
        {
            case 'instance':
                this.instanceMethods.push(inMethod);
                break;
            case 'class':
                this.classMethods.push(inMethod);
                break;
            case 'constructor':
                this.ctor = inMethod;
                break;
        }
    }

    this.addProperty = function(inType /*string*/, inProperty /*Property*/)
    {
        switch (inType)
        {
            case 'instance':
                this.instanceProperties.push(inProperty);
                break;
            case 'class':
                this.classProperties.push(inProperty);
                break;
        }
    }
}

function Property(inName /*string*/, inAccess /*string*/)
{
    this.name = inName;                         // string
    this.datatype = "";                         // string
    this.shortDescription = "";                 // string
    this.description = "";                      // string
    this.readonly = (inAccess == 'readonly');   // boolean
}

function Method(inName /*string*/)
{
    this.name = inName;                     // string
    this.shortDescription = "";             // string
    this.description = "";                  // string
    this.datatype = "";                     // string
    this.parameters = [];                   // Array of Parameter
    
    this.addParameter = function(inParameter /*Parameter*/)
    {
        this.parameters.push(inParameter);
    }
}

function ParameterDef(inName /*string*/)
{
    this.name = inName;     // string
    this.datatype = "";     // string
}
