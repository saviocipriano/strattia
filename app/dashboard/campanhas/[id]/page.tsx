"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { db, storage, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

import {
  Loader2,
  Play,
  Pause,
  Pencil,
  Copy,
  Download,
  Share2,
  UploadCloud,
  Plus,
  BarChart3,
  PieChart as PieIcon,
  FileText,
  BookmarkPlus,
  Info,
  ImageIcon,
  CheckCircle2,
  Wand2,
} from "lucide-react";
import CopiesList from "@/components/CopiesList";

// --------------------
// Types
// --------------------

type Campaign = {
  id: string;
  title: string;
  status: "active" | "paused" | "draft" | "ended";
  objective?: string;
  budget?: number; // daily budget
  totalSpend?: number;
  revenue?: number;
  startDate?: string; // ISO
  endDate?: string; // ISO
  platform?: "meta" | "google" | "ttads" | "linkedin" | "other";
  audience?: string;
  creatives?: string[]; // URLs
  metrics?: {
    impressions?: number;
    clicks?: number;
    ctr?: number; // %
    cpc?: number; // currency
    cpa?: number; // currency
    conversions?: number;
    roi?: number; // %
  };
  // optional time series data
  insightSeries?: Array<{
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions?: number;
  }>;
};

type Note = {
  id: string;
  message: string;
  createdAt?: any;
  author?: string;
};

// Palette
const BG_GRADIENT =
  "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800";
const CARD_BG =
  "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80";
const CARD_DARK_BG =
  "bg-slate-800/70 text-slate-50 backdrop-blur supports-[backdrop-filter]:bg-slate-800/60";

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const id = (params?.id as string) || "";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --------------------
  // Effects: Load campaign + notes
  // --------------------
  useEffect(() => {
    if (!id) return;

    const ref = doc(db, "campaigns", id);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Campaign;
        setCampaign(data);
        if (!titleDraft) setTitleDraft(data.title);
      }
      setLoading(false);
    });

    const notesQ = query(
      collection(db, "campaigns", id, "notes"),
      orderBy("createdAt", "desc")
    );
    const unsubNotes = onSnapshot(notesQ, (snap) => {
      const list: Note[] = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as any) }));
      setNotes(list);
    });

    return () => {
      unsub();
      unsubNotes();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Safe derived data
  const summary = useMemo(() => {
    const m = campaign?.metrics || {};
    const impressions = m.impressions ?? 0;
    const clicks = m.clicks ?? 0;
    const spend = campaign?.totalSpend ?? 0;
    const revenue = campaign?.revenue ?? 0;
    const ctr = m.ctr ?? (impressions ? (clicks / impressions) * 100 : 0);
    const cpc = m.cpc ?? (clicks ? spend / clicks : 0);
    const cpa = m.cpa ?? 0;
    const conversions = m.conversions ?? 0;
    const roi = m.roi ?? (spend ? ((revenue - spend) / spend) * 100 : 0);
    return { impressions, clicks, spend, revenue, ctr, cpc, cpa, conversions, roi };
  }, [campaign]);

  const lineData = useMemo(() => {
    if (campaign?.insightSeries?.length) return campaign.insightSeries;
    // fallback: gera 14 dias fictícios
    const days = 14;
    const baseImp = Math.max(1000, summary.impressions / days || 1500);
    const baseClicks = Math.max(30, summary.clicks / days || 40);
    const baseSpend = Math.max(20, summary.spend / days || 30);
    const out: any[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      out.push({
        date: d.toLocaleDateString(),
        impressions: Math.round(baseImp * (0.8 + Math.random() * 0.4)),
        clicks: Math.round(baseClicks * (0.8 + Math.random() * 0.5)),
        spend: Number((baseSpend * (0.8 + Math.random() * 0.5)).toFixed(2)),
      });
    }
    return out;
  }, [campaign, summary]);

  const pieData = useMemo(() => {
    const platform = campaign?.platform || "meta";
    const dist = [
      { name: "Criativos", value: Math.max(10, (summary.spend || 100) * 0.35) },
      { name: `Mídia (${platform})`, value: Math.max(10, (summary.spend || 100) * 0.5) },
      { name: "Ferramentas/IA", value: Math.max(5, (summary.spend || 100) * 0.15) },
    ];
    return dist.map((d) => ({ ...d, value: Number(d.value.toFixed(2)) }));
  }, [campaign, summary]);

  // --------------------
  // Actions
  // --------------------
  async function toggleStatus() {
    if (!campaign) return;
    try {
      setSaving(true);
      const newStatus = campaign.status === "active" ? "paused" : "active";
      await updateDoc(doc(db, "campaigns", campaign.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      toast({ title: `Campanha ${newStatus === "active" ? "ativada" : "pausada"}.` });
    } catch (e: any) {
      toast({ title: "Erro ao alterar status", description: String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function saveTitle() {
    if (!campaign) return;
    try {
      if (!titleDraft.trim()) return;
      setSaving(true);
      await updateDoc(doc(db, "campaigns", campaign.id), {
        title: titleDraft.trim(),
        updatedAt: serverTimestamp(),
      });
      setIsEditingTitle(false);
      toast({ title: "Título atualizado" });
    } catch (e: any) {
      toast({ title: "Erro ao salvar título", description: String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function addNote() {
    if (!campaign) return;
    if (!noteInput.trim()) return;
    try {
      const ref = collection(db, "campaigns", campaign.id, "notes");
      await addDoc(ref, {
        message: noteInput.trim(),
        createdAt: serverTimestamp(),
        author: auth?.currentUser?.email || "user",
      });
      setNoteInput("");
    } catch (e: any) {
      toast({ title: "Erro ao adicionar nota", description: String(e), variant: "destructive" });
    }
  }

  async function handleUploadCreative(file: File) {
    if (!campaign) return;
    try {
      setSaving(true);
      const path = `campaigns/${campaign.id}/creatives/${Date.now()}-${file.name}`;
      const ref = storageRef(storage, path);
      const snap = await uploadBytes(ref, file);
      const url = await getDownloadURL(snap.ref);
      const current = Array.isArray(campaign.creatives) ? campaign.creatives : [];
      await updateDoc(doc(db, "campaigns", campaign.id), {
        creatives: [...current, url],
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Criativo enviado" });
    } catch (e: any) {
      toast({ title: "Erro no upload", description: String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function exportCsv() {
    if (!campaign) return;
    const rows = [
      ["date", "impressions", "clicks", "spend", "conversions"],
      ...lineData.map((d) => [d.date, d.impressions, d.clicks, d.spend, d.conversions ?? 0]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaign.title || "campanha"}-relatorio.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function duplicateCampaign() {
    if (!campaign) return;
    try {
      setSaving(true);
      const baseRef = doc(db, "campaigns", campaign.id);
      const baseSnap = await getDoc(baseRef);
      if (!baseSnap.exists()) return;
      const data = baseSnap.data();
      const newRef = await addDoc(collection(db, "campaigns"), {
        ...data,
        title: `${data.title || "Campanha"} (Cópia)`,
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as any);
      toast({ title: "Campanha duplicada" });
      router.push(`/dashboard/campanhas/${newRef.id}`);
    } catch (e: any) {
      toast({ title: "Erro ao duplicar", description: String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function copyShareLink() {
    const link = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(link);
    toast({ title: "Link copiado" });
  }

  // Colors for Pie slices
  const pieColors = ["#64748b", "#2563eb", "#0ea5e9", "#22c55e", "#f59e0b"];

  if (loading) {
    return (
      <main className={`min-h-[calc(100vh-64px)] ${BG_GRADIENT} text-white p-6`}>
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-slate-200">
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando campanha...
        </div>
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className={`min-h-[calc(100vh-64px)] ${BG_GRADIENT} text-white p-6`}>
        <div className="max-w-7xl mx-auto">
          <Card className={`${CARD_DARK_BG} border border-slate-700`}>
            <CardContent className="p-8">
              <p className="text-lg">Campanha não encontrada.</p>
              <div className="mt-4">
                <Button variant="secondary" onClick={() => router.push("/dashboard/campanhas")}>
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-[calc(100vh-64px)] ${BG_GRADIENT} text-slate-50 pb-14`}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {campaign.platform?.toUpperCase() || "META"}
            </Badge>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <Input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="w-[320px] bg-white/90"
                />
                <Button size="sm" onClick={saveTitle} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  <span className="ml-2">Salvar</span>
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsEditingTitle(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {campaign.title}
              </h1>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                campaign.status === "active"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : campaign.status === "paused"
                  ? "bg-amber-500 hover:bg-amber-600"
                  : campaign.status === "ended"
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-slate-500 hover:bg-slate-600"
              }
            >
              {campaign.status.toUpperCase()}
            </Badge>
            <Button size="sm" variant="secondary" onClick={() => setIsEditingTitle(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button size="sm" onClick={toggleStatus} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : campaign.status === "active" ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {campaign.status === "active" ? "Pausar" : "Ativar"}
            </Button>
            <Button size="sm" variant="secondary" onClick={duplicateCampaign}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </Button>
            <Button size="sm" variant="secondary" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" variant="secondary" onClick={copyShareLink}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </motion.div>

        <Separator className="my-6 bg-slate-700/60" />

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Impressões" value={summary.impressions.toLocaleString()} icon={<BarChart3 className="h-5 w-5" />} />
          <KpiCard title="Cliques" value={summary.clicks.toLocaleString()} icon={<BarChart3 className="h-5 w-5" />} />
          <KpiCard title="CTR" value={`${summary.ctr.toFixed(2)}%`} icon={<Info className="h-5 w-5" />} />
          <KpiCard title="CPC" value={`R$ ${summary.cpc.toFixed(2)}`} icon={<Info className="h-5 w-5" />} />
          <KpiCard title="CPA" value={`R$ ${summary.cpa.toFixed(2)}`} icon={<Info className="h-5 w-5" />} />
          <KpiCard title="Conversões" value={`${summary.conversions}`} icon={<BookmarkPlus className="h-5 w-5" />} />
          <KpiCard title="Gastos" value={`R$ ${summary.spend.toFixed(2)}`} icon={<FileText className="h-5 w-5" />} />
          <KpiCard title="ROI" value={`${summary.roi.toFixed(2)}%`} icon={<PieIcon className="h-5 w-5" />} />
        </div>

        {/* Charts + Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm lg:col-span-2`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-800">Evolução diária</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="impressions" stroke="#94a3b8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="spend" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-800">Distribuição de orçamento</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={pieData} nameKey="name" outerRadius={100} innerRadius={54}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 text-sm text-slate-600">
                Valores baseados em gastos totais. Ajuste no editor para refinar categorias.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Dados / Copies / Criativos / Notas */}
        <Tabs defaultValue="dados" className="mt-8">
          <TabsList className="bg-slate-800/60">
            <TabsTrigger value="dados">Dados & Configurações</TabsTrigger>
            <TabsTrigger value="copies">Copies</TabsTrigger>
            <TabsTrigger value="criativos">Criativos</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>

          {/* Dados */}
          <TabsContent value="dados" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm lg:col-span-2`}>
                <CardHeader>
                  <CardTitle className="text-slate-800">Informações da campanha</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Objetivo" value={campaign.objective || "—"} />
                  <Field label="Público" value={campaign.audience || "—"} />
                  <Field
                    label="Orçamento diário"
                    value={campaign.budget ? `R$ ${campaign.budget.toFixed(2)}` : "—"}
                  />
                  <Field
                    label="Início"
                    value={campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "—"}
                  />
                  <Field
                    label="Fim"
                    value={campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "—"}
                  />
                  <Field label="Plataforma" value={(campaign.platform || "meta").toUpperCase()} />
                </CardContent>
              </Card>

              <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm`}>
                <CardHeader>
                  <CardTitle className="text-slate-800">Ações rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" onClick={toggleStatus} disabled={saving}>
                    {campaign.status === "active" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {campaign.status === "active" ? "Pausar campanha" : "Ativar campanha"}
                  </Button>
                  <Button className="w-full" variant="secondary" onClick={duplicateCampaign}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button className="w-full" variant="secondary" onClick={exportCsv}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                  <Button className="w-full" variant="secondary" onClick={copyShareLink}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Copiar link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Copies */}
          <TabsContent value="copies" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold text-white">📝 Copies da campanha</h3>
              <Button onClick={() => (window.location.href = "/dashboard/criativos-ia")}>
                <Wand2 className="h-4 w-4 mr-2" />
                Gerar nova copy com IA
              </Button>
            </div>
            <CopiesList campaignId={id} />
          </TabsContent>

          {/* Criativos */}
          <TabsContent value="criativos" className="mt-4">
            <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm`}>
              <CardHeader>
                <CardTitle className="text-slate-800">Biblioteca de criativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Input
                    ref={fileInputRef as any}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadCreative(file);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Enviar criativo
                  </Button>
                </div>

                {campaign.creatives?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {campaign.creatives.map((url, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-slate-200/70 bg-white">
                        {url.match(/\.(mp4|mov|webm)$/i) ? (
                          <video src={url} controls className="w-full h-36 object-cover" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt={`creative-${i}`} className="w-full h-36 object-cover" />
                        )}
                        <div className="p-2 text-xs text-slate-600 truncate">
                          {url.split("?")[0].split("/").pop()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <ImageIcon className="h-8 w-8 mb-2" />
                    Nenhum criativo enviado ainda.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notas */}
          <TabsContent value="notas" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm lg:col-span-2`}>
                <CardHeader>
                  <CardTitle className="text-slate-800">Notas da equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  {notes.length ? (
                    <ul className="space-y-3">
                      {notes.map((n) => (
                        <li key={n.id} className="rounded-xl border border-slate-200/70 p-3 bg-white/90">
                          <div className="text-sm text-slate-700">{n.message}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {n.author || "—"} •{" "}
                            {n.createdAt?.toDate
                              ? new Date(n.createdAt.toDate()).toLocaleString()
                              : "recente"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-slate-500">Sem notas ainda.</div>
                  )}
                </CardContent>
              </Card>

              <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm`}>
                <CardHeader>
                  <CardTitle className="text-slate-800">Adicionar nota</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Escreva uma observação para a equipe..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="bg-white/90"
                  />
                  <div className="mt-3 flex items-center gap-2">
                    <Button onClick={addNote}>
                      <Plus className="h-4 w-4 mr-2" />
                      Salvar nota
                    </Button>
                    <Button variant="secondary" onClick={() => setNoteInput("")}>
                      Limpar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

// --------------------
// Components
// --------------------
function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className={`${CARD_BG} border border-slate-200/60 shadow-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500">{title}</div>
              <div className="text-2xl font-semibold text-slate-800 mt-1">{value}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-slate-800 font-medium mt-1">{value}</div>
    </div>
  );
}
