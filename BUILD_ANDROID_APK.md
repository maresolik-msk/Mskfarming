# 📱 Build MILA Android APK - Complete Guide

## 🎯 Goal: Create APK file for Android installation

**Time needed:** 30-45 minutes (first time)

---

## ✅ Prerequisites

### 1. Install Android Studio
**Download:** https://developer.android.com/studio

**Installation:**
- Windows/Mac/Linux: Download and run installer
- Follow default installation options
- Install Android SDK (it will prompt during setup)

### 2. Install Java JDK
Android Studio usually includes this, but verify:
```bash
java -version
# Should show version 17 or higher
```

If not installed: https://www.oracle.com/java/technologies/downloads/

---

## 🚀 Step-by-Step APK Build Process

### Step 1: Build Your Web App

```bash
# Make sure you're in the MILA project directory
cd /path/to/mila

# Install dependencies (if not done)
npm install

# Build the production web app
npm run build
```

**Verify:** Check that `/dist` folder was created with your built files.

---

### Step 2: Initialize Capacitor (First Time Only)

```bash
# Initialize Capacitor
npx cap init

# When prompted, enter:
# App name: MILA
# Package ID: com.mila.fieldmanagement
# (Press Enter to accept defaults for other options)
```

**What this does:** Creates `capacitor.config.ts` (already exists in your project)

---

### Step 3: Add Android Platform

```bash
# Add Android platform
npx cap add android

# This will:
# - Create /android folder
# - Copy web assets
# - Set up Android project structure
```

**Wait:** This takes 1-2 minutes the first time.

---

### Step 4: Sync Your Web App to Android

```bash
# Sync the built web app to Android project
npx cap sync android

# This copies your /dist folder to Android
```

---

### Step 5: Open in Android Studio

```bash
# Open the Android project in Android Studio
npx cap open android
```

**Wait:** Android Studio will open and start indexing (2-5 minutes first time)

---

### Step 6: Configure Android Studio

#### A. Wait for Gradle Sync
- Android Studio will show "Gradle sync" at the bottom
- **Wait until it finishes** (may take 5-10 minutes first time)
- Don't click anything until "Gradle sync finished" appears

#### B. Accept any SDK licenses
If prompted about missing SDKs:
1. Click "Install missing platforms"
2. Accept licenses
3. Wait for download to complete

---

### Step 7: Build APK

#### Option A: Debug APK (Fastest - For Testing)

**In Android Studio:**
1. Click **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete (1-3 minutes)
3. Click **locate** in the popup notification

**APK Location:**
```
/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Option B: Release APK (For Distribution)

**In Android Studio:**

1. **Create Keystore (First Time Only):**
   - Build → Generate Signed Bundle/APK
   - Select **APK** → Click **Next**
   - Click **Create new...** under Key store path
   - Fill in:
     - Key store path: Choose location (e.g., `~/mila-keystore.jks`)
     - Password: Create a strong password (SAVE THIS!)
     - Alias: `mila-release`
     - Alias password: Same or different (SAVE THIS!)
     - Validity: 25 years
     - Certificate info: Fill in your details
   - Click **OK**

2. **Build Signed APK:**
   - Select keystore you just created
   - Enter passwords
   - Check **Remember passwords**
   - Click **Next**
   - Select **release** build variant
   - Check **V2 (Full APK Signature)**
   - Click **Finish**

**Release APK Location:**
```
/android/app/build/outputs/apk/release/app-release.apk
```

---

### Step 8: Install APK on Android Device

#### Method 1: USB Connection

1. **Enable Developer Options on Phone:**
   - Settings → About phone
   - Tap "Build number" 7 times
   - Go back → Developer options
   - Enable "USB debugging"

2. **Connect Phone:**
   - Connect phone to computer via USB
   - Allow USB debugging popup on phone

3. **Install APK:**
   ```bash
   # In Android Studio terminal or command line
   cd android
   ./gradlew installDebug
   
   # Or for release:
   adb install app/build/outputs/apk/release/app-release.apk
   ```

#### Method 2: Direct File Transfer

1. **Copy APK to Phone:**
   - Copy `app-debug.apk` or `app-release.apk`
   - Transfer to phone via USB, email, or cloud storage

2. **Install on Phone:**
   - Open file manager on phone
   - Navigate to APK file
   - Tap to install
   - Allow "Install from unknown sources" if prompted
   - Tap "Install"

---

## 🎨 Customize Before Building

### Update App Icon

**Replace these files in `/android/app/src/main/res/`:**

```
mipmap-hdpi/ic_launcher.png      (72x72)
mipmap-mdpi/ic_launcher.png      (48x48)
mipmap-xhdpi/ic_launcher.png     (96x96)
mipmap-xxhdpi/ic_launcher.png    (144x144)
mipmap-xxxhdpi/ic_launcher.png   (192x192)
```

**Easy way:** Use https://icon.kitchen/
- Upload your MILA icon
- Download Android icon pack
- Extract and replace files

### Update App Name

Edit `/android/app/src/main/res/values/strings.xml`:
```xml
<resources>
    <string name="app_name">MILA</string>
    <string name="title_activity_main">MILA</string>
    <string name="package_name">com.mila.fieldmanagement</string>
    <string name="custom_url_scheme">com.mila.fieldmanagement</string>
</resources>
```

### Update Splash Screen

Replace `/android/app/src/main/res/drawable/splash.png` with your branded splash screen (Deep Burgundy background recommended)

---

## 🔧 Quick Build Scripts

Add to `/package.json` scripts section (already added):

```json
{
  "scripts": {
    "android:build": "npm run build && npx cap sync android",
    "android:open": "npx cap open android",
    "android:run": "npm run android:build && npm run android:open"
  }
}
```

**Usage:**
```bash
npm run android:run
# Builds web app, syncs to Android, and opens Android Studio
```

---

## 🐛 Troubleshooting

### "Gradle sync failed"
**Fix:**
```bash
cd android
./gradlew clean
./gradlew build
```

### "SDK not found"
**Fix:**
1. Android Studio → Preferences → Appearance & Behavior → System Settings → Android SDK
2. Install latest Android SDK (API 33 or higher)
3. Install Build Tools
4. Click OK and restart

### "Could not find or load main class"
**Fix:**
```bash
# Set JAVA_HOME
export JAVA_HOME=/path/to/jdk
# On Windows:
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

### White screen when APK runs
**Fix:**
Edit `/android/app/src/main/assets/capacitor.config.json`:
```json
{
  "server": {
    "androidScheme": "https"
  }
}
```

Then rebuild:
```bash
npx cap sync android
```

### APK won't install on phone
**Check:**
- Allow installation from unknown sources (Settings → Security)
- Minimum Android version: Android 5.0+ (API 21+)
- Uninstall previous version if exists

---

## 📦 Quick Command Reference

```bash
# Full build process
npm run build                    # 1. Build web app
npx cap sync android            # 2. Copy to Android
npx cap open android            # 3. Open Android Studio

# In Android Studio:
# Build → Build APK(s)

# Or use command line:
cd android
./gradlew assembleDebug         # Debug APK
./gradlew assembleRelease       # Release APK (needs keystore)
```

---

## 🎯 Expected Results

### Debug APK:
- **Size:** ~50-70 MB
- **Location:** `/android/app/build/outputs/apk/debug/app-debug.apk`
- **Use for:** Testing, development
- **Drawback:** Can't publish to Play Store

### Release APK:
- **Size:** ~30-50 MB (optimized)
- **Location:** `/android/app/build/outputs/apk/release/app-release.apk`
- **Use for:** Distribution, Play Store
- **Requires:** Keystore (signing key)

---

## 📱 After Installing APK

1. **Find MILA icon** on home screen (or app drawer)
2. **Tap to open** - Full-screen app experience
3. **Test offline** - Turn off WiFi, app should still work
4. **Check features** - All MILA features should function

---

## 🚀 Next Steps

### For Testing:
- Share `app-debug.apk` with farmers
- Get feedback
- Iterate quickly

### For Production:
- Build `app-release.apk` with keystore
- Test thoroughly
- Submit to Google Play Store

---

## 📊 Build Times

| Step | First Time | Subsequent |
|------|------------|------------|
| Install Android Studio | 20-30 min | - |
| Initialize Capacitor | 2 min | - |
| Add Android platform | 2-5 min | - |
| Gradle sync | 5-10 min | 30-60 sec |
| Build APK | 2-5 min | 1-2 min |
| **Total** | **30-45 min** | **5-10 min** |

---

## ✅ Success Checklist

- [ ] Android Studio installed
- [ ] Web app built (`npm run build`)
- [ ] Capacitor initialized
- [ ] Android platform added
- [ ] Gradle sync completed
- [ ] APK built successfully
- [ ] APK installs on phone
- [ ] App opens and works
- [ ] Offline mode works

---

## 🆘 Need Help?

**Android Studio won't open?**
- Restart computer
- Check Java is installed: `java -version`
- Reinstall Android Studio

**Build taking too long?**
- First build is slow (10-15 min)
- Subsequent builds are faster (2-5 min)

**APK not working?**
- Check Android version (need 5.0+)
- Check logcat in Android Studio for errors
- Try: `npx cap sync android` again

---

## 🎉 You're Done!

You now have a `app-debug.apk` file you can:
- ✅ Install on any Android device
- ✅ Share with farmers for testing
- ✅ Test offline functionality
- ✅ Distribute directly (no Play Store needed)

**For Play Store publishing:** Build a signed release APK and follow Google's submission process.

---

**🌾 Happy Android Development with MILA! 🌾**
