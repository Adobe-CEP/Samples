$(function() {
    var csInterface = new CSInterface();
	
    var appName = csInterface.hostEnvironment.appName;
	
    if(appName != "FLPR") {
    	loadJSX();
    } 
});
    
/*
 * Load JSX files into the scripting context of the product. 
 * All JSX files in <extension>/jsx/product_jsx directory will be loaded
 * so functions can be as below:
 *
 * 	new CSInterface().evalScript('functionName()', resultHandlerFunc);
 *
 */
function loadJSX() {
    var csInterface = new CSInterface();
    var jsxRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/product_jsx/";
    csInterface.evalScript('$._ext.evalFiles("' + jsxRoot + '")');
}