const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendCommand: (command) => ipcRenderer.send('run-command', command),
  onCommandOutput: (callback) => ipcRenderer.on('command-output', callback),
  runTest: (testFile) => ipcRenderer.invoke('run-single-test', testFile),
});