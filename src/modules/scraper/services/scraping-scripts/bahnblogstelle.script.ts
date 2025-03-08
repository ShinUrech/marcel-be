/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "bahnblogstelle.com/" SCRAPPING SCRIPT
export async function getAllBahnBlogArticles() {
  const { browser, page } = await getPuppeteerInstance();

  const baseUrl = `https://bahnblogstelle.com/?s=schweiz`;

  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  const articles = [];
  let pageCount = 1;

  while (true) {
    console.log(`Scraping page ${pageCount}...`);

    const teaserArticles = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#main div.post.type-post')).map((article) => {
        const url = article.querySelector('.entry-title a')?.getAttribute('href');
        const title = article.querySelector('.entry-title a') as HTMLElement;
        const description = article.querySelector('.entry-content p') as HTMLElement;
        const date = article.querySelector('.entry-meta .date a') as HTMLElement;

        const imageElement = article.querySelector('.post-img');

        const image = imageElement ? imageElement.getAttribute('src') : '';

        return {
          title: title?.innerText?.trim() || 'N/A',
          url: url || 'N/A',
          date: date?.innerText.trim() || 'N/A',
          description: description?.innerText.trim() || 'N/A',
          image: image || 'N/A',
        };
      });
    });

    articles.push(...teaserArticles);

    const nextButton = await page.evaluate(() => {
      const activePage = document.querySelector('#main > nav .next.page-numbers')?.getAttribute('href');
      return activePage ? activePage : null;
    });

    if (!nextButton) {
      console.log('No more pages. Exiting...');
      break;
    }

    try {
      const nextPageUrl = `${nextButton}`;
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
