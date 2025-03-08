/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { getAllVideos, getAllVideosFromSearch } from './scraping-scripts/youtube.script';
import { getAllRoalpsArticles } from './scraping-scripts/roalps.script';
import { getAllSevOnlineArticles } from './scraping-scripts/sev-online.script';
import { getAllOtifArticles } from './scraping-scripts/otif.script';
import { getAllCitrapArticles } from './scraping-scripts/citrap-vaud.script';
import { getAllBernmobilArticles } from './scraping-scripts/bernmobil.script';
import { getAllBahnberufeArticles } from './scraping-scripts/bahnberufe.script';
import { getAllLokReportArticles } from './scraping-scripts/lok-report.script';
import { getAllRailMarketArticles } from './scraping-scripts/railmarket.script';
import { getAllBaublattArticles } from './scraping-scripts/baublatt.script';
import { getAllProBahnArticles } from './scraping-scripts/pro-bahn.script';
import { getAllPressEportalArticles, getAllPressePortalEmArticles } from './scraping-scripts/presseportal.script';
import { getAllBahnBlogArticles } from './scraping-scripts/bahnblogstelle.script';
import { getAllLinkedInArticles } from './scraping-scripts/linkedIn.script';
import { getAllHupacArticles } from './scraping-scripts/hupac.script';
import { getAllDoppelArticles } from './scraping-scripts/doppelmayr.script';
import { getAllAarglArticles } from './scraping-scripts/aargauverkehr.script';
import { getAllVvlArticles } from './scraping-scripts/vvl.script';
import { getAllRbslArticles } from './scraping-scripts/rbs.script';
import { getAllCstlArticles } from './scraping-scripts/cst.script';
import { getAllCarGorailArticles } from './scraping-scripts/cargorail.script';
import { getAllZentralBahnArticles } from './scraping-scripts/zentralbahn.script';
import { getAllVoevArticles } from './scraping-scripts/voev.script';
import { getAllStadtArticles } from './scraping-scripts/stadt-zuerich.script';
import { getAllZvvArticles } from './scraping-scripts/zvv.script';
import { getAllAlstomArticles } from './scraping-scripts/alstom.script';
import { getAllAbbArticles } from './scraping-scripts/abb.script';
import { getAllRhombergArticles } from './scraping-scripts/rhomberg-sersa.script';
import { getAllBlsAdArticles, getAllBlsArticles } from './scraping-scripts/bls.script';
import { getAllSbbCargoArticles } from './scraping-scripts/sbbcargo.script';
import {
  getAllMuellerFrauenNewsArticles,
  getAllMuellerFrauenVideosArticles,
} from './scraping-scripts/mueller-frauenfeld.script';
import { getAllCVanoliArticles } from './scraping-scripts/c-vanoli.script';
import { getAllRhbNewsArticles, getAllRhbProjectArticles } from './scraping-scripts/rhb.script';
import { getAllSobArticles } from './scraping-scripts/sob.script';
import { ArticlesService } from './articles.service';

@Injectable()
export class ScraperService {
  constructor(private articlesService: ArticlesService) {}

  //**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT
  async getAllVideos(channelName: string): Promise<any[]> {
    return getAllVideos(channelName);
  }
  //**/ NOTE: YOUTUBE CHANEL SCRAPPING SCRIPT WITH SEARCH
  async getAllVideosFromSearch(channelName: string, term: string): Promise<any[]> {
    return getAllVideosFromSearch(channelName, term);
  }
  //**/ NOTE: "roalps.ch" SCRAPPING SCRIPT
  async getAllRoalpsArticles() {
    const articles = await getAllRoalpsArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      await this.articlesService.createArticle(article);
    }

