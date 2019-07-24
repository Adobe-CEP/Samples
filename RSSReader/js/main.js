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

var http = require('http');
var FeedParser = require('feedparser');
var Mustache = require('mustache');

var feedUrl = "http://feeds.bbci.co.uk/news/rss.xml";
//var feedUrl = "http://blogs.adobe.com/indesignsdk/feed/";

$(function () {
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
	http.get(feedUrl, function (res) {

		if (res.statusCode == '200') {
			res.pipe(new FeedParser({}))
				.on('error', function (error) {
					alert("FeedParser Error");
				})
				.on('meta', function (meta) {
					// TODO
				})
				.on('readable', function () {
					var stream = this, item;
					while (item = stream.read()) {
						items.push(item);
					}
				})
				.on('end', function () {
					$("#item_list").empty();
					var $homePage = $("#home").clone();

					$.each(items, function (i, item) {
						// add item to list of items..
						$("#item_list").append($('<li></li>').html('<a href="#detail_' + i + '">' + item.title + '</a>'));

						// create a detail page for the item
						$.get('../templates/detail_page.mustache', function (template) {

							var templateData = {
								id: "detail_" + i,
								title: item.title,
								date: item.pubDate,
								description: item.description,
								link: item.link
							};

							$("body").append(Mustache.render($(template).html(), templateData));
						});

						$("#item_list").listview("refresh");
					});
				});

		} else {
			alert("Bad HTTP status code: " + res.statusCode);
		}

		$.mobile.loading('hide');

	}).on('error', function (e) {
		$.mobile.loading('hide');
		alert("HTTP Error: " + e.message);
	});
}