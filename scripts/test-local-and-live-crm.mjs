import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\c571e2cd-c587-4b74-a695-19649d3bb547';

async function testCRM(url, label) {
  console.log(`\n============================================================`);
  console.log(`🧪 Testing Customer CRM on: ${label} (${url})`);
  console.log(`============================================================`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  const capture = async (name) => {
    const filePath = path.join(ARTIFACT_DIR, `${label}_${name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`📸 Captured screenshot: ${label}_${name}.png`);
  };

  try {
    // 1. Login as Front Desk
    console.log('1. Logging in as Front Desk...');
    await page.goto(`${url}/login`, { waitUntil: 'networkidle0' });
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

    // 2. Navigate to Customers CRM
    console.log('2. Navigating to Customer CRM...');
    await page.goto(`${url}/front-desk/customers`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await capture('01_initial_table');

    const initialTableText = await page.evaluate(() => document.body.innerText);
    console.log('Initial Table Content Preview:', initialTableText.includes('Aarav Singhania') ? '✅ Default Customers Rendered' : '⚠️ Default Customers Not Shown');

    // 3. Register New Customer
    const testName = 'Shyam Premium VIP Client';
    const testPhone = '+91 99887 76655';
    const testEmail = 'shyam.vip@example.com';

    console.log(`3. Registering new client: ${testName}...`);
    const newCustBtns = await page.$$('button');
    for (const b of newCustBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('New Customer')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 500));

    const inputs = await page.$$('input');
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
    await new Promise(r => setTimeout(r, 300));

    const saveBtns = await page.$$('button');
    for (const b of saveBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes('Save & Register Client')) {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 2000));
    await capture('02_after_registration');

    // 4. Verify presence in table
    const afterText = await page.evaluate(() => document.body.innerText);
    const isPresent = afterText.includes(testName) && afterText.includes(testPhone);
    console.log(`4. Registered Customer in Table: ${isPresent ? '✅ VISIBLE & DISPLAYED' : '❌ NOT VISIBLE'}`);

    // 5. Test Search
    const searchInput = await page.$('input[placeholder="Search by name or mobile..."]');
    if (searchInput) {
      await searchInput.type('Shyam Premium');
      await new Promise(r => setTimeout(r, 800));
      await capture('03_search_result');
      const searchText = await page.evaluate(() => document.body.innerText);
      console.log(`5. Search filter result: ${searchText.includes(testName) ? '✅ SEARCH MATCHED' : '❌ SEARCH FAILED'}`);
    }

    return isPresent;
  } catch (err) {
    console.error(`Error testing ${label}:`, err);
    return false;
  } finally {
    await browser.close();
  }
}

async function runAll() {
  await testCRM('http://localhost:3000', 'local_dev');
  await testCRM('https://hive-salon-neon.vercel.app', 'live_vercel');
}

runAll().catch(console.error);
