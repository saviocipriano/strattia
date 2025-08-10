"use client";

import Link from "next/link";
import { PlusCircle, ArrowRight } from "lucide-react";

const mockContratos = [
  {
    id: "CT001",
    cliente: "Agro Brasil Ltda",
    tipo: "Gestão de Tráfego",
    valor: 3500,
    inicio: "2024-05-01",
    fim: "2025-05-01",
    status: "Ativo"
  },
  {
    id: "CT002",
    cliente: "Loja da Maria",
    tipo: "Consultoria",
    valor: 1500,
    inicio: "2024-03-15",
    fim: "2024-09-15",
    status: "Finalizado"
  },
  {
    id: "CT003",
    cliente: "Consultoria XPTO",
    tipo: "Plano PRO",
    valor: 2400,
    inicio: "2024-10-01",
    fim: "2025-10-01",
    status: "Vencendo"
  },
];

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "ativo":
      return "bg-green-600";
    case "finalizado":
      return "bg-gray-600";
    case "vencendo":
      return "bg-yellow-600";
    default:
      return "bg-gray-500";
  }
}

export default function ContratosPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">📑 Contratos</h1>
          <p className="text-zinc-400 mt-1">Gerencie seus contratos, status e vínculo com clientes.</p>
        </div>
        <Link
          href="/dashboard/contratos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition"
        >
          <PlusCircle className="w-5 h-5" /> Novo Contrato
        </Link>
      </div>
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="bg-zinc-900">
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">#</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Cliente</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Tipo</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Valor (R$)</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Início</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Fim</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Status</th>
              <th className="py-3 px-4 text-right text-zinc-400 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockContratos.map((c) => (
              <tr
                key={c.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
              >
                <td className="py-3 px-4 font-semibold text-blue-400">{c.id}</td>
                <td className="py-3 px-4 text-white">{c.cliente}</td>
                <td className="py-3 px-4 text-zinc-300">{c.tipo}</td>
                <td className="py-3 px-4 text-zinc-300">{c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td className="py-3 px-4 text-zinc-300">{c.inicio}</td>
                <td className="py-3 px-4 text-zinc-300">{c.fim}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full font-semibold text-xs ${statusColor(c.status)} text-white`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/dashboard/contratos/${c.id}`}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Detalhes <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mockContratos.length === 0 && (
          <div className="text-center text-zinc-400 py-20">
            Nenhum contrato cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
