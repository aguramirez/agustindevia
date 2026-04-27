import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import qrcode from 'qrcode-terminal';
import pino from 'pino';

// Cargamos el .env desde la raíz del proyecto de Next.js
dotenv.config({ path: '../.env' });
dotenv.config({ path: '../.env.local' });

// Importamos el Prompt especial para Redes Sociales
import { SOCIAL_PROMPT } from './social-prompt';

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("❌ Faltan las variables de entorno. Asegúrate de tener GOOGLE_API_KEY en tu .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Diccionario rudimentario en memoria para guardar el historial por número
// Nota: Cuando despliegues en producción de verdad, lo ideal es cambiar esto por una base de datos (Postgres/Redis)
const memoryStore = new Map<string, any[]>();

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        auth: state,
        browser: Browsers.macOS('Desktop'),
        logger: pino({ level: "silent" }) as any, // Volvemos a silenciar los logs
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        if(qr) {
            console.log('\n📱 Escanea este QR con tu WhatsApp para iniciar sesión.');
            qrcode.generate(qr, { small: true });
        }
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('🔄 Conexión cerrada. Reconectando...', shouldReconnect);
            if(shouldReconnect) {
                connectToWhatsApp();
            } else {
                console.log('❌ Te has desconectado de WhatsApp. Borra la carpeta "auth_info_baileys" y escanea de nuevo.');
            }
        } else if(connection === 'open') {
            console.log('✅ Bot de WhatsApp conectado exitosamente! Esperando mensajes...');
        }
    });

    sock.ev.on('messages.upsert', async (m: any) => {
        const msg = m.messages[0];
        // Ignorar mensajes enviados por nosotros mismos o de grupos
        if (!msg.message || msg.key.fromMe || msg.key.remoteJid?.includes('@g.us')) return;

        const senderNumber = msg.key.remoteJid;
        if(!senderNumber) return;

        // Extraer texto del mensaje (puede venir de distintos formatos en WhatsApp)
        const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!textMessage) return;

        console.log(`📩 Recibido de ${senderNumber}: ${textMessage}`);
        
        // Simular que estamos "Escribiendo..." en WhatsApp
        await sock.sendPresenceUpdate('composing', senderNumber);

        try {
            // Recuperar historial o crear uno nuevo
            let history = memoryStore.get(senderNumber) || [];

            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: SOCIAL_PROMPT,
            });

            const chatSession = model.startChat({ history });
            const result = await chatSession.sendMessage(textMessage);
            let responseText = result.response.text();

            // Convertir Markdown de Gemini (**) a Negritas de WhatsApp (*)
            responseText = responseText.replace(/\*\*(.*?)\*\*/g, '*$1*');

            // Actualizar historial de la IA con el nuevo mensaje
            history.push({ role: "user", parts: [{ text: textMessage }] });
            history.push({ role: "model", parts: [{ text: responseText }] });
            memoryStore.set(senderNumber, history);

            // Enviar respuesta por WhatsApp
            await sock.sendMessage(senderNumber, { text: responseText });
            console.log(`🤖 Respuesta enviada a ${senderNumber}`);
            
        } catch (error) {
            console.error("❌ Error al procesar con IA:", error);
            await sock.sendMessage(senderNumber, { text: "Disculpa, tuve un error técnico procesando tu mensaje. Por favor intenta de nuevo en unos minutos." });
        }
    });
}

connectToWhatsApp();
