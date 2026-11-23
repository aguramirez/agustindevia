import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agustindev.app',
  appName: 'AgustinDev',
  webDir: 'public',
  server: {
    url: 'http://192.168.1.14:3000/calendar',
    cleartext: true,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
