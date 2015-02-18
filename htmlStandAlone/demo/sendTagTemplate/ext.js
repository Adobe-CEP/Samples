var csInterface = null;
var selectEnabled = true;
var selectedItemInfoList = null;

function onLoaded() {	

	csInterface = new CSInterface();
	loadJSX();

    csInterface.addEventListener("com.adobe.host.notification.SendTagTemplateStatus", sendTagTemplateStatus); 
    
    $("#import").change(function(evt){
        var files = evt.target.files;
        var reader = new FileReader();
        
       reader.onload = function(){
            $("#tagTemplate").val(this.result);
        };
        
        if (files.length != 0)
        {
            reader.readAsText(files[0]);
        }
    });

	$("#import2").change(function(evt){
        var files = evt.target.files;
        var reader = new FileReader();
        
       reader.onload = function(){
            $("#tagTemplate2").val(this.result);
        };
        
        if (files.length != 0)
        {
            reader.readAsText(files[0]);
        }
    });
}

function sendTagTemplateStatus(event) 
{
	var xmpContent = event.data;
	console.log("[Response to current work mode status changed event], received data is: %s", xmpContent);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + xmpContent + "\n\n");
	
	var xmlDoc = getXMLDoc(xmpContent);
	if (xmlDoc != null)
	{
		var resultList = parseSendTagTempStatus(xmlDoc);
		$("#result" ).text(resultList["ERROR"]+" failed, "+resultList["OK"]+" succeeded.");
	}
	else
	{
	}
}

function parseSendTagTempStatus(xmlDoc)
{
	var resultList = {'OK':0, 'ERROR':0};
	if (xmlDoc != null)
	{
		var actionResultList = xmlDoc.getElementsByTagName('tagTemplateResult');

		for (var i=0; i<actionResultList.length; i++)
		{
			result = actionResultList[i].getElementsByTagName('result')[0].firstChild.nodeValue;
			
			if (result != null)
			{
				resultList[result] += 1;
			}	
		}
	}

	return resultList;
}

function getXMLDoc(xmlText)
{
	var xmlDoc = null;

	try // Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xmlText);
	}
	catch(e)
	{
		try // Firefox, Mozilla, Opera, etc.
		{
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(xmlText, "text/xml");
		}
		catch(e) {
			console.log("[Error occurred when create a xml object for a string]");
		}
	}

	return xmlDoc;
}

function sendTagTemplate()
{
    var event = new CSEvent("com.adobe.browser.event.SendTagTemplate", "APPLICATION");
	var taskID = newGuid();
	var msgID = newGuid();
	var overwrite = $('input[type="radio"][name="overwrite"]:checked').val();

	var messageXML = '<browserMessage><browserID ID="MediaCollection"/><taskID ID="' + taskID + '"/><msgID ID="' + msgID + '"/><tagTemplateInfoList><tagTemplateInfo><tagTemplateInfoID>'+$("#tagTemplateID").val()+'</tagTemplateInfoID><tagTemplateInfoContent>'+$("#tagTemplate").val()+'</tagTemplateInfoContent></tagTemplateInfo>';
	if ($("#tagTemplateID2").val() != '')
	{
		messageXML += '<tagTemplateInfo><tagTemplateInfoID>'+$("#tagTemplateID2").val()+'</tagTemplateInfoID><tagTemplateInfoContent>'+$("#tagTemplate2").val()+'</tagTemplateInfoContent></tagTemplateInfo>';
	}
	messageXML += '</tagTemplateInfoList>';
	if (overwrite == "true")
	{
		messageXML += '<tagTemplateOption>Overwrite</tagTemplateOption>';
	}
	messageXML += '</browserMessage>';
    console.log("[Send message to Prelude to send metadata]:%s", messageXML);
    event.data = messageXML;
    csInterface.dispatchEvent(event);
	$('#apimessage').val($('#apimessage').val() + "*** [" + (new Date()).toLocaleString() + "] Message from [" + event.type + "] ***\n" + messageXML + "\n\n");
}

function clearTextArea()
{
	$('#apimessage').val("");
}
