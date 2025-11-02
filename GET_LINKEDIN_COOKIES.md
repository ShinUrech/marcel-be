# 🍪 Get LinkedIn Cookies - Step by Step Guide

## 📋 Overview
You need to run the login helper **on your LOCAL computer** (with a display) to generate valid LinkedIn cookies for `urechshin@gmail.com`.

---

## 🚀 Steps to Get Cookies

### 1. On Your Local Machine (Mac/Windows/Linux with Display)

Open Terminal and run:

```bash
# Navigate to your local copy of the project
cd /path/to/railway-scraper

# If you don't have it locally, clone it first:
# git clone your-repo-url
# cd railway-scraper
# npm install

# Run the login helper with the correct credentials
LINKEDIN_EMAIL="urechshin@gmail.com" LINKEDIN_PASSWORD="Mutsumi8139" npm run linkedin:login
```

**What will happen:**
1. ✅ A browser window opens on your screen
2. ✅ Script auto-fills your LinkedIn credentials
3. ✅ Script clicks the login button
4. 🤖 **IF CAPTCHA appears** → Solve it manually in the browser
5. ⏱️  Script waits up to 5 minutes for you to solve CAPTCHA
6. ✅ Once logged in, cookies are saved to `linkedin-cookies.json`
7. ✅ Browser closes automatically

### 2. Verify Cookies Were Created

```bash
# Check if the file exists
ls -lh linkedin-cookies.json

# Preview the cookies (should show JSON array)
head -20 linkedin-cookies.json
```

You should see something like:
```json
[
  {
    "name": "li_at",
    "value": "AQEDATxyz...",
    "domain": ".linkedin.com",
    ...
  },
  ...
]
```

### 3. Upload Cookies to Server

```bash
# From your local machine, upload the cookies
scp linkedin-cookies.json root@your-server-ip:/var/www/railway-scraper/

# OR if using railway user:
scp linkedin-cookies.json railway@your-server-ip:/var/www/railway-scraper/
```

### 4. Restart the Scraper on Server

SSH into your server and restart PM2:

```bash
ssh root@your-server-ip

# Restart as railway user
su - railway -c "cd /var/www/railway-scraper && pm2 restart railway-scraper"
```

### 5. Test LinkedIn Scraping

```bash
# Test with a single company
curl -X POST "http://localhost:3000/api/tasks/scrape/linkedin/sbb-cff-ffs"

# Should return:
# {"success":true,"message":"Successfully scraped...","data":[...]}
```

---

## 🎯 Quick Command Summary

**On Local Machine:**
```bash
cd railway-scraper
LINKEDIN_EMAIL="urechshin@gmail.com" LINKEDIN_PASSWORD="Mutsumi8139" npm run linkedin:login
scp linkedin-cookies.json root@server:/var/www/railway-scraper/
```

**On Server:**
```bash
su - railway -c "pm2 restart railway-scraper"
curl -X POST "http://localhost:3000/api/tasks/scrape/linkedin/sbb-cff-ffs"
```

---

## ⚠️ Troubleshooting

### "Cannot find module puppeteer"
```bash
cd railway-scraper
npm install
```

### Browser doesn't open
Make sure you're on a computer with a display (not SSH terminal).

### CAPTCHA not showing
Wait a few seconds - it might appear after login attempt.

### Cookies not working on server
Make sure:
1. ✅ File is at `/var/www/railway-scraper/linkedin-cookies.json`
2. ✅ File has correct permissions: `chmod 644 linkedin-cookies.json`
3. ✅ PM2 restarted with new cookies
4. ✅ Using same email (`urechshin@gmail.com`) in both places

### Still getting "authwall" error
Cookies might have expired immediately. Try:
1. Clear LinkedIn cookies in your browser
2. Log out of LinkedIn completely
3. Run the script again
4. Use an incognito/private browser window

---

## 📝 Alternative: Manual Cookie Export

If the script doesn't work, you can export cookies manually:

1. **Log in to LinkedIn** in Chrome/Firefox with `urechshin@gmail.com`
2. **Install Cookie Extension**: "EditThisCookie" or "Cookie-Editor"
3. **Export cookies** for linkedin.com domain
4. **Save as** `linkedin-cookies.json`
5. **Upload to server** as described above

---

## 🔒 Security Notes

- ⚠️ **Never commit** `linkedin-cookies.json` to git
- 🔐 Cookies contain your session token
- ⏰ Cookies typically last weeks/months
- 🔄 Re-run this process when cookies expire

---

## ✅ Success Indicators

You'll know it worked when:
- ✅ Browser closes automatically after login
- ✅ `linkedin-cookies.json` file created locally
- ✅ File size > 1KB (contains actual cookie data)
- ✅ Server scraping returns posts (not empty array)
- ✅ No "authwall" or "checkpoint" in logs

---

## 🎉 Ready to Start!

Run this on your **LOCAL computer** now:

```bash
LINKEDIN_EMAIL="urechshin@gmail.com" LINKEDIN_PASSWORD="Mutsumi8139" npm run linkedin:login
```

Good luck! 🚀
