#!/bin/bash

# MILA Android APK Builder
# Automates the APK build process

set -e  # Exit on error

echo "🌾 MILA Android APK Builder 🌾"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Check prerequisites
echo -e "${BLUE}📋 Step 1: Checking prerequisites...${NC}"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm found${NC}"

# Check if Android folder exists
if [ ! -d "android" ]; then
    echo -e "${YELLOW}⚠️  Android platform not found. Will initialize...${NC}"
    NEED_INIT=true
else
    echo -e "${GREEN}✅ Android platform found${NC}"
    NEED_INIT=false
fi

echo ""

# Step 2: Install dependencies
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Build web app
echo -e "${BLUE}🔨 Step 3: Building web app...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed. 'dist' folder not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Web app built successfully${NC}"
echo ""

# Step 4: Initialize Capacitor (if needed)
if [ "$NEED_INIT" = true ]; then
    echo -e "${BLUE}🔧 Step 4: Initializing Capacitor...${NC}"
    
    # Check if capacitor.config.ts exists
    if [ ! -f "capacitor.config.ts" ]; then
        echo -e "${YELLOW}Creating capacitor.config.ts...${NC}"
        npx cap init "MILA" "com.mila.fieldmanagement" --web-dir=dist
    fi
    
    echo -e "${GREEN}✅ Capacitor initialized${NC}"
    echo ""
fi

# Step 5: Add Android platform (if needed)
if [ ! -d "android" ]; then
    echo -e "${BLUE}📱 Step 5: Adding Android platform...${NC}"
    npx cap add android
    echo -e "${GREEN}✅ Android platform added${NC}"
    echo ""
fi

# Step 6: Sync to Android
echo -e "${BLUE}🔄 Step 6: Syncing to Android...${NC}"
npx cap sync android
echo -e "${GREEN}✅ Synced to Android${NC}"
echo ""

# Step 7: Build APK with Gradle
echo -e "${BLUE}🏗️  Step 7: Building APK...${NC}"
echo -e "${YELLOW}This may take 5-10 minutes on first run...${NC}"
echo ""

cd android

# Make gradlew executable
chmod +x gradlew

# Build debug APK
./gradlew assembleDebug

cd ..

# Check if APK was created
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo ""
    echo -e "${GREEN}✅✅✅ SUCCESS! ✅✅✅${NC}"
    echo ""
    echo "================================"
    echo -e "${GREEN}📱 APK Built Successfully!${NC}"
    echo "================================"
    echo ""
    echo -e "📦 APK Location:"
    echo -e "   ${BLUE}android/app/build/outputs/apk/debug/app-debug.apk${NC}"
    echo ""
    echo "📊 APK Size:"
    du -h android/app/build/outputs/apk/debug/app-debug.apk | awk '{print "   " $1}'
    echo ""
    echo "📱 To install on your phone:"
    echo "   1. Copy app-debug.apk to your Android phone"
    echo "   2. Open the file on your phone"
    echo "   3. Allow installation from unknown sources"
    echo "   4. Tap Install"
    echo ""
    echo "🔌 Or install via USB:"
    echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo -e "${GREEN}🌾 Your MILA APK is ready! 🌾${NC}"
else
    echo -e "${RED}❌ APK build failed. Check errors above.${NC}"
    exit 1
fi
