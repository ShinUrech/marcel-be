/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "vvl.ch/" SCRAPPING SCRIPT
//! NOTE : COMPLETED
export async function getAllVvlArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.vvl.ch/news`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  const pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.news-item')).map((article) => {
      const url = article.querySelector('.description a')?.getAttribute('href');
      const title = article.querySelector('.description-container strong') as HTMLElement;
      const description = article.querySelector('.description') as HTMLElement;

      const date = article.querySelector('.date.blue') as HTMLElement;

      return {
        title: title?.innerText?.trim() || 'N/A',
        url: `https://www.aargauverkehr.ch${url}` || 'N/A',
        date: date?.innerText.trim() || 'N/A',
        description: description.outerHTML.trim() || 'N/A',
        image: 'N/A',
      };
    });
  });

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}
