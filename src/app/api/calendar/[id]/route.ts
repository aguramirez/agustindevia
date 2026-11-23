import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createGoogleMeetEvent } from '@/lib/googleCalendar';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/calendar/[id] Error:", error);
    return NextResponse.json({ error: 'Error al eliminar el turno' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    let updated = await prisma.appointment.update({
      where: { id },
      data: body,
    });

    if (body.status === 'CONFIRMED') {
      // 1. Generar automáticamente el evento en Google Calendar con Google Meet
      try {
        const meetData = await createGoogleMeetEvent(updated);
        if (meetData?.meetUrl) {
          updated = await prisma.appointment.update({
            where: { id },
            data: {
              meetUrl: meetData.meetUrl,
              googleEventId: meetData.eventId || null,
            },
          });
        }
      } catch (meetErr) {
        console.error("Error generando evento de Google Meet:", meetErr);
      }

      // 2. Notificar al bot de WhatsApp si está configurado
      const botUrl = process.env.BOT_WEBHOOK_URL || 'http://localhost:3001';
      fetch(`${botUrl}/webhook/confirm-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(e => console.error("Error contactando al bot para confirmacion:", e));
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/calendar/[id] Error:", error);
    return NextResponse.json({ error: 'Error al actualizar el turno' }, { status: 500 });
  }
}
