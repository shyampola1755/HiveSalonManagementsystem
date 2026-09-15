import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\495d3b1b-a671-43e2-b87f-0c9bfb3c442a';
const VERCEL_URL = 'https://hive-salon-neon.vercel.app';

async function verifyVercelDeployment() {
  console.log('Connecting to Vercel deployment:', VERCEL_URL);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  // Set mobile viewport: 390x844
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`${VERCEL_URL}/login`, { waitUntil: 'networkidle0' });

  // Quick login as Front Desk
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
  await new Promise(r => setTimeout(r, 3000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_live_mobile_dashboard.png') });
  console.log('📸 Captured vercel_live_mobile_dashboard.png');

  // Open drawer
  const menuBtn = await page.$('button[aria-label="Open Navigation Drawer"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_live_mobile_drawer.png') });
    console.log('📸 Captured vercel_live_mobile_drawer.png');
  }

  // Set tablet viewport: 768x1024
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.goto(`${VERCEL_URL}/front-desk/dashboard`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_live_tablet_dashboard.png') });
  console.log('📸 Captured vercel_live_tablet_dashboard.png');

  await browser.close();
  console.log('Vercel live verification completed successfully!');
}

verifyVercelDeployment().catch(console.error);
