// JavaScript Document
var agoraLib = new AgoraLib();
var successfulEntitlements = [AgoraLib.status.perpetualPurchase.code, AgoraLib.status.trialPurchase.code, AgoraLib.status.subscriptionPurchase.code, AgoraLib.status.free.code];

function getPurchaseUrlResponseCallback(result) {
  console.log("getPurchaseUrlResponseCallback received with result " + result.statusCode + ", " + result.status + ", " + result.response);
  if (result.statusCode === AgoraLib.status.success.code) {
    // retrieval of URL was successful
    document.getElementById("loading").style.display = "none";
    document.getElementById("purchase").style.display = "block";
    var purchaseBtnObj = document.getElementById("purchaseBtn");
    purchaseBtnObj.href = result.response; 
  } else {
    // something has gone wrong
    var messageObj = document.getElementById("message");
    var message = "<p>Sorry but something has gone wrong when attempting to setup an entitlement for your user account.</p>";
    message += "<p>From Adobe Exchange we have received:<br />";
    message += "Status message: " + result.status;
    message += "<br />Status code: " + result.statusCode;
    message += "<br />Response: " + result.response;
    message += "</p><p>Please check that you have Adobe Creative Cloud Desktop application installed and that you are logged in.</p>"
    messageObj.innerHTML = message;
  }        
}

/** Handles response from isEntitled API */
function isEntitledResponseCallback(result) {
  console.log("isEntitledResponseCallback received with result " + result.statusCode + ", " + result.status + ", " + result.response);
  if (successfulEntitlements.indexOf(result.statusCode) >= 0) {
    console.log("User has an entitlement");
    document.getElementById("loading").style.display = "none";
    document.getElementById("welcome").style.display = "block";
  } else {
    console.log("User has not got an entitlement so retrieve a link to purchasing the product");
    agoraLib.getPurchaseUrl(getPurchaseUrlResponseCallback);
  }       
}
 
/** initial call to check if the user already has an entitlement. **/     
function checkEntitlement() {
  console.log("Checking entitlement");
  agoraLib.isEntitled(isEntitledResponseCallback);
}