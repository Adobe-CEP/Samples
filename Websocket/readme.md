## What this sample is
This sample extension shows you how to use websocket to communicate between a standalone server and a panel. The `server` folder inside of this sample is a standalone node.js server that needs to be run separately from the panel.

## What Adobe host apps this sample supports
- Photoshop
- Illustrator
- Premier Pro

## How to get started
### Move the `Websocket` folder to the extension folder
Note that the extension folder location is different depending on which OS you use. See [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_8.x/Documentation/CEP%208.0%20HTML%20Extension%20Cookbook.md#extension-folders) for more details.

### Server npm install
```
cd server && npm install
```
### Open the extension in Photoshop
```
Photoshop -> Window -> Extensions -> Websocket
```
### Run the server
```
node main.js
```
### Connect to the socket client in your browser
```
http://localhost:8000
```
### Type ExtendScript commands in your browser
```
// For example,
app.activeDocument.close()
```