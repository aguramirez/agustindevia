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
};

export async function createGoogleMeetEvent(appointment: AppointmentData): Promise<{
  meetUrl: string;
  eventId?: string;
} | null> {
  const credentials = getGoogleCredentials();

  if (!credentials) {
    console.warn(
      '⚠️ Credenciales de Google no encontradas. Generando enlace de respaldo para Google Meet.'
    );
    // Generar link único de Google Meet de respaldo
    const fallbackCode = `meet-${appointment.id.substring(0, 8)}`;
    return {
      meetUrl: `https://meet.google.com/new`,
    };
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

    // ID del calendario: El email de Google de Agustín (configurable en env) o 'primary'
    const calendarId =
      process.env.GOOGLE_CALENDAR_ID ||
      process.env.ADMIN_EMAIL ||
      credentials.client_email;

    // Calcular fecha y hora de inicio y fin (1 hora)
    const dateObj = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);
    
    // Asumimos hora de Argentina (GMT-3)
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
        appointment.clientTime ? `🕒 Hora del cliente: ${appointment.clientTime} (${appointment.timezone || 'Local'})` : '',
        '',
        '👉 Enlace de Google Meet generado automáticamente por agustindev.com.ar',
      ].filter(Boolean).join('\n'),
      start: {
        dateTime: startIso,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      end: {
        dateTime: endIso,
        timeZone: 'America/Argentina/Buenos_Aires',
      },
      attendees: [
        {
          email: appointment.email,
          displayName: appointment.name,
          responseStatus: 'needsAction',
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${appointment.id}-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 30 },      // 30 min antes
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // ¡Envia el email oficial de Google preguntando si asistirá!
    });

    const meetUrl =
      response.data.hangoutLink ||
      response.data.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === 'video'
      )?.uri ||
      'https://meet.google.com/new';

    console.log('✅ Evento Google Calendar y Meet creado:', {
      meetUrl,
      eventId: response.data.id,
      calendarId,
    });

    return {
      meetUrl,
      eventId: response.data.id || undefined,
    };
  } catch (error) {
    console.error('Error creando evento en Google Calendar:', error);
    return {
      meetUrl: 'https://meet.google.com/new',
    };
  }
}