    return articles;
  }
  //**/ NOTE: "sev-online.ch/" SCRAPPING SCRIPT
  async getAllSevOnlineArticles() {
    const articles = await getAllSevOnlineArticles();

    for (let index = 0; index < articles.length; index++) {
      const article = articles[index];
      await this.articlesService.createArticle(article);
    }

    return articles;
  }

  //**/ NOTE: "otif.org/" SCRAPPING SCRIPT
  async getAllOtifArticles() {
    return getAllOtifArticles();
  }

  //**/ NOTE: "citrap-vaud.ch/" SCRAPPING SCRIPT
  async getAllCitrapArticles() {
    return getAllCitrapArticles();
  }

  //**/ NOTE: "bernmobil.ch/" SCRAPPING SCRIPT
  async getAllBernmobilArticles() {
    return getAllBernmobilArticles();
  }

  //**/ NOTE: "bahnberufe.de/" SCRAPPING SCRIPT
  async getAllBahnberufeArticles() {
    return getAllBahnberufeArticles();
  }

  //**/ NOTE: "lok-report.de/" SCRAPPING SCRIPT
  async getAllLokReportArticles() {
    return getAllLokReportArticles();
  }

  //**/ NOTE: "railmarket.com/" SCRAPPING SCRIPT
  async getAllRailMarketArticles() {
    return getAllRailMarketArticles();
  }

  //**/ NOTE: "baublatt.ch/" SCRAPPING SCRIPT
  async getAllBaublattArticles() {
    return getAllBaublattArticles();
  }

  //**/ NOTE: "pro-bahn.ch/" SCRAPPING SCRIPT
  async getAllProBahnArticles() {
    return getAllProBahnArticles();
  }

  //**/ NOTE: "presseportal.ch/" SCRAPPING SCRIPT
  async getAllPressEportalArticles() {
    return getAllPressEportalArticles();
  }

  //**/ NOTE: "bahnblogstelle.com/" SCRAPPING SCRIPT
  async getAllBahnBlogArticles() {
    return getAllBahnBlogArticles();
  }

  //**/ NOTE: "linkedIn POST" SCRAPPING SCRIPT
  async getAllLinkedInArticles() {
    await getAllLinkedInArticles();
  }

  //**/ NOTE: "hupac.com/" SCRAPPING SCRIPT
  async getAllHupacArticles() {
    return getAllHupacArticles();
  }

  //**/ NOTE: "doppelmayr.com/" SCRAPPING SCRIPT
  async getAllDoppelArticles() {
    return getAllDoppelArticles();
  }

  //**/ NOTE: "aargauverkehr.ch/" SCRAPPING SCRIPT
  async getAllAarglArticles() {
    return getAllAarglArticles();
  }

  //**/ NOTE: "vvl.ch/" SCRAPPING SCRIPT
  //! NOTE : COMPLETED
  async getAllVvlArticles() {
    return getAllVvlArticles();
  }

  //**/ NOTE: "rbs.ch/" SCRAPPING SCRIPT
  async getAllRbslArticles() {
    return getAllRbslArticles();
  }

  //**/ NOTE: "cst.ch/news/" SCRAPPING SCRIPT
  async getAllCstlArticles() {
    return getAllCstlArticles();
  }

  //**/ NOTE: "cargorail.ch/" SCRAPPING SCRIPT
  async getAllCarGorailArticles() {
    return getAllCarGorailArticles();
  }

  //**/ NOTE: "zentralbahn.ch/" SCRAPPING SCRIPT
  async getAllZentralBahnArticles() {
    return getAllZentralBahnArticles();
  }

  //**/ NOTE: "voev.ch/" SCRAPPING SCRIPT
  // TODO : [ON-HOLD]
  async getAllVoevArticles() {
    return getAllVoevArticles();
  }

  //**/ NOTE: "stadt-zuerich.ch/" SCRAPPING SCRIPT
  async getAllStadtArticles() {
    return getAllStadtArticles();
  }

  //**/ NOTE: "zvv.ch/" SCRAPPING SCRIPT
  async getAllZvvArticles() {
    return getAllZvvArticles();
  }

  //**/ NOTE: "alstom.com/" SCRAPPING SCRIPT
  async getAllAlstomArticles() {
    return getAllAlstomArticles();
  }

  //**/ NOTE: "new.abb.com/" SCRAPPING SCRIPT
  async getAllAbbArticles() {
    return getAllAbbArticles();
  }

  //**/ NOTE: "rhomberg-sersa.com/" SCRAPPING SCRIPT
  async getAllRhombergArticles() {
    return getAllRhombergArticles();
  }

  //**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
  async getAllBlsArticles() {
    return getAllBlsArticles();
  }

  //**/ NOTE: "bls.ch/" SCRAPPING SCRIPT
  async getAllBlsAdArticles() {
    return getAllBlsAdArticles();
  }

  //**/ NOTE: "sbbcargo.com/" SCRAPPING SCRIPT
  //! NOTE : COMPLETED
  async getAllSbbCargoArticles() {
    return getAllSbbCargoArticles();
  }

  //**/ NOTE: "mueller-frauenfeld.ch/" SCRAPPING SCRIPT
  async getAllMuellerFrauenNewsArticles() {
    return getAllMuellerFrauenNewsArticles();
  }

  //**/ NOTE: "mueller-frauenfeld.ch/" SCRAPPING SCRIPT
  async getAllMuellerFrauenVideosArticles() {
    return getAllMuellerFrauenVideosArticles();
  }

  //**/ NOTE: "c-vanoli.ch/" SCRAPPING SCRIPT
  async getAllCVanoliArticles() {
    return getAllCVanoliArticles();
  }

  //**/ NOTE: "presseportal.ch/" SCRAPPING SCRIPT
  async getAllPressePortalArticles() {
    return getAllPressePortalEmArticles();
  }

  //**/ NOTE: "rhb.ch/" SCRAPPING SCRIPT
  async getAllRhbProjectArticles() {
    return getAllRhbProjectArticles();
  }

  //**/ NOTE: "rhb.ch/" SCRAPPING SCRIPT
  async getAllRhbNewsArticles() {
    return getAllRhbNewsArticles();
  }

  //**/ NOTE: "sob.ch/" SCRAPPING SCRIPT
  async getAllSobArticles() {
    return getAllSobArticles();
  }
}
