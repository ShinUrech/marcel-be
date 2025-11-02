#!/usr/bin/env node
/**
 * LinkedIn HTML Structure Inspector
 * Check what HTML structure LinkedIn is actually returning
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIE_FILE = path.join(process.cwd(), 'linkedin-cookies.json');

async function inspectLinkedIn() {
  console.log('🔍 Inspecting LinkedIn HTML structure...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();
  
  try {
    // Load cookies if available
    if (fs.existsSync(COOKIE_FILE)) {
      const cookiesString = fs.readFileSync(COOKIE_FILE, 'utf-8');
      const cookies = JSON.parse(cookiesString);
      await page.setCookie(...cookies);
      console.log('✅ Loaded cookies\n');
    }

    console.log('📍 Navigating to SBB LinkedIn page...');
    await page.goto('https://www.linkedin.com/company/sbb-cff-ffs/posts/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    console.log('✅ Page loaded\n');

    // Get page HTML and save it
    const html = await page.content();
    fs.writeFileSync('/var/www/railway-scraper/linkedin-page-debug.html', html);
    console.log('💾 Saved HTML to: linkedin-page-debug.html\n');

    // Try to find feed containers with various selectors
    const selectors = [
      '.feed-shared-update-v2',
      '[data-id^="urn:li:activity"]',
      '.feed-shared-update',
      'article',
      '.scaffold-finite-scroll__content > div',
      '[class*="feed"]',
    ];

    console.log('🔎 Testing selectors:\n');
    for (const selector of selectors) {
      const count = await page.$$eval(selector, els => els.length);
      console.log(`   ${selector.padEnd(45)} Found: ${count}`);
    }

    // Get a sample of class names from the page
    console.log('\n📋 Sample class names on page:');
    const classes = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[class]'));
      const classSet = new Set();
      elements.slice(0, 50).forEach(el => {
        const classList = Array.from(el.classList);
        classList.forEach(c => {
          if (c.includes('feed') || c.includes('update') || c.includes('post')) {
            classSet.add(c);
          }
        });
      });
      return Array.from(classSet).slice(0, 15);
    });
    console.log(classes.join('\n   '));

    // Check current URL
    console.log('\n📍 Final URL:', page.url());

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed');
  }
}

inspectLinkedIn();
