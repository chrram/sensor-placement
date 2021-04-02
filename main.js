const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron')

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


ipcMain.on("upload", function (event, arg) {
  //create new window
  let newWindow = new BrowserWindow({
    width: 450,
    height: 300,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });  // create a new window
  
  newWindow.loadFile('./optimize.html')
  newWindow.webContents.openDevTools()
  // inform the render process that the assigned task finished. Show a message in html
  // event.sender.send in ipcMain will return the reply to renderprocess
 
  event.sender.send("btnclick-task-finished", "yes");
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


