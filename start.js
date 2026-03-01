#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
};

console.log(`${colors.green}🌲 Starting Magical Forest Chat...${colors.reset}\n`);

// Start server
const serverPath = path.join(__dirname, 'zubi-magical-forest', 'server');
console.log(`${colors.blue}📦 Installing server dependencies...${colors.reset}`);
const serverInstall = spawn('npm', ['install'], { cwd: serverPath, stdio: 'inherit' });

serverInstall.on('close', (code) => {
  if (code !== 0) {
    console.error(`${colors.yellow}Server install exited with code ${code}${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.green}✓ Server dependencies installed${colors.reset}\n`);

  // Start client
  const clientPath = path.join(__dirname, 'zubi-magical-forest', 'client');
  console.log(`${colors.blue}📦 Installing client dependencies...${colors.reset}`);
  const clientInstall = spawn('npm', ['install'], { cwd: clientPath, stdio: 'inherit' });

  clientInstall.on('close', (code) => {
    if (code !== 0) {
      console.error(`${colors.yellow}Client install exited with code ${code}${colors.reset}`);
      process.exit(1);
    }

    console.log(`${colors.green}✓ Client dependencies installed${colors.reset}\n`);
    console.log(`${colors.green}🚀 Starting both servers...${colors.reset}\n`);

    // Start server
    const server = spawn('npm', ['start'], {
      cwd: serverPath,
      stdio: 'inherit',
      shell: true
    });

    // Start client
    const client = spawn('npm', ['run', 'dev'], {
      cwd: clientPath,
      stdio: 'inherit',
      shell: true
    });

    // Handle process exit
    process.on('SIGINT', () => {
      console.log(`\n${colors.yellow}Shutting down...${colors.reset}`);
      server.kill();
      client.kill();
      process.exit(0);
    });
  });
});
