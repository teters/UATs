import React, { useEffect, useState, useRef } from 'react';
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

  const [formData, setFormData] = useState({
    project: '',
    siteId: '',
    date: '',
    testerName: '',
    siteCategory: '',
    siteHas: [],
    connection: '',
    printing:'',

  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updated = checked
        ? [...prevData.siteHas, value]
        : prevData.siteHas.filter((item) => item !== value);
      return {
        ...prevData,
        siteHas: updated,
      };
    });
  };
  const projectRef = useRef(null);
  const siteIdRef = useRef(null);
  const dateRef = useRef(null);
  const testerNameRef = useRef(null);
  
  
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // evita que se envíe el formulario
      nextRef.current?.focus();
    }
  };

  
  const handleIptCheckboxChange = (index, value) => {
    setIptResults((prev) => {
      const updated = [...prev];
      updated[index] = updated[index] === value ? null : value; // permite desmarcar
      return updated;
    });
  };

  const [iptResults, setIptResults] = useState(Array(9).fill(null));

  const iptOverallResult = iptResults.every(result => result === 'pass') ? 'PASS' : 'FAIL';

  const iptEnabled = formData.siteHas.includes('IPT/FAX') || formData.siteHas.includes('*OneVoice');


  







  return (
    <div className="app">
      <h1 className="title">WAN User Acceptance Tests</h1>
      <div className="paragraphs">
        <p className="description">
            The following tests need to be performed minimum two weeks before the migration for baselining purposes (*) and on the day of migration. Date and 
          time of test to be coordinated by the BASF Regional WAN project manager/coordinator and communicated to the local user who will be performing 
          the test. 
        </p>
        <p className="description">
          Baseline test results should be sent to the Wan project manager before the start of the migration.

        </p>
        <p className="description">
          
          (*) Note: If during the pre-test phase a service or functionality is identified as faulty, it will be documented accordingly. A faulty functionality or 
          service, not related with SDWAN, will be addressed by BASF via the correct channels (for instance, the service desk for an operational service) in 
          order to get it fixed. The list of non-working functionalities/services for a site will be evaluated in the Go/No-go decision of the SDWAN 
          transformation.
          Shall all parties agree to proceed with the transformation, the non-working functionality or service will not be tested but documented as non
          applicable in the UAT.
        </p>
        
        <p className="description">
          Tester will need to be onsite 30 minutes before the test 
        </p>
        
        <p className="description">
          Tester to prepare a BASF notebook with WLAN/LAN connectivity
        </p>
        
        <p className="description">
          Tester to prepare smartphone for MobD testing
        </p>
        
        <p className="description">
          For sites with IPT, please ensure:
        </p>
        
        <p className="description">
          - availability of an IPT phone connected to the LAN port.
        </p>
        
        <p className="description">
          - availability of fax machine connected to fax port.
        </p>
        
        <p className="description">
          - availability of softphone client on PC (MS Teams) in case no hard phones deployed on site.
        </p>
        <p className="description">
          <strong>
            Note: Before going into UAT, BASF tester should make sure that device used for testing (e.g. PC, Laptop, Printer) is reloaded and
            received the new IP address, and global policy via BASF WAN connection.
          </strong>
        </p>
        
      </div>
      <form className="form">
          <h2 className="form-title">Please fill out the following information:</h2>

          <div className="form-group">
            <label htmlFor="project">Project:</label>
            <input 
              ref={projectRef}
              type="text" 
              id="project" 
              name="project" 
              placeholder="Enter project name" 
              value={formData.project} 
              onChange={handleInputChange} 
              onKeyDown={(e)=> handleKeyDown(e,siteIdRef)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="siteId">Site ID:</label>
            <input 
              ref={siteIdRef}
              type="text" 
              id="siteId" 
              name="siteId" 
              placeholder="Enter site ID" 
              value={formData.siteId} 
              onChange={handleInputChange} 
              onKeyDown={(e)=>handleKeyDown(e,dateRef)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input 
              ref={dateRef}
              type="date" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleInputChange}
              onKeyDown={(e)=>handleKeyDown(e,testerNameRef)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="testerName">Tester Name:</label>
            <input
              ref={testerNameRef}
              type="text" 
              id="testerName" 
              name="testerName" 
              placeholder="Enter your name" 
              value={formData.testerName} onChange={handleInputChange}/>
          </div>
          <div className="form-group">
            <label htmlFor="siteCategory">Site Category:</label>
            <select
              id="siteCategory"
              name="siteCategory"
              value={formData.siteCategory}
              onChange={handleInputChange}
            >
              <option value="">Select category</option>
              <option value="Gold">Gold</option>
              <option value="Silver+">Silver+</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Copper">Copper</option>
            </select>
          </div>
          <div className="form-group site-has">
            <label>Site Has:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="siteHas"
                  value="WAN"
                  checked={formData.siteHas.includes('WAN')}
                  onChange={handleCheckboxChange}
                />
                WAN
              </label>
              <label>
                <input
                  type="checkbox"
                  name="siteHas"
                  value="LAN"
                  checked={formData.siteHas.includes('LAN')}
                  onChange={handleCheckboxChange}
                />
                LAN
              </label>
              <label>
                <input
                  type="checkbox"
                  name="siteHas"
                  value="WLAN"
                  checked={formData.siteHas.includes('WLAN')}
                  onChange={handleCheckboxChange}
                />
                WLAN
              </label>
              <label>
                <input
                  type="checkbox"
                  name="siteHas"
                  value="IPT/FAX"
                  checked={formData.siteHas.includes('IPT/FAX')}
                  onChange={handleCheckboxChange}
                />
                IPT/FAX
              </label>
              <label>
                <input
                  type="checkbox"
                  name="siteHas"
                  value="*OneVoice"
                  checked={formData.siteHas.includes('*OneVoice')}
                  onChange={handleCheckboxChange}
                />
                *OneVoice
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="connection">Select type of connection:</label>
            <select
              id="connection"
              name="connection"
              value={formData.connection}
              onChange={handleInputChange}
            >
              <option value="LAN">LAN</option>
              <option value="WLAN">WLAN</option>
              
              
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="printing">Does printing work?</label>
            <select
              id="printing"
              name="printing"
              value={formData.printing}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              
            </select>
          </div>
    
      </form>
      <div className="table-section">
        <h2 className="form-title">IPT test (only applicable if site has IPT phones/OneVoice)</h2>
        <table className={`ipt-table ${!iptEnabled ? 'disabled' : ''}`}>
          <thead>
            <tr>
              <th>Description</th>
              <th>PASS</th>
              <th>FAIL</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Place an external call to a number you know",
              "From mobile phone, place a call to your own office telephone extension number",
              "Make and Receive an On-net Call (BCN - BASF Corporate Network). Dial access code 8 + location code + extension number",
              "Make and Receive an Inter-cluster call - Place a BCN call to (Please dial 8121200, or 8177750)",
              "Make and Receive Call for New Range in all global major hub sites (Please dial: +49 621 6099550; +32 3 561 3710; +1 800 526 1072 ; +11 2349 1122)",
              "Test Abbreviated dialing (e.g. 7757)",
              "Check EM Login/Logout",
              "Place a fax call to an external fax number",
              "Place a BCN fax call to an internal BASF Fax number:"
            ].map((desc, index) => (
              <tr key={index}>
                <td>{desc}</td>
                <td>
                  <input
                    type="checkbox"
                    disabled={!iptEnabled}
                    checked={iptResults[index] === 'pass'}
                    onChange={() => handleIptCheckboxChange(index, 'pass')}
                  />

                </td>
                <td>
                  <input
                    type="checkbox"
                    disabled={!iptEnabled}
                    checked={iptResults[index] === 'fail'}
                    onChange={() => handleIptCheckboxChange(index, 'fail')}
                  />

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
        The following button automates the following tests:
      </p>

      <button className="run-button" onClick={runCommand}>RUN</button>
    </div>
  );
}

export default App;