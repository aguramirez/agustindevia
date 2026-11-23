import admin from 'firebase-admin';
import prisma from './prisma';
import fs from 'fs';
import path from 'path';

// Archivo de respaldo local para tokens en caso de que la DB aún no tenga la tabla migrada
const TOKENS_FALLBACK_FILE = path.join(process.cwd(), '.device-tokens.json');

// Inicializar Firebase Admin SDK si no ha sido inicializado
function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // 1. Verificar si viene como variable de entorno (JSON string o base64)
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountEnv) {
    try {
      const decoded = serviceAccountEnv.startsWith('{')
        ? JSON.parse(serviceAccountEnv)
        : JSON.parse(Buffer.from(serviceAccountEnv, 'base64').toString('utf8'));

      return admin.initializeApp({
        credential: admin.credential.cert(decoded),
      });
    } catch (e) {
      console.error('Error parseando FIREBASE_SERVICE_ACCOUNT_KEY de entorno:', e);
    }
  }

  // 2. Verificar si existe archivo local de clave de servicio
  const possibleFiles = [
    path.join(process.cwd(), 'notes-app-7ab34-firebase-adminsdk-fbsvc-d6aea71868.json'),
    path.join(process.cwd(), 'firebase-service-account.json'),
  ];

  // Buscar también dinámicamente cualquier archivo que contenga firebase-adminsdk en la raíz
  try {
    const rootFiles = fs.readdirSync(process.cwd());
    const adminSdkFile = rootFiles.find(f => f.includes('firebase-adminsdk') && f.endsWith('.json'));
    if (adminSdkFile) {
      possibleFiles.unshift(path.join(process.cwd(), adminSdkFile));
    }
  } catch {}

  for (const localFile of possibleFiles) {
    if (fs.existsSync(localFile)) {
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } catch (e) {
        console.error(`Error leyendo ${path.basename(localFile)}:`, e);
      }
    }
  }

  return null;
}

// Guardar token en respaldo local (solo en entorno local/desarrollo)
export function saveTokenFallback(token: string) {
  if (process.env.VERCEL) {
    return; // En Vercel el filesystem es de solo lectura (/var/task)
  }
  try {
    let tokens: string[] = [];
    if (fs.existsSync(TOKENS_FALLBACK_FILE)) {
      tokens = JSON.parse(fs.readFileSync(TOKENS_FALLBACK_FILE, 'utf8'));
    }
    if (!tokens.includes(token)) {
      tokens.push(token);
      fs.writeFileSync(TOKENS_FALLBACK_FILE, JSON.stringify(tokens, null, 2));
    }
  } catch (err) {
    console.error('Error guardando token en respaldo local:', err);
  }
}

// Obtener todos los tokens registrados
export async function getAllDeviceTokens(): Promise<string[]> {
  const tokenSet = new Set<string>();

  // 1. Intentar leer de Base de Datos PostgreSQL (Neon)
  try {
    const dbTokens = await (prisma as any).deviceToken?.findMany();
    if (dbTokens && Array.isArray(dbTokens)) {
      dbTokens.forEach((t: { token: string }) => {
        if (t.token && !t.token.startsWith('probe_')) {
          tokenSet.add(t.token);
        }
      });
    }
  } catch (dbErr) {
    console.error('Error leyendo deviceToken de DB:', dbErr);
  }

  // 2. Leer de respaldo local solo en local
  if (!process.env.VERCEL) {
    try {
      if (fs.existsSync(TOKENS_FALLBACK_FILE)) {
        const localTokens = JSON.parse(fs.readFileSync(TOKENS_FALLBACK_FILE, 'utf8'));
        if (Array.isArray(localTokens)) {
          localTokens.forEach((t: string) => {
            if (t && !t.startsWith('probe_')) {
              tokenSet.add(t);
            }
          });
        }
      }
    } catch {}
  }

  return Array.from(tokenSet);
}

// Enviar notificación a todos los dispositivos registrados del admin
export async function sendPushToAdmin(
  title: string,
  body: string,
  data?: Record<string, string>
) {
  const app = getFirebaseAdmin();
  if (!app) {
    console.warn(
      '⚠️ Firebase Admin no está inicializado.'
    );
    return { success: false, reason: 'Firebase not configured' };
  }

  const tokens = await getAllDeviceTokens();
  if (tokens.length === 0) {
    console.warn('⚠️ No hay tokens de dispositivos registrados aún.');
    return { success: false, reason: 'No registered tokens' };
  }

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: {
      title,
      body,
    },
    data: data || {},
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'agustindev_agenda',
        priority: 'max',
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ Push enviado: ${response.successCount} éxitos, ${response.failureCount} fallos.`);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Error enviando notificación push:', error);
    return { success: false, error };
  }
}
