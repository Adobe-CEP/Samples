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


var externalObjectName = "PlugPlugExternalObject";
var lib = new ExternalObject( "lib:" + externalObjectName );

function dispatchTransportEvent(eventObj)
{
	//
	// send event to CEP
	//
    var event = new CSXSEvent();
    event.type = eventObj.type;
    event.data = eventObj.type;
    event.dispatch();
    
    return eventObj.type;
}
