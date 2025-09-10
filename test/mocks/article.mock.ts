import { Article, ArticleType } from '../../src/models/articles.models';

export const mockArticleData = {
  news: {
    baseUrl: 'https://test-news-site.com',
    url: 'https://test-news-site.com/article/test-123',
    title: 'Test Railway News Article',
    type: ArticleType.News,
    dateText: '15.01.2025',
    date: new Date('2025-01-15'),
    teaser: 'This is a test teaser for a railway news article.',
    image: 'https://test-site.com/image.jpg',
    imageLocal: 'test-image.jpg',
    originalContent:
      'This is the original content of a test railway news article. It contains information about railway developments and industry updates.',
    generatedContent: 'AI-enhanced version of the railway news article with better structure and additional context.',
    generatedTeaser: 'AI-generated teaser that summarizes the key points of the article.',
    imageTitleContext: 'A modern train at a railway station representing technological advancement',
    metadata: {
      source: 'test-news-site',
      views: '1000',
      uploadDate: '2025-01-15',
      duration: 'N/A',
      icon: 'N/A',
    },
  },

  video: {
    baseUrl: 'https://youtube.com',
    url: 'https://youtube.com/watch?v=test123',
    title: 'Swiss Railway Documentary - Modern Transport Solutions',
    type: ArticleType.Video,
    dateText: '2 days ago',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    image: 'https://youtube.com/thumbnail/test123.jpg',
    originalContent:
      'Video description: An in-depth look at modern Swiss railway systems and their technological innovations.',
    generatedContent: 'AI-generated summary of the video content focusing on key technological innovations.',
    metadata: {
      duration: '15:30',
      views: '50000',
      uploadDate: '2025-01-13',
      source: 'youtube',
      icon: 'N/A',
    },
  },

  linkedin: {
    baseUrl: 'https://linkedin.com/company/sbb',
    url: '(test123)-https://linkedin.com/company/sbb',
    title: 'SBB Company Update',
    type: ArticleType.LinkedIn,
    dateText: '1w',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    image: 'https://linkedin.com/image/company-post.jpg',
    originalContent:
      '<p>Exciting news from SBB! We are implementing new digital solutions to improve passenger experience.</p>',
    generatedContent: "Structured summary of SBB's digital transformation initiatives.",
    metadata: {
      source: 'sbb',
      icon: 'https://linkedin.com/company/sbb/logo.jpg',
      duration: 'N/A',
      views: 'N/A',
      uploadDate: 'N/A',
    },
  },
};

export const mockScrapedArticles = [
  {
    baseUrl: 'https://bls.ch',
    type: ArticleType.News,
    title: 'BLS Announces New Route Expansion',
    url: 'https://bls.ch/news/route-expansion-2025',
    dateText: '10.01.2025',
    image: 'https://bls.ch/images/expansion.jpg',
    teaser: 'BLS announces major route expansion for 2025.',
  },
  {
    baseUrl: 'https://rhb.ch',
    type: ArticleType.News,
    title: 'Rhätische Bahn Winter Schedule Update',
    url: 'https://rhb.ch/news/winter-schedule',
    dateText: '08.01.2025',
    image: 'https://rhb.ch/images/winter.jpg',
    teaser: 'Updated winter schedules now available.',
  },
];

export const mockYouTubeVideos = [
  {
    baseUrl: 'https://youtube.com/@sbb',
    type: ArticleType.Video,
    title: 'SBB Innovation Hub - Future of Rail Transport',
    url: 'https://youtube.com/watch?v=innovation123',
    dateText: '3 days ago',
    image: 'https://youtube.com/thumbnail/innovation123.jpg',
    originalContent: 'N/A',
    metadata: {
      views: '25000',
      uploadDate: '3 days ago',
      duration: '12:45',
    },
  },
];

export const mockLinkedInPosts = [
  {
    baseUrl: 'https://linkedin.com/company/alstom',
    type: ArticleType.LinkedIn,
    dateText: '2d',
    originalContent:
      '<p>Alstom is proud to announce our latest sustainable transport solutions for Swiss railways.</p>',
    image: 'https://linkedin.com/image/alstom-post.jpg',
    metadata: {
      icon: 'https://linkedin.com/company/alstom/logo.jpg',
      source: 'alstom',
    },
  },
];

export const createMockArticle = (overrides: Partial<Article> = {}): Partial<Article> => {
  return {
    ...mockArticleData.news,
    ...overrides,
  };
};

export const createMockArticleArray = (count: number, type: ArticleType = ArticleType.News): Partial<Article>[] => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockArticleData[type === ArticleType.Video ? 'video' : type === ArticleType.LinkedIn ? 'linkedin' : 'news'],
    url: `https://test-site.com/article/${type.toLowerCase()}-${index}`,
    title: `Test ${type} Article ${index + 1}`,
  }));
};
