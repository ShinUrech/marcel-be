#!/usr/bin/env node

/**
 * Quick Scraper Test - Test Individual Scrapers
 * Fast way to test and debug specific scrapers
 *
 * Usage:
 *   node quick-scraper-test.js sbb
 *   node quick-scraper-test.js linkedin sbb-cff-ffs
 *   node quick-scraper-test.js youtube sbbcffffs
 */

const axios = require('axios');
const chalk = require('chalk');

// Scraper configurations
const SCRAPERS = {
  // Railway Companies
  sbbcargo: { name: 'SBB Cargo', endpoint: '/scraper/sbbcargo', type: 'news' },
  sbb: { name: 'SBB', endpoint: '/scraper/sbbcargo', type: 'news' },
  bls: { name: 'BLS', endpoint: '/scraper/bls', type: 'news' },
  rhb: { name: 'RhB Projects', endpoint: '/scraper/rhb', type: 'news' },
  sob: { name: 'SOB', endpoint: '/scraper/sob', type: 'news' },
  zentralbahn: { name: 'Zentralbahn', endpoint: '/scraper/zentralbahn', type: 'news' },

  // Public Transport
  zvv: { name: 'ZVV', endpoint: '/scraper/zvv', type: 'news' },
  bernmobil: { name: 'Bernmobil', endpoint: '/scraper/bernmobil', type: 'news' },
  aargau: { name: 'Aargau Verkehr', endpoint: '/scraper/aargauverkehr', type: 'news' },
  rbs: { name: 'RBS', endpoint: '/scraper/rbs', type: 'news' },
  vvl: { name: 'VVL', endpoint: '/scraper/vvl', type: 'news' },

  // News Sites
  sev: { name: 'SEV Online', endpoint: '/scraper/sev-online', type: 'news' },
  baublatt: { name: 'Baublatt', endpoint: '/scraper/baublatt', type: 'news' },
  probahn: { name: 'Pro-Bahn', endpoint: '/scraper/pro-bahn', type: 'news' },
  lokreport: { name: 'Lok Report', endpoint: '/scraper/lok-report', type: 'news' },
  railmarket: { name: 'Rail Market', endpoint: '/scraper/railmarket', type: 'news' },
  bahnblog: { name: 'Bahnblogstelle', endpoint: '/scraper/bahnblogstelle', type: 'news' },
  presseportal: { name: 'Presseportal', endpoint: '/scraper/presseportal', type: 'news' },

  // Industry
  alstom: { name: 'Alstom', endpoint: '/scraper/alstom', type: 'news' },
  abb: { name: 'ABB', endpoint: '/scraper/abb', type: 'news' },
  hupac: { name: 'Hupac', endpoint: '/scraper/hupac', type: 'news' },
  doppelmayr: { name: 'Doppelmayr', endpoint: '/scraper/doppelmayr', type: 'news' },
  rhomberg: { name: 'Rhomberg Sersa', endpoint: '/scraper/rhomberg-sersa', type: 'news' },
  cargorail: { name: 'Cargorail', endpoint: '/scraper/cargorail', type: 'news' },
  vanoli: { name: 'C. Vanoli', endpoint: '/scraper/c-vanoli', type: 'news' },
};

