const { app, BrowserWindow, Menu, MenuItem } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}


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