import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {

  const [testResults, setTestResults] = useState({});


  const runAllTests = async () => {
    const tests = [
      'test1_sap.cmd',
      'test2_intranet.js',
      'test3_internet.js',
      'test4_teams.js',
      'test5_outlook.cmd',
      'test6_office.js',
      'test7_sharepoint.js',
    ];

    const results = {};

    for (const test of tests) {
      const result = await window.electron.runTest(test);
      results[test] = result;
    }

    setTestResults(results);
    console.log('Resultados:', results);
  };

  // Para parsear los resultados y mostrar nombre y estado
  const parsedResults = Object.entries(testResults).map(([file, output]) => {
    // output es algo tipo "Intranet,PASS"
    if (output.includes(',')) {
      const [name, status] = output.split(',');
      return { name, status };
    } else {
      // fallback: sacar la extensión y poner el nombre del archivo
      const name = file.replace(/\.(cmd|js)$/, '');
      const status = output;
      return { name, status };
    }
  });


  const runCommand = () => {
    window.electron.sendCommand('TESTUATCOMPLETED.cmd');
  };


  useEffect(() => {
    window.electron.onCommandOutput((event, output) => {
      console.log('Salida del comando:', output);
    });
  }, []);


  const [formData, setFormData] = useState({
    project: '',
    siteId: '',
    testerName: '',
    siteCategory: '',
    siteHas: [],
    connection: '',
    printing:'',
    mobd: '',
    testType:'',
    linkType: '',
    comments: '',
    overallAssesment: '',

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

  const getLinkOptions = () => {
    switch (formData.siteCategory) {
      case 'Gold':
        return ['1st MPLS link', '2nd MPLS link', '1st INET link', '2nd INET link'];
      case 'Silver':
      case 'Silver+':
        return ['MPLS link', 'INET link'];
      case 'Bronze':
        return ['MPLS link'];
      case 'Copper':
        return ['INET link'];
      default:
        return [];
    }
  };

  const projectRef = useRef(null);
  const siteIdRef = useRef(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      project,
      siteId,
      testerName,
      siteCategory,
      siteHas,
      connection,
      printing,
      mobd,
      testType,
      linkType,
      comments,
      overallAssesment
    } = formData;

    const now = new Date();
    const formattedDate = now.toISOString().replace(/[:.]/g, '-');
    const fileName = `UAT_${testType}_${siteId}_${formattedDate}.csv`;

    const csvContent = 
  `Field,Value
  Project,${project}
  Site ID,${siteId}
  Tester Name,${testerName}
  Site Category,${siteCategory}
  Site Has,${siteHas.join(' | ')}
  Connection,${connection}
  Printing,${printing}
  MobD,${mobd}
  Test Type,${testType}
  Link Type,${linkType}
  Comments,${comments}
  OVERALL ASSESMENT,${overallAssesment}
  `;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Archivo generado:", fileName);
  };







  return (
    <div className="app">
      <h1 className="title">User Acceptance Tests</h1>
      <div className="paragraphs">
        <p className="description">
            The following tests need to be performed 30 minutes before the migration for baselining purposes (*) and after the migration. Date and 
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
              <option value="" disabled hidden style={{ color: '#ccc' }}>Select category</option>
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
            <label htmlFor="testType">Test type:</label>
            <select
              id="testType"
              name="testType"
              value={formData.testType}
              onChange={handleInputChange}
            >
              <option value="Baseline">Baseline</option>
              <option value="Migration">Migration</option>
              
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="linkType">Link:</label>
            <select
              id="linkType"
              name="linkType"
              value={formData.linkType}
              onChange={handleInputChange}
              disabled={getLinkOptions().length === 0}
            >
              <option value="" disabled>Select Link</option>
              {getLinkOptions().map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

    
      </form>
      
      <p className="description">
          <strong>
            The following button automates the following tests...:
          </strong>
        </p>

      <button className="run-button" onClick={runAllTests}>RUN</button>
      <div className="test-results">
        {parsedResults.map((result, index) => (
          <div key={index} className={`result-item fade-in ${result.status === 'PASS' ? 'pass' : 'fail'}`}>
            <span className="test-name">{result.name}</span>
            <span className="status-icon">
              {result.status === 'PASS' ? '✅' : '❌'}
            </span>
          </div>
        ))}
      </div>

      <form className="form">
        <div className="form-group">
              <label htmlFor="printing">Does printing work?</label>
              <select
                id="printing"
                name="printing"
                value={formData.printing}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="PASS">Yes</option>
                <option value="FAIL">No</option>
                
              </select>
        </div>
      </form>

      <form className="form">
        <div className="form-group">
              <label htmlFor="mobd">Does MobD work on mobile phones?</label>
              <select
                id="mobd"
                name="mobd"
                value={formData.mobd}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="PASS">Yes</option>
                <option value="FAIL">No</option>
                
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
      
      <form className="form">
        <div className="form-group comments-group">
          <label htmlFor="comments" className="comments-label">Local app test /Additional remarks/feedback on anomalies:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            rows="4"
            placeholder="Write here..."
            className="comments-textarea"
          />
        </div>
      </form>
      <form className="form">
        <div className="form-group">
              <label htmlFor="OverallAssesment" style={{ fontWeight: 'bold' }}>Overall User Assesment:</label>
              <select
                id="OverallAssesment"
                name="overallAssesment"
                value={formData.overallAssesment}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
                
              </select>
        </div>
      </form>


      <button className="run-button" onClick={handleSubmit}>SUBMIT</button>

    </div>
  );
}

export default App;