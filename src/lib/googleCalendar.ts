import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import prisma from './prisma';

// Obtener credenciales de la Service Account
function getGoogleCredentials() {
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

// Obtener la URL de Google Meet configurada por Agustín en Settings o en .env
export async function getEffectiveMeetUrl(): Promise<string> {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'global' } });
    if (settings?.meetUrl && settings.meetUrl.trim().length > 0) {
      return settings.meetUrl.trim();
    }
  } catch {}

  return (
    process.env.ADMIN_MEET_URL ||
    process.env.GOOGLE_MEET_URL ||
    'https://meet.google.com/new'
  );
}

export async function createGoogleMeetEvent(appointment: AppointmentData): Promise<{
  meetUrl: string;
  eventId?: string;
}> {
  // 1. Obtener el enlace real de Google Meet
  const meetUrl = appointment.meetUrl || (await getEffectiveMeetUrl());

  const credentials = getGoogleCredentials();
  if (!credentials) {
    console.warn('⚠️ Credenciales de Google no encontradas. Usando enlace de Meet configurado.');
    return { meetUrl };
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

    // ID del calendario: El email de Google de Agustín si lo configuró, o 'primary'
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
        `👉 Enlace de Google Meet: ${meetUrl}`,
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

    console.log('✅ Evento agendado en Google Calendar:', {
      eventId: response.data.id,
      meetUrl,
      calendarId,
    });

    return {
      meetUrl,
      eventId: response.data.id || undefined,
    };
  } catch (error) {
    console.error('Error insertando evento en Google Calendar:', error);
    return { meetUrl };
  }
}

// Enviar notificación por email al cliente y registrar en Google Calendar vía Google Apps Script
export async function sendEmailToClient(appointment: AppointmentData, meetUrl: string) {
  const formattedDate = new Date(appointment.date).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [hours, minutes] = appointment.time.split(':').map(Number);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateObj = new Date(appointment.date);
  const dateStr = dateObj.toISOString().split('T')[0];
  const startIso = `${dateStr}T${pad(hours)}:${pad(minutes)}:00-03:00`;
  const endIso = `${dateStr}T${pad(hours + 1)}:${pad(minutes)}:00-03:00`;

  const subject = `Confirmación de Llamada 1:1 - Agustín Dev`;
  const bodyText = `¡Hola ${appointment.name}!

Tu llamada 1:1 de asesoramiento con Agustín Dev ha sido confirmada.

📅 Fecha: ${formattedDate}
🕒 Hora: ${appointment.time} hs (Hora de Argentina)
${appointment.clientTime ? `🕒 Tu hora local: ${appointment.clientTime} hs (${appointment.timezone || ''})\n` : ''}
📍 Enlace de Google Meet para ingresar:
${meetUrl}

Por favor guarda este enlace para ingresar a la reunión a la hora pactada.

¡Nos vemos pronto!
Agustín Dev
https://www.agustindev.com.ar`;

  // 1. Enviar a Google Apps Script (que corre con la cuenta personal de Agustín y envía desde su Gmail y a su Calendario)
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
  if (scriptUrl) {
    try {
      const params = new URLSearchParams();
      params.append('action', 'appointment_confirmation');
      params.append('to', appointment.email);
      params.append('name', appointment.name);
      params.append('business', appointment.business || '');
      params.append('whatsapp', appointment.whatsapp);
      params.append('subject', subject);
      params.append('body', bodyText);
      params.append('meetUrl', meetUrl);
      params.append('date', formattedDate);
      params.append('time', appointment.time);
      params.append('startIso', startIso);
      params.append('endIso', endIso);

      const resp = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      console.log('📧 Petición enviada a Google Apps Script con status:', resp.status);
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
