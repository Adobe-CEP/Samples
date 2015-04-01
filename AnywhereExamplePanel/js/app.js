/*  
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.
 * 
 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a 
 * source other than Adobe, then your use, modification, or distribution of it requires the prior 
 * written permission of Adobe.
 * 
 * ---
 * 
 * This file contains the application logic. It calls DOM functionality through the wrapper 
 * PremiereDOMBridge and HTTP calls through the wrapper AnywhereHTTPApi.
 * It makes use of the jQuery javascript library that is commonly used in web applications and
 * provides a powerful way to work with the HTML DOM.
 * 
 * 
 */
$(document).ready(function() {
    
    //init UI
    $( "button" ).button();
    
    // get and save auth token
    PremiereDOMBridge.anywhere.getAuthenticationToken( function(token) {
        if (token && token.length !== 0) {
            // save token
            sessionToken = token;
            // check if a production is opened
            PremiereDOMBridge.anywhere.isProductionOpen( function(isOpen) {
                if (isOpen === 'true')
                {
                    // show main UI
                    $('#generalError').hide();
                    registerCallbacks(token);
                    $('#main').show();
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
    

    /**
    * function that checks if the path is valid and displays error if not.
    * More checks might be added here.
    */
    function validPath(path)
    {
        if (!(path && path.length !== 0))
        {
            alert("Please enter a valid path");
            return false;
        }
        else
        {
            return true;
        }
    }
    
    
    /**
    * triggers an server side Ingest Job
    * Parameters:
    * intoSession - bool - if true, ingests into the user session instead of the main line
    * paths - array - array of eamedia:// paths to the media to ingest
    * comment - string - some comments for the job
    * see AnywhereHTTPApi#ingest
    */
    function httpIngest( isTargetUserSession, token, paths, comment) {
        PremiereDOMBridge.anywhere.getCurrentEditingSessionURL(function(sessionURL) {
            AnywhereHTTPApi.ingest( sessionURL, isTargetUserSession, token, paths, comment );
        });
    }
    
    function registerCallbacks(token) {
        // button events
        $('#btn_openInSource').click(function() {
            var path = $('#ingestPath').val();
            if ( validPath(path) ) {
                PremiereDOMBridge.openInSource( path );
            }
         });

        $('#btn_ingestDOMUser').click(function() {
            var path = $('#ingestPath').val();
            if ( validPath(path) ) {
                // register callback as second parameter if needed
                PremiereDOMBridge.importFile( path );
            }
        });

        $('#btn_ingestHTTPUser').click(function() {
            var path = $('#ingestPath').val();
            if ( validPath(path)) {
                httpIngest( true, token, [path], "ingest into session demo");
            }
        });

        $('#btn_ingestHTTPProd').click(function() {
            var path = $('#ingestPath').val();
            if ( validPath(path) ) {
                httpIngest( false, token, [path], "ingest into Production demo");
            }
        });

        //dragHandler
        $('#btn_dragthing').on('dragstart',function(event) {
            var path = $('#ingestPath').val();
            if ( validPath(path) ) {
                event.originalEvent.dataTransfer.setData("com.adobe.cep.dnd.file.0", path);
            }
        });
    }
});
