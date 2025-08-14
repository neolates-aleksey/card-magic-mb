#!/bin/bash

# Deploy script for Card Magic FX

echo "🚀 Building Card Magic FX..."

# Build the project
npm run build

echo "✅ Build completed!"

echo "📁 Build output is in the 'dist' folder"
echo "🌐 You can now deploy the contents of 'dist' to your hosting provider"
echo ""
echo "For GitHub Pages:"
echo "1. Push your code to GitHub"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Set source to 'gh-pages' branch"
echo ""
echo "For other hosting providers:"
echo "Upload the contents of the 'dist' folder to your web server" 