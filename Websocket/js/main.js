var csInterface = new CSInterface();
var socket = io.connect('http://localhost:8080');

socket.on('toExtension', function (command) {
  csInterface.evalScript(command);
  //try typing app.activeDocument.close() in the browser
});