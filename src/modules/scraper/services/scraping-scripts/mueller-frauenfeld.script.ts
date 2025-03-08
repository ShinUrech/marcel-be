/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
//**/ NOTE: "mueller-frauenfeld.ch/" SCRAPPING SCRIPT
export async function getAllMuellerFrauenNewsArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.mueller-frauenfeld.ch/de/ueber-uns/news.html`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  const PAGES_COUNT = 4;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${index}...`);
    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.box-flex-container > .box.three.columns')).map((article) => {
        const url = article?.querySelector('.box-link a')?.getAttribute('href');
        const title = article.querySelector('.box-title h3') as HTMLElement;
        const date = article.querySelector('.box-date') as HTMLElement;

        const imageElement = article.querySelector('.box-image img');
        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `https://www.mueller-frauenfeld.ch${url}` || 'N/A',
          date: date?.innerText.trim() || 'N/A',
          description: 'N/A',
          image: `https://www.mueller-frauenfeld.ch${image}` || 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    const string_Selector = '#news > div > div.trigger-wrapper > div';
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

//**/ NOTE: "mueller-frauenfeld.ch/" SCRAPPING SCRIPT
export async function getAllMuellerFrauenVideosArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.mueller-frauenfeld.ch/de/ueber-uns/videos.html`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];

  const PAGES_COUNT = 4;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${index}...`);
    const teaserArticles = await page.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return Array.from(document.querySelectorAll('.box-flex-container > .box.three.columns')).map((article) => {
        const title = article.querySelector('.box-title h3') as HTMLElement;
        const videoUrl = document.querySelector('.box-image iframe').getAttribute('data-cookieblock-src');
        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `${videoUrl}`,
          date: 'N/A',
          description: 'N/A',
          image: 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    const string_Selector = '#medien > div > div.trigger-wrapper > div';
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
