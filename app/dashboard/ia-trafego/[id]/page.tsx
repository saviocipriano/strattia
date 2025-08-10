"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Bot, CheckCircle2, XCircle, RotateCcw, BarChart4, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sugestoesMock = [
  {
    id: "1",
    campanha: "Campanha - Loja Amanda",
    acao: "Aumentar orçamento diário de R$ 50 para R$ 80 (CPC baixo e conversão subindo)",
    status: "pendente",
    motivo: "",
    data: "16/07/2025 09:10",
    metrica: {
      cpc: "R$ 0,89",
      conversoes: 8,
      orcamento: "R$ 50",
      tendencia: "+27% em conversão",
    },
    analise:
      "A IA detectou aumento de conversão nos últimos dias. Recomenda-se aumentar o orçamento para ampliar resultados, mantendo o CPC baixo.",
    historico: [
      {
        data: "15/07/2025 09:12",
        acao: "Orçamento ajustado manualmente para R$ 50.",
      },
      {
        data: "14/07/2025 11:04",
        acao: "Criativo atualizado.",
      },
    ],
  },
  {
    id: "2",
    campanha: "Campanha - Agro XP",
    acao: "Pausar anúncio 2: baixo CTR e alto custo",
    status: "pendente",
    motivo: "",
    data: "16/07/2025 09:05",
    metrica: {
      cpc: "R$ 2,10",
      ctr: "0,54%",
      orcamento: "R$ 90",
      tendencia: "-16% CTR",
    },
    analise:
      "A IA detectou baixo CTR e custo elevado no anúncio 2. Recomenda pausar para evitar desperdício de verba.",
    historico: [
      {
        data: "13/07/2025 13:41",
        acao: "Anúncio 2 criado.",
      },
    ],
  },
];

export default function SugestaoIADetalhePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [sugestao, setSugestao] = useState(
    sugestoesMock.find((s) => s.id === id) || sugestoesMock[0]
  );

  function handleAprovar() {
    setSugestao((prev) => ({ ...prev!, status: "aprovada", motivo: "Ajuste aplicado!" }));
  }
  function handleRejeitar() {
    setSugestao((prev) => ({ ...prev!, status: "rejeitada", motivo: "Ajuste rejeitado!" }));
  }
  function handleReanalisar() {
    setSugestao((prev) => ({ ...prev!, status: "pendente", motivo: "" }));
  }

  if (!sugestao)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <XCircle className="w-10 h-10 text-red-500 mb-4" />
        <span className="text-xl text-muted-foreground">Sugestão não encontrada.</span>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Button
        size="sm"
        variant="outline"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.push("/dashboard/ia-trafego")}
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>
      <div className="bg-blue-950/80 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="font-bold text-2xl text-blue-100 flex items-center gap-2 mb-2">
              <Bot className="w-6 h-6 text-blue-300" />
              Sugestão da IA
            </h2>
            <span className="block text-blue-400 font-semibold">{sugestao.campanha}</span>
          </div>
          <div className="flex gap-2">
            {sugestao.status === "pendente" && (
              <Badge className="bg-yellow-700 text-white">Pendente</Badge>
            )}
            {sugestao.status === "aprovada" && (
              <Badge className="bg-green-600 text-white">Aprovada</Badge>
            )}
            {sugestao.status === "rejeitada" && (
              <Badge className="bg-red-600 text-white">Rejeitada</Badge>
            )}
          </div>
        </div>
        <div className="text-base text-blue-200 mt-2 mb-4">{sugestao.acao}</div>

        {/* Análise detalhada */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg text-blue-300 mb-1">Análise da IA</h3>
          <p className="text-blue-100 mb-2">{sugestao.analise}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
            <div className="bg-blue-900/70 px-3 py-2 rounded font-medium text-blue-200">
              <span className="block text-xs text-blue-400">CPC</span>
              {sugestao.metrica.cpc}
            </div>
            {sugestao.metrica.ctr && (
              <div className="bg-blue-900/70 px-3 py-2 rounded font-medium text-blue-200">
                <span className="block text-xs text-blue-400">CTR</span>
                {sugestao.metrica.ctr}
              </div>
            )}
            <div className="bg-blue-900/70 px-3 py-2 rounded font-medium text-blue-200">
              <span className="block text-xs text-blue-400">Conversões</span>
              {sugestao.metrica.conversoes ?? "-"}
            </div>
            <div className="bg-blue-900/70 px-3 py-2 rounded font-medium text-blue-200">
              <span className="block text-xs text-blue-400">Orçamento</span>
              {sugestao.metrica.orcamento}
            </div>
            <div className="bg-blue-900/70 px-3 py-2 rounded font-medium text-blue-200">
              <span className="block text-xs text-blue-400">Tendência</span>
              {sugestao.metrica.tendencia}
            </div>
          </div>
        </div>

        {/* Motivo/status */}
        {sugestao.status !== "pendente" && (
          <div className="mb-6">
            <span className="block text-zinc-300">
              <b>Status:</b> {sugestao.status === "aprovada" ? "Ajuste aplicado" : "Ajuste rejeitado"}
            </span>
            <span className="block text-zinc-400">Motivo: {sugestao.motivo}</span>
            <Button
              className="mt-2"
              size="sm"
              variant="secondary"
              onClick={handleReanalisar}
            >
              <RotateCcw className="w-4 h-4 mr-1" /> Reanalisar sugestão
            </Button>
          </div>
        )}

        {/* Botões de ação */}
        {sugestao.status === "pendente" && (
          <div className="flex gap-2 mt-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              onClick={handleAprovar}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
              onClick={handleRejeitar}
            >
              <XCircle className="w-4 h-4 mr-1" /> Rejeitar
            </Button>
          </div>
        )}

        {/* Histórico */}
        <div className="mt-10">
          <h3 className="font-semibold text-lg text-blue-300 mb-1 flex items-center gap-2">
            <BarChart4 className="w-5 h-5" />
            Histórico da Campanha
          </h3>
          <ul className="text-blue-200 text-sm space-y-2">
            {sugestao.historico.map((log, i) => (
              <li key={i}>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">{log.data}</Badge>
                <span className="ml-2">{log.acao}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
