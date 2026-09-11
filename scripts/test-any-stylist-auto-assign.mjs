import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';

async function run() {
  console.log('--- TESTING ANY AVAILABLE STYLIST AUTO-ASSIGNMENT ---');
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

  // 2. Navigate to Calendar
  console.log('Navigating to Calendar...');
  await page.goto(`${BASE_URL}/front-desk/calendar`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Tomorrow
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Tomorrow')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // 3. Open Booking Modal
  console.log('Opening Booking Modal...');
  for (const b of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Book Appointment')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  // Select customer (shyam or 2nd customer)
  const selects = await page.$$('select');
  await selects[0].select(await selects[0].$$eval('option', opts => opts[1]?.value));
  // Select service
  await selects[1].select(await selects[1].$$eval('option', opts => opts[1]?.value));
  // Select ANY AVAILABLE STYLIST (value = "")
  await selects[2].select('');
  // Select time 01:00 PM (13:00)
  await selects[3].select('13:00');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'any_stylist_01_modal.png') });
  console.log('Captured any_stylist_01_modal.png');

  // Submit appointment
  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();
  await new Promise(r => setTimeout(r, 1500));

  // Capture calendar grid showing the auto-assigned appointment
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'any_stylist_02_calendar_assigned.png') });
  console.log('Captured any_stylist_02_calendar_assigned.png');

  // Scroll down to the Scheduled Appointments Ledger
  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'any_stylist_03_appointments_table.png') });
  console.log('Captured any_stylist_03_appointments_table.png');

  console.log('--- TEST COMPLETE ---');
  await browser.close();
}

run().catch(console.error);
