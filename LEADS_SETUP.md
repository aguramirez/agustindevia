# Guía de Configuración Webhook de Leads & Notificaciones Móviles

Para habilitar que el "Paywall" (captura de datos) se envíe de manera automática a tu correo/móvil y a una base de datos, sigue este breve tutorial de configuración utilizando **Google Sheets** (100% gratuito).

## Paso 1: Configurar el Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com) y crea una **Nueva Hoja de Cálculo**.
2. Nómbrala `AgustinDev - Leads AI` (o el nombre que gustes).
3. Escribe en la primera fila (Fila 1) los encabezados de las columnas:
   - A1: `Fecha`
   - B1: `Nombre`
   - C1: `Email`
   - D1: `Teléfono`

## Paso 2: Crear el Google Apps Script (El Webhook)
1. En el menú superior de Google Sheets, ve a **Extensiones > Apps Script**.
2. Se abrirá una nueva pestaña. Borra el código que aparezca y pega lo siguiente:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Extraer los datos enviados desde Next.js
  var nombre = e.parameter.nombre || "N/A";
  var email = e.parameter.email || "N/A";
  var telefono = e.parameter.telefono || "N/A";
  
  // Agregar fila a la hoja de cálculo
  sheet.appendRow([new Date(), nombre, email, telefono]);
  
  // Para recibir un correo directo (Opcional, pero recomendado en lugar de reglas de notificacion de sheets):
  var emailAddress = Session.getActiveUser().getEmail(); // O pon "tu@email.com" directamente
  var subject = "🔥 NUEVO LEAD desde AgustinDev AI";
  var message = "Obtuviste un nuevo lead desde el chat de IA.\n\n" +
                "👤 Nombre: " + nombre + "\n" +
                "✉️ Email: " + email + "\n" +
                "📱 Teléfono: " + telefono + "\n\n" +
                "Contactalo cuanto antes!";
  MailApp.sendEmail(emailAddress, subject, message);

  // Retornar respuesta
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Haz clic en el ícono de **Guardar** (disquete).

## Paso 3: Desplegar como Aplicación Web (URL)
1. En la parte superior derecha de tu script, haz clic en el botón azul **Implementar > Nueva implementación**.
2. Selecciona tipo: **Aplicación Web**.
3. Descripción: `API Leads v1`.
4. Ejecutar como: **Yo**.
5. Quién tiene acceso: **Cualquier persona**. *(IMPORTANTE: debe ser "Cualquier persona")*
6. Haz clic en **Implementar**.
7. *Nota: Te pedirá autorizar accesos (Google advertirá que "No es seguro"). Ve a Opciones Avanzadas > Ir al script (Inseguro) y Acepta.*
8. Copia la **URL de la aplicación web**. Nos la proporciona al finalizar.
https://script.google.com/macros/s/AKfycbxgALKiut3q7LLDcv_vA2PWXl0IYc5e0sq_o_SD3Li1smQGLKmS2nSlqTgLzVUdVZt_/exec
## Paso 4: Añadir la URL al proyecto
Ve a tu proyecto (Next.js) y en `.env` (si lo tienes configurado localmente) o en las variables de entorno de **Vercel**, debes agregar la llave:
`NEXT_PUBLIC_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycbxgALKiut3q7LLDcv_vA2PWXl0IYc5e0sq_o_SD3Li1smQGLKmS2nSlqTgLzVUdVZt_/exec"`

## Paso 5: Cómo habilitar Notificaciones Instantáneas (VIP) en el Celular
Al usar `MailApp.sendEmail` en el script anterior, ya vas a recibir el correo instantáneo. Pero para que tu iPhone/Android **suene de inmediato** y no se pierda entre correos de promociones:

**En Android o iOS (Gmail):**
1. Ve al buzón de entrada.
2. Abre un correo que haya llegado del Apps Script (el generador de alerta) o crea un filtro en Gmail Web.
3. Asegúrate de configurar ese remitente como "VIP" (Apple Mail) o "Importante/High Priority" (Notificaciones personalizadas en Android app de Gmail). 
4. Si quieres que además lo envíe por WhatsApp, necesitarás un bot integrado, pero el "Notificador de Correo VIP" activará tu pantalla apenas el cliente haga click en "Continuar".
