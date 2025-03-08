/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "doppelmayr.com/" SCRAPPING SCRIPT
export async function getAllDoppelArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.doppelmayr.com/wissen-entdecken/news-termine/`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  console.log(`Scraping page ${pageCount}...`);
  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#dummy-id div.row.masonry-container.is-scrollable .item')).map(
      (article) => {
        const url = article.querySelector('a.link-holder-teaser')?.getAttribute('href');
        const title = article.querySelector('.headline.h5') as HTMLElement;
        const description = article.querySelector('.text') as HTMLElement;
        const imageElement = article.querySelector('.img-holder img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `https://www.doppelmayr.com${url}` || 'N/A',
          date: 'N/A',
          description: description.innerText.trim() || 'N/A',
          image: image || 'N/A',
        };
      },
    );
  });

  articles.push(...teaserArticles);

  // Trouver la page active

  const nextPageLink = await page.evaluateHandle(() => {
    const activePage = document.querySelector('#dummy-id > div > div.row.load-more-row > div > button');
    return activePage ? activePage : null;
  });
  try {
    if (!nextPageLink) {
      console.log('No more pages.');
    }

    console.log('Clicking on next page...');
    await nextPageLink.click();

    await new Promise((resolve) => setTimeout(resolve, 1500));

    pageCount++;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {}

  await browser.close();
  return articles;
}
