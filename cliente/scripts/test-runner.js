#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.blue}=== Starting Test Suite ===${colors.reset}\n`);

// Run tests with coverage
const testProcess = spawn('npm', ['run', 'test:coverage'], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('exit', (code) => {
  if (code === 0) {
    console.log(`\n${colors.bright}${colors.green}✓ All tests passed successfully!${colors.reset}`);
    console.log(`\n${colors.cyan}Coverage report generated in coverage/ directory${colors.reset}`);
    console.log(`\n${colors.bright}Test Summary:${colors.reset}`);
    console.log(`${colors.cyan}• Unit Tests: Components and Services${colors.reset}`);
    console.log(`${colors.cyan}• Integration Tests: API and Context${colors.reset}`);
    console.log(`${colors.cyan}• Coverage Report: HTML, LCOV, and Text formats${colors.reset}`);
    
    console.log(`\n${colors.bright}Next Steps:${colors.reset}`);
    console.log('1. Review coverage report in ./coverage/lcov-report/index.html');
    console.log('2. Address any failing tests');
    console.log('3. Improve coverage where needed');
    
    console.log(`\n${colors.bright}Available Commands:${colors.reset}`);
    console.log('• npm test          - Run tests in watch mode');
    console.log('• npm run test:ci   - Run tests in CI mode');
    console.log('• npm run test:coverage - Generate coverage report');
  } else {
    console.log(`\n${colors.bright}${colors.red}✗ Some tests failed${colors.reset}`);
    console.log(`\n${colors.yellow}Please review the test output above and fix failing tests.${colors.reset}`);
    console.log(`\n${colors.bright}Troubleshooting:${colors.reset}`);
    console.log('1. Check test failures in the output above');
    console.log('2. Review test files in __tests__ directories');
    console.log('3. Verify component functionality');
    console.log('4. Check for recent code changes that might affect tests');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  testProcess.kill();
  console.log(`\n${colors.yellow}Test process terminated by user${colors.reset}`);
  process.exit();
});
