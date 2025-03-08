/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "zvv.ch/" SCRAPPING SCRIPT
export async function getAllZvvArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.zvv.ch/de/ueber-uns/zuercher-verkehrsverbund/news.html`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  console.log(`Scraping page ${1}...`);
  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.cmp-teaser')).map((article) => {
      const url = article.querySelector('.cmp-teaser__link')?.getAttribute('href');
      const title = article.querySelector('.cmp-teaser__title') as HTMLElement;
      const date = article.querySelector('.cmp-teaser__pretitle') as HTMLElement;

      const imageElement = article.querySelector('.cmp-image__image');

      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        title: title?.innerText?.trim() || 'N/A',
        url: `https://www.stadt-zuerich.ch${url}` || 'N/A',
        date: date?.innerText.trim() || 'N/A',
        description: 'N/A',
        image: `https://www.zvv.ch${image}` || 'N/A',
      };
    });
  });

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}
