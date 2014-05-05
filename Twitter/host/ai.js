var counter = 1;

var openDocument = function(path) {
  app.open(File(path));
};

var moveLayerUp = function(layerName) {
  var layer = app.activeDocument.layers[layerName];
  var pageItem = layer.pageItems[0];
  pageItem.translate(0, 20);
};