@echo off
REM MILA Android APK Builder - Windows Version
REM Automates the APK build process

echo ========================================
echo      MILA Android APK Builder
echo ========================================
echo.

REM Step 1: Check prerequisites
echo [Step 1/7] Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found. Please install npm first.
    pause
    exit /b 1
)

echo OK: Node.js and npm found
echo.

REM Step 2: Install dependencies
echo [Step 2/7] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo OK: Dependencies installed
echo.

REM Step 3: Build web app
echo [Step 3/7] Building web app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Web app build failed
    pause
    exit /b 1
)

if not exist "dist" (
    echo ERROR: dist folder not found
    pause
    exit /b 1
)

echo OK: Web app built successfully
echo.

REM Step 4: Check if Android exists
if not exist "android" (
    echo [Step 4/7] Android platform not found. Adding...
    call npx cap add android
    echo OK: Android platform added
) else (
    echo [Step 4/7] Android platform found
)
echo.

REM Step 5: Sync to Android
echo [Step 5/7] Syncing to Android...
call npx cap sync android
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to sync to Android
    pause
    exit /b 1
)
echo OK: Synced to Android
echo.

REM Step 6: Build APK
echo [Step 6/7] Building APK...
echo This may take 5-10 minutes on first run...
echo.

cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: APK build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.

REM Step 7: Check result
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo ========================================
    echo      SUCCESS! APK BUILT
    echo ========================================
    echo.
    echo APK Location:
    echo   android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo To install on your phone:
    echo   1. Copy app-debug.apk to your Android phone
    echo   2. Open the file on your phone
    echo   3. Allow installation from unknown sources
    echo   4. Tap Install
    echo.
    echo Or install via USB:
    echo   adb install android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Your MILA APK is ready!
    echo.
) else (
    echo ERROR: APK not found after build
    pause
    exit /b 1
)

pause
