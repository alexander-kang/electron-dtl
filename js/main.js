// main.js

// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const fse = require('fs-extra')
const path = require('path')

// Was getting some bugs with hardware acceleration on and figured it wasn't worth the hassle
app.disableHardwareAcceleration()

// Internal states
var labs // 0: Bodeen, 1: MSE, 2: ChBe, 3: Segal, 4: MCC
var srcPath // Full absolute file path to copy from
var dstPath // Absolute file path to copy to but doesn't have the file names in there yet

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

// Catch src file command from renderer via IPC, open corresponding dialog, and send data back
ipcMain.on('srcOpenDialogFile', function(event) {
    const dialogRet = dialog.showOpenDialogSync({
        properties: ['openFile']
    })
    if (dialogRet) {
        event.sender.send('srcSelectedFile', dialogRet)
    }
})

// Catch src folder command from renderer via IPC, open corresponding dialog, and send data back
ipcMain.on('srcOpenDialogFolder', function(event) {
    const dialogRet = dialog.showOpenDialogSync({
        properties: ['openDirectory']
    })
    if (dialogRet) {
        event.sender.send('srcSelectedFolder', dialogRet)
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
// Then, perform the necessary file copies
ipcMain.on('formSubmission', function (event, formLabs, formSrcPath, formDstPath) {
    // Setting internal states
    labs = formLabs
    srcPath = formSrcPath
    dstPath = formDstPath
    
    // Check if Bodeen is being worked on
    if (labs[0]) {
        // Copy files to all the Bodeen systems
        // TODO!!
    }
    if (labs[1]) {
        // Copy files to all the MSE systems
        // TODO!!
    }
})

// After Electron initialized and is ready, create the browser window
app.whenReady().then(() => {
    createWindow()
})

// Quit when all windows are closed, regardless of OS
app.on('window-all-closed', () => {
    app.quit()
})
