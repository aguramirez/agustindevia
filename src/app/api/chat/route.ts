import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-flash-lite",
    ];

    let result;
    let lastError;

    for (let i = 0; i < modelsToTry.length; i++) {
      try {
        const modelName = modelsToTry[i];
        console.log(`Intentando con modelo: ${modelName}`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
          safetySettings,
        });
        
        const chatSession = model.startChat({ history: history || [] });
        result = await chatSession.sendMessage(message);
        
        // Si funcionó, salimos del loop
        break;
      } catch (error: any) {
        lastError = error;
        const is503 = error.message?.includes("503") || error.status === 503;
        const is429 = error.message?.includes("429") || error.status === 429;
        
        if (is503 || is429) {
          console.warn(`[${modelsToTry[i]}] falló con ${is503 ? '503' : '429'}.`);
          if (i < modelsToTry.length - 1) {
            console.warn(`Esperando 2 segundos antes de usar el siguiente modelo de respaldo...`);
            await delay(2000); // Esperar 2 segundos antes de intentar con el siguiente modelo para darle respiro a la API
          }
        } else {
          // Si es un error distinto (ej. de validación de API KEY), cortamos el intento.
          throw error;
        }
      }
    }

    if (!result) {
      // Si agotamos todos los modelos y fallaron, lanzamos el último error
      throw lastError;
    }

    return NextResponse.json({ text: result.response.text() });
  } catch (error: any) {
    if (error.message?.includes("429") || error.status === 429) {
      return NextResponse.json(
        { error: "Hemos recibido muchas consultas de momento. Por favor, aguarda un minuto e intenta nuevamente." },
        { status: 429 }
      );
    }
    if (error.message?.includes("503") || error.status === 503) {
      return NextResponse.json(
        { error: "Los servidores de IA están con alto tráfico temporal. Intenta en unos minutos." },
        { status: 503 }
      );
    }
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Error interno del servidor al procesar la respuesta." }, { status: 500 });
  }
}
