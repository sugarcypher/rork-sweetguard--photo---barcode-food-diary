#!/bin/bash
# Build script for Netlify deployment

echo "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

echo "Building for web..."
npx expo export --platform web

echo "Build completed successfully!"