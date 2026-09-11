import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';
const TARGET_URL = 'https://hive-salon-neon.vercel.app/login';

async function verifyAll4Roles() {
  console.log(`🚀 Testing All 4 Live Profiles on Vercel: ${TARGET_URL}`);
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const testResults = [];

  const capture = async (name) => {
    const filePath = path.join(ARTIFACT_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`📸 Captured screenshot: ${name}.png`);
  };

  const roles = [
    { name: 'Super Admin', buttonText: 'Super Admin', expectedUrl: '/back-office/overview', expectedText: 'Executive' },
    { name: 'Branch Mgr', buttonText: 'Branch Mgr', expectedUrl: '/back-office/overview', expectedText: 'Branch Operations' },
    { name: 'Front Desk', buttonText: 'Front Desk', expectedUrl: '/front-desk/dashboard', expectedText: 'Front Desk' },
    { name: 'Stylist', buttonText: 'Stylist', expectedUrl: '/stylist/station', expectedText: 'Stylist Station' },
  ];

  for (const role of roles) {
    console.log(`\nTesting Role: ${role.name}...`);
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });

    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes(role.buttonText)) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 400));
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));

    const currentUrl = page.url();
    const content = await page.evaluate(() => document.body.innerText);
    const passed = currentUrl.includes(role.expectedUrl) && content.includes(role.expectedText);

    await capture(`vercel_${role.name.toLowerCase().replace(/\s+/g, '_')}_success`);
    testResults.push({
      role: role.name,
      status: passed ? 'PASS' : 'FAIL',
      targetUrl: currentUrl,
    });
  }

  await browser.close();
  console.log('\n============================================================');
  console.log('📊 ALL 4 ROLES LIVE VERCEL TEST RESULTS:');
  console.log('============================================================');
  console.table(testResults);
}

verifyAll4Roles().catch(console.error);
