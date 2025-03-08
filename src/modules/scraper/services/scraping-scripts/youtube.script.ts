/* eslint-disable prettier/prettier */
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';

//**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT
export const getAllVideos = async (channelName: string): Promise<any[]> => {
  const { browser, page } = await getPuppeteerInstance();

  const channelUrl = `https://www.youtube.com/@${channelName}/videos`;
  await page.goto(channelUrl, { waitUntil: 'networkidle2' });
  // Scroll down to load all videos
  let prevHeight = 0;
  while (true) {
    const newHeight = (await page.evaluate('document.documentElement.scrollHeight')) as number;
    if (newHeight === prevHeight) break;
    await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    prevHeight = newHeight;
  }
  const videos = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('ytd-rich-grid-media')).map((video) => ({
      title: (video.querySelector('a#video-title-link') as HTMLElement)?.innerText.trim() || 'N/A',
      url: `https://www.youtube.com${video.querySelector('a#video-title-link')?.getAttribute('href') || ''}`,
      views: (video.querySelector('span.inline-metadata-item') as HTMLElement)?.innerText.trim() || 'N/A',
      uploadDate: (video.querySelectorAll('span.inline-metadata-item')[1] as HTMLElement)?.innerText.trim() || 'N/A',
      thumbnail: video.querySelector('img')?.getAttribute('src') || 'N/A',
    }));
  });

  await browser.close();
  return videos;
};

//**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT WITH SEARCH
export const getAllVideosFromSearch = async (channelName: string, term: string): Promise<any[]> => {
  const { browser, page } = await getPuppeteerInstance();

  const channelUrl = `https://www.youtube.com/@${channelName}/search?query=${term}`;
  await page.goto(channelUrl, { waitUntil: 'networkidle2' });
  // Scroll down to load all videos
  let prevHeight = 0;
  while (true) {
    const newHeight = (await page.evaluate('document.documentElement.scrollHeight')) as number;
    if (newHeight === prevHeight) break;
    await page.evaluate('window.scrollTo(0, document.documentElement.scrollHeight)');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    prevHeight = newHeight;
  }

  const videos = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('ytd-item-section-renderer')).map((video) => ({
      title: (video.querySelector('yt-formatted-string.ytd-video-renderer') as HTMLElement)?.innerText.trim() || 'N/A',
      url: `https://www.youtube.com${video.querySelector('a#video-title')?.getAttribute('href') || ''}`,
      views: (video.querySelector('span.inline-metadata-item') as HTMLElement)?.innerText.trim() || 'N/A',
      uploadDate: (video.querySelectorAll('span.inline-metadata-item')[1] as HTMLElement)?.innerText.trim() || 'N/A',
      thumbnail: video.querySelector('img')?.getAttribute('src') || 'N/A',
      description: (video.querySelector('yt-formatted-string#description-text') as HTMLElement)?.innerText.trim(),
    }));
  });

  await browser.close();
  return videos;
};
