## What this sample is
This sample extension shows you how to use websocket to communicate between a standalone server and a panel. The `server` folder inside of this sample is a standalone node.js server that needs to be run separately from the panel.

## What Adobe host apps this sample supports
- Photoshop
- Illustrator
- Premier Pro

## How to get started
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