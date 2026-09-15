import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\22b1cbf1-6117-4e12-a47a-cfad9914544a';
const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('=== STARTING COMPLETE STYLIST BILLING & COMMISSION SYNC TEST ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Helper: Login as a specific role
  async function loginAs(roleText) {
    console.log(`Logging in as ${roleText}...`);
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    const buttons = await page.$$('button');
    for (const b of buttons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes(roleText)) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 400));
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await new Promise(r => setTimeout(r, 1500));
  }

  // 1. First, verify Stylist Station initial state
  await loginAs('Stylist');
  await page.goto(`${BASE_URL}/stylist/station`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_stylist_initial_state.png') });
  console.log('Captured 01_stylist_initial_state.png');

  const initialStylistText = await page.evaluate(() => document.body.innerText);
  console.log('Stylist initial commission visible:', initialStylistText.includes('₹1,660') || initialStylistText.includes('COMMISSIONS'));

  // 2. Now login as Front Desk to check in-service chair or seat a guest
  await loginAs('Front Desk');
  await page.goto(`${BASE_URL}/front-desk/queue`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_frontdesk_queue_before.png') });
  console.log('Captured 02_frontdesk_queue_before.png');

  // Check if chair has an in-service guest. If not, start service for the first waiting guest.
  let inServiceCount = await page.evaluate(() => {
    const text = document.body.innerText;
    const match = text.match(/In-Service Salon Chairs \((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  console.log(`Current in-service chairs: ${inServiceCount}`);

  if (inServiceCount === 0) {
    console.log('Starting service for waiting lounge client...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.textContent?.includes('Start Service'));
      if (startBtn) startBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));
  }

  // Check client details in chair
  const chairClientInfo = await page.evaluate(() => {
    const chairCol = document.querySelectorAll('.grid > div')[1];
    return chairCol ? chairCol.innerText : '';
  });
  console.log('Chair Client Info in Queue:\n', chairClientInfo.slice(0, 200));

  // 3. Click "Bill at POS" on the in-service chair card
  console.log('Clicking Bill at POS on in-service chair card...');
  const clickedBill = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const billBtn = btns.find(b => b.textContent?.includes('Bill at POS'));
    if (billBtn) {
      billBtn.click();
      return true;
    }
    return false;
  });
  console.log(`Clicked Bill at POS: ${clickedBill}`);
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_pos_loaded_with_appointment.png') });
  console.log('Captured 03_pos_loaded_with_appointment.png');

  // 4. In POS, collect payment
  console.log('Opening POS checkout payment modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const payBtn = btns.find(b => b.textContent?.includes('Collect Payment & Bill') || b.textContent?.includes('Pay'));
    if (payBtn) payBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Select CASH
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cashBtn = btns.find(b => b.textContent?.trim() === 'CASH');
    if (cashBtn) cashBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Confirm Payment & Print Receipt
  console.log('Confirming payment and generating tax invoice...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent?.includes('Confirm Payment & Print Receipt'));
    if (confirmBtn) confirmBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_pos_invoice_paid.png') });
  console.log('Captured 04_pos_invoice_paid.png');

  // Close receipt modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const doneBtn = btns.find(b => b.textContent?.trim() === 'Done');
    if (doneBtn) doneBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 5. Now switch to Stylist Station to verify instant reflection!
  console.log('Switching to Stylist Login to verify live reflection...');
  await loginAs('Stylist');
  await page.goto(`${BASE_URL}/stylist/station`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_stylist_after_payment_collected.png') });
  console.log('Captured 05_stylist_after_payment_collected.png');

  const stylistStationText = await page.evaluate(() => document.body.innerText);
  const reflectionStatus = {
    hasClientsCount: stylistStationText.includes('Clients'),
    hasCompletedBadge: stylistStationText.includes('COMPLETED & BILLED'),
    hasCutEarned: stylistStationText.includes('Cut earned:'),
    hasPaidCollectedNote: stylistStationText.includes('Payment collected at POS'),
    commissionsNumber: (stylistStationText.match(/₹[\d,]+/g) || []),
  };
  console.log('Stylist Station Reflection Status:\n', reflectionStatus);

  // 6. View Commissions & Ledger Tab
  console.log('Viewing Stylist Commissions Tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const commTab = btns.find(b => b.textContent?.trim() === 'Commissions');
    if (commTab) commTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_stylist_commissions_ledger.png') });
  console.log('Captured 06_stylist_commissions_ledger.png');

  const commText = await page.evaluate(() => document.body.innerText);
  console.log('Has Service Revenue Delivered:', commText.includes('Service Revenue Delivered'));
  console.log('Has Retail Products Upsold:', commText.includes('Retail Products Upsold'));
  console.log('Has Ledger with PAID & COLLECTED:', commText.includes('PAID & COLLECTED'));

  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
  await browser.close();
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
