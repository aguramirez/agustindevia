import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agustindev.app',
  appName: 'AgustinDev',
  webDir: 'public',
  server: {
    url: 'https://www.agustindev.com.ar/calendar',
    cleartext: false,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
