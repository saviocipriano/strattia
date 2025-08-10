import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt não fornecido." }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4", // ou gpt-3.5-turbo
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = completion.choices[0].message.content;
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Erro ao gerar texto:", error);
    return NextResponse.json({ error: "Erro ao gerar texto." }, { status: 500 });
  }
}
