import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import * as http from 'http';
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

// Variable global para almacenar el último QR generado y el estado
let currentQR = "";
let botStatus = "Iniciando...";

// ==========================================
// SERVIDOR WEB INTEGRADO PARA VER EL QR
// ==========================================
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    if (botStatus === "Conectado") {
        res.end(`<h2>✅ Bot conectado exitosamente.</h2><p>Ya puedes cerrar esta ventana.</p>`);
        return;
    }

    if (!currentQR) {
        res.end(`<h2>🔄 Generando QR...</h2><p>Por favor refresca la página en unos segundos.</p>`);
        return;
    }

    // HTML simple que renderiza el QR usando una librería en el cliente
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Escanear QR de WhatsApp</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <style>
            body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5; }
            .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
            #qrcode { margin: 20px auto; display: flex; justify-content: center; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>📱 Escanea el QR con tu WhatsApp</h2>
            <div id="qrcode"></div>
            <p>Abre WhatsApp > Dispositivos vinculados > Vincular un dispositivo</p>
            <p style="color: #666; font-size: 14px;">La página no se refresca sola. Si escaneas, la consola dirá conectado.</p>
        </div>
        <script>
            new QRCode(document.getElementById("qrcode"), {
                text: "${currentQR}",
                width: 256,
                height: 256
            });
        </script>
    </body>
    </html>
    `;
    res.end(html);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🌐 Servidor web para el QR corriendo en el puerto ${PORT}`);
});
// ==========================================

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
            currentQR = qr;
            botStatus = "Esperando QR";
            console.log('\n📱 Abre el enlace web de Railway para escanear el QR cómodamente.');
            qrcode.generate(qr, { small: true });
        }
        if(connection === 'close') {
            botStatus = "Desconectado";
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('🔄 Conexión cerrada. Reconectando...', shouldReconnect);
            if(shouldReconnect) {
                connectToWhatsApp();
            } else {
                console.log('❌ Te has desconectado de WhatsApp. Borra la carpeta "auth_info_baileys" y escanea de nuevo.');
            }
        } else if(connection === 'open') {
            currentQR = "";
            botStatus = "Conectado";
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
