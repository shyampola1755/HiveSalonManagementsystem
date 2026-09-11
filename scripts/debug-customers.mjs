import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function debugCustomersPage() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));
  page.on('requestfailed', req => console.error('REQUEST FAILED:', req.url(), req.failure()));

  await page.goto('https://hive-salon-neon.vercel.app/login', { waitUntil: 'networkidle0' });
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Front Desk')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n--- Navigating to /front-desk/customers ---');
  await page.goto('https://hive-salon-neon.vercel.app/front-desk/customers', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  const content = await page.evaluate(() => {
    return {
      tableHTML: document.querySelector('tbody')?.innerHTML,
      customersInLocalDB: localStorage.getItem('hive_db_customers'),
      allLocalStorage: Object.keys(localStorage).map(k => ({ key: k, value: localStorage.getItem(k) }))
    };
  });

  console.log('Page Evaluation Result:', JSON.stringify(content, null, 2));

  await browser.close();
}

debugCustomersPage().catch(console.error);
