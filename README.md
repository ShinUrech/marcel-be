# Project Marcel - Backend API

A powerful NestJS-based web scraping and content management system for Swiss transportation industry content. This backend automatically scrapes articles, videos, and LinkedIn posts from 35+ transportation websites, processes them with AI, and provides a comprehensive REST API.

## 📋 Overview

Project Marcel is an intelligent content aggregation platform specifically designed for the Swiss transportation industry. It automatically collects, processes, and enhances content from major railway companies, public transport operators, technology providers, and industry news sources. The system uses advanced web scraping, AI content generation, and provides a robust API for frontend consumption.

## 🏗️ System Architecture

### Technology Stack
- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: MongoDB with Mongoose ODM
- **Web Scraping**: Puppeteer + Chrome automation
- **AI Integration**: OpenAI GPT for content generation
- **Image Processing**: Custom image enhancement utilities
- **Logging**: Winston with file-based logging
- **Authentication**: JWT tokens (planned)

### Core Modules
```
src/
├── modules/
│   ├── scraper/          # Web scraping functionality (35+ websites)
│   ├── articles/         # Article CRUD operations
│   └── content-generator/ # AI content generation
├── models/               # MongoDB schemas
├── common/
│   ├── utils/           # Shared utilities (Puppeteer, date parsing)
│   └── helpers/         # Helper functions (image processing)
└── seeds/               # Database seeders
```

### Supported Content Sources (35+ Websites)

#### 🚄 Major Railway Companies
- **SBB Cargo** (`sbbcargo.script.ts`) - Swiss Federal Railways Cargo
- **BLS** (`bls.script.ts`) - Bern-Lötschberg-Simplon Railway  
- **RhB** (`rhb.script.ts`) - Rhätische Bahn (Rhaetian Railway)
- **SOB** (`sob.script.ts`) - Südostbahn (Southeastern Railway)
- **Zentralbahn** (`zentralbahn.script.ts`) - Central Switzerland Railway

#### 🚌 Public Transport Operators
- **Bernmobil** (`bernmobil.script.ts`) - Bern public transport
- **ZVV** (`zvv.script.ts`) - Zurich transport network
- **VVL** (`vvl.script.ts`) - Verkehrsverbund Luzern
- **RBS** (`rbs.script.ts`) - Regionalverkehr Bern-Solothurn
- **Aargau Verkehr** (`aargauverkehr.script.ts`) - Aargau transport

#### 🔧 Technology & Industry
- **Alstom** (`alstom.script.ts`) - Railway technology and rolling stock
- **ABB** (`abb.script.ts`) - Electrical engineering solutions
- **Doppelmayr** (`doppelmayr.script.ts`) - Cable car systems
- **Hupac** (`hupac.script.ts`) - Intermodal transport solutions
- **Rhomberg Sersa** (`rhomberg-sersa.script.ts`) - Railway construction
- **Cargorail** (`cargorail.script.ts`) - Rail freight services
- **C. Vanoli** (`c-vanoli.script.ts`) - Construction company

#### 📰 News & Media Sources
- **Lok Report** (`lok-report.script.ts`) - Railway industry news
- **Rail Market** (`railmarket.script.ts`) - Market intelligence
- **Baublatt** (`baublatt.script.ts`) - Construction industry news
- **Pro Bahn** (`pro-bahn.script.ts`) - Railway advocacy
- **Presseportal** (`presseportal.script.ts`) - Swiss press releases
- **Bahnblogstelle** (`bahnblogstelle.script.ts`) - Railway blog
- **SEV Online** (`sev-online.script.ts`) - Trade union news
- **Bahnberufe** (`bahnberufe.script.ts`) - Railway careers
- **Roalps** (`roalps.script.ts`) - Alpine railway news

