"use client";

import { useEffect } from "react";

export default function PushNotificationManager() {
  useEffect(() => {
    // Si estamos en un navegador web tradicional de escritorio, no hacer nada
    if (typeof window === "undefined") return;

    const win = window as any;
    if (!win.Capacitor) {
      return;
    }

    // Si Capacitor está presente en window, registrar listener de navegación al tocar notificación
    try {
      const Push = win.Capacitor.Plugins?.PushNotifications;
      if (Push?.addListener) {
        Push.addListener("pushNotificationActionPerformed", (notification: any) => {
          if (notification?.notification?.data?.url) {
            window.location.href = notification.notification.data.url;
          } else {
            window.location.href = "/calendar";
          }
        });
      }
    } catch (e) {
      // Ignorar silenciosamente
    }
  }, []);

  return null;
}
