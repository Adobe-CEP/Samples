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

/*
* function to autoscale the browser div based on the window size
**/
function sizeContent() {
    var newHeight = $("html").height() - 500 + "px";
    $(".treeDiv").css("min-height", newHeight);
    $(".treeDiv").css("height", newHeight);
}

$(document).ready(function() {
    
    sizeContent();
    $(window).resize(sizeContent);
    
    //init UI
    $( "button" ).button();
    
    DOMBridge.init(function() {
        // get and save auth token
        DOMBridge.anywhere.getAuthenticationToken( function(token) {
            if (token && token.length !== 0) {
                // check if a production is opened
                DOMBridge.anywhere.isProductionOpen( function(isOpen) {
                    if (isOpen === 'true')
                    {
                        // show main UI
                        $('#generalError').hide();
                        registerCallbacks();   

                        // setup the browse tree (if the browse API is supported)
                        DOMBridge.anywhere.getCurrentEditingSessionURL( function (sessionURL) {
                            // save token
                            AnywhereHTTPApi.saveTokenAsCookie (token, sessionURL, function() {
                                setupTree(sessionURL);
                            });
                        });

                        $('#main').show();

                        // if Prelude is used hide DOM buttons
                        if (DOMBridge.getApplicationID() === 'PRLD') {
                            $('#DOMTble').hide();
                        }
                    } else {
                        // hide main UI and show error
                        $('#error').html("Please Open an Anywhere Production!").show();
                        $('#main').hide();
                    }
                });
            } else {
                // hide main UI and show error
                $('#error').html("Please Sign in to Adobe Anywhere!").show();
                $('#main').hide();
            }
        });
    });
    
    /**
    * setup the tree by initializing the data connection
    **/
    function setupTree(sessionURL) {
        // first make sure that we are not in colabOnly mode
        AnywhereHTTPApi.hasRemoteRendering(sessionURL, function(hasRemoteRendering) {
            if (!hasRemoteRendering) {
                // colab Only mode == show error
                // hide main UI and show error
                $("#main").css("padding-top", "0px");
                $("#error").css("font-size", "0.8em");
                $('#generalError').show()
                $('#error').html("<br>note: Collaboration Only Mode!").show();
                $('#btn_refresh').hide();
            } 
            // try to get the browse API
            var currentDiscoveryURL = AnywhereHTTPApi.getLatestsDiscoveryURL( sessionURL);
            var browseAPIURL = AnywhereHTTPApi.getLink( currentDiscoveryURL, "http://anywhere.adobe.com/mountpoints/browse");

            // check if browse API is supported already
            if (browseAPIURL !== "" ){ 

                AnywhereHTTPApi.getMountpoints(sessionURL, function(mountpointsJSON) {
                    console.dir(mountpointsJSON)
                    //fill mountpoints in drop down
                    var mountpoints = mountpointsJSON["setting"]["properties"]["mountpoints"]
                    $.each(mountpoints, function() {
                       $("#mountpointDropDown").append(new Option(this.label, this.label));
                    });

                    // changing the mountpoint in the dropdown causes a reload of the tree data
                    $("#mountpointDropDown").change(function () {
                            DOMBridge.anywhere.getAuthenticationToken( function(newToken) {
                                 // save token
                                if (newToken && newToken.length !== 0) {
                                    AnywhereHTTPApi.saveTokenAsCookie (newToken, sessionURL, function() {
                                        initTreeData( browseAPIURL, $('#mountpointDropDown option:selected').val())
                                    });
                                }else {
                                    // hide main UI and show error
                                    $('#error').html("Please Sign in to Adobe Anywhere!").show();
                                    $('#main').hide();
                                }                            
                            });
                        });

                    //init tree
                    initTreeData( browseAPIURL, $('#mountpointDropDown option:selected').val());
                });
            } else {
                // hide tree
                $("#browseUI").hide();
            }
        });      
    };
    
    /*
    * reload the data of the tree ui
    * Parameters:
    * browseAPIURL - string - the browseAPI url
    * mountpoint - string - the mountpoint to be browsed
    */
    function initTreeData( browseAPIURL, mountpoint) {
         $("#browse_jstree").jstree('destroy');
        
        $("#browse_jstree")
            .on('select_node.jstree', function (e, data) {
                var pathArray = getSelectedPaths();
                if ( pathArray.length > 0 ) {
                    if (pathArray.length > 1) {
                        $('#ingestPath').val( JSON.stringify(pathArray) );
                    } else {
                        // for single clips only show the eameadia path (not JSON syntax)
                        $('#ingestPath').val( pathArray[0] );
                    }
                }
                
            })
            .jstree( JSTreeAnywhereBrowser.setupDataLink( browseAPIURL, mountpoint) );
        
    };

    /**
    * creates an array of the selected files and filters out selected folders
    */
    function getSelectedPaths() {
        var pathArray = [];
        var nodeArray = $('#browse_jstree').jstree('get_selected',true);
        for (var i = 0; i < nodeArray.length; i++) {     
            if (nodeArray[i].original.type !== "DIRECTORY" && 
                nodeArray[i].original.url && 
                nodeArray[i].original.url.length !== 0) {
                pathArray.push( nodeArray[i].original.url );
            } 
        }
        return pathArray;
    }
    
    
    /**
    * function that checks if the path is valid and displays error if not.
    * More checks might be added here.
    * Parameters:
    * path - the path that should be checked
    */
    function validPath(path) {
        if (!(path && path.length !== 0)) {
            alert("Please enter a valid path");
            return false;
        } else {
            return true;
        }
    };
    /**
    * triggers an server side Ingest Job
    * Parameters:
    * isTargetUserSession - bool - if true, ingests into the user session instead of the main line
    * paths - array - array of eamedia:// paths to the media to ingest
    * comment - string - some comments for the job
    * see AnywhereHTTPApi#ingest
    */
    function httpIngest( isTargetUserSession, paths, comment) {
        DOMBridge.anywhere.getCurrentEditingSessionURL(function(sessionURL) {
            AnywhereHTTPApi.ingest( sessionURL, isTargetUserSession, paths, comment );
        });
    }
    
    function getPathsFromInputTextField() {
        var pathsString = $('#ingestPath').val()
        if (pathsString.length !== 0) {
            if (pathsString[0] === '[') // indicator that it might be multiselect (JSON)
            {
                try {
                    var pathsArray = $.parseJSON(pathsString);
                    return pathsArray;
                } catch (e) {
                    alert("syntax error:" + e.message);
                }
            } else {
                return pathsString;
            }
        }
        return "" //no paths found
    }
    
    /**
    * register all callbacks related to UI elements
    */
    function registerCallbacks() {
        // button events
        $('#btn_openInSource').click(function() {
            var paths = getPathsFromInputTextField();
            if ( paths instanceof Array) { // more than one clip selected
                // only play the first path
                if ( validPath(paths[0]) ) {
                    DOMBridge.openInSourceAndPlay( paths[0] );
                }
            } else {
                DOMBridge.openInSourceAndPlay( paths ) ;
            }
         });

        $('#btn_ingestDOMUser').click(function() {
            var paths = getPathsFromInputTextField();
            if ( paths instanceof Array) { // more than one clip selected
                // register callback as second parameter if needed
                DOMBridge.importFiles( paths );
            } else {
                DOMBridge.importFile( paths );
            }
            
        });

        //dragHandler
        $('#btn_dragthing').on('dragstart',function(event) {
            var paths = getPathsFromInputTextField();
             if ( paths instanceof Array) { // more than one clip selected
                // only play the first path
                if ( validPath(paths[0]) ) {
                    event.originalEvent.dataTransfer.setData("com.adobe.cep.dnd.file.0" , paths[0]);
                 }
            } else {
                if ( validPath(paths) ) {
                    event.originalEvent.dataTransfer.setData("com.adobe.cep.dnd.file.0" , paths);
                }
            }
        });
        
        $('#btn_ingestHTTPUser').click(function() {
            var paths = getPathsFromInputTextField();
            if ( !(paths instanceof Array)) {
                paths = [ paths ]
            }
            httpIngest( true, paths, "ingest into session demo");
            
        });

        $('#btn_ingestHTTPProd').click(function() {
            var paths = getPathsFromInputTextField();
            if ( !(paths instanceof Array)) {
                paths = [ paths ]
            }
            httpIngest( false, paths, "ingest into Production demo");
        });

        
        
    }
});
