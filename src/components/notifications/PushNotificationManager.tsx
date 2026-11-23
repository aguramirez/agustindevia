"use client";

import { useEffect } from "react";

export default function PushNotificationManager() {
  useEffect(() => {
    // Solo se ejecuta en el cliente y cuando corre dentro de Capacitor nativo
    const initPush = async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) {
          // Si estamos en un navegador web tradicional en escritorio, no inicializar Capacitor Push
          return;
        }

        const { PushNotifications } = await import("@capacitor/push-notifications");

        // 1. Solicitar permisos
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === "prompt") {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== "granted") {
          console.warn("Permiso de notificaciones push denegado");
          return;
        }

        // 2. Registrar el dispositivo con APNS / FCM
        await PushNotifications.register();

        // 3. Obtener el token de FCM y guardarlo en el backend
        await PushNotifications.addListener("registration", async (token) => {
          console.log("FCM Device Token obtenido:", token.value);
          try {
            await fetch("/api/notifications/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: token.value, platform: Capacitor.getPlatform() }),
            });
          } catch (err) {
            console.error("Error guardando el token FCM en el servidor:", err);
          }
        });

        // 4. Manejar errores de registro
        await PushNotifications.addListener("registrationError", (error) => {
          console.error("Error en registro de notificaciones:", error);
        });

        // 5. Notificación recibida con la app en primer plano
        await PushNotifications.addListener("pushNotificationReceived", (notification) => {
          console.log("Notificación recibida en primer plano:", notification);
        });

        // 6. Acción al tocar la notificación (por ejemplo ir a la agenda)
        await PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
          console.log("Acción de notificación tocada:", notification);
          if (notification.notification.data?.url) {
            window.location.href = notification.notification.data.url;
          } else {
            window.location.href = "/calendar";
          }
        });
      } catch (e) {
        console.error("Push Notifications no disponible:", e);
      }
    };

    initPush();
  }, []);

  return null;
}
