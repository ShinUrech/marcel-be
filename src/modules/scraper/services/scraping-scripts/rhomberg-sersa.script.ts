/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "rhomberg-sersa.com/" SCRAPPING SCRIPT
export async function getAllRhombergArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://magazin.rhomberg-sersa.com/de`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  const PAGES_COUNT = 3;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${index}...`);
    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.overview-card-wrapper a')).map((article) => {
        const url = article?.getAttribute('href');
        const title = article.querySelector('.overview-card-detail-content-title') as HTMLElement;
        const description = article.querySelector('.overview-card-detail-content-text p') as HTMLElement;
        const date = article.querySelector('.overview-card-detail-content-edition') as HTMLElement;
        const imageElement = article.querySelector('.card-gradient img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `${url}` || 'N/A',
          date: date?.innerText.trim() || 'N/A',
          description: description.innerText?.trim() || 'N/A',
          image: `https://magazin.rhomberg-sersa.com${image}` || 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    const string_Selector = '#overview-cards-1 > div > div.overview-block-more.text-centered > div';
    const loadMoreButton = await page.$(string_Selector);
    if (!loadMoreButton) break;

    const isDisabled = await page.evaluate((button) => button.getAttribute('disabled') !== null, loadMoreButton);

    if (isDisabled) break;

    await loadMoreButton.click();
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  await browser.close();
  return articles;
}
