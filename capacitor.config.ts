import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agustindev.app',
  appName: 'AgustinDev',
  webDir: 'public',
  server: {
    // Si estás probando en desarrollo o producción, puedes configurar la URL del servidor Next.js
    // En producción poné: url: 'https://tu-dominio.com'
    // En local con emulador: url: 'http://10.0.2.2:3000'
    // En celular físico en tu misma red WiFi: url: 'http://192.168.1.X:3000'
    cleartext: true,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
