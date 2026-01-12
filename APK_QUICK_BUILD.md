# 🎯 QUICK APK BUILD - 3 Methods

Choose the method that works best for you:

---

## 🚀 Method 1: Automated Script (Easiest)

### Linux/Mac:
```bash
# Make script executable
chmod +x scripts/build-apk.sh

# Run the script
bash scripts/build-apk.sh
```

### Windows:
```bash
# Double-click or run:
scripts\build-apk.bat
```

**This script does EVERYTHING automatically:**
1. ✅ Installs dependencies
2. ✅ Builds web app
3. ✅ Adds Android platform
4. ✅ Syncs to Android
5. ✅ Builds APK
6. ✅ Shows APK location

**APK Location:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔧 Method 2: Manual Commands (Full Control)

```bash
# 1. Install and build
npm install
npm run build

# 2. Add Android (first time only)
npx cap add android

# 3. Sync to Android
npx cap sync android

# 4. Build APK
cd android
./gradlew assembleDebug
cd ..

# APK ready at: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎨 Method 3: Android Studio (Visual)

```bash
# 1. Build and open
npm run build
npx cap sync android
npx cap open android

# 2. In Android Studio:
#    - Wait for Gradle sync to finish
#    - Build → Build Bundle(s) / APK(s) → Build APK(s)
#    - Click "locate" when done

# APK ready at: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 How to Install APK on Phone

### Option A: Direct File Transfer
1. Copy `app-debug.apk` to phone (USB, email, Google Drive, etc.)
2. Open file on phone
3. Tap "Install" (allow unknown sources if prompted)
4. Open MILA from app drawer

### Option B: USB Installation
```bash
# Connect phone via USB with USB debugging enabled
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## ⏱️ Build Time Estimates

| Method | First Build | Subsequent Builds |
|--------|-------------|-------------------|
| **Automated Script** | 30-45 min | 5-10 min |
| **Manual Commands** | 30-45 min | 5-10 min |
| **Android Studio** | 30-45 min | 3-5 min |

*First build includes Gradle downloads (one-time)*

---

## ✅ Quick Troubleshooting

### Script fails?
```bash
# Install Android Studio first
# https://developer.android.com/studio

# Then run:
bash scripts/build-apk.sh
```

### "Gradle not found"?
```bash
# Android Studio must be installed
# Run Android Studio once to install SDKs
```

### APK won't install?
- Android 5.0+ required
- Enable "Install from unknown sources"
- Uninstall old version first

---

## 🎉 Expected Result

**After successful build:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**File size:** ~50-70 MB

**What it contains:**
- Your MILA web app
- Android runtime
- Deep Burgundy theme
- Offline support
- All features working

---

## 🚀 Quick Start (Choose One)

**Just want an APK fast?**
```bash
bash scripts/build-apk.sh
```

**Want to customize first?**
```bash
# See BUILD_ANDROID_APK.md for full guide
```

**Already built before?**
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

---

## 📖 Full Documentation

- **BUILD_ANDROID_APK.md** - Complete step-by-step guide
- **MOBILE_SETUP.md** - Full Capacitor documentation
- **Quick reference** - This file

---

**🌾 Start building your MILA APK now! 🌾**

Run: `bash scripts/build-apk.sh`
