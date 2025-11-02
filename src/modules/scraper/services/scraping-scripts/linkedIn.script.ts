/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';
import { isAllowedLinkedInCompany } from '../scraping-config/target-sources.config';
import * as fs from 'fs';
import * as path from 'path';

// Cookie storage path
const COOKIE_FILE = path.join(process.cwd(), 'linkedin-cookies.json');

const env_vars = {
  LINKEDIN_EMAIL: process.env.LINKEDIN_EMAIL || '',
  LINKEDIN_PASSWORD: process.env.LINKEDIN_PASSWORD || '',
  LINKEDIN_HEADLESS: process.env.LINKEDIN_HEADLESS === 'true',
};

/**
 * Save cookies to file for reuse
 */
async function saveCookies(page: any): Promise<void> {
  try {
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIE_FILE, JSON.stringify(cookies, null, 2));
    console.log('✅ Cookies saved to:', COOKIE_FILE);
  } catch (error) {
    console.error('❌ Error saving cookies:', error);
  }
}

/**
 * Load cookies from file
 */
async function loadCookies(page: any): Promise<boolean> {
  try {
    if (!fs.existsSync(COOKIE_FILE)) {
      console.log('⚠️  No saved cookies found');
      return false;
    }

    const cookiesString = fs.readFileSync(COOKIE_FILE, 'utf-8');
    const cookies = JSON.parse(cookiesString);
    
    if (cookies.length === 0) {
      console.log('⚠️  Cookie file is empty');
      return false;
    }

    await page.setCookie(...cookies);
    console.log('✅ Loaded', cookies.length, 'cookies from file');
    return true;
  } catch (error) {
    console.error('❌ Error loading cookies:', error);
    return false;
  }
}

/**
 * Random delay to mimic human behavior
 */
function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Login to LinkedIn with manual CAPTCHA support
 */
async function loginToLinkedIn(page: any, headless: boolean): Promise<void> {
  console.log('🔐 Starting LinkedIn login...');

  // Go to LinkedIn login page
  await page.goto('https://www.linkedin.com/login', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  await randomDelay(2000, 3000);

  // Fill in credentials
  console.log('📝 Entering credentials...');
  await page.type('#username', env_vars.LINKEDIN_EMAIL, { delay: 100 });
  await randomDelay(500, 1000);
  await page.type('#password', env_vars.LINKEDIN_PASSWORD, { delay: 100 });
  await randomDelay(1000, 2000);

  // Click login button
  console.log('🖱️  Clicking login button...');
  await page.click('button[type="submit"]');

  // Wait for navigation
  await randomDelay(3000, 5000);

  // Check current URL
  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);

  // Check for CAPTCHA
  if (currentUrl.includes('/checkpoint') || currentUrl.includes('security')) {
    console.log('');
    console.log('   ========================================');
    console.log('   🤖 CAPTCHA DETECTED!');
    console.log('   ========================================');
    console.log('');
    
    if (!headless) {
      console.log('   ✋ PLEASE SOLVE THE CAPTCHA MANUALLY');
      console.log('   The browser window is open');
      console.log('   Waiting up to 3 minutes for you to solve it...');
      console.log('');
      
      // Wait up to 3 minutes for manual CAPTCHA solving
      const startTime = Date.now();
      const maxWaitTime = 180000; // 3 minutes
      
      while (Date.now() - startTime < maxWaitTime) {
        await randomDelay(5000, 5000); // Check every 5 seconds
        
        const newUrl = page.url();
        if (!newUrl.includes('/checkpoint') && !newUrl.includes('security')) {
          console.log('   ✅ CAPTCHA SOLVED! Continuing...');
          break;
        }
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        console.log(`   ⏱️  Waiting... ${elapsed}s elapsed`);
      }
      
      // Check final state
      const finalUrl = page.url();
      if (finalUrl.includes('/checkpoint') || finalUrl.includes('security')) {
        throw new Error('CAPTCHA not solved within 3 minutes. Please try again.');
      }
      
    } else {
      console.log('   ❌ Running in headless mode - cannot solve CAPTCHA');
      console.log('');
      console.log('   TO FIX: Set LINKEDIN_HEADLESS=false in .env to solve CAPTCHA manually');
      console.log('');
      throw new Error('CAPTCHA detected. Set LINKEDIN_HEADLESS=false and solve manually.');
    }
  }

  // Check if still on login page
  if (currentUrl.includes('/login')) {
    throw new Error('Login failed - check credentials or manual intervention needed');
  }

  console.log('✅ Login successful!');
  
  // Save cookies after successful login
  await saveCookies(page);
  
  await randomDelay(2000, 3000);
}

