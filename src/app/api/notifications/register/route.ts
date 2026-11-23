import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { saveTokenFallback } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const { token, platform } = await req.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
    }

    // 1. Guardar en respaldo local
    saveTokenFallback(token);

    // 2. Intentar guardar en base de datos si la tabla existe
    try {
      await (prisma as any).deviceToken?.upsert({
        where: { token },
        create: { token, platform: platform || 'android' },
        update: { platform: platform || 'android', updatedAt: new Date() },
      });
    } catch {
      // Ignorar si la tabla aún no se migró
    }

    return NextResponse.json({ success: true, message: 'Dispositivo registrado' });
  } catch (error) {
    console.error('Error registrando device token:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
