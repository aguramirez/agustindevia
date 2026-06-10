import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.appointment.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/calendar/[id] Error:", error);
    return NextResponse.json({ error: 'Error al eliminar el turno' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.appointment.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/calendar/[id] Error:", error);
    return NextResponse.json({ error: 'Error al actualizar el turno' }, { status: 500 });
  }
}
