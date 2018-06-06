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
