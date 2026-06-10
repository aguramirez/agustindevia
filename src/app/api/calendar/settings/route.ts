import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Inicializar la configuración por defecto si no existe
async function initSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "global" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "global", slotDuration: 60 } });
  }
  
  const availabilities = await prisma.availability.findMany();
  if (availabilities.length === 0) {
    // Lunes a Viernes de 09:00 a 18:00
    for (let i = 0; i < 7; i++) {
      await prisma.availability.create({
        data: {
          dayOfWeek: i,
          startTime: "09:00",
          endTime: "18:00",
          isActive: i >= 1 && i <= 5 // Lunes a viernes activo
        }
      });
    }
  }
}

export async function GET() {
  await initSettings();
  const settings = await prisma.settings.findUnique({ where: { id: "global" } });
  const availability = await prisma.availability.findMany({ orderBy: { dayOfWeek: 'asc' } });
  return NextResponse.json({ settings, availability });
}

export async function PUT(req: Request) {
  try {
    const { slotDuration, availability } = await req.json();
    
    if (slotDuration) {
      await prisma.settings.update({
        where: { id: "global" },
        data: { slotDuration: Number(slotDuration) }
      });
    }

    if (availability && Array.isArray(availability)) {
      for (const av of availability) {
        await prisma.availability.update({
          where: { id: av.id },
          data: {
            startTime: av.startTime,
            endTime: av.endTime,
            isActive: av.isActive
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT Settings error:", error);
    return NextResponse.json({ error: "Error updating settings" }, { status: 500 });
  }
}
