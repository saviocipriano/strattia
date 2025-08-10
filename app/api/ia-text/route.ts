// app/api/ia-text/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type Body = {
  prompt: string;
  mode?: "structured" | "raw"; // structured = retorna campos; raw = texto único
  tone?: "direto" | "emocional" | "informativo" | "premium" | "conversacional";
  language?: "pt-BR" | "en-US" | "es-ES";
  objective?: "conversao" | "trafego" | "alcance" | "engajamento";
  maxTokens?: number; // padrão 600
  temperature?: number; // padrão 0.7
  brand?: string; // opcional (exibe e reforça posicionamento)
};

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

function offlineStructured(prompt: string, lang: string = "pt-BR") {
  const isPT = lang === "pt-BR";
  return {
    headline: isPT ? `Transforme seus resultados com ${prompt.slice(0, 48)}...` : `Transform results with ${prompt.slice(0, 48)}...`,
    primaryText:
      (isPT
        ? "Apresente o benefício principal em uma frase forte. Mostre prova rápida (números, autoridade ou cases) e convide para a ação."
        : "State the core benefit in one strong line. Add quick proof (numbers, authority, or cases) and invite to act.") +
      " " +
      (isPT
        ? "Mantenha frases curtas e fáceis de ler."
        : "Keep sentences short and easy to scan."),
    bullets: isPT
      ? ["Benefício 1 claro", "Prova/ganho 2", "Diferencial 3"]
      : ["Clear benefit 1", "Proof/gain 2", "Differential 3"],
    ctas: isPT
      ? ["Quero agora", "Falar com especialista", "Testar grátis"]
      : ["Get started", "Talk to specialist", "Try it free"],
    variants: isPT
      ? {
          curto: "Título direto + 1 frase + CTA (ideal Stories).",
          informativo: "Explique em 2–3 frases o que, como e por que agora.",
          emocional: "Use emoção, transformação e futuro desejado. Termine com CTA.",
        }
      : {
          short: "Direct title + 1 sentence + CTA (Stories).",
          informative: "Explain what, how, and why in 2–3 sentences.",
          emotional: "Use emotion, transformation, desired future. Close with CTA.",
        },
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    // validação básica
    if (!body || typeof body.prompt !== "string" || !body.prompt.trim()) {
      return bad("Prompt inválido.");
    }

    const {
      prompt,
      mode = "structured",
      tone = "direto",
      language = "pt-BR",
      objective = "conversao",
      maxTokens = 600,
      temperature = 0.7,
      brand,
    } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    // Fallback offline se não houver chave
    if (!apiKey) {
      if (mode === "raw") {
        const s =
          `💡 Headline: Transforme com ${prompt.slice(0, 48)}...\n\n` +
          `✍️ Copy (${tone}): Benefício central + prova rápida + CTA claro.\n` +
          `🎯 Objetivo: ${objective}`;
        return NextResponse.json({ text: s, offline: true });
      }
      return NextResponse.json({ structured: offlineStructured(prompt, language), offline: true });
    }

    // OpenAI oficial
    const openai = new OpenAI({ apiKey });

    const system =
      language === "pt-BR"
        ? `Você é um redator sênior de performance e social ads. 
Escreva de forma ${tone}, clara e persuasiva, focando em ${objective}.
Quando solicitado "structured", responda em JSON estrito com as chaves:
{ "headline": string, "primaryText": string, "bullets": string[], "ctas": string[], "variants": { "curto": string, "informativo": string, "emocional": string } }`
        : `You are a senior performance copywriter. 
Write in a ${tone} style, clear and persuasive, focused on ${objective}.
When "structured" is requested, answer with strict JSON using keys:
{ "headline": string, "primaryText": string, "bullets": string[], "ctas": string[], "variants": { "short": string, "informative": string, "emotional": string } }`;

    const userContent =
      (brand ? `Brand: ${brand}\n` : "") +
      `Prompt: ${prompt}\nMode: ${mode}\nLanguage: ${language}`;

    // Se structured, pedir JSON diretamente
    if (mode === "structured") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content:
              (language === "pt-BR"
                ? "Gere o JSON estruturado solicitado, sem texto extra."
                : "Generate the requested structured JSON, with no extra text.") +
              "\n\n" +
              userContent,
          },
        ],
        temperature,
        max_tokens: Math.min(2048, Math.max(100, maxTokens)),
        response_format: { type: "json_object" },
      });

      const raw = completion.choices?.[0]?.message?.content || "{}";
      // segurança: tentar fazer parse; se falhar, retornar como texto
      try {
        const parsed = JSON.parse(raw);
        return NextResponse.json({ structured: parsed, model: "gpt-4o-mini" });
      } catch {
        return NextResponse.json({ structured: offlineStructured(prompt, language), degraded: true });
      }
    }

    // RAW (texto corrido)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content:
            (language === "pt-BR"
              ? "Escreva uma copy completa (headline, parágrafo persuasivo e CTA)."
              : "Write a complete ad copy (headline, persuasive paragraph, and CTA).") +
            "\n\n" +
            userContent,
        },
      ],
      temperature,
      max_tokens: Math.min(2048, Math.max(100, maxTokens)),
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ text, model: "gpt-4o-mini" });
  } catch (err: any) {
    // não vazar chave e nem stack grande
    const msg = typeof err?.message === "string" ? err.message : String(err);
    console.error("[ia-text] error:", msg);
    return NextResponse.json({ error: "Erro ao gerar texto." }, { status: 500 });
  }
}
