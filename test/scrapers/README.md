# 🧪 Scraper Test Suite - Project Marcel

Comprehensive testing framework for validating all 35+ website scrapers in the Project Marcel backend.

## 📁 Test Files

```
test/scrapers/
├── scraper-test-suite.js        # Main test runner - tests all scrapers
├── scraper-validator.js         # Data quality validation
├── quick-scraper-test.js        # Quick individual scraper testing
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Prerequisites

Ensure your backend server is running:
```bash
npm run start:dev
```

### 2. Test All Scrapers

Run the comprehensive test suite:
```bash
node test/scrapers/scraper-test-suite.js
```

This will:
- ✅ Test all 35+ scrapers
- ✅ Validate data quality
- ✅ Generate detailed reports
- ✅ Export results to JSON

**Expected Output:**
```
🧪 Testing SBB Cargo...
✅ Passed: 15 articles, all valid

🧪 Testing BLS...
✅ Passed: 8 articles, all valid

📊 TEST RESULTS SUMMARY
Total Scrapers Tested: 25
✅ Passed: 20
⚠️  Warnings: 3
❌ Failed: 2
Success Rate: 80.0%
```

### 3. Test Individual Scraper

Quick test a specific scraper:
```bash
# Test SBB scraper
node test/scrapers/quick-scraper-test.js sbb

# Test LinkedIn scraper
node test/scrapers/quick-scraper-test.js linkedin sbb-cff-ffs

# Test YouTube scraper
node test/scrapers/quick-scraper-test.js youtube sbbcffffs
```

### 4. Validate Data Quality

Check quality of scraped articles in database:
```bash
# Validate recent articles
node test/scrapers/scraper-validator.js

# Detailed test of specific scraper
node test/scrapers/scraper-validator.js scraper "SBB" "/scraper/sbb"
```

## 📊 Test Coverage

### What Gets Tested

#### 1. **Connectivity**
- ✅ Can reach the website
- ✅ Server responds correctly
- ✅ No network/timeout errors

#### 2. **Data Extraction**
- ✅ Articles are scraped
- ✅ Required fields present (title, URL, type)
- ✅ URLs are valid format
- ✅ Data types correct

#### 3. **Content Quality**
- ✅ Titles are meaningful (>10 chars)
- ✅ Dates are extracted and formatted
- ✅ Images are found (when available)
- ✅ Content is substantial (>100 chars for news)

#### 4. **Data Validation**
- ✅ No duplicate URLs
- ✅ No scraping artifacts (cookies, errors)
- ✅ Proper article type (News/Video/LinkedIn)
- ✅ Metadata present (for videos)

### Scrapers Tested

**Railway Companies:**
- SBB Cargo, BLS, RhB, SOB, Zentralbahn

**Public Transport:**
- ZVV, Bernmobil, RBS, VVL, Aargau Verkehr

**News Sites:**
- SEV Online, Baublatt, Pro-Bahn, Lok Report, Rail Market, Bahnblogstelle, Presseportal

**Industry:**
- Alstom, ABB, Hupac, Doppelmayr, Rhomberg Sersa, Cargorail, C. Vanoli

**Social Media:**
- LinkedIn (all approved companies)
- YouTube (all approved channels)

## 🎯 Understanding Test Results

### Status Levels

| Status | Meaning | Action |
|--------|---------|--------|
| **✅ Passed** | Scraper working perfectly | No action needed |
| **⚠️ Warning** | Scraper works but has minor issues | Review warnings |
| **❌ Failed** | Scraper not working | Immediate attention required |

### Quality Scores

Test suite assigns quality scores (0-100%) based on:
- **100%**: All fields extracted perfectly
- **80-99%**: Minor issues (missing image, date format)
- **60-79%**: Several fields missing or incorrect
- **<60%**: Major data quality problems

### Common Issues & Solutions

#### Issue: "No articles scraped"
**Possible Causes:**
- Website has no new content
- Website structure changed
- Rate limiting or blocking

**Solutions:**
1. Check website manually in browser
2. Verify scraper selectors in script file
3. Add delay between requests
4. Update User-Agent string

#### Issue: "Invalid URL format"
**Cause:** URL not properly constructed

**Solutions:**
1. Check URL building logic in script
2. Ensure base URL is correct
3. Handle relative vs absolute URLs

#### Issue: "Date not extracted"
**Cause:** Date selector not matching

**Solutions:**
1. Inspect website HTML for date element
2. Update date selector in script
3. Check date format parser

#### Issue: "Content too short"
**Cause:** Content selector not matching article body

**Solutions:**
1. Review content extraction logic
2. Check for pagination or "read more" buttons
3. Update content selector

## 🔧 Advanced Usage

### Custom Test Configuration

You can modify test behavior by editing the scripts:

**Adjust Timeouts:**
```javascript
// In scraper-test-suite.js
const config = {
  timeout: 120000  // 2 minutes for slow scrapers
};
```

**Test Specific Scrapers:**
```javascript
// In scraper-test-suite.js, line ~95
const scrapers = {
  'SBB': { category: 'Railway', endpoint: '/scraper/sbb' },
  // Add only the scrapers you want to test
};
```

**Change Validation Rules:**
```javascript
// In scraper-validator.js, line ~60
validateContent(content, minLength = 50) // Lower minimum content length
```

### Automated Testing

Add to your CI/CD pipeline:

```yaml
# .github/workflows/test-scrapers.yml
name: Test Scrapers
on: 
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm install
      - name: Start server
        run: npm run start:dev &
      - name: Wait for server
        run: sleep 30
      - name: Run scraper tests
        run: node test/scrapers/scraper-test-suite.js
```

### Monitoring

Set up monitoring for scraper health:

```bash
# Create a cron job
0 */6 * * * cd /path/to/project && node test/scrapers/scraper-test-suite.js > /var/log/scraper-test.log 2>&1
```

## 📈 Test Reports

### JSON Export

Every test run creates a detailed JSON report:

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "summary": {
    "total": 25,
    "passed": 20,
    "warnings": 3,
    "failed": 2,
    "successRate": "80.0",
    "totalDuration": 145230
  },
  "scrapers": [
    {
      "name": "SBB Cargo",
      "category": "Railway",
      "status": "passed",
      "articles": 15,
      "duration": 3421,
      "errors": [],
      "warnings": [],
      "sampleData": { ... }
    }
  ]
}
```

### Report Location

Reports are saved as:
```
test/scrapers/scraper-test-results-2025-01-15T10-30-00.json
```

## 🐛 Debugging Failed Scrapers

### Step 1: Isolate the Problem

Test the scraper individually:
```bash
node test/scrapers/quick-scraper-test.js sbb
```

### Step 2: Check Manually

Visit the website in your browser:
1. Can you see the articles?
2. Is the structure the same?
3. Are there any errors in browser console?

### Step 3: Inspect Script

Open the scraper script:
```
src/modules/scraper/services/scraping-scripts/sbb.script.ts
```

Check:
- CSS selectors still match
- URL construction is correct
- Error handling works

### Step 4: Test with Puppeteer Debug

Enable Puppeteer headless mode to see what's happening:

```typescript
// In puppeteer-instance.ts
const browser = await puppeteer.launch({ 
  headless: false,  // Shows browser window
  slowMo: 50        // Slows down for debugging
});
```

### Step 5: Update Selectors

If website structure changed, update selectors:

```typescript
// Before
const articles = document.querySelectorAll('.old-selector');

// After
const articles = document.querySelectorAll('.new-selector');
```

## 🎓 Best Practices

### 1. Run Tests Regularly

- **Daily**: Quick validation of all scrapers
- **Weekly**: Deep quality analysis
- **Before deployment**: Full test suite
- **After website changes**: Specific scraper tests

### 2. Monitor Trends

Track scraper health over time:
- Success rates declining? Website may be changing
- Response times increasing? May need optimization
- Quality scores dropping? Selectors need updates

### 3. Maintain Scripts

- Update selectors when websites change
- Add error handling for edge cases
- Document any website-specific quirks
- Test after major dependency updates

### 4. Handle Rate Limiting

Be respectful to websites:
- Add delays between requests (1-3 seconds)
- Use reasonable User-Agent strings
- Don't hammer websites with requests
- Respect robots.txt

### 5. Quality over Quantity

Better to have:
- 20 reliable scrapers than 50 broken ones
- High-quality extracted data than lots of bad data
- Well-maintained scripts than quick hacks

## 🆘 Getting Help

### Common Questions

**Q: All tests failing?**
A: Server probably isn't running. Start with `npm run start:dev`

**Q: Some scrapers always fail?**
A: Websites may block automated access or changed structure

**Q: Tests take too long?**
A: Adjust timeout values or test scrapers in parallel

**Q: How often should I run tests?**
A: At minimum, weekly. Daily is better for production systems.

### Resources

- **Puppeteer Docs**: https://pptr.dev/
- **CSS Selectors**: https://www.w3schools.com/cssref/css_selectors.asp
- **Project Marcel Docs**: See main README.md

### Support

If you need help:
1. Check the error message carefully
2. Review this documentation
3. Test manually in browser
4. Examine the scraper script
5. Check for recent website changes

---

## 🎉 Success Criteria

Your scrapers are healthy when:
- ✅ 80%+ of scrapers pass tests
- ✅ Average quality score >75%
- ✅ <5% complete failures
- ✅ Regular content being extracted
- ✅ No major data validation errors

**Remember:** Some warnings are normal (sites without images, varying date formats). Focus on eliminating failures and major quality issues.

---

*Last Updated: January 2025*