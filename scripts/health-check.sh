#!/bin/bash

# Project Marcel - Health Check Script
# Checks if the server is running and responsive

# Configuration
API_BASE_URL="http://localhost:3000/api"
LOG_DIR="/var/www/railway-scraper/log/cron"
LOG_FILE="$LOG_DIR/health-check.log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Perform health check
response=$(curl -s -w "\n%{http_code}" "$API_BASE_URL/scraper/test" 2>&1)
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" -eq 200 ]; then
    echo "[$TIMESTAMP] ✅ Server is healthy (HTTP 200)" >> "$LOG_FILE"
    exit 0
else
    echo "[$TIMESTAMP] ❌ Server health check failed (HTTP $http_code)" >> "$LOG_FILE"
    echo "[$TIMESTAMP] Response: $response" >> "$LOG_FILE"
    
    # Optional: Send alert or restart server
    # Uncomment the following to auto-restart on failure:
    # echo "[$TIMESTAMP] Attempting to restart server..." >> "$LOG_FILE"
    # cd /var/www/railway-scraper && pm2 restart railway-scraper
    
    exit 1
fi
