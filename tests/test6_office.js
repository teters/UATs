const puppeteer = require('puppeteer');

module.exports = async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.office.com', { timeout: 60000, waitUntil: 'load' });

    await browser.close();
    return 'Office Online,PASS';
  } catch (err) {
    return 'Office Online,FAIL';
  }
};

if (require.main === module) {
  module.exports().then(console.log).catch(console.error);
}
