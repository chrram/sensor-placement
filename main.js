const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog } = require('electron')

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
      
      return result.canceled || event.sender.send("btnclick-task-finished", result.filePaths)

  }).catch(err => {
    // IF SOME ERROR OCCURED.
    console.log(err)
  })
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


