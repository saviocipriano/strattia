"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, BarChart4, AlertTriangle, Loader2, Users2, DollarSign, Target } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [campanhas, setCampanhas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCampanhas() {
      setLoading(true);
      const snap = await getDocs(collection(db, "campanhas"));
      const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampanhas(arr);
      setLoading(false);
    }
    fetchCampanhas();
  }, []);

  // Mock de analytics globais (você pode puxar do Firestore depois)
  const analyticsData = [
    { dia: "01/07", impress: 2500, clicks: 120, conv: 10 },
    { dia: "04/07", impress: 3700, clicks: 190, conv: 17 },
    { dia: "07/07", impress: 4500, clicks: 270, conv: 22 },
    { dia: "10/07", impress: 5900, clicks: 320, conv: 30 },
    { dia: "13/07", impress: 5200, clicks: 310, conv: 29 },
    { dia: "16/07", impress: 6000, clicks: 380, conv: 35 },
  ];

  // Cálculos de totais
  const totalCampanhas = campanhas.length;
  const ativas = campanhas.filter(c => (c.status || "").toLowerCase() === "ativo" || c.status?.toLowerCase() === "ativa").length;
  const pausadas = campanhas.filter(c => (c.status || "").toLowerCase() === "pausado" || c.status?.toLowerCase() === "pausada").length;
  const finalizadas = campanhas.filter(c => (c.status || "").toLowerCase() === "finalizado" || c.status?.toLowerCase() === "finalizada").length;

  const totalOrcamento = campanhas.reduce((acc, c) => acc + (Number(c.orcamentoTotal) || 0), 0);
  const totalImpress = campanhas.reduce((acc, c) => acc + (Number(c.impressoes) || 0), 0);
  const totalClicks = campanhas.reduce((acc, c) => acc + (Number(c.cliques) || 0), 0);
  const totalConv = campanhas.reduce((acc, c) => acc + (Number(c.conversoes) || 0), 0);

  // Mock de insights da IA
  const iaAlerts = [
    {
      tipo: "warning",
      msg: "3 campanhas com orçamento quase esgotado. Considere revisar os valores!",
      data: "2025-07-15 08:17",
    },
    {
      tipo: "info",
      msg: "IA otimizou públicos em 5 campanhas nos últimos 7 dias.",
      data: "2025-07-13 21:44",
    },
    {
      tipo: "success",
      msg: "Campanha 'Promoção Agro' atingiu 1.000 conversões!",
      data: "2025-07-12 10:12",
    },
  ];

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500 mb-4" />
        <span className="text-xl text-muted-foreground">Carregando dados...</span>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 py-10 space-y-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3 text-blue-100">
        <Rocket className="w-7 h-7 text-blue-400" /> Visão Geral da Plataforma
      </h1>
      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl p-6 flex flex-col gap-2 bg-blue-950/50 border-blue-900">
          <span className="text-blue-300 font-medium flex items-center gap-2 text-lg">
            <Target className="w-5 h-5" /> Campanhas Totais
          </span>
          <span className="text-3xl font-bold text-blue-100">{totalCampanhas}</span>
        </Card>
        <Card className="rounded-2xl p-6 flex flex-col gap-2 bg-green-950/40 border-green-900">
          <span className="text-green-400 font-medium flex items-center gap-2 text-lg">
            <BarChart4 className="w-5 h-5" /> Ativas / Pausadas / Finalizadas
          </span>
          <span className="text-2xl font-bold text-green-100">{ativas} <span className="text-xs text-zinc-300">/</span> {pausadas} <span className="text-xs text-zinc-300">/</span> {finalizadas}</span>
        </Card>
        <Card className="rounded-2xl p-6 flex flex-col gap-2 bg-yellow-900/40 border-yellow-800">
          <span className="text-yellow-400 font-medium flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5" /> Orçamento Total
          </span>
          <span className="text-2xl font-bold text-yellow-100">R$ {totalOrcamento.toLocaleString("pt-BR")}</span>
        </Card>
        <Card className="rounded-2xl p-6 flex flex-col gap-2 bg-indigo-950/40 border-indigo-900">
          <span className="text-indigo-300 font-medium flex items-center gap-2 text-lg">
            <Users2 className="w-5 h-5" /> Impressões / Cliques / Conversões
          </span>
          <span className="text-lg font-bold text-indigo-100">
            {totalImpress.toLocaleString("pt-BR")} <span className="text-xs text-zinc-300">/</span> {totalClicks.toLocaleString("pt-BR")} <span className="text-xs text-zinc-300">/</span> {totalConv.toLocaleString("pt-BR")}
          </span>
        </Card>
      </div>

      {/* Gráfico Geral */}
      <Card className="rounded-2xl mt-8 p-8 bg-white/5 border-blue-900 shadow-lg">
        <h2 className="text-xl font-semibold text-blue-200 mb-4 flex items-center gap-2">
          <BarChart4 className="w-5 h-5" /> Evolução Geral das Campanhas
        </h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" stroke="#2563eb" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="impress" stroke="#2563eb" strokeWidth={2} name="Impressões" />
              <Line type="monotone" dataKey="clicks" stroke="#eab308" strokeWidth={2} name="Cliques" />
              <Line type="monotone" dataKey="conv" stroke="#22c55e" strokeWidth={2} name="Conversões" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Avisos da IA / Insights */}
      <Card className="rounded-2xl mt-8 p-6 bg-white/10 border-blue-900 shadow">
        <h2 className="text-lg font-semibold text-blue-200 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" /> Insights e Alertas da IA
        </h2>
        <ul className="space-y-3">
          {iaAlerts.map((alert, i) => (
            <li key={i} className="flex items-center gap-3">
              <Badge
                className={`rounded px-3 py-1 ${
                  alert.tipo === "warning"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                    : alert.tipo === "success"
                    ? "bg-green-100 text-green-700 border-green-400"
                    : "bg-blue-100 text-blue-700 border-blue-400"
                }`}
              >
                {alert.tipo.toUpperCase()}
              </Badge>
              <span className="text-blue-100">{alert.msg}</span>
              <span className="ml-auto text-xs text-zinc-400">{alert.data}</span>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}
