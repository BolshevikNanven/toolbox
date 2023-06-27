const { app, ipcMain, Menu } = require('electron');
const { PARAMS, VALUE, MicaBrowserWindow, IS_WINDOWS_11 } = require('mica-electron');
const path = require('path');
const isDev = require('electron-is-dev');

const { firstLoad, getCalendarData, editCalendarData, getTodoData, editTodoData } = require('./lib/files');

//Menu.setApplicationMenu(null);
app.on('ready', async () => {

  const mainWindow = new MicaBrowserWindow({
    width: 1156,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
      nodeIntegrationInWorker: true,
      webSecurity: false
    }
  })
  isDev ? mainWindow.loadURL("http://localhost:3000/") : mainWindow.loadFile(path.join(__dirname, 'index.html'))
  //mainWindow.loadFile(path.join(__dirname, 'index.html'))

  mainWindow.setMicaEffect();

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show();
    firstLoad();
  });

  ipcMain.handle('getCalendarEvents', async (event, dateLimit) => {
    return getCalendarData();
  })
  ipcMain.handle('editCalendarData', async (event, mode, data) => {
    return editCalendarData(mode, data);
  })
  ipcMain.handle('getTodoData', async (event, mode) => {
    return getTodoData(mode);
  })
  ipcMain.handle('editTodoData', async (event, mode, data) => {
    return editTodoData(mode, data);
  })
})