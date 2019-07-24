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

function onLoaded()
{
	initAppearance();

	//
	// set initial state
	//
	Transport.isPlaying(function(isPlaying)
	{
		setPlay(isPlaying);
	});
	
	Transport.isRecording(function(isRecording)
	{
		setRecord(isRecording);
	});
	
	Transport.isPaused(function(isPaused)
	{
		setPause(isPaused);
	});
	
	Transport.isLooping(function(isLooping)
	{
		setLoop(isLooping);
	});
	
	//
	// register event handler
	//
	Transport.addEventListener(Transport.EVENT_PLAYERSTARTED, function()
	{
		setPlay(true);
	});

	Transport.addEventListener(Transport.EVENT_PLAYERSTOPPED, function()
	{
		setPlay(false);
	});

	Transport.addEventListener(Transport.EVENT_RECORDSTARTED, function()
	{
		setRecord(true);
	});

	Transport.addEventListener(Transport.EVENT_RECORDSTOPPED, function()
	{
		setRecord(false);
	});

	Transport.addEventListener(Transport.EVENT_PAUSESTARTED, function()
	{
		setPause(true);
	});

	Transport.addEventListener(Transport.EVENT_PAUSESTOPPED, function()
	{
		setPause(false);
	});

	Transport.addEventListener(Transport.EVENT_LOOPSTARTED, function()
	{
		setLoop(true);
	});

	Transport.addEventListener(Transport.EVENT_LOOPSTOPPED, function()
	{
		setLoop(false);
	});
}

function setPlay(isPlaying)
{
	document.getElementById('play').innerHTML = isPlaying ? '<font color="green">Play</font>' : '<font color="gray">Play</font>';
}

function setRecord(isRecording)
{
	document.getElementById('record').innerHTML = isRecording ? '<font color="red">Record</font>' : '<font color="gray">Record</font>';
}

function setPause(isPaused)
{
	document.getElementById('pause').innerHTML = isPaused ? '<font color="green">Pause</font>' : '<font color="gray">Pause</font>';
}

function setLoop(isLooping)
{
	document.getElementById('loop').innerHTML = isLooping ? '<font color="yellow">Loop</font>' : '<font color="gray">Loop</font>';
}
