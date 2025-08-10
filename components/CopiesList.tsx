"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeCopies, removeCopy, updateCopy } from "@/lib/firebase/copies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Download, Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";

type Props = { campaignId: string };

export default function CopiesList({ campaignId }: Props) {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // editor
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [bullets, setBullets] = useState("");
  const [ctas, setCtas] = useState("");

  useEffect(() => {
    const unsub = subscribeCopies(campaignId, (docs) => {
      setItems(docs);
      setLoading(false);
    });
    return () => unsub();
  }, [campaignId]);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado para a área de transferência" });
  }
  function downloadTxt(text: string, name = "copy.txt") {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }
  function downloadJson(obj: any, name = "copy.json") {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este criativo?")) return;
    try {
      await removeCopy(campaignId, id);
      toast({ title: "Excluído" });
    } catch (e: any) {
      toast({
        title: "Erro ao excluir",
        description: String(e?.message || e),
        variant: "destructive",
      });
    }
  }

  function openEdit(it: any) {
    setEditing(it);
    setTitle(it.title || "");
    if (it.mode === "raw") {
      setRawText(it.rawText || "");
    } else {
      setHeadline(it.structured?.headline || "");
      setPrimaryText(it.structured?.primaryText || "");
      setBullets((it.structured?.bullets || []).join("\n"));
      setCtas((it.structured?.ctas || []).join("\n"));
    }
    setOpen(true);
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      if (editing.mode === "raw") {
        await updateCopy(campaignId, editing.id, {
          title,
          mode: "raw",
          rawText,
        });
      } else {
        await updateCopy(campaignId, editing.id, {
          title,
          mode: "structured",
          structured: {
            headline,
            primaryText,
            bullets: bullets
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            ctas: ctas
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          },
        });
      }
      toast({ title: "Alterações salvas" });
      setOpen(false);
    } catch (e: any) {
      toast({
        title: "Erro ao salvar",
        description: String(e?.message || e),
        variant: "destructive",
      });
    }
  }

  const empty = !loading && items.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Copies salvas ({items.length})
        </h2>
      </div>

      {loading ? (
        <div className="text-zinc-300/80">Carregando…</div>
      ) : empty ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-zinc-300/80">
          Nenhuma copy salva ainda. Gere em <b>Criativos IA</b> e clique
          “Salvar na campanha”.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((it) => (
            <Card key={it.id} className="bg-white/90">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-900 text-base">
                  {it.title || "Criativo IA"}
                </CardTitle>
                <div className="text-xs text-slate-500">
                  {it.mode?.toUpperCase?.()} •{" "}
                  {it.createdAt?.toDate
                    ? it.createdAt.toDate().toLocaleString()
                    : ""}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {it.mode === "raw" && it.rawText ? (
                  <pre className="whitespace-pre-wrap text-sm bg-white rounded border p-3 text-slate-800">
                    {it.rawText}
                  </pre>
                ) : it.structured ? (
                  <div className="space-y-2">
                    {it.structured.headline ? (
                      <div>
                        <div className="text-xs uppercase text-slate-500">
                          Headline
                        </div>
                        <div className="font-semibold text-slate-800">
                          {it.structured.headline}
                        </div>
                      </div>
                    ) : null}
                    {it.structured.primaryText ? (
                      <div>
                        <div className="text-xs uppercase text-slate-500">
                          Texto
                        </div>
                        <div className="text-slate-800 whitespace-pre-wrap">
                          {it.structured.primaryText}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-1">
                  {it.mode === "raw" && it.rawText ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => copyText(it.rawText)}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copiar
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => downloadTxt(it.rawText, "copy.txt")}
                      >
                        <Download className="h-4 w-4 mr-2" /> Baixar .txt
                      </Button>
                    </>
                  ) : it.structured ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const text = [
                            `HEADLINE: ${it.structured.headline ?? ""}`,
                            "",
                            it.structured.primaryText ?? "",
                          ]
                            .join("\n")
                            .trim();
                          copyText(text);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copiar tudo
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => downloadJson(it.structured, "copy.json")}
                      >
                        <Download className="h-4 w-4 mr-2" /> Baixar .json
                      </Button>
                    </>
                  ) : null}

                  <Button variant="outline" onClick={() => openEdit(it)}>
                    <Pencil className="h-4 w-4 mr-2" /> Editar
                  </Button>

                  <Button variant="destructive" onClick={() => handleDelete(it.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de edição */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar copy</DialogTitle>
          </DialogHeader>

          {editing?.mode === "raw" ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-600 mb-1">Título</div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Texto</div>
                <Textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="bg-white text-slate-900"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              <div>
                <div className="text-sm text-slate-600 mb-1">Título</div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Headline</div>
                <Input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Texto principal</div>
                <Textarea
                  value={primaryText}
                  onChange={(e) => setPrimaryText(e.target.value)}
                  className="bg-white text-slate-900"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-slate-600 mb-1">
                    Bullets (1 por linha)
                  </div>
                  <Textarea
                    value={bullets}
                    onChange={(e) => setBullets(e.target.value)}
                    className="bg-white text-slate-900"
                  />
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">
                    CTAs (1 por linha)
                  </div>
                  <Textarea
                    value={ctas}
                    onChange={(e) => setCtas(e.target.value)}
                    className="bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={saveEdit}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
