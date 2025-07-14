const puppeteer = require('puppeteer');

module.exports = async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://teams.microsoft.com', { timeout: 60000, waitUntil: 'load' });

    await browser.close();
    return 'MS Teams,PASS';
  } catch (err) {
    return 'MS Teams,FAIL';
  }
};

if (require.main === module) {
  module.exports().then(console.log).catch(console.error);
}
