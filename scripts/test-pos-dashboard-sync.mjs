import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';

async function run() {
  console.log('--- TESTING POS BILLING & DASHBOARD REVENUE REAL-TIME SYNC ---');
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

  // 2. View Initial Dashboard Revenue
  console.log('Capturing Initial Dashboard State...');
  await page.goto(`${BASE_URL}/front-desk`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dash_sync_01_before_billing.png') });
  console.log('Captured dash_sync_01_before_billing.png');

  // Extract initial revenue text from Dashboard
  const initialRevenueText = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.glass-card'));
    for (const c of cards) {
      if (c.textContent.includes("TODAY'S REVENUE")) {
        const h = c.querySelector('.text-2xl');
        return h ? h.textContent.trim() : '';
      }
    }
    return '';
  });
  console.log(`Initial Dashboard Revenue: ${initialRevenueText}`);

  // 3. Navigate to POS Register
  console.log('Navigating to POS Register...');
  await page.goto(`${BASE_URL}/front-desk/pos`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Click "+ Attach Customer"
  console.log('Attaching Customer in POS...');
  const attachBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent?.includes('Attach Customer'));
  });
  if (attachBtn && attachBtn.asElement()) {
    await attachBtn.asElement().click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Click first customer in modal
  const customerClicked = await page.evaluate(() => {
    const modalItems = document.querySelectorAll('.max-h-60 .cursor-pointer');
    if (modalItems.length > 0) {
      modalItems[0].click();
      return true;
    }
    return false;
  });
  console.log(`Customer attached from modal: ${customerClicked}`);
  await new Promise(r => setTimeout(r, 800));

  // Add Service Item
  console.log('Adding Service to Cart...');
  const serviceAdded = await page.evaluate(() => {
    const serviceButtons = document.querySelectorAll('.grid button.group');
    if (serviceButtons.length > 0) {
      serviceButtons[0].click();
      return true;
    }
    return false;
  });
  console.log(`Service added to cart: ${serviceAdded}`);
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dash_sync_02_pos_cart.png') });
  console.log('Captured dash_sync_02_pos_cart.png');

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

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dash_sync_03_payment_modal.png') });

  // Click Confirm Payment & Print Receipt
  console.log('Confirming Payment...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent?.includes('Confirm Payment & Print Receipt'));
    if (confirmBtn) confirmBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dash_sync_04_invoice_generated.png') });
  console.log('Captured dash_sync_04_invoice_generated.png');

  // Click Done on Invoice modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const doneBtn = btns.find(b => b.textContent?.trim() === 'Done');
    if (doneBtn) doneBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Return to Dashboard Hub
  console.log('Returning to Dashboard to verify Revenue update...');
  await page.goto(`${BASE_URL}/front-desk`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dash_sync_05_after_billing.png') });
  console.log('Captured dash_sync_05_after_billing.png');

  const updatedRevenueText = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.glass-card'));
    for (const c of cards) {
      if (c.textContent.includes("TODAY'S REVENUE")) {
        const h = c.querySelector('.text-2xl');
        return h ? h.textContent.trim() : '';
      }
    }
    return '';
  });
  console.log(`Updated Dashboard Revenue: ${updatedRevenueText}`);

  // 5. Navigate to Invoices & Receipts
  console.log('Navigating to Invoices View...');
  await page.goto(`${BASE_URL}/front-desk/invoices`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dash_sync_06_invoices_list.png') });
  console.log('Captured dash_sync_06_invoices_list.png');

  console.log('--- TEST COMPLETE ---');
  await browser.close();
}

run().catch(console.error);
