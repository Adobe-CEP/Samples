Sample extensions
=======

These samples demonstrate techniques for building an extension with an HTML5 UI and behavior implemented in JavaScript. 

Many of the samples are still in development. Some of them use CEP 4 and the CC2013 version of the host app, others are for CEP 5 and CC2014 version of the host application and others are kept up to date with the latest release e.g. CC2015. You can check the manifest.xml file for each extension's compatibility requirements. To run the extensions you must have the host application installed. Requirements for each sample are listed below.


* Supported host apps for CEP 6 include the CC2015 versions of: Dreamweaver, Flash Pro, InDesign, Illustrator, InCopy, Photoshop, Premiere Pro, Prelude, and After Effects. 
* Supported host apps for CEP 5 include the CC2014 versions of: Dreamweaver, Flash Pro, InDesign, Illustrator, InCopy, Photoshop, Premiere Pro, Prelude, and After Effects. 
* Support for the Flash/ActionScript extension model is deprecated in all apps, and has been removed from Photoshop CC2014, Flash CC2015 and Dreamweaver CC2015.
 
From CEP 7.0, we post official CEP sample extensions under CEP-Resources, along with documentation, API, etc.
* [CEP 7.0 Sample Extensions](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_7.x/Samples)


##Before running the samples
The samples provided are unsigned so this will cause the the signature check (built into CEP when first running an extension) to fail. To bypass the signature check, please refer to the documentation:

* [CEP 7.0](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_7.x/CEP_7.0_HTML_Extension_Cookbook.pdf)
* [CEP 6.1](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_6.x/CEP_6.1_HTML_Extension_Cookbook.pdf)
* [CEP 6](https://github.com/Adobe-CEP/CEP-Resources/wiki/CEP-6-HTML-Extension-Cookbook-for-CC-2015#development_debugging)
* [CEP 5](https://github.com/Adobe-CEP/CEP-Resources/wiki/CEP-5-HTML-Extension-Cookbook-for-CC-2014#development_debugging) 
* [CEP 4](https://a248.e.akamai.net/f/1953/8974/2h/wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/devnet/cs-extension-builder/pdfs/CC_Extension_SDK.pdf) (Page 25) 

----
## Requirements

Remember that although these extensions are initially setup for a particular version of CEP, you can adjust the product version targeted by modifying the range inside the `HostList` element of the `CSXS/manifest.xml` file.

| Extension | Description | Compatibility |
| --- | ------ | --- |
| [SimpleDissolve](https://github.com/Adobe-CEP/Samples/tree/master/simpledissolve) | | CEP 5, Photoshop CC2014 |
| [WebGL with three.js (Contributed by Davide Deraedt)](https://github.com/Adobe-CEP/Samples/tree/master/webgl_threejs) | (description TBD) | CEP 5, Photoshop CC2014 |
| [RSSReader](https://github.com/Adobe-CEP/Samples/tree/master/RSSReader) | Demonstrates using 3rd party NPM modules in a CEP 5 extension. | CEP 5, CC2014 version of InDesign/InCopy, Illustrator, or Photoshop |
|[ExchangeExample](https://github.com/Adobe-CEP/Samples/tree/master/ExchangeExample) | Demonstrates using the new Exchange APIs in a CEP 6 extension. Please refer to the exchangeWorkflows.js file for an example on how to interact with the Exchange APIs. | CEP 6.0, CC2015 product version and Creative Cloud Desktop client installed. |
| [Collage](https://github.com/Adobe-CEP/Samples/tree/master/Collage) | Demonstrates the use of Node.js file I/O, CEP file I/O, Progress Meter, keeping UI responsive. | CEP 5, Photoshop CC2014 |
| [CEP HTML Test Extension](https://github.com/Adobe-CEP/Samples/tree/master/CEP_HTML_Test_Extension) | Showcases most features and capabilities of CEP 6, including events, video, database interaction via Node, native APIs, ExternalObject, HTML FlyOut menus and lots of other good stuff! | CEP 6.0, CC2015 host app |
| [CEP HTML Invisible Extension](https://github.com/Adobe-CEP/Samples/tree/master/CEP_HTML_Invisible_Extension) | An example of an invisible extension. More information about invisible extensions can be found in the cookbooks https://github.com/Adobe-CEP/CEP-Resources/wiki/CEP-5-HTML-Extension-Cookbook-for-CC-2014#invisible | CEP 6.0, CC2015 host app |
| [Photoshop Events](https://github.com/Adobe-CEP/Samples/tree/master/PhotoshopEvents) | Demonstrates listening to events in Photoshop. | CEP 5, Photoshop CC2014 |
| [Premiere Pro Panel](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel) | Demonstrates a Premiere Pro panel. | CEP 5, Premiere Pro CC2014 |
| [Anywhere Example Panel](https://github.com/Adobe-CEP/Samples/tree/master/AnywhereExamplePanel) | Demonstrates a Premiere Pro panel integration with Adobe Anywhere (through DOM and http). | CEP 5, Premiere Pro CC2014 and Anywhere 2.2 |
| [Flickr](https://github.com/Adobe-CEP/Samples/tree/master/Flickr) | Demonstrates connecting and retrieving assets from a Cloud service (Flickr in this case). | Minimum version of CEP 4 and Photoshop CC |
| [Trello](https://github.com/Adobe-CEP/Samples/tree/master/Trello) | Demonstrates loading an external website in an iFrame. | CEP 4, CC version of Photoshop, Illustrator, or Premiere Pro |
| [Twitter](https://github.com/Adobe-CEP/Samples/tree/master/Twitter) | Demonstrates how to connect to Twitter and read data that manipulates an Illustrator document. | CEP 4, Illustrator CC |
| [UI Showcase](https://github.com/Adobe-CEP/Samples/tree/master/UI_Showcase) | Demonstrates using common JavaScript UI frameworks in CEP extensions. | CEP 4, CC version of Photoshop, Illustrator, or Premiere Pro |
| [Websockets](https://github.com/Adobe-CEP/Samples/tree/master/Websocket) | Demonstrates using web sockets in an extension. | CEP 4, CC version of Photoshop, Illustrator, or Premiere Pro |
| [XMP Sample Panel](https://github.com/Adobe-CEP/Samples/tree/master/XmpSamplePanel) | Demonstrates manipulating XMP metadata in CC2014 hosts. | CEP 4, CC version of Premiere Pro, InDesign, Photoshop, or Illustrator |
| [HelloBridge](https://github.com/Adobe-CEP/Samples/tree/master/Bridge/HelloBridge) | A Hello World extension for Adobe Bridge. | CEP 8, CC version of Adobe Bridge 8.0 |
| [ShowFolder](https://github.com/Adobe-CEP/Samples/tree/master/Bridge/ShowFolder) | Demonstrates use of CEP APIs and ExtendScript in Adobe Bridge | CEP 8, CC version of Adobe Bridge 8.0 |
