/*************************************************************************
* 
* ADOBE INC.
*  Copyright 2016 Adobe Inc.
*  All Rights Reserved.
* 
* NOTICE:  Adobe permits you to use, modify, and distribute this file in 
* accordance with the terms of the Adobe license agreement accompanying it.  
* If you have received this file from a source other than Adobe, then your 
* use, modification, or distribution of it requires the prior written 
* permission of Adobe.
* 
**************************************************************************/

///////////////////////////////////////////////////////////////////////////////
//
// The Transport object is a wrapper object to Audition transport functionality
//
var Transport = 
{
	// Transport event types
	//
	EVENT_LOOPSTARTED	: 'TransportEvent.LoopStarted',
	EVENT_LOOPSTOPPED	: 'TransportEvent.LoopStopped',
	EVENT_PAUSESTARTED	: 'TransportEvent.PauseStarted',
	EVENT_PAUSESTOPPED	: 'TransportEvent.PauseStopped',
	EVENT_PLAYERSTARTED	: 'TransportEvent.PlayerStarted',
	EVENT_PLAYERSTOPPED	: 'TransportEvent.PlayerStopped',
	EVENT_RECORDSTARTED	: 'TransportEvent.RecordStarted',
	EVENT_RECORDSTOPPED	: 'TransportEvent.RecordStopped',

	// register for transport event (see above for event types)
	//
	addEventListener : function(type, handler)
	{
		var cs = new CSInterface();
		cs.addEventListener(type, handler);
		cs.evalScript('app.transport.addEventListener("' + type + '", dispatchTransportEvent);');
	},

	// unregister for transport event (see above for event types)
	//
	removeEventListener : function(type, handler)
	{
		var cs = new CSInterface();
		cs.removeEventListener(type, handler);
		cs.evalScript('app.transport.removeEventListener("' + type + '", dispatchTransportEvent);');
	},

	// return true if paused
	//
	isPaused : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.isPaused;', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// return true if play is enabled
	//
	isPlayEnabled : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.isPlayEnabled;', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// return true if currently playing
	//
	isPlaying : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.isPlaying;', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// return true if record is enabled
	//
	isRecordEnabled : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.isRecordEnabled;', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// return true if currently recording
	//
	isRecording : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.isRecording;', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// return true if currently looping
	//
	isLooping : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.loop;', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// true if looping is switched on (read/write)
	//
	loop : function(inLooping, inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.loop = ' + inLooping + ';', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// pause playback
	//
	pause : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.pause();', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// start playback
	//
	play : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.play();', function(result)
		{
			inCallback(result == 'true');
		});
	},

	record : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.record();', function(result)
		{
			inCallback(result == 'true');
		});
	},

	// stop recording or playback
	//
	stop : function(inCallback)
	{
		var cs = new CSInterface();
		cs.evalScript('app.transport.stop();', function(result)
		{
			inCallback(result == 'true');
		});
	}
};

