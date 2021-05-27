const { default: axios } = require('axios');
const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog, net, clipboard, Tray } = require('electron')
const { download } = require('electron-dl');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // Load the index.html of the app.
  win.loadFile('./index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
}

ipcMain.on("upload", (event, arg) => {

  const options = {
    title: 'Open a JPG file',
    defaultPath: '/path/to/something/',
    buttonLabel: 'OK',
    filters: [
      { name: 'jpg', extensions: ['jpg'] }
    ],
    properties: ['showHiddenFiles'],
    message: 'This message will only be shown on macOS'
  };

  dialog.showOpenDialog(null, options
  ).then(result => {
    // console.log(result, "resss");
    return result.canceled || event.sender.send("upload_finished", result.filePaths)

  }).catch(err => {
    // IF SOME ERROR OCCURED.
    console.log(err)
  })
});


// ipcMain.on("api_call", (event, arg) => {
//   console.log("api call here");

//   console.log(await download(win, url));

//   const request = net.request({
//     method: 'GET',
//     protocol: 'http:',
//     hostname: 'httpbin.org',
//     path: '/image/png',
//     // redirect: 'follow'
//   });

//   request.on('response', (response) => {
//     console.log(`STATUS: ${response} ${response.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(response.headers)}`);

//     response.on('data', (chunk) => {
//       console.log(`BODY: ${chunk}`)
//     });
//   });
//   request.on('finish', () => {

//     console.log("finished call.")
//     event.sender.send("call_finished")

//   });
//   request.on('abort', () => {
//     console.log('Request is Aborted')
//   });
//   request.on('error', (error) => {
//     console.log(`ERROR: ${JSON.stringify(error)}`)
//   });
//   request.on('close', (error) => {
//     console.log('Last Transaction has occured')
//   });
//   request.setHeader('Content-Type', 'application/json');
//   request.end();

// });

ipcMain.on("optimize_call", async (event, filepath,  angles, areas, heightCeiling, heightDetection) => {

  
})

ipcMain.on("planParse", async (event, filepath) => {
  const axios = require('axios');
  const FormData = require("form-data")
  let fs = require ("fs")

  var formData = new FormData()
 
  fs.readFile(filepath, (err, data) =>{
    if(err){console.log(err, "error handling fike");}
    // console.log(data,filepath);
    formData.append("floorplan",data ,filepath);
  })

  // console.log("formDatasss",formData, "tetst");
  axios.post('http://127.0.0.1:5000/plan/parse', formData, {
    headers: {
      'accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': `multipart/form-data;`,
    }
  })
    .then(res => {
        console.log({res}, "success");
    }).catch(err => {
      // console.log(err, "error");
        app.quit()
    });
  
});

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})