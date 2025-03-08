/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "bahnberufe.de/" SCRAPPING SCRIPT
export async function getAllBahnberufeArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.bahnberufe.de/bahn-news/`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('li[id^="post-"]')).map((article) => {
        const url = article.querySelector('a')?.getAttribute('href');
        const title = article.querySelector('a') as HTMLElement;
        const description = article.querySelector('.wp-block-latest-posts__post-excerpt p') as HTMLElement;
        const date = article.querySelector('time') as HTMLElement;
        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `https://www.bernmobil.ch${url}` || 'N/A',
          date: date?.innerText.trim() || 'N/A',
          description: description.innerText.trim() || 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);
    const nextPageButton = await page.$('a.next.page-numbers');

    if (nextPageButton) {
      const nextPageUrl = await page.evaluate((el) => el.href, nextPageButton);
      console.log(`Navigating to: ${nextPageUrl}`);
      await page.goto(nextPageUrl, { waitUntil: 'load', timeout: 0 });
      pageCount++;
    } else {
      console.log('No more pages. Scraping complete.');
      break;
    }
  }

  await browser.close();
  return articles;
}
