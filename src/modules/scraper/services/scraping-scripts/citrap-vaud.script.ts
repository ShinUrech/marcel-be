/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "citrap-vaud.ch/" SCRAPPING SCRIPT
export async function getAllCitrapArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.citrap-vaud.ch/?page_id=4487`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#content > article.post')).map((article) => {
        const dateElement = article.querySelector('.entry-meta time') as HTMLElement;
        const titleElement = article.querySelector('.entry-title a') as HTMLElement;
        const imageElement = article.querySelector('.entry-content img')?.getAttribute('src');
        const descriptionElement = article.querySelector('.entry-content p') as HTMLElement;

        return {
          title: titleElement?.innerText?.trim() || 'N/A',
          url: titleElement?.getAttribute('href') || 'N/A',
          date: dateElement?.innerText.trim() || 'N/A',
          img: imageElement,
          description: descriptionElement?.innerText.trim() || 'N/A',
        };
      });
    });
    articles.push(...teaserArticles);
    const nextPageButton = await page.$('.nav-previous a');

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
