import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\22b1cbf1-6117-4e12-a47a-cfad9914544a';
const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('=== VERIFYING SHYAM SPECIFIC SERVICE COMPLETION & STYLIST REFLECTION ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  async function loginAs(roleText) {
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

  // 1. Login as Front Desk and create / ensure an in-service appointment for Shyam with Vikram Mehta
  await loginAs('Front Desk');

  // Direct API call to create appointment for Shyam
  await page.evaluate(async () => {
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const token = localStorage.getItem('hive_token');

    // Create walk-in appointment for shyam
    const res = await fetch('http://localhost:5000/api/v1/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        customerName: 'shyam',
        customerPhone: '+91 98765 43210',
        serviceName: 'Precision Director Haircut',
        staffName: 'Vikram Mehta',
        appointmentDate: todayStr,
        startTime: '13:00',
        durationMinutes: 45,
        totalPrice: 1500,
        status: 'IN_SERVICE',
      }),
    });
    console.log('Created appointment for shyam:', await res.json());
  });

  // 2. Open Stylist Station to see Shyam in chair
  await loginAs('Stylist');
  await page.goto(`${BASE_URL}/stylist/station`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shyam_01_in_service.png') });
  console.log('Captured shyam_01_in_service.png');

  // Read baseline commission
  const baselineText = await page.evaluate(() => document.body.innerText);
  console.log('Shyam in service visible:', baselineText.includes('shyam'));

  // 3. Login as Front Desk and bill Shyam at POS
  await loginAs('Front Desk');
  await page.goto(`${BASE_URL}/front-desk/queue`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Find Shyam's card and click Bill at POS
  console.log('Locating Shyam card in chair queue...');
  const clickedShyamPOS = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.space-y-2\\.5 > div, .space-y-3 > div'));
    const shyamCard = cards.find(c => c.textContent?.includes('shyam'));
    if (shyamCard) {
      const billBtn = Array.from(shyamCard.querySelectorAll('button')).find(b => b.textContent?.includes('Bill at POS'));
      if (billBtn) {
        billBtn.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked Bill at POS for Shyam:', clickedShyamPOS);
  await new Promise(r => setTimeout(r, 1500));

  // In POS, complete payment
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const payBtn = btns.find(b => b.textContent?.includes('Collect Payment & Bill') || b.textContent?.includes('Pay'));
    if (payBtn) payBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Select UPI
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const upiBtn = btns.find(b => b.textContent?.trim() === 'UPI');
    if (upiBtn) upiBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Confirm Payment
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent?.includes('Confirm Payment & Print Receipt'));
    if (confirmBtn) confirmBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shyam_02_pos_invoice_paid.png') });
  console.log('Captured shyam_02_pos_invoice_paid.png');

  // Done button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const doneBtn = btns.find(b => b.textContent?.trim() === 'Done');
    if (doneBtn) doneBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 4. Return to Stylist Station: Verify Shyam reflects with COMPLETED & BILLED and ₹300 cut!
  await loginAs('Stylist');
  await page.goto(`${BASE_URL}/stylist/station`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shyam_03_stylist_reflecting.png') });
  console.log('Captured shyam_03_stylist_reflecting.png');

  const afterShyamText = await page.evaluate(() => document.body.innerText);
  console.log('Shyam marked COMPLETED & BILLED:', afterShyamText.includes('COMPLETED & BILLED') && afterShyamText.includes('shyam'));
  console.log('Shyam cut of ₹300 reflected:', afterShyamText.includes('300'));

  // 5. Check Commissions tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const commTab = btns.find(b => b.textContent?.trim() === 'Commissions');
    if (commTab) commTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shyam_04_stylist_commissions_tab.png') });
  console.log('Captured shyam_04_stylist_commissions_tab.png');

  const commTabText = await page.evaluate(() => document.body.innerText);
  console.log('Shyam listed in commission ledger:', commTabText.includes('shyam') && commTabText.includes('Precision Director Haircut'));

  console.log('=== SHYAM SPECIFIC VERIFICATION COMPLETED ===');
  await browser.close();
}

run().catch(err => {
  console.error('Shyam test failed:', err);
  process.exit(1);
});
