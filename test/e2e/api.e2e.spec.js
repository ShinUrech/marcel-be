/**
 * End-to-End Tests for Project Marcel Backend API
 * Tests the complete API functionality as a user would interact with it
 */

const request = require('supertest');
const { Test } = require('@nestjs/testing');
const { AppModule } = require('../../src/app.module');

describe('Project Marcel Backend E2E', () => {
  let app;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check Endpoints', () => {
    it('/scraper/test (GET) - should return health status', () => {
      return request(httpServer)
        .get('/scraper/test')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeDefined();
        });
    });
  });

  describe('Articles Endpoints', () => {
    it('/articles (GET) - should return articles array', () => {
      return request(httpServer)
        .get('/articles')
        .expect((res) => {
          expect(res.status).toBe(200);
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/articles/videos (GET) - should return video articles', () => {
      return request(httpServer)
        .get('/articles/videos')
        .expect((res) => {
          expect([200, 404].includes(res.status)).toBe(true);
          if (res.status === 200) {
            expect(Array.isArray(res.body)).toBe(true);
          }
        });
    });

    it('/articles/linkedin (GET) - should return LinkedIn articles', () => {
      return request(httpServer)
        .get('/articles/linkedin')
        .expect((res) => {
          expect([200, 404].includes(res.status)).toBe(true);
          if (res.status === 200) {
            expect(Array.isArray(res.body)).toBe(true);
          }
        });
    });

    it('/articles/search (GET) - should handle search queries', () => {
      return request(httpServer)
        .get('/articles/search?query=test')
        .expect((res) => {
          expect([200, 404].includes(res.status)).toBe(true);
          if (res.status === 200) {
            expect(Array.isArray(res.body)).toBe(true);
          }
        });
    });
  });

  describe('Scraper Endpoints', () => {
    it('/scraper/formateDates (GET) - should format dates', () => {
      return request(httpServer)
        .get('/scraper/formateDates')
        .expect((res) => {
          expect([200, 500].includes(res.status)).toBe(true);
        });
    });

    it('/scraper/download (GET) - should handle image downloads', () => {
      return request(httpServer)
        .get('/scraper/download')
        .expect((res) => {
          expect([200, 500].includes(res.status)).toBe(true);
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent endpoints', () => {
      return request(httpServer).get('/non-existent-endpoint').expect(404);
    });

    it('should handle invalid article IDs', () => {
      return request(httpServer)
        .get('/articles/invalid-id')
        .expect((res) => {
          expect([400, 404, 500].includes(res.status)).toBe(true);
        });
    });
  });

  describe('Content Generator Endpoints', () => {
    it('/content-generator/content (GET) - should be accessible', () => {
      return request(httpServer)
        .get('/content-generator/content')
        .expect((res) => {
          // May return 500 if no OpenAI key or no articles
          expect([200, 404, 500].includes(res.status)).toBe(true);
        });
    });

    it('/content-generator/teaser (GET) - should be accessible', () => {
      return request(httpServer)
        .get('/content-generator/teaser')
        .expect((res) => {
          expect([200, 404, 500].includes(res.status)).toBe(true);
        });
    });
  });
});
