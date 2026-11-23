import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPushToAdmin } from '@/lib/notifications';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' }, // Última llamada agendada primero
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("GET /api/calendar Error:", error);
    return NextResponse.json({ error: 'Error al obtener los turnos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const appointment = await prisma.appointment.create({
      data: {
        name: body.name,
        business: body.business,
        whatsapp: body.whatsapp,
        email: body.email,
        date: new Date(body.date),
        time: body.time,
        timezone: body.timezone || null,
        clientTime: body.clientTime || null,
      },
    });

    // 1. Notificar al bot de WhatsApp si está configurado
    const botUrl = process.env.BOT_WEBHOOK_URL;
    if (botUrl) {
      fetch(`${botUrl}/webhook/new-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      }).catch(e => console.error("Error contactando al bot:", e));
    }

    // 2. Notificación Push a tu celular (Firebase Cloud Messaging)
    try {
      const formattedDate = appointment.date.toLocaleDateString('es-AR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      // IMPORTANTE: En Vercel Serverless se DEBE esperar el envío antes de retornar la respuesta
      await sendPushToAdmin(
        "📅 ¡Nueva llamada agendada!",
        `${appointment.name} (${appointment.business || "Sin negocio"}) agendó para el ${formattedDate} a las ${appointment.time} hs`,
        { url: "/calendar", id: appointment.id }
      );
    } catch (pushErr) {
      console.error("Error enviando push notification:", pushErr);
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("POST /api/calendar Error:", error);
    return NextResponse.json({ error: 'Error al crear el turno' }, { status: 500 });
  }
}
