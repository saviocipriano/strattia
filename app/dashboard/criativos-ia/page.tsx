"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Loader2,
  ImageIcon,
  VideoIcon,
  TypeIcon,
  Copy,
  Download,
} from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "sonner";

export default function CriativosIaPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [textResult, setTextResult] = useState<string | null>(null);

  const handleTextGeneration = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTextResult(null);
    try {
      const res = await fetch("/api/ia-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setTextResult(data.result);
      } else {
        toast.error(data.error || "Erro ao gerar texto");
      }
    } catch (err) {
      toast.error("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Gerador de Criativos com IA
      </h1>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="image">
            <ImageIcon className="mr-2 h-4 w-4" /> Imagem
          </TabsTrigger>
          <TabsTrigger value="video">
            <VideoIcon className="mr-2 h-4 w-4" /> Vídeo
          </TabsTrigger>
          <TabsTrigger value="text">
            <TypeIcon className="mr-2 h-4 w-4" /> Texto
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">
                Gerar Texto Publicitário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Ex: Anúncio para loja de roupas femininas..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-zinc-800 text-white"
              />
              <Button onClick={handleTextGeneration} disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Gerar Texto
              </Button>
              {textResult && (
                <div className="mt-4 space-y-2">
                  <Textarea
                    readOnly
                    value={textResult}
                    className="bg-zinc-800 text-white h-48"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(textResult);
                      toast.success("Texto copiado!");
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" /> Copiar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Em breve: Geração de Imagem</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              A funcionalidade de imagem será disponibilizada em breve.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Em breve: Geração de Vídeo</CardTitle>
            </CardHeader>
            <CardContent className="text-zinc-400">
              A funcionalidade de vídeo será disponibilizada em breve.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
