/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class ScraperDeeperService {
  private async getPuppeteerInstance(cookie = []) {
    const browser = await puppeteer.launch({ headless: false });
    if (cookie.length) {
      browser.setCookie(...cookie);
    }
    const page = await browser.newPage();
    return { browser, page };
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getRoalpsArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#main > section .section__content')).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getSevOnlineArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('body > div.wrapper > div > div > div.main-content > div.content.block.cf > article'),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  // TODO: NOT FINISH
  async getOtifArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-element_type="container"]')).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getCitrapArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#content > article')).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getBernmobilArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#content > section > article')).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getBahnberufeArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#page-wrapper > div.container-fluid')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getLokReportArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#k2Container')).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getLokRailMarketArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          '#content > div > div.container.space-bottom-1 > div > div.col-12.col-lg-8.mb-5.mb-lg-0',
        ),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getBaublattArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#app article.article:not(.article-item)')).map(
        (article: HTMLElement) => {
          return article.textContent;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getProBahnArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#content')).map((article: HTMLElement) => {
        return article.textContent;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getPressEportalArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('body > main article > .card')).map((article: HTMLElement) => {
        return article.textContent;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getBahnBlogArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#main > div.post.type-post')).map((article: HTMLElement) => {
        return article.textContent;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getHupacArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          '#bodypage > div:nth-child(1) > table > tbody > tr:nth-child(4) > td > div > table > tbody > tr > td.ZonaCore > table',
        ),
      ).map((article: HTMLElement) => {
        return article.textContent;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getDoppelArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('#__layout > div > div > div > div.page-wrapper.gated-false > div.block-holder'),
      ).map((article: HTMLElement) => {
        return article.textContent;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getAarglArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('div[data-eb-posts]')).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getRbslArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#main-page-container > main > div > div.layout-content')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getCstlArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          'article > div.entry-content > div > div > div.et_pb_section  div.et_pb_column_2.et-last-child',
        ),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getCarGorailArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('article > div.entry-content > div.et-l.et-l--post div.et_pb_text_inner'),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getZentralBahnArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('#content > div.main-content > div > section.container.section.ce-text'),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getStadtArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('#content > div > stzh-pagecontent > div > div > stzh-section stzh-content'),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getZvvArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('main.container div.container div.cmp-wrapper:not(.infobox) > div.cmp-text'),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getAlstomArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#block-alstom-contenudelapageprincipale > div.content section')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getAbbArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#PublicWrapper > section.templateMainSection > main > article')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getRhombergArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          'body > div.content > div.block-container-background > article > section.block--text',
        ),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getBlsArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#main > div.mod_paper.paper-high.container .paper-items')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getMuellerFrauenNewsArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#news > article > div > div.five.columns.offset-by-one')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getCVanoliArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('body section.section-news-single div.section-text')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getPressePortalArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#main article > div.article__body')).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }

  async getRhbProjectArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('section > div.panel_content div.mod_content_text p.bodytext')).map(
        (article: HTMLElement) => {
          return article.innerText;
        },
      );
    });

    await browser.close();
    return originalArticle.join();
  }

  async getSobArticle(pageUrl: string) {
    const { browser, page } = await this.getPuppeteerInstance();

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const originalArticle = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('div.news.news-single div.article  div.col-12.col-md-6.col-lg-8'),
      ).map((article: HTMLElement) => {
        return article.innerText;
      });
    });

    await browser.close();
    return originalArticle.join();
  }
}