//**/ NOTE: "linkedIn POST" SCRAPPING SCRIPT WITH CAPTCHA SUPPORT
export async function getAllLinkedInArticles(companyName: string) {
  // Validate if company is in approved list
  if (!isAllowedLinkedInCompany(companyName)) {
    console.warn(`⚠️  LinkedIn company '${companyName}' is not in the approved list. Skipping scraping.`);
    return [];
  }

  console.log(`✅ LinkedIn company '${companyName}' is approved. Starting scraping...`);
  
  const headless = env_vars.LINKEDIN_HEADLESS;
  const { browser, page } = await getPuppeteerInstance([], headless);

  try {
    // Try to load existing cookies first
    const cookiesLoaded = await loadCookies(page);

    // Navigate to company page
    await page.goto(`https://www.linkedin.com/company/${companyName}/posts/`, { 
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    const currentUrl = page.url();
    
    // If redirected to login or cookies invalid, login again
    if (currentUrl.includes('/login') || currentUrl.includes('/checkpoint')) {
      console.log('⚠️  Cookies expired or invalid, logging in...');
      await loginToLinkedIn(page, headless);
      
      // Navigate to company page again after login
      await page.goto(`https://www.linkedin.com/company/${companyName}/posts/`, { 
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
    } else if (cookiesLoaded) {
      console.log('✅ Cookies are valid! Skipping login.');
    }

    // Scroll to load posts
    console.log('📜 Scrolling to load posts...');
    let prevHeight = 0;
    while (true) {
      const newHeight = (await page.evaluate('document.documentElement.scrollHeight')) as number;
      if (newHeight === prevHeight) break;
      await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      prevHeight = newHeight;

      if (prevHeight > 20000) break; // Limit scroll depth
    }

    // Scrape posts
    console.log('📊 Extracting posts...');
    const posts = await page.evaluate(
      (articleType, companyName) => {
        const postElements = document.querySelectorAll('.feed-shared-update-v2');
        return Array.from(postElements).map((post) => {
          const textElement = post.querySelector('.feed-shared-update-v2__description') as HTMLElement;
          const imgElement =
            post.querySelector('img.update-components-article__image') ||
            post.querySelector('img.update-components-image__image');

          const companyImgElement = post.querySelector('img');

          const dateElement = post.querySelector('.update-components-actor__sub-description > span') as HTMLElement;
          return {
            baseUrl: window.location.href,
            type: articleType,
            dateText: dateElement
              ? dateElement.innerText
                  .replace(/\•/g, '')
                  .replace(/\Modifié/g, '')
                  .trim()
              : 'N/A',
            originalContent: textElement ? textElement.innerHTML.trim() : 'N/A',
            image: imgElement ? imgElement?.getAttribute('src') : 'N/A',
            metadata: {
              icon: companyImgElement ? companyImgElement?.getAttribute('src') : 'N/A',
              source: companyName,
            },
          };
        });
      },
      ArticleType.LinkedIn,
      companyName,
    );

    console.log(`✅ Scraped ${posts.length} posts from ${companyName}`);
    return posts;

  } catch (error) {
    console.error('❌ LinkedIn scraping error:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

