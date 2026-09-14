import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\d695a9dc-f546-493e-880b-42522505e5f5';
const TARGET_URL = 'https://hive-salon-neon.vercel.app';

async function verifySettingsRemoval() {
  console.log('Verifying removal of System & Security Settings on ' + TARGET_URL);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  try {
    await page.goto(`${TARGET_URL}/login`, { waitUntil: 'networkidle0' });

    const loginBtns = await page.$$('button');
    for (const b of loginBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Super Admin')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 400));
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 2000));

    // Navigate to Back Office Overview
    await page.goto(`${TARGET_URL}/back-office/overview`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));

    // Inspect sidebar text items
    const sidebarText = await page.evaluate(() => {
      const aside = document.querySelector('aside');
      return aside ? aside.innerText : '';
    });

    console.log('Sidebar Navigation Items Present:\n' + sidebarText);

    if (sidebarText.includes('System & Security Settings')) {
      console.error('FAILED: System & Security Settings is still in the sidebar!');
    } else {
      console.log('SUCCESS: System & Security Settings has been completely removed from sidebar navigation!');
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'backoffice_no_settings.png'), fullPage: true });

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await browser.close();
  }
}

verifySettingsRemoval();
