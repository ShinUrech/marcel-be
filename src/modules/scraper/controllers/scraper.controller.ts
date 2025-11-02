/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { ScraperService } from '../services/scraper.service';
import { ScraperDeeperService } from '../services/scraper-deeper.service';
import { ArticlesService } from '../services/articles.service';
import { ArticleType } from '../../../models/articles.models';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly scraperDeeperService: ScraperDeeperService,
    private readonly articlesService: ArticlesService,
  ) {}

  @Get('test')
  async getTEST() {
    // Test creating a sample article to verify database connection
    const sampleArticle = {
      baseUrl: 'https://example.com',
      type: ArticleType.News,
      title: 'Test Article - Database Connection Test',
      url: 'https://example.com/test-article-' + Date.now(),
      dateText: '2025-01-15',
      image: null, // Let frontend handle placeholder
      originalContent: 'This is a test article to verify database connectivity and article creation functionality.',
      metadata: {
        source: 'test',
        created: new Date().toISOString(),
      },
    };

    try {
      const result = await this.articlesService.createArticle(sampleArticle);
      return {
        success: true,
        message: 'Test article created successfully',
        articleId: result?._id,
        article: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create test article',
        error: error.message,
      };
    }
  }

  @Get('download')
  async getImages() {
    return this.articlesService.downloadImages();
  }

  @Get('formateDates')
  async formateDates() {
    return this.articlesService.formateDates();
  }

  @Get('linkedin/:company')
  async getCompanyPost(@Param('company') companyName: string) {
    return this.scraperService.getAllLinkedInArticles(companyName);
  }

  @Get('validate/linkedin/:company')
  async validateLinkedInCompany(@Param('company') companyName: string) {
    const { isAllowedLinkedInCompany } = await import('../services/scraping-config/target-sources.config');
    return {
      company: companyName,
      allowed: isAllowedLinkedInCompany(companyName),
      message: isAllowedLinkedInCompany(companyName)
        ? 'Company is in approved list'
        : 'Company is NOT in approved list',
    };
  }

  @Get('validate/youtube/:channel')
  async validateYouTubeChannel(@Param('channel') channelName: string) {
    const { isAllowedYouTubeChannel } = await import('../services/scraping-config/target-sources.config');
    return {
      channel: channelName,
      allowed: isAllowedYouTubeChannel(channelName),
      message: isAllowedYouTubeChannel(channelName) ? 'Channel is in approved list' : 'Channel is NOT in approved list',
    };
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
