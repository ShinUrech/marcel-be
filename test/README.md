# Project Marcel Backend - Testing Suite

This directory contains a comprehensive testing framework for the Project Marcel backend system. The tests are designed to verify all services work properly, from database connectivity to API endpoints and AI content generation.

## 📁 Test Structure

```
test/
├── README.md                     # This file - testing documentation
├── quick-test.js                 # Quick setup and execution script
├── run-all-tests.js             # Master test runner for all suites
├── system-test-runner.js        # System health and connectivity tests
├── test-config.json             # Testing configuration and scenarios
├── e2e/
│   └── api.e2e.spec.js          # End-to-end API testing
├── integration/
│   └── integration.test.js      # Integration testing between components
├── mocks/
│   ├── article.mock.ts          # Mock data structures (has TypeScript issues)
│   └── database.helper.ts       # Database testing utilities
└── unit/
    └── articles.service.spec.ts # Unit test templates (Jest type issues)
```

## 🚀 Quick Start

### 1. Setup and Check System Health
```bash
# Install dependencies and prepare testing
node test/quick-test.js setup

# Quick health check of MongoDB and Backend
node test/quick-test.js check
```

### 2. Run All Tests
```bash
# Run comprehensive test suite (recommended)
node test/quick-test.js test

# Or run the master test runner directly
node test/run-all-tests.js
```

### 3. Run Individual Test Suites
```bash
# System health tests only
node test/quick-test.js system

# Integration tests only
node test/quick-test.js integration

# Direct execution
node test/system-test-runner.js
node test/integration/integration.test.js
```

## 📋 Test Categories

### 🔧 System Tests (`system-test-runner.js`)
**Purpose:** Verify basic system health and connectivity
- ✅ Environment configuration validation
- ✅ Database connectivity (MongoDB)
- ✅ Server health checks
- ✅ API endpoint availability
- ✅ Scraper service status
- ✅ Articles API functionality
- ✅ Content generator accessibility

**When to use:** First line of testing, before starting development work

### 🔗 Integration Tests (`integration/integration.test.js`)
**Purpose:** Test component interaction and workflows
- ✅ Database operations (CRUD)
- ✅ Scraper workflow simulation
- ✅ Articles API comprehensive testing
- ✅ Content generation pipeline
- ✅ Full system integration scenarios

**When to use:** After system tests pass, to verify component interactions

### 🌐 End-to-End Tests (`e2e/api.e2e.spec.js`)
**Purpose:** Complete API testing as end users would experience
- ✅ All API endpoints
- ✅ Error handling
- ✅ Response validation
- ✅ Authentication flows (if implemented)

**When to use:** Final verification before deployment

### 🧪 Unit Tests (`unit/` - Partially Implemented)
**Purpose:** Test individual functions and classes
- ⚠️ Currently has TypeScript/Jest type issues
- 📝 Templates available for articles service

**Status:** Needs Jest type definitions to be fully functional

## 📊 Test Results Interpretation

### ✅ All Tests Passing
Your backend is healthy and all services are working correctly.

### ⚠️ Some Tests Failing
Common issues and solutions:

#### Database Connection Issues
```
✗ Database Connection: Connection failed
```
**Solution:**
- Start MongoDB: `mongod --dbpath /path/to/db`
- Check connection string in environment variables
- Verify MongoDB is accessible on the configured port

#### Server Not Running
```
✗ Server Health Check: Request failed with status code 404
```
**Solution:**
- Start the backend server: `npm run start:dev`
- Verify server is running on the expected port (default: 3001)
- Check server logs for startup errors

#### Environment Variables Missing
```
✗ Environment Configuration: Required environment variable not set
```
**Solution:**
- Set required environment variables:
  ```bash
  export MONGO_URI="mongodb://localhost:27017/marcel"
  export OPENAI_API_KEY="your-openai-key-here"  # Optional
  ```
- Create a `.env` file with necessary variables

#### OpenAI Integration Issues
```
✗ Content Generator: OpenAI API key not provided
```
**Solution:**
- Obtain OpenAI API key from https://platform.openai.com/api-keys
- Set environment variable: `export OPENAI_API_KEY="sk-..."`
- **Note:** Content generation tests will be skipped if no key is provided

## 🛠️ Prerequisites

### Required Services
1. **MongoDB** - Database service
   ```bash
   # Install MongoDB (if not installed)
   # Windows: Download from https://www.mongodb.com/try/download/community
   # macOS: brew install mongodb-community
   # Linux: apt-get install mongodb-community
   
   # Start MongoDB
   mongod --dbpath /path/to/your/database
   ```

2. **Node.js Backend** - Marcel API server
   ```bash
   # In the project root
   npm install
   npm run start:dev
   ```

### Optional Services
1. **OpenAI API Key** - For AI content generation testing
   - Sign up at https://platform.openai.com/
   - Generate API key
   - Set `OPENAI_API_KEY` environment variable

## 📈 Test Coverage

### What's Tested
- ✅ Database connectivity and operations
- ✅ All API endpoints functionality
- ✅ Web scraper service initialization
- ✅ Articles CRUD operations
- ✅ Content generation (if API key provided)
- ✅ Error handling and edge cases
- ✅ System integration workflows

### What's Not Tested Yet
- ⚠️ Individual scraper scripts (35+ websites)
- ⚠️ Image processing and storage
- ⚠️ Performance under load
- ⚠️ Security and authentication
- ⚠️ Unit-level function testing (Jest issues)

## 🔧 Troubleshooting

### Common Commands
```bash
# Reset and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check if services are running
# MongoDB
mongosh --eval "db.runCommand({ ping: 1 })"

# Backend server
curl http://localhost:3001/scraper/test

# Check logs
tail -f log/error/error.log
tail -f log/debug/debug.log
```

### Test-Specific Issues

#### Jest Type Errors
```
Cannot find module '@types/jest'
```
**Solution:**
```bash
npm install --save-dev @types/jest jest ts-jest
```

#### Supertest Module Not Found
```
Cannot find module 'supertest'
```
**Solution:**
```bash
npm install --save-dev supertest @types/supertest
```

#### Permission Errors (Linux/macOS)
```bash
chmod +x test/quick-test.js
chmod +x test/run-all-tests.js
```

## 🎯 Best Practices

### Before Running Tests
1. ✅ Ensure MongoDB is running
2. ✅ Start the backend server
3. ✅ Set necessary environment variables
4. ✅ Check that all dependencies are installed

### During Development
1. 🔄 Run system tests first to verify basic functionality
2. 🔄 Use integration tests to verify your changes work with other components
3. 🔄 Run full test suite before committing changes

### For Deployment
1. 📋 All system and integration tests must pass
2. 📋 E2E tests should pass for production readiness
3. 📋 Performance tests recommended for production loads

## 🤝 Contributing

To add new tests:
1. Follow the existing patterns in each test directory
2. Add test documentation to this README
3. Update `test-config.json` with new test scenarios
4. Ensure new tests work with the master test runner

## 📞 Getting Help

If you need an **OpenAI API key** for content generation testing, let the development team know. The tests will work without it but will skip AI-related functionality.

For other issues:
1. Check the troubleshooting section above
2. Review test output for specific error messages
3. Examine server and database logs
4. Verify all prerequisites are met

---

**Note:** This testing framework is designed to be comprehensive yet easy to use. It provides multiple levels of testing from quick health checks to full integration scenarios, helping ensure the Marcel backend system works reliably in all environments.
