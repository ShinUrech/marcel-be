import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleSchema, ArticleDocument } from '../../src/models/articles.models';

export class DatabaseTestHelper {
  private static module: TestingModule;

  // Mock model for testing without real database connection
  static createMockModel() {
    const mockModel = {
      new: jest.fn().mockResolvedValue({}),
      constructor: jest.fn().mockResolvedValue({}),
      find: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
    };

    // Make the model chainable
    Object.keys(mockModel).forEach((key) => {
      if (typeof mockModel[key] === 'function' && !['exec', 'save', 'create'].includes(key)) {
        mockModel[key].mockReturnValue(mockModel);
      }
    });

    return mockModel;
  }

  static async setupTestModule(providers: any[] = [], controllers: any[] = []) {
    const mockModel = this.createMockModel();

    this.module = await Test.createTestingModule({
      imports: [],
      providers: [
        ...providers,
        {
          provide: getModelToken(Article.name),
          useValue: mockModel,
        },
      ],
      controllers,
    }).compile();

    return { module: this.module, mockModel };
  }

  static async teardownDatabase() {
    if (this.module) {
      await this.module.close();
    }
  }

  static getModule() {
    return this.module;
  }
}

// Mock Mongoose Document class for testing
export class MockArticleDocument {
  constructor(private data: any) {
    Object.assign(this, data);
  }

  save() {
    return Promise.resolve(this);
  }

  toObject() {
    return { ...this.data, _id: 'mock-id', createdAt: new Date(), updatedAt: new Date() };
  }

  toJSON() {
    return this.toObject();
  }
}

export const createMockArticleDocument = (data: any) => {
  return new MockArticleDocument({
    ...data,
    _id: 'mock-id-' + Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const createTestingModuleWithMocks = async (providers: any[] = [], controllers: any[] = []) => {
  const mockModel = DatabaseTestHelper.createMockModel();

  const module = await Test.createTestingModule({
    imports: [],
    providers: [
      ...providers,
      {
        provide: getModelToken(Article.name),
        useValue: mockModel,
      },
    ],
    controllers,
  }).compile();

  return { module, mockModel };
};
