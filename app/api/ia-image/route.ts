import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt inválido." },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });

    // ✅ Verificação adicional para evitar erro de undefined
    const imageUrl = response?.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Erro ao obter imagem da IA." },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: imageUrl });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return NextResponse.json(
      { error: "Erro ao gerar imagem." },
      { status: 500 }
    );
  }
}
