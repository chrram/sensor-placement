const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog, net, clipboard, Tray } = require('electron')
const {download} = require('electron-dl');

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 400,
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
    title: 'Open a PDF file',
    defaultPath: '/path/to/something/',
    buttonLabel: 'OK',
    filters: [
      { name: 'pdf', extensions: ['pdf'] }
    ],
    properties: ['showHiddenFiles'],
    message: 'This message will only be shown on macOS'
  };

  dialog.showOpenDialog(null, options
  ).then(result => {

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

ipcMain.on("api_call", async (event) => {

  const win = BrowserWindow.getFocusedWindow();
  console.log(await download(win, "http://httpbin.org/image/png",{saveAs:"png"}));
  
});


const menu = [
  {
    label: 'Files',
    submenu: [
      {
        label: 'Add file',
        click: async () => {
          console.log("test");
        }
      },
    ]
  }
]

const builtmenu = Menu.buildFromTemplate(menu)
Menu.setApplicationMenu(builtmenu)

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