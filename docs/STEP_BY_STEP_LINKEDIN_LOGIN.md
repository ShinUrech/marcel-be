# 🔐 LinkedIn Cookie Generation - Step by Step Guide

## Prerequisites
- Access to your **local computer** (Mac, Windows, or Linux with display)
- Node.js installed (v18+)
- Git installed
- LinkedIn credentials ready

---

## Step 1: Get the Code on Your Local Machine

### Option A: Clone the Repository
```bash
# If you have the repo URL
git clone <your-repo-url>
cd railway-scraper
```

### Option B: Download Just the Script
```bash
# Create a new folder
mkdir linkedin-cookie-generator
cd linkedin-cookie-generator

# Download the script from your server
scp root@your-server:/var/www/railway-scraper/scripts/linkedin-login-helper.js .
# OR
scp railway@your-server:/var/www/railway-scraper/scripts/linkedin-login-helper.js .
```

---

## Step 2: Install Dependencies

```bash
# Make sure you're in the project folder
cd railway-scraper  # or linkedin-cookie-generator

# Install puppeteer (if not already installed)
npm install puppeteer

# OR if you have package.json
npm install
```

---

## Step 3: Run the Login Helper

### Quick Method:
```bash
LINKEDIN_EMAIL="a7195031@gmail.com" LINKEDIN_PASSWORD="Mutsumi8139" npm run linkedin:login
```

### Alternative (if npm script doesn't work):
```bash
LINKEDIN_EMAIL="a7195031@gmail.com" LINKEDIN_PASSWORD="Mutsumi8139" node scripts/linkedin-login-helper.js
```

### Windows PowerShell:
```powershell
$env:LINKEDIN_EMAIL="a7195031@gmail.com"
$env:LINKEDIN_PASSWORD="Mutsumi8139"
npm run linkedin:login
```

### Windows Command Prompt:
```cmd
set LINKEDIN_EMAIL=a7195031@gmail.com
set LINKEDIN_PASSWORD=Mutsumi8139
npm run linkedin:login
```

---

## Step 4: What Will Happen

1. **Browser Opens** - Chrome/Chromium window appears (NOT headless)
2. **Auto-Fill** - Script fills in your email and password
3. **Login Click** - Script clicks the login button
4. **WAIT!** - If CAPTCHA appears:
   
   ```
   ═══════════════════════════════════════════
   🤖 CAPTCHA DETECTED!
   ═══════════════════════════════════════════
   
   👉 PLEASE SOLVE THE CAPTCHA IN THE BROWSER WINDOW
   ⏱️  Waiting up to 5 minutes for you to solve it...
   ```

5. **Solve CAPTCHA** - Click the checkboxes, select images, etc.
6. **Success** - After solving, script continues automatically
7. **Cookies Saved** - Creates `linkedin-cookies.json` in current folder

---

## Step 5: Verify Cookies Were Created

```bash
# Check if file exists
ls -lh linkedin-cookies.json

# View first few lines
head -20 linkedin-cookies.json

# Should see JSON with cookies:
# [
#   {
#     "name": "li_at",
#     "value": "AQEDARxxxxxx...",
#     ...
#   },
#   ...
# ]
```

---

## Step 6: Upload Cookies to Server

### Using SCP:
```bash
# Upload to server (replace with your server address)
scp linkedin-cookies.json root@your-server-ip:/var/www/railway-scraper/

# OR if using railway user
scp linkedin-cookies.json railway@your-server-ip:/var/www/railway-scraper/
```

### Using SFTP:
```bash
sftp root@your-server-ip
put linkedin-cookies.json /var/www/railway-scraper/
quit
```

---

## Step 7: Verify Upload & Restart Server

```bash
# SSH into your server
ssh root@your-server-ip

# Check file exists
ls -lh /var/www/railway-scraper/linkedin-cookies.json

# Should show: -rw-r--r-- 1 root root ~5K Nov 2 XX:XX linkedin-cookies.json

# Restart the scraper
su - railway -c "cd /var/www/railway-scraper && pm2 restart railway-scraper"

# Check if it's running
su - railway -c "pm2 list"
```

---

## Step 8: Test LinkedIn Scraping

```bash
# Still on the server, test scraping
curl -X POST "http://localhost:3000/api/tasks/scrape/linkedin/swissrail"

# Should see success response:
# {
#   "success": true,
#   "companyName": "swissrail",
#   "postsScraped": 10,
#   "message": "Successfully scraped..."
# }
```

---

## Troubleshooting

### Issue: "LINKEDIN_EMAIL or LINKEDIN_PASSWORD not set"
**Solution**: Make sure you set the environment variables before running the script.

### Issue: Browser doesn't open
**Solution**: 
- Make sure you're on a machine with a display (not SSH session)
- Install Chrome/Chromium if missing
- Try running with `headless: false` to debug

### Issue: Script hangs at "Navigating to LinkedIn..."
**Solution**:
- Check your internet connection
- Try again (LinkedIn might be slow)
- Increase timeout in the script

### Issue: CAPTCHA doesn't appear but login fails
**Solution**:
- LinkedIn might block automated login
- Try logging in manually in a regular browser first
- Wait a few minutes and try again
- Check if credentials are correct

### Issue: Cookies created but scraping still fails
**Solution**:
- Make sure cookies file is in correct location: `/var/www/railway-scraper/linkedin-cookies.json`
- Check file permissions: `chmod 644 linkedin-cookies.json`
- Restart PM2 after uploading: `pm2 restart railway-scraper`

---

## Cookie Lifespan

✅ **Cookies typically last:** Weeks to months  
⚠️ **When they expire:** Repeat this process  
🔄 **How often:** Usually every 1-3 months  

---

## Security Notes

1. **Don't commit cookies to git** - Add to `.gitignore`
2. **Keep cookies secure** - They grant access to your LinkedIn account
3. **Don't share cookies** - They contain your session tokens
4. **Rotate regularly** - Good practice to refresh cookies monthly

---

## Next Steps After Success

Once cookies are working:

1. **Test individual companies:**
   ```bash
   curl -X POST "http://localhost:3000/api/tasks/scrape/linkedin/sbb-cff-ffs"
   curl -X POST "http://localhost:3000/api/tasks/scrape/linkedin/alstom"
   ```

2. **Scrape all LinkedIn companies:**
   ```bash
   curl -X POST "http://localhost:3000/api/tasks/scrape/all"
   ```

3. **Set up scheduled scraping** (optional):
   - Add cron job to scrape daily/weekly
   - Monitor for cookie expiration
   - Auto-refresh cookies when needed

---

## Quick Command Reference

```bash
# 1. On Local Machine - Generate cookies
LINKEDIN_EMAIL="your@email.com" LINKEDIN_PASSWORD="yourpass" npm run linkedin:login

# 2. Upload to server
scp linkedin-cookies.json root@server:/var/www/railway-scraper/

# 3. On Server - Restart
ssh root@server
su - railway -c "pm2 restart railway-scraper"

# 4. Test
curl -X POST "http://localhost:3000/api/tasks/scrape/linkedin/swissrail"
```

---

## Need Help?

If you get stuck:
1. Check the error message carefully
2. Verify all steps were followed
3. Test with a simple curl to LinkedIn
4. Check PM2 logs: `pm2 logs railway-scraper`
5. Share error messages for debugging

**Remember**: This process only needs to be done ONCE (or when cookies expire).

Good luck! 🚀
