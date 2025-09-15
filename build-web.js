#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Starting Netlify build process...');
console.log('Node version:', process.version);

try {
  // Install dependencies with legacy peer deps and force flag
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps --force --no-audit --no-fund', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Build for web
  console.log('Building for web...');
  execSync('npx expo export --platform web', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}