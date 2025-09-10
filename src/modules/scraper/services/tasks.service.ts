/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import {
  getActiveLinkedInSources,
  getActiveYouTubeSources,
  getActiveWebsiteSources,
  isAllowedLinkedInCompany,
  isAllowedYouTubeChannel,
} from './scraping-config/target-sources.config';

@Injectable()
export class TasksService {
  constructor(private readonly scraperService: ScraperService) {}

  /**
   * Run targeted scraping for all approved sources
   * Can be triggered manually or scheduled externally
   */
  async runTargetedScraping() {
    console.log('🚀 Starting targeted scraping process...');

    try {
      // Scrape YouTube channels
      await this.scrapeTargetedYouTubeChannels();

      // Scrape LinkedIn company pages
      await this.scrapeTargetedLinkedInCompanies();

      // Scrape approved websites
      await this.scrapeTargetedWebsites();

      console.log('✅ Targeted scraping completed successfully');
    } catch (error) {
      console.error('❌ Targeted scraping failed:', error);
    }
  }

  /**
   * Scrape only approved YouTube channels
   */
  private async scrapeTargetedYouTubeChannels() {
    const activeChannels = getActiveYouTubeSources();
    console.log(`📺 Scraping ${activeChannels.length} YouTube channels...`);

    for (const channel of activeChannels) {
      try {
        console.log(`  - Scraping YouTube channel: ${channel.name} (@${channel.url})`);

        // Extract channel name from URL (remove @ if present)
        const channelName = channel.url.replace('@', '').replace('user/', '');

        // Scrape general videos
        await this.scraperService.getAllVideos(channelName);

        // Scrape rail-related videos specifically
        await this.scraperService.getAllVideosFromSearch(channelName, 'rail');
        await this.scraperService.getAllVideosFromSearch(channelName, 'bahn');
        await this.scraperService.getAllVideosFromSearch(channelName, 'train');

        // Add delay to respect rate limits
        await this.delay(2000);
      } catch (error) {
        console.error(`  ❌ Failed to scrape YouTube channel ${channel.name}:`, error);
      }
    }
  }

  /**
   * Scrape only approved LinkedIn company pages
   */
  private async scrapeTargetedLinkedInCompanies() {
    const activeCompanies = getActiveLinkedInSources();
    console.log(`🏢 Scraping ${activeCompanies.length} LinkedIn companies...`);

    for (const company of activeCompanies) {
      try {
        console.log(`  - Scraping LinkedIn company: ${company.name}`);

        // Extract company identifier from LinkedIn URL
        const companyId = company.url.split('/company/')[1];

        if (companyId) {
          await this.scraperService.getAllLinkedInArticles(companyId);
        }

        // Add delay to respect LinkedIn's rate limits
        await this.delay(5000);
      } catch (error) {
        console.error(`  ❌ Failed to scrape LinkedIn company ${company.name}:`, error);
      }
    }
  }

  /**
   * Scrape only approved website sources
   */
  private async scrapeTargetedWebsites() {
    const activeWebsites = getActiveWebsiteSources();
    console.log(`🌐 Scraping ${activeWebsites.length} approved websites...`);

    // Map website URLs to existing scraper methods
    const websiteScrapers = [
      { domain: 'sev-online.ch', method: () => this.scraperService.getAllSevOnlineArticles() },
      { domain: 'baublatt.ch', method: () => this.scraperService.getAllBaublattArticles() },
      { domain: 'pro-bahn.ch', method: () => this.scraperService.getAllProBahnArticles() },
      { domain: 'railmarket.com', method: () => this.scraperService.getAllRailMarketArticles() },
      { domain: 'lok-report.de', method: () => this.scraperService.getAllLokReportArticles() },
      { domain: 'bahnblogstelle.com', method: () => this.scraperService.getAllBahnBlogArticles() },
    ];

    for (const scraper of websiteScrapers) {
      try {
        // Check if this website is in our approved list
        const isApproved = activeWebsites.some((site) => site.url.includes(scraper.domain));

        if (isApproved) {
          console.log(`  - Scraping approved website: ${scraper.domain}`);
          await scraper.method();
          await this.delay(3000);
        }
      } catch (error) {
        console.error(`  ❌ Failed to scrape website ${scraper.domain}:`, error);
      }
    }
  }

  /**
   * Manual trigger for targeted scraping (API endpoint)
   */
  async runTargetedScrapingManual() {
    console.log('🎯 Manual targeted scraping triggered');
    return this.runTargetedScraping();
  }

  /**
   * Scrape only specific YouTube channel (with validation)
   */
  async scrapeSpecificYouTubeChannel(channelName: string) {
    if (!isAllowedYouTubeChannel(channelName)) {
      throw new Error(`YouTube channel '${channelName}' is not in the approved list`);
    }

    console.log(`📺 Scraping approved YouTube channel: ${channelName}`);
    return this.scraperService.getAllVideos(channelName);
  }

  /**
   * Scrape only specific LinkedIn company (with validation)
   */
  async scrapeSpecificLinkedInCompany(companyName: string) {
    if (!isAllowedLinkedInCompany(companyName)) {
      throw new Error(`LinkedIn company '${companyName}' is not in the approved list`);
    }

    console.log(`🏢 Scraping approved LinkedIn company: ${companyName}`);
    return this.scraperService.getAllLinkedInArticles(companyName);
  }

  /**
   * Get list of all approved sources
   */
  getApprovedSources() {
    return {
      youtube: getActiveYouTubeSources(),
      linkedin: getActiveLinkedInSources(),
      websites: getActiveWebsiteSources(),
    };
  }

  /**
   * Utility function to add delays between requests
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
