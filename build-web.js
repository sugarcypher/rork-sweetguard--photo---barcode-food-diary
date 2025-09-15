#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Netlify build process...');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());

try {
  // Check if package.json exists
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found');
  }

  // Clean npm cache
  console.log('Cleaning npm cache...');
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
  } catch (_e) {
    console.warn('Cache clean failed, continuing...');
  }

  // Install dependencies with legacy peer deps and force flag
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps --force --no-audit --no-fund', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build for web
  console.log('Building for web...');
  execSync('npx expo export --platform web', { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Verify dist directory was created
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output directory (dist) was not created');
  }

  console.log('Build completed successfully!');
  console.log('Output directory:', distPath);
} catch (error) {
  console.error('Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}