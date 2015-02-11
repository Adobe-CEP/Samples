var csInterface = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();

    $("#import").change(function(evt){
        var files = evt.target.files;
        var reader = new FileReader();
        
       reader.onload = function(){
            $("#unassociatedMetadata").val(this.result);
        };
        
        if (files.length != 0)
        {
			$("#metadataID").val(files[0].name);
            reader.readAsText(files[0]);
        }
    });
}

function applyMetadata()
{
    var event = new CSEvent("com.adobe.events.ApplyUnassociatedMetadata", "APPLICATION");
    
    var messageXML = '<unassociatedMetadataList><position>'+$("#position").val()+'</position><unassociatedMetadata><metadataID>'+$("#metadataID").val()+'</metadataID><xmp>'+$("#unassociatedMetadata").val()+'</xmp></unassociatedMetadata></unassociatedMetadataList>';
    console.log("[Send message to Prelude to apply metadata]:%s", messageXML);
    event.data = messageXML;
    csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function sendMetadata()
{
    var event = new CSEvent("com.adobe.events.SendUnassociatedMetadata", "APPLICATION");
        
    var messageXML = '<unassociatedMetadataList><unassociatedMetadata><metadataID>'+$("#metadataID").val()+'</metadataID><xmp>'+$("#unassociatedMetadata").val()+'</xmp></unassociatedMetadata></unassociatedMetadataList>';
    console.log("[Send message to Prelude to send metadata]:%s", messageXML);
    event.data = messageXML;
    csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function clearTextArea()
{
	$('#apimessage').val("");
}
