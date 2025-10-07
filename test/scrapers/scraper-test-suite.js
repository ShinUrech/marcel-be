#!/usr/bin/env node

/**
 * Comprehensive Scraper Test Suite for Project Marcel
 * Tests all 35+ website scrapers for functionality and data quality
 *
 * Run with: node test/scrapers/scraper-test-suite.js
 */

const axios = require('axios');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class ScraperTestSuite {
  constructor() {
    this.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000/api';
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      scrapers: [],
    };
    this.startTime = Date.now();
  }

  /**
   * Validate scraped article structure
   */
  validateArticleStructure(article, scraperName) {
    const errors = [];
    const warnings = [];

    // Required fields
    const requiredFields = ['baseUrl', 'type', 'url'];
    requiredFields.forEach((field) => {
      if (!article[field] || article[field] === 'N/A') {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Title validation
    if (!article.title || article.title === 'N/A' || article.title.length < 5) {
      errors.push('Invalid or missing title');
    }

    // URL validation
    if (article.url) {
      try {
        new URL(article.url);
      } catch (e) {
        errors.push(`Invalid URL format: ${article.url}`);
      }
    }

    // Date validation
    if (article.dateText === 'N/A') {
      warnings.push('Date not extracted');
    }

    // Image validation
    if (!article.image || article.image === 'N/A') {
      warnings.push('No image extracted');
    }

    // Content validation
    if (article.type === 'News') {
      if (!article.originalContent || article.originalContent === 'N/A') {
        warnings.push('No content extracted');
      } else if (article.originalContent.length < 50) {
        warnings.push('Content seems too short');
      }
    }

    return { errors, warnings };
  }

  /**
   * Test a single scraper endpoint
   */
  async testScraper(name, config) {
    const result = {
      name,
      category: config.category,
      status: 'pending',
      articles: 0,
      errors: [],
      warnings: [],
      duration: 0,
      sampleData: null,
    };

    const startTime = Date.now();

    try {
      console.log(chalk.yellow(`\n🔄 Testing ${name}...`));

      // Make request to scraper endpoint
      const response = await axios({
        method: config.method || 'GET',
        url: `${this.baseUrl}${config.endpoint}`,
        timeout: config.timeout || 60000,
        validateStatus: () => true, // Don't throw on any status
      });

      result.duration = Date.now() - startTime;

      // Check response status
      if (response.status !== 200) {
        result.status = 'failed';
        result.errors.push(`HTTP ${response.status}: ${response.statusText}`);
        console.log(chalk.red(`❌ Failed: HTTP ${response.status}`));
        return result;
      }

      // Validate response data
      const articles = Array.isArray(response.data) ? response.data : response.data?.articles || [];

      result.articles = articles.length;

      if (articles.length === 0) {
        result.status = 'warning';
        result.warnings.push('No articles scraped (site may have no new content)');
        console.log(chalk.yellow(`⚠️  Warning: No articles found`));
        return result;
      }

      // Validate article structures
      let validArticles = 0;
      const validationIssues = [];

      articles.slice(0, 5).forEach((article, index) => {
        const validation = this.validateArticleStructure(article, name);

        if (validation.errors.length === 0) {
          validArticles++;
        } else {
          validationIssues.push({
            articleIndex: index,
            errors: validation.errors,
            warnings: validation.warnings,
          });
        }

        // Collect warnings
        validation.warnings.forEach((w) => {
          if (!result.warnings.includes(w)) {
            result.warnings.push(w);
          }
        });
      });

      // Store sample article
      result.sampleData = articles[0];

      // Determine overall status
      if (validationIssues.length === 0) {
        result.status = 'passed';
        console.log(chalk.green(`✅ Passed: ${articles.length} articles, all valid`));
      } else if (validArticles > 0) {
        result.status = 'warning';
        result.warnings.push(`${validationIssues.length}/${articles.length} articles have issues`);
        console.log(chalk.yellow(`⚠️  Partial: ${validArticles}/${articles.length} valid articles`));
      } else {
        result.status = 'failed';
        result.errors.push('All scraped articles failed validation');
        console.log(chalk.red(`❌ Failed: No valid articles`));
      }

      // Add validation details
      if (validationIssues.length > 0 && validationIssues.length <= 3) {
        validationIssues.forEach((issue) => {
          issue.errors.forEach((err) => {
            if (!result.errors.includes(err)) {
              result.errors.push(err);
            }
          });
        });
      }
    } catch (error) {
      result.status = 'failed';
      result.duration = Date.now() - startTime;
      result.errors.push(error.message);
      console.log(chalk.red(`❌ Failed: ${error.message}`));
    }

    return result;
  }

  /**
   * Run all scraper tests
   */
  async runAllTests() {
    console.log(chalk.cyan.bold('\n' + '='.repeat(70)));
    console.log(chalk.cyan.bold('PROJECT MARCEL - SCRAPER TEST SUITE'));
    console.log(chalk.cyan.bold('='.repeat(70)));

    // Define all scrapers to test
    const scrapers = {
      // Railway Companies
      'SBB Cargo': { category: 'Railway', endpoint: '/scraper/sbbcargo' },
      'BLS': { category: 'Railway', endpoint: '/scraper/bls' },
      'RhB Projects': { category: 'Railway', endpoint: '/scraper/rhb' },
      'SOB': { category: 'Railway', endpoint: '/scraper/sob' },
      'Zentralbahn': { category: 'Railway', endpoint: '/scraper/zentralbahn' },

      // Public Transport
      'ZVV': { category: 'Public Transport', endpoint: '/scraper/zvv' },
      'Bernmobil': { category: 'Public Transport', endpoint: '/scraper/bernmobil' },
      'Aargau Verkehr': { category: 'Public Transport', endpoint: '/scraper/aargauverkehr' },
      'RBS': { category: 'Public Transport', endpoint: '/scraper/rbs' },
      'VVL': { category: 'Public Transport', endpoint: '/scraper/vvl' },

      // News Sites
      'SEV Online': { category: 'News', endpoint: '/scraper/sev-online' },
      'Baublatt': { category: 'News', endpoint: '/scraper/baublatt' },
      'Pro-Bahn': { category: 'News', endpoint: '/scraper/pro-bahn' },
      'Lok Report': { category: 'News', endpoint: '/scraper/lok-report' },
      'Rail Market': { category: 'News', endpoint: '/scraper/railmarket' },
      'Bahnblogstelle': { category: 'News', endpoint: '/scraper/bahnblogstelle' },
      'Presseportal': { category: 'News', endpoint: '/scraper/presseportal' },

      // Technology & Industry
      'Alstom': { category: 'Industry', endpoint: '/scraper/alstom' },
      'ABB': { category: 'Industry', endpoint: '/scraper/abb' },
      'Hupac': { category: 'Industry', endpoint: '/scraper/hupac' },
      'Doppelmayr': { category: 'Industry', endpoint: '/scraper/doppelmayr' },
      'Rhomberg Sersa': { category: 'Industry', endpoint: '/scraper/rhomberg-sersa' },
      'Cargorail': { category: 'Industry', endpoint: '/scraper/cargorail' },
      'C. Vanoli': { category: 'Industry', endpoint: '/scraper/c-vanoli' },

      // Social Media (with specific company/channel)
      'LinkedIn - SBB': {
        category: 'LinkedIn',
        endpoint: '/scraper/linkedin/sbb-cff-ffs',
        timeout: 90000,
      },
      'YouTube - SBB': {
        category: 'YouTube',
        endpoint: '/scraper/youtube/sbbcffffs',
        timeout: 90000,
      },
    };

    // Run tests with rate limiting
    for (const [name, config] of Object.entries(scrapers)) {
      this.results.total++;
      const result = await this.testScraper(name, config);
      this.results.scrapers.push(result);

      // Update counters
      if (result.status === 'passed') {
        this.results.passed++;
      } else if (result.status === 'failed') {
        this.results.failed++;
      } else {
        this.results.warnings++;
      }

      // Rate limiting - wait between tests
      const delay = config.category === 'LinkedIn' || config.category === 'YouTube' ? 3000 : 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.printReport();
    this.exportResults();
  }

  /**
   * Print comprehensive test report
   */
  printReport() {
    const totalTime = Date.now() - this.startTime;

    console.log(chalk.cyan.bold('\n' + '='.repeat(70)));
    console.log(chalk.cyan.bold('TEST RESULTS SUMMARY'));
    console.log(chalk.cyan.bold('='.repeat(70)));

    // Summary statistics
    console.log(chalk.white('\n📊 Overall Statistics:'));
    console.log(`   Total Scrapers Tested: ${this.results.total}`);
    console.log(chalk.green(`   ✅ Passed: ${this.results.passed}`));
    console.log(chalk.yellow(`   ⚠️  Warnings: ${this.results.warnings}`));
    console.log(chalk.red(`   ❌ Failed: ${this.results.failed}`));
    console.log(`   ⏱️  Total Time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`   📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);

    // Results by category
    console.log(chalk.white('\n📋 Results by Category:'));
    const categories = {};
    this.results.scrapers.forEach((scraper) => {
      if (!categories[scraper.category]) {
        categories[scraper.category] = { passed: 0, warning: 0, failed: 0, total: 0 };
      }
      categories[scraper.category][scraper.status]++;
      categories[scraper.category].total++;
    });

    Object.entries(categories).forEach(([category, stats]) => {
      const successRate = ((stats.passed / stats.total) * 100).toFixed(0);
      console.log(`   ${category}: ${stats.passed}/${stats.total} passed (${successRate}%)`);
    });

    // Failed scrapers
    const failed = this.results.scrapers.filter((s) => s.status === 'failed');
    if (failed.length > 0) {
      console.log(chalk.red.bold('\n❌ Failed Scrapers:'));
      failed.forEach((scraper) => {
        console.log(chalk.red(`   • ${scraper.name}`));
        scraper.errors.forEach((error) => {
          console.log(chalk.gray(`     - ${error}`));
        });
      });
    }

    // Scrapers with warnings
    const warnings = this.results.scrapers.filter((s) => s.status === 'warning');
    if (warnings.length > 0 && warnings.length <= 10) {
      console.log(chalk.yellow.bold('\n⚠️  Scrapers with Warnings:'));
      warnings.forEach((scraper) => {
        console.log(chalk.yellow(`   • ${scraper.name} (${scraper.articles} articles)`));
        scraper.warnings.slice(0, 2).forEach((warning) => {
          console.log(chalk.gray(`     - ${warning}`));
        });
      });
    }

    // Top performing scrapers
    const topScrapers = this.results.scrapers
      .filter((s) => s.status === 'passed')
      .sort((a, b) => b.articles - a.articles)
      .slice(0, 5);

    if (topScrapers.length > 0) {
      console.log(chalk.green.bold('\n🏆 Top Performing Scrapers:'));
      topScrapers.forEach((scraper, index) => {
        console.log(
          chalk.green(
            `   ${index + 1}. ${scraper.name}: ${scraper.articles} articles in ${(scraper.duration / 1000).toFixed(1)}s`,
          ),
        );
      });
    }

    // Recommendations
    console.log(chalk.cyan.bold('\n💡 Recommendations:'));
    if (this.results.failed > 0) {
      console.log(chalk.yellow('   • Review failed scrapers - websites may have changed structure'));
      console.log(chalk.yellow('   • Check network connectivity and rate limiting'));
    }
    if (this.results.warnings > 5) {
      console.log(chalk.yellow('   • Multiple scrapers have data quality issues'));
      console.log(chalk.yellow('   • Consider updating selectors for better data extraction'));
    }
    if (this.results.passed === this.results.total) {
      console.log(chalk.green('   • All scrapers working perfectly! 🎉'));
    }

    console.log(chalk.cyan.bold('\n' + '='.repeat(70) + '\n'));
  }

  /**
   * Export results to JSON file
   */
  exportResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `scraper-test-results-${timestamp}.json`;
    const filepath = path.join(__dirname, filename);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.total,
        passed: this.results.passed,
        warnings: this.results.warnings,
        failed: this.results.failed,
        successRate: ((this.results.passed / this.results.total) * 100).toFixed(1),
        totalDuration: Date.now() - this.startTime,
      },
      scrapers: this.results.scrapers,
    };

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(chalk.cyan(`📄 Detailed results exported to: ${filename}\n`));
  }
}

// Run the test suite
async function main() {
  // Check if server is running
  try {
    await axios.get('http://localhost:3000/api/scraper/test', { timeout: 5000 });
  } catch (error) {
    console.log(chalk.red('\n❌ Backend server is not running!'));
    console.log(chalk.yellow('Please start the server with: npm run start:dev\n'));
    process.exit(1);
  }

  const suite = new ScraperTestSuite();
  await suite.runAllTests();

  // Exit with appropriate code
  process.exit(suite.results.failed > 0 ? 1 : 0);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Test suite failed:'), error);
    process.exit(1);
  });
}

module.exports = ScraperTestSuite;
