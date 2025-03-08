/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "baublatt.ch/" SCRAPPING SCRIPT
export async function getAllBaublattArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.baublatt.ch/suche?fulltext=eisenbahn`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#app > div.main-content > div article.article-item')).map(
        (article) => {
          const url = article.querySelector('a')?.getAttribute('href');
          const title = article.querySelector('a h2.article-title') as HTMLElement;
          const description = article.querySelector('.article-teaser-text a') as HTMLElement;
          const date = article.querySelector('.article-date') as HTMLElement;
          const imageElement = article.querySelector('.article-image');

          const image = imageElement ? imageElement.getAttribute('src') : '';

          return {
            title: title?.innerText?.trim() || 'N/A',
            url: url || 'N/A',
            date: date?.innerText.trim() || 'N/A',
            description: description.innerText.trim() || 'N/A',
            image: image || 'N/A',
          };
        },
      );
    });

    articles.push(...teaserArticles);
    const nextPageUrl = await page.evaluate(() => {
      const nextPageElement = document.querySelector('.pagination .page-item a[rel="next"]') as HTMLElement;
      return nextPageElement ? nextPageElement.getAttribute('href') : null;
    });

    if (!nextPageUrl) break;

    pageCount++;
    await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
  }

  await browser.close();
  return articles;
}
