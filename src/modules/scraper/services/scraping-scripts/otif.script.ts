/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
//**/ NOTE: "otif.org/" SCRAPPING SCRIPT
export async function getAllOtifArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const pageUrl = `https://otif.org/de/?page_id=218`;

  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  console.log(`Scraping: ${pageUrl}`);

  const teaserArticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.jet-listing-grid__items > .jet-listing-grid__item')).map(
      (article) => {
        const dateElement = article.querySelector(
          '.jet-listing-dynamic-field .jet-listing-dynamic-field__content',
        ) as HTMLElement;
        const titleElement = article.querySelector('.elementor-heading-title') as HTMLElement;
        const imageElement = article.querySelector('.jet-listing-dynamic-image__img')?.getAttribute('src');
        const descriptionElement = article.querySelector('.jet-listing-dynamic-field p') as HTMLElement;

        return {
          title: titleElement?.innerText?.trim() || 'N/A',
          titleLink: titleElement?.getAttribute('href') || 'N/A',
          date: dateElement?.innerText.trim() || 'N/A',
          img: imageElement,
          description: descriptionElement?.innerText.trim() || 'N/A',
        };
      },
    );
  });

  await browser.close();
  return teaserArticles;
}
