// IMPORTANT: Load environment variables FIRST, before any imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '..', '.env.development') });

// Now import everything else
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  // Increase timeout for slow MongoDB connections
  jest.setTimeout(60000); // 60 seconds

  beforeAll(async () => {
    console.log('🔧 Initializing E2E test environment...');
    console.log('📊 MONGO_URI:', process.env.MONGO_URI ? '✓ Loaded' : '✗ Missing');

    // Initialize NestJS application once for all tests
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same configuration as main.ts
    app.setGlobalPrefix('api');

    await app.init();

    console.log('✅ E2E test environment ready');
  });

  afterAll(async () => {
    console.log('🧹 Cleaning up E2E test environment...');

    if (app) {
      await app.close();
    }

    // Give MongoDB connections time to close
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('✅ Cleanup complete');
  });

  // REMOVED: Root endpoint test since all routes are under /api prefix
  // The app doesn't have a handler at / when using global prefix

  describe('Health Checks', () => {
    it('/api/scraper/test (GET) - should return success', () => {
      return request(app.getHttpServer())
        .get('/api/scraper/test')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('message');
        });
    });
  });

  describe('Articles API', () => {
    it('/api/articles (GET) - should return articles list', () => {
      return request(app.getHttpServer())
        .get('/api/articles')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('/api/articles?page=1&limit=5 (GET) - should support pagination', () => {
      return request(app.getHttpServer())
        .get('/api/articles?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('currentPage');
          expect(res.body).toHaveProperty('totalPages');
        });
    });

    it('/api/articles/videos (GET) - should return video articles', () => {
      return request(app.getHttpServer()).get('/api/articles/videos').expect(200);
    });

    it('/api/articles/linkedin (GET) - should return LinkedIn articles', () => {
      return request(app.getHttpServer()).get('/api/articles/linkedin').expect(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', () => {
      return request(app.getHttpServer()).get('/api/unknown-endpoint-12345').expect(404);
    });
  });
});
