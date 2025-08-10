"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, User2, FileText, MessageCircle, ClipboardEdit, DollarSign, MoveRight, Users, CalendarDays, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";

// MOCKS (substitua depois pelos reais)
const cliente = {
  nome: "Ribeiro Alimentos",
  cnpj: "12.345.678/0001-99",
  contato: {
    nome: "João Ribeiro",
    email: "joao@ribeiroalimentos.com",
    telefone: "(31) 91234-5678"
  },
  status: "Ativo",
  potencial: 5000,
  tags: ["VIP", "Recorrente", "Alto ticket"],
  criado: "2024-12-01",
  plano: "Growth",
  receita: 48500,
};

const timeline = [
  { data: "2025-07-16 10:51", tipo: "lead", desc: "Novo lead criado via landing page", icon: <User2 className="w-4 h-4 text-blue-300" /> },
  { data: "2025-07-16 11:12", tipo: "proposta", desc: "Proposta enviada: #000123", icon: <FileText className="w-4 h-4 text-sky-300" /> },
  { data: "2025-07-16 11:40", tipo: "contrato", desc: "Contrato assinado", icon: <ClipboardEdit className="w-4 h-4 text-green-300" /> },
  { data: "2025-07-17 09:10", tipo: "atividade", desc: "Ligação de acompanhamento realizada", icon: <Phone className="w-4 h-4 text-orange-300" /> },
  { data: "2025-07-18 14:00", tipo: "pagamento", desc: "Pagamento recebido: R$ 8.900", icon: <DollarSign className="w-4 h-4 text-yellow-300" /> },
];

const contratos = [
  { id: "C001", status: "Vigente", valor: 8900, vencimento: "2025-09-01" },
  { id: "C002", status: "Encerrado", valor: 3400, vencimento: "2024-12-01" },
];

const propostas = [
  { id: "P010", status: "Aprovada", valor: 5900, enviada: "2025-07-10" },
  { id: "P008", status: "Recusada", valor: 2900, enviada: "2025-06-25" },
];

export default function Cliente360Page() {
  return (
    <div className="flex justify-center py-8 px-2 min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <div className="bg-zinc-900/95 shadow-2xl rounded-2xl w-full max-w-3xl p-4 md:p-8 flex flex-col gap-8 border border-zinc-800">
        {/* Perfil cliente */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-blue-200 flex items-center gap-2">
              <Users className="w-8 h-8" /> {cliente.nome}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className="bg-green-700 text-green-100">{cliente.status}</Badge>
              <Badge className="bg-blue-950 text-blue-200 border border-blue-900">Plano: {cliente.plano}</Badge>
              {cliente.tags.map(tag => (
                <Badge key={tag} className="bg-zinc-800 text-zinc-200 border border-zinc-700">{tag}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-zinc-300 text-sm">
              <span><User2 className="inline w-4 h-4 mr-1 -mt-1" />Contato: <b>{cliente.contato.nome}</b></span>
              <span><Mail className="inline w-4 h-4 mr-1 -mt-1" />{cliente.contato.email}</span>
              <span><Phone className="inline w-4 h-4 mr-1 -mt-1" />{cliente.contato.telefone}</span>
              <span>CNPJ: {cliente.cnpj}</span>
              <span>Desde: {cliente.criado}</span>
              <span className="text-green-300 font-bold">Potencial: R$ {cliente.potencial.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-200">
              <Mail className="w-4 h-4" /> E-mail
            </Button>
            <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-200">
              <Phone className="w-4 h-4" /> Chamada
            </Button>
            <Button variant="outline" size="sm" className="border-green-600 text-green-300">
              <Plus className="w-4 h-4" /> Nova Atividade
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h2 className="text-lg font-bold text-blue-200 mb-2 flex items-center gap-2"><CalendarDays className="w-5 h-5" /> Timeline de Interações</h2>
          <ul className="space-y-3 border-l-2 border-blue-900 pl-4">
            {timeline.map((item, i) => (
              <li key={i} className="flex gap-2 items-center">
                <div className="flex flex-col items-center">
                  <span>{item.icon}</span>
                  {i < timeline.length - 1 && (
                    <span className="h-5 border-l-2 border-blue-900 mx-auto" />
                  )}
                </div>
                <div>
                  <div className="text-zinc-200">{item.desc}</div>
                  <div className="text-xs text-zinc-400">{item.data}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contratos e Propostas */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold text-blue-200 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Contratos
            </h2>
            <ul className="space-y-2">
              {contratos.map(c => (
                <li key={c.id} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                  <span className="font-bold text-zinc-200">{c.id}</span>
                  <Badge className={c.status === "Vigente" ? "bg-green-600 text-white" : "bg-zinc-600 text-zinc-200"}>{c.status}</Badge>
                  <span className="text-zinc-300">R$ {c.valor}</span>
                  <span className="text-xs text-zinc-400 ml-auto">Venc.: {c.vencimento}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-200 mb-2 flex items-center gap-2">
              <ClipboardEdit className="w-5 h-5" /> Propostas
            </h2>
            <ul className="space-y-2">
              {propostas.map(p => (
                <li key={p.id} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
                  <span className="font-bold text-zinc-200">{p.id}</span>
                  <Badge className={p.status === "Aprovada" ? "bg-green-600 text-white" : "bg-red-600 text-white"}>{p.status}</Badge>
                  <span className="text-zinc-300">R$ {p.valor}</span>
                  <span className="text-xs text-zinc-400 ml-auto">Enviada: {p.enviada}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="flex flex-wrap gap-6 mt-2">
          <div className="bg-blue-950/80 rounded-xl shadow p-6 flex flex-col gap-1 min-w-[170px]">
            <span className="text-zinc-400 text-xs">Receita total</span>
            <span className="text-2xl font-bold text-blue-400">R$ {cliente.receita.toLocaleString()}</span>
          </div>
          <div className="bg-zinc-900/80 rounded-xl shadow p-6 flex flex-col gap-1 min-w-[170px]">
            <span className="text-zinc-400 text-xs">Potencial de Upsell</span>
            <span className="text-2xl font-bold text-green-400">R$ {cliente.potencial.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
