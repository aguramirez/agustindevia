import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Obtener credenciales de la Service Account
function getGoogleCredentials() {
  // 1. Variable de entorno en Vercel/Producción
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (envKey) {
    try {
      return envKey.startsWith('{')
        ? JSON.parse(envKey)
        : JSON.parse(Buffer.from(envKey, 'base64').toString('utf8'));
    } catch (e) {
      console.error('Error parseando FIREBASE_SERVICE_ACCOUNT_KEY:', e);
    }
  }

  // 2. Archivo local de desarrollo
  const localFile = path.join(
    process.cwd(),
    'notes-app-7ab34-firebase-adminsdk-fbsvc-d6aea71868.json'
  );
  if (fs.existsSync(localFile)) {
    try {
      return JSON.parse(fs.readFileSync(localFile, 'utf8'));
    } catch (e) {
      console.error('Error leyendo archivo local de credenciales Google:', e);
    }
  }

  return null;
}

export type AppointmentData = {
  id: string;
  name: string;
  business?: string;
  whatsapp: string;
  email: string;
  date: Date | string;
  time: string;
  timezone?: string | null;
  clientTime?: string | null;
  meetUrl?: string | null;
};

// Generador de código aleatorio estilo Google Meet (xxx-yyyy-zzz)
function generateMeetRoomCode(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const rand = (n: number) =>
    Array.from({ length: n }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `${rand(3)}-${rand(4)}-${rand(3)}`;
}

export async function createGoogleMeetEvent(appointment: AppointmentData): Promise<{
  meetUrl: string;
  eventId?: string;
}> {
  // 1. Determinar el enlace de Google Meet
  // Si tienes una sala fija configurada en variables de entorno, la usamos; de lo contrario generamos una sala única
  const defaultMeet =
    process.env.ADMIN_MEET_URL || `https://meet.google.com/${generateMeetRoomCode()}`;

  const credentials = getGoogleCredentials();
  if (!credentials) {
    console.warn('⚠️ Credenciales de Google no encontradas. Usando enlace de Meet generado.');
    return { meetUrl: defaultMeet };
  }

  try {
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // ID del calendario
    const calendarId =
      process.env.GOOGLE_CALENDAR_ID ||
      process.env.ADMIN_EMAIL ||
      'primary';

    // Calcular fecha y hora de inicio y fin (1 hora)
    const dateObj = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);

    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = dateObj.toISOString().split('T')[0];
    const startIso = `${dateStr}T${pad(hours)}:${pad(minutes)}:00-03:00`;

    const endHours = hours + 1;
    const endIso = `${dateStr}T${pad(endHours)}:${pad(minutes)}:00-03:00`;

    const event = {
      summary: `Llamada 1:1 - Agustín Dev x ${appointment.name}`,
      description: [
        `Reunión 1:1 de descubrimiento para ${appointment.business || 'Nuevo Proyecto'}.`,
        '',
        `👤 Cliente: ${appointment.name}`,
        `🏢 Negocio/Rubro: ${appointment.business || 'No especificado'}`,
        `📱 WhatsApp: ${appointment.whatsapp}`,
        `✉️ Email: ${appointment.email}`,
        appointment.clientTime
          ? `🕒 Hora del cliente: ${appointment.clientTime} (${appointment.timezone || 'Local'})`
          : '',
        '',
        `👉 Enlace de Google Meet: ${defaultMeet}`,
      ]
        .filter(Boolean)
        .join('\n'),
      start: {
        dateTime: startIso,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: endIso,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      // NOTA CRÍTICA: No incluir 'attendees' ni 'sendUpdates: all' porque las Service Accounts de Google Cloud
      // no tienen Domain-Wide Delegation en cuentas estándar y devuelven HTTP 403 Forbidden.
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log('✅ Evento en Google Calendar agendado:', {
      eventId: response.data.id,
      meetUrl: defaultMeet,
      calendarId,
    });

    return {
      meetUrl: defaultMeet,
      eventId: response.data.id || undefined,
    };
  } catch (error) {
    console.error('Error insertando evento en Google Calendar:', error);
    return {
      meetUrl: defaultMeet,
    };
  }
}

// Intentar enviar notificación por email al cliente mediante Google Apps Script o Resend
export async function sendEmailToClient(appointment: AppointmentData, meetUrl: string) {
  const formattedDate = new Date(appointment.date).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const subject = `Confirmación de Llamada 1:1 - Agustín Dev`;
  const bodyText = `¡Hola ${appointment.name}!

Tu llamada 1:1 de asesoramiento con Agustín Dev ha sido confirmada.

📅 Fecha: ${formattedDate}
🕒 Hora: ${appointment.time} hs (Hora de Argentina)
${appointment.clientTime ? `🕒 Tu hora local: ${appointment.clientTime} hs (${appointment.timezone || ''})\n` : ''}
📍 Enlace de Google Meet:
${meetUrl}

Por favor guarda este enlace para ingresar a la reunión a la hora pactada.

¡Nos vemos pronto!
Agustín Dev
https://www.agustindev.com.ar`;

  // 1. Intentar mediante Google Apps Script (si está disponible)
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      const params = new URLSearchParams();
      params.append('action', 'appointment_confirmation');
      params.append('to', appointment.email);
      params.append('name', appointment.name);
      params.append('subject', subject);
      params.append('body', bodyText);
      params.append('meetUrl', meetUrl);
      params.append('date', formattedDate);
      params.append('time', appointment.time);

      await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      console.log('📧 Petición de email enviada a Google Apps Script');
    } catch (e) {
      console.error('Error enviando email vía Google Apps Script:', e);
    }
  }

  // 2. Intentar mediante Resend API si existe API Key
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Agustín Dev <onboarding@resend.dev>',
          to: [appointment.email],
          subject: subject,
          text: bodyText,
        }),
      });
      console.log('📧 Email enviado exitosamente a través de Resend');
    } catch (e) {
      console.error('Error enviando email vía Resend:', e);
    }
  }
}
