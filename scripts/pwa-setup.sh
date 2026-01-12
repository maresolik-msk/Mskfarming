#!/bin/bash

# MILA PWA Quick Setup Script
# This script automates the final PWA setup steps

echo "🚀 MILA PWA Setup Starting..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if icons exist
echo "📸 Step 1: Checking app icons..."
if [ -f "public/icon-192.png" ] && [ -f "public/icon-512.png" ]; then
    echo -e "${GREEN}✅ PNG icons found!${NC}"
else
    echo -e "${YELLOW}⚠️  PNG icons not found!${NC}"
    echo "Please convert SVG icons to PNG:"
    echo "  - public/icon-192.svg → public/icon-192.png"
    echo "  - public/icon-512.svg → public/icon-512.png"
    echo ""
    echo "Use: https://cloudconvert.com/svg-to-png"
    echo ""
fi

# Step 2: Check if service worker exists
echo ""
echo "🔧 Step 2: Checking service worker..."
if [ -f "public/sw.js" ]; then
    echo -e "${GREEN}✅ Service worker found!${NC}"
else
    echo -e "${YELLOW}⚠️  Service worker not found at public/sw.js${NC}"
fi

# Step 3: Check if manifest exists
echo ""
echo "📋 Step 3: Checking manifest..."
if [ -f "public/manifest.json" ]; then
    echo -e "${GREEN}✅ Manifest found!${NC}"
else
    echo -e "${YELLOW}⚠️  Manifest not found at public/manifest.json${NC}"
fi

# Step 4: Check if PWA component exists
echo ""
echo "🎨 Step 4: Checking PWA components..."
if [ -f "src/app/components/PWAInstallPrompt.tsx" ]; then
    echo -e "${GREEN}✅ PWAInstallPrompt component found!${NC}"
else
    echo -e "${YELLOW}⚠️  PWAInstallPrompt component not found${NC}"
fi

# Step 5: Check if service worker registration exists
echo ""
echo "📝 Step 5: Checking service worker registration..."
if [ -f "src/registerServiceWorker.ts" ]; then
    echo -e "${GREEN}✅ Service worker registration found!${NC}"
else
    echo -e "${YELLOW}⚠️  Service worker registration not found${NC}"
fi

# Summary
echo ""
echo "======================================"
echo "📊 PWA Setup Summary"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Convert SVG icons to PNG (if not done)"
echo "2. Add service worker registration to your entry file"
echo "3. Add PWA meta tags to index.html"
echo "4. Build and test: npm run build && npx vite preview"
echo "5. Deploy to production!"
echo ""
echo "📖 See PWA_DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo -e "${GREEN}🌾 Your MILA PWA is almost ready! 🌾${NC}"
