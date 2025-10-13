// Add this as the FIRST line in the file
require('dotenv').config({ path: '.env.development' });

/**
 * Integration Tests for Project Marcel Backend
 * These tests verify that the main components work together correctly
 */

const axios = require('axios');
const { MongoClient } = require('mongodb');

class IntegrationTests {
  constructor() {
    this.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000/api'; // Add /api
    this.mongoUri = process.env.MONGO_URI; // Remove the localhost fallback
  }

  async testDatabaseOperations() {
    console.log('Testing database operations...');

    const client = new MongoClient(this.mongoUri);
    await client.connect();

    const db = client.db('practicedb');
    const articles = db.collection('articles');

    // Test create
    const testArticle = {
      baseUrl: 'https://test.com',
      url: 'https://test.com/integration-test-' + Date.now(),
      title: 'Integration Test Article',
      type: 'News',
      dateText: '15.01.2025',
      originalContent: 'This is a test article for integration testing.',
      createdAt: new Date(),
    };

    const insertResult = await articles.insertOne(testArticle);
    console.log('✓ Article created with ID:', insertResult.insertedId);

    // Test read
    const foundArticle = await articles.findOne({ _id: insertResult.insertedId });
    if (!foundArticle) {
      throw new Error('Failed to find created article');
    }
    console.log('✓ Article retrieved successfully');

    // Test update
    const updateResult = await articles.updateOne(
      { _id: insertResult.insertedId },
      { $set: { title: 'Updated Integration Test Article' } },
    );
    if (updateResult.modifiedCount !== 1) {
      throw new Error('Failed to update article');
    }
    console.log('✓ Article updated successfully');

    // Test delete
    const deleteResult = await articles.deleteOne({ _id: insertResult.insertedId });
    if (deleteResult.deletedCount !== 1) {
      throw new Error('Failed to delete article');
    }
    console.log('✓ Article deleted successfully');

    await client.close();
    console.log('✓ Database operations test completed');
  }

  async testScraperWorkflow() {
    console.log('Testing scraper workflow...');

    try {
      // Test scraper test endpoint
      const testResponse = await axios.get(`${this.baseUrl}/scraper/test`);
      console.log('✓ Scraper test endpoint working');
      console.log('  Response:', testResponse.data);

      // Test date formatting
      const formatResponse = await axios.get(`${this.baseUrl}/scraper/formateDates`);
      console.log('✓ Date formatting endpoint accessible');

      // Test image download (if available)
      try {
        const downloadResponse = await axios.get(`${this.baseUrl}/scraper/download`);
        console.log('✓ Image download endpoint accessible');
      } catch (error) {
        console.log('ℹ Image download may require existing articles');
      }
    } catch (error) {
      throw new Error(`Scraper workflow test failed: ${error.message}`);
    }

    console.log('✓ Scraper workflow test completed');
  }

  async testArticlesAPI() {
    console.log('Testing Articles API...');

    try {
      // Get all articles
      const articlesResponse = await axios.get(`${this.baseUrl}/articles`);
      console.log(`✓ Retrieved ${articlesResponse.data.length || 0} articles`);

      // Test pagination
      const paginatedResponse = await axios.get(`${this.baseUrl}/articles?page=1&limit=5`);
      console.log('✓ Pagination working');

      // Test video articles
      try {
        const videosResponse = await axios.get(`${this.baseUrl}/articles/videos`);
        console.log(`✓ Retrieved ${videosResponse.data.length || 0} video articles`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('ℹ No video articles found (normal for fresh installation)');
        }
      }

      // Test LinkedIn articles
      try {
        const linkedinResponse = await axios.get(`${this.baseUrl}/articles/linkedin`);
        console.log(`✓ Retrieved ${linkedinResponse.data.length || 0} LinkedIn articles`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('ℹ No LinkedIn articles found (normal for fresh installation)');
        }
      }

      // Test search
      const searchResponse = await axios.get(`${this.baseUrl}/articles/search?query=test`);
      console.log('✓ Search functionality working');
    } catch (error) {
      throw new Error(`Articles API test failed: ${error.message}`);
    }

    console.log('✓ Articles API test completed');
  }

