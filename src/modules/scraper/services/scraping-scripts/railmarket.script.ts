/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "railmarket.com/" SCRAPPING SCRIPT
export async function getAllRailMarketArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://de.railmarket.com/news/search?query=schweiz`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#content > div article')).map((article) => {
        const url = article.querySelector('h3 a')?.getAttribute('href');
        const title = article.querySelector('h3 a') as HTMLElement;
        const description = article.querySelector('p');
        const date = article.querySelector('.media-body small') as HTMLElement;
        const imageElement = article.querySelector('.col-md-5 img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `https://de.railmarket.com${url}` || 'N/A',
          date: date?.innerText.trim() || 'N/A',
          description: description.innerText.trim() || 'N/A',
          image: image || 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    const nextPageExists = await page.evaluate(() => {
      const nextPage = document.querySelector('.pagination .page-item:last-child a');
      return nextPage ? nextPage.getAttribute('aria-label') === 'Last page' : false;
    });

    if (!nextPageExists) break;

    // Trouver la page active
    const nextPageLink = await page.evaluateHandle(() => {
      const activePage = document.querySelector('.pagination .page-item.active');
      return activePage ? activePage.nextElementSibling?.querySelector('a') : null;
    });

    if (!nextPageLink) {
      console.log('No more pages.');
      break;
    }

    console.log('Clicking on next page...');
    await nextPageLink.click();

    // Attendre que la nouvelle page se charge
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    pageCount++;
  }

  await browser.close();
  return articles;
}
