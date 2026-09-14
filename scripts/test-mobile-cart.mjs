import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\shyam\\.gemini\\antigravity-ide\\brain\\495d3b1b-a671-43e2-b87f-0c9bfb3c442a';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
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
  await new Promise(r => setTimeout(r, 2000));

  await page.goto('http://localhost:3000/front-desk/pos', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Click first service card
  const cards = await page.$$('button');
  for (const b of cards) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Precision Director Haircut')) {
      await b.click();
      console.log('Clicked service card!');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_pos_with_cart.png') });
  console.log('Captured mobile_pos_with_cart.png');
  await browser.close();
}

run().catch(console.error);
