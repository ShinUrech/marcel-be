#!/usr/bin/env node
/**
 * Direct LinkedIn Connection Test
 * Tests if we can reach LinkedIn and what response we get
 */

const puppeteer = require('puppeteer');

async function testLinkedInAccess() {
  console.log('🚀 Testing direct LinkedIn access...\n');
  
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
    console.log('📍 Navigating to linkedin.com/company/swissrail...');
    
    const response = await page.goto('https://www.linkedin.com/company/swissrail', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const finalUrl = page.url();
    const statusCode = response.status();
    
    console.log('✅ Response received!');
    console.log('   Status Code:', statusCode);
    console.log('   Final URL:', finalUrl);
    console.log('');

    // Check if redirected to login
    if (finalUrl.includes('/login') || finalUrl.includes('/authwall')) {
      console.log('🔒 LinkedIn requires authentication');
      console.log('   Redirected to:', finalUrl);
      console.log('');
      console.log('💡 Solution: You need to provide valid LinkedIn cookies');
      console.log('   Run: npm run linkedin:login (on your local machine)');
    } else {
      console.log('✅ Successfully accessed LinkedIn page!');
      const title = await page.title();
      console.log('   Page title:', title);
    }

    // Try to get page content preview
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
    console.log('\n📄 Page content preview:');
    console.log(bodyText);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n🔒 Browser closed');
  }
}

testLinkedInAccess();
