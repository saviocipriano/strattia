"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bot, CheckCircle2, AlertTriangle, BarChart4, Zap, XCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SugestaoIA = {
  id: string;
  campanha: string;
  acao: string;
  status: "pendente" | "aprovada" | "rejeitada";
  motivo?: string;
  data: string;
};

const fallback: SugestaoIA[] = [
  {
    id: "1",
    campanha: "Campanha - Loja Amanda",
    acao: "Aumentar orçamento diário de R$ 50 para R$ 80 (CPC baixo e conversão subindo)",
    status: "pendente",
    data: "16/07/2025 09:10",
  },
  {
    id: "2",
    campanha: "Campanha - Agro XP",
    acao: "Pausar anúncio 2: baixo CTR e alto custo",
    status: "pendente",
    data: "16/07/2025 09:05",
  },
];

const logsIA = [
  {
    data: "16/07/2025 09:10",
    acao: "IA sugeriu aumento de orçamento para campanha Loja Amanda.",
  },
  {
    data: "16/07/2025 09:05",
    acao: "IA sugeriu pausar anúncio ruim em Agro XP.",
  },
  {
    data: "15/07/2025 17:40",
    acao: "Criativo de Super Teste trocado por sugestão da IA.",
  },
  {
    data: "15/07/2025 12:18",
    acao: "IA sugeriu expandir público lookalike em Cursos Online (rejeitada pelo usuário).",
  },
];

export default function IATrafegoPage() {
  const [sugestoes, setSugestoes] = useState<SugestaoIA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFromFirestore() {
      try {
        const q = query(collection(db, "iaTrafegoSugestoes"), orderBy("data", "desc"));
        const snap = await getDocs(q);
        const arr: SugestaoIA[] = snap.docs.map((doc) => {
          const d = doc.data() as any;
          return {
            id: doc.id,
            campanha: d.campanha || d.campanhaNome || "Campanha sem nome",
            acao: d.acao || d.mensagem || "",
            status: d.status || "pendente",
            motivo: d.motivo || "",
            data: d.data?.toDate?.()?.toLocaleString("pt-BR") || d.data || "",
          };
        });
        setSugestoes(arr.length > 0 ? arr : fallback);
      } catch (err) {
        setSugestoes(fallback);
      } finally {
        setLoading(false);
      }
    }
    fetchFromFirestore();
  }, []);

  function handleAprovar(id: string) {
    setSugestoes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "aprovada", motivo: "Ajuste aplicado!" } : s
      )
    );
  }
  function handleRejeitar(id: string) {
    setSugestoes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "rejeitada", motivo: "Ajuste rejeitado!" } : s
      )
    );
  }
  function handleReanalisar(id: string) {
    setSugestoes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "pendente", motivo: "" } : s
      )
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <Bot className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-200 drop-shadow-sm">
          IA de Tráfego – Centro de Comando
        </h1>
        <Badge className="bg-blue-700 text-white ml-2">BETA</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-900/60 rounded-xl shadow p-6 flex flex-col gap-2">
          <span className="flex items-center gap-2 font-semibold text-blue-200">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            IA monitorando campanhas em tempo real
          </span>
          <span className="text-blue-100 text-sm">Última análise: 5min atrás</span>
        </div>
        <div className="bg-yellow-900/60 rounded-xl shadow p-6 flex flex-col gap-2">
          <span className="flex items-center gap-2 font-semibold text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
            2 campanhas com alertas ativos
          </span>
          <span className="text-yellow-200 text-sm">Acesse as sugestões abaixo</span>
        </div>
        <div className="bg-zinc-900/60 rounded-xl shadow p-6 flex flex-col gap-2">
          <span className="flex items-center gap-2 font-semibold text-blue-100">
            <BarChart4 className="w-5 h-5" />
            4 sugestões pendentes de aprovação
          </span>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-xl text-blue-100 mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Sugestões Inteligentes da IA
        </h2>
        <div className="space-y-4">
          {loading ? (
            <div className="text-blue-300">Carregando...</div>
          ) : sugestoes.length === 0 ? (
            <div className="text-blue-300">Nenhuma sugestão disponível.</div>
          ) : (
            sugestoes.map((s) => (
              <div
                key={s.id}
                className={`rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow transition ${
                  s.status === "aprovada"
                    ? "bg-green-900/30 border-green-700"
                    : s.status === "rejeitada"
                    ? "bg-red-900/30 border-red-700"
                    : "bg-blue-900/30 border-blue-700"
                }`}
              >
                <div>
                  <div className="font-medium text-blue-100 flex items-center gap-2">
                    <span>{s.campanha}</span>
                    {s.status === "pendente" && (
                      <Badge className="bg-yellow-600 text-white ml-1">Pendente</Badge>
                    )}
                    {s.status === "aprovada" && (
                      <Badge className="bg-green-600 text-white ml-1">Aprovada</Badge>
                    )}
                    {s.status === "rejeitada" && (
                      <Badge className="bg-red-600 text-white ml-1">Rejeitada</Badge>
                    )}
                  </div>
                  <div className="text-base text-blue-300 mt-1">{s.acao}</div>
                  <div className="text-xs text-blue-300 mt-2">
                    <span>{s.data}</span>
                    {s.motivo && (
                      <span className="ml-2 text-zinc-400 italic">Motivo: {s.motivo}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  {s.status === "pendente" && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                        onClick={() => handleAprovar(s.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white"
                        size="sm"
                        onClick={() => handleRejeitar(s.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Rejeitar
                      </Button>
                    </>
                  )}
                  {(s.status === "aprovada" || s.status === "rejeitada") && (
                    <Button
                      className="bg-blue-800 hover:bg-blue-900 text-white"
                      size="sm"
                      onClick={() => handleReanalisar(s.id)}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" /> Reanalisar
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <h2 className="font-bold text-xl text-blue-100 mb-2 flex items-center gap-2 mt-10">
          <BarChart4 className="w-5 h-5" />
          Histórico das ações da IA
        </h2>
        <ul className="space-y-2 text-sm text-blue-200">
          {logsIA.map((log, i) => (
            <li key={i} className="flex items-start gap-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-300">{log.data}</Badge>
              <span>{log.acao}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
