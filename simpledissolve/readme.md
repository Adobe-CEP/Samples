## What this sample is
The extension replicates the behavior and UI of the Dissolve Filter Plug-in that's part of the Adobe Photoshop SDK.
The extension is split in 3 main components that communicate between each other via CEP events.

### Components
- SimpleDissolve.jsx
	- Installs the menu item "Simple Dissolve Extension…" under the Filter menu (Not the Window)
	- When the the menu item "Simple Dissolve Extension…" is executed
		- Creates a preview of the current document that will be used by the "SimpleDissolveUI" extension dialog.
		- Send a CEP event to display the SimpleDissolveUI (extension) dialog

- SimpleDissolveUI extension
The SimpleDissolveUI extension provides a dialog that displays the current document preview, color options and the dissolved percentage.
When the user Clicks the "OK" button the extension gives the control to the SimpleDissolveApplyFilter Extension.

- SimpleDissolveApplyFilter Extension
SimpleDissolveApplyFilter is an invisible extension that applies the filter to the current document based on the options chosen by the user in the SimpleDissolveUI dialog.

## What Adobe host apps this sample supports
- Photoshop

## How to get started
### Move both `.jsx` files from `SimpleDissolveUI` folder to the Photoshop's Scripts folder
```
cd SimpleDissolveScripts
```
```
cp * /Applications/Adobe\ Photoshop\ CC\ 2018/Presets/Scripts
```
### Move both extensions (`SimpleDissolveUI` and `SimpleDissolveApplyFilter`) to the extension folder
Note that the extension folder location is different depending on which OS you use. See [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#extension-folders) for more details.

### Launch
```
Filter -> Simple Dissolve Extension...
```




