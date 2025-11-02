/**
 * LinkedIn CAPTCHA Solver Test Script - COMPLETE WITH CHECKPOINT HANDLING
 * This version handles LinkedIn security checkpoints that require manual verification
 */

const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs');
const path = require('path');

puppeteerExtra.use(StealthPlugin());
puppeteerExtra.use(
  RecaptchaPlugin({
    visualFeedback: true,
    throwOnError: false
  })
);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CONFIG = {
  email: 'a7195031@gmail.com',
  password: 'Mutsumi8139',
  companyToTest: 'google',
  headless: true,  // Set to FALSE to handle verification manually
  cookiesPath: path.join(__dirname, 'cookies', 'linkedin-test-cookies.json'),
};

async function testLinkedInCaptchaSolver() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  LinkedIn CAPTCHA Solver - Test Script    ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  let browser;
  try {
    console.log('🌐 Launching browser...');
    browser = await puppeteerExtra.launch({
      headless: CONFIG.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });

    const page = await browser.newPage();
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    if (fs.existsSync(CONFIG.cookiesPath)) {
      console.log('✅ Loading saved cookies...');
      try {
        const cookiesString = fs.readFileSync(CONFIG.cookiesPath, 'utf-8');
        const cookies = JSON.parse(cookiesString);
        await page.setCookie(...cookies);
        console.log('   Cookies loaded successfully\n');
      } catch (error) {
        console.log('⚠️  Failed to load cookies, will login fresh\n');
      }
    } else {
      console.log('ℹ️  No saved cookies found, will login fresh\n');
    }

    console.log('📝 Navigating to LinkedIn login page...');
    await page.goto('https://www.linkedin.com/login', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await delay(2000);

    const currentUrl = page.url();
    if (currentUrl.includes('/feed') || currentUrl.includes('/in/')) {
      console.log('✅ Already logged in using saved cookies!\n');
    } else {
      console.log('🔐 Entering credentials...');
      
      await page.waitForSelector('#username', { timeout: 10000 });
      await page.type('#username', CONFIG.email, { delay: 100 });
      console.log('   ✓ Email entered');
      
      await page.waitForSelector('#password', { timeout: 10000 });
      await page.type('#password', CONFIG.password, { delay: 100 });
      console.log('   ✓ Password entered');
      
      console.log('🔄 Clicking login button...');
      await page.click('button[type="submit"]');
      
      await delay(3000);

      console.log('🔍 Checking for CAPTCHA...');
      const captchaFrame = await page.$('iframe[src*="recaptcha"]');
      
      if (captchaFrame) {
        console.log('🤖 CAPTCHA DETECTED!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  Starting automatic CAPTCHA solver...');
        console.log('  This may take 30-60 seconds, please wait...');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        try {
          await page.solveRecaptchas();
          
          console.log('✅ CAPTCHA SOLVED SUCCESSFULLY!\n');
          await delay(3000);
        } catch (error) {
          console.error('❌ Automatic CAPTCHA solving failed:', error.message);
          
          if (!CONFIG.headless) {
            console.log('\n⏳ Please solve the CAPTCHA manually in the browser');
            console.log('   Waiting up to 2 minutes...\n');
            
            await delay(120000); // Wait 2 minutes
          } else {
            throw new Error('CAPTCHA solving failed in headless mode');
          }
        }
      } else {
        console.log('✅ No CAPTCHA detected\n');
      }

      await delay(5000);

      // Check current URL after login attempt
      let finalUrl = page.url();
      
      // Check for LinkedIn security checkpoint
      if (finalUrl.includes('/checkpoint/challenge') || finalUrl.includes('/checkpoint/')) {
        console.log('⚠️  LINKEDIN SECURITY CHECKPOINT DETECTED!\n');
        console.log('╔════════════════════════════════════════════╗');
        console.log('║     MANUAL VERIFICATION REQUIRED           ║');
        console.log('╚════════════════════════════════════════════╝\n');
        console.log('LinkedIn requires additional verification:');
        console.log('  • Email verification code');
        console.log('  • Phone verification code');
        console.log('  • Security questions');
        console.log('  • Or other identity verification\n');
        
        if (!CONFIG.headless) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('  A browser window should be open.');
          console.log('  Please complete the verification manually.');
          console.log('  You have 5 MINUTES to complete this.');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          console.log('⏳ Waiting for you to complete verification...\n');
          
          // Wait for navigation away from checkpoint (5 minutes max)
          try {
            await page.waitForFunction(
              () => !window.location.href.includes('/checkpoint/'),
              { timeout: 300000 } // 5 minutes
            );
            
            console.log('✅ Verification appears to be complete!\n');
            await delay(3000);
          } catch (error) {
            console.log('⏱️  Timeout reached. Checking if verification completed...\n');
          }
          
          // Check final URL
          finalUrl = page.url();
        } else {
          console.error('\n❌ ERROR: Checkpoint requires manual verification!');
          console.error('   Please run with headless: false\n');
          throw new Error('LinkedIn checkpoint requires manual verification');
        }
      }

      // Check if login was successful
      if (finalUrl.includes('/feed') || finalUrl.includes('/in/')) {
        console.log('✅ Login successful!\n');
        
        console.log('💾 Saving cookies for future use...');
        const cookies = await page.cookies();
        
        const cookiesDir = path.dirname(CONFIG.cookiesPath);
        if (!fs.existsSync(cookiesDir)) {
          fs.mkdirSync(cookiesDir, { recursive: true });
        }
        
        fs.writeFileSync(CONFIG.cookiesPath, JSON.stringify(cookies, null, 2));
        console.log(`   ✓ Cookies saved to: ${CONFIG.cookiesPath}\n`);
        console.log('💡 Next time you run this, it will use saved cookies!\n');
      } else {
        console.log('⚠️  Login status unclear');
        console.log(`   Current URL: ${finalUrl}\n`);
        console.log('   Attempting to continue anyway...\n');
      }
    }

    console.log(`📊 Testing company page scraping...`);
    console.log(`   Company: ${CONFIG.companyToTest}\n`);
    
    const companyUrl = `https://www.linkedin.com/company/${CONFIG.companyToTest}/posts/`;
    await page.goto(companyUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await delay(5000);

    console.log('📄 Extracting posts from page...');
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('div.feed-shared-update-v2');
      const results = [];

      postElements.forEach((post, index) => {
        if (index < 3) {
          const textElement = post.querySelector('.feed-shared-text__text-view span');
          const text = textElement ? textElement.textContent?.trim() : '';

          const timeElement = post.querySelector('time');
          const timestamp = timeElement ? timeElement.getAttribute('datetime') : '';

          if (text) {
            results.push({
              text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
              timestamp,
            });
          }
        }
      });

      return results;
    });

    if (posts.length > 0) {
      console.log(`✅ Successfully scraped ${posts.length} posts!\n`);
      
      posts.forEach((post, index) => {
        console.log(`━━━ Post ${index + 1} ━━━`);
        console.log(`Time: ${post.timestamp || 'N/A'}`);
        console.log(`Text: ${post.text}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No posts found\n');
      console.log('This could mean:');
      console.log('  • Login failed');
      console.log('  • Page structure changed');
      console.log('  • Need to scroll to load posts');
      console.log('  • Company has no posts\n');
    }

    console.log('╔════════════════════════════════════════════╗');
    console.log('║     TEST COMPLETED SUCCESSFULLY! 🎉        ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
    console.log('Next steps:');
    console.log('1. ✅ Your cookies are saved');
    console.log('2. 💡 Next run: Set headless: true for production');
    console.log('3. 🔧 Integrate into your NestJS scraper service\n');
    
    if (!CONFIG.headless) {
      console.log('Press ENTER to close the browser...');
      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });
    }

  } catch (error) {
    console.error('\n╔════════════════════════════════════════════╗');
    console.error('║          TEST FAILED ❌                    ║');
    console.error('╚════════════════════════════════════════════╝\n');
    console.error('Error:', error.message);
    console.error('\nStack trace:', error.stack);
    
    console.error('\nTroubleshooting:');
    console.error('- Make sure sox and ffmpeg are installed');
    console.error('- Check your LinkedIn credentials in CONFIG');
    console.error('- Make sure puppeteer-extra packages are installed');
    console.error('- For checkpoint: Run with headless: false\n');
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed\n');
    }
  }
}

if (CONFIG.email === 'YOUR_EMAIL@example.com' || CONFIG.password === 'YOUR_PASSWORD') {
  console.error('╔════════════════════════════════════════════╗');
  console.error('║          CONFIGURATION ERROR ❌            ║');
  console.error('╚════════════════════════════════════════════╝\n');
  console.error('ERROR: Please set your LinkedIn credentials!\n');
  console.error('Edit this file and change email and password in CONFIG.\n');
  process.exit(1);
}

testLinkedInCaptchaSolver()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
