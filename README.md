Sample extensions
=======

These samples demonstrate techniques for building an extension with an HTML5 UI and behavior implemented in JavaScript. 

The samples are kept up to date with the latest CC2018 host applications. Make sue to check the `manifest.xml` file for each sample's compatible host applications. To run the extensions you must have the compatible host application installed. Requirements for each sample are listed below.
 
Each version of CEP comes with its own samples in the [CEP-Resources repository](https://github.com/Adobe-CEP/CEP-Resources). Under each version name, `CEP_N.x`, you will find the version specific samples, which cover broad use cases and topics of CEP. 

Unlike the samples in the [CEP-Resources repository](https://github.com/Adobe-CEP/CEP-Resources), samples in this repository cover specific use cases covering a wide variety of topics. Check out the next section to choose a sample that suits your need.

## Before running the samples
1. The provided samples are unsigned. This will cause the signature check (built into CEP when first running an extension) to fail. To bypass the signature check, please refer to [the documentation](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#debugging-unsigned-extensions).
1. Although these extensions are initially setup for a particular version of CEP, you can adjust the product version targeted by modifying the range inside the `HostList` element of the `CSXS/manifest.xml` file.
1. Some folders have a nested folder strucutre. For those samples, you will need to extract sub-directories into [the extension folder](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#extension-folders). 

## Samples list

| Extension | Description | Supported Products |
| --- | ------ | --- |
| [AfterEffectsPanel](https://github.com/Adobe-CEP/Samples/tree/master/AfterEffectsPanel) | Demonstrates how to invoke After Effects ExtendScript, from within a CEP panel. | After Effects|
| [Anywhere Example Panel](https://github.com/Adobe-CEP/Samples/tree/master/AnywhereExamplePanel) | Demonstrates a Premiere Pro panel integration with Adobe Anywhere (through DOM and http). | Premiere Pro, Prelude |
| [Audition](https://github.com/Adobe-CEP/Samples/tree/master/Audition) | There are 4 Audition CC extensions in this repo (ApplicationCommands, PlayheadPanel, ScriptDictionary, TransportEvents) | Audition |
| [Bridge - HelloBridge](https://github.com/Adobe-CEP/Samples/tree/master/Bridge/HelloBridge) | A Hello World extension for Adobe Bridge. | Bridge |
| [Bridge - ShowFolder](https://github.com/Adobe-CEP/Samples/tree/master/Bridge/ShowFolder) | Demonstrates use of CEP APIs and ExtendScript in Adobe Bridge | Bridge |
| [CEP HTML Invisible Extension](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_9.x/Samples/CEP_HTML_Invisible_Extension-9.0) | An example of an invisible extension. More information about invisible extensions can be found in the cookbooks https://github.com/Adobe-CEP/CEP-Resources/wiki/CEP-5-HTML-Extension-Cookbook-for-CC-2014#invisible | Dreamweaver, Animate, InDesign, InCopy, Illustrator, Photoshop, Premier Pro, Prelude, After Effects |
| [CEP HTML Test Extension](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_9.x/Samples/CEP_HTML_Test_Extension-9.0) | Showcases most features and capabilities of CEP 6, including events, video, database interaction via Node, native APIs, ExternalObject, HTML FlyOut menus and lots of other good stuff! | Dreamweaver, Animate, InDesign, InCopy, Illustrator, Photoshop, Premier Pro, Prelude, After Effects |
| [CueSheeter](https://github.com/Adobe-CEP/Samples/tree/master/CueSheeter) | Demonstrates extracting usage data from sequences; useful for documenting usage and clearance rights. | Premier Pro |
| [Flickr](https://github.com/Adobe-CEP/Samples/tree/master/Flickr) | Demonstrates connecting and retrieving assets from a Cloud service (Flickr in this case). | Photoshop |
| [htmlStandAlone](https://github.com/Adobe-CEP/Samples/tree/master/htmlStandAlone) | Demonstrates Prelude's message-driven Javascript APIs. Inside the sample, there are multiple standalone html pages that include demos for different ExtendScript functionalities you can use in Prelude. | Prelude |
| [Photoshop Events](https://github.com/Adobe-CEP/Samples/tree/master/PhotoshopEvents) | Demonstrates listening to events in Photoshop. | Photoshop |
| [Premiere Pro Panel](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel) | Demonstrates a Premiere Pro panel. | Premiere Pro |
| [RSSReader](https://github.com/Adobe-CEP/Samples/tree/master/RSSReader) | Demonstrates using 3rd party NPM modules in a CEP 5 extension. | InDesign/InCopy, Illustrator, Photoshop |
| [SimpleDissolve](https://github.com/Adobe-CEP/Samples/tree/master/simpledissolve) | | Photoshop |
| [Redirect](https://github.com/Adobe-CEP/Samples/tree/master/Redirect) | Demonstrates loading an external website in an iFrame. | Photoshop, Illustrator, Premiere Pro |
| [TypeScript](https://github.com/Adobe-CEP/Samples/tree/master/TypeScript) | Demonstrates multiple sample codes thata demonstrate what's possible to build inside Premiere Pro. | Premiere Pro |
| [UI Samples](https://github.com/Adobe-CEP/Samples/tree/master/UISamples) | Demonstrates using common JavaScript UI frameworks in CEP extensions. | Photoshop, Illustrator, Premiere Pro |
| [WebGL with three.js (Contributed by Davide Deraedt)](https://github.com/Adobe-CEP/Samples/tree/master/webgl_threejs) | Demonstrates WebGL with `three.js` | Photoshop |
| [Websockets](https://github.com/Adobe-CEP/Samples/tree/master/Websocket) | Demonstrates using web sockets in an extension. | Photoshop, Illustrator, Premiere Pro |
| [XMP Sample Panel](https://github.com/Adobe-CEP/Samples/tree/master/XmpSamplePanel) | Demonstrates manipulating XMP metadata in CC2014 hosts. | Premiere Pro, InDesign, Photoshop, Illustrator |


