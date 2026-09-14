import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\495d3b1b-a671-43e2-b87f-0c9bfb3c442a';
const TARGET_URL = 'http://localhost:3000';

async function testResponsive() {
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  // Helper to test a route for overflow
  const testRoute = async (route, name, width, height) => {
    await page.setViewport({ width, height, isMobile: true, hasTouch: true });
    await page.goto(`${TARGET_URL}${route}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });

    console.log(`[${width}x${height}] ${name} (${route}): overflow=${overflow.hasOverflow} (${overflow.scrollWidth}px vs ${overflow.clientWidth}px)`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `${width}_${name}.png`) });
    return overflow;
  };

  // Login as Super Admin so we can access both Front Desk & Back Office
  console.log('Logging in as Super Admin...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`${TARGET_URL}/login`, { waitUntil: 'networkidle0' });

  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Super Admin')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));

  const routes = [
    { route: '/front-desk/dashboard', name: 'frontdesk_dashboard' },
    { route: '/front-desk/calendar', name: 'frontdesk_calendar' },
    { route: '/front-desk/queue', name: 'frontdesk_queue' },
    { route: '/front-desk/pos', name: 'frontdesk_pos' },
    { route: '/front-desk/customers', name: 'frontdesk_customers' },
    { route: '/front-desk/invoices', name: 'frontdesk_invoices' },
    { route: '/front-desk/memberships', name: 'frontdesk_memberships' },
    { route: '/front-desk/loyalty', name: 'frontdesk_loyalty' },
    { route: '/back-office/overview', name: 'backoffice_overview' },
    { route: '/back-office/branches', name: 'backoffice_branches' },
    { route: '/back-office/services', name: 'backoffice_services' },
    { route: '/back-office/team', name: 'backoffice_team' },
    { route: '/back-office/inventory', name: 'backoffice_inventory' },
    { route: '/back-office/finance', name: 'backoffice_finance' },
    { route: '/back-office/reports', name: 'backoffice_reports' },
    { route: '/back-office/marketing', name: 'backoffice_marketing' },
  ];

  console.log('\n--- TESTING MOBILE (390px) ---');
  for (const r of routes) {
    await testRoute(r.route, r.name, 390, 844);
  }

  console.log('\n--- TESTING TABLET (768px) ---');
  for (const r of routes) {
    await testRoute(r.route, r.name, 768, 1024);
  }

  await browser.close();
  console.log('\nAll route responsive tests completed!');
}

testResponsive().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
