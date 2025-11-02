# LinkedIn CAPTCHA Solution - Manual Login Helper

## Problem
LinkedIn requires CAPTCHA verification when scraping. Running in headless mode on a server can't solve CAPTCHAs.

## Solution
Solve the CAPTCHA **once** on your local machine, save the cookies, then use those cookies on the server.

---

## Step-by-Step Instructions

### 1. Run Login Helper Locally (On Your Computer)

```bash
# Make sure you're on your LOCAL machine (not the server)
cd /path/to/railway-scraper

# Set your LinkedIn credentials
export LINKEDIN_EMAIL="a7195031@gmail.com"
export LINKEDIN_PASSWORD="Mutsumi8139"

# Run the login helper
npm run linkedin:login
```

OR run it directly:

```bash
LINKEDIN_EMAIL="a7195031@gmail.com" LINKEDIN_PASSWORD="Mutsumi8139" npm run linkedin:login
```

### 2. Solve the CAPTCHA

- A browser window will open
- The script will auto-fill your credentials and click login
- If CAPTCHA appears, **solve it manually** in the browser
- Wait for the page to redirect to LinkedIn feed/home
- The script will automatically save cookies

### 3. Upload Cookies to Server

```bash
# From your local machine, upload the cookies file
scp linkedin-cookies.json root@your-server:/var/www/railway-scraper/

# OR if using the railway user:
scp linkedin-cookies.json railway@your-server:/var/www/railway-scraper/
```

### 4. Restart the Scraper

```bash
# SSH into your server
ssh root@your-server

# Switch to railway user and restart
su - railway -c "cd /var/www/railway-scraper && pm2 restart railway-scraper"
```

### 5. Test LinkedIn Scraping

```bash
curl "http://localhost:3000/api/scraper/linkedin/bls-ag"
```

---

## How It Works

1. **Login Helper** opens a visible browser on your local machine
2. **You solve CAPTCHA** manually (once)
3. **Cookies are saved** to `linkedin-cookies.json`
4. **Server uses cookies** from the file (no CAPTCHA needed)
5. **Cookies are valid** for weeks/months

---

## Troubleshooting

### Cookies expired?
If scraping starts failing again, repeat steps 1-4 to get fresh cookies.

### Can't run locally?
You can also:
1. Set `LINKEDIN_HEADLESS=false` in `ecosystem.config.js` temporarily
2. Use VNC or X11 forwarding to access the server's display
3. Use a CAPTCHA solver service (2Captcha, Anti-Captcha)

### Where are cookies stored on server?
```
/var/www/railway-scraper/linkedin-cookies.json
```

Check if they exist:
```bash
cat /var/www/railway-scraper/linkedin-cookies.json | head
```

---

## Alternative: Use the Existing Cookies

The server already has cookies at `/var/www/railway-scraper/linkedin-cookies.json`. 

Check if they're still valid:
```bash
curl -m 120 "http://localhost:3000/api/scraper/linkedin/sbb-cff-ffs"
```

If you see navigation timeout errors, the cookies are expired and need to be refreshed using the steps above.

---

## Security Note

⚠️ **Never commit `linkedin-cookies.json` to git!** 

It contains your session tokens. Keep it secure.
