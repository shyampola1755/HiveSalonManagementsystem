import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';
const TARGET_URL = 'https://hive-salon-neon.vercel.app/login';

async function testCustomerCreation() {
  console.log('🚀 Testing Customer Creation & Persistence on Vercel...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  const capture = async (name) => {
    const filePath = path.join(ARTIFACT_DIR, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`📸 Captured screenshot: ${name}.png`);
  };

  try {
    // 1. Login as Front Desk
    console.log('1. Logging in as Front Desk...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle0' });
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

    // 2. Navigate to Customer CRM
    console.log('2. Navigating to Customer CRM...');
    await page.goto('https://hive-salon-neon.vercel.app/front-desk/customers', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await capture('vercel_crm_01_initial_list');

    // 3. Click "+ New Customer"
    console.log('3. Opening New Customer modal...');
    const newCustButtons = await page.$$('button');
    for (const b of newCustButtons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('New Customer')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 600));
    await capture('vercel_crm_02_new_customer_modal');

    // 4. Fill form and submit
    const testName = 'Shyam Test VIP Customer';
    const testPhone = '+91 99887 76655';
    const testEmail = 'shyam.vip@example.com';

    console.log(`4. Filling customer form for: ${testName}...`);
    const inputs = await page.$$('input');
    // Find inputs in modal
    for (const input of inputs) {
      const placeholder = await page.evaluate(el => el.placeholder, input);
      if (placeholder.includes('Deepika')) {
        await input.type(testName);
      } else if (placeholder.includes('98765')) {
        await input.type(testPhone);
      } else if (placeholder.includes('name@example')) {
        await input.type(testEmail);
      }
    }

    await new Promise(r => setTimeout(r, 400));
    // Click submit button in modal
    const saveButtons = await page.$$('button');
    for (const b of saveButtons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Save & Register Client')) {
        await b.click();
        break;
      }
    }

    await new Promise(r => setTimeout(r, 2000));
    await capture('vercel_crm_03_customer_registered');

    // 5. Verify customer appears in table
    const tableText = await page.evaluate(() => document.body.innerText);
    const hasNewCustomer = tableText.includes(testName) && tableText.includes(testPhone);
    console.log(`5. Customer presence in table: ${hasNewCustomer ? '✅ FOUND' : '❌ NOT FOUND'}`);

    // 6. Test searching for the customer
    console.log('6. Testing Search filter for new customer...');
    const searchInput = await page.$('input[placeholder="Search by name or mobile..."]');
    if (searchInput) {
      await searchInput.type('Shyam Test');
      await new Promise(r => setTimeout(r, 1000));
      await capture('vercel_crm_04_searched_customer');
    }

    console.log('\n============================================================');
    console.log(`CRM TEST STATUS: ${hasNewCustomer ? '✅ PASSED 100%' : '❌ FAILED'}`);
    console.log('============================================================');

  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
}

testCustomerCreation().catch(console.error);