async function testScraper(scraperKey, param = null) {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000/api';

  // Handle special cases
  let config;
  let endpoint;

  if (scraperKey === 'linkedin') {
    const company = param || 'sbb-cff-ffs';
    config = { name: `LinkedIn - ${company}`, type: 'linkedin' };
    endpoint = `/scraper/linkedin/${company}`;
  } else if (scraperKey === 'youtube') {
    const channel = param || 'sbbcffffs';
    config = { name: `YouTube - ${channel}`, type: 'youtube' };
    endpoint = `/scraper/youtube/${channel}`;
  } else {
    config = SCRAPERS[scraperKey.toLowerCase()];
    if (!config) {
      console.log(chalk.red(`\n❌ Unknown scraper: ${scraperKey}`));
      console.log(chalk.yellow('\n💡 Available scrapers:'));
      Object.keys(SCRAPERS)
        .slice(0, 10)
        .forEach((key) => {
          console.log(`   ${key} - ${SCRAPERS[key].name}`);
        });
      console.log('   ... and more\n');
      console.log('Special commands:');
      console.log('   linkedin <company-slug>');
      console.log('   youtube <channel-name>\n');
      process.exit(1);
    }
    endpoint = config.endpoint;
  }

  console.log(chalk.cyan.bold(`\n🧪 Testing: ${config.name}`));
  console.log(chalk.gray(`Endpoint: ${endpoint}`));
  console.log(chalk.gray('─'.repeat(60)));

  const startTime = Date.now();

  try {
    console.log(chalk.yellow('\n⏳ Scraping... (this may take a minute)\n'));

    const response = await axios.get(`${baseUrl}${endpoint}`, {
      timeout: 120000, // 2 minutes
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (response.status !== 200) {
      console.log(chalk.red(`\n❌ HTTP Error: ${response.status} ${response.statusText}`));
      process.exit(1);
    }

    const articles = Array.isArray(response.data) ? response.data : response.data?.articles || [];

    // Print results
    console.log(chalk.green(`✅ Success! Scraped in ${duration}s`));
    console.log(chalk.white(`\n📊 Found ${articles.length} articles\n`));

    if (articles.length === 0) {
      console.log(chalk.yellow('⚠️  No articles found. This could mean:'));
      console.log('   • Website has no new content');
      console.log('   • Scraper selectors need updating');
      console.log('   • Website is blocking requests\n');
      return;
    }

    // Show sample articles
    console.log(chalk.cyan.bold('📰 Sample Articles:'));
    console.log(chalk.gray('─'.repeat(60)));

    articles.slice(0, 5).forEach((article, index) => {
      console.log(chalk.white(`\n${index + 1}. ${article.title || 'Untitled'}`));
      console.log(chalk.gray(`   URL: ${article.url?.substring(0, 70)}...`));
      console.log(chalk.gray(`   Type: ${article.type} | Date: ${article.dateText || 'N/A'}`));

      // Quality indicators
      const indicators = [];
      if (article.title && article.title !== 'N/A') indicators.push('✓ Title');
      if (article.image && article.image !== 'N/A') indicators.push('✓ Image');
      if (article.dateText && article.dateText !== 'N/A') indicators.push('✓ Date');
      if (article.originalContent && article.originalContent !== 'N/A') {
        indicators.push(`✓ Content (${article.originalContent.length} chars)`);
      }

      console.log(chalk.green(`   ${indicators.join(' | ')}`));

      // Warnings
      const warnings = [];
      if (!article.title || article.title === 'N/A') warnings.push('No title');
      if (!article.image || article.image === 'N/A') warnings.push('No image');
      if (!article.dateText || article.dateText === 'N/A') warnings.push('No date');
      if (article.type === 'News' && (!article.originalContent || article.originalContent === 'N/A')) {
        warnings.push('No content');
      }

      if (warnings.length > 0) {
        console.log(chalk.yellow(`   ⚠️  ${warnings.join(', ')}`));
      }
    });

    // Statistics
    console.log(chalk.cyan.bold(`\n\n📈 Statistics:`));
    console.log(chalk.gray('─'.repeat(60)));

    const withTitle = articles.filter((a) => a.title && a.title !== 'N/A').length;
    const withImage = articles.filter((a) => a.image && a.image !== 'N/A').length;
    const withDate = articles.filter((a) => a.dateText && a.dateText !== 'N/A').length;
    const withContent = articles.filter((a) => a.originalContent && a.originalContent !== 'N/A').length;

    console.log(
      `   Articles with title: ${withTitle}/${articles.length} (${((withTitle / articles.length) * 100).toFixed(0)}%)`,
    );
    console.log(
      `   Articles with image: ${withImage}/${articles.length} (${((withImage / articles.length) * 100).toFixed(0)}%)`,
    );
    console.log(
      `   Articles with date: ${withDate}/${articles.length} (${((withDate / articles.length) * 100).toFixed(0)}%)`,
    );
    if (config.type !== 'video') {
      console.log(
        `   Articles with content: ${withContent}/${articles.length} (${((withContent / articles.length) * 100).toFixed(0)}%)`,
      );
    }

    // Quality score
    const qualityScore = (((withTitle + withImage + withDate + withContent) / (articles.length * 4)) * 100).toFixed(0);
    const scoreColor = qualityScore >= 80 ? chalk.green : qualityScore >= 60 ? chalk.yellow : chalk.red;
    console.log(scoreColor(`\n   Overall Quality Score: ${qualityScore}%`));

    // Recommendations
    if (qualityScore < 80) {
      console.log(chalk.yellow('\n💡 Recommendations:'));
      if (withTitle < articles.length) console.log('   • Improve title extraction');
      if (withImage < articles.length * 0.5) console.log('   • Improve image extraction');
      if (withDate < articles.length * 0.8) console.log('   • Improve date extraction');
      if (withContent < articles.length * 0.7) console.log('   • Improve content extraction');
    } else {
      console.log(chalk.green('\n✨ Scraper is working excellently!'));
    }

    console.log(chalk.gray('\n' + '─'.repeat(60) + '\n'));
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(chalk.red(`\n❌ Failed after ${duration}s`));
    console.log(chalk.red(`Error: ${error.message}`));

    if (error.code === 'ECONNREFUSED') {
      console.log(chalk.yellow('\n💡 Server not running. Start with: npm run start:dev\n'));
    } else if (error.response) {
      console.log(chalk.red(`HTTP ${error.response.status}: ${error.response.statusText}`));
    }

    process.exit(1);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.cyan.bold('\n🧪 Quick Scraper Test\n'));
    console.log('Usage:');
    console.log('  node quick-scraper-test.js <scraper-name>');
    console.log('  node quick-scraper-test.js linkedin <company-slug>');
    console.log('  node quick-scraper-test.js youtube <channel-name>\n');
    console.log('Examples:');
    console.log('  node quick-scraper-test.js sbb');
    console.log('  node quick-scraper-test.js bls');
    console.log('  node quick-scraper-test.js linkedin sbb-cff-ffs');
    console.log('  node quick-scraper-test.js youtube sbbcffffs\n');
    console.log(chalk.yellow('Available scrapers:'));

    // Group by category
    const railways = Object.entries(SCRAPERS).filter(([k, v]) =>
      ['sbb', 'sbbcargo', 'bls', 'rhb', 'sob', 'zentralbahn'].includes(k),
    );
    const transport = Object.entries(SCRAPERS).filter(([k, v]) =>
      ['zvv', 'bernmobil', 'rbs', 'vvl', 'aargau'].includes(k),
    );
    const news = Object.entries(SCRAPERS).filter(([k, v]) => ['sev', 'baublatt', 'probahn', 'lokreport'].includes(k));

    console.log(chalk.cyan('\n  Railways:'));
    railways.forEach(([k, v]) => console.log(`    ${k} - ${v.name}`));

    console.log(chalk.cyan('\n  Public Transport:'));
    transport.forEach(([k, v]) => console.log(`    ${k} - ${v.name}`));

    console.log(chalk.cyan('\n  News Sites:'));
    news.forEach(([k, v]) => console.log(`    ${k} - ${v.name}`));

    console.log(chalk.cyan('\n  Social Media:'));
    console.log('    linkedin <company>');
    console.log('    youtube <channel>\n');

    process.exit(0);
  }

  const scraperKey = args[0];
  const param = args[1];

  await testScraper(scraperKey, param);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Test failed:'), error);
    process.exit(1);
  });
}
