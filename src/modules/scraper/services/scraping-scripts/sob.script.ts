/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
//**/ NOTE: "sob.ch/" SCRAPPING SCRIPT
export async function getAllSobArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://direkt.sob.ch/archiv`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  const pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.archive-container > .article')).map((article) => {
      const url = article?.querySelector('.article-header a').getAttribute('href');
      const title = article.querySelector('.article-header__title h2 span') as HTMLElement;
      const titleSub = article.querySelector('.subtitle') as HTMLElement;
      const description = article.querySelector('.article-content__teaser p') as HTMLElement;
      const date = article.querySelector('.article-header__date time')?.getAttribute('datetime');
      const imageElement = article.querySelector('.article-image__wrap img');
      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        title: title?.innerText?.trim() || titleSub?.innerText?.trim() || 'N/A',
        url: `https://direkt.sob.ch${url}` || 'N/A',
        date: date || 'N/A',
        description: description?.innerText.trim() || 'N/A',
        image: `https://direkt.sob.ch${image}` || 'N/A',
      };
    });
  });

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}
