#!/usr/bin/env node

/**
 * Master Test Runner for Project Marcel Backend
 * Executes all test suites in logical order and provides comprehensive reporting
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class MasterTestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      suites: [],
    };
    this.startTime = new Date();
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options,
      });

      process.on('close', (code) => {
        resolve(code);
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runTestSuite(name, command, description) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Running ${name} Tests`);
    console.log(`📝 ${description}`);
    console.log(`⚡ Command: ${command}`);
    console.log(`${'='.repeat(60)}`);

    const suiteStartTime = new Date();
    let exitCode;

    try {
      if (command.startsWith('node')) {
        const [, ...args] = command.split(' ');
        exitCode = await this.runCommand('node', args);
      } else {
        exitCode = await this.runCommand(command);
      }
    } catch (error) {
      console.error(`❌ Error running ${name}:`, error.message);
      exitCode = 1;
    }

    const duration = new Date() - suiteStartTime;
    const success = exitCode === 0;

    if (success) {
      console.log(`\n✅ ${name} Tests PASSED (${duration}ms)`);
      this.results.passed++;
    } else {
      console.log(`\n❌ ${name} Tests FAILED (${duration}ms)`);
      this.results.failed++;
    }

    this.results.suites.push({
      name,
      description,
      command,
      success,
      duration,
      exitCode,
    });

    return success;
  }

  async checkPrerequisites() {
    console.log('🔍 Checking Prerequisites...\n');

    // Check if test config exists
    const configPath = path.join(__dirname, 'test-config.json');
    if (!fs.existsSync(configPath)) {
      console.log('⚠️  Test config not found, but continuing...');
    } else {
      console.log('✅ Test configuration found');
    }

    // Check if package.json exists
    const packagePath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packagePath)) {
      console.log('❌ package.json not found');
      return false;
    } else {
      console.log('✅ package.json found');
    }

    // Check Node.js version
    console.log(`✅ Node.js version: ${process.version}`);

    return true;
  }

  generateReport() {
    const totalTime = new Date() - this.startTime;
    const total = this.results.passed + this.results.failed + this.results.skipped;

    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 TEST EXECUTION REPORT');
    console.log(`${'='.repeat(80)}`);
    console.log(`⏱️  Total Execution Time: ${totalTime}ms`);
    console.log(`📈 Total Test Suites: ${total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️  Skipped: ${this.results.skipped}`);
    console.log(`📊 Success Rate: ${total > 0 ? Math.round((this.results.passed / total) * 100) : 0}%`);

    console.log('\n📋 Suite Details:');
    this.results.suites.forEach((suite, index) => {
      const status = suite.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${suite.name} (${suite.duration}ms)`);
      if (!suite.success) {
        console.log(`   Command: ${suite.command}`);
        console.log(`   Exit Code: ${suite.exitCode}`);
      }
    });

    console.log(`\n${'='.repeat(80)}\n`);
  }

  async run() {
    console.log('🚀 Project Marcel Backend Test Suite');
    console.log('====================================\n');

    // Check prerequisites
    const prerequisitesOk = await this.checkPrerequisites();
    if (!prerequisitesOk) {
      console.log('❌ Prerequisites check failed');
      process.exit(1);
    }

    console.log('\n🎯 Starting Test Execution...\n');

    // Run test suites in logical order
    const testSuites = [
      {
        name: 'System Health',
        command: 'node test/system-test-runner.js',
        description: 'Verify database connectivity and server health',
      },
      {
        name: 'Integration',
        command: 'node test/integration/integration.test.js',
        description: 'Test component integration and workflows',
      },
    ];

    // Check if E2E test exists and add it
    const e2ePath = path.join(__dirname, 'e2e', 'api.e2e.spec.js');
    if (fs.existsSync(e2ePath)) {
      testSuites.push({
        name: 'E2E API',
        command: 'npm run test:e2e',
        description: 'End-to-end API testing with Supertest',
      });
    }

    // Execute test suites
    for (const suite of testSuites) {
      await this.runTestSuite(suite.name, suite.command, suite.description);

      // Add delay between suites
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Generate final report
    this.generateReport();

    // Exit with appropriate code
    const exitCode = this.results.failed > 0 ? 1 : 0;
    console.log(`🏁 Test execution completed with exit code: ${exitCode}`);

    if (exitCode === 0) {
      console.log('🎉 All tests passed! Your backend is ready to go!');
    } else {
      console.log('⚠️  Some tests failed. Please check the output above for details.');
      console.log('\n💡 Common solutions:');
      console.log('   - Ensure MongoDB is running (mongod)');
      console.log('   - Start the backend server (npm run start:dev)');
      console.log('   - Check network connectivity');
      console.log('   - Verify environment variables');
    }

    process.exit(exitCode);
  }
}

// Run the test suite if this script is executed directly
if (require.main === module) {
  const runner = new MasterTestRunner();
  runner.run().catch((error) => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = MasterTestRunner;
