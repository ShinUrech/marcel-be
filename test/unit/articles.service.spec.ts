import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesService } from '../../../src/modules/scraper/services/articles.service';
import { Article, ArticleDocument, ArticleType } from '../../../src/models/articles.models';
import { mockArticleData, createMockArticle } from '../../mocks/article.mock';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let model: Model<ArticleDocument>;

  // Mock functions
  const mockSave = jest.fn();
  const mockFind = jest.fn();
  const mockFindOne = jest.fn();
  const mockFindOneAndUpdate = jest.fn();
  const mockDeleteOne = jest.fn();
  const mockSort = jest.fn();
  const mockExec = jest.fn();

  // Mock model
  const mockModel = {
    new: jest.fn().mockImplementation((data) => ({
      ...data,
      save: mockSave.mockResolvedValue({ ...data, _id: 'mock-id' }),
    })),
    constructor: jest.fn(),
    find: mockFind,
    findOne: mockFindOne,
    findOneAndUpdate: mockFindOneAndUpdate,
    deleteOne: mockDeleteOne,
    sort: mockSort,
    exec: mockExec,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getModelToken(Article.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    model = module.get<Model<ArticleDocument>>(getModelToken(Article.name));

    // Reset mocks before each test
    jest.clearAllMocks();
    mockFind.mockReturnValue({
      sort: mockSort.mockReturnValue({
        exec: mockExec,
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createArticle', () => {
    it('should create a news article successfully', async () => {
      const articleData = createMockArticle({ type: ArticleType.News });
      const expectedResult = { ...articleData, _id: 'mock-id' };

      mockFindOne.mockResolvedValue(null); // No existing article
      mockSave.mockResolvedValue(expectedResult);

      // Mock the constructor to return an object with save method
      const mockInstance = {
        save: mockSave,
        ...articleData,
      };
      mockModel.new.mockImplementation(() => mockInstance);

      const result = await service.createArticle(articleData);

      expect(mockFindOne).toHaveBeenCalledWith({ url: articleData.url });
      expect(result).toEqual(expectedResult);
    });

    it('should return null if news article already exists', async () => {
      const articleData = createMockArticle({ type: ArticleType.News });
      const existingArticle = { ...articleData, _id: 'existing-id' };

      mockFindOne.mockResolvedValue(existingArticle);

      const result = await service.createArticle(articleData);

      expect(mockFindOne).toHaveBeenCalledWith({ url: articleData.url });
      expect(result).toBeNull();
      expect(mockSave).not.toHaveBeenCalled();
    });

    it('should create LinkedIn article with content deduplication', async () => {
      const articleData = createMockArticle({
        type: ArticleType.LinkedIn,
        originalContent: '<p>Test LinkedIn content</p>',
      });

      mockFindOne.mockResolvedValueOnce(null); // No existing article with same content
      mockSave.mockResolvedValue({ ...articleData, _id: 'mock-id' });

      const mockInstance = {
        save: mockSave,
        ...articleData,
      };
      mockModel.new.mockImplementation(() => mockInstance);

      const result = await service.createArticle(articleData);

      // Should check for existing content, not URL for LinkedIn
      expect(mockFindOne).toHaveBeenCalledWith({
        originalContent: expect.any(String),
      });
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all articles', async () => {
      const mockArticles = [createMockArticle({ title: 'Article 1' }), createMockArticle({ title: 'Article 2' })];

      mockFind.mockResolvedValue(mockArticles);

      const result = await service.findAll();

      expect(mockFind).toHaveBeenCalled();
      expect(result).toEqual(mockArticles);
    });
  });

  describe('findNoContent', () => {
    it('should return articles without generated content', async () => {
      const mockArticles = [createMockArticle({ generatedContent: '' })];

      mockExec.mockResolvedValue(mockArticles);
      mockSort.mockReturnValue({ exec: mockExec });
      mockFind.mockReturnValue({ sort: mockSort });

      const result = await service.findNoContent();

      expect(mockFind).toHaveBeenCalledWith({
        $and: [
          {
            $or: [{ generatedContent: { $exists: false } }, { generatedContent: { $eq: '' } }],
          },
          { type: ArticleType.News },
        ],
      });
      expect(result).toEqual(mockArticles);
    });
  });

  describe('findNoTeaser', () => {
    it('should return articles without generated teaser', async () => {
      const mockArticles = [createMockArticle({ generatedTeaser: '' })];

      mockExec.mockResolvedValue(mockArticles);

      const result = await service.findNoTeaser();

      expect(mockFind).toHaveBeenCalledWith({
        $and: [
          {
            $or: [{ generatedTeaser: { $exists: false } }, { generatedTeaser: { $eq: '' } }],
          },
          { type: ArticleType.News },
        ],
      });
      expect(result).toEqual(mockArticles);
    });
  });

  describe('FindOne', () => {
    it('should return a single article by id', async () => {
      const articleId = 'test-id';
      const mockArticle = createMockArticle({ _id: articleId });

      mockFindOne.mockResolvedValue(mockArticle);

      const result = await service.FindOne(articleId);

      expect(mockFindOne).toHaveBeenCalledWith({ _id: articleId });
      expect(result).toEqual(mockArticle);
    });
  });

  describe('Update', () => {
    it('should update an article by id', async () => {
      const articleId = 'test-id';
      const updateData = { title: 'Updated Title' };
      const updatedArticle = createMockArticle({ ...updateData, _id: articleId });

      mockFindOneAndUpdate.mockResolvedValue(updatedArticle);

      const result = await service.Update(articleId, updateData);

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith({ _id: articleId }, { $set: updateData }, { new: true });
      expect(result).toEqual(updatedArticle);
    });
  });

  describe('updateContent', () => {
    it('should update article content', async () => {
      const articleId = 'test-id';
      const newContent = 'Updated content';
      const updatedArticle = createMockArticle({ generatedContent: newContent });

      mockFindOneAndUpdate.mockResolvedValue(updatedArticle);

      const result = await service.updateContent(articleId, newContent);

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: articleId },
        { $set: { generatedContent: newContent } },
        { new: true },
      );
      expect(result).toEqual(updatedArticle);
    });
  });

  describe('Delete', () => {
    it('should delete an article by id', async () => {
      const articleId = 'test-id';
      const deleteResult = { deletedCount: 1 };

      mockDeleteOne.mockResolvedValue(deleteResult);

      const result = await service.Delete(articleId);

      expect(mockDeleteOne).toHaveBeenCalledWith({ _id: articleId });
      expect(result).toEqual(deleteResult);
    });
  });

  describe('formateDates', () => {
    it('should format dates for articles without dates', async () => {
      const mockArticles = [
        {
          _id: 'test-1',
          type: 'News',
          dateText: '15/01/2025',
        },
        {
          _id: 'test-2',
          type: 'Video',
          dateText: '2 days ago',
        },
      ];

      mockFind.mockResolvedValue(mockArticles);
      mockFindOneAndUpdate.mockResolvedValue({});

      await service.formateDates();

      expect(mockFind).toHaveBeenCalledWith({
        $or: [{ date: { $exists: false } }, { date: { $eq: '' } }],
      });

      // Should call update for each article
      expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(mockArticles.length);
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const articleData = createMockArticle();
      const error = new Error('Database connection failed');

      mockFindOne.mockRejectedValue(error);

      await expect(service.createArticle(articleData)).rejects.toThrow(error);
    });
  });
});
