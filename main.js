const { app, BrowserWindow } = require('electron');
const path = require('path');
 
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            //preload: path.join(__dirname, 'preload.js'), // Si usas un preload
            contextIsolation: true,
        },
    });
 
    win.loadURL('http://localhost:3000'); // Cargar la app de React
 
    win.webContents.openDevTools();
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