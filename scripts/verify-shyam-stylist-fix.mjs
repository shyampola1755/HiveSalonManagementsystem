import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\22b1cbf1-6117-4e12-a47a-cfad9914544a';
const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('=== VERIFYING SHYAM FIX IN STYLIST STATION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Login as Stylist
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Stylist')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) await submitBtn.click();
  await new Promise(r => setTimeout(r, 2000));

  // Navigate to Stylist Station
  await page.goto(`${BASE_URL}/stylist/station`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Save full-page screenshot of Chair Schedule
  const chairPath = path.join(ARTIFACT_DIR, '07_shyam_stylist_fixed_chair.png');
  await page.screenshot({ path: chairPath, fullPage: true });
  console.log('Saved 07_shyam_stylist_fixed_chair.png');

  // Filter to Completed
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const compBtn = btns.find(b => b.textContent?.includes('Completed'));
    if (compBtn) compBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_shyam_completed_filter.png') });
  console.log('Saved 10_shyam_completed_filter.png');

  // Verify text content
  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('=== VERIFICATION RESULTS (CHAIR SCHEDULE) ===');
  console.log('Contains customer shyam:', pageText.includes('shyam'));
  console.log('Contains Signature Luxe Haircut & Blowdry:', pageText.includes('Signature Luxe Haircut & Blowdry'));
  console.log('Contains French Balayage & Glossing:', pageText.includes('French Balayage & Glossing'));
  console.log('Contains ₹1,800:', pageText.includes('1,800'));
  console.log('Contains ₹6,500:', pageText.includes('6,500'));
  console.log('Contains ₹2,124 incl. GST:', pageText.includes('2,124 incl. GST') || pageText.includes('2,124'));
  console.log('Contains ₹7,670 incl. GST:', pageText.includes('7,670 incl. GST') || pageText.includes('7,670'));

  // Switch to Commissions tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const commTab = btns.find(b => b.textContent?.trim() === 'Commissions');
    if (commTab) commTab.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const commsPath = path.join(ARTIFACT_DIR, '08_shyam_stylist_fixed_commissions.png');
  await page.screenshot({ path: commsPath });
  console.log('Saved 08_shyam_stylist_fixed_commissions.png');

  const commText = await page.evaluate(() => document.body.innerText);
  console.log('=== VERIFICATION RESULTS (COMMISSIONS TAB) ===');
  console.log('Commissions ledger includes shyam:', commText.includes('shyam'));
  console.log('Commissions ledger includes Signature Luxe Haircut & Blowdry:', commText.includes('Signature Luxe Haircut & Blowdry'));
  console.log('Commissions ledger includes French Balayage & Glossing:', commText.includes('French Balayage & Glossing'));
  console.log('Commissions ledger includes cut ₹360:', commText.includes('360'));
  console.log('Commissions ledger includes cut ₹1300:', commText.includes('1300') || commText.includes('1,300'));

  await browser.close();
  console.log('=== VERIFICATION COMPLETED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
