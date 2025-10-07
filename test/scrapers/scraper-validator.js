/**
 * Data Validation Tests for Scraped Content
 * Validates the quality and completeness of scraped data
 *
 * Run with: node test/scrapers/scraper-validator.js
 */

const axios = require('axios');
const chalk = require('chalk');

class ScraperValidator {
  constructor() {
    this.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000/api';
  }

  /**
   * Validate URL format and accessibility
   */
  validateURL(url) {
    const issues = [];

    try {
      const urlObj = new URL(url);

      // Check protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        issues.push(`Invalid protocol: ${urlObj.protocol}`);
      }

      // Check for localhost/test URLs in production
      if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('test')) {
        issues.push('URL points to localhost or test domain');
      }
    } catch (error) {
      issues.push(`Invalid URL format: ${error.message}`);
    }

    return issues;
  }

  /**
   * Validate date extraction
   */
  validateDate(dateText) {
    const issues = [];

    if (!dateText || dateText === 'N/A') {
      issues.push('Date not extracted');
      return issues;
    }

    // Check common date patterns
    const patterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/, // DD/MM/YYYY
      /\d{1,2}\.\d{1,2}\.\d{4}/, // DD.MM.YYYY
      /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /\d+\s+(day|month|year)s?\s+ago/i, // Relative dates
      /\d+[dwmy]/i, // Short form (1d, 2w, 3m, 1y)
    ];

    const matchesPattern = patterns.some((pattern) => pattern.test(dateText));

    if (!matchesPattern) {
      issues.push(`Date format not recognized: "${dateText}"`);
    }

    return issues;
  }

  /**
   * Validate content quality
   */
  validateContent(content, minLength = 100) {
    const issues = [];

    if (!content || content === 'N/A') {
      issues.push('No content extracted');
      return issues;
    }

    if (content.length < minLength) {
      issues.push(`Content too short: ${content.length} chars (minimum: ${minLength})`);
    }

    // Check for common scraping artifacts
    const artifacts = ['Cookie', 'JavaScript', '404', 'Error', 'Access Denied', 'Forbidden'];

    artifacts.forEach((artifact) => {
      if (content.includes(artifact)) {
        issues.push(`Possible scraping artifact detected: "${artifact}"`);
      }
    });

    // Check for repeated characters (potential parsing error)
    if (/(.)\1{10,}/.test(content)) {
      issues.push('Excessive repeated characters detected');
    }

    return issues;
  }

  /**
   * Validate image URL
   */
  validateImage(imageUrl) {
    const issues = [];

    if (!imageUrl || imageUrl === 'N/A') {
      issues.push('No image extracted');
      return issues;
    }

    // Check if it's a valid URL
    const urlIssues = this.validateURL(imageUrl);
    if (urlIssues.length > 0) {
      return urlIssues;
    }

    // Check for common image extensions
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some((ext) => imageUrl.toLowerCase().includes(ext));

    if (!hasValidExtension) {
      issues.push('Image URL does not have a recognized image extension');
    }

    return issues;
  }

  /**
   * Validate article type
   */
  validateType(type) {
    const validTypes = ['News', 'Video', 'LinkedIn'];

    if (!validTypes.includes(type)) {
      return [`Invalid article type: "${type}". Must be one of: ${validTypes.join(', ')}`];
    }

    return [];
  }

  /**
   * Comprehensive article validation
   */
  validateArticle(article, options = {}) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      score: 100,
    };

    // Required fields
    const requiredFields = ['baseUrl', 'url', 'title', 'type'];
    requiredFields.forEach((field) => {
      if (!article[field] || article[field] === 'N/A') {
        validation.errors.push(`Missing required field: ${field}`);
        validation.score -= 25;
      }
    });

    // Validate URL
    if (article.url) {
      const urlIssues = this.validateURL(article.url);
      urlIssues.forEach((issue) => {
        validation.errors.push(`URL: ${issue}`);
        validation.score -= 10;
      });
    }

    // Validate type
    const typeIssues = this.validateType(article.type);
    typeIssues.forEach((issue) => {
      validation.errors.push(issue);
      validation.score -= 15;
    });

    // Validate title
    if (article.title) {
      if (article.title.length < 10) {
        validation.warnings.push('Title seems too short');
        validation.score -= 5;
      }
      if (article.title.length > 200) {
        validation.warnings.push('Title seems too long');
        validation.score -= 5;
      }
    }

    // Validate date
    if (article.dateText) {
      const dateIssues = this.validateDate(article.dateText);
      dateIssues.forEach((issue) => {
        validation.warnings.push(`Date: ${issue}`);
        validation.score -= 5;
      });
    }

    // Validate image
    if (article.image) {
      const imageIssues = this.validateImage(article.image);
      imageIssues.forEach((issue) => {
        validation.warnings.push(`Image: ${issue}`);
        validation.score -= 3;
      });
    }

    // Validate content (for News articles)
    if (article.type === 'News' && article.originalContent) {
      const contentIssues = this.validateContent(article.originalContent, options.minContentLength || 100);
      contentIssues.forEach((issue) => {
        validation.warnings.push(`Content: ${issue}`);
        validation.score -= 10;
      });
    }

    // Validate metadata (for Videos)
    if (article.type === 'Video' && article.metadata) {
      if (!article.metadata.duration) {
        validation.warnings.push('Video duration not extracted');
        validation.score -= 5;
      }
      if (!article.metadata.views) {
        validation.warnings.push('Video views not extracted');
        validation.score -= 3;
      }
    }

    // Ensure score doesn't go negative
    validation.score = Math.max(0, validation.score);

    // Determine if valid
    validation.valid = validation.errors.length === 0 && validation.score >= 50;

    return validation;
  }

  /**
   * Test articles from database
   */
  async testDatabaseArticles(limit = 50) {
    console.log(chalk.cyan.bold('\n🔍 Testing Articles from Database\n'));

    try {
      const response = await axios.get(`${this.baseUrl}/articles?limit=${limit}`);
      const articles = response.data.data || response.data;

      if (!articles || articles.length === 0) {
        console.log(chalk.yellow('⚠️  No articles found in database'));
        return;
      }

      console.log(chalk.white(`Found ${articles.length} articles to validate\n`));

      const results = {
        total: articles.length,
        valid: 0,
        invalid: 0,
        averageScore: 0,
        byType: {},
      };

      let totalScore = 0;

      articles.forEach((article, index) => {
        const validation = this.validateArticle(article);
        totalScore += validation.score;

        if (validation.valid) {
          results.valid++;
        } else {
          results.invalid++;
        }

        // Track by type
        if (!results.byType[article.type]) {
          results.byType[article.type] = { valid: 0, invalid: 0, total: 0 };
        }
        results.byType[article.type].total++;
        if (validation.valid) {
          results.byType[article.type].valid++;
        } else {
          results.byType[article.type].invalid++;
        }

        // Print summary for first 10 and any with major issues
        if (index < 10 || validation.score < 60) {
          const icon = validation.valid ? chalk.green('✅') : chalk.red('❌');
          const scoreColor = validation.score >= 80 ? chalk.green : validation.score >= 60 ? chalk.yellow : chalk.red;

          console.log(`${icon} ${article.title?.substring(0, 50)}...`);
          console.log(`   Score: ${scoreColor(validation.score + '%')} | Type: ${article.type}`);

          if (validation.errors.length > 0) {
            console.log(chalk.red('   Errors:'));
            validation.errors.slice(0, 3).forEach((err) => {
              console.log(chalk.red(`     • ${err}`));
            });
          }

          if (validation.warnings.length > 0 && validation.warnings.length <= 3) {
            console.log(chalk.yellow('   Warnings:'));
            validation.warnings.slice(0, 3).forEach((warn) => {
              console.log(chalk.yellow(`     • ${warn}`));
            });
          }
          console.log();
        }
      });

      results.averageScore = (totalScore / articles.length).toFixed(1);

      // Print summary
      console.log(chalk.cyan.bold('\n📊 Validation Summary:'));
      console.log(`   Total Articles: ${results.total}`);
      console.log(chalk.green(`   Valid: ${results.valid} (${((results.valid / results.total) * 100).toFixed(1)}%)`));
      console.log(
        chalk.red(`   Invalid: ${results.invalid} (${((results.invalid / results.total) * 100).toFixed(1)}%)`),
      );
      console.log(`   Average Quality Score: ${results.averageScore}%\n`);

      console.log(chalk.white('   By Type:'));
      Object.entries(results.byType).forEach(([type, stats]) => {
        const percentage = ((stats.valid / stats.total) * 100).toFixed(0);
        console.log(`     ${type}: ${stats.valid}/${stats.total} valid (${percentage}%)`);
      });
    } catch (error) {
      console.log(chalk.red(`\n❌ Error testing database articles: ${error.message}`));
    }
  }

  /**
   * Test specific scraper in detail
   */
  async testScraperDetailed(scraperName, endpoint) {
    console.log(chalk.cyan.bold(`\n🔬 Detailed Test: ${scraperName}\n`));

    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        timeout: 60000,
      });

      const articles = Array.isArray(response.data) ? response.data : response.data?.articles || [];

      if (articles.length === 0) {
        console.log(chalk.yellow('⚠️  No articles scraped'));
        return;
      }

      console.log(chalk.white(`Scraped ${articles.length} articles\n`));

      // Validate all articles
      const validations = articles.map((article) => this.validateArticle(article));

      const summary = {
        total: articles.length,
        perfect: validations.filter((v) => v.score === 100).length,
        good: validations.filter((v) => v.score >= 80 && v.score < 100).length,
        fair: validations.filter((v) => v.score >= 60 && v.score < 80).length,
        poor: validations.filter((v) => v.score < 60).length,
        averageScore: validations.reduce((sum, v) => sum + v.score, 0) / articles.length,
      };

      // Print detailed results for first 5 articles
      articles.slice(0, 5).forEach((article, index) => {
        const validation = validations[index];
        const scoreColor = validation.score >= 80 ? chalk.green : validation.score >= 60 ? chalk.yellow : chalk.red;

        console.log(chalk.white(`Article ${index + 1}:`));
        console.log(`  Title: ${article.title?.substring(0, 60)}...`);
        console.log(`  URL: ${article.url?.substring(0, 60)}...`);
        console.log(`  Quality Score: ${scoreColor(validation.score + '%')}`);
        console.log(`  Type: ${article.type} | Date: ${article.dateText || 'N/A'}`);
        console.log(`  Has Image: ${article.image && article.image !== 'N/A' ? '✓' : '✗'}`);
        console.log(`  Has Content: ${article.originalContent && article.originalContent !== 'N/A' ? '✓' : '✗'}`);

        if (validation.errors.length > 0) {
          console.log(chalk.red(`  ❌ Errors: ${validation.errors.join(', ')}`));
        }
        if (validation.warnings.length > 0) {
          console.log(chalk.yellow(`  ⚠️  Warnings: ${validation.warnings.slice(0, 2).join(', ')}`));
        }
        console.log();
      });

      // Print summary
      console.log(chalk.cyan.bold('Quality Distribution:'));
      console.log(chalk.green(`  Perfect (100%): ${summary.perfect}`));
      console.log(chalk.green(`  Good (80-99%): ${summary.good}`));
      console.log(chalk.yellow(`  Fair (60-79%): ${summary.fair}`));
      console.log(chalk.red(`  Poor (<60%): ${summary.poor}`));
      console.log(chalk.white(`  Average Score: ${summary.averageScore.toFixed(1)}%`));
    } catch (error) {
      console.log(chalk.red(`\n❌ Error: ${error.message}`));
    }
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const validator = new ScraperValidator();

  if (args.length === 0) {
    // Default: test database articles
    await validator.testDatabaseArticles(100);
  } else if (args[0] === 'scraper' && args.length >= 3) {
    // Test specific scraper: node scraper-validator.js scraper "SBB" "/scraper/sbb"
    await validator.testScraperDetailed(args[1], args[2]);
  } else {
    console.log('Usage:');
    console.log('  node scraper-validator.js                              # Test database articles');
    console.log('  node scraper-validator.js scraper "Name" "/endpoint"   # Test specific scraper');
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Validation failed:'), error);
    process.exit(1);
  });
}

module.exports = ScraperValidator;
