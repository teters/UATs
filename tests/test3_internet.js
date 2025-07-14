const puppeteer = require('puppeteer');

module.exports = async function () {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.google.com', { timeout: 5000, waitUntil: 'load' });
    //await page.goto('https://www.ibm.com', { timeout: 000, waitUntil: 'load' });

    await browser.close();
    return 'Internet,PASS';
  } catch (err) {
    console.error('Error en test3_internet.js:', err);
    return 'Internet,FAIL';
  }
};

// Ejecutable desde consola para debug
if (require.main === module) {
  module.exports().then(console.log).catch(console.error);
}
