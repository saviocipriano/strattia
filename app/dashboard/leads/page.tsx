"use client";

import { useState } from "react";
import { PlusCircle, UserPlus, ArrowRight } from "lucide-react";

const etapas = [
  { id: "novo", nome: "Novo" },
  { id: "qualificando", nome: "Qualificando" },
  { id: "negociacao", nome: "Negociação" },
  { id: "fechado", nome: "Fechado (Ganho)" },
  { id: "perdido", nome: "Perdido" }
];

// Tipagem dos leads e do dicionário de etapas
type Lead = {
  id: string;
  nome: string;
  empresa: string;
  origem: string;
  valor: number;
};

type LeadsByEtapa = {
  [key: string]: Lead[]; // [id da etapa]: array de leads
};

// Mock de leads
const mockLeads: LeadsByEtapa = {
  novo: [
    { id: "L001", nome: "João Ribeiro", empresa: "Ribeiro Alimentos", origem: "LP Facebook", valor: 3500 },
    { id: "L002", nome: "Tânia Costa", empresa: "Consultoria Tânia", origem: "Google Ads", valor: 1500 }
  ],
  qualificando: [
    { id: "L003", nome: "Carlos Agro", empresa: "Agro Minas", origem: "LP Agro", valor: 5000 }
  ],
  negociacao: [
    { id: "L004", nome: "Amanda Sales", empresa: "Loja Amanda", origem: "WhatsApp", valor: 2200 }
  ],
  fechado: [
    { id: "L005", nome: "Marcos XP", empresa: "XP Serviços", origem: "Indicação", valor: 2700 }
  ],
  perdido: []
};

export default function LeadsPipelinePage() {
  const [leads, setLeads] = useState<LeadsByEtapa>(mockLeads);

  // Mover lead de uma etapa para outra (mock)
  function moverLead(leadId: string, from: string, to: string) {
    const lead = leads[from].find(l => l.id === leadId);
    if (!lead) return;
    setLeads(prev => {
      const novoDe = prev[from].filter(l => l.id !== leadId);
      const novoPara = [lead, ...prev[to]];
      return { ...prev, [from]: novoDe, [to]: novoPara };
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <UserPlus className="w-8 h-8 text-blue-400" /> Pipeline de Leads & CRM
          </h1>
          <p className="text-zinc-400 mt-1">Gerencie oportunidades, funil de vendas e avance seus resultados.</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition"
          onClick={() => alert("Cadastro rápido em breve!")}
        >
          <PlusCircle className="w-5 h-5" /> Novo Lead
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {etapas.map(etapa => (
          <div key={etapa.id} className="flex-1 min-w-[270px]">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-4 mb-2 flex justify-between items-center">
              <span className="text-lg font-bold text-blue-300">{etapa.nome}</span>
              <span className="bg-blue-950 text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                {leads[etapa.id]?.length ?? 0}
              </span>
            </div>
            <div className="space-y-4 min-h-[120px]">
              {leads[etapa.id]?.length === 0 && (
                <div className="text-center text-zinc-600 text-sm mt-6">Nenhum lead</div>
              )}
              {leads[etapa.id]?.map(lead => (
                <div
                  key={lead.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow group hover:border-blue-600 transition"
                >
                  <div className="font-bold text-white">{lead.nome}</div>
                  <div className="text-zinc-300 text-sm">{lead.empresa}</div>
                  <div className="text-xs text-zinc-500 mb-2">{lead.origem}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-400">R$ {lead.valor.toLocaleString("pt-BR")}</span>
                    {/* Mover lead de etapa */}
                    <div className="flex gap-1">
                      {etapas.map(et =>
                        et.id !== etapa.id ? (
                          <button
                            key={et.id}
                            className="text-xs px-2 py-1 rounded bg-zinc-700 text-zinc-300 hover:bg-blue-800 hover:text-white transition"
                            onClick={() => moverLead(lead.id, etapa.id, et.id)}
                          >
                            {et.nome.split(" ")[0]}
                          </button>
                        ) : null
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <a
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-blue-400 text-xs hover:underline flex items-center gap-1"
                    >
                      Detalhes <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
