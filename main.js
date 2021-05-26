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
    console.log(result, "resss");
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

ipcMain.on("api_call", async (event, filepath, angles, areas, heightCeiling, heightDetection) => {
  const axios = require('axios');
  const FormData = require("form-data")

  var formData = new FormData(filepath)
  let fs = require ("fs")
  fs.readFile(filepath, (err, data) =>{
    if(err){console.log(err, "error handling fike");}
    formData.append("floorplan",data ,filepath);
  })

  console.log(filepath, angles, areas, heightCeiling, heightDetection, "args in the back");
  

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
        console.error({err}, " rroeeererrror");
        // console.error({err});
    });
  // axios({
  //   method: 'post',
  //   url: 'http://127.0.0.1:5000/plan/parse',
  //   headers: {
  //     'accept':
  //     'Content-Type': 'multipart/form-data'
  //   },
  //   data: {
  //     formData
  //   }
  // }).then((response) => {
  //   console.log(response, " resonses");
  // }, (error) => {
  //   console.log(error, "error");
  // });


  // const request = net.request({
  //   method: 'POST',
  //   protocol: 'http:',
  //   hostname: '127.0.0.1',
  //   path: '/plan/parse',
  //   redirect: 'follow',
  //   // body: {"floorplan": filepath}
  // });

  // request.write({"test": "test"})

  // request.on('response', (response) => {
    
  //   console.log(`STATUS: ${response.statusCode}`);
  //   console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
  //   response.on('data', (chunk) => {
  //     console.log(`BODY: ${chunk} eeeeeee`)
  //   });

  // });
  // request.on('error', (error) => {
  //   console.log(`ERROR: ${JSON.stringify(error)}`)
  // });
  // // request.write()s
  // // request.setHeader('Content-Type', 'application/json');

  // request.end();
  // const win = BrowserWindow.getFocusedWindow();
  // console.log(app.getPath('downloads'), arg,  "path");
  // await download(win, "http://httpbin.org/image/png",
  // {onCompleted: (info)=>  {event.sender.send("call_finished", info)},
  // filename: "optimized_" + arg.split(".")[0]+".png" })

});


// const menu = [
//   {
//     label: 'Files',
//     submenu: [
//       {
//         label: 'Add file',
//         click: async () => {
//           console.log("test");
//         }
//       },
//     ]
//   }
// ]

// const builtmenu = Menu.buildFromTemplate(menu)
// Menu.setApplicationMenu(builtmenu)

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