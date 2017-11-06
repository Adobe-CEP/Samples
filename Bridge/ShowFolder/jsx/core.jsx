function SetSelectedFolderInContentPanel(path)
{
 var folder = new Folder(path);  
  app.document.thumbnail = new Thumbnail(folder);
 }
