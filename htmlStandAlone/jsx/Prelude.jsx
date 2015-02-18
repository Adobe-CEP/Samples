$._ext_PPRO={
    setMetadata : function(namespace, key, value) {
        return app.metadata.setMetadataValue(namespace, key, value);
    },
    addMarker : function(marker) {
        return app.metadata.addMarker(marker);
    },
    updateMarker : function(marker) {
        return app.metadata.updateMarker(marker);
    },
    deleteMarker : function(marker) {
        return app.metadata.deleteMarker(marker);
    },
	getAppSystemPrefPath : function() {
		var path = app.getAppSystemPrefPath;
		return path;
	},
    deleteAsset : function(path) {
        return app.project.deleteAsset(path);
    },
};