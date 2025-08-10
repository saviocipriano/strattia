import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // A chave deve estar definida em .env.local
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

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = completion.choices[0].message.content;
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Erro ao gerar texto:", error);
    return NextResponse.json(
      { error: "Erro ao gerar texto." },
      { status: 500 }
    );
  }
}
