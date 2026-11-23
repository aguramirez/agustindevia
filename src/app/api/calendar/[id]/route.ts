import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createGoogleMeetEvent, sendEmailToClient } from '@/lib/googleCalendar';

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
      let meetUrl = (updated as any).meetUrl;

      // 1. Generar automáticamente enlace de Google Meet y evento en Google Calendar
      try {
        const meetData = await createGoogleMeetEvent(updated as any);
        if (meetData?.meetUrl) {
          meetUrl = meetData.meetUrl;
          updated = await prisma.appointment.update({
            where: { id },
            data: {
              meetUrl: meetData.meetUrl,
              googleEventId: meetData.eventId || null,
            } as any,
          });
        }
      } catch (meetErr) {
        console.error("Error generando evento de Google Meet:", meetErr);
      }

      // 2. Intentar enviar email de confirmación con el link de Google Meet al cliente
      if (meetUrl) {
        try {
          await sendEmailToClient(updated as any, meetUrl);
        } catch (emailErr) {
          console.error("Error enviando email al cliente:", emailErr);
        }
      }

      // 3. Notificar al bot de WhatsApp si está configurado
      const botUrl = process.env.BOT_WEBHOOK_URL;
      if (botUrl) {
        fetch(`${botUrl}/webhook/confirm-appointment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        }).catch(e => console.error("Error contactando al bot para confirmacion:", e));
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/calendar/[id] Error:", error);
    return NextResponse.json({ error: 'Error al actualizar el turno' }, { status: 500 });
  }
}
