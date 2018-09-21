## What this sample is
The extension replicates the behavior and UI of the Dissolve Filter Plug-in that's part of the Adobe Photoshop SDK (C++). C++ plugins are usually better choice because of performance and native smart filter support and other features. On the other hand, JavaScript might be much easier for developers.

The extension is split in 3 main components that communicate between each other via CEP events. Two of these components (UI and ApplyFilter) are bundled together which means they can share `manifest.xml` and `.debug`. Anyway bundling is not mandatory to get CEP events to work.

### Components
- **SimpleDissolve.jsx**
	- Adds the menu item "Simple Dissolve Extension…" under the Filter menu (Not the Window)
	- When the the menu item "Simple Dissolve Extension…" is executed
		- Creates a preview of the current document that will be used by the "SimpleDissolve.UI" extension dialog.
		- Send a CEP event to display the SimpleDissolve.UI (extension) dialog

- **SimpleDissolve.UI** extension  provides a dialog that displays the current document preview, color options and the dissolved percentage. When the user Clicks the "OK" button the extension gives the control to the "SimpleDissolve.ApplyFilter" extension.

- **SimpleDissolve.ApplyFilter** extension is an invisible extension that applies the filter to the current document based on the options chosen by the user in the SimpleDissolveUI dialog.

## What Adobe host apps this sample supports
- Photoshop

## How to get started
### Move `SimpleDissolve.jsx` file from `SimpleDissolveScript` folder to the Photoshop's Scripts folder
```
cd SimpleDissolveScript
```
```
cp * /Applications/Adobe\ Photoshop\ CC\ 2018/Presets/Scripts
```
### Move extension (`SimpleDissolve`) to the extension folder
Note that the extension folder location is different depending on which OS you use. See [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#extension-folders) for more details.

### Restart Photoshop and launch
```
Filter -> Simple Dissolve Extension...
```




