const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false, // Desactivar para mayor seguridad
      preload: path.join(__dirname, 'preload.js'), // Usar un archivo preload
    },
  });

  win.loadURL('http://localhost:3000'); // Cargar la app de React

  ipcMain.on('run-command', (event) => {
    exec('TESTUATCOMPLETED.cmd', (error, stdout, stderr) => {
      if (error) {
        event.reply('command-output', `Error: ${error.message}`);
        return;
      }
      if (stderr) {
        event.reply('command-output', `stderr: ${stderr}`);
        return;
      }
      event.reply('command-output', `stdout: ${stdout}`);
    });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});