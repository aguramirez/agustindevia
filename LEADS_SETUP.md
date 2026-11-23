# Guía Definitiva: Conexión con Google (Leads + Google Calendar + Emails a Clientes)

Tu aplicación de **Agustín Dev** utiliza un único Webhook de Google Apps Script conectado a tu cuenta de Google personal para realizar 3 tareas automáticas:

1. **Captura de Leads del Chat:** Guarda los datos en tu Google Sheet y te envía una alerta por email a ti.
2. **Creación de Eventos en Google Calendar:** Cuando confirmas un turno, lo crea directamente en tu calendario de Google con la fecha, hora, link de Meet y datos del cliente.
3. **Envío de Email Oficial al Cliente:** Envía un correo desde tu propio Gmail al cliente confirmando la reunión con el link de Google Meet.

---

## Paso 1: Abrir tu Google Apps Script
1. Abre tu hoja de Google Sheets donde recibes los leads (ej. `AgustinDev - Leads AI`).
2. En el menú superior, haz clic en **Extensiones > Apps Script**.

## Paso 2: Reemplazar el código
1. Borra todo el código que tengas en el editor.
2. Abre el archivo local [GOOGLE_APPS_SCRIPT.js](file:///c:/Users/Agustin/Documents/agustindev/GOOGLE_APPS_SCRIPT.js), copia todo su contenido y pégalo en Apps Script.
3. Haz clic en el ícono de **Guardar** (el disquete).

## Paso 3: Desplegar la Nueva Versión
> ⚠️ **MUY IMPORTANTE:** Para que los cambios surtan efecto en Google Apps Script, no alcanza con guardar, debes implementar una nueva versión:

1. Arriba a la derecha, haz clic en el botón azul **Implementar > Administrar implementaciones** (o *Nueva implementación*).
2. Haz clic en el ícono del **Lápiz** (Editar) en tu implementación activa.
3. En **Versión**, selecciona **Nueva versión**.
4. Asegúrate de que:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquier persona**
5. Haz clic en **Implementar**.
6. Si te pide autorizar permisos (de Google Calendar y Gmail), acéptalos (*Opciones Avanzadas > Ir al proyecto (inseguro)*).

¡Listo! Tu URL de script seguirá siendo la misma que ya tienes en Vercel (`NEXT_PUBLIC_GOOGLE_SCRIPT_URL`). A partir de ese momento, cada vez que confirmes un turno:
- Se creará el evento en tu Google Calendar real.
- Google y tu Gmail le enviarán el correo con el link de Meet al cliente.
