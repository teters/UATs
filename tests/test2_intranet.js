const puppeteer = require('puppeteer');

module.exports = async function () {
  const urls = [
    'https://www.basf.net',
    'https://service4you.intranet.basf.com/sp?id=basf_printing_portal&sysparm_language=en',
    'https://accessit.basf.net/irj/portal/accessit?guest_user=Guest_ACCESSIT',
    'https://kiosk.basf.net/',
    'https://service4you.intranet.basf.com/sp?id=basf_index'
  ];

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (const url of urls) {
      await page.goto(url, { timeout: 120000, waitUntil: 'load' });
    }

    await browser.close();
    return 'Intranet,PASS';
  } catch (err) {
    console.error('Error en test3_internet.js:', err);
    return 'Intranet,FAIL';
  }
};

if (require.main === module) {
  module.exports().then(console.log).catch(console.error);
}
