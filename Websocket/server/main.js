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
var fs = require('fs');
var io = require('socket.io').listen(8080);

var sockets = [];

io.sockets.on('connection', function (socket) {
  sockets.push(socket)
  socket.on('fromWebsite', function (data) {
    for (var i = 0; i < sockets.length; i++) {
      sockets[i].emit('toExtension', data);
    }
  });
});

fs.readFile('./index.html', function (err, html) {
  if (err) {
    throw err;
  }
  http.createServer(function (request, response) {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(html);
    response.end();
  }).listen(8000);
});