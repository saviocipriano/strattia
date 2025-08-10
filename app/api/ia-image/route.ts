import { NextResponse } from "next/server";

export const runtime = "nodejs";

function svgPlaceholder(text: string) {
  const t = (text || "Strattia").slice(0, 48).replace(/</g, "&lt;");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="sans-serif" font-size="42" fill="#e2e8f0">${t}</text>
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
      font-family="sans-serif" font-size="20" fill="#94a3b8">(placeholder)</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt inválido" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      try {
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey });
        const img = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
        });
        const b64 = img.data?.[0]?.b64_json;
        if (!b64) throw new Error("Sem imagem retornada");
        return NextResponse.json({ url: `data:image/png;base64,${b64}` });
      } catch (e: any) {
        // trata quota/429 como sucesso com placeholder
        const msg = String(e?.message || e);
        const code = e?.status || e?.response?.status;
        const isQuota = code === 429 || /quota|insufficient/i.test(msg);
        if (isQuota) {
          return NextResponse.json({ url: svgPlaceholder(prompt), offline: true, reason: "quota" });
        }
        throw e;
      }
    }

    // Sem chave → placeholder
    return NextResponse.json({ url: svgPlaceholder(prompt), offline: true });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
