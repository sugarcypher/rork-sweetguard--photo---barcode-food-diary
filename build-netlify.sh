#!/bin/bash
# Build script for Netlify deployment

set -e  # Exit on any error

echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps --no-audit --no-fund --force

echo "Building for web..."
npx expo export --platform web

echo "Build completed successfully!"