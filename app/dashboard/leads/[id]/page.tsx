"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Phone, Mail, User2, MoveRight, FileText, UserCheck, MessageSquare, Plus, ClipboardEdit } from "lucide-react";

// MOCKS para exemplo — troque por dados reais depois
const lead = {
  nome: "João Ribeiro",
  empresa: "Ribeiro Alimentos",
  origem: "LP Facebook",
  potencial: 3500,
  status: "ativo",
  etapa: "Negociação",
  email: "joao@ribeiroalimentos.com",
  telefone: "(31) 91234-5678",
  criado: "2025-07-16 10:50",
  responsavel: "Savio Cipriano",
};

const atividades = [
  { tipo: "Ligação", descricao: "Ligação para João, apresentou proposta", data: "2025-07-16 10:52" },
  { tipo: "Proposta", descricao: "Proposta #000123 enviada", data: "2025-07-16 11:02" },
];

const notas = [
  { autor: "Savio", texto: "Lead muito quente, responder rápido!", data: "2025-07-16 11:10" }
];

const historico = [
  { data: "16/07/2025", desc: "Lead criado via Landing Page" },
  { data: "16/07/2025", desc: "Primeiro contato realizado (WhatsApp)" },
];

export default function LeadDetalhePage() {
  const { id } = useParams();
  const [historicoAberto, setHistoricoAberto] = useState(false);

  return (
    <div className="flex justify-center py-8 px-2 min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl w-full max-w-3xl p-4 md:p-8 flex flex-col gap-8">
        {/* Topo */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-blue-900 dark:text-blue-300">{lead.empresa}</h1>
              <Badge className={`capitalize ${lead.etapa === "Negociação" ? "bg-blue-100 text-blue-800" : "bg-green-200 text-green-700"}`}>{lead.etapa}</Badge>
              <Badge className="bg-gray-100 text-gray-700 border border-gray-300">{lead.origem}</Badge>
              <Badge className={`capitalize ${lead.status === "ativo" ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-500"}`}>{lead.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-zinc-700 dark:text-zinc-200 text-sm">
              <span><User2 className="inline w-4 h-4 mr-1 -mt-1" />Responsável: <strong>{lead.responsavel}</strong></span>
              <span><Mail className="inline w-4 h-4 mr-1 -mt-1" />{lead.email}</span>
              <span><Phone className="inline w-4 h-4 mr-1 -mt-1" />{lead.telefone}</span>
              <span className="text-green-700 font-bold dark:text-green-400">Potencial: R$ {lead.potencial?.toLocaleString()}</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1">Criado em: {lead.criado}</div>
          </div>
          {/* Botões de ação principais */}
          <div className="flex flex-wrap gap-2 items-end md:items-center mt-2 md:mt-0">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" size="sm">
              <MoveRight className="w-4 h-4" /> <span className="hidden sm:inline">Mover Etapa</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
              <UserCheck className="w-4 h-4" /> <span className="hidden sm:inline">Converter em Cliente</span>
            </Button>
            <Button variant="outline" size="sm" className="text-blue-800 border-blue-200">
              <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Proposta/Contrato</span>
            </Button>
            <Button variant="outline" size="sm" className="text-green-800 border-green-200">
              <MessageSquare className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Button variant="outline" size="sm" className="text-gray-800 border-gray-200">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nova Atividade</span>
            </Button>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div>
          <h2 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-2">Atividades Recentes</h2>
          <div className="flex flex-col gap-2">
            {atividades.length === 0 ? (
              <span className="text-zinc-400">Nenhuma atividade recente.</span>
            ) : (
              atividades.map((at, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2 bg-blue-50 dark:bg-blue-950 rounded-lg px-3 py-2 shadow-sm">
                  <Badge className={`bg-blue-200 text-blue-700`}>{at.tipo}</Badge>
                  <span className="text-zinc-700 dark:text-zinc-200">{at.descricao}</span>
                  <span className="text-xs text-zinc-500 ml-auto">{at.data}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notas */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-bold text-lg text-blue-900 dark:text-blue-200">Notas</h2>
            <Button variant="outline" size="sm" className="py-1 px-3 text-xs font-semibold ml-1">
              <ClipboardEdit className="w-4 h-4" /> Nova Nota
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {notas.length === 0 ? (
              <span className="text-zinc-400">Nenhuma nota adicionada.</span>
            ) : (
              notas.map((n, i) => (
                <div key={i} className="bg-zinc-50 dark:bg-zinc-800 rounded-lg px-3 py-2 flex gap-2 items-center border border-zinc-200 dark:border-zinc-700">
                  <span className="font-bold text-blue-800 dark:text-blue-300">{n.autor}:</span>
                  <span className="text-zinc-700 dark:text-zinc-200">{n.texto}</span>
                  <span className="ml-auto text-xs text-zinc-400">{n.data}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Histórico do Lead (colapsável) */}
        <div>
          <button
            onClick={() => setHistoricoAberto((o) => !o)}
            className="flex items-center gap-2 text-blue-800 dark:text-blue-200 font-semibold mt-2 hover:underline"
          >
            {historicoAberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Histórico do Lead
          </button>
          {historicoAberto && (
            <div className="mt-2 pl-2 border-l-2 border-blue-200 dark:border-blue-800">
              <ul className="space-y-1 text-sm">
                {historico.map((log, i) => (
                  <li key={i}>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">{log.data}</Badge>{" "}
                    <span className="text-zinc-700 dark:text-zinc-200">{log.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
