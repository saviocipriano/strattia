"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Zap, ZapOff, Edit2, Trash2, RefreshCcw, MessageCircle, Mail, Database } from "lucide-react";

const mockAutomacoes = [
  {
    id: "auto1",
    nome: "Aviso no WhatsApp ao Ganhar Lead",
    tipo: "WhatsApp",
    status: "ativa",
    descricao: "Envia mensagem automática no WhatsApp para o lead e responsável quando a etapa do pipeline vira GANHO.",
    log: [
      { data: "2025-07-16 14:05", acao: "Mensagem enviada para João Ribeiro" },
      { data: "2025-07-15 19:22", acao: "Mensagem enviada para Empresa Teste" }
    ]
  },
  {
    id: "auto2",
    nome: "Relatório Diário por E-mail",
    tipo: "E-mail",
    status: "pausada",
    descricao: "Envia relatório automático de desempenho para o gestor todos os dias às 8h.",
    log: [
      { data: "2025-07-15 08:00", acao: "Relatório enviado para Savio Cipriano" }
    ]
  },
  {
    id: "auto3",
    nome: "Webhook CRM Externo",
    tipo: "Webhook",
    status: "erro",
    descricao: "Envia dados do lead ganho para integração com CRM externo via webhook Zapier.",
    log: [
      { data: "2025-07-14 18:00", acao: "Erro: Não foi possível conectar ao webhook" }
    ]
  },
];

const iconeTipo = {
  "WhatsApp": <MessageCircle className="w-4 h-4 text-green-400" />,
  "E-mail": <Mail className="w-4 h-4 text-blue-400" />,
  "Webhook": <Database className="w-4 h-4 text-purple-400" />,
};

export default function AutomacoesPage() {
  const [automacoes, setAutomacoes] = useState(mockAutomacoes);

  return (
    <div className="min-h-screen py-10 px-2 md:px-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-200">Automações & Integrações</h1>
            <p className="text-zinc-400 mt-2 text-sm max-w-lg">
              Programe tarefas automáticas, integrações com WhatsApp, e-mail, CRM ou Zapier. Torne seu funil inteligente e ganhe escala real.
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium px-6 py-2 flex gap-2"
            onClick={() => alert("Nova automação (em breve: modal para cadastrar)")}
          >
            <Plus className="w-5 h-5" /> Nova Automação
          </Button>
        </div>

        {/* Grid de Automações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {automacoes.map(auto => (
            <div
              key={auto.id}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl p-6 flex flex-col gap-3 relative"
            >
              <div className="flex items-center gap-2 mb-2">
                {iconeTipo[auto.tipo as keyof typeof iconeTipo] || <Zap className="w-4 h-4 text-blue-300" />}
                <span className="text-lg font-semibold text-blue-100">{auto.nome}</span>
                <Badge className={
                  auto.status === "ativa"
                    ? "bg-green-700 text-green-100"
                    : auto.status === "pausada"
                      ? "bg-yellow-700 text-yellow-100"
                      : "bg-red-700 text-red-100"
                }>
                  {auto.status === "ativa" ? "Ativa" : auto.status === "pausada" ? "Pausada" : "Erro"}
                </Badge>
              </div>
              <div className="text-zinc-400 text-sm">{auto.descricao}</div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => alert("Ativar/Pausar (em breve)")}>
                  {auto.status === "ativa" ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  {auto.status === "ativa" ? "Pausar" : "Ativar"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("Editar automação (em breve)")}>
                  <Edit2 className="w-4 h-4" /> Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => alert("Excluir automação (em breve)")}>
                  <Trash2 className="w-4 h-4" /> Excluir
                </Button>
                <Button variant="outline" size="sm" onClick={() => alert("Reexecutar/Testar (em breve)")}>
                  <RefreshCcw className="w-4 h-4" /> Testar
                </Button>
              </div>
              <div className="mt-4">
                <div className="text-xs font-medium text-zinc-400 mb-2">Histórico:</div>
                <ul className="space-y-1">
                  {auto.log.map((log, i) => (
                    <li key={i} className="flex gap-2 text-xs items-center">
                      <Badge className="bg-blue-950 text-blue-300 border-blue-900">{log.data}</Badge>
                      <span className={auto.status === "erro" ? "text-red-400" : "text-zinc-300"}>{log.acao}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Progresso de integrações */}
        <div className="mt-10 text-center text-zinc-400 text-sm">
          <p>Pronto para automações reais: plugue WhatsApp, e-mail, SMS, Zapier, webhooks, CRMs. API pronta para receber integrações.</p>
        </div>
      </div>
    </div>
  );
}
