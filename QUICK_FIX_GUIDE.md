# Quick Reference: LinkedIn Cookie Generation

## ✅ Current Status (Nov 2, 2025)

**Application**: Running successfully on PM2  
**Account**: `urechshin@gmail.com` (active and accessible)  
**Issue**: Missing LinkedIn session cookies  
**Solution**: Generate cookies locally and upload to server

---

## 🚀 How to Fix (Step-by-Step)

### 1. On Your Local Machine

```bash
# Clone or access the repository
cd railway-scraper

# Install dependencies (if needed)
npm install

# Run the login helper
npm run linkedin:login
```

### 2. In the Browser Window

1. A Chromium browser will open automatically
2. LinkedIn login page will load
3. Enter credentials:
   - **Email**: `urechshin@gmail.com`
   - **Password**: `Mutsumi8139`
4. **Solve the CAPTCHA** (if shown)
5. Wait for successful login
6. The script will save cookies to `linkedin-cookies.json`

### 3. Upload Cookies to Server

```bash
# From your local machine
scp linkedin-cookies.json root@your-server-ip:/var/www/railway-scraper/
```

### 4. Restart PM2

```bash
# SSH into your server
ssh root@your-server-ip

# Restart the application
cd /var/www/railway-scraper
pm2 restart railway-scraper
```

### 5. Test LinkedIn Scraping

```bash
# Test a LinkedIn company scrape
curl "http://localhost:3000/api/scraper/linkedin/siemens"

# Or trigger a scrape
curl -X POST "http://localhost:3000/api/tasks/scrape/linkedin/siemens"
```

---

## 📝 Expected Results

### Success Indicators:
- ✅ Cookies file created: `linkedin-cookies.json`
- ✅ No "authwall" redirect in logs
- ✅ Posts found > 0
- ✅ Articles saved to database

### If Still Failing:
1. Check cookie file exists: `ls -lh /var/www/railway-scraper/linkedin-cookies.json`
2. Verify cookies loaded: `tail -f /root/.pm2/logs/railway-scraper-out-0.log | grep -i cookie`
3. Check for errors: `tail -f /root/.pm2/logs/railway-scraper-error-0.log`

---

## 🔄 Alternative: Quick Test

Want to test if other scrapers work while waiting?

```bash
# This will work WITHOUT LinkedIn cookies:
curl -X POST "http://localhost:3000/api/tasks/scrape/all"

# This scrapes:
# - 35+ news/industry websites
# - 14 YouTube channels
# - Skips LinkedIn (for now)
```

---

## 📁 Important Files

| File | Location | Purpose |
|------|----------|---------|
| Cookie file | `/var/www/railway-scraper/linkedin-cookies.json` | Session cookies |
| Login helper | `scripts/linkedin-login-helper.js` | Generate cookies |
| Config | `ecosystem.config.js` | PM2 environment vars |
| Scraper | `src/modules/scraper/services/scraping-scripts/linkedIn.script.ts` | LinkedIn logic |

---

## ⚠️ Important Notes

- **CAPTCHA**: Cannot be solved on headless server - must use local machine
- **Cookie Lifespan**: Cookies expire after weeks/months - regenerate as needed
- **Rate Limiting**: Don't scrape too aggressively to avoid LinkedIn blocks
- **Security**: Never commit `linkedin-cookies.json` to version control

---

## 🆘 Troubleshooting

### "Module not found" when running login helper
```bash
npm install
```

### Browser doesn't open
- Make sure you're on a machine with a display (not SSH)
- Try running with `DISPLAY=:0` prefix on Linux

### Cookies not working after upload
1. Regenerate cookies (they may have expired during upload)
2. Check file permissions: `chmod 644 linkedin-cookies.json`
3. Restart PM2: `pm2 restart railway-scraper`

### LinkedIn blocks the account
- Wait 24 hours before trying again
- Consider using a different account
- Reduce scraping frequency

---

## 📊 Environment Configuration

Current ecosystem.config.js settings:
```javascript
LINKEDIN_EMAIL: 'urechshin@gmail.com'
LINKEDIN_PASSWORD: 'Mutsumi8139'
```

**Status**: ✅ Configured and running

---

## Next Steps

1. ⏳ Run `npm run linkedin:login` on local machine
2. ⏳ Upload `linkedin-cookies.json` to server
3. ⏳ Restart PM2
4. ⏳ Test LinkedIn scraping
5. ✅ Done!

Once cookies are in place, LinkedIn scraping will work automatically for all 20 approved companies.
