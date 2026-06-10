import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseISO, getDay } from 'date-fns';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date');
  if (!dateStr) return NextResponse.json({ error: "Date required" }, { status: 400 });

  const date = parseISO(dateStr);
  const dayOfWeek = getDay(date);

  const availability = await prisma.availability.findFirst({
    where: { dayOfWeek }
  });

  if (!availability || !availability.isActive) {
    return NextResponse.json([]);
  }

  const settings = await prisma.settings.findUnique({ where: { id: "global" } });
  const slotDuration = settings?.slotDuration || 60;

  // Ajuste de inicio y fin del día en UTC para abarcar la fecha seleccionada
  const todayStart = new Date(date);
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(date);
  todayEnd.setHours(23,59,59,999);

  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
      status: { not: "CANCELLED" }
    }
  });

  // Todos los tiempos que ya están ocupados
  const bookedTimes = appointments.map(a => a.time);

  const [startH, startM] = availability.startTime.split(':').map(Number);
  const [endH, endM] = availability.endTime.split(':').map(Number);

  let currentMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;

  const slots = [];
  while (currentMin + slotDuration <= endMin) {
    const h = Math.floor(currentMin / 60).toString().padStart(2, '0');
    const m = (currentMin % 60).toString().padStart(2, '0');
    const timeStr = `${h}:${m}`;
    
    // Evitamos doble booking simple
    if (!bookedTimes.includes(timeStr)) {
      slots.push(timeStr);
    }

    currentMin += slotDuration;
  }

  return NextResponse.json(slots);
}
