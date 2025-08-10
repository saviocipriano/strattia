"use client";

import { Bell, CheckCircle2, XCircle, Info, AlertTriangle, MailOpen } from "lucide-react";
import { useState } from "react";

const mockNotificacoes = [
  {
    id: 1,
    titulo: "Campanha 'Agro2024' está com baixo desempenho",
    tipo: "alerta",
    data: "2025-07-14 09:18",
    status: "não lida",
    descricao: "A campanha 'Agro2024' apresentou queda de 40% nos cliques nos últimos 3 dias.",
  },
  {
    id: 2,
    titulo: "Contrato de João Pedro renovado automaticamente",
    tipo: "sucesso",
    data: "2025-07-13 15:40",
    status: "lida",
    descricao: "O contrato com João Pedro foi renovado para mais 12 meses.",
  },
  {
    id: 3,
    titulo: "Proposta rejeitada por Maria Costa",
    tipo: "erro",
    data: "2025-07-12 11:23",
    status: "não lida",
    descricao: "A proposta enviada foi rejeitada. Motivo: valor acima do orçamento.",
  },
  {
    id: 4,
    titulo: "Novo recurso: Dashboard Financeiro liberado",
    tipo: "info",
    data: "2025-07-10 18:50",
    status: "lida",
    descricao: "Acesse agora o novo módulo financeiro e acompanhe receitas e despesas.",
  },
];

function tipoIcon(tipo: string) {
  switch (tipo) {
    case "sucesso":
      return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    case "erro":
      return <XCircle className="w-5 h-5 text-red-400" />;
    case "alerta":
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    case "info":
    default:
      return <Info className="w-5 h-5 text-blue-400" />;
  }
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState(mockNotificacoes);

  function marcarTodasComoLidas() {
    setNotificacoes((prev) =>
      prev.map((n) => ({ ...n, status: "lida" }))
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-blue-400" /> Notificações
          </h1>
          <p className="text-zinc-400 mt-1">Avisos, alertas e novidades do sistema.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white text-sm font-medium"
          onClick={marcarTodasComoLidas}
        >
          <MailOpen className="w-4 h-4" />
          Marcar todas como lidas
        </button>
      </div>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg divide-y divide-zinc-800">
        {notificacoes.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">Nenhuma notificação encontrada.</div>
        ) : (
          notificacoes.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-5 transition
                ${n.status === "não lida"
                  ? "bg-blue-950/60"
                  : "hover:bg-zinc-800/60"}
              `}
            >
              <div className="pt-1">{tipoIcon(n.tipo)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{n.titulo}</span>
                  {n.status === "não lida" && (
                    <span className="bg-blue-700 text-white rounded-full px-2 py-0.5 text-xs font-semibold ml-2">
                      Novo
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mt-1">{n.descricao}</p>
                <span className="text-xs text-zinc-500">{n.data}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
