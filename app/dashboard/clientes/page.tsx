"use client";

import Link from "next/link";
import { PlusCircle, ArrowRight } from "lucide-react";

const mockClientes = [
  {
    id: "CL001",
    nome: "Agro Brasil Ltda",
    email: "contato@agrobrasil.com",
    telefone: "(31) 3333-4444",
    cidade: "Uberlândia",
    estado: "MG",
    status: "Ativo"
  },
  {
    id: "CL002",
    nome: "Loja da Maria",
    email: "maria@lojadamaria.com",
    telefone: "(31) 98888-7777",
    cidade: "Belo Horizonte",
    estado: "MG",
    status: "Inativo"
  },
  {
    id: "CL003",
    nome: "Consultoria XPTO",
    email: "xp@consultoria.com",
    telefone: "(11) 91234-5678",
    cidade: "São Paulo",
    estado: "SP",
    status: "Ativo"
  },
];

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "ativo":
      return "bg-green-600";
    case "inativo":
      return "bg-red-600";
    default:
      return "bg-gray-500";
  }
}

export default function ClientesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">👥 Clientes</h1>
          <p className="text-zinc-400 mt-1">Cadastre, edite e visualize todos os clientes da sua operação.</p>
        </div>
        <Link
          href="/dashboard/clientes/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition"
        >
          <PlusCircle className="w-5 h-5" /> Novo Cliente
        </Link>
      </div>
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="bg-zinc-900">
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">#</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Nome</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">E-mail</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Telefone</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Cidade/UF</th>
              <th className="py-3 px-4 text-left text-zinc-400 font-semibold">Status</th>
              <th className="py-3 px-4 text-right text-zinc-400 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockClientes.map((c) => (
              <tr
                key={c.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/50 transition"
              >
                <td className="py-3 px-4 font-semibold text-blue-400">{c.id}</td>
                <td className="py-3 px-4 text-white">{c.nome}</td>
                <td className="py-3 px-4 text-zinc-300">{c.email}</td>
                <td className="py-3 px-4 text-zinc-300">{c.telefone}</td>
                <td className="py-3 px-4 text-zinc-300">{c.cidade} / {c.estado}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full font-semibold text-xs ${statusColor(c.status)} text-white`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/dashboard/clientes/${c.id}`}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    Detalhes <ArrowRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mockClientes.length === 0 && (
          <div className="text-center text-zinc-400 py-20">
            Nenhum cliente cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}
