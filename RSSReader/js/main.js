/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2014 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

var http = require('http');
var FeedParser = require('feedparser');
var Mustache = require('mustache');

var feedUrl = "http://feeds.bbci.co.uk/news/rss.xml";
//var feedUrl = "http://blogs.adobe.com/indesignsdk/feed/";

$(function() {	
	//localStorage.setItem("url", "http://feeds.bbci.co.uk/news/rss.xml");
	
	// set default feed URL if not set before..
	/*
	if (localStorage.getItem("url") == null) {
		localStorage.setItem("url", "http://feeds.bbci.co.uk/news/rss.xml");
	}
	*/
	
	/*
	// handler for options page form submit..
	$("#options_form").submit(function( event ) {
	  	var url = $("input:first").val();
	  	localStorage.setItem("url", url);
		
		// remove old detail pages..
		$('div').each(function() {
			if ($(this).attr('id') != undefined && $(this).attr('id').match(/detail_/)) {
			  	$(this).remove();
			}
		});
	
		// reload feed now the url has changed..
	  	fetchFeed();
	  
	  	//event.preventDefault();
	});	
	
	// set url text field in options page to be current URL
	$("#url").val(localStorage.getItem("url"));
	*/
	
	// load feed..
	fetchFeed();
});

function fetchFeed() {
	$.mobile.loading('show');

	var items = [];
	http.get(feedUrl, function(res) {

		if (res.statusCode == '200')
		{			
			res.pipe(new FeedParser({}))
	            .on('error', function(error){
	                alert("FeedParser Error");
	            })
	            .on('meta', function(meta) {
	                // TODO
	            })
	            .on('readable', function() {
	                var stream = this, item;
	                while (item = stream.read()) {
	                    items.push(item);
	                }  
	            })
	            .on('end', function() {				
					$("#item_list").empty();
					var $homePage = $("#home").clone();
											
					$.each(items, function(i, item) {
						// add item to list of items..
						$("#item_list").append($('<li></li>').html('<a href="#detail_' + i + '">' + item.title + '</a>'));
						//$homePage.find("#item_list").append($('<li></li>').html('<a href="#detail_' + i + '">' + item.title + '</a>'));
					
		            	// create a detail page for the item
		            	$.get('../templates/detail_page.mustache', function(template) { 
						
						    var templateData = {
								id: "detail_" + i,
						    	title: item.title,
						    	date: item.pubDate,
						    	description: item.description,
								link: item.link
						    };

						    $("body").append(Mustache.render($(template).html(), templateData));
						});
						
						//$("#home").replaceWith($homePage);
						$("#item_list").listview("refresh");
					});   
	            });

        } else {
        	alert("Bad HTTP status code: " + res.statusCode);
        }

		$.mobile.loading('hide');

    }).on('error', function(e) {
		$.mobile.loading('hide');
		alert("HTTP Error: " + e.message);
	});	
}