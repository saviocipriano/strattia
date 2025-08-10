"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  PauseCircle,
  XCircle,
  BarChart4,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CampanhaDetalhePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [campanha, setCampanha] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const docRef = doc(db, "campanhas", id);
      const snap = await getDoc(docRef);
      setCampanha(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    await deleteDoc(doc(db, "campanhas", id));
    setDeleting(false);
    router.push("/dashboard/campanhas");
  }

  function handleEdit() {
    router.push(`/dashboard/campanhas/${id}/editar`);
  }

  function handleDuplicate() {
    alert("Funcionalidade de duplicar campanha em breve!");
  }

  // Badge para status
  function getStatusBadge(status: string) {
    switch (status?.toLowerCase()) {
      case "ativo":
      case "ativa":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Ativo
          </Badge>
        );
      case "pausado":
      case "pausada":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-400 flex items-center gap-1">
            <PauseCircle className="w-4 h-4" /> Pausado
          </Badge>
        );
      case "finalizado":
      case "finalizada":
        return (
          <Badge className="bg-gray-200 text-gray-700 border-gray-400 flex items-center gap-1">
            <XCircle className="w-4 h-4" /> Finalizado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground border-muted-foreground">
            Desconhecido
          </Badge>
        );
    }
  }

  // MOCK DE DADOS DE ANALYTICS (pode ajustar depois para dados reais)
  const analyticsData = [
    { dia: "Seg", impressoes: 2500, cliques: 120, conversoes: 10 },
    { dia: "Ter", impressoes: 3200, cliques: 160, conversoes: 15 },
    { dia: "Qua", impressoes: 4100, cliques: 180, conversoes: 16 },
    { dia: "Qui", impressoes: 3800, cliques: 140, conversoes: 13 },
    { dia: "Sex", impressoes: 5400, cliques: 220, conversoes: 20 },
    { dia: "Sáb", impressoes: 2000, cliques: 95, conversoes: 8 },
    { dia: "Dom", impressoes: 3100, cliques: 150, conversoes: 11 },
  ];

  // Mock logs de IA
  const logs = [
    {
      data: "2025-07-14 10:34",
      acao: "IA ajustou orçamento diário para melhorar performance.",
    },
    {
      data: "2025-07-13 17:22",
      acao: "Campanha pausada por saldo insuficiente.",
    },
    {
      data: "2025-07-13 08:19",
      acao: "Campanha ativada automaticamente pela IA.",
    },
    {
      data: "2025-07-12 22:03",
      acao: "Nova copy gerada e aplicada no anúncio 2.",
    },
    {
      data: "2025-07-12 15:27",
      acao: "IA otimizou público-alvo com base nos últimos resultados.",
    },
  ];

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500 mb-4" />
        <span className="text-xl text-muted-foreground">
          Carregando campanha...
        </span>
      </div>
    );

  if (!campanha)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <XCircle className="w-10 h-10 text-red-500 mb-4" />
        <span className="text-xl text-muted-foreground">
          Campanha não encontrada.
        </span>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <Card className="p-6 shadow-2xl rounded-2xl bg-white/80 backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-blue-800">
              {campanha.nome || "Campanha sem nome"}
            </h1>
            <div className="flex gap-2 mb-3">{getStatusBadge(campanha.status)}</div>
            <p className="text-muted-foreground mb-2">
              <span className="font-medium text-blue-700">ID:</span> {campanha.id}
            </p>
            <p className="text-muted-foreground mb-2">
              <span className="font-medium text-blue-700">Criada em:</span>{" "}
              {campanha.createdAt
                ? new Date(campanha.createdAt.seconds * 1000).toLocaleString("pt-BR")
                : "Data não informada"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 w-4 h-4" /> Editar
            </Button>
            <Button variant="secondary" onClick={handleDuplicate}>
              <Copy className="mr-2 w-4 h-4" /> Duplicar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Trash2 className="mr-2 w-4 h-4" />
              )}
              Deletar
            </Button>
          </div>
        </div>

        <div className="border-t mt-6 pt-6 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold text-lg text-blue-700 mb-2">
              Informações da Campanha
            </h2>
            <ul className="space-y-2 text-base">
              <li>
                <span className="font-medium">Objetivo:</span> {campanha.objetivo || "N/A"}
              </li>
              <li>
                <span className="font-medium">Orçamento Diário:</span> R$ {campanha.orcamentoDiario ?? campanha.orcamento ?? "0,00"}
              </li>
              <li>
                <span className="font-medium">Orçamento Total:</span> R$ {campanha.orcamentoTotal ?? "-"}
              </li>
              <li>
                <span className="font-medium">Plataforma:</span> {campanha.plataforma || "Meta"}
              </li>
              <li>
                <span className="font-medium">Status:</span> {campanha.status}
              </li>
              <li>
                <span className="font-medium">Última modificação:</span>{" "}
                {campanha.updatedAt
                  ? new Date(campanha.updatedAt.seconds * 1000).toLocaleString("pt-BR")
                  : "-"}
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-blue-700 mb-2 flex items-center gap-2">
              <BarChart4 className="w-5 h-5" /> Analytics <span className="ml-1 text-xs font-normal text-blue-400">(demo)</span>
            </h2>
            <div className="h-60 bg-blue-50/30 rounded-lg mb-4 px-4 py-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" stroke="#2563eb" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="impressoes" stroke="#2563eb" strokeWidth={2} name="Impressões" />
                  <Line type="monotone" dataKey="cliques" stroke="#eab308" strokeWidth={2} name="Cliques" />
                  <Line type="monotone" dataKey="conversoes" stroke="#22c55e" strokeWidth={2} name="Conversões" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <h2 className="font-semibold text-lg text-blue-700 mb-2">
              Log de Ações da IA
            </h2>
            <ul className="space-y-2 text-sm">
              {logs.map((log, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">{log.data}</Badge>
                  <span>{log.acao}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
