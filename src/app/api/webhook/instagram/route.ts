import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SOCIAL_PROMPT } from '@/lib/social-prompt';

// Token de verificación que configuraremos en Meta for Developers
const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'agustindev_token_123';
// Token de acceso a la página/app de Meta para poder enviar el mensaje de vuelta
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

// =========================================================================
// GET: Verificación de Webhook por parte de Meta
// =========================================================================
// Meta nos envía un GET para comprobar que somos los dueños del endpoint.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK INSTAGRAM VERIFICADO CON ÉXITO");
    // Meta exige que devolvamos el challenge tal cual y con status 200
    return new NextResponse(challenge, { status: 200 });
  } else {
    return new NextResponse("Forbidden", { status: 403 });
  }
}


// Store rudimentario en memoria para mantener contexto de la conversación
// (En producción real de Vercel esto se reinicia si nadie usa la app, idealmente usar Redis o Base de Datos)
const memoryStore = new Map<string, any[]>();

// =========================================================================
// POST: Recepción de mensajes de los usuarios de Instagram
// =========================================================================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificamos que el evento provenga de Instagram
    if (body.object === "instagram") {
      for (const entry of body.entry) {
        for (const webhookEvent of entry.messaging) {
          const senderId = webhookEvent.sender.id;
          const messageText = webhookEvent.message?.text;

          // Si el usuario nos mandó texto:
          if (messageText) {
            console.log(`💬 DM de Instagram de ${senderId}: ${messageText}`);
            
            // 1. Instanciar la IA con tu misma Key
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
            const model = genAI.getGenerativeModel({
              model: "gemini-2.5-flash",
              systemInstruction: SOCIAL_PROMPT, // Usar prompt especial para redes
            });

            // 2. Manejar el historial
            let history = memoryStore.get(senderId) || [];
            const chatSession = model.startChat({ history });
            
            // 3. Generar respuesta
            const result = await chatSession.sendMessage(messageText);
            const replyText = result.response.text();

            // Guardar en memoria
            history.push({ role: "user", parts: [{ text: messageText }] });
            history.push({ role: "model", parts: [{ text: replyText }] });
            memoryStore.set(senderId, history);

            // 4. Enviar respuesta de vuelta a Instagram usando la Graph API oficial
            if (INSTAGRAM_ACCESS_TOKEN) {
                await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${INSTAGRAM_ACCESS_TOKEN}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipient: { id: senderId },
                    message: { text: replyText }
                  })
                });
                console.log(`🤖 Respuesta de IG enviada a ${senderId}`);
            } else {
                console.warn("⚠️ Falta INSTAGRAM_ACCESS_TOKEN en tu .env para poder responderle al cliente.");
            }
          }
        }
      }
      // Meta espera un 200 rápido para saber que recibimos el evento
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("❌ Error en Webhook de Instagram:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
