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
try {

    // globals
    var gScriptJSVersion = "0.1";
    var gAlertsOn = true;

    var gStartDate = new Date();
    var gEndDate = new Date();

    // Get a reference to a CSInterface object
    var csInterface = new CSInterface();

    // Get extension ID
    var gExtensionID = csInterface.getExtensionID();

    // some events we are interested in
    var eventMake = 1298866208; // "Mk  "
    var eventDelete = 1147958304; // "Dlt " 
    var eventClose = 1131180832; // "Cls " 
    var eventSelect = 1936483188; // "slct" 
    var eventSet = 1936028772; // "setd" 

    var gRegisteredEvents = [eventMake, eventDelete, eventClose, eventSelect, eventSet];

    // all callbacks need to be unique so only your panel gets them
    // for Photoshop specific add on the id of your extension
    csInterface.addEventListener("com.adobe.PhotoshopJSONCallback" + gExtensionID, PhotoshopCallbackUnique);

    // get all my UI items
    var cbMake = window.document.getElementById("cbMake");
    var lblMake = window.document.getElementById("lblMake");
    var cbDelete = window.document.getElementById("cbDelete");
    var lblDelete = window.document.getElementById("lblDelete");
    var cbClose = window.document.getElementById("cbClose");
    var lblClose = window.document.getElementById("lblClose");
    var cbSelect = window.document.getElementById("cbSelect");
    var lblSelect = window.document.getElementById("lblSelect");
    var cbSet = window.document.getElementById("cbSet");
    var lblSet = window.document.getElementById("lblSet");
    var lblResult = window.document.getElementById("lblResult");
    var lblTiming = window.document.getElementById("lblTiming");

    // set up handlers, some are defined in HTML as well
    btnClose.onclick = function () {
        Register(false, gRegisteredEvents.toString());
        Persistent(false);
        if (window.__adobe_cep__) {
            window.__adobe_cep__.closeExtension();
        }
    };

    // event to handle when a checkbox is clicked
    function EventClick(inCheckbox) {
        try {
            var uiItem = null;
            var eventID = 0;
            if (inCheckbox === cbMake) {
                uiItem = cbMake;
                eventID = eventMake;
            } else if (inCheckbox === cbDelete) {
                uiItem = cbDelete;
                eventID = eventDelete;
            } else if (inCheckbox === cbClose) {
                uiItem = cbClose;
                eventID = eventClose;
            } else if (inCheckbox === cbSelect) {
                uiItem = cbSelect;
                eventID = eventSelect;
            } else if (inCheckbox === cbSet) {
                uiItem = cbSet;
                eventID = eventSet;
            }
            if (uiItem !== null) {
                Register(uiItem.checked, eventID.toString());
            }
            // TODO remove or add the event into the gRegisteredEvents array
        }
        catch (e) {
            JSLogIt("EventClick catch:" + e);
        }
    }

    // Tell Photoshop to not unload us when closed
    function Persistent(inOn) {
        gStartDate = new Date();
        var event;
        if (inOn) {
            event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
        } else {
            event = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
        }
        event.extensionId = gExtensionID;
        csInterface.dispatchEvent(event);
        SetResultTime();
    }

    // Tell Photoshop the events we want to listen for
    function Register(inOn, inEvents) {
        gStartDate = new Date();
        var event;
        if (inOn) {
            event = new CSEvent("com.adobe.PhotoshopRegisterEvent", "APPLICATION");
        } else {
            event = new CSEvent("com.adobe.PhotoshopUnRegisterEvent", "APPLICATION");
        }
        event.extensionId = gExtensionID;
        event.data = inEvents;
        csInterface.dispatchEvent(event);
        SetResultLabel("Register: " + inOn);
    }

    function SetResultLabel(inStr) {
        lblResult.innerHTML = inStr;
    }

    function SetResultTime() {
        gEndDate = new Date();
        lblTiming.innerHTML = ((gEndDate - gStartDate) / 1000).toString();
    }

    // When an event occurs we get called here
    // It is a JSON string hidden in a string (bug in Photoshop)
    // Remove the header and make an object out of it
    // Here is an example event for when a new doucment was created:
    /*
     { "eventID":1298866208,
       "eventData":
        { "documentID":1566,
          "new":
           { "_obj":"document",
             "depth":8,
             "fill":
              { "_enum":"fill",
                "_value":"white"
              },
             "height":
              { "_unit":"distanceUnit",
                "_value":360
              },
             "mode":
              { "_class":"RGBColorMode"
              },
             "pixelScaleFactor":1,
             "profile":"sRGB IEC61966-2.1",
             "resolution":
              { "_unit":"densityUnit",
                "_value":300
              },
             "width":
              { "_unit":"distanceUnit",
                "_value":504
              }
            }
        }
     }
    */
    function PhotoshopCallbackUnique(csEvent) {
        try {
            if (typeof csEvent.data === "string") {
                var eventData = csEvent.data.replace("ver1,{", "{");
                var eventDataParse = JSON.parse(eventData);
                var jsonStringBack = JSON.stringify(eventDataParse);
                SetResultLabel("PhotoshopCallbackUnique: " + jsonStringBack);
                JSLogIt("PhotoshopCallbackUnique: " + jsonStringBack);

                var uiItemToUpdate = null;
                if (eventDataParse.eventID === eventMake)
                    uiItemToUpdate = lblMake;
                else if (eventDataParse.eventID === eventDelete)
                    uiItemToUpdate = lblDelete;
                else if (eventDataParse.eventID === eventClose)
                    uiItemToUpdate = lblClose;
                else if (eventDataParse.eventID === eventSelect)
                    uiItemToUpdate = lblSelect;
                else if (eventDataParse.eventID === eventSet)
                    uiItemToUpdate = lblSet;

                if (uiItemToUpdate !== null) {
                    var count = Number(uiItemToUpdate.innerHTML) + 1;
                    uiItemToUpdate.innerHTML = " " + count;
                }

                // if you just made a text layer, let me check my object for something
                // interesting to dump to log
                if (eventDataParse &&
                    eventDataParse.eventData.null &&
                    eventDataParse.eventData.null._ref &&
                    eventDataParse.eventData.null._ref === "textLayer") {
                    JSLogIt("Got a text layer, trying to find paragraphStyleRange");
                    if (eventDataParse.eventData.using &&
                        eventDataParse.eventData.using.paragraphStyleRange) {
                        JSLogIt("paragraphStyleRange:" + eventDataParse.eventData.using.paragraphStyleRange);
                        JSLogIt("paragraphStyleRange typeof :" + typeof eventDataParse.eventData.using.paragraphStyleRange);
                        JSLogIt("paragraphStyleRange[0].from: " + eventDataParse.eventData.using.paragraphStyleRange[0].from);
                    }
                }
            } else {
                JSLogIt("PhotoshopCallbackUnique expecting string for csEvent.data!");
            }
        } catch (e) {
            JSLogIt("PhotoshopCallbackUnique catch:" + e);
        }
    }

    // Initialize my panel for first view
    function Initialize() {
        try {
            document.body.style.backgroundColor = "#" + UIColorToHexString(csInterface.hostEnvironment.appSkinInfo.panelBackgroundColor);
            Persistent(true);
            Register(true, gRegisteredEvents.toString());
            SetResultLabel("Initialize done");
            SetResultTime();
        } catch (e) {
            JSLogIt("InitializeCallback catch: " + e);
        }
    }

    function UIColorToHexString(inUIColor) {
        var s = "";
        try {
            if (typeof inUIColor == "undefined") return "undefined";
            if (inUIColor.type != 1) return "type:" + inUIColor.type;
            s += inUIColor.color.red.toString(16);
            s += inUIColor.color.green.toString(16);
            s += inUIColor.color.blue.toString(16);
        } catch (e) {
            s = e.toString();
        }
        return s;
    }

    function JSLogIt(inMessage) {
        csInterface.evalScript("LogIt('" + inMessage + "')");
    }

} // global try
catch (e) {
    JSLogIt("Global catch : " + e);
}
// end main.js
