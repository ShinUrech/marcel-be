#!/usr/bin/env node

/**
 * Quick Test Setup and Execution Script
 * Helps users quickly run tests with proper setup
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runCommand(command, description) {
  console.log(`\n🔧 ${description}`);
  console.log(`⚡ Running: ${command}`);

  return new Promise((resolve) => {
    const process = spawn(command, {
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} - SUCCESS`);
      } else {
        console.log(`⚠️  ${description} - Exit code: ${code}`);
      }
      resolve(code);
    });

    process.on('error', (error) => {
      console.log(`❌ ${description} - ERROR: ${error.message}`);
      resolve(1);
    });
  });
}

async function checkSetup() {
  console.log('🔍 Checking Project Setup...\n');

  // Check if we're in the right directory
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.log("❌ package.json not found. Make sure you're in the project root directory.");
    return false;
  }

  // Check if node_modules exists
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Dependencies not installed. Installing...');
    await runCommand('npm install', 'Installing dependencies');
  } else {
    console.log('✅ Dependencies found');
  }

  return true;
}

async function quickHealthCheck() {
  console.log('\n🏥 Quick Health Check...\n');

  // Check if MongoDB is accessible
  console.log('🔍 Checking MongoDB...');
  try {
    await runCommand('mongosh --eval "db.runCommand({ ping: 1 })" --quiet', 'MongoDB connectivity test');
  } catch (error) {
    console.log('⚠️  MongoDB check failed - you may need to start MongoDB');
    console.log('💡 Try: mongod --dbpath /path/to/your/db');
  }

  // Check if backend is running
  console.log('\n🔍 Checking Backend Server...');
  try {
    await runCommand(
      'curl -f http://localhost:3001/scraper/test || echo "Server not responding"',
      'Backend health check',
    );
  } catch (error) {
    console.log('⚠️  Backend server check failed');
    console.log('💡 Try: npm run start:dev (in another terminal)');
  }
}

async function main() {
  console.log('🧪 Project Marcel - Quick Test Setup');
  console.log('===================================\n');

  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  switch (command) {
    case 'setup':
      console.log('🛠️  Setting up testing environment...\n');
      const setupOk = await checkSetup();
      if (setupOk) {
        console.log('\n✅ Setup completed successfully!');
        console.log('💡 Next steps:');
        console.log('   1. Start MongoDB: mongod');
        console.log('   2. Start backend: npm run start:dev');
        console.log('   3. Run tests: node test/quick-test.js test');
      }
      break;

    case 'check':
      await quickHealthCheck();
      break;

    case 'test':
      console.log('🚀 Running comprehensive test suite...\n');
      await runCommand('node test/run-all-tests.js', 'Master test runner');
      break;

    case 'system':
      console.log('🔧 Running system tests only...\n');
      await runCommand('node test/system-test-runner.js', 'System health tests');
      break;

    case 'integration':
      console.log('🔗 Running integration tests only...\n');
      await runCommand('node test/integration/integration.test.js', 'Integration tests');
      break;

    case 'help':
    default:
      console.log('Available commands:');
      console.log('');
      console.log('  setup       - Install dependencies and prepare testing');
      console.log('  check       - Quick health check of MongoDB and Backend');
      console.log('  test        - Run all test suites');
      console.log('  system      - Run system tests only');
      console.log('  integration - Run integration tests only');
      console.log('  help        - Show this help message');
      console.log('');
      console.log('Examples:');
      console.log('  node test/quick-test.js setup');
      console.log('  node test/quick-test.js test');
      console.log('  node test/quick-test.js check');
      break;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}
