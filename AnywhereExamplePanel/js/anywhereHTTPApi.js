/*  
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.
 * 
 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a 
 * source other than Adobe, then your use, modification, or distribution of it requires the prior 
 * written permission of Adobe.
 */

/***************************************************************************************
 * -- AnywhereHTTPApi ------------------------------------------------------------------------
 * 
 * This wraps http API calls to the Anywhere REST API using simple JQuery $.ajax calls
 * 
 **************************************************************************************/
var AnywhereHTTPApi = (function(exports) {
    
    /**
    * This is a helper to step through the discoverable API. All entity pages have a 
    * link section with functionality or further resources to discover.
    * This function returns the 'href' of a link based on the 'rel' string.
    * Authentication is done by sending the cookie string (token) directly. (This could 
    * also be done by storing the cookie)
    */
    exports.getLink = function(token, url, rel ) {
        href = "";
        
        if (url && url.length !== 0 && rel && rel.length !== 0){
            // using sync for simplicity in this example. Please consider to use async calls instead.
            var response = $.ajax({
                                    type: "GET",
                                    url: url,
                                    async: false,
                                    beforeSend: function(xhr) {
                                        xhr.setRequestHeader("Cookie", sessionToken);
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
                                        alert("ERROR while creating an Ingest Job. Error " + xhr.status + " "+ err);
                                    }
                                });
            if (href=="") {
                alert("Error: Could not find the link:  \n" + rel + "\n on the page: \n" + url);
            }
        }
        return href;
    }
    
    /**
    * Function that creates an ingest job through the Anywhere REST API.
    * Please see the Anywhere API documentation for more details:
    * <anywhereRoot>/docs/documentation/api/jobs/IngestJobCreate.html
    */
    exports.ingest = function( sessionURL, isTargetUserSession, token, mediaPaths, comment) {
        // go through the discoverable API. First get the production URL from the session page ..
        productionURL = this.getLink(token, sessionURL, "http://anywhere.adobe.com/productions/production");
        // .. then get the jobs url from the production page ..
        jobsURL = this.getLink(token, productionURL, "http://anywhere.adobe.com/jobs");
        //.. then get the ingest job url from the jobs page.
        ingestJobURL = this.getLink(token, jobsURL, "http://anywhere.adobe.com/jobs/ingest#create");

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
                    xhr.setRequestHeader("Cookie", sessionToken);
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