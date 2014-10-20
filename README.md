Sample extensions
=======

These samples demonstrate techniques for building an extension with an HTML5 UI and behavior implemented in JavaScript. 

These samples are still in development. Some of them use CEP 4 and the CC2013 version of the host app, and others are for CEP 5 and the new CC2014 version of the host application. You must have the host application installed to run an extension. Requirements for each sample are listed.

* Supported host apps for CEP 5 include the CC2014 versions of: Dreamweaver, Flash Pro, InDesign, Illustrator, InCopy, Photoshop, Premiere Pro, Prelude, and After Effects. 
* Support for the Flash/ActionScript extension model is deprecated in all apps, and has been removed from Photoshop CC2014.

##Before running the samples
The samples are unsigned so will fail the signature check that is built into CEP when running an extension. To bypass this check, edit the CSXS preference properties file and add a new entry `PlayerDebugMode` of type "string" with the value of "1". This enables debug extensions to be displayed in the host applications. The CSXS preferences properties file is located at:
```
Mac: /Users/<username>/Library/Preferences/com.adobe.CSXS.5.plist
Win: regedit > HKEY_CURRENT_USER/Software/Adobe/CSXS.5
```

----

* [Flickr](https://github.com/Adobe-CEP/Samples/tree/master/Flickr) : Demonstrates connecting and retrieving assets from a Cloud service (Flickr in this case). 

		Requires CEP 4 and Photoshop CC

* [Trello](https://github.com/Adobe-CEP/Samples/tree/master/Trello) : Demonstrates loading an external website in an iFrame.

		Requires CEP 4 and CC version of Photoshop, Illustrator, or Premiere Pro

* [Twitter](https://github.com/Adobe-CEP/Samples/tree/master/Twitter) : Demonstrates how to connect to Twitter and read data that manipulates an Illustrator document. 

		Requires CEP 4 and Illustrator CC

* [UI Showcase](https://github.com/Adobe-CEP/Samples/tree/master/UI_Showcase) : Demonstrates using common JavaScript UI frameworks in CEP extensions. 

		Requires CEP 4 and CC version of Photoshop, Illustrator, or Premiere Pro

* [Websockets](https://github.com/Adobe-CEP/Samples/tree/master/Websocket) : Demonstrates using web sockets in an extension. 

		Requires CEP 4 and CC version of Photoshop, Illustrator, or Premiere Pro

----

* [CEP HTML Test Extension](https://github.com/Adobe-CEP/Samples/tree/master/CEP_HTML_Test_Extension_5.0) : 
Showcases most features and capabilities of CEP 5, including events, video, database interaction via Node, native APIs, ExternalObject, HTML FlyOut menus and lots of other good stuff!

		Requires CEP 5 and a supported CC2014 host app

* [Collage](https://github.com/Adobe-CEP/Samples/tree/master/Collage) : Demonstrates the use of Node.js file I/O, CEP file I/O, Progress Meter, keeping UI responsive. 

		Requires CEP 5 and Photoshop CC2014

* [XMP Sample Panel](https://github.com/Adobe-CEP/Samples/tree/master/XmpSamplePanel) : Demonstrates manipulating XMP metadata in CC2014 hosts. 

		Requires CEP 5 and CC2014 version of Premiere Pro, InDesign, Photoshop, or Illustrator
		
*  [RSSReader](https://github.com/Adobe-CEP/Samples/tree/master/RSSReader) : Demonstrates using 3rd party NPM modules in a CEP 5 extension.

		Requires CEP 5 and CC2014 version of InDesign/InCopy, Illustrator, or Photoshop

* [WebGL with three.js (Contributed by Davide Deraedt)](https://github.com/Adobe-CEP/Samples/tree/master/webgl_threejs) : (description TBD)

		Requires (TBD)
