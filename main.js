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

}

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

ipcMain.handle('run-single-test', async (event, testFile) => {
  const cmdPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'tests', testFile);
  const ext = path.extname(testFile);

  // Si es .cmd, ejecutarlo con exec

  if (ext === '.cmd') {
    try {
      const { stdout } = await execPromise(`cmd.exe /c "${cmdPath}"`);
      const output = stdout.trim().split('\n').pop(); // toma última línea
      return output || `${testFile.replace('.cmd', '')},PASS`;
    } catch (err) {
      return `${testFile.replace('.cmd', '')},FAIL`;
    }
  }

  // Si es .js (test Puppeteer), requerir el módulo y ejecutarlo
  
  if (ext === '.js') {
    try {
      const testPath = path.join(__dirname, 'tests', testFile);
      const testFunction = require(testPath);
      const result = await testFunction();
      return result; // e.g. "Internet,PASS"
    } catch (err) {
      console.error(`Error en ${testFile}:`, err);
      return `${testFile.replace('.js', '')},FAIL`;
    }
  }

  return `${testFile},UNKNOWN`;
    
  
});

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, { windowsHide: false }, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
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