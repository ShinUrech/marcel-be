#!/bin/bash

# Project Marcel - Comprehensive Scraping Script
# This script scrapes all configured websites and logs the results

# Configuration
PROJECT_DIR="/var/www/railway-scraper"
LOG_DIR="$PROJECT_DIR/log/cron"
API_BASE_URL="http://localhost:3000/api"
DATE_STAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="$LOG_DIR/scrape-$DATE_STAMP.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Start logging
echo "========================================" | tee -a "$LOG_FILE"
echo "Project Marcel - Scraping Job Started" | tee -a "$LOG_FILE"
echo "Date: $(date)" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# Function to call API endpoint and log result
scrape_endpoint() {
    local endpoint=$1
    local name=$2
    
    echo "" | tee -a "$LOG_FILE"
    echo "Scraping: $name..." | tee -a "$LOG_FILE"
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE_URL/$endpoint")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        echo "✅ SUCCESS - $name (HTTP $http_code)" | tee -a "$LOG_FILE"
        echo "Response: $body" | tee -a "$LOG_FILE"
    else
        echo "❌ FAILED - $name (HTTP $http_code)" | tee -a "$LOG_FILE"
        echo "Response: $body" | tee -a "$LOG_FILE"
    fi
}

# Check if server is running
echo "" | tee -a "$LOG_FILE"
echo "Checking if server is running..." | tee -a "$LOG_FILE"
if ! curl -s "$API_BASE_URL/scraper/test" > /dev/null; then
    echo "❌ ERROR: Server is not running at $API_BASE_URL" | tee -a "$LOG_FILE"
    echo "Please start the server with: cd $PROJECT_DIR && pm2 start ecosystem.config.js" | tee -a "$LOG_FILE"
    exit 1
fi
echo "✅ Server is running" | tee -a "$LOG_FILE"

# Scrape all major railway companies
echo "" | tee -a "$LOG_FILE"
echo "=== Railway Companies ===" | tee -a "$LOG_FILE"
scrape_endpoint "scraper/sbbcargo" "SBB Cargo"
scrape_endpoint "scraper/bls" "BLS"
scrape_endpoint "scraper/rhb" "RhB"
scrape_endpoint "scraper/sob" "SOB"
scrape_endpoint "scraper/zentralbahn" "Zentralbahn"

# Scrape public transport operators
echo "" | tee -a "$LOG_FILE"
echo "=== Public Transport Operators ===" | tee -a "$LOG_FILE"
scrape_endpoint "scraper/bernmobil" "Bernmobil"
scrape_endpoint "scraper/zvv" "ZVV"
scrape_endpoint "scraper/vvl" "VVL"
scrape_endpoint "scraper/rbs" "RBS"
scrape_endpoint "scraper/aargauverkehr" "Aargau Verkehr"

# Scrape technology & industry
echo "" | tee -a "$LOG_FILE"
echo "=== Technology & Industry ===" | tee -a "$LOG_FILE"
scrape_endpoint "scraper/alstom" "Alstom"
scrape_endpoint "scraper/abb" "ABB"
scrape_endpoint "scraper/doppelmayr" "Doppelmayr"
scrape_endpoint "scraper/hupac" "Hupac"
scrape_endpoint "scraper/rhomberg-sersa" "Rhomberg Sersa"

# Scrape news & media
echo "" | tee -a "$LOG_FILE"
echo "=== News & Media ===" | tee -a "$LOG_FILE"
scrape_endpoint "scraper/lok-report" "Lok Report"
scrape_endpoint "scraper/railmarket" "Rail Market"
scrape_endpoint "scraper/baublatt" "Baublatt"
scrape_endpoint "scraper/pro-bahn" "Pro Bahn"
scrape_endpoint "scraper/presseportal" "Presseportal"

# Scrape government & organizations
echo "" | tee -a "$LOG_FILE"
echo "=== Government & Organizations ===" | tee -a "$LOG_FILE"
scrape_endpoint "scraper/otif" "OTIF"
scrape_endpoint "scraper/voev" "VOEV"

# Post-processing tasks
echo "" | tee -a "$LOG_FILE"
echo "=== Post-Processing ===" | tee -a "$LOG_FILE"
scrape_endpoint "scraper/formateDates" "Format Dates"
scrape_endpoint "scraper/download" "Download Images"

# Summary
echo "" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "Scraping Job Completed" | tee -a "$LOG_FILE"
echo "Date: $(date)" | tee -a "$LOG_FILE"
echo "Log file: $LOG_FILE" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# Keep only last 30 days of logs
find "$LOG_DIR" -name "scrape-*.log" -type f -mtime +30 -delete

exit 0
