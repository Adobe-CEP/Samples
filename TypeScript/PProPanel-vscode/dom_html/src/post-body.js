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
