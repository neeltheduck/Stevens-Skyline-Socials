#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

function start(cmd, args, cwd) {
  const p = spawn(cmd, args, { cwd, stdio: 'inherit', shell: true });
  p.on('error', (err) => {
    console.error(`Failed to start process ${cmd} ${args.join(' ')}:`, err);
  });
  return p;
}

const root = path.join(__dirname, '..');
const apiDir = path.join(root, 'api');
const frontendDir = path.join(root, 'frontend');

console.log('Starting API (api) and Frontend (frontend)...');

const procs = [];
procs.push(start('npm', ['start'], apiDir));
procs.push(start('npm', ['run', 'dev'], frontendDir));

function cleanupAndExit(code) {
  // Try to kill children gracefully
  procs.forEach((p) => {
    try { p.kill('SIGINT'); } catch (e) {}
  });
  process.exit(code);
}

// When any child exits, shut down the other and exit with its code.
procs.forEach((p) => {
  p.on('exit', (code, sig) => {
    console.log(`Child exited with code=${code} sig=${sig}`);
    cleanupAndExit(code || 0);
  });
});

process.on('SIGINT', () => {
  console.log('Caught SIGINT, shutting down children...');
  cleanupAndExit(0);
});

process.on('SIGTERM', () => {
  console.log('Caught SIGTERM, shutting down children...');
  cleanupAndExit(0);
});
