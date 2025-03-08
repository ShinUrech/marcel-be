/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: "linkedIn POST" SCRAPPING SCRIPT
export async function getAllLinkedInArticles() {
  const cookies = [
    {
      name: 'li_at',
      value:
        'AQEDAVVJnOIDt_qAAAABlUQtaV8AAAGVaDntX04AMB0OE07mKehb5VAZ5uX5Rme7BCaxPXHAkGuOVxh0mz1g3egk1FqWiZv3mzzjuVyMV-sLxWweHEiPeqPX3uIzmoDl2xmnsim9KeCQSEeYed9ppEu0',
      domain: '.linkedin.com',
    },
  ];
  const { browser, page } = await getPuppeteerInstance(cookies);

  // Navigate to the company's LinkedIn page
  // await page.goto('https://www.linkedin.com/company/railcare-ag/posts/'); // Replace with the actual company page URL

  // Navigate to the company's LinkedIn posts page
  const companyUrl = 'https://www.linkedin.com/company/microsoft/posts/';
  await page.goto(companyUrl, { waitUntil: 'networkidle2', timeout: 60000 });

  let prevHeight = 0;
  while (true) {
    const newHeight = (await page.evaluate('document.documentElement.scrollHeight')) as number;
    if (newHeight === prevHeight) break;
    await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    prevHeight = newHeight;

    if (prevHeight > 5000) break;
  }

  // Scrape posts
  const posts = await page.evaluate(() => {
    const postElements = document.querySelectorAll('.feed-shared-update-v2'); // Selects posts
    return Array.from(postElements).map((post) => {
      const textElement = post.querySelector('.feed-shared-update-v2__description') as HTMLElement;
      const imgElement = post.querySelector('img');
      const dateElement = post.querySelector('span.t-12') as HTMLElement;

      return {
        text: textElement ? textElement.innerText.trim() : null,
        img: imgElement ? imgElement.src : null,
        date: dateElement ? dateElement.innerText.trim() : null,
      };
    });
  });

  await browser.close();

  return posts;
}
