"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea"; // manter o mesmo caminho do seu projeto
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Copy,
  Download,
  ImageIcon,
  VideoIcon,
  TypeIcon,
  Music2,
  Wand2,
  Settings2,
  Hash,
  CheckCircle2,
} from "lucide-react";
import SaveToCampaign from "@/components/SaveToCampaign";

// Tipagens de apoio

type Tone = "direto" | "emocional" | "informativo" | "premium" | "conversacional";
type Objective = "conversao" | "trafego" | "alcance" | "engajamento";

type StructuredCopy = {
  headline?: string;
  primaryText?: string;
  bullets?: string[];
  ctas?: string[];
  variants?: Record<string, string>;
};

export default function CriativosIaPage() {
  const { toast } = useToast();

  // ---------------------------
  // Estados comuns / controles
  // ---------------------------
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"raw" | "structured">("structured");
  const [tone, setTone] = useState<Tone>("direto");
  const [objective, setObjective] = useState<Objective>("conversao");

  // ---------------------------
  // Texto
  // ---------------------------
  const [loadingText, setLoadingText] = useState(false);
  const [rawText, setRawText] = useState<string>("");
  const [structured, setStructured] = useState<StructuredCopy | null>(null);

  // ---------------------------
  // Imagem
  // ---------------------------
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // ---------------------------
  // Vídeo (placeholder gerado em runtime)
  // ---------------------------
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // ---------------------------
  // Áudio (placeholder WAV)
  // ---------------------------
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");

  // ---------------------------
  // Templates
  // ---------------------------
  const templates = useMemo(
    () => [
      {
        tag: "Promo Flash",
        text:
          "OFERTA RELÂMPAGO! Somente hoje: {{produto}} com {{desconto}} OFF. Frete grátis + troca fácil. Garanta já: {{link}}",
      },
      {
        tag: "Lançamento",
        text:
          "Apresentamos o novo {{produto}}. Design premium, desempenho superior e garantia total. Descubra agora: {{link}}",
      },
      {
        tag: "Lead Magnet",
        text:
          "Baixe o guia gratuito: {{tema}}. Em poucos minutos você aprende {{beneficio}}. Acesse: {{link}}",
      },
      {
        tag: "Local Service",
        text:
          "Atendimento em {{cidade}}: {{servico}} com equipe certificada, materiais inclusos e satisfação garantida. Chame no WhatsApp: {{whats}}",
      },
    ],
    []
  );

  const hashtags = useMemo(
    () => [
      "#promo",
      "#oferta",
      "#lancamento",
      "#premium",
      "#desconto",
      "#fretegratis",
      "#novidade",
      "#strattia",
    ],
    []
  );

  // Helpers
  function preset(text: string) {
    setPrompt((p) => (p ? p + "\n\n" + text : text));
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado para a área de transferência" });
  }

  function downloadTextFile(text: string, filename = "criativo.txt") {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadJson(obj: any, filename = "criativo.json") {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------------------------
  // Handlers IA – Texto
  // ---------------------------
  async function handleText() {
    if (!prompt.trim()) return;
    setLoadingText(true);
    setRawText("");
    setStructured(null);

    try {
      const res = await fetch("/api/ia-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          mode,
          tone,
          objective,
          language: "pt-BR",
          maxTokens: 900,
          temperature: 0.85,
          brand: "Strattia",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao gerar texto");

      if (mode === "raw") setRawText(data.text || data.result || "");
      else setStructured((data.structured as StructuredCopy) || data);

      toast({ title: "Texto gerado com sucesso" });
    } catch (e: any) {
      // Se a rota devolveu fallback/quota como 200, ainda chega aqui se res.ok=false
      // Então forçamos uma segunda tentativa só com offline no frontend
      const offline: StructuredCopy = {
        headline: `Transforme com ${prompt.slice(0, 48)}...`,
        primaryText:
          "(Fallback) Benefício central + prova social + CTA claro. Tom alinhado ao objetivo.",
        bullets: ["Benefício 1", "Ganhos rápidos", "Diferencial"],
        ctas: ["Quero agora", "Testar grátis", "Falar no WhatsApp"],
        variants: {
          curto: "Título direto + 1 frase + CTA",
          informativo: "Explique o que, como e por quê em 2–3 frases",
          emocional: "Mostre transformação e futuro desejado",
        },
      };
      if (mode === "raw") setRawText(`(Fallback) ${prompt}`);
      else setStructured(offline);
      toast({
        title: "Sem crédito/erro na IA – usando fallback",
        description: String(e?.message || e),
        variant: "destructive",
      });
    } finally {
      setLoadingText(false);
    }
  }

  // ---------------------------
  // Handlers IA – Imagem
  // ---------------------------
  async function handleImage() {
    if (!prompt.trim()) return;
    setLoadingImage(true);
    setImageUrl("");

    try {
      const res = await fetch("/api/ia-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao gerar imagem");
      setImageUrl(data?.url || "");
      toast({ title: "Imagem gerada com sucesso" });
    } catch (e: any) {
      // placeholder SVG
      const svg = `\n        <svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'>\n          <defs>\n            <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>\n              <stop offset='0%' stop-color='#0f172a'/>\n              <stop offset='100%' stop-color='#1e293b'/>\n            </linearGradient>\n          </defs>\n          <rect width='100%' height='100%' fill='url(#g)'/>\n          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'\n            font-family='sans-serif' font-size='40' fill='#e2e8f0'>${escapeHtml(
              prompt.slice(0, 36) || "Strattia"
            )}</text>\n          <text x='50%' y='60%' dominant-baseline='middle' text-anchor='middle'\n            font-family='sans-serif' font-size='18' fill='#94a3b8'>(placeholder)</text>\n        </svg>`;
      const b64 = typeof window !== "undefined" ? btoa(unescape(encodeURIComponent(svg))) : "";
      setImageUrl(`data:image/svg+xml;base64,${b64}`);
      toast({
        title: "Sem crédito/erro na IA – usando placeholder",
        description: String(e?.message || e),
        variant: "destructive",
      });
    } finally {
      setLoadingImage(false);
    }
  }

  function downloadImage() {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "criativo-strattia.png";
    a.click();
  }

  // ---------------------------
  // Vídeo – gera um .webm curto a partir de um canvas
  // ---------------------------
  async function handleVideoPlaceholder() {
    setLoadingVideo(true);
    setVideoUrl("");

    try {
      const { url } = await generateCanvasWebm({ text: prompt || "Strattia" });
      setVideoUrl(url);
      toast({ title: "Vídeo (placeholder) gerado" });
    } catch (e: any) {
      toast({ title: "Erro ao gerar vídeo", description: String(e), variant: "destructive" });
    } finally {
      setLoadingVideo(false);
    }
  }

  function downloadVideo() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "criativo-strattia.webm";
    a.click();
  }

  // ---------------------------
  // Áudio – gera WAV sintético (sine sweep)
  // ---------------------------
  async function handleAudioPlaceholder() {
    setLoadingAudio(true);
    setAudioUrl("");
    try {
      const wav = createSineWav(1.8); // 1.8s
      const url = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
      setAudioUrl(url);
      toast({ title: "Áudio (placeholder) gerado" });
    } catch (e: any) {
      toast({ title: "Erro ao gerar áudio", description: String(e), variant: "destructive" });
    } finally {
      setLoadingAudio(false);
    }
  }

  function downloadAudio() {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "narração-strattia.wav";
    a.click();
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">🎨 Criativos com IA</h1>

        {/* Formato global */}
        <div className="hidden md:flex items-center gap-2">
          <div className="text-zinc-300/90 text-sm flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            <span>Formato:</span>
          </div>
          <div className="flex rounded-md overflow-hidden border border-white/10">
            <button
              onClick={() => setMode("structured")}
              className={`px-3 py-1.5 text-sm ${
                mode === "structured" ? "bg-white/15 text-white" : "text-zinc-300"
              }`}
            >
              Estruturado
            </button>
            <button
              onClick={() => setMode("raw")}
              className={`px-3 py-1.5 text-sm ${
                mode === "raw" ? "bg-white/15 text-white" : "text-zinc-300"
              }`}
            >
              Texto corrido
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="texto">
        <TabsList className="bg-white/5">
          <TabsTrigger value="texto" className="data-[state=active]:bg-white/10">
            <TypeIcon className="h-4 w-4 mr-2" /> Texto
          </TabsTrigger>
          <TabsTrigger value="imagem" className="data-[state=active]:bg-white/10">
            <ImageIcon className="h-4 w-4 mr-2" /> Imagem
          </TabsTrigger>
          <TabsTrigger value="video" className="data-[state=active]:bg-white/10">
            <VideoIcon className="h-4 w-4 mr-2" /> Vídeo
          </TabsTrigger>
          <TabsTrigger value="audio" className="data-[state=active]:bg-white/10">
            <Music2 className="h-4 w-4 mr-2" /> Áudio
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white/10">
            <Hash className="h-4 w-4 mr-2" /> Templates
          </TabsTrigger>
        </TabsList>

        {/* ====================== TEXTO ====================== */}
        <TabsContent value="texto" className="mt-4">
          <Card className="bg-white/90">
            <CardHeader className="pb-3">
              <CardTitle>Gerar copy/legendas, headlines e variações</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    preset(
                      "Produto: Tênis casual de couro legítimo, premium.\nPúblico: homens 25-45, classe A/B.\nObjetivo: conversão no e-commerce.\nDiferencial: frete grátis e troca fácil."
                    )
                  }
                >
                  <Wand2 className="h-4 w-4 mr-2" /> Preset: Tênis premium
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    preset(
                      "Serviço: Limpeza residencial completa (Manchester, NH).\nPúblico: famílias e locadores.\nObjetivo: geração de leads via WhatsApp.\nDiferencial: equipe segurada e materiais inclusos."
                    )
                  }
                >
                  <Wand2 className="h-4 w-4 mr-2" /> Preset: Limpeza residencial
                </Button>
              </div>

              {/* Controles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-3">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descreva o produto/oferta, público e objetivo (ex.: conversão, tráfego, alcance)..."
                    className="bg-white text-slate-900 placeholder-slate-500 border-slate-300 focus-visible:ring-slate-900"
                  />
                </div>

                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Tone)}
                  className="rounded-md bg-white text-slate-900 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="direto">Tom: Direto</option>
                  <option value="premium">Tom: Premium</option>
                  <option value="emocional">Tom: Emocional</option>
                  <option value="informativo">Tom: Informativo</option>
                  <option value="conversacional">Tom: Conversacional</option>
                </select>

                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value as Objective)}
                  className="rounded-md bg-white text-slate-900 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="conversao">Objetivo: Conversão</option>
                  <option value="trafego">Objetivo: Tráfego</option>
                  <option value="alcance">Objetivo: Alcance</option>
                  <option value="engajamento">Objetivo: Engajamento</option>
                </select>

                <div className="flex rounded-md overflow-hidden border">
                  <button
                    onClick={() => setMode("structured")}
                    className={`px-3 py-2 text-sm ${
                      mode === "structured" ? "bg-slate-900 text-white" : "bg-white"
                    }`}
                  >
                    Estruturado
                  </button>
                  <button
                    onClick={() => setMode("raw")}
                    className={`px-3 py-2 text-sm ${
                      mode === "raw" ? "bg-slate-900 text-white" : "bg-white"
                    }`}
                  >
                    Texto corrido
                  </button>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button onClick={handleText} disabled={loadingText}>
                  {loadingText ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Gerar texto
                </Button>

                {/* RAW actions */}
{mode === "raw" && rawText ? (
  <>
    <Button variant="secondary" onClick={() => copyToClipboard(rawText)}>
      <Copy className="h-4 w-4 mr-2" /> Copiar
    </Button>
    <Button variant="secondary" onClick={() => downloadTextFile(rawText)}>
      <Download className="h-4 w-4 mr-2" /> Baixar .txt
    </Button>
    <SaveToCampaign
      payload={{
        mode: "raw",
        rawText,
        prompt,
        tone,
        objective,
      }}
    />
  </>
) : null}


                {mode === "structured" && structured ? (
  <>
    <Button
      variant="secondary"
      onClick={() =>
        copyToClipboard(
          [
            `HEADLINE: ${structured.headline ?? ""}`,
            "",
            structured.primaryText ?? "",
            "",
            Array.isArray(structured.bullets) ? `- ${structured.bullets.join("\n- ")}` : "",
            "",
            Array.isArray(structured.ctas) ? `CTAs: ${structured.ctas.join(" | ")}` : "",
          ]
            .join("\n")
            .trim()
        )
      }
    >
      <Copy className="h-4 w-4 mr-2" /> Copiar tudo
    </Button>
    <Button variant="secondary" onClick={() => structured && downloadJson(structured)}>
      <Download className="h-4 w-4 mr-2" /> Baixar .json
    </Button>
    <SaveToCampaign
      payload={{
        mode: "structured",
        structured,
        prompt,
        tone,
        objective,
      }}
      defaultTitle={structured.headline || "Criativo estruturado"}
    />
  </>
) : null}

              </div>

              {/* RESULTADOS */}
              {mode === "raw" && rawText ? (
                <pre className="whitespace-pre-wrap bg-white/60 rounded-lg p-4 border text-sm">{rawText}</pre>
              ) : null}

              {mode === "structured" && structured ? (
                <div className="grid gap-3">
                  {structured.headline ? (
                    <div className="rounded-lg border bg-white p-3">
                      <div className="text-xs uppercase text-slate-500">Headline</div>
                      <div className="text-lg font-semibold text-slate-800">{structured.headline}</div>
                    </div>
                  ) : null}

                  {structured.primaryText ? (
                    <div className="rounded-lg border bg-white p-3">
                      <div className="text-xs uppercase text-slate-500">Texto principal</div>
                      <div className="text-slate-800 whitespace-pre-wrap">{structured.primaryText}</div>
                    </div>
                  ) : null}

                  {Array.isArray(structured.bullets) && structured.bullets.length ? (
                    <div className="rounded-lg border bg-white p-3">
                      <div className="text-xs uppercase text-slate-500">Bullets</div>
                      <ul className="list-disc pl-5 text-slate-800">
                        {structured.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {Array.isArray(structured.ctas) && structured.ctas.length ? (
                    <div className="rounded-lg border bg-white p-3">
                      <div className="text-xs uppercase text-slate-500">CTAs</div>
                      <div className="flex flex-wrap gap-2">
                        {structured.ctas.map((c, i) => (
                          <span key={i} className="rounded-full bg-slate-900 text-white text-xs px-3 py-1">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {structured.variants ? (
                    <div className="rounded-lg border bg-white p-3">
                      <div className="text-xs uppercase text-slate-500">Variações</div>
                      <pre className="whitespace-pre-wrap text-slate-800 text-sm">{JSON.stringify(structured.variants, null, 2)}</pre>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================== IMAGEM ====================== */}
        <TabsContent value="imagem" className="mt-4">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Gerar imagem para anúncio / post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex.: foto de produto no estilo premium, fundo minimalista, iluminação suave..."
                className="bg-white text-slate-900 placeholder-slate-500 border-slate-300 focus-visible:ring-slate-900"
              />

              <div className="flex gap-2">
                <Button onClick={handleImage} disabled={loadingImage}>
                  {loadingImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Gerar imagem
                </Button>
                {imageUrl ? (
                  <Button variant="secondary" onClick={downloadImage}>
                    <Download className="h-4 w-4 mr-2" /> Baixar PNG
                  </Button>
                ) : null}
              </div>

              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Criativo IA" className="max-h-[520px] w-auto rounded-lg border" />
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================== VÍDEO ====================== */}
        <TabsContent value="video" className="mt-4">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Gerar vídeo curto (placeholder .webm)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex.: storyboard simples do vídeo (texto que aparece nas telas)"
                className="bg-white text-slate-900 placeholder-slate-500 border-slate-300 focus-visible:ring-slate-900"
              />

              <div className="flex gap-2">
                <Button onClick={handleVideoPlaceholder} disabled={loadingVideo}>
                  {loadingVideo ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Gerar vídeo
                </Button>
                {videoUrl ? (
                  <Button variant="secondary" onClick={downloadVideo}>
                    <Download className="h-4 w-4 mr-2" /> Baixar WEBM
                  </Button>
                ) : null}
              </div>

              {videoUrl ? (
                <video src={videoUrl} controls className="w-full rounded-lg border" />
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================== ÁUDIO ====================== */}
        <TabsContent value="audio" className="mt-4">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Gerar narração (placeholder .wav)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex.: roteiro curto da fala"
                className="bg-white text-slate-900 placeholder-slate-500 border-slate-300 focus-visible:ring-slate-900"
              />

              <div className="flex gap-2">
                <Button onClick={handleAudioPlaceholder} disabled={loadingAudio}>
                  {loadingAudio ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Gerar áudio
                </Button>
                {audioUrl ? (
                  <Button variant="secondary" onClick={downloadAudio}>
                    <Download className="h-4 w-4 mr-2" /> Baixar WAV
                  </Button>
                ) : null}
              </div>

              {audioUrl ? (
                <audio controls src={audioUrl} className="w-full" />
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================== TEMPLATES ====================== */}
        <TabsContent value="templates" className="mt-4">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle>Templates prontos + hashtags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Templates */}
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Modelos rápidos</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((t, idx) => (
                    <div key={idx} className="rounded-lg border p-3 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-slate-800 font-medium">{t.tag}</div>
                        <Button size="sm" variant="secondary" onClick={() => copyToClipboard(t.text)}>
                          <Copy className="h-4 w-4 mr-2" /> Copiar
                        </Button>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap text-slate-700">{t.text}</pre>
                      <div className="mt-2">
                        <Button size="sm" onClick={() => preset(t.text)}>
                          <Wand2 className="h-4 w-4 mr-2" /> Usar no prompt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Hashtags</div>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => preset(h)}
                      className="px-3 py-1 rounded-full border bg-white hover:bg-slate-50 text-sm"
                      title="Adicionar ao prompt"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status do prompt atual */}
              <div className="rounded-lg border bg-slate-50 p-3 text-slate-700">
                <div className="text-xs uppercase tracking-wide text-slate-500">Prompt atual</div>
                <div className="mt-1 whitespace-pre-wrap">{prompt || "—"}</div>
                {prompt ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => copyToClipboard(prompt)}>
                      <Copy className="h-4 w-4 mr-2" /> Copiar prompt
                    </Button>
                    <Button size="sm" onClick={() => setPrompt("")}>Limpar</Button>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> pronto para usar</span>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

// ==========================================================
// Utilidades – geração de WEBM (canvas) e WAV (seno)
// ==========================================================

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function generateCanvasWebm({ text }: { text: string }) {
  // cria um canvas temporário e desenha alguns quadros com animação simples
  const canvas = document.createElement("canvas");
  const size = 640;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // stream de vídeo do canvas
  const stream = (canvas as HTMLCanvasElement).captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

  const drawFrame = (t: number) => {
    // fundo gradiente animado
    const p = (Math.sin(t / 400) + 1) / 2;
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, `hsl(${220 + p * 40}, 60%, 14%)`);
    g.addColorStop(1, `hsl(${210 + p * 30}, 50%, 24%)`);
    ctx.fillStyle = g as any;
    ctx.fillRect(0, 0, size, size);

    // título
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text.slice(0, 18) || "Strattia", size / 2, size / 2 - 10);

    // legenda pulsante
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("(placeholder)", size / 2, size / 2 + 24);
  };

  let start = 0;
  let elapsed = 0;
  const duration = 1600; // ms

  const raf = (ts: number) => {
    if (!start) start = ts;
    elapsed = ts - start;
    drawFrame(elapsed);
    if (elapsed < duration) requestAnimationFrame(raf);
  };

  recorder.start();
  requestAnimationFrame(raf);

  await new Promise<void>((resolve) => setTimeout(resolve, duration + 120));
  recorder.stop();

  const blob: Blob = await new Promise((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
  });

  const url = URL.createObjectURL(blob);
  return { url, blob };
}

function createSineWav(seconds = 1.5, sampleRate = 44100) {
  const totalSamples = Math.floor(seconds * sampleRate);
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 is PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // PCM data (sine sweep)
  let offset = 44;
  const maxAmp = 32760; // 16-bit max
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const f = 220 + (880 - 220) * (i / totalSamples); // sweep 220Hz->880Hz
    const sample = Math.sin(2 * Math.PI * f * t);
    view.setInt16(offset, Math.floor(sample * maxAmp), true);
    offset += 2;
  }

  return buffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
