import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';

async function run() {
  console.log('--- STARTING APPOINTMENT RESTRICTIONS & CONFLICT TEST ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1400, height: 900 },
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

  // 2. Navigate to Appointments Calendar
  console.log('Navigating to Appointments Calendar...');
  await page.goto(`${BASE_URL}/front-desk/calendar`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_appt_01_calendar_today.png') });
  console.log('Captured test_appt_01_calendar_today.png');

  // 3. Test Booking on Tomorrow's date
  console.log('Switching to Tomorrow...');
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Tomorrow')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_appt_02_calendar_tomorrow.png') });
  console.log('Captured test_appt_02_calendar_tomorrow.png');

  // Click "Book Appointment"
  console.log('Opening Booking Modal...');
  for (const b of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Book Appointment')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  // Select customer, service, Vikram Mehta, 11:00 AM
  console.log('Booking 1st appointment for Client at 11:00 AM with Vikram Mehta...');
  await page.waitForSelector('select');
  const selects = await page.$$('select');
  
  // select customer (index 0)
  await selects[0].select(await selects[0].$$eval('option', opts => opts[1]?.value));
  // select service (index 1)
  await selects[1].select(await selects[1].$$eval('option', opts => opts[1]?.value));
  // select staff (index 2) - Vikram Mehta
  await selects[2].select(await selects[2].$$eval('option', opts => opts[1]?.value));
  // select time slot (index 3) - 11:00
  await selects[3].select('11:00');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_appt_03_first_booking_modal.png') });
  console.log('Captured test_appt_03_first_booking_modal.png');

  // Submit first appointment
  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_appt_04_first_booking_success.png') });
  console.log('Captured test_appt_04_first_booking_success.png');

  // 4. Attempt to book a DUPLICATE / CONCURRENT appointment for the SAME client at 11:00 AM with a different stylist (Sara Khan)
  console.log('Attempting duplicate concurrent booking for SAME customer at 11:00 AM with Sara Khan...');
  for (const b of await page.$$('button')) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Book Appointment')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  const modalSelects = await page.$$('select');
  // Same customer (index 0)
  await modalSelects[0].select(await modalSelects[0].$$eval('option', opts => opts[1]?.value));
  // Service (index 1)
  await modalSelects[1].select(await modalSelects[1].$$eval('option', opts => opts[1]?.value));
  // Different stylist (Sara Khan - index 2)
  await modalSelects[2].select(await modalSelects[2].$$eval('option', opts => opts[2]?.value));
  // Same time slot 11:00 (index 3)
  await modalSelects[3].select('11:00');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_appt_05_duplicate_booking_attempt.png') });

  const modalSubmitBtn = await page.$('button[type="submit"]');
  await modalSubmitBtn.click();
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_appt_06_duplicate_booking_blocked_toast.png') });
  console.log('Captured test_appt_06_duplicate_booking_blocked_toast.png');

  console.log('--- TEST COMPLETE ---');
  await browser.close();
}

run().catch(console.error);
