import React, { useEffect } from 'react';
import './App.css';

function App() {
  const runCommand = () => {
    window.electron.sendCommand('TESTUATCOMPLETED.cmd');
  };

  useEffect(() => {
    window.electron.onCommandOutput((event, output) => {
      console.log(output); // Manejar la salida del comando
    });
  }, []);

  return (
    <div className="app"><h1 className="title">WAN User Acceptance Tests</h1><button className="run-button" onClick={runCommand}>RUN</button></div>
  );
}

export default App;