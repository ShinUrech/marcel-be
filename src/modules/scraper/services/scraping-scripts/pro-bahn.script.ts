/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "pro-bahn.ch/" SCRAPPING SCRIPT
export async function getAllProBahnArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.pro-bahn.ch/schweiz/aktuell/aktuelle-meldungen`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('#mesch-filter-list-b285 > div.mesch-filter-list-result > div.news-item'),
      ).map((article) => {
        const url = article.querySelector('a')?.getAttribute('href');
        const title = article.querySelector('h3') as HTMLElement;
        const description = article.querySelector('p:nth-of-type(2)') as HTMLElement;
        const date = article.querySelector('.news-date') as HTMLElement;

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: url || 'N/A',
          date: date?.innerText.trim() || 'N/A',
          description: description.innerText.trim() || 'N/A',
          image: 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    // Trouver la page active
    const nextPageLink = await page.evaluateHandle(() => {
      const activePage = document.querySelector('div.ccm-pagination-wrapper > ul > li.next > a');
      return activePage ? activePage : null;
    });
    try {
      if (!nextPageLink) {
        console.log('No more pages.');
        break;
      }

      console.log('Clicking on next page...');
      await nextPageLink.click();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      pageCount++;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      break;
    }
  }

  await browser.close();
  return articles;
}
