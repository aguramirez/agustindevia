import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'asc' },
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
      },
    });

    // Notificar al bot de WhatsApp (Express webhook)
    // Cambia la URL por la URL de Railway cuando esté en producción
    const botUrl = process.env.BOT_WEBHOOK_URL || 'http://localhost:3001';
    fetch(`${botUrl}/webhook/new-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment),
    }).catch(e => console.error("Error contactando al bot:", e));

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("POST /api/calendar Error:", error);
    return NextResponse.json({ error: 'Error al crear el turno' }, { status: 500 });
  }
}
