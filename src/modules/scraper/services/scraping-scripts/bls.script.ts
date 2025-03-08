/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
export async function getAllBlsArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.bls.ch/de/unternehmen/medien/medienmitteilungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  console.log(`Scraping page ${1}...`);
  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.mod_newslistitem')).map((article) => {
      const url = article.querySelector('.title')?.getAttribute('href');
      const title = article.querySelector('.title') as HTMLElement;
      const date = article.querySelector('.date') as HTMLElement;

      return {
        title: title?.innerText?.trim() || 'N/A',
        url: `https://www.bls.ch${url}` || 'N/A',
        date: date?.innerText.trim() || 'N/A',
        description: 'N/A',
        image: 'N/A',
      };
    });
  });

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}

//**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
export async function getAllBlsAdArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.bls.ch/de/unternehmen/medien/ad-hoc-mitteilungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  console.log(`Scraping page ${1}...`);
  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.mod_newslistitem')).map((article) => {
      const url = article.querySelector('.title')?.getAttribute('href');
      const title = article.querySelector('.title') as HTMLElement;
      const date = article.querySelector('.date') as HTMLElement;

      return {
        title: title?.innerText?.trim() || 'N/A',
        url: `https://www.bls.ch${url}` || 'N/A',
        date: date?.innerText.trim() || 'N/A',
        description: 'N/A',
        image: 'N/A',
      };
    });
  });

  articles.push(...teaserArticles);

  await browser.close();
  return articles;
}
