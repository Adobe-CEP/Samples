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

/***************************************************************************************
 * -- AnywhereHTTPApi ------------------------------------------------------------------------
 * 
 * This wraps http API calls to the Anywhere REST API using simple JQuery $.ajax calls
 * 
 **************************************************************************************/
var AnywhereHTTPApi = (function(exports) {
    
    /**
    * Calling the below URL saves the cookie on CEP level for the current server (as a loopback).
    * This way all calls to the server which uses withCredentials = true will get the cookie
    * and are authenticated
    * Cookies Path on Windows: "C:\Users\[yourusername]\AppData\Local\Temp\cep_cache"</li>
    * Cookies Path on Mac: "/Users/[yourusername]/Library/Caches/CSXS/cep_cache"</li>
    * note: document.cookie will not work to store the cookie because of the wrong scope
    * note2: sending cookie as part of the header request is not working since CEP is
    * using a newer webkit version.
    */
    exports.saveTokenAsCookie = function(token, sessionURL, successCallback) {
        var parser = document.createElement('a');
        parser.href = sessionURL;
        
        var separatorIndex = token.indexOf("=");
        var sessionId = token.substring(separatorIndex+1);
        var loginUrl = parser.protocol + "//" + parser.hostname + ":" + parser.port+ "/libs/granite/core/content/login.html?sid="+sessionId;
        var response = $.ajax({
                                type: "GET",
                                url: loginUrl,
                                crossDomain: true,
                                async: false,
                                beforeSend: function(xhr) {
                                    xhr.withCredentials = true;
                                },
                                success: successCallback,
                                error : function(xhr, statusText, err) {
                                    alert("ERROR while saving authentication cookie. Error " + xhr.status + " "+ err);
                                }
                            });
    }

    /**
    * This is a helper to step through the discoverable API. All entity pages have a 
    * link section with functionality or further resources to discover.
    * This function returns the 'href' of a link based on the 'rel' string.
    */
    exports.getLink = function( url, rel ) {
        href = "";
        
        if (url && url.length !== 0 && rel && rel.length !== 0){
            // using sync for simplicity in this example. Please consider to use async calls instead.
            var response = $.ajax({
                                    type: "GET",
                                    url: url,
                                    crossDomain: true,
                                    async: false,
                                    beforeSend: function(xhr) {
                                        xhr.withCredentials = true;
                                    },
                                    success: function(session){
                                        // go through all the links and find the one requested
                                        $.each(session.links, function(index, link) {
                                            if (link.rel == rel) {
                                                href = link.href;
                                                return;
                                            }
                                        });
                                    },
                                    error : function(xhr, statusText, err) {
                                        alert("ERROR while resolving a link. Error " + xhr.status + " "+ err);
                                    }
                                });
            if (href=="") {
                console.log("Error: Could not find the link:  \n" + rel + "\n on the page: \n" + url);
            }
        }
        return href;
    }
    
    /**
    * returns the list of mountpoints configured in the settings of the Anywhere server.
    * sessionURL: the current user session url
    * successCallback: the callback called with the results (the mountpoint list)
    */
    exports.getMountpoints = function (sessionURL, successCallback) {
        var mountpoints = [];
        var parser = document.createElement('a');
        parser.href = sessionURL;

        var mountpointURL = parser.protocol + "//" + parser.hostname + ":" + parser.port + "/content/ea/api/settings/mountpoints.v1.json?scope=AMSE";
        
        
       
        var response = $.ajax({
                                type: "GET",
                                url: mountpointURL,
                                crossDomain: true,
                                async: false,
                                dataType: 'json',
                                beforeSend: function(xhr) {
                                    xhr.withCredentials = true;
                                },
                                success: successCallback,
                                error : function(xhr, statusText, err) {
                                    alert("ERROR while getting settings from server. Error " + xhr.status + " "+ err);
                                }
                            });
    }
    
    /**
    * constructs the discovery
    */
    exports.getLatestsDiscoveryURL = function(sessionURL) {
        var parser = document.createElement('a');
        parser.href = sessionURL;

        var discoveryURL = parser.protocol + "//" + parser.hostname + ":" + parser.port+ "/ea/api/discovery.json";
        return AnywhereHTTPApi.getLink( discoveryURL, "http://anywhere.adobe.com/discovery/v1");
    }
    /**
    * returns is the server is running in colab only mode (without renderer)
    */
    exports.hasRemoteRendering = function (sessionURL, successCallback) {
        var currentDiscoveryURL = exports.getLatestsDiscoveryURL(sessionURL)
        
        var response = $.ajax({
                                type: "GET",
                                url: currentDiscoveryURL,
                                crossDomain: true,
                                async: false,
                                dataType: 'json',
                                beforeSend: function(xhr) {
                                    xhr.withCredentials = true;
                                },
                                dataFilter : function (data, type) {
                                    if (type == "json") {
                                        //Convert to Json object to allo addition of custom Object
                                        var jsonObj = JSON.parse(data);
                                        var configuration = jsonObj["server"]["configuration"];

                                        if (configuration.hasOwnProperty("remoteRendering")) {
                                            return jsonObj["server"]["configuration"]["remoteRendering"];
                                        } else {
                                            return true;
                                        }
                                    }
                                },
                                success: successCallback,
                                error : function(xhr, statusText, err) {
                                    alert("ERROR while getting discovery data from server. Error " + xhr.status + " "+ err);
                                }
                            }); 
    }
    
    /**
    * Function that creates an ingest job through the Anywhere REST API.
    * Please see the Anywhere API documentation for more details:
    * <anywhereRoot>/docs/documentation/api/jobs/IngestJobCreate.html
    */
    exports.ingest = function( sessionURL, isTargetUserSession, mediaPaths, comment) {
        // go through the discoverable API. First get the production URL from the session page ..
        productionURL = this.getLink( sessionURL, "http://anywhere.adobe.com/productions/production");
        // .. then get the jobs url from the production page ..
        jobsURL = this.getLink( productionURL, "http://anywhere.adobe.com/jobs");
        //.. then get the ingest job url from the jobs page.
        ingestJobURL = this.getLink( jobsURL, "http://anywhere.adobe.com/jobs/ingest#create");

        // check what the destination should be
        if (isTargetUserSession) {
            destination = sessionURL;
        } else {
            destination = productionURL
        }

        if (destination  && destination.length !== 0 && ingestJobURL && ingestJobURL.length !== 0) {
            // create the form data.
            var data = new FormData();
            var parameters = {'destination' : destination,
                              'mediaPaths' : mediaPaths,
                              'comment' : comment}

            data.append(':parameters', JSON.stringify(parameters));

            // create the POST call to create the job. The url of the successful job will be
            // displayed in the alert. You could add more code to get the status and progress of the job.
            // see the Anywhere documentation for more details:
            // <anywhereRoot>/docs/documentation/api/jobs/IngestJobCreate.html
            $.ajax({
                url: ingestJobURL,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                crossDomain: true,
                type: 'POST',
                beforeSend: function(xhr) {
                    xhr.withCredentials = true;
                },
                success: function(data, textStatus, request){
                    // the data object has the current json response of the job
                    // the location stores the job URL
                    alert("Ingest Job created: \n\n "+ request.getResponseHeader('Location'));
                },
                error : function(xhr, statusText, err) {
                    alert("ERROR while creating an Ingest Job. Error " + xhr.status + " "+ err);
                }
            });
        }
    }
    
    return exports;
})(AnywhereHTTPApi || {});