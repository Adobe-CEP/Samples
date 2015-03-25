INTRODUCTION
The extension replicates the behavior and UI of the Dissolve Filter Plug-in that's part of the Adobe Photoshop SDK.
The extension is split in 3 main components that communicate between each other via CEP events.

Components:
1 - SimpleDissolve.jsx
	• Installs the menu item "Simple Dissolve Extension…" under the Filter menu (Not the Window )
	• When the the menu item "Simple Dissolve Extension…" is executed
		Creates a preview of the current document that will be used by the "SimpleDissolveUI" extension dialog.
		Send a CEP event to display the SimpleDissolveUI (extension) dialog

2 - SimpleDissolveUI extension
The SimpleDissolveUI extension provides a dialog that displays the current document preview, color options and the dissolved percentage.
When the user Clicks the "OK" button the extension gives the control to the SimpleDissolveApplyFilter Extension.

3 - SimpleDissolveApplyFilter Extension
SimpleDissolveApplyFilter is an invisible extension that applies the filter to the current document based on the options chosen by the user in the SimpleDissolveUI dialog.
