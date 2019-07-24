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
// Script to generate projects of high complexity.
function GenerateCompName(location) {
    if(location instanceof Project) {
            return "CompGen " + app.project.items.length;
    }
    if(location instanceof CompItem) {
            return "LayerGen " +location.numLayers;        
     }
}
function NestInComp(comp, thing){
    return comp.layers.add(thing);
    
   // return comp;
}

function BoundedRandom( minValue, maxValue )
{
    return minValue + Math.round(((maxValue - minValue) * Math.random()));
}

function MakeLayer(junkFolder, ioComp, minLayers, maxLayers, minDepth, maxDepth)
{
    var layerType = BoundedRandom(0,1);
    var newLayer = null;
    if(maxDepth > minDepth) {
       if(layerType == 0) {
           var width = BoundedRandom(10, ioComp.width);
           var height = BoundedRandom(10, ioComp.height);
           var newLayer = ioComp.layers.addSolid([Math.random(), Math.random(), Math.random()], "Solid",  width, height, 1.0 );
        } else if( layerType == 1) {
            var newComp = MakeComp(junkFolder);
            newLayer = NestInComp(ioComp, newComp);
            var newMaxDepth = BoundedRandom(minDepth, maxDepth - 1);
            FillOutComp( junkFolder,  newComp, minLayers, maxLayers, minDepth, newMaxDepth)
        }
    
            newLayer.transform.position.expression = "transform.position.wiggle(" + BoundedRandom(1,7) +"," + BoundedRandom(2,200) + ", 1);";
            newLayer.transform.opacity.setValue(50);
            newLayer.transform.opacity.expression = "transform.opacity.wiggle(4, 50);";    
    }
}

function FillOutComp(junkFolder, ioComp, minLayers, maxLayers, minDepth, maxDepth)
{
    // a comp can have from min to maxLayer. Use random to choose how many
    var numLayersToGen = BoundedRandom(minLayers, maxLayers);
    for( var i = 0; i < numLayersToGen; i++) {
       MakeLayer(junkFolder, ioComp, minLayers, maxLayers, minDepth, maxDepth );
    }
    return ioComp;
}

function MakeComp(junkFolder)
{
   return junkFolder.items.addComp(GenerateCompName(app.project), 1000, 500, 1.0, 30, 30 );
}



function Generate()
{
    var junkFolder = app.project.items.addFolder("Junk " + app.project.items.length);
    var debugComp =  app.project.items.addComp("Debug Comp " + app.project.items.length, 1000, 500, 1.0, 30, 30 );
    FillOutComp(junkFolder, debugComp,  
                                                        1 ,  // minLayers
                                                        100, // maxLayers
                                                        3,   //minDepth
                                                        5); // maxDepth
                                                        
}


if ( ! $._ext )
{
  $._ext = {};
}

$._ext.generateComplexComp = function()
{
		alert("Creating dummy project, app version=" + app.version);
		Generate();
		alert("done");
};

$._ext.sendText = function()
{
    var currentComp = app.project.activeItem;

    if (currentComp){
        var layerCount = currentComp.numLayers;
        if (layerCount > 0){
            var allText = new Array();
            for (var i = 1; i <= layerCount; ++i){
                var currentLayer = currentComp.layers[i];
                if (currentLayer instanceof TextLayer){
                    allText[i-1] = currentLayer.text.sourceText.value;
                }
            }
            alert( allText);
        } else {
            alert("No text layers in " + currentComp.name + ".");
        }
    } else {
        alert("No active Comp.");
    }
}
