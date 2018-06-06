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