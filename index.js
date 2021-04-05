const { createWindow } = require('./main')
const { app } = require('electron')

require('./ddbb');

app.whenReady().then(createWindow);
app.allowRendererProcessReuse = false