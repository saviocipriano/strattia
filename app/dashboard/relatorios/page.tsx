"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, Info, TrendingUp, TrendingDown, Sparkle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

// Mock de dados
const campaigns = [
  {
    id: "c01",
    nome: "Meta Julho",
    plataforma: "Meta",
    status: "Ativa",
    investimento: 1500,
    impressoes: 52000,
    cliques: 8700,
    conversoes: 1200,
    cpl: 1.25,
    cpa: 7.60,
    roas: 2.8,
    periodo: "2025-07-01 a 2025-07-15",
    dadosDiarios: [
      { data: "01/07", impressoes: 2200, cliques: 300, conversoes: 40, gasto: 100 },
      { data: "02/07", impressoes: 2500, cliques: 340, conversoes: 50, gasto: 110 },
      { data: "03/07", impressoes: 2100, cliques: 320, conversoes: 44, gasto: 105 },
      // ...mais dias
    ]
  },
  {
    id: "c02",
    nome: "Google Julho",
    plataforma: "Google",
    status: "Pausada",
    investimento: 900,
    impressoes: 29000,
    cliques: 4200,
    conversoes: 450,
    cpl: 2.00,
    cpa: 9.90,
    roas: 2.0,
    periodo: "2025-07-01 a 2025-07-15",
    dadosDiarios: [
      { data: "01/07", impressoes: 1200, cliques: 170, conversoes: 18, gasto: 50 },
      { data: "02/07", impressoes: 1400, cliques: 190, conversoes: 22, gasto: 60 },
      { data: "03/07", impressoes: 1350, cliques: 175, conversoes: 19, gasto: 55 },
      // ...mais dias
    ]
  },
];

const periodos = ["Últimos 7 dias", "Últimos 30 dias", "Personalizado"];

