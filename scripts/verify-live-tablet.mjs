import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\495d3b1b-a671-43e2-b87f-0c9bfb3c442a';

async function verifyLiveTablet() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });

  console.log('1. Loading live POS login on tablet (768x1024)...');
  await page.goto('https://hive-salon-neon.vercel.app/pos-login?mode=pos', { waitUntil: 'networkidle0' });

  // Quick 1-tap POS login button
  console.log('2. Clicking 1-tap POS login...');
  const quickLoginBtn = await page.waitForSelector('button[type="submit"]', { visible: true });
  await quickLoginBtn.click();
  await new Promise(r => setTimeout(r, 2500));

  console.log('3. Navigating to Front Desk POS Station on live Vercel...');
  await page.goto('https://hive-salon-neon.vercel.app/front-desk/pos', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Add service to cart
  console.log('4. Adding service on live tablet...');
  const cards = await page.$$('button');
  for (const b of cards) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Precision Director Haircut')) {
      await b.click();
      console.log('Added haircut to cart on live site');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));

  // Click Review & Pay
  console.log('5. Tapping Review & Pay on live tablet...');
  await page.waitForSelector('#btn-floating-review-pay', { visible: true });
  await page.click('#btn-floating-review-pay');
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_vercel_tablet_review_open.png') });
  console.log('📸 Captured live_vercel_tablet_review_open.png');

  // Verify modal is visible
  const modalVisible = await page.evaluate(() => {
    return !!document.getElementById('btn-modal-collect-payment');
  });
  console.log('Live Review modal visible:', modalVisible);

  if (!modalVisible) {
    throw new Error('Review & Pay modal did not open on live site!');
  }

  // Click Attach Customer
  console.log('6. Attaching customer on live tablet...');
  await page.click('#btn-modal-attach-customer');
  await new Promise(r => setTimeout(r, 1000));

  await page.waitForSelector('[id^="cust-item-"]', { visible: true });
  await page.click('[id^="cust-item-"]');
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_vercel_tablet_customer_selected.png') });
  console.log('📸 Captured live_vercel_tablet_customer_selected.png');

  // Click Collect Payment
  console.log('7. Collecting payment on live tablet...');
  await page.click('#btn-modal-collect-payment');
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_vercel_tablet_payment_checkout.png') });
  console.log('📸 Captured live_vercel_tablet_payment_checkout.png');

  console.log('✅ LIVE VERCEL PRODUCTION VERIFIED SUCCESSFULLY ON TABLET!');
  await browser.close();
}

verifyLiveTablet().catch(err => {
  console.error('Live tablet verification failed:', err);
  process.exit(1);
});
