// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const path = require('path')

app.disableHardwareAcceleration()

var labs

// Creates the browser window and loads index.html
const createWindow = () => {
    const win = new BrowserWindow({
        // Sets icon of window
        icon: 'nu.jpeg',
        // Hide the menu bar from the window
        autoHideMenuBar: true,
        // Make the window non-resizable
        resizable: false,
        // Dimensions of window
        width: 800,
        height: 700,
        // Preload from preload.js
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Load index.html
    win.loadFile('pages/index.html')
}

// Catch src command from renderer via IPC, open corresponding dialog, and send data back
ipcMain.on('srcOpenDialog', function(event) {
    const dialogRet = dialog.showOpenDialogSync({
        properties: ['openFile']
    })
    if (dialogRet) {
        event.sender.send('srcSelected', dialogRet)
    }
})

// Catch dst command from renderer via IPC, open corresponding dialog, and send data back
ipcMain.on('dstOpenDialog', function(event) {
    const dialogRet = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    })
    if (dialogRet) {
        event.sender.send('dstSelected', dialogRet)
    }
})

// Catching form submission data from renderer via IPC and storing it in internal states
ipcMain.on('formSubmission', function (event, formLabs) {
    labs = formLabs
})

// After Electron initialized and is ready, create the browser window
app.whenReady().then(() => {
    createWindow()
})

// Quit when all windows are closed, regardless of OS
app.on('window-all-closed', () => {
    app.quit()
})
