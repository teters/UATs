const puppeteer = require('puppeteer');

module.exports = async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.office.com/launch/sharepoint', { timeout: 10000, waitUntil: 'load' });
    
    await browser.close();
    return 'SharePoint,PASS';
  } catch (err) {
    return 'SharePoint,FAIL';
  }
};

if (require.main === module) {
  module.exports().then(console.log).catch(console.error);
}
