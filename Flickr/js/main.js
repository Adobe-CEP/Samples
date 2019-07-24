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

var FLICKR_API_KEY = 'YOUR_API_KEY';
var MAX_IMAGE_RESULTS = 30;

var lightSpinner = new Spinner({ lines: 30, length: 0, width: 2, radius: 8, corners: 0, color: '#fff', speed: 2, trail: 100, hwaccel: true, className: 'spinner', zIndex: 2e9 }).spin();
var darkSpinner = new Spinner({ lines: 30, length: 0, width: 2, radius: 8, corners: 0, color: '#777', speed: 2, trail: 100, hwaccel: true, className: 'spinner', zIndex: 2e9 }).spin();
var csInterface = new CSInterface();

var cleanFileName = function (name) {
  name = name.split(' ').join('-');
  return name.replace(/\W/g, '');
};

var createTempFolder = function () {
  var tempFolderName = 'com.adobe.flickr.extension/';
  var tempFolder = '/tmp/' + tempFolderName;
  if (window.navigator.platform.toLowerCase().indexOf('win') > -1) {
    tempFolder = csInterface.getSystemPath(SystemPath.USER_DATA) + '/../Local/Temp/' + tempFolderName;
  }
  window.cep.fs.makedir(tempFolder);
  return tempFolder;
};

var downloadAndOpenInPhotoshop = function (url, name, thumb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function (e) {
    if (this.status == 200 || this.status == 304) {
      var uInt8Array = new Uint8Array(this.response);
      var i = uInt8Array.length;
      var binaryString = new Array(i);
      while (i--)
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
      var data = binaryString.join('');
      var base64 = window.btoa(data);

      var downloadedFile = createTempFolder() + name + '.jpg';

      window.cep.fs.writeFile(downloadedFile, base64, cep.encoding.Base64);
      csInterface.evalScript('openDocument("' + downloadedFile + '")');
      $('.container').masonry('remove', thumb);
      $('.container').masonry('reload');
    }
  };
  xhr.send();
};

var addThumbToContainer = function (photo) {
  var img_prefix = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret;
  var thumb_url = img_prefix + '_m.jpg';
  var real_image_url = img_prefix + '_b.jpg';
  var thumb = $('<div class="thumb"><div class="overlay"></div><img src="' + thumb_url + '" ></img></div>').appendTo('.container');
  thumb.click(function () {
    var overlay = thumb.find('.overlay');
    thumb.addClass('downloading');
    overlay.append($(lightSpinner.el).clone());
    overlay.show();
    downloadAndOpenInPhotoshop(real_image_url, cleanFileName(photo.title), thumb);
  })
};

var setupMasonry = function () {
  var gutterWidth = 2;
  $('.container').masonry({
    isAnimated: true,
    itemSelector: '.thumb',
    gutterWidth: gutterWidth,
    columnWidth: function (containerWidth) {
      var boxes = Math.ceil(containerWidth / 150);
      var totalGutterSpace = (boxes - 1) * gutterWidth;
      var boxWidth = Math.floor((containerWidth - totalGutterSpace) / boxes);
      $('.thumb').width(boxWidth);
      return boxWidth;
    }
  });
}

var searchFlickr = function (query) {
  var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
  url += '&api_key=' + FLICKR_API_KEY;
  url += '&text=' + query;
  url += '&license=1%2C2%2C3%2C4%2C5%2C6%2C7&format=json&nojsoncallback=1';

  $('.loading-spinner').show();
  $('.container').hide();
  $('.container').empty();
  $.getJSON(url, function (response) {
    $.each(response.photos.photo, function (i, photo) {
      if (i >= MAX_IMAGE_RESULTS) {
        return;
      }
      addThumbToContainer(photo);
    });

    $('.container').imagesLoaded(function () {
      setupMasonry();
      $('.container').fadeIn('slow');
      $('.container').masonry('reload');
      $('.loading-spinner').hide();
    });
  });
};

var main = function () {
  $('.search-box').keypress(function (e) {
    if (e.which == 13) { // enter
      searchFlickr($('.search-box').val());
    }
  });

  $('.loading-spinner').append(darkSpinner.el);

  searchFlickr($('.search-box').attr('placeholder'));
  $('.search-box').focus();
};
main();

