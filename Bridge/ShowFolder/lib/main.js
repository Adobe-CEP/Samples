// Get a reference to a CSInterface object
var csInterface = new CSInterface();	

 function SelectAndSetFolder() {
	
 	var result = window.cep.fs.showOpenDialog(false,true,'Select a Folder',null,null);

 	if (!result.data)
 		return;

 	document.getElementById("response").innerHTML = result.data;
 	
	//This will set the Content panel with the folder selected above
	var script = 'app.document.thumbnail = new Thumbnail("'+ result.data +'");';
   
   //Execute the ExtendScript code 
	csInterface.evalScript(script);
   
}


