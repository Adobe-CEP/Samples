var csInterface = new CSInterface();
var socket = io.connect('http://localhost:8080');

socket.on('toExtension', function (data) {
  csInterface.evalScript(data);
});