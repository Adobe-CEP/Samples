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

var JSTreeAnywhereBrowser = (function(exports) {
    
    /*
    * this function returns the ajax data connection to initialize a jstree component with the Adobe Anywhere browse api
    **/
    exports.setupDataLink = function( browseAPIURL, mountpoint ) {
        
        
    return {
        plugins : ["themes", "json_data", "ui", "types"],
        types : {
            
            default : {
                valid_children : ["FILE","DIRECTORY"] // this is compared with the value of the TYPE property
              },
            FILE : {
                icon: "images/movie_icon.bmp" // icon used for a file
            }
          },
        core : {
            check_callback: true,
            themes : {
                name: "default-dark"
            },
            data : {
                    url: browseAPIURL,
                    data: function(node) {
                        // make sure to also set the path for the root element
                        var path = node.id === '#' ? "eamedia://"+mountpoint : node.original.url;
                        return JSON.stringify({"url": path })
                    },
                    cache: false,
                    contentType: false,
                    processData: false,
                    crossDomain: true,
                    type: 'POST',
                    dataType: 'json',
                    beforeSend: function(xhr) {
                        xhr.withCredentials = true;
                    },
                    // the data filter turns the input from the browse API to the JOSN expected by the jstree component
                    dataFilter : function (data, type) {
                        if (type == "json") {
                            //Convert to Json object to allo addition of custom Object
                                var jsonObj = JSON.parse(data);

                                for (var i = 0; i < jsonObj["entries"].length; i++) {

                                    //jstree specific values
                                    jsonObj["entries"][i]["id"] = jsonObj["entries"][i]["name"];
                                    jsonObj["entries"][i]["text"] = jsonObj["entries"][i]["name"];
                                    if (jsonObj["entries"][i]["type"] === "DIRECTORY") {
                                        jsonObj["entries"][i]["children"] = true;
                                    } else {
                                        jsonObj["entries"][i]["children"] = false;
                                    }

                                    jsonObj["entries"][i]["state"] = "closed";
                                }
                                data = JSON.stringify(jsonObj["entries"]);
                        }
                        return data;
                    },
                    error : function(xhr, statusText, err) {
                        alert("ERROR while cgetting browse info. Error " + xhr.status + " "+ err);
                    }
                }
            }
        }
    }
    
    return exports;
})(JSTreeAnywhereBrowser || {});