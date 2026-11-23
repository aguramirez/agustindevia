import { NextResponse } from 'next/server';
import { sendPushToAdmin, getAllDeviceTokens } from '@/lib/notifications';

export async function GET() {
  try {
    const tokens = await getAllDeviceTokens();
    
    if (tokens.length === 0) {
      return NextResponse.json({
        status: 'warning',
        message: 'Firebase Admin está listo, pero todavía no hay teléfonos registrados.',
        help: 'Instala el archivo app-debug.apk en tu celular y ábrelo una vez para que registre tu token.',
        tokensCount: 0,
      });
    }

    const result = await sendPushToAdmin(
      '🔔 Notificación de Prueba',
      '¡Funciona! Tu celular está conectado a Firebase y recibirá avisos cuando agenden llamadas.',
      { url: '/calendar', type: 'test' }
    );

    return NextResponse.json({
      status: result.success ? 'success' : 'error',
      message: result.success
        ? '¡Notificación enviada a tu celular con éxito!'
        : 'Hubo un error al enviar la notificación',
      tokensCount: tokens.length,
      firebaseResponse: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error interno' },
      { status: 500 }
    );
  }
}
