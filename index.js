const {ipcRenderer, remote} = require('electron')
const $ = require("jquery")


document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.path)
      }
});
  

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  
document.addEventListener('dragenter', (event) => {
    console.log('File is in the Drop Space');
});
  
document.addEventListener('dragleave', (event) => {
    console.log('File has left the Drop Space');
});


// CODE FOR WHEN THE USER HITS THE SETTINGS BUTTON IN THE OPTIMIZATION UI.
document.querySelector('#settings').addEventListener('click', () => {

    // HIDES THE BUTTONS AND SHOWS THE OPTIMIZATION BOX INSTEAD.
    $( "#optimizationButtons" ).hide( "fast", function() {
        $( ".optimizationFrame" ).show( "slow", function() {
            console.log("TOGGLE DONE");
        });
    });

})

// WHEN YOU CLICK THE UPLOAD BUTTON
// document.querySelector('#upload').addEventListener('click', () => {
//     ipcRenderer.send("upload");
// })

ipcRenderer.on('btnclick-task-finished', function(event,param) {
    console.log("finished heree");
    window.close()                                  
 });