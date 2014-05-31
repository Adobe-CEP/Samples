(function () {
    'use strict';

    var csInterface = new CSInterface();
    var gExtensionId = "com.adobe.persistent";

    function Persistent(inOn) {

        if (inOn){
            var event = new CSEvent("com.adobe.PhotoshopPersistent", "APPLICATION");
        } else {
            var event = new CSEvent("com.adobe.PhotoshopUnPersistent", "APPLICATION");
        }
        event.extensionId = gExtensionId;
        csInterface.dispatchEvent(event);
    }

    function init() {

        themeManager.init();

        $('#persistenceSwitch').change(function() {
            Persistent( $(this).is(':checked') );
        });
    }

    init();

}());