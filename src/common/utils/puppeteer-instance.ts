/* eslint-disable prettier/prettier */
import puppeteer from 'puppeteer';
export const getPuppeteerInstance = async (cookie = []) => {
  const browser = await puppeteer.launch({ headless: false });
  if (cookie.length) {
    browser.setCookie(...cookie);
  }
  const page = await browser.newPage();
  return { browser, page };
};
