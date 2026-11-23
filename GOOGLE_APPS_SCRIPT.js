/**
 * ========================================================================
 * GOOGLE APPS SCRIPT DEFINITIVO - AGUSTINDEV
 * ========================================================================
 * Este script se coloca en tu Google Sheets (Extensiones > Apps Script)
 * y realiza automáticamente:
 * 
 * 1. GUARDAR LEADS: Guarda los datos del chat en tu Google Sheet y te avisa a tu correo.
 * 2. CREAR EVENTO EN GOOGLE CALENDAR: Crea la reunión directamente en tu calendario personal
 *    con fecha y hora exacta, e invita al cliente.
 * 3. ENVIAR EMAIL AL CLIENTE: Envía el email oficial de confirmación desde tu propia cuenta
 *    de Gmail con el enlace de Google Meet y los detalles de la llamada.
 * ========================================================================
 */

function doPost(e) {
  try {
    var action = e.parameter.action;

    // ─────────────────────────────────────────────────────────────────────────
    // ACCIÓN 1: CONFIRMACIÓN DE LLAMADA (Google Calendar + Enviar Mail al Cliente)
    // ─────────────────────────────────────────────────────────────────────────
    if (action === "appointment_confirmation" || action === "create_calendar_event") {
      var clientName = e.parameter.name || "Cliente";
      var clientEmail = e.parameter.to || e.parameter.email;
      var clientPhone = e.parameter.whatsapp || "";
      var business = e.parameter.business || "Proyecto";
      var meetUrl = e.parameter.meetUrl || "https://meet.google.com/new";
      var dateFormatted = e.parameter.date || "";
      var timeStr = e.parameter.time || "";
      var startIso = e.parameter.startIso;
      var endIso = e.parameter.endIso;

      var eventId = null;

      // 1. Crear el evento en tu Google Calendar personal
      if (startIso && endIso) {
        var startTime = new Date(startIso);
        var endTime = new Date(endIso);
        
        var description = "Reunión 1:1 con " + clientName + " (" + business + ").\n\n" +
                          "📍 Google Meet para ingresar:\n" + meetUrl + "\n\n" +
                          "📱 WhatsApp: " + clientPhone + "\n" +
                          "✉️ Email: " + clientEmail;

        var event = CalendarApp.getDefaultCalendar().createEvent(
          "Llamada 1:1 - Agustín Dev x " + clientName,
          startTime,
          endTime,
          {
            description: description,
            guests: clientEmail, // ¡Agrega al cliente como invitado en su Google Calendar!
            sendInvites: true    // ¡Google le envía la invitación oficial de asistencia!
          }
        );
        eventId = event.getId();
      }

      // 2. Enviar el correo de confirmación al cliente desde tu cuenta de Gmail
      if (clientEmail && clientEmail.includes("@")) {
        var subject = e.parameter.subject || ("Confirmación de Llamada 1:1 - Agustín Dev");
        var body = e.parameter.body || (
          "¡Hola " + clientName + "!\n\n" +
          "Tu llamada 1:1 con Agustín Dev ha sido confirmada.\n\n" +
          "📅 Fecha: " + dateFormatted + "\n" +
          "🕒 Hora: " + timeStr + " hs (Hora de Argentina)\n" +
          "📍 Enlace de Google Meet: " + meetUrl + "\n\n" +
          "Guarda este enlace para ingresar puntualmente.\n\n" +
          "¡Nos vemos pronto!\nAgustín Dev\nhttps://www.agustindev.com.ar"
        );

        MailApp.sendEmail({
          to: clientEmail,
          subject: subject,
          body: body
        });
      }

      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        eventId: eventId,
        message: "Evento creado en tu Google Calendar y correo enviado al cliente" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACCIÓN 2: GUARDAR LEAD DEL CHAT (Tu código original)
    // ─────────────────────────────────────────────────────────────────────────
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var nombre = e.parameter.nombre || "N/A";
    var email = e.parameter.email || "N/A";
    var telefono = e.parameter.telefono || "N/A";
    var historial = e.parameter.historial || "";

    sheet.appendRow([new Date(), nombre, email, telefono, historial]);

    // Correo de alerta para ti
    var adminEmail = Session.getActiveUser().getEmail();
    if (adminEmail) {
      MailApp.sendEmail(
        adminEmail,
        "🔥 NUEVO LEAD desde AgustinDev AI",
        "Obtuviste un nuevo lead desde el chat de IA.\n\n" +
        "👤 Nombre: " + nombre + "\n" +
        "✉️ Email: " + email + "\n" +
        "📱 Teléfono: " + telefono + "\n\n" +
        "¡Contáctalo cuanto antes!"
      );
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