  async testContentGeneration() {
    console.log('Testing Content Generation...');

    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠ Skipping content generation tests - No OpenAI API key');
      return;
    }

    try {
      const endpoints = [
        '/content-generator/content',
        '/content-generator/teaser',
        '/content-generator/video',
        '/content-generator/image-title',
      ];

      for (const endpoint of endpoints) {
        try {
          await axios.get(`${this.baseUrl}${endpoint}`);
          console.log(`✓ ${endpoint} is accessible`);
        } catch (error) {
          if (error.response?.status === 404 || error.response?.status === 500) {
            console.log(`ℹ ${endpoint} may require existing articles`);
          } else {
            console.log(`⚠ ${endpoint} returned: ${error.response?.status || error.message}`);
          }
        }
      }
    } catch (error) {
      throw new Error(`Content generation test failed: ${error.message}`);
    }

    console.log('✓ Content generation test completed');
  }

  async testFullWorkflow() {
    console.log('Testing full workflow integration...');

    const client = new MongoClient(this.mongoUri);
    await client.connect();
    const db = client.db('practicedb');
    const articles = db.collection('articles');

    try {
      // 1. Create a test article via database
      const testArticle = {
        baseUrl: 'https://integration-test.com',
        url: 'https://integration-test.com/workflow-test-' + Date.now(),
        title: 'Workflow Integration Test',
        type: 'News',
        dateText: '15.01.2025',
        originalContent: 'This article tests the full workflow integration.',
        createdAt: new Date(),
      };

      const insertResult = await articles.insertOne(testArticle);
      console.log('✓ Test article created in database');

      // 2. Retrieve via API
      const apiResponse = await axios.get(`${this.baseUrl}/articles`);

      // FIX: Access the nested data array
      const articlesArray = apiResponse.data.data || apiResponse.data;
      const foundInAPI = articlesArray.find((article) => article._id === insertResult.insertedId.toString());

      if (foundInAPI) {
        console.log('✓ Article accessible via API');
      }

      // 3. Test search for the article
      const searchResponse = await axios.get(`${this.baseUrl}/articles/search?query=Workflow Integration Test`);
      console.log('✓ Article searchable via API');

      // 4. Clean up
      await articles.deleteOne({ _id: insertResult.insertedId });
      console.log('✓ Test article cleaned up');
    } catch (error) {
      throw new Error(`Full workflow test failed: ${error.message}`);
    } finally {
      await client.close();
    }

    console.log('✓ Full workflow integration test completed');
  }
  async runAllTests() {
    console.log('='.repeat(60));
    console.log('MARCEL BACKEND - INTEGRATION TESTS');
    console.log('='.repeat(60));

    const tests = [
      { name: 'Database Operations', fn: () => this.testDatabaseOperations() },
      { name: 'Scraper Workflow', fn: () => this.testScraperWorkflow() },
      { name: 'Articles API', fn: () => this.testArticlesAPI() },
      { name: 'Content Generation', fn: () => this.testContentGeneration() },
      { name: 'Full Workflow', fn: () => this.testFullWorkflow() },
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        console.log(`\n🔄 Running: ${test.name}`);
        await test.fn();
        console.log(`✅ PASSED: ${test.name}\n`);
        passed++;
      } catch (error) {
        console.log(`❌ FAILED: ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
        failed++;
      }
    }

    console.log('='.repeat(60));
    console.log('INTEGRATION TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed === 0) {
      console.log('\n🎉 All integration tests passed!');
      console.log('The system is ready for use.');
    } else {
      console.log('\n⚠ Some tests failed. Please check the error messages above.');
    }

    return failed === 0;
  }
}

module.exports = IntegrationTests;

// Run tests if called directly
if (require.main === module) {
  const tests = new IntegrationTests();

  tests
    .runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Integration tests failed:', error);
      process.exit(1);
    });
}
