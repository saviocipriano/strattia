"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, ArrowRight } from "lucide-react";

// Mock de propostas para demonstração
const mockPropostas = [
  {
    id: "P001",
    cliente: "João Pedro Silva",
    valor: 2400,
    status: "Aprovada",
    enviadaEm: "2024-06-10",
    validade: "2024-07-10",
  },
  {
    id: "P002",
    cliente: "Empresa AgroMais",
    valor: 1800,
    status: "Em análise",
    enviadaEm: "2024-06-25",
    validade: "2024-07-25",
  },
  {
    id: "P003",
    cliente: "Maria Costa",
    valor: 1200,
    status: "Rejeitada",
    enviadaEm: "2024-06-20",
    validade: "2024-07-20",
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

export default function PropostasPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">📄 Propostas</h1>
          <p className="text-zinc-400 mt-1">
            Acompanhe todas as propostas enviadas, aprovadas, rejeitadas e em análise.
          </p>
        </div>
        <Link
          href="/dashboard/propostas/nova"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition"
        >
          <PlusCircle className="w-5 h-5" /> Nova Proposta
        </Link>
      </div>
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-zinc-900">
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">#</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Cliente</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Valor</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Status</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Enviada em</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Validade</th>
              <th className="py-3 px-4 text-right text-zinc-400 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockPropostas.map((p) => (
              <tr
                key={p.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
              >
                <td className="py-3 px-4 font-semibold text-blue-400">{p.id}</td>
                <td className="py-3 px-4 text-white">{p.cliente}</td>
                <td className="py-3 px-4 text-white">R$ {p.valor.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <Badge className={`${statusColor(p.status)} text-white`}>
                    {p.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-zinc-300">{p.enviadaEm}</td>
                <td className="py-3 px-4 text-zinc-300">{p.validade}</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/dashboard/propostas/${p.id}`}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Detalhes <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mockPropostas.length === 0 && (
          <div className="text-center text-zinc-400 py-20">
            Nenhuma proposta encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
