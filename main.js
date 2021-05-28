const { app, BrowserWindow, Menu, MenuItem, ipcMain, dialog, net, clipboard, Tray, } = require('electron')

const axios = require('axios');
const FormData = require("form-data")
let fs = require("fs")

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 700,
    center:true,
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

ipcMain.on("optimize_call", async (event, sensor_field_of_view, areas, ceiling_height, detection_height) => {

  const loading = new BrowserWindow({
    width: 1200,
    height: 700,
    parent: BrowserWindow.getFocusedWindow(),
    modal: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      center: true,
      resizable: true,
      frame: true,
      transparent: false,
    }
  })

  var html = [
    "<body style='background-color:black; transform: translateX(-50%) translateY(-50%); position: absolute;top: 50%;left: 50%;'>",
    "<h1 style='color:white;'>OPTIMIZING! PLEASE WAIT!</h1>",
    "</body>",
  ].join("");
  loading.loadURL("data:text/html;charset=utf-8," + encodeURI(html))
  loading.show()

  let k = [[[70, 54], [70, 294], [208, 294], [217, 201], [218, 379], [300, 379], [301, 312], [496, 311], [496, 248], [302, 246], [495, 240], [496, 54]], [[505, 54], [504, 238], [613, 240], [615, 54]], [[621, 54], [624, 245], [753, 240], [755, 54]], [[498, 248], [498, 311], [668, 311], [670, 248]], [[681, 251], [681, 309], [753, 309], [753, 251]], [[73, 300], [73, 380], [208, 381], [208, 300]], [[506, 319], [507, 456], [755, 453], [753, 319]], [[351, 320], [354, 387], [385, 388], [385, 453], [498, 456], [496, 319]], [[311, 323], [311, 385], [340, 385], [340, 323]], [[73, 389], [73, 453], [136, 453], [136, 389]], [[151, 389], [151, 453], [208, 453], [208, 389]], [[218, 388], [218, 453], [300, 453], [300, 388]], [[311, 398], [311, 453], [375, 453], [375, 398]]]
  const formData = new FormData();
  formData.append('rooms', JSON.stringify(k));
  formData.append('shape', JSON.stringify([542, 800]));
  formData.append('ceiling_height', 250);
  formData.append('detection_height', 100);
  formData.append('sensors_field_of_view', 90);

  axios.post('http://127.0.0.1:5000/plan/optimize', formData, {
    headers: formData.getHeaders()
  })
    .then(response => {
      loading.hide()
      event.sender.send("optimizing_finished", response.data)
      
    })
    .catch(error => {
      console.log(error, "error");
      app.quit()
    })

})

ipcMain.on("planParse", async (event, filepath) => {


  // const form = new FormData();
  //  const stream = fs.createReadStream(filepath);

  // form.append('image', stream);

  // console.log(form, "FORM DATAAAA");
  // // In Node.js environment you need to set boundary in the header field 'Content-Type' by calling method `getHeaders`
  // const formHeaders = form.getHeaders();
  // // console.log(formHeaders, "formHEADERS");
  // axios.post('http://127.0.0.1:5000/plan/parse', form, {
  //   headers: {
  //     ...formHeaders,
  //   },
  // })
  // .then(response => {

  //   console.log(response, "response")
  // })
  // .catch(error => {
  //   // console.log(error, "errorrrr");
  //   // app.quit()
  // })

  // console.log("formDatasss",formData, "tetst");
  //   axios.post('http://127.0.0.1:5000/plan/parse', formData, {
  //     // headers: {
  //     //   'accept': 'application/json',
  //     //   'Accept-Language': 'en-US,en;q=0.8',
  //     //   'Content-Type': `multipart/form-data;`,
  //     // }

  //     headers: formData.getHeaders()
  //   })
  //     .then(res => {
  //         console.log({res}, "success");
  //     }).catch(err => {
  //       // console.log(err, "error");
  //         app.quit()
  //     });

  // });
})

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