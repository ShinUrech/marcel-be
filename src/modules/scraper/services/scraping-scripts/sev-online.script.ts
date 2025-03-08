/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "sev-online.ch/" SCRAPPING SCRIPT
export const getAllSevOnlineArticles = async () => {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://sev-online.ch/de/medien/medienmitteilung`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  // Extract the last page number from the pagination links
  const totalPages = await page.evaluate(() => {
    const lastPageLink = document.querySelector('.MarkupPagerNavLastNum a');
    return lastPageLink ? parseInt(lastPageLink.getAttribute('href').match(/page(\d+)$/)?.[1] || '1') : 1;
  });

  console.log(`Total pages found: ${totalPages}`);

  const allArticles = [];

  // Loop through each page
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const pageUrl = pageNumber === 1 ? baseUrl : `${baseUrl}/page${pageNumber}`;
    console.log(`Scraping: ${pageUrl}`);

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.widget-content > article.cf')).map((article) => {
        const titleElement = article.querySelector('article a') as HTMLElement;
        const dateElement = article.querySelector('article .date') as HTMLElement;
        const descriptionElement = article.querySelector('article p').childNodes[5] as HTMLElement; // The text node containing the description

        return {
          title: titleElement?.innerText?.trim() || 'N/A',
          titleLink: titleElement?.getAttribute('href') || 'N/A',
          date: dateElement?.innerText.trim() || 'N/A',
          description: descriptionElement?.textContent?.trim() || 'N/A',
        };
      });
    });
    allArticles.push(...teaserArticles);
  }

  await browser.close();
  return allArticles;
};
