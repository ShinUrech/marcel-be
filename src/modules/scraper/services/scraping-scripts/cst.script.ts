/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "cst.ch/news/" SCRAPPING SCRIPT
export async function getAllCstlArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.cst.ch/news/`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  const pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('article.et_pb_post')).map((article) => {
      const url = article.querySelector('.entry-title a')?.getAttribute('href');
      const title = article.querySelector('.entry-title a') as HTMLElement;
      const description = article.querySelector('.post-content-inner p') as HTMLElement;
      const date = article.querySelector('.post-meta .published') as HTMLElement;
      const imageElement = article.querySelector('.et_pb_image_container img');

      const image = imageElement ? imageElement.getAttribute('src') : '';

      return {
        title: title?.innerText?.trim() || 'N/A',
        url: `${url}` || 'N/A',
        date: date?.textContent.trim() || 'N/A',
        description: description.innerText.trim() || 'N/A',
        image: `${image}` || 'N/A',
      };
    });
  });

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}
