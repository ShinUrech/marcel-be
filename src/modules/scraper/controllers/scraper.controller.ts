/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { ScraperService } from '../services/scraper.service';
import { ContentGeneratorService } from 'src/modules/content-generator/services/content-generator.service';
import { ScraperDeeperService } from '../services/scraper-deeper.service';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly scraperDeeperService: ScraperDeeperService,
    private contentGeneratorService: ContentGeneratorService,
  ) {}

  @Get('test')
  async getTEST() {
    // const pageUrl = 'https://direkt.sob.ch/themen/einblick/erste-bauetappe-im-service-zentrum-samstagern-abgeschlossen';
    // return this.scraperDeeperService.getSobArticle(pageUrl);
    return this.scraperService.getAllSevOnlineArticles();
  }

  @Get(':channelName')
  async getVideos(@Param('channelName') channelName: string) {
    return this.scraperService.getAllVideos(channelName);
  }

  @Get(':channelName/:term')
  async getVideosFromSearch(@Param('channelName') channelName: string, @Param('term') term: string) {
    return this.scraperService.getAllVideosFromSearch(channelName, term);
  }
}
