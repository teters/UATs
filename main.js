const { app, BrowserWindow, ipcMain, shell } = require('electron');
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

  win.loadFile(path.join(__dirname, 'uats-app', 'build', 'index.html'));
  win.webContents.openDevTools(); // temporal


  ipcMain.on('run-command', (event) => {
    const cmdPath = path.join(process.resourcesPath,'app.asar.unpacked', 'TESTUATCOMPLETED.cmd');
    console.log('[Electron] Ejecutando:', cmdPath);

    exec(`cmd.exe /c "${cmdPath}"`, { windowsHide: false }, (error, stdout, stderr) => {
      console.log('[Electron] Resultado recibido');

      if (error) {
        console.error('[Electron] Error:', error.message);
        return;
      }
      if (stderr) {
        console.error('[Electron] stderr:', stderr);
        return;
      }
      console.log('[Electron] stdout:', stdout);
      event.reply('command-output', `stdout: ${stdout}`);
      

      const csvPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'results.csv');
      shell.openPath(csvPath);

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