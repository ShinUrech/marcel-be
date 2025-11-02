/* eslint-disable prettier/prettier */
import puppeteer from 'puppeteer';
export const getPuppeteerInstance = async (cookie = [], headless = true) => {
  const browser = await puppeteer.launch({ 
    headless: headless,
    slowMo: 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--window-size=1920x1080',
    ],
  });
  
  const page = await browser.newPage();
  
  if (cookie.length) {
    await page.setCookie(...cookie);
  }
  
  await page.setViewport({ width: 1920, height: 1080 });
  
  return { browser, page };
};