export default function RelatoriosPremiumPage() {
  const [periodo, setPeriodo] = useState(periodos[0]);
  const [comparar, setComparar] = useState<string[]>([]);
  const [filtroCampanha, setFiltroCampanha] = useState<string | null>(null);

  // Métricas agregadas
  const investimentoTotal = campaigns.reduce((acc, c) => acc + c.investimento, 0);
  const impressoesTotal = campaigns.reduce((acc, c) => acc + c.impressoes, 0);
  const cliquesTotal = campaigns.reduce((acc, c) => acc + c.cliques, 0);
  const conversoesTotal = campaigns.reduce((acc, c) => acc + c.conversoes, 0);

  // Seleção de campanha para detalhes ou gráfico
  const campanhasFiltradas = filtroCampanha ? campaigns.filter(c => c.id === filtroCampanha) : campaigns;

  // Dados para o gráfico
  const dadosGrafico = campanhasFiltradas.length === 1
    ? campanhasFiltradas[0].dadosDiarios
    : [];

  // Insights mock IA
  const insights = [
    {
      tipo: "opportunity",
      msg: "Campanha Meta Julho teve aumento de 30% nas conversões após ajuste de orçamento.",
      icone: <TrendingUp className="text-green-500 w-4 h-4" />,
    },
    {
      tipo: "alert",
      msg: "Campanha Google Julho apresentou queda de 18% nos cliques nos últimos 3 dias.",
      icone: <TrendingDown className="text-yellow-400 w-4 h-4" />,
    },
    {
      tipo: "info",
      msg: "Sugestão IA: Teste novos criativos na campanha Meta Julho para melhorar o CTR.",
      icone: <Sparkle className="text-blue-400 w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Título */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
            <BarChart className="w-8 h-8 text-blue-500" />
            Relatórios & Analytics
          </h1>
          <span className="text-zinc-400 text-base">Painel avançado de desempenho, comparativo de campanhas e insights com IA.</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar CSV
          </Button>
          <div className="relative">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => {
                // Futuro: dropdown de período
              }}
            >
              <ChevronDown className="w-4 h-4" />
              {periodo}
            </Button>
            {/* Dropdown período mock */}
          </div>
        </div>
      </div>

      {/* Cards superiores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="py-6 px-4 flex flex-col gap-1 items-center">
            <span className="text-sm text-zinc-400">Investimento Total</span>
            <span className="text-2xl font-bold text-yellow-500">R$ {investimentoTotal.toLocaleString()}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 px-4 flex flex-col gap-1 items-center">
            <span className="text-sm text-zinc-400">Impressões</span>
            <span className="text-2xl font-bold text-blue-400">{impressoesTotal.toLocaleString()}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 px-4 flex flex-col gap-1 items-center">
            <span className="text-sm text-zinc-400">Cliques</span>
            <span className="text-2xl font-bold text-green-400">{cliquesTotal.toLocaleString()}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6 px-4 flex flex-col gap-1 items-center">
            <span className="text-sm text-zinc-400">Conversões</span>
            <span className="text-2xl font-bold text-purple-400">{conversoesTotal.toLocaleString()}</span>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Dinâmico */}
      <div className="bg-zinc-900 rounded-2xl p-6 mb-10 shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-300">Evolução da Campanha</h2>
          <div>
            <select
              className="bg-zinc-800 text-white px-3 py-2 rounded-lg outline-none"
              value={filtroCampanha || ""}
              onChange={e => setFiltroCampanha(e.target.value || null)}
            >
              <option value="">Todas Campanhas</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        </div>
        {dadosGrafico.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid stroke="#222" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="impressoes" stroke="#60a5fa" strokeWidth={2} name="Impressões" />
              <Line type="monotone" dataKey="cliques" stroke="#34d399" strokeWidth={2} name="Cliques" />
              <Line type="monotone" dataKey="conversoes" stroke="#a78bfa" strokeWidth={2} name="Conversões" />
              <Line type="monotone" dataKey="gasto" stroke="#fde047" strokeWidth={2} name="Investimento" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-zinc-400 text-center py-10">
            <Info className="inline w-6 h-6 mb-2 text-blue-400" />
            Selecione uma campanha para visualizar os dados.
          </div>
        )}
      </div>

      {/* Comparativo entre campanhas */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">Comparativo Entre Campanhas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {campaigns.map(c => (
            <Card key={c.id} className="border-blue-800">
              <CardContent className="py-4 px-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{c.nome}</span>
                  <Badge
                    className={
                      c.status === "Ativa"
                        ? "bg-green-600 text-white"
                        : c.status === "Pausada"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-600 text-white"
                    }
                  >
                    {c.status}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Investido</span>
                    <div className="font-semibold text-yellow-400">R$ {c.investimento}</div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Impressões</span>
                    <div className="font-semibold text-blue-400">{c.impressoes}</div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Cliques</span>
                    <div className="font-semibold text-green-400">{c.cliques}</div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Conversões</span>
                    <div className="font-semibold text-purple-400">{c.conversoes}</div>
                  </div>
                  <div>
                    <span className="text-zinc-400">CPL</span>
                    <div className="font-semibold text-sky-200">R$ {c.cpl}</div>
                  </div>
                  <div>
                    <span className="text-zinc-400">CPA</span>
                    <div className="font-semibold text-pink-200">R$ {c.cpa}</div>
                  </div>
                  <div>
                    <span className="text-zinc-400">ROAS</span>
                    <div className="font-semibold text-lime-300">{c.roas}</div>
                  </div>
                  <div>
                    <span className="text-zinc-400">Período</span>
                    <div className="font-semibold text-zinc-300">{c.periodo}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabela detalhada de campanhas */}
      <div className="bg-zinc-900 rounded-2xl p-6 shadow mb-10 overflow-x-auto">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">Tabela Detalhada</h2>
        <table className="min-w-full text-zinc-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Campanha</th>
              <th className="px-4 py-2">Plataforma</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Investido</th>
              <th className="px-4 py-2">Impressões</th>
              <th className="px-4 py-2">Cliques</th>
              <th className="px-4 py-2">Conversões</th>
              <th className="px-4 py-2">CPL</th>
              <th className="px-4 py-2">CPA</th>
              <th className="px-4 py-2">ROAS</th>
              <th className="px-4 py-2">Período</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id} className="hover:bg-blue-900/10 transition">
                <td className="px-4 py-2">{c.nome}</td>
                <td className="px-4 py-2">{c.plataforma}</td>
                <td className="px-4 py-2">
                  <Badge
                    className={
                      c.status === "Ativa"
                        ? "bg-green-600 text-white"
                        : c.status === "Pausada"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-600 text-white"
                    }
                  >
                    {c.status}
                  </Badge>
                </td>
                <td className="px-4 py-2">R$ {c.investimento}</td>
                <td className="px-4 py-2">{c.impressoes}</td>
                <td className="px-4 py-2">{c.cliques}</td>
                <td className="px-4 py-2">{c.conversoes}</td>
                <td className="px-4 py-2">R$ {c.cpl}</td>
                <td className="px-4 py-2">R$ {c.cpa}</td>
                <td className="px-4 py-2">{c.roas}</td>
                <td className="px-4 py-2">{c.periodo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights IA */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-300 mb-3">Insights & Alertas da IA</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {insights.map((i, idx) => (
            <Card key={idx} className="border-blue-700">
              <CardContent className="py-6 px-4 flex gap-3 items-center">
                {i.icone}
                <span className="text-zinc-100">{i.msg}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Não esqueça de importar o ícone BarChart, caso esteja usando Lucide ou outro pacote.
import { BarChart } from "lucide-react";