#### 🏛️ Government & Organizations
- **OTIF** (`otif.script.ts`) - International railway organization
- **VOEV** (`voev.script.ts`) - Public transport association
- **CST** (`cst.script.ts`) - Railway testing services
- **Stadt Zürich** (`stadt-zuerich.script.ts`) - City transport
- **Citrap Vaud** (`citrap-vaud.script.ts`) - Vaud transport

#### 🎥 Social Media & Video
- **YouTube** (`youtube.script.ts`) - Video content from channels
- **LinkedIn** (`linkedIn.script.ts`) - Company posts and updates

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.12.0
- MongoDB running locally
- Chrome/Chromium browser (for Puppeteer)

### Installation & Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd project-marcel-be
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.development
   ```
   
   Update `.env.development`:
   ```bash
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/practicedb
   PORT=3000
   APP_NAME=Marcel Backend
   OPENAI_API_KEY=your-openai-key  # For AI content generation
   ```

3. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or use local MongoDB installation
   mongod --dbpath /path/to/your/data
   ```

4. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:3000/scraper/test
   ```

## 📡 API Endpoints

### Core Scraping Endpoints

#### Test & System Management
```http
GET /scraper/test                    # Test database connection
GET /scraper/download               # Download and enhance images  
GET /scraper/formateDates          # Format date fields across articles
```

#### YouTube Scraping
```http
GET /scraper/{channelName}                    # Scrape entire YouTube channel
GET /scraper/{channelName}/{searchTerm}       # Search within YouTube channel
```

#### LinkedIn Scraping  
```http
GET /scraper/linkedin/{companyName}           # Scrape LinkedIn company posts
```

### Articles API (via ArticlesModule)
```http
GET /articles                       # Get all articles (paginated)
GET /articles/videos               # Get video articles
GET /articles/linkedin             # Get LinkedIn posts
GET /articles/search?q={query}     # Search articles
GET /articles/vrandom              # Get random videos
GET /articles/nrandom              # Get random news articles
GET /articles/{id}                 # Get specific article
GET /articles/show/{fileName}      # Get article image
POST /articles                     # Create new article
PUT /articles/{id}                 # Update article
DELETE /articles/{id}              # Delete article
```

### Content Generator API
```http
GET /content-generator/content            # Generate AI content for articles
GET /content-generator/teaser            # Generate AI teasers
GET /content-generator/video             # Generate video summaries
GET /content-generator/image-title       # Generate image contexts
GET /content-generator/better-images     # Find better images
```

### Response Format
```typescript
interface Article {
  _id: string;
  baseUrl: string;
  url: string;
  title: string;
  type: 'News' | 'Video' | 'LinkedIn';
  dateText: string;
  date: Date;
  image: string;
  imageLocal?: string;
  googleImage?: string;
  originalContent: string;
  generatedContent?: string;      // AI-generated content
  generatedTeaser?: string;       // AI-generated teaser
  imageTitleContext?: string;     // AI-generated image context
  metadata?: {
    duration?: string;            // For videos
    views?: string;              // For videos
    uploadDate?: string;         // For videos
    source?: string;             // Content source
    icon?: string;               // Company icon
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## 🕸️ Web Scraping System

### Scraping Architecture

The scraping system uses a **two-stage process**:

#### Stage 1: List Scraping
Extract article metadata from website listing pages:
- Article titles
- URLs
- Publication dates
- Images
- Teasers/summaries

#### Stage 2: Deep Scraping  
Extract full content from individual article pages:
- Complete article text
- Additional metadata
- Enhanced image information

### Example Implementation

```typescript
// Stage 1: Get article list from website
export const getAllBernmobilArticles = async () => {
  const { browser, page } = await getPuppeteerInstance();
  
  try {
    await page.goto('https://www.bernmobil.ch/news', { waitUntil: 'networkidle2' });
    
    const articles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.news-item')).map((article) => ({
        baseUrl: window.location.href,
        type: articleType,
        title: article.querySelector('h3')?.innerText?.trim() || 'N/A',
        url: article.querySelector('a')?.href || '',
        dateText: article.querySelector('.date')?.innerText?.trim() || 'N/A',
        image: article.querySelector('img')?.src || 'N/A',
        teaser: article.querySelector('.summary')?.innerText?.trim() || 'N/A'
      }));
    }, ArticleType.News);
    
    return articles;
  } finally {
    await browser.close();
  }
};

// Stage 2: Get full content from individual articles
export const getBernmobilArticle = async (pageUrl: string) => {
  const { browser, page } = await getPuppeteerInstance();
  
  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    
    const content = await page.evaluate(() => {
      return document.querySelector('.article-content')?.innerText || '';
    });
    
    return content;
  } finally {
    await browser.close();
  }
};
```

### Service Layer Integration

```typescript
// In ScraperService
async getAllBernmobilArticles() {
  const articles = await getAllBernmobilArticles();
  
  for (let article of articles) {
    // Get full content for each article
    article['originalContent'] = await this.scraperDeeperService.getBernmobilArticle(article.url);
    
    // Save to database with automatic deduplication
    await this.articlesService.createArticle(article);
  }
  
  return articles;
}
```

### Key Features

#### Automatic Deduplication
- **News/Video**: Uses URL as unique identifier
- **LinkedIn**: Uses content-based deduplication to avoid reposts

#### Robust Error Handling
- Graceful handling of failed scrapes
- Continues processing if individual articles fail
- Comprehensive logging of errors

#### Image Processing
- Downloads images locally for performance
- AI-enhanced image quality improvement
- Google Images fallback for better visuals

#### Date Processing
- Handles multiple date formats from different websites
- Converts relative dates ("2 days ago") to absolute dates
- Standardized date formatting across all sources

## 🤖 AI Content Generation

The system integrates with OpenAI GPT to enhance scraped content:

### Content Enhancement Features
- **Article Generation**: Transform raw scraped content into well-structured articles
- **Teaser Creation**: Generate compelling article summaries and previews
- **Image Context**: Create descriptive context and alt-text for images
- **Better Images**: Find and suggest higher quality replacement images
- **Video Summaries**: Generate concise summaries for video content

### AI Service Integration
```typescript
// Content generation endpoints
GET /content-generator/content      # Enhance article content
GET /content-generator/teaser       # Generate article teasers
GET /content-generator/video        # Create video summaries
GET /content-generator/image-title  # Generate image contexts
GET /content-generator/better-images # Improve image quality
```

## 🗄️ Database Schema

### Article Model
```typescript
@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  baseUrl: string;              // Source website base URL

  @Prop({ required: true, unique: true })  
  url: string;                  // Unique article URL

  @Prop({ required: false })
  title: string;                // Article title

  @Prop({ type: String, enum: ArticleType, default: ArticleType.News })
  type: ArticleType;            // Video | News | LinkedIn

  @Prop({ required: false })
  dateText: string;             // Original date text

  @Prop({ required: false })
  date: Date;                   // Parsed date object

  @Prop({ required: false })
  teaser: string;               // Original teaser

  @Prop({ required: false })
  generatedTeaser: string;      // AI-generated teaser

  @Prop({ required: false })
  image: string;                // Original image URL

  @Prop({ required: false })
  imageLocal: string;           // Local image path

  @Prop({ required: false })
  googleImage: string;          // Enhanced Google image

  @Prop({ required: false })
  originalContent: string;      // Scraped content

  @Prop({ required: false })
  generatedContent: string;     // AI-enhanced content

  @Prop({ required: false })
  imageTitleContext: string;    // AI-generated image context

  @Prop({ type: Object, required: false })
  metadata?: {                  // Additional metadata
    duration: string;           // Video duration
    views: string;              // Video views count
    uploadDate: string;         // Video upload date
    source: string;             // Content source name
    icon: string;               // Company/source icon
  };

  createdAt: Date;              // Auto-generated by Mongoose
  updatedAt: Date;              // Auto-generated by Mongoose
}
```

### Article Types
- **`News`**: Traditional news articles from websites
- **`Video`**: YouTube videos from transportation channels
- **`LinkedIn`**: Posts from transportation company LinkedIn pages

## 📝 Adding New Website Scrapers

### 1. Create Scraper Script

Create `/src/modules/scraper/services/scraping-scripts/newsite.script.ts`:

```typescript
import { getPuppeteerInstance } from 'src/common/utils/puppeteer-instance';
import { ArticleType } from 'src/models/articles.models';

// List scraping function
export const getAllNewsiteArticles = async () => {
  const { browser, page } = await getPuppeteerInstance();
  
  try {
    await page.goto('https://newsite.com/news', { waitUntil: 'networkidle2' });
    
    // Handle cookie acceptance if needed
    try {
      const cookieButton = await page.$('.cookie-accept');
      if (cookieButton) await cookieButton.click();
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('No cookie banner found');
    }
    
    const articles = await page.evaluate((articleType) => {
      return Array.from(document.querySelectorAll('.article-item')).map((article) => ({
        baseUrl: window.location.href,
        type: articleType,
        title: article.querySelector('h2')?.innerText?.trim() || 'N/A',
        url: article.querySelector('a')?.href || '',
        dateText: article.querySelector('.date')?.innerText?.trim() || 'N/A',
        image: article.querySelector('img')?.src || 'N/A',
        teaser: article.querySelector('.summary')?.innerText?.trim() || 'N/A'
      }));
    }, ArticleType.News);
    
    return articles;
  } finally {
    await browser.close();
  }
};

// Deep content scraping function
export const getNewsiteArticle = async (pageUrl: string) => {
  const { browser, page } = await getPuppeteerInstance();
  
  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    
    const content = await page.evaluate(() => {
      // Remove unwanted elements
      const unwanted = document.querySelectorAll('.advertisement, .social-share, .comments');
      unwanted.forEach(el => el.remove());
      
      // Extract main content
      return document.querySelector('.article-body')?.innerText || '';
    });
    
    return content;
  } finally {
    await browser.close();
  }
};
```

### 2. Add to Services

**Update ScraperService** (`src/modules/scraper/services/scraper.service.ts`):

```typescript
// Add import
import { getAllNewsiteArticles } from './scraping-scripts/newsite.script';

// Add method to ScraperService class
async getAllNewsiteArticles() {
  const articles = await getAllNewsiteArticles();
  
  for (let index = 0; index < articles.length; index++) {
    const article = articles[index];
    article['originalContent'] = await this.scraperDeeperService.getNewsiteArticle(article.url);
    await this.articlesService.createArticle(article);
  }
  
  return articles;
}
```

**Update ScraperDeeperService** (`src/modules/scraper/services/scraper-deeper.service.ts`):

```typescript
// Add import
import { getNewsiteArticle } from './scraping-scripts/newsite.script';

// Add method to ScraperDeeperService class
async getNewsiteArticle(pageUrl: string) {
  return getNewsiteArticle(pageUrl);
}
```

### 3. Best Practices for New Scrapers

#### Error Handling
```typescript
try {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
} catch (error) {
  console.error(`Failed to load ${url}:`, error);
  return [];
}
```

#### Wait Strategies
```typescript
// Wait for specific elements
await page.waitForSelector('.article-list', { timeout: 10000 });

// Wait for network activity to settle
await page.waitForLoadState('networkidle');

// Custom wait for dynamic content
await page.waitForFunction(() => document.querySelectorAll('.article').length > 0);
```

#### Dynamic Content Handling
```typescript
// Scroll to load more content
let previousHeight = 0;
while (true) {
  const currentHeight = await page.evaluate('document.body.scrollHeight');
  if (currentHeight === previousHeight) break;
  
  await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
  await page.waitForTimeout(2000);
  previousHeight = currentHeight;
}
```

## 🛠️ Development Guide

### Project Structure
```
src/
├── app.module.ts                    # Main application module
├── main.ts                         # Application entry point
├── modules/
│   ├── articles/                   # Article management
│   │   ├── controllers/           # REST API endpoints
│   │   ├── services/              # Business logic
│   │   ├── dtos/                  # Data transfer objects
│   │   └── articles.module.ts     # Module configuration
│   ├── scraper/                   # Web scraping
│   │   ├── controllers/           # Scraping endpoints
│   │   ├── services/
│   │   │   ├── scraper.service.ts         # Main orchestration
│   │   │   ├── scraper-deeper.service.ts  # Deep content extraction
│   │   │   ├── articles.service.ts        # Database operations
│   │   │   └── scraping-scripts/          # Individual site scrapers
│   │   │       ├── youtube.script.ts
│   │   │       ├── linkedIn.script.ts
│   │   │       ├── bls.script.ts
│   │   │       └── ... (35+ scripts)
│   │   ├── dtos/                  # Data transfer objects
│   │   └── scraper.module.ts      # Module configuration
│   └── content-generator/         # AI content generation
│       ├── controllers/           # AI endpoints
│       ├── services/              # OpenAI integration
│       └── content-generator.module.ts
├── models/
│   └── articles.models.ts         # MongoDB schemas
├── common/
│   ├── configs/                   # Configuration files
│   ├── utils/
│   │   ├── puppeteer-instance.ts  # Browser automation setup
│   │   ├── format-date.ts         # Date parsing utilities
│   │   └── enhance-image.ts       # Image processing
│   └── helpers/
│       └── download-image.ts      # Image download utilities
└── seeds/                         # Database seeding
```

### Key Utilities

#### Puppeteer Instance Management
```typescript
// src/common/utils/puppeteer-instance.ts
export const getPuppeteerInstance = async (cookies = []) => {
  const browser = await puppeteer.launch({ 
    headless: false,    // Set to true for production
    slowMo: 50,        // Slow down for debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'  // For Docker environments
    ]
  });
  
  const page = await browser.newPage();
  
  // Set user agent and viewport
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  
  if (cookies.length > 0) {
    await page.setCookie(...cookies);
  }
  
  return { browser, page };
};
```

#### Date Formatting Utilities
```typescript
// src/common/utils/format-date.ts

// Parse European date formats
export const formatDate = (dateString: string): string => {
  // "28.01.2025" -> "28/01/2025"
  // "01-Feb-2025" -> "01/02/2025"
};

// Parse relative dates
export const parseRelativeDate = (relativeDate: string): Date => {
  // "2 days ago" -> Date object
  // "1 week ago" -> Date object
  // "3 months ago" -> Date object
};

// LinkedIn-specific date parsing
export const parseRelativeDateLinkedIn = (dateText: string): Date => {
  // "2d" -> 2 days ago
  // "1w" -> 1 week ago
  // "3mo" -> 3 months ago
};
```

#### Image Enhancement
```typescript
// src/common/utils/enhance-image.ts
export const enhanceImage = async (imagePath: string): Promise<string> => {
  // AI-based image enhancement
  // Upscaling, denoising, quality improvement
};

// src/common/helpers/download-image.ts
export const downloadImage = async (imageUrl: string): Promise<string> => {
  // Download image from URL
  // Save to local public directory
  // Return local filename
};
```

### Available Scripts

```bash
# Development
npm run start:dev        # Start with hot reload and file watching
npm run start:debug      # Start with debug mode (port 9229)

# Building
npm run build            # Compile TypeScript to JavaScript
npm run start:prod       # Start production build

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage report
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint with auto-fix
npm run format           # Format code with Prettier

# Pre-commit hooks (Husky)
# Automatically runs on git commit:
# - Code formatting
# - Linting
# - Tests (optional)
```

## 🔧 Configuration

### Environment Variables
```bash
# Application Configuration
NODE_ENV=development|production|test
PORT=3000
APP_NAME=Marcel Backend

# Database Configuration
MONGO_URI=mongodb://localhost:27017/practicedb

# External API Keys
OPENAI_API_KEY=sk-...                 # For AI content generation
CHATGPT_API_KEY=sk-...               # Alternative key name

# Authentication (Future Implementation)
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret

# LinkedIn Scraping Credentials (in script files)
LINKEDIN_USERNAME=your-email@domain.com
LINKEDIN_PASSWORD=your-password

# Debugging
DEBUG_PUPPETEER=true                 # Enable Puppeteer debugging
HEADLESS_MODE=false                  # Show browser during scraping
```

### MongoDB Configuration
The application automatically connects to MongoDB using the `MONGO_URI` environment variable. The database will be created automatically if it doesn't exist.

#### Index Optimization
```javascript
// Recommended MongoDB indexes for better performance
db.articles.createIndex({ "url": 1 }, { unique: true })
db.articles.createIndex({ "type": 1 })
db.articles.createIndex({ "date": -1 })
db.articles.createIndex({ "baseUrl": 1 })
db.articles.createIndex({ "title": "text", "originalContent": "text" })  // For text search
```

### Logging Configuration
Winston logging is configured with multiple transports:

```typescript
// Automatic log files in:
log/
├── debug/debug.log      # All log levels
├── error/error.log      # Errors only
└── info/info.log        # Info and above

// Log format: JSON with timestamps
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Scraped 25 articles from SBB Cargo",
  "context": "ScraperService",
  "metadata": { "website": "sbbcargo", "articleCount": 25 }
}
```

## 🚀 Production Deployment

### Building for Production
```bash
# Build the application
npm run build

# Start in production mode
NODE_ENV=production npm run start:prod
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

# Install system dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

# Expose port and start
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  marcel-backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/practicedb
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - mongo
    volumes:
      - ./public:/app/public
      - ./log:/app/log

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=practicedb

volumes:
  mongodb_data:
```

### Performance Optimization

#### Database Optimization
```typescript
// Enable MongoDB connection pooling
MongooseModule.forRoot(process.env.MONGO_URI, {
  maxPoolSize: 10,        // Maximum number of connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4               // Use IPv4, skip trying IPv6
});
```

#### Caching Strategy
```typescript
// Implement Redis caching for frequently accessed data
import { CacheModule } from '@nestjs/cache-manager';

CacheModule.register({
  ttl: 300,              // 5 minutes default TTL
  max: 1000,             // Maximum cache entries
});
```

#### Rate Limiting
```typescript
// Protect scraping endpoints from abuse
import { ThrottlerModule } from '@nestjs/throttler';

ThrottlerModule.forRoot({
  ttl: 60000,            // 1 minute
  limit: 10,             // 10 requests per minute
});
```

## 🧪 Testing

### Test Structure
```
test/
├── e2e/                          # End-to-end tests
│   ├── articles.e2e-spec.ts     # Articles API tests
│   ├── scraper.e2e-spec.ts      # Scraper API tests
│   └── content-generator.e2e-spec.ts
src/
├── **/*.spec.ts                  # Unit tests alongside source files
└── **/*.integration.spec.ts      # Integration tests
```

### Running Tests
```bash
# Unit tests
npm test                          # Run all unit tests
npm run test:watch               # Watch mode for development
npm run test:cov                 # Generate coverage report

# E2E tests
npm run test:e2e                 # Full end-to-end test suite

# Debug tests
npm run test:debug               # Debug mode (attach debugger on port 9229)
```

### Test Examples

#### Unit Test Example
```typescript
// articles.service.spec.ts
describe('ArticlesService', () => {
  let service: ArticlesService;
  let model: Model<ArticleDocument>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: getModelToken(Article.name), useValue: mockModel }
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    model = module.get<Model<ArticleDocument>>(getModelToken(Article.name));
  });

  it('should create article', async () => {
    const articleData = { /* test data */ };
    const result = await service.createArticle(articleData);
    expect(result).toBeDefined();
  });
});
```

#### E2E Test Example
```typescript
// scraper.e2e-spec.ts
describe('Scraper (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/scraper/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/scraper/test')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });
  });
});
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues
```bash
# Error: MongooseError: Operation `articles.findOne()` buffering timed out
# Solutions:
- Check MongoDB is running: mongod --version
- Verify connection string: mongodb://localhost:27017/practicedb
- Check network connectivity and firewall settings
- Ensure database user has proper permissions
```

#### 2. Puppeteer Issues
```bash
# Error: Failed to launch the browser process
# Solutions:
- Install Chrome/Chromium browser
- On Linux: sudo apt-get install -y chromium-browser
- Set PUPPETEER_EXECUTABLE_PATH environment variable
- For Docker: Use puppeteer/puppeteer image as base
```

#### 3. OpenAI API Issues
```bash
# Error: 401 Unauthorized
# Solutions:
- Verify OPENAI_API_KEY is correct
- Check API quota and billing status
- Ensure API key has required permissions
- Test key with: curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

#### 4. Image Processing Issues
```bash
# Error: ENOSPC: no space left on device
# Solutions:
- Check disk space in public/ directory
- Implement image cleanup routine
- Compress images before saving
- Use cloud storage for production
```

#### 5. Memory Issues During Scraping
```bash
# Error: JavaScript heap out of memory
# Solutions:
- Increase Node.js memory: node --max-old-space-size=4096
- Process articles in smaller batches
- Close browser instances properly
- Implement garbage collection hints
```

### Debug Mode

#### Enable Detailed Logging
```bash
# Set environment variables for debugging
DEBUG=puppeteer:* npm run start:dev  # Puppeteer debugging
NODE_ENV=debug npm run start:dev     # Application debugging
```

#### Puppeteer Debug Mode
```typescript
// In scraping scripts, set headless: false to see browser
const { browser, page } = await getPuppeteerInstance();

// Add debug information
await page.on('console', msg => console.log('PAGE LOG:', msg.text()));
await page.on('error', err => console.log('PAGE ERROR:', err.message));
```

#### Database Query Debugging
```typescript
// Enable Mongoose debugging
mongoose.set('debug', true);

// Log slow queries
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
```

### Performance Monitoring

#### Monitor Scraping Performance
```typescript
// Add timing information to scraper services
const startTime = Date.now();
const articles = await getAllBernmobilArticles();
const endTime = Date.now();
console.log(`Scraped ${articles.length} articles in ${endTime - startTime}ms`);
```

#### Database Performance
```bash
# Monitor MongoDB operations
db.setProfilingLevel(2)  # Profile all operations
db.system.profile.find().limit(5).sort({ts: -1}).pretty()
```

## 🤝 Contributing

### Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/project-marcel-be.git
   cd project-marcel-be
   git remote add upstream https://github.com/original/project-marcel-be.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-website-scraper
   git checkout -b fix/date-parsing-issue
   git checkout -b improvement/api-performance
   ```

3. **Development Setup**
   ```bash
   npm install
   cp .env.example .env.development
   # Configure environment variables
   npm run start:dev
   ```

4. **Code Standards**
   ```bash
   npm run lint          # Check code style
   npm run format        # Auto-format code
   npm test             # Run tests
   ```

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add scraper for new railway website"
   git push origin feature/new-website-scraper
   ```

6. **Create Pull Request**
   - Open PR against main repository
   - Provide detailed description
   - Include screenshots/examples if applicable
   - Ensure all CI checks pass

### Code Style Guidelines

#### TypeScript Standards
```typescript
// Use explicit types
async getAllArticles(): Promise<Article[]> {
  return this.articleModel.find();
}

// Use proper error handling
try {
  const result = await this.scraperService.scrapeWebsite();
  return result;
} catch (error) {
  this.logger.error('Scraping failed', error);
  throw new InternalServerErrorException('Scraping failed');
}

// Use descriptive variable names
const transportationArticles = await this.getArticlesByType(ArticleType.News);
```

#### File Naming Conventions
```
# Files
kebab-case.service.ts        # Services
kebab-case.controller.ts     # Controllers  
kebab-case.script.ts         # Scraping scripts
kebab-case.dto.ts           # Data transfer objects
kebab-case.spec.ts          # Test files

# Directories
kebab-case/                 # Module directories
```

#### Comment Standards
```typescript
/**
 * Scrapes articles from BLS railway website
 * @param maxPages - Maximum number of pages to scrape
 * @returns Promise<Article[]> - Array of scraped articles
 */
async getAllBlsArticles(maxPages = 5): Promise<Article[]> {
  // Implementation details
}

// TODO: Add support for pagination
// FIXME: Handle edge case where date is null
// NOTE: This method requires Chrome browser
```

### Adding New Features

#### New Website Scraper Checklist
- [ ] Create scraping script in `scraping-scripts/`
- [ ] Add list and deep scraping functions
- [ ] Handle errors gracefully
- [ ] Add to ScraperService and ScraperDeeperService
- [ ] Write unit tests
- [ ] Test with actual website
- [ ] Document any special requirements
- [ ] Update this README

#### New API Endpoint Checklist
- [ ] Create/update DTO classes
- [ ] Add controller method
- [ ] Implement service logic
- [ ] Add input validation
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Update API documentation
- [ ] Consider rate limiting needs

## 📄 License

This project is **UNLICENSED** as specified in package.json. All rights reserved.

## 👨‍💻 Authors

**Saifeddine RHOUMA** - *Project Creator and Lead Developer*

## 🆘 Support & Contact

### Getting Help

1. **Documentation**: Check this README and inline code comments
2. **Issues**: Search existing GitHub issues for similar problems
3. **Debugging**: Use debug mode and logging for troubleshooting
4. **Community**: Reach out to the development team

### Reporting Issues

When reporting issues, please include:
- Node.js and npm versions
- Environment configuration (development/production)
- Error messages and stack traces
- Steps to reproduce the issue
- Expected vs actual behavior

### Feature Requests

For new feature requests:
- Describe the use case and business value
- Provide mockups or examples if applicable
- Consider backward compatibility
- Discuss implementation approach

---

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ **Initial Release**: Complete scraping system with 35+ website support
- ✅ **MongoDB Integration**: Full database operations with Mongoose ODM
- ✅ **AI Content Generation**: OpenAI GPT integration for content enhancement
- ✅ **REST API**: Comprehensive API for all operations
- ✅ **Image Processing**: Download, enhancement, and optimization
- ✅ **Robust Error Handling**: Graceful failure handling and logging
- ✅ **TypeScript**: Full type safety and developer experience
- ✅ **Testing Setup**: Unit and E2E testing framework
- ✅ **Docker Support**: Containerization ready
- ✅ **Production Ready**: Logging, monitoring, and deployment configurations

### Planned Features (Future Releases)
- 🔄 **Authentication System**: JWT-based user authentication
- 🔄 **Rate Limiting**: Advanced throttling and quota management  
- 🔄 **Caching Layer**: Redis integration for improved performance
- 🔄 **Webhook Support**: Real-time notifications for new content
- 🔄 **Analytics Dashboard**: Content performance and scraping metrics
- 🔄 **Advanced AI Features**: Content categorization and sentiment analysis
- 🔄 **Multi-language Support**: Content translation capabilities
- 🔄 **API Versioning**: Support for multiple API versions
- 🔄 **GraphQL Endpoint**: Alternative to REST API
- 🔄 **Scheduled Scraping**: Automated content collection jobs

---

**Project Marcel Backend** - Empowering Swiss transportation industry content management through intelligent web scraping and AI-enhanced content generation.

*Built with ❤️ for the Swiss transportation community*
