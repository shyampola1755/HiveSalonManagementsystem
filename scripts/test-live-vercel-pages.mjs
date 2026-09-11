import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';
const TARGET_URL = 'https://hive-salon-neon.vercel.app';

async function verifyLiveVercel() {
  console.log(`🚀 Verifying Latest Updates on Live Vercel: ${TARGET_URL}`);
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  // 1. Login as Front Desk
  await page.goto(`${TARGET_URL}/login`, { waitUntil: 'networkidle0' });
  const loginBtns = await page.$$('button');
  for (const b of loginBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Front Desk')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));

  // 2. Front Desk Hub
  console.log('Verifying Front Desk Hub on Vercel...');
  await page.goto(`${TARGET_URL}/front-desk/dashboard`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const debugDash = await page.evaluate(async () => {
    try {
      const token = localStorage.getItem('hive_token');
      const user = localStorage.getItem('hive_user');
      const branch = localStorage.getItem('hive_active_branch');
      return { token: !!token, user: user ? JSON.parse(user).email : null, branch };
    } catch (e) {
      return { error: e.message };
    }
  });
  console.log('Dashboard Auth State:', debugDash);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_live_01_dashboard.png') });
  console.log('📸 Captured vercel_live_01_dashboard.png');

  // 3. POS Register
  console.log('Verifying POS Register on Vercel...');
  await page.goto(`${TARGET_URL}/front-desk/pos`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const debugPos = await page.evaluate(async () => {
    try {
      const cats = localStorage.getItem('hive_db_categories') || localStorage.getItem('hive_active_branch');
      const svcs = localStorage.getItem('hive_db_services');
      return { storage: cats, svcsCount: svcs ? JSON.parse(svcs).length : null };
    } catch (e) {
      return { error: e.message };
    }
  });
  console.log('POS Debug Data:', debugPos);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_live_02_pos.png') });
  console.log('📸 Captured vercel_live_02_pos.png');

  // 4. Invoices & Receipts
  console.log('Verifying Invoices & Receipts on Vercel...');
  await page.goto(`${TARGET_URL}/front-desk/invoices`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_live_03_invoices.png') });
  console.log('📸 Captured vercel_live_03_invoices.png');

  // 5. Live Floor Queue
  console.log('Verifying Live Floor Queue on Vercel...');
  await page.goto(`${TARGET_URL}/front-desk/queue`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_live_04_queue.png') });
  console.log('📸 Captured vercel_live_04_queue.png');

  console.log('✅ Vercel live verification complete!');
  await browser.close();
}

verifyLiveVercel().catch(console.error);
