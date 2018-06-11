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

// This was relocated from index.html because syntax highlighting for JavaScript embedded in HTML is
//  unsupported (see: https://github.com/Microsoft/vscode/issues/15377#issuecomment-278578309).
$( document ).ready(function() {

    // For functions which require interaction at the JavaScript level, we provide these JQuery-based
    // handlers, instead of directly invoking ExtendScript .This givs the JavaScript layer a chance
    // to pass data into the ExtendScript layer, and process the results.

    $("#getseqname").on("click", function(e){
            e.preventDefault(); 
            var csInterface = new CSInterface();
            csInterface.evalScript('$._PPP_.getActiveSequenceName()', myCallBackFunction);
            csInterface.evalScript('$._PPP_.getSequenceProxySetting()', myGetProxyFunction);
    });

    $("#copypresets").on("click", function(e){
        e.preventDefault(); 

        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        var path      	= csInterface.getSystemPath(SystemPath.EXTENSION);

        csInterface.evalScript('$._PPP_.getUserName()', myUserNameFunction);

        if (OSVersion){

            // The path always comes back with '/' path separators. Windows needs '\\'.

            if (OSVersion.indexOf("Windows") >=0){
                var initPath = 'C:\\Users\\' + username.innerHTML;
                var sep = '\\\\';
                path = path.replace(/\//g, sep);
            } else {
                var initPath = '/Users/' + username.innerHTML;
                var sep = '/';
            }
        
            path = path + sep + 'payloads' + sep + 'Effect\ Presets\ and\ Custom\ Items.prfpset';

            var readResult = window.cep.fs.readFile(path);

            if (0 == readResult.err){

                // We build a path to the preset, based on the OS user's name.
                
                var addOutPath	= '/Documents/Adobe/Premiere\ Pro/11.0/Profile-' + username.innerHTML + '/Effect\ Presets\ and\ Custom\ Items.prfpset';
                var fullOutPath = initPath + addOutPath;
                var writeResult = window.cep.fs.writeFile(fullOutPath, readResult.data);
        
                if (0 == writeResult.err){
                    alert("Successfully copied effect presets from panel to user's configuration."); //result.data is file content
                } else {
                    alert("Failed to copy effect presets.");
                }
            }
        }
    });

    $("#toggleproxy").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        csInterface.evalScript('$._PPP_.toggleProxyState()', mySetProxyFunction);
        csInterface.evalScript('$._PPP_.getSequenceProxySetting()', myGetProxyFunction);
    });

    $("#checkforums").on("click", function(e){
                e.preventDefault(); 
                var csInterface = new CSInterface();
                csInterface.openURLInDefaultBrowser("https://forums.adobe.com/community/premiere/sdk");
    });

    $("#readAPIdocs").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        
        var path = "file:///Library/Application Support/Adobe/CEP/extensions/PProPanel/payloads/api_doc.html";
        
        if (OSVersion.indexOf("Windows") >=0){
                var path = "file:///C:/Program%20Files%20(x86)/Common%20Files/Adobe/CEP/extensions/PProPanel/payloads/api_doc.html"
        }
        csInterface.openURLInDefaultBrowser(path);	
    });

    $("#newseqfrompreset").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        var path    	= csInterface.getSystemPath(SystemPath.EXTENSION);

        if (OSVersion){
            // The path always comes back with '/' path separators. Windows needs '\\'.
            if (OSVersion.indexOf("Windows") >=0){
                var sep = '\\\\';
                path = path.replace(/\//g, sep);
            } else {
                var sep = '/';
            }

            // Build a String to pass the path to the script.
            // (Sounds more complicated than it is.)

            path = path + sep + 'payloads' + sep + 'PProPanel.sqpreset';

            var pre       = '$._PPP_.createSequenceFromPreset(\'';
            var post      = '\'';
            var postpost  = ')';

            var whole_megillah =  pre + path + post + postpost;

            csInterface.evalScript(whole_megillah);
        }
    });

    $("#installationhelp").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        var path    	= csInterface.getSystemPath(SystemPath.EXTENSION);

        if (OSVersion){
            // The path always comes back with '/' path separators. Windows needs '\\'.
            if (OSVersion.indexOf("Windows") >=0){
                var sep = '\\\\';
                path = path.replace(/\//g, sep);
            } else {
                var sep = '/';
            }

            // Build a String to pass the path to the script.
            // (Sounds more complicated than it is.)

            path = "file://" + path;
            path = path + sep + 'payloads' + sep + 'Installing_Extensions.html';
            
            csInterface.openURLInDefaultBrowser(path);
        }
    });

    $("#renderusingdefaultpreset").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        var path    	= csInterface.getSystemPath(SystemPath.EXTENSION);

        if (OSVersion){
            // The path always comes back with '/' path separators. Windows needs '\\'.
            if (OSVersion.indexOf("Windows") >=0){
                var sep = '\\\\';
                path = path.replace(/\//g, sep);
            } else {
                var sep = '/';
            }

            // Build a String to pass the path to the script.
            // (Sounds more complicated than it is.)

            path = path + sep + 'payloads' + sep + 'example.epr';

            var pre       = '$._PPP_.render(\'';
            var post      = '\'';
            var postpost  = ')';

            var whole_megillah =  pre + path + post + postpost;

            csInterface.evalScript(whole_megillah);
        }
    });

    $("#transcodeexternal").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        var path    	= csInterface.getSystemPath(SystemPath.EXTENSION);

        if (OSVersion){
            // The path always comes back with '/' path separators. Windows needs '\\'.
            if (OSVersion.indexOf("Windows") >=0){
                var sep = '\\\\';
                path = path.replace(/\//g, sep);
            } else {
                var sep = '/';
            }

            // Build a String to pass the path to the script.
            // (Sounds more complicated than it is.)

            path = path + sep + 'payloads' + sep + 'example.epr';

            var pre       = '$._PPP_.transcodeExternal(\'';
            var post      = '\'';
            var postpost  = ')';

            var whole_megillah =  pre + path + post + postpost;

            csInterface.evalScript(whole_megillah);
        }
    });

    $("#ingest").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        var path    	= csInterface.getSystemPath(SystemPath.EXTENSION);

        if (OSVersion){
            // The path always comes back with '/' path separators. Windows needs '\\'.
            if (OSVersion.indexOf("Windows") >=0){
                var sep = '\\\\';
                path = path.replace(/\//g, sep);
            } else {
                var sep = '/';
            }

            // Build a String to pass the path to the script.
            // (Sounds more complicated than it is.)

            path = path + sep + 'payloads' + sep + 'example.epr';

            var pre       = '$._PPP_.ingestFiles(\'';
            var post      = '\'';
            var postpost  = ')';

            var whole_megillah =  pre + path + post + postpost;

            csInterface.evalScript(whole_megillah);
        }
    });

    $("#transcodeusingdefaultpreset").on("click", function(e){
        e.preventDefault(); 
        var csInterface = new CSInterface();
        var OSVersion   = csInterface.getOSInformation();
        var path    	= csInterface.getSystemPath(SystemPath.EXTENSION);

        if (OSVersion){
            // The path always comes back with '/' path separators. Windows needs '\\'.
            if (OSVersion.indexOf("Windows") >=0){
                var sep = '\\\\';
                path = path.replace(/\//g, sep);
            } else {
                var sep = '/';
            }

            // Build a String to pass the path to the script.
            // (Sounds more complicated than it is.)

            path = path + sep + 'payloads' + sep + 'example.epr';

            var pre       = '$._PPP_.transcode(\'';
            var post      = '\'';
            var postpost  = ')';

            var whole_megillah =  pre + path + post + postpost;

            csInterface.evalScript(whole_megillah);
        }
    });
});