Sample extensions
=======

These samples demonstrate techniques for building an extension with an HTML5 UI and behavior implemented in JavaScript. 

These samples are still in development. Some of them use CEP 4 and the CC2013 version of the host app, and others are for CEP 5 and the new CC2014 version of the host application. You must have the host application installed to run an extension. Requirements for each sample are listed.

* Supported host apps for CEP 5 include the CC2014 versions of: Dreamweaver, Flash Pro, InDesign, Illustrator, InCopy, Photoshop, Premiere Pro, Prelude, and After Effects. 
* Support for the Flash/ActionScript extension model is deprecated in all apps, and has been removed from Photoshop CC2014.

##Before running the samples
The samples provided are unsigned so this will cause the the signature check (built into CEP when first running an extension) to fail. To bypass the signature check, edit the CSXS preference properties file and add a new entry `PlayerDebugMode` of type "string" with the value of "1". This enables debug extensions to be displayed in the host applications. The CSXS preferences properties file is located at:
```
Mac: /Users/<username>/Library/Preferences/com.adobe.CSXS.5.plist
Win: regedit > HKEY_CURRENT_USER/Software/Adobe/CSXS.5
```
----
## Requirements

### CEP 5 extensions

* [SimpleDissolve] (https://github.com/Adobe-CEP/Samples/tree/master/simpledissolve)
	
		Requires CEP 5 and Photoshop CC2014

* [WebGL with three.js (Contributed by Davide Deraedt)](https://github.com/Adobe-CEP/Samples/tree/master/webgl_threejs) : (description TBD)

		Requires CEP 5 and Photoshop CC2014

*  [RSSReader](https://github.com/Adobe-CEP/Samples/tree/master/RSSReader) : Demonstrates using 3rd party NPM modules in a CEP 5 extension.

		Requires CEP 5 and CC2014 version of InDesign/InCopy, Illustrator, or Photoshop

*  [ExchangeExample](https://github.com/Adobe-CEP/Samples/tree/master/ExchangeExample) : Demonstrates using the new Exchange APIs in a CEP 5 extension. Please refer to the exchangeWorkflows.js file for an example on how to interact with the Exchange APIs.

		Requires CEP 5.2, CC2014 product version and Creative Cloud Desktop client installed.

* [Collage](https://github.com/Adobe-CEP/Samples/tree/master/Collage) : Demonstrates the use of Node.js file I/O, CEP file I/O, Progress Meter, keeping UI responsive. 

		Requires CEP 5 and Photoshop CC2014

* [CEP HTML Test Extension](https://github.com/Adobe-CEP/Samples/tree/master/CEP_HTML_Test_Extension) : 
Showcases most features and capabilities of CEP 5, including events, video, database interaction via Node, native APIs, ExternalObject, HTML FlyOut menus and lots of other good stuff!

		Requires CEP 5.2 and a supported CC2014 host app

* [Premiere Pro Panel](https://github.com/Adobe-CEP/Samples/tree/master/PProPanel) : Demonstrates a Premiere Pro panel.

		Requires CEP 5 and Premiere Pro CC2014
		
* [Anywhere Example Panel](https://github.com/Adobe-CEP/Samples/tree/master/AnywhereExamplePanel) : Demonstrates a Premiere Pro panel integration with Adobe Anywhere (through DOM and http).

		Requires CEP 5, Premiere Pro CC2014 and Anywhere 2.2

### CEP 4 extensions
Although these extensions are initially setup for CEP 4, you can adjust the product version targeted by modifying the range inside the `HostList` element of the `CSXS/manifest.xml` file.

* [Flickr](https://github.com/Adobe-CEP/Samples/tree/master/Flickr) : Demonstrates connecting and retrieving assets from a Cloud service (Flickr in this case). 

		Requires a minimum version of CEP 4 and Photoshop CC

* [Trello](https://github.com/Adobe-CEP/Samples/tree/master/Trello) : Demonstrates loading an external website in an iFrame.

		Requires CEP 4 and CC version of Photoshop, Illustrator, or Premiere Pro

* [Twitter](https://github.com/Adobe-CEP/Samples/tree/master/Twitter) : Demonstrates how to connect to Twitter and read data that manipulates an Illustrator document. 

		Requires CEP 4 and Illustrator CC

* [UI Showcase](https://github.com/Adobe-CEP/Samples/tree/master/UI_Showcase) : Demonstrates using common JavaScript UI frameworks in CEP extensions. 

		Requires CEP 4 and CC version of Photoshop, Illustrator, or Premiere Pro

* [Websockets](https://github.com/Adobe-CEP/Samples/tree/master/Websocket) : Demonstrates using web sockets in an extension. 

		Requires CEP 4 and CC version of Photoshop, Illustrator, or Premiere Pro

* [XMP Sample Panel](https://github.com/Adobe-CEP/Samples/tree/master/XmpSamplePanel) : Demonstrates manipulating XMP metadata in CC2014 hosts. 

		Requires CEP 4 and CC version of Premiere Pro, InDesign, Photoshop, or Illustrator
