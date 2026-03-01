import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverDir = join(__dirname, 'zubi-magical-forest', 'server');
const clientDir = join(__dirname, 'zubi-magical-forest', 'client');

console.log('\n🌲 Starting Magical Forest Chat Application...\n');

// Start server
console.log('📦 Starting Express server...');
const server = spawn('node', ['index.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

// Start client
console.log('⚛️  Starting React client...\n');
setTimeout(() => {
  const client = spawn('npm', ['run', 'dev'], {
    cwd: clientDir,
    stdio: 'inherit',
    shell: true
  });

  client.on('error', (err) => {
    console.error('Client error:', err);
  });
}, 2000);

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down...');
  server.kill();
  process.exit(0);
});
