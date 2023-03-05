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
var dstPath // Absolute file path to copy to but doesn't have final parts in there yet
            // Ex: if you're trying to copy a file called test.txt, dstPath is missing the final \test.txt

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

    // Get the local remote destination path
    // Ex: `C:\Users\...` rather than `\\bodeen-01.mcc.northwestern.edu\C:\Users\...`
    dstPath = dstPath.substring(dstPath.indexOf(":") - 1)

    // Add the file/folder name to the end of the destination path
    dstPath += srcPath.substring(srcPath.lastIndexOf("\\"))
    
    // Right half of template
    const templateRight = ".mcc.northwestern.edu\\"
    // Check if Bodeen is being worked on
    if (labs[0]) {
        // Left half of template for Bodeen
        const bodeenTemplateLeft = "\\\\bodeen-0"
        // Copy files to all 5 of the Bodeen systems
        for (let i = 1; i < 6; ++i) {
            // Put everything together to get the final destination path
            let combinedBodeenDstPath = bodeenTemplateLeft + i + templateRight + dstPath
            // Need to catch error if any occurs and report it to user
            try {
                fse.copySync(srcPath, combinedBodeenDstPath)
            } catch(err) {
                event.sender.send('copyError', err)
            }
        }
    }
    // Check if MSE is being worked on
    if (labs[1]) {
        // Left half of template for MSE
        const mseTemplateLeft = "\\\\mse-0"
        // Copy files to all 7 of the MSE systems
        for (let i = 1; i < 8; ++i) {
            // Put everything together to get the final destination path
            let combinedMSEDstPath = mseTemplateLeft + i + templateRight + dstPath
            // Need to catch error if any occurs and report it to user
            try {
                fse.copySync(srcPath, combinedMSEDstPath)
            } catch(err) {
                event.sender.send('copyError', err)
            }
        }
    }
    // Check if ChBe is being worked on
    if (labs[2]) {
        // Left half of template for ChBe
        const chbeTemplateLeft = "\\\\e1-chbe-0"
        // Copy files to all 8 of the ChBe systems
        for (let i = 1; i < 9; ++i) {
            // Put everything together to get the final destination path
            let combinedChBeDstPath = chbeTemplateLeft + i + templateRight + dstPath
            // Need to catch error if any occurs and report it to user
            try {
                fse.copySync(srcPath, combinedChBeDstPath)
            } catch(err) {
                event.sender.send('copyError', err)
            }
        }
    }
    // Check if Segal is being worked on
    if (labs[3]) {
        // Left half of template for Segal
        const segalTemplateLeft = "\\\\e1-segal-0"
        // Copy files to all 7 of the Segal systems
        for (let i = 1; i < 8; ++i) {
            // Put everything together to get the final destination path
            let combinedSegalDstPath = segalTemplateLeft + i + templateRight + dstPath
            // Need to catch error if any occurs and report it to user
            try {
                fse.copySync(srcPath, combinedSegalDstPath)
            } catch(err) {
                event.sender.send('copyError', err)
            }
        }
    }
    // Check if MCC is being worked on
    if (labs[4]) {
        // Left half of template for Segal
        const mccTemplateLeft = "\\\\e1-mcc-0"
        // Copy files to all 26 of the MCC systems
        for (let i = 1; i < 27; ++i) {
            // Put everything together to get the final destination path
            let combinedMCCDstPath = mccTemplateLeft + i + templateRight + dstPath
            // Need to catch error if any occurs and report it to user
            try {
                fse.copySync(srcPath, combinedMCCDstPath)
            } catch(err) {
                event.sender.send('copyError', err)
            }
        }
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
