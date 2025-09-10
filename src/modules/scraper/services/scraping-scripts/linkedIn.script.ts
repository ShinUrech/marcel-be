/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';
import { isAllowedLinkedInCompany } from '../scraping-config/target-sources.config';

const env_vars = {
  LINKEDIN_EMAIL: process.env.LINKEDIN_EMAIL || 'TO REPLACE',
  LINKEDIN_PASSWORD: process.env.LINKEDIN_PASSWORD || 'TO REPLACE',
};

//**/ NOTE: "linkedIn POST" SCRAPPING SCRIPT
export async function getAllLinkedInArticles(companyName: string) {
  // Validate if company is in approved list
  if (!isAllowedLinkedInCompany(companyName)) {
    console.warn(`⚠️  LinkedIn company '${companyName}' is not in the approved list. Skipping scraping.`);
    return [];
  }

  console.log(`✅ LinkedIn company '${companyName}' is approved. Starting scraping...`);
  const { browser, page } = await getPuppeteerInstance();

  // Navigate to LinkedIn login page
  await page.goto(`https://www.linkedin.com/company/${companyName}/posts/`, { waitUntil: 'networkidle2' });

  // Type in email and password
  await page.type('#username', env_vars['LINKEDIN_EMAIL'], { delay: 100 });
  await page.type('#password', env_vars['LINKEDIN_PASSWORD'], { delay: 100 });

  // Click on the login button
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 180000 });

  let prevHeight = 0;
  while (true) {
    const newHeight = (await page.evaluate('document.documentElement.scrollHeight')) as number;
    if (newHeight === prevHeight) break;
    await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    prevHeight = newHeight;

    if (prevHeight > 20000) break;
  }

  // Scrape posts
  const posts = await page.evaluate(
    (articleType, companyName) => {
      const postElements = document.querySelectorAll('.feed-shared-update-v2'); // Selects posts
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

  await browser.close();

  return posts;
}
