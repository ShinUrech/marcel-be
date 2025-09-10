# Targeted Scraping Implementation for Project Marcel

## Overview

This implementation ensures that the Project Marcel backend only scrapes content from **approved sources** specified in the provided PDF list. The system now validates all scraping requests against a curated list of LinkedIn company pages, YouTube channels, and approved websites.

## 🎯 What's Been Implemented

### 1. Target Sources Configuration (`target-sources.config.ts`)

**Location**: `/src/modules/scraper/services/scraping-config/target-sources.config.ts`

**Purpose**: Contains the curated list of approved sources from your PDF:

- **20 LinkedIn Company Pages** (e.g., SBB, BLS, Rhätische Bahn, Alstom, ABB)
- **14 YouTube Channels** (e.g., @sbbcffffs, @stadlerrailgroup, @rhaetischebahn)  
- **6 Approved Websites** (e.g., pro-bahn.ch, baublatt.ch, sev-online.ch)

**Key Features**:
```typescript
// Validation functions
isAllowedLinkedInCompany(companyName: string): boolean
isAllowedYouTubeChannel(channelName: string): boolean  
isAllowedWebsite(url: string): boolean

// Get active sources
getActiveLinkedInSources(), getActiveYouTubeSources(), getActiveWebsiteSources()
```

### 2. TasksService (`tasks.service.ts`)

**Location**: `/src/modules/scraper/services/tasks.service.ts`

**Purpose**: Orchestrates targeted scraping across all approved sources.

**Key Methods**:
- `runTargetedScraping()` - Scrapes all approved sources with rate limiting
- `scrapeTargetedYouTubeChannels()` - YouTube-specific scraping with search terms
- `scrapeTargetedLinkedInCompanies()` - LinkedIn company page scraping  
- `scrapeTargetedWebsites()` - Approved website scraping
- `scrapeSpecificYouTubeChannel(channel)` - Single channel with validation
- `scrapeSpecificLinkedInCompany(company)` - Single company with validation

**Safety Features**:
- ✅ **Validation**: All requests checked against approved lists
- ✅ **Rate Limiting**: Delays between requests (2-5 seconds)
- ✅ **Error Handling**: Individual failures don't stop the entire process
- ✅ **Logging**: Comprehensive logging of all scraping activities

### 3. Enhanced Existing Scrapers

**Updated Files**:
- `/scraping-scripts/youtube.script.ts` - Added approval validation
- `/scraping-scripts/linkedIn.script.ts` - Added approval validation

**Changes**:
```typescript
// Before scraping, validates if source is approved
if (!isAllowedYouTubeChannel(channelName)) {
  console.warn(`⚠️ YouTube channel '${channelName}' is not in approved list`);
  return [];
}
```

### 4. TasksController (`tasks.controller.ts`)

**Location**: `/src/modules/scraper/controllers/tasks.controller.ts`

**API Endpoints**:
- `POST /tasks/scrape/all` - Trigger complete targeted scraping
- `POST /tasks/scrape/youtube/:channelName` - Scrape specific YouTube channel
- `POST /tasks/scrape/linkedin/:companyName` - Scrape specific LinkedIn company
- `GET /tasks/sources` - View all approved sources
- `GET /tasks/health` - Service health check

### 5. Validation Endpoints

**Added to ScraperController**:
- `GET /scraper/validate/linkedin/:company` - Check if LinkedIn company is approved
- `GET /scraper/validate/youtube/:channel` - Check if YouTube channel is approved

## 🚀 How to Use

### Start Targeted Scraping (All Sources)

```bash
curl -X POST http://localhost:5000/api/tasks/scrape/all
```

### Scrape Specific YouTube Channel

```bash
# ✅ This will work (approved channel)
curl -X POST http://localhost:5000/api/tasks/scrape/youtube/sbbcffffs

# ❌ This will fail (not in approved list)  
curl -X POST http://localhost:5000/api/tasks/scrape/youtube/random-channel
```

### Scrape Specific LinkedIn Company

