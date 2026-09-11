import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';

async function verifyDropdowns() {
  console.log('🚀 Verifying Customer Dropdowns & CRM List on Local Dev...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const capture = async (name) => {
    const filePath = path.join(ARTIFACT_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`📸 Captured screenshot: ${name}.png`);
  };

  try {
    // 1. Login as Front Desk
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
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
    await new Promise(r => setTimeout(r, 1500));

    // 2. Check Customer CRM
    await page.goto('http://localhost:3000/front-desk/customers', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await capture('verify_crm_list');
    const crmText = await page.evaluate(() => document.body.innerText);
    const hasCrmCustomers = crmText.includes('Aarav Singhania') || crmText.includes('Deepika Padukone');
    console.log(`1. Customer CRM Directory: ${hasCrmCustomers ? '✅ POPULATED WITH CLIENTS' : '❌ EMPTY'}`);

    // 3. Check Calendar Booking Modal Dropdown
    await page.goto('http://localhost:3000/front-desk/calendar', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    
    // Click "Book Appointment"
    const bookBtns = await page.$$('button');
    for (const b of bookBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Book Appointment')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 500));
    await capture('verify_calendar_modal_dropdown');

    const customerOptions = await page.evaluate(() => {
      const select = document.querySelector('select');
      if (!select) return [];
      return Array.from(select.options).map(o => o.text);
    });

    console.log('2. Customer Select Dropdown Options:', customerOptions);
    const hasClientsInDropdown = customerOptions.length > 1;
    console.log(`3. Dropdown Populated: ${hasClientsInDropdown ? '✅ SUCCESS (' + (customerOptions.length - 1) + ' clients)' : '❌ FAILED'}`);

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
  }
}

verifyDropdowns().catch(console.error);
