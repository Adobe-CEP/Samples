/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe
* All Rights Reserved.
*
* NOTICE: Adobe permits you to use, modify, and distribute this file in
* accordance with the terms of the Adobe license agreement accompanying
* it. If you have received this file from a source other than Adobe,
* then your use, modification, or distribution of it requires the prior
* written permission of Adobe. 
**************************************************************************/

// JavaScript Document
var agoraLib = new AgoraLib();
var successfulEntitlements = [AgoraLib.status.perpetualPurchase.code, AgoraLib.status.trialPurchase.code, AgoraLib.status.subscriptionPurchase.code, AgoraLib.status.free.code];
var API_TIMEOUT = 60000;
var isEntitledSuccess = false;
var createEntitlementSuccess = false;
var getPurchaseUrlSuccess = false;
var purchaseBtnURL = "";

function launchBrowser() {
    var library = new CSInterface();
    library.openURLInDefaultBrowser(purchaseBtnURL);   
}

function showError(message, timeout, status, statusCode, response) {
    // something has gone wrong
    var messageObj = document.getElementById("message");
    var message = "<p>" + message + "</p>";
    if (!timeout) {
        message += "<p>From Adobe Exchange we have received:<br />";
        message += "Status message: " + status;
        message += "<br />Status code: " + statusCode;
        message += "<br />Response: " + response;
        message += "</p><p>Please check that you have Adobe Creative Cloud Desktop application installed and that you are logged in.</p>"
    }
    messageObj.innerHTML = message;
}

function showSuccess() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("welcome").style.display = "block";
}

function showUpdateMessage() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("welcome_update").style.display = "block";
}

function getPurchaseUrlResponseCallback(result) {
  console.log("getPurchaseUrlResponseCallback received with result " + result.statusCode + ", " + result.status + ", " + result.response);
  getPurchaseUrlSuccess = true;
  if (result.statusCode === AgoraLib.status.success.code) {
    // retrieval of URL was successful
    document.getElementById("loading").style.display = "none";
    document.getElementById("purchase").style.display = "block";
    purchaseBtnURL = result.response;
  } else {
    // something has gone wrong
    showError("Sorry but something has gone wrong when attempting to setup an entitlement for your user account.", false, result.status, result.statusCode, result.response);
  }      
}

function createEntitlementResponseCallback(result) {
    console.log("createEntitlementResponseCallback received with result " + result.statusCode + ", " + result.status + ", " + result.response);
    createEntitlementSuccess = true;
    if (result.statusCode === AgoraLib.status.success.code || result.statusCode === AgoraLib.status.entitlementAlreadyCreated.code) {
        // entitlement creation was successful
        console.log("entitlement creation was successful");
        showSuccess();
    } else if (result.statusCode === AgoraLib.status.updateAvailable.code) {
        // entitlement created but an update is available
        console.log("entitlement created but an update is available");
        showUpdateMessage();
    } else {
        // something has gone wrong so retrieve purchase URL
        console.log("something has gone wrong so retrieve purchase URL");
        agoraLib.getPurchaseUrl(getPurchaseUrlResponseCallback);
        setTimeout(function () {
            if (!getPurchaseUrlSuccess) {
                console.log("getPurchaseUrlResponseCallback request timed out");
                showError("getPurchaseUrl request timed out", true);
            }
        }, API_TIMEOUT); // 1 min timeout
    }
}

/** Handles response from isEntitled API */
function isEntitledResponseCallback(result) {
  console.log("isEntitledResponseCallback received with result " + result.statusCode + ", " + result.status + ", " + result.response);
  isEntitledSuccess = true;
  if (successfulEntitlements.indexOf(result.statusCode) >= 0) {
    console.log("User has an entitlement");
    showSuccess();
  } else {
    console.log("User has not got an entitlement so create one");
    agoraLib.createEntitlement(createEntitlementResponseCallback);
    setTimeout(function () {
        if (!createEntitlementSuccess) {
            console.log("createEntitlementResponseCallback request timed out");
            showError("Sorry but the createEntitlement response timed out", true);
        }
    }, API_TIMEOUT);  
  }       
}
 
/** initial call to check if the user already has an entitlement. **/     
function checkEntitlement() {
  console.log("Checking entitlement");
  agoraLib.isEntitled(isEntitledResponseCallback);
    
  setTimeout(function () {
      if (!isEntitledSuccess) {
          console.log("isEntitledResponseCallback request timed out");
          showError("Sorry but the isEntitled response timed out", true);
      }
  }, API_TIMEOUT);

}