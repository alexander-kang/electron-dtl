// renderer.js

// Global variables
var srcPath // File path to copy from
var dstPath // File path to copy to

// Send form data to IPC
const ipcRenderer = require('electron').ipcRenderer
const submit = document.getElementById('submit')
submit.onclick = function() {
    // Stores what labs they're working on in an array of booleans
    let bodeen = document.getElementById('lab1').checked
    let mse = document.getElementById('lab2').checked
    let chbe = document.getElementById('lab3').checked
    let segal = document.getElementById('lab4').checked
    let mcc = document.getElementById('lab5').checked
    let labs = [bodeen, mse, chbe, segal, mcc]

    // Checking that the user gave input for all the fields
    let labsInputEmpty = true
    for (let i = 0; i < labs.length; ++i) {
        if (labs[i] == true) {
            labsInputEmpty = false
        }
    }
    if (labsInputEmpty || !srcPath || !dstPath) {
        document.getElementById('form-error-text').innerHTML = "You must respond to every field of this form!"
    }
    // If everything looks fine, send the form off to IPC 
    else {
        document.getElementById('form-error-text').innerHTML = ""
        ipcRenderer.send('formSubmission', labs, srcPath, dstPath)
    }
}

// Runs when the file browse button on the local source path is pressed
// Opens the file browser by sending a command to main over IPC
const srcButtonFile = document.getElementById('src-button-file')
srcButtonFile.addEventListener('click', function(event) {
    ipcRenderer.send('srcOpenDialogFile')
})
ipcRenderer.on('srcSelectedFile', function(event, path) {
    document.getElementById('src-file-box').innerHTML =
    `<div id="src-file-box">
        Select the file to be transferred:<br>
        <div class="button-box">
            <button type="button" id="src-button-file">Select</button>
            <p id="src-path-file"></p>
        </div>
    </div>`
    document.getElementById('src-path-file').innerHTML = path
    document.getElementById('src-folder-box').innerHTML = ""
    srcPath = path
})

// Runs when the folder browse button on the local source path is pressed
// Opens the file browser by sending a command to main over IPC
const srcButtonFolder = document.getElementById('src-button-folder')
srcButtonFolder.addEventListener('click', function(event) {
    ipcRenderer.send('srcOpenDialogFolder')
})
ipcRenderer.on('srcSelectedFolder', function(event, path) {
    document.getElementById('src-path-folder').innerHTML = path
    document.getElementById('src-file-box').innerHTML = ""
    srcPath = path
})

// Runs when the browse button on the remote destination path is pressed
// Opens the file browser by sending a command to main over IPC
const dstButton = document.getElementById('dst-button')
dstButton.addEventListener('click', function(event) {
    ipcRenderer.send('dstOpenDialog')
})
ipcRenderer.on('dstSelected', function(event, path) {
    document.getElementById('dst-path').innerHTML = path[0].substring(path[0].indexOf("$") - 1)
    dstPath = path
})
