# MILA Mobile App Setup Guide

## 📱 Overview
Your MILA app is now configured for both **PWA (Progressive Web App)** and **Capacitor (Native iOS/Android)** deployment!

---

## ✅ What's Been Implemented

### 1. **PWA (Progressive Web App)** - READY TO USE! 
- ✅ `/public/manifest.json` - App manifest with MILA branding
- ✅ `/public/sw.js` - Service Worker for offline support  
- ✅ `/src/app/components/PWAInstallPrompt.tsx` - Install banner component
- ✅ Workbox packages installed for caching strategies

### 2. **Capacitor (Native Apps)** - CONFIGURED!
- ✅ `/capacitor.config.ts` - Capacitor configuration
- ✅ All Capacitor packages installed (@capacitor/core, @capacitor/android, @capacitor/ios)
- ✅ NPM scripts added to package.json

---

## 🚀 How to Use

### Option 1: PWA Deployment (Fastest - No App Store Needed)

#### Step 1: Add PWA Component to Your App
Add the install prompt to your main component:

```tsx
// In /src/app/App.tsx or your main layout
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

function App() {
  return (
    <>
      <PWAInstallPrompt />
      {/* Your existing app code */}
    </>
  );
}
```

#### Step 2: Update Your HTML
Add these tags to your `index.html` (in the `<head>` section):

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#812F0F">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="MILA">
<link rel="apple-touch-icon" href="/icon-192.png">
```

#### Step 3: Register Service Worker
Add this to your main entry file (before mounting React):

```javascript
// In your main.tsx or index.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}
```

#### Step 4: Create App Icons
Create these icon files in `/public/`:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)  
- Use your MILA logo with Deep Burgundy (#812F0F) background

#### Step 5: Deploy
Deploy to any web host (Vercel, Netlify, etc.). Users can now install from their browser!

**Installation on Mobile:**
- **Android Chrome**: "Add to Home Screen" prompt appears automatically
- **iOS Safari**: Tap Share → "Add to Home Screen"

---

### Option 2: Native iOS/Android Apps (App Store Distribution)

#### Prerequisites
- **For Android**: Android Studio installed
- **For iOS**: Xcode installed (macOS only)
- Node.js installed

#### Step 1: Build Your Web App
```bash
npm run build
```

#### Step 2: Initialize Capacitor (First Time Only)
```bash
npx cap init
# Follow prompts:
# App name: MILA
# Package ID: com.mila.fieldmanagement
```

#### Step 3: Add Platforms

**For Android:**
```bash
npm run cap:android
# This runs: cap add android && cap sync
```

**For iOS:**
```bash
npm run cap:ios
# This runs: cap add ios && cap sync
```

#### Step 4: Open in Native IDE

**Android Studio:**
```bash
npm run cap:open:android
```
Then in Android Studio:
1. Wait for Gradle sync
2. Connect device or start emulator
3. Click Run ▶️

**Xcode (iOS):**
```bash
npm run cap:open:ios
```
Then in Xcode:
1. Select your team/signing
2. Choose simulator/device
3. Click Run ▶️

#### Step 5: Build for Production

**Android APK/AAB:**
1. Open in Android Studio
2. Build → Generate Signed Bundle/APK
3. Follow wizard to create keystore
4. Upload to Google Play Console

**iOS IPA:**
1. Open in Xcode
2. Product → Archive
3. Distribute App
4. Upload to App Store Connect

---

## 🔄 Workflow Commands

### Development
```bash
npm run build              # Build web app
npm run cap:sync          # Sync changes to native projects
```

### Android
```bash
npm run cap:build:android  # Build web + open Android Studio
npm run cap:open:android   # Open Android Studio only
```

### iOS  
```bash
npm run cap:build:ios      # Build web + open Xcode
npm run cap:open:ios       # Open Xcode only
```

---

## 🎨 Branding Customization

### Update App Icons
Replace these files in your native projects:

**Android:** `/android/app/src/main/res/mipmap-*/ic_launcher.png`
**iOS:** `/ios/App/App/Assets.xcassets/AppIcon.appiconset/`

Use tools like:
- [Icon Kitchen](https://icon.kitchen/)
- [App Icon Generator](https://appicon.co/)

### Update Splash Screen
**Android:** Edit `/android/app/src/main/res/drawable/splash.png`
**iOS:** Edit `/ios/App/App/Assets.xcassets/Splash.imageset/`

Background color: `#812F0F` (Deep Burgundy)

---

## 📦 Key Files Reference

```
├── /public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── icon-192.png          # App icon (create this)
│   └── icon-512.png          # App icon (create this)
├── /src/app/components/
│   └── PWAInstallPrompt.tsx  # Install prompt UI
├── capacitor.config.ts        # Capacitor config
└── /android/                  # Generated by Capacitor
    └── /ios/                  # Generated by Capacitor
```

---

## 🛠️ Troubleshooting

### PWA Not Showing Install Prompt?
1. Must use HTTPS (localhost is OK for testing)
2. Check manifest.json is accessible at `/manifest.json`
3. Service worker must be registered successfully
4. Clear browser cache and reload

### Capacitor Build Errors?
```bash
# Reset and rebuild
rm -rf android ios
npm run cap:android  # or cap:ios
```

### App Not Syncing?
```bash
# Force sync
npx cap sync --force
```

---

## 📊 Feature Comparison

| Feature | PWA | Native (Capacitor) |
|---------|-----|-------------------|
| **Installation** | Browser (no store) | App Store/Play Store |
| **Offline Support** | ✅ Yes | ✅ Yes |
| **Push Notifications** | ⚠️ Limited | ✅ Full |
| **Camera Access** | ✅ Yes | ✅ Yes |
| **GPS/Location** | ✅ Yes | ✅ Yes |
| **App Store Presence** | ❌ No | ✅ Yes |
| **Update Speed** | ⚡ Instant | 📅 Review process |
| **Development Cost** | 💚 Low | 💛 Medium |

---

## 🎯 Recommended Approach

**For MILA MVP Launch:**
1. ✅ **Start with PWA** - Deploy immediately, users can install from web
2. ⏰ **Later add Capacitor** - When you need App Store presence

**Best of Both Worlds:**
- Deploy PWA for instant access
- Submit Capacitor build to stores for discoverability
- Both use same codebase! 🎉

---

## 📱 Next Steps

1. **Create App Icons** (192px and 512px)
2. **Add PWAInstallPrompt to your App.tsx**
3. **Register Service Worker in your entry file**
4. **Deploy and test PWA**
5. **(Optional) Build native apps for stores**

---

## 🆘 Support Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **PWA Guide**: https://web.dev/progressive-web-apps/
- **Workbox**: https://developer.chrome.com/docs/workbox/

---

Your MILA app is ready to go mobile! 🚀🌾
