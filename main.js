var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        resizable: true
    });

    mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
    mainWindow.setFullScreen(true);
});

var ipc = require('ipc');

ipc.on('close-main-window', function () {
    app.quit();
});
