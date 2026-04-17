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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const chatSession = model.startChat({
      history: history || [],
    });

    const result = await chatSession.sendMessage(message);

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
