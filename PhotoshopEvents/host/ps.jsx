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
// Fri May 22 2015 11:56:37 GMT-0700 (Pacific Daylight Time)
var gScriptVersion = "0.1";

// some events we are interested in
var eventMake = 1298866208;   // "Mk  "
var eventDelete = 1147958304; // "Dlt "
var eventClose = 1131180832;  // "Cls "
var eventSelect = 1936483188; // "slct" 
var eventSet = 1936028772;    // "setd" 

function LogIt( inMessage ) {
	try {
		var a = new Logger();
		var b = decodeURIComponent( inMessage );
		a.log( b + "\n");
	}
	catch(e) {
		alert("LogIt catch : " + e + ":" + e.line);
	}
}

///////////////////////////////////////////////////////////////////////////////
// Object: Logger
// Usage: Log information to a text file
// Input: String to full path of file to create or append, if no file is given
//        then output file Logger.log is created on the users desktop
// Return: Logger object
// Example:
//
//   var a = new Logger();
//   a.print( 'hello' );
//   a.print( 'hello2\n\n\nHi\n' ) ;
//   a.remove();
//   a.log( Date() );
//   a.print( Date() );
//   a.display();
//
///////////////////////////////////////////////////////////////////////////////
function Logger( inFile ) {

	// member properties

	// the file we are currently logging to
	if ( undefined == inFile ) {
		this.file = new File( Folder.desktop + "/PhotoshopEvents.log" );
	} else {
		this.file = new File( inFile );
	}
	
	// member methods
	
	// output to the ESTK console
	// note that it behaves a bit differently 
	// when using the BridgeTalk section
	this.print = function( inMessage ) { 
		if ( app.name == "ExtendScript Toolkit" ) {
			print (inMessage);
		} else {
			var btMessage = new BridgeTalk();
			btMessage.target = "estoolkit";
			btMessage.body = "print(" + inMessage.toSource() + ")";
			btMessage.send ();
		}
	}

	// write out a message to the log file
	this.log = function( inMessage ) {
		if ( this.file.exists ) {
			this.file.open( 'e' );
			this.file.seek( 0, 2 ); // end of file
		} else {
			this.file.open( 'w' );
		}
		this.file.write( inMessage );
		this.file.close();
	}

	// show the contents with the execute method
	this.display = function() {
		this.file.execute();
	}

	// remove the file
	this.remove = function() {
		this.file.remove();
	}	
}

// end ps.jsx
