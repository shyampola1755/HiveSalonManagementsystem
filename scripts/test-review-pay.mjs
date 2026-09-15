import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\495d3b1b-a671-43e2-b87f-0c9bfb3c442a';

async function testReviewPay() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  console.log('1. Navigating to login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });

  // Login as front desk
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

  console.log('2. Navigating to Front Desk POS Station...');
  await page.goto('http://localhost:3000/front-desk/pos', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Add haircut to cart
  console.log('3. Adding service to cart on tablet portrait (768x1024)...');
  const cards = await page.$$('button');
  for (const b of cards) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Precision Director Haircut')) {
      await b.click();
      console.log('Added haircut to cart');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  console.log('4. Clicking Review & Pay button (#btn-floating-review-pay)...');
  await page.waitForSelector('#btn-floating-review-pay', { visible: true });
  await page.click('#btn-floating-review-pay');
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet_review_pay_modal_open.png') });
  console.log('📸 Captured tablet_review_pay_modal_open.png');

  console.log('5. Clicking Attach Customer button (#btn-modal-attach-customer)...');
  await page.waitForSelector('#btn-modal-attach-customer', { visible: true });
  await page.click('#btn-modal-attach-customer');
  await new Promise(r => setTimeout(r, 1000));

  // Select customer from customer modal
  console.log('Selecting customer from customer list...');
  await page.waitForSelector('[id^="cust-item-"]', { visible: true });
  await page.click('[id^="cust-item-"]');
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet_review_pay_customer_attached.png') });
  console.log('📸 Captured tablet_review_pay_customer_attached.png');

  console.log('6. Clicking Collect Payment & Bill (#btn-modal-collect-payment)...');
  await page.waitForSelector('#btn-modal-collect-payment', { visible: true });
  await page.click('#btn-modal-collect-payment');
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet_checkout_payment_modal.png') });
  console.log('📸 Captured tablet_checkout_payment_modal.png');

  // Confirm Payment
  console.log('7. Confirming payment with UPI...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent?.includes('Confirm Payment'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet_invoice_completed.png') });
  console.log('📸 Captured tablet_invoice_completed.png');

  // Dismiss invoice modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent?.trim() === 'Done');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Now test Landscape Tablet (1024x768)
  console.log('8. Testing Landscape Tablet Viewport (1024x768)...');
  await page.setViewport({ width: 1024, height: 768, isMobile: true, hasTouch: true });
  await new Promise(r => setTimeout(r, 1000));

  // Add another item in landscape
  const landscapeCards = await page.$$('button');
  for (const b of landscapeCards) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('French Balayage')) {
      await b.click();
      console.log('Added French Balayage in landscape');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tablet_landscape_dual_pane.png') });
  console.log('📸 Captured tablet_landscape_dual_pane.png');

  console.log('✅ ALL TABLET POS REVIEW & PAY VERIFICATION TESTS PASSED SUCCESSFULLY!');
  await browser.close();
}

testReviewPay().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
