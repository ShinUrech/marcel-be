#!/usr/bin/env node
/**
 * LinkedIn Login Helper
 * 
 * This script helps you log in to LinkedIn manually and save cookies.
 * Run this locally on your machine (not on the server).
 * 
 * Usage:
 *   LINKEDIN_EMAIL=your@email.com LINKEDIN_PASSWORD=yourpass node scripts/linkedin-login-helper.js
 * 
 * Then upload the generated linkedin-cookies.json to your server.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIE_FILE = path.join(process.cwd(), 'linkedin-cookies.json');

async function loginAndSaveCookies() {
  const email = process.env.LINKEDIN_EMAIL;
  const password = process.env.LINKEDIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Please set LINKEDIN_EMAIL and LINKEDIN_PASSWORD environment variables');
    process.exit(1);
  }

  console.log('🚀 Starting LinkedIn login helper...');
  console.log('📧 Email:', email);
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser so you can solve CAPTCHA
    slowMo: 50,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920x1080',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log('🌐 Navigating to LinkedIn login page...');
    await page.goto('https://www.linkedin.com/login', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await page.waitForTimeout(2000);

    console.log('📝 Entering credentials...');
    await page.type('#username', email, { delay: 100 });
    await page.waitForTimeout(500);
    await page.type('#password', password, { delay: 100 });
    await page.waitForTimeout(1000);

    console.log('🖱️  Clicking login button...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);

    if (currentUrl.includes('/checkpoint') || currentUrl.includes('security')) {
      console.log('');
      console.log('═════════════════════════════════════════════');
      console.log('🤖 CAPTCHA DETECTED!');
      console.log('═════════════════════════════════════════════');
      console.log('');
      console.log('👉 PLEASE SOLVE THE CAPTCHA IN THE BROWSER WINDOW');
      console.log('⏱️  Waiting up to 5 minutes for you to solve it...');
      console.log('');

      // Wait up to 5 minutes
      const startTime = Date.now();
      const maxWaitTime = 300000; // 5 minutes

      while (Date.now() - startTime < maxWaitTime) {
        await page.waitForTimeout(5000);
        
        const newUrl = page.url();
        if (!newUrl.includes('/checkpoint') && !newUrl.includes('security') && !newUrl.includes('/login')) {
          console.log('✅ CAPTCHA SOLVED! Continuing...');
          break;
        }
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        console.log(`   ⏱️  ${elapsed}s elapsed...`);
      }

      const finalUrl = page.url();
      if (finalUrl.includes('/checkpoint') || finalUrl.includes('security')) {
        throw new Error('CAPTCHA not solved within 5 minutes');
      }
    }

    // Check if login was successful
    if (currentUrl.includes('/login')) {
      throw new Error('Login failed - still on login page');
    }

    console.log('✅ Login successful!');
    console.log('💾 Saving cookies...');

    // Save cookies
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2));
    
    console.log('');
    console.log('═════════════════════════════════════════════');
    console.log('✅ SUCCESS! Cookies saved to:', COOKIE_FILE);
    console.log('═════════════════════════════════════════════');
    console.log('');
    console.log('📤 Next steps:');
    console.log('   1. Upload this file to your server:');
    console.log(`      scp ${COOKIE_FILE} your-server:/var/www/railway-scraper/`);
    console.log('   2. The scraper will now work without CAPTCHA!');
    console.log('');

    await page.waitForTimeout(3000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

loginAndSaveCookies();
