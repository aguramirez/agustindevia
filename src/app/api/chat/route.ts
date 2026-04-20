import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export async function POST(req: Request) {
  try {
    const { history, message } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    let result;
    try {
      // Intento 1: Usar el modelo más nuevo (2.5)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });
      const chatSession = model.startChat({ history: history || [] });
      result = await chatSession.sendMessage(message);
    } catch (primaryError: any) {
      // Si el 2.5 falla por sobrecarga (503) O por límite de peticiones (429), hacemos fallback al 1.5
      const is503 = primaryError.message?.includes("503") || primaryError.status === 503;
      const is429 = primaryError.message?.includes("429") || primaryError.status === 429;
      
      if (is503 || is429) {
        console.warn(`Gemini 2.5 Flash error (${is503 ? '503' : '429'}). Fallback to 1.5 Flash...`);
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_PROMPT,
        });
        const fallbackSession = fallbackModel.startChat({ history: history || [] });
        result = await fallbackSession.sendMessage(message);
      } else {
        // Si es otro error (ej: 429), lo lanzamos para que lo atrape el catch general
        throw primaryError;
      }
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