```bash
# ✅ This will work (approved company)
curl -X POST http://localhost:5000/api/tasks/scrape/linkedin/sbb-cff-ffs

# ❌ This will fail (not in approved list)
curl -X POST http://localhost:5000/api/tasks/scrape/linkedin/random-company
```

### Validate Sources Before Scraping

```bash
# Check if YouTube channel is approved
curl http://localhost:5000/api/scraper/validate/youtube/sbbcffffs

# Check if LinkedIn company is approved  
curl http://localhost:5000/api/scraper/validate/linkedin/sbb-cff-ffs
```

### View All Approved Sources

```bash
curl http://localhost:5000/api/tasks/sources
```

## 🔒 Security & Compliance

### What's Protected

1. **LinkedIn Scraping**: Only approved Swiss railway/transport companies
2. **YouTube Scraping**: Only approved channels from transport industry
3. **Website Scraping**: Only approved news/industry websites
4. **Automatic Rejection**: Any request for non-approved sources returns empty results

### Rate Limiting

- **YouTube**: 2 second delays between channels
- **LinkedIn**: 5 second delays between companies (respects LinkedIn ToS)
- **Websites**: 3 second delays between different websites

### Logging & Monitoring

All scraping activities are logged with:
- ✅ Source validation results
- 🕐 Timestamps and duration
- 📊 Success/failure rates
- ⚠️ Warning messages for rejected sources

## 📋 Approved Sources Summary

### LinkedIn Companies (20 approved)
- SBB CFF FFS, BLS AG, Rhätische Bahn AG
- Alstom, ABB, Siemens Mobility
- Stadler Rail Group, Rhomberg Sersa Rail Group
- Regional operators (RBS, etc.)
- Industry suppliers and more

### YouTube Channels (14 approved)  
- @sbbcffffs, @BLSBahn, @rhaetischebahn
- @stadlerrailgroup, @MatterhornGotthardBahn2003
- @MartiGroup, @ImpleniaTube
- @Bahnblogstelle and more

### Websites (6 approved)
- pro-bahn.ch, baublatt.ch, sev-online.ch
- eurailpress.de, bahnonline.ch, proalps.ch

## 🛠 Configuration Management

### Adding New Sources

To add new approved sources, edit `/target-sources.config.ts`:

```typescript
// Add to appropriate array
LINKEDIN_TARGETS.push({
  name: 'New Company',
  type: 'linkedin', 
  url: 'linkedin.com/company/new-company',
  active: true
});
```

### Temporarily Disabling Sources

```typescript
// Set active: false to temporarily disable
{ name: 'Company', type: 'linkedin', url: '...', active: false }
```

## 🔧 Technical Details

### Module Integration

The new services are integrated into the existing `ScraperModule`:

```typescript
@Module({
  controllers: [ScraperController, TasksController],
  providers: [ScraperService, TasksService, ...],
  exports: [ArticlesService, TasksService]
})
```

### Error Handling Strategy

1. **Individual Source Failures**: Logged but don't stop batch processing
2. **Validation Failures**: Return empty arrays with warning logs
3. **Network Failures**: Retry logic with exponential backoff
4. **Rate Limiting**: Respectful delays prevent service blocking

## 🚦 Next Steps

1. **Run the Backend**: `npm run start:dev`
2. **Test Validation**: Use the validation endpoints to verify setup
3. **Start Targeted Scraping**: Use the `/tasks/scrape/all` endpoint
4. **Monitor Logs**: Check console output for scraping progress
5. **Frontend Integration**: The existing frontend will display the scraped content

## ⚠️ Important Notes

- **LinkedIn Authentication**: Still uses hardcoded credentials (consider environment variables for production)
- **Scheduling**: Manual triggering implemented (can add cron jobs later with @nestjs/schedule)
- **Content Filtering**: Only sources from your PDF list will be scraped
- **Backward Compatibility**: Existing endpoints still work but now include validation

The system is now **fully compliant** with your requirement to only scrape the specific LinkedIn and YouTube sources listed in your PDF document. All scraping attempts are validated against this approved list before execution.
