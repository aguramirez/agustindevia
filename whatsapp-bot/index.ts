import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import * as http from 'http';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { Pool } from 'pg';
import { Boom } from '@hapi/boom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import * as fs from 'fs';

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
let globalSock: any = null;

// ==========================================
// SERVIDOR WEB INTEGRADO PARA VER EL QR
// ==========================================
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get('/reset-whatsapp', (req, res) => {
    try {
        fs.writeFileSync('./.reset_bot', 'true');
        res.send(`
            <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
                <h2>✅ Sesión reiniciada</h2>
                <p>La memoria del bot ha sido borrada. El servidor se está reiniciando...</p>
                <p>Serás redirigido automáticamente en unos segundos.</p>
            </div>
            <script>setTimeout(() => window.location.href = "/", 4000);</script>
        `);
        setTimeout(() => process.exit(1), 2000);
    } catch (error: any) {
        res.status(500).send('Error al borrar la carpeta: ' + error.message);
    }
});

app.get('/', (req, res) => {
    const resetBtn = `<div style="margin-top: 30px;"><a href="/reset-whatsapp" style="background-color: #ff4b4b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; font-family: Arial, sans-serif;">🔄 Reiniciar y Generar Nuevo QR</a></div>`;

    if (botStatus === "Conectado") {
        res.send(`<div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;"><h2>✅ Bot conectado exitosamente.</h2><p>Ya puedes cerrar esta ventana.</p>${resetBtn}</div>`);
        return;
    }
    if (botStatus === "Desconectado") {
        res.send(`<div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;"><h2>❌ Bot desconectado.</h2><p>Parece que cerraste la sesión desde tu celular.</p><p>Haz clic en el botón de abajo para generar un nuevo QR.</p>${resetBtn}</div>`);
        return;
    }
    if (!currentQR) {
        res.send(`<div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;"><h2>🔄 Generando QR...</h2><p>Por favor espera un momento o recarga la página.</p>${resetBtn}</div>`);
        return;
    }

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Escanear QR de WhatsApp</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <style>
            body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5; margin: 0; }
            .card { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
            #qrcode { margin: 20px auto; display: flex; justify-content: center; }
            .reset-btn { background-color: #ff4b4b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px; font-family: Arial, sans-serif; }
            .reset-btn:hover { background-color: #e04343; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>📱 Escanea el QR con tu WhatsApp</h2>
            <div id="qrcode"></div>
            <p>Abre WhatsApp > Dispositivos vinculados > Vincular un dispositivo</p>
            <p style="color: #666; font-size: 14px;">La página no se refresca sola. Si escaneas, la consola dirá conectado.</p>
            <a href="/reset-whatsapp" class="reset-btn">🔄 Reiniciar / Generar Nuevo QR</a>
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
    `);
});

// Endpoint webhook para notificaciones inmediatas desde Next.js
app.post('/webhook/new-appointment', async (req, res) => {
    try {
        const apt = req.body;
        if (globalSock && botStatus === "Conectado") {
            const adminPhone = "5493885056441@s.whatsapp.net"; // Tu numero
            const clientPhone = `${apt.whatsapp.replace(/\D/g,'')}@s.whatsapp.net`;
            
            console.log(`\n📲 Enviando mensaje de aviso a Admin (WhatsApp: ${adminPhone})...`);
            // Avisar a Admin
            await globalSock.sendMessage(adminPhone, { text: `🔔 *NUEVO TURNO AGENDADO*\n\n*Cliente:* ${apt.name}\n*Rubro:* ${apt.business}\n*Email:* ${apt.email}\n*Fecha:* ${new Date(apt.date).toLocaleDateString('es-AR')} a las ${apt.time} hs.\n\n*WhatsApp:* wa.me/${clientPhone.replace('@s.whatsapp.net','')}` });
            
            console.log(`📲 Enviando mensaje de confirmación al Cliente (WhatsApp: ${clientPhone})...`);
            // Confirmacion a Cliente
            await globalSock.sendMessage(clientPhone, { text: `Hola ${apt.name} 👋\nRecibimos tu solicitud de turno para el día ${new Date(apt.date).toLocaleDateString('es-AR')} a las ${apt.time} hs.\nPronto nos comunicaremos contigo. ¡Gracias!` });
        }
        res.json({ success: true });
    } catch (e) {
        console.error("Error enviando notificacion webhook:", e);
        res.status(500).json({ error: "Error interno" });
    }
});

const server = http.createServer(app);

// CRON JOB - Ejecutar cada 15 minutos para revisar si hay recordatorios de 24hs o 2hs
cron.schedule('*/15 * * * *', async () => {
    if (botStatus !== "Conectado" || !globalSock) return;
    try {
        console.log("Revisando turnos pendientes...");
        // Buscamos turnos CONFIRMADOS
        const { rows } = await pool.query(`SELECT * FROM "Appointment" WHERE status = 'CONFIRMED'`);
        
        const now = new Date();
        
        for (const apt of rows) {
            // El campo date está en UTC pero representa el inicio del día o la fecha exacta.
            // Para simplificar, juntamos date y time
            const aptDate = new Date(apt.date);
            const [hours, minutes] = apt.time.split(':');
            aptDate.setHours(parseInt(hours), parseInt(minutes), 0);
            
            const diffMs = aptDate.getTime() - now.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            
            const clientPhone = `${apt.whatsapp.replace(/\D/g,'')}@s.whatsapp.net`;
            
            // Recordatorio 24 horas (entre 23.75 y 24.0 horas)
            if (diffHours <= 24 && diffHours > 23.75) {
                console.log(`⏰ Enviando recordatorio de 24hs a ${apt.name} (${clientPhone})`);
                await globalSock.sendMessage(clientPhone, { text: `Hola ${apt.name} 👋\nTe recordamos que tienes un turno mañana a las ${apt.time} hs.\n¡Te esperamos!` });
            }
            
            // Recordatorio 2 horas (entre 1.75 y 2.0 horas)
            if (diffHours <= 2 && diffHours > 1.75) {
                console.log(`⏰ Enviando recordatorio de 2hs a ${apt.name} (${clientPhone})`);
                await globalSock.sendMessage(clientPhone, { text: `Hola ${apt.name} 👋\nTe recordamos que tu turno es en 2 horas (${apt.time} hs).\n¡Nos vemos pronto!` });
            }
        }
    } catch (e) {
        console.error("Error en cron:", e);
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`\n🌐 Servidor web para el QR y Webhooks corriendo en el puerto ${PORT}`);
});
// ==========================================

async function connectToWhatsApp() {
    // Si existe el archivo de reset, borramos la carpeta antes de que Baileys la bloquee
    if (fs.existsSync('./.reset_bot')) {
        console.log('🔄 Archivo de reset detectado. Borrando sesión anterior...');
        try {
            if (fs.existsSync('./auth_info_baileys')) {
                // Como Railway usa Volumes, la carpeta en sí misma puede ser un "punto de montaje"
                // No podemos borrar la carpeta, pero sí podemos vaciar su contenido.
                const files = fs.readdirSync('./auth_info_baileys');
                for (const file of files) {
                    fs.rmSync(`./auth_info_baileys/${file}`, { recursive: true, force: true });
                }
            }
            fs.unlinkSync('./.reset_bot');
            console.log('✅ Sesión anterior borrada con éxito.');
        } catch (err) {
            console.error('❌ Error borrando la sesión en el inicio:', err);
        }
    }

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        auth: state,
        browser: Browsers.macOS('Desktop'),
        logger: pino({ level: "silent" }) as any, // Volvemos a silenciar los logs
    });
    
    globalSock = sock;

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

            const modelsToTry = [
                "gemini-2.5-flash",
                "gemini-2.0-flash",
                "gemini-2.5-flash-lite",
            ];

            let responseText = "";
            let success = false;

            for (const modelName of modelsToTry) {
                try {
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        systemInstruction: SOCIAL_PROMPT,
                    });

                    const chatSession = model.startChat({ history });
                    const result = await chatSession.sendMessage(textMessage);
                    responseText = result.response.text();
                    success = true;
                    break; // Si funcionó, salir del loop
                } catch (err: any) {
                    const is503 = err.message?.includes("503") || err.status === 503;
                    const is429 = err.message?.includes("429") || err.status === 429;
                    
                    if (is503 || is429) {
                        console.warn(`⚠️ [${modelName}] saturado (${is503 ? '503' : '429'}). Intentando con el de respaldo...`);
                        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos antes de intentar otro
                    } else {
                        throw err; // Es un error distinto (ej. API Key inválida)
                    }
                }
            }

            if (!success) {
                throw new Error("Todos los modelos de IA están saturados en este momento.");
            }

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
