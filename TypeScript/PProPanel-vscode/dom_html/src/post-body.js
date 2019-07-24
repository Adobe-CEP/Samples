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

// This was relocated from index.html because syntax highlighting for JavaScript embedded in HTML is
//  unsupported (see: https://github.com/Microsoft/vscode/issues/15377#issuecomment-278578309).
document.body.onbeforeunload = function() {
    var csInterface = new CSInterface();
    var OSVersion   = csInterface.getOSInformation();
    var appVersion 	= csInterface.hostEnvironment.appVersion;
    var versionAsFloat = parseFloat(appVersion);

    if (versionAsFloat < 10.3){
        var path = "file:///Library/Application Support/Adobe/CEP/extensions/PProPanel/payloads/onbeforeunload.html";
        
        if (OSVersion.indexOf("Windows") >=0){
            path = "file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/PProPanel/payloads/onbeforeunload.html"
        }
        csInterface.openURLInDefaultBrowser(path);
    }
};
