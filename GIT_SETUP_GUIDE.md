# Git Repository Setup Guide

## ✅ Repository Connected

**Repository**: https://github.com/ShinUrech/marcel-be  
**Branch**: master  
**Status**: Git remote configured successfully

---

## 🚀 Getting Started on Your Local Machine

### Option 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/ShinUrech/marcel-be.git
cd marcel-be

# Install dependencies
npm install

# Generate LinkedIn cookies
npm run linkedin:login
# (A browser will open - login and solve CAPTCHA)

# Upload cookies to server
scp linkedin-cookies.json root@94.130.107.182:/var/www/railway-scraper/

# Restart the server application
ssh root@94.130.107.182 "pm2 restart railway-scraper"
```

---

### Option 2: Direct SCP (If GitHub is not accessible)

```bash
# Copy from server
scp -r root@94.130.107.182:/var/www/railway-scraper ~/marcel-be
cd ~/marcel-be

# Install dependencies
npm install

# Generate LinkedIn cookies
npm run linkedin:login

# Upload cookies back
scp linkedin-cookies.json root@94.130.107.182:/var/www/railway-scraper/

# Restart server
ssh root@94.130.107.182 "pm2 restart railway-scraper"
```

---

## 📝 Workflow for Future Updates

### Making Changes Locally

```bash
# 1. Pull latest changes
git pull origin master

# 2. Make your changes
# ... edit files ...

# 3. Test locally (optional)
npm run build
npm run start:prod

# 4. Commit changes
git add .
git commit -m "Description of changes"

# 5. Push to GitHub
git push origin master
```

### Deploying to Server

```bash
# SSH into server
ssh root@94.130.107.182

# Navigate to project
cd /var/www/railway-scraper

# Pull latest changes
git pull origin master

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart PM2
pm2 restart railway-scraper

# Check logs
pm2 logs railway-scraper --lines 50
```

---

## 🔧 Quick Commands Reference

### On Your Local Machine

```bash
# Clone repository
git clone https://github.com/ShinUrech/marcel-be.git

# Generate LinkedIn cookies
cd marcel-be
npm install
npm run linkedin:login

# Upload cookies
scp linkedin-cookies.json root@94.130.107.182:/var/www/railway-scraper/

# SSH to server
ssh root@94.130.107.182
```

### On the Server

```bash
# Update code
cd /var/www/railway-scraper
git pull origin master
npm install
npm run build

# Restart application
pm2 restart railway-scraper

# View logs
pm2 logs railway-scraper
pm2 logs railway-scraper --lines 100

# Check status
pm2 status
```

---

## 📦 Important Files

| File | Purpose | Location |
|------|---------|----------|
| `linkedin-cookies.json` | LinkedIn session cookies | Root directory |
| `ecosystem.config.js` | PM2 configuration | Root directory |
| `package.json` | Dependencies & scripts | Root directory |
| `src/` | Source code | TypeScript files |
| `dist/` | Compiled code | Built from src/ |

---

## 🔐 Environment Variables

Configured in `ecosystem.config.js`:

```javascript
LINKEDIN_EMAIL: 'urechshin@gmail.com'
LINKEDIN_PASSWORD: 'Mutsumi8139'
MONGO_URI: 'mongodb+srv://...'
CHATGPT_API_KEY: 'sk-proj-...'
```

---

## 🎯 LinkedIn Cookie Generation Process

### Why Local Machine?

LinkedIn's CAPTCHA requires:
- A real browser with display
- Human interaction
- Cannot be automated on headless server

### Steps:

1. **Clone/download code to local machine**
2. **Run**: `npm run linkedin:login`
3. **Browser opens automatically**
4. **Login**: Use `urechshin@gmail.com` / `Mutsumi8139`
5. **Solve CAPTCHA** manually
6. **Wait**: Script saves cookies automatically
7. **Upload**: `scp linkedin-cookies.json root@94.130.107.182:/var/www/railway-scraper/`
8. **Restart**: `ssh root@94.130.107.182 "pm2 restart railway-scraper"`

---

## 🧪 Testing

### Test LinkedIn Scraping

```bash
# From your local machine or server
curl "http://94.130.107.182:3000/api/scraper/linkedin/siemens"

# Or trigger a scrape
curl -X POST "http://94.130.107.182:3000/api/tasks/scrape/linkedin/siemens"
```

### Expected Success Response

```json
{
  "success": true,
  "companyName": "siemens",
  "postsScraped": 15,
  "message": "Successfully scraped LinkedIn company"
}
```

---

## 🆘 Troubleshooting

### "Module not found" errors

```bash
npm install
```

### Git issues on server

```bash
git config --global --add safe.directory /var/www/railway-scraper
```

### PM2 not restarting

```bash
pm2 delete railway-scraper
pm2 start ecosystem.config.js
```

### Build errors

```bash
rm -rf dist node_modules
npm install
npm run build
```

---

## 📊 Server Information

- **IP**: 94.130.107.182
- **Project Path**: `/var/www/railway-scraper`
- **Node Process**: PM2 (railway-scraper)
- **Port**: 3000
- **Branch**: master

---

## ✨ Next Steps

1. ✅ Git remote configured
2. ⏳ Clone repository locally
3. ⏳ Generate LinkedIn cookies
4. ⏳ Upload cookies to server
5. ⏳ Test LinkedIn scraping
6. ✅ Done!

---

## 📞 Quick Help

If you need immediate access to the code:

```bash
# Single command to clone and setup
git clone https://github.com/ShinUrech/marcel-be.git && cd marcel-be && npm install
```

Then run the LinkedIn login helper:

```bash
npm run linkedin:login
```

That's it! 🚀
