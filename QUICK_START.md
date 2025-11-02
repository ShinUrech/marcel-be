# 🚀 Quick Start - LinkedIn Cookie Generation

## One-Command Setup

```bash
git clone https://github.com/ShinUrech/marcel-be.git && cd marcel-be && npm install && npm run linkedin:login
```

This will:
1. ✅ Clone the repository
2. ✅ Install dependencies
3. ✅ Open browser for LinkedIn login
4. ⏳ Wait for you to login and solve CAPTCHA
5. ✅ Save cookies automatically

## After Login Success

```bash
# Upload cookies to server
scp linkedin-cookies.json root@94.130.107.182:/var/www/railway-scraper/

# Restart server
ssh root@94.130.107.182 "pm2 restart railway-scraper"
```

## Test It Works

```bash
curl "http://94.130.107.182:3000/api/scraper/linkedin/siemens"
```

---

## Credentials (for login)

- **Email**: `urechshin@gmail.com`
- **Password**: `Mutsumi8139`

---

That's it! 🎉
