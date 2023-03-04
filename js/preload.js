// preload.js

// Note: All Node.js APIs are available here

// Note: this won't wait for stylesheets, images, or subframes to load
// After index.html has been completely loaded and parsed, do the following:
window.addEventListener('DOMContentLoaded', () => {
    // Helper function to replace text from index.html with something else
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    // // Replace the versions in index.html's body with the actual version number
    // for (const dependency of ['chrome', 'node', 'electron']) {
    //   replaceText(`${dependency}-version`, process.versions[dependency])
    // }
  })
