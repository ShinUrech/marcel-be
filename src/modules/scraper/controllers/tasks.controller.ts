/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Manually trigger targeted scraping for all approved sources
   */
  @Post('scrape/all')
  async runTargetedScraping() {
    return {
      message: 'Targeted scraping started',
      timestamp: new Date().toISOString(),
      result: await this.tasksService.runTargetedScrapingManual(),
    };
  }

  /**
   * Scrape specific approved YouTube channel
   */
  @Post('scrape/youtube/:channelName')
  async scrapeYouTubeChannel(@Param('channelName') channelName: string) {
    try {
      const result = await this.tasksService.scrapeSpecificYouTubeChannel(channelName);
      return {
        success: true,
        message: `Successfully scraped YouTube channel: ${channelName}`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        channelName,
      };
    }
  }

  /**
   * Scrape specific approved LinkedIn company
   */
  @Post('scrape/linkedin/:companyName')
  async scrapeLinkedInCompany(@Param('companyName') companyName: string) {
    try {
      const result = await this.tasksService.scrapeSpecificLinkedInCompany(companyName);
      return {
        success: true,
        message: `Successfully scraped LinkedIn company: ${companyName}`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        companyName,
      };
    }
  }

  /**
   * Get list of all approved scraping sources
   */
  @Get('sources')
  async getApprovedSources() {
    return {
      sources: this.tasksService.getApprovedSources(),
      message: 'List of approved scraping sources',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Health check for tasks service
   */
  @Get('health')
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'TasksService',
      timestamp: new Date().toISOString(),
      message: 'Targeted scraping service is operational',
    };
  }
}
