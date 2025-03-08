/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "hupac.com/" SCRAPPING SCRIPT
export async function getAllHupacArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.hupac.com/DE/Alle-News-28364800`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  const PAGES_COUNT = 8;

  for (let index = 0; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${pageCount}...`);
    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#fric_7633 .ItemList')).map((article) => {
        const url = article.querySelector('.LinkOverAllSimple a')?.getAttribute('href');
        const title = article.querySelector('.ObjListTitolo h3') as HTMLElement;
        const date = article.querySelector('.ObjListData') as HTMLElement;

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `https://www.hupac.com/${url}` || 'N/A',
          date: date?.innerText.trim() || 'N/A',
          description: 'N/A',
          image: 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    try {
      const nextPageUrl = `https://www.hupac.com/DE/Alle-News-28364800?param_sla=&ris_n=346&snumint1=0&ric_caller=&fric=7633&ris_pg=${index}&param_cat0=0&param_cat1=0&param_textsearch=&param_data=0000-00-00&param_data1=0000-00-00&param_data2=0000-00-00&param_parint=0&catinv=#p7633`;
      await page.goto(nextPageUrl, { waitUntil: 'networkidle2' });
      pageCount++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      break;
    }
  }

  await browser.close();
  return articles;
}
