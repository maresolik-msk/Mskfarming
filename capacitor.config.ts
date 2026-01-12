import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mila.fieldmanagement',
  appName: 'MILA',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: '#812F0F',
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#812F0F',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      backgroundColor: '#812F0F',
      style: 'LIGHT',
    },
  },

  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK',
    },
  },

  ios: {
    contentInset: 'automatic',
  },
};

export default config;
