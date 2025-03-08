/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "zentralbahn.ch/" SCRAPPING SCRIPT
export async function getAllZentralBahnArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://www.zentralbahn.ch/de/kennenlernen/geschaeftspartner/medienmitteilungen#Medienmitteilung`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  const PAGES_COUNT = 4;

  for (let index = 1; index < PAGES_COUNT; index++) {
    console.log(`Scraping page ${index}...`);
    const teaserArticles = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          ' #content > div.main-content > div > section.section.ce-news-list li.news-overview__item',
        ),
      ).map((article) => {
        const url = article.querySelector('.news-overview__link')?.getAttribute('href');
        const title = article.querySelector('.news-overview__title .h3-bold') as HTMLElement;
        const description = article.querySelector('figcaption .text') as HTMLElement;
        const imageElement = article.querySelector('.news-overview__image img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: `https://www.rbs.ch/${url}` || 'N/A',
          date: 'N/A',
          description: description.textContent.trim() || 'N/A',
          image: `https://www.rbs.ch/${image}` || 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    while (true) {
      const loadMoreButton = await page.$(
        '#content > div.main-content > div > section.section.ce-news-list button.pagination__list-item-link',
      );
      if (!loadMoreButton) break;

      const isDisabled = await page.evaluate((button) => button.getAttribute('disabled') !== null, loadMoreButton);

      if (isDisabled) break;

      await loadMoreButton.click();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  await browser.close();
  return articles;
}
