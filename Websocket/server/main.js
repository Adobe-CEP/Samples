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
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});