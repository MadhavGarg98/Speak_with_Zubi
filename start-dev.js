const { spawn } = require('child_process');
const path = require('path');

const clientDir = path.join(__dirname, 'zubi-magical-forest', 'client');

console.log('[v0] Starting development server...');
console.log('[v0] Working directory:', clientDir);

const dev = spawn('npm', ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

dev.on('error', (err) => {
  console.error('[v0] Failed to start dev server:', err);
  process.exit(1);
});

dev.on('exit', (code) => {
  console.log('[v0] Dev server exited with code:', code);
  process.exit(code);
});
