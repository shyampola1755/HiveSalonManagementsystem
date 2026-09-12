import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';
const TARGET_URL = 'https://hive-salon-neon.vercel.app';

async function testDropdown() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  console.log('Navigating to login...');
  await page.goto(`${TARGET_URL}/login`, { waitUntil: 'networkidle0' });
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

  console.log('Finding branch dropdown button...');
  const branchBtn = await page.$('button[title="Click to switch active branch location"]');
  if (branchBtn) {
    console.log('Clicking branch dropdown button to open menu...');
    await branchBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_branch_dropdown_open.png') });
    console.log('📸 Captured vercel_branch_dropdown_open.png');

    console.log('Selecting Bangalore branch option...');
    const options = await page.$$('button');
    for (const opt of options) {
      const txt = await page.evaluate(el => el.textContent, opt);
      if (txt && txt.includes('Bangalore Lounge')) {
        await opt.click();
        console.log('Clicked Bangalore Lounge option!');
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'vercel_branch_switched_bangalore.png') });
    console.log('📸 Captured vercel_branch_switched_bangalore.png');
  } else {
    console.error('Could not find branch button!');
  }

  await browser.close();
}

testDropdown().catch(console.error);
