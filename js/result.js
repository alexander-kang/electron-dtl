// result.js

const successCloseButton = document.getElementById('success-close-button')
successCloseButton.onclick = function() {
    window.close()
}

const failureCloseButton = document.getElementById('failure-close-button')
failureCloseButton.onclick = function() {
    window.close()
}
