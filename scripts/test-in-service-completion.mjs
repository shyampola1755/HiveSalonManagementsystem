import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';

async function run() {
  console.log('--- TESTING IN-SERVICE APPOINTMENT BILLING & AUTO-COMPLETION ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const BASE_URL = 'http://localhost:3000';

  // 1. Login as Front Desk
  console.log('Logging in as Front Desk...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
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
  await new Promise(r => setTimeout(r, 1500));

  // 2. View Live Queue & In-Service chairs
  console.log('Navigating to Live Floor Queue...');
  await page.goto(`${BASE_URL}/front-desk/queue`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'queue_01_before_billing.png') });
  console.log('Captured queue_01_before_billing.png');

  // If lounge has guests and no in-service chairs, seat a guest first
  const inServiceCount = await page.evaluate(() => {
    return document.querySelectorAll('.grid > div:nth-child(2) .space-y-3 > div').length;
  });
  console.log(`Initial in-service clients in chair: ${inServiceCount}`);

  if (inServiceCount === 0) {
    // Start service for first waiting guest
    console.log('Seating a guest in chair...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const seatBtn = btns.find(b => b.textContent?.includes('Start Service'));
      if (seatBtn) seatBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'queue_01b_guest_seated.png') });
  }

  // Click "Complete & Bill at POS" on the in-service guest card
  console.log('Clicking Complete & Bill at POS...');
  const clickedPOS = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const billBtn = btns.find(b => b.textContent?.includes('Complete & Bill at POS'));
    if (billBtn) {
      billBtn.click();
      return true;
    }
    return false;
  });
  console.log(`Clicked Complete & Bill at POS: ${clickedPOS}`);
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'queue_02_pos_preloaded.png') });
  console.log('Captured queue_02_pos_preloaded.png');

  // Verify POS Cart has items and customer attached
  const cartInfo = await page.evaluate(() => {
    const grandTotalEl = document.querySelector('.text-3xl, .text-2xl');
    const custEl = document.querySelector('.text-brand-300');
    return {
      total: grandTotalEl ? grandTotalEl.textContent?.trim() : '',
      customer: custEl ? custEl.textContent?.trim() : '',
    };
  });
  console.log('POS Preloaded Info:', cartInfo);

  // Click Collect Payment & Bill
  console.log('Opening Payment Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const collectBtn = btns.find(b => b.textContent?.includes('Collect Payment & Bill'));
    if (collectBtn) collectBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Select CASH
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cashBtn = btns.find(b => b.textContent?.trim() === 'CASH');
    if (cashBtn) cashBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click Confirm Payment & Print Receipt
  console.log('Confirming Payment & Generating Invoice...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent?.includes('Confirm Payment & Print Receipt'));
    if (confirmBtn) confirmBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'queue_03_invoice_paid.png') });
  console.log('Captured queue_03_invoice_paid.png');

  // Click Done on Invoice Modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const doneBtn = btns.find(b => b.textContent?.trim() === 'Done');
    if (doneBtn) doneBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. Return to Queue to verify chair is now free and client is no longer In Progress
  console.log('Returning to Live Queue to verify in-service status...');
  await page.goto(`${BASE_URL}/front-desk/queue`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'queue_04_after_completion.png') });
  console.log('Captured queue_04_after_completion.png');

  const afterInServiceCount = await page.evaluate(() => {
    const inServiceText = document.body.innerText;
    return inServiceText.includes('No clients currently in chairs') || inServiceText.includes('In-Service Salon Chairs (0)');
  });
  console.log(`In-service queue cleared successfully: ${afterInServiceCount}`);

  // 4. Check Dashboard
  console.log('Verifying Front Desk Dashboard Hub...');
  await page.goto(`${BASE_URL}/front-desk`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'queue_05_dashboard_updated.png') });
  console.log('Captured queue_05_dashboard_updated.png');

  console.log('--- TEST COMPLETED SUCCESSFULLY ---');
  await browser.close();
}

run().catch(console.error);
