"use client";

import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

const mockPropostas = [
  {
    id: "P001",
    cliente: "João Pedro Silva",
    valor: 2400,
    status: "Aprovada",
    enviadaEm: "2024-06-10",
    validade: "2024-07-10",
    descricao: "Gestão de tráfego para Google e Meta, suporte mensal e relatórios semanais.",
  },
  {
    id: "P002",
    cliente: "Empresa AgroMais",
    valor: 1800,
    status: "Em análise",
    enviadaEm: "2024-06-25",
    validade: "2024-07-25",
    descricao: "Campanhas patrocinadas, consultoria de SEO e criação de landing page.",
  },
  {
    id: "P003",
    cliente: "Maria Costa",
    valor: 1200,
    status: "Rejeitada",
    enviadaEm: "2024-06-20",
    validade: "2024-07-20",
    descricao: "Consultoria para anúncios e treinamento da equipe interna.",
  },
];

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "aprovada":
      return "bg-green-600";
    case "rejeitada":
      return "bg-red-500";
    case "em análise":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

export default function PropostaDetalhePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const proposta = mockPropostas.find((p) => p.id === id);

  if (!proposta)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <span className="text-xl text-red-500 font-bold mb-3">Proposta não encontrada.</span>
        <button
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded mt-2"
          onClick={() => router.push("/dashboard/propostas")}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para lista
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        className="flex items-center gap-2 text-blue-300 hover:text-blue-500 mb-6"
        onClick={() => router.push("/dashboard/propostas")}
      >
        <ArrowLeft className="w-5 h-5" /> Voltar para propostas
      </button>
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-200 flex items-center gap-3">
            {proposta.id} — {proposta.cliente}
          </h2>
          <Badge className={`${statusColor(proposta.status)} text-white text-base`}>
            {proposta.status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-200">
          <div>
            <div className="mb-2">
              <span className="font-semibold text-zinc-400">Enviada em: </span>
              {proposta.enviadaEm}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-zinc-400">Validade: </span>
              {proposta.validade}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-zinc-400">Valor: </span>
              <span className="text-green-400 font-semibold">
                R$ {proposta.valor.toLocaleString()}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <span className="font-semibold text-zinc-400">Status: </span>
              <Badge className={`${statusColor(proposta.status)} text-white`}>
                {proposta.status}
              </Badge>
            </div>
          </div>
        </div>
        <div>
          <span className="block font-semibold text-zinc-400 mb-2">
            Descrição / Itens:
          </span>
          <div className="bg-zinc-800 rounded p-4 text-zinc-100">
            {proposta.descricao}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition">
            <Edit2 className="w-4 h-4" /> Editar
          </button>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition">
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
