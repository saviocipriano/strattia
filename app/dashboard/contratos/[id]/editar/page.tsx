"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const clientesMock = [
  { id: "CL001", nome: "Agro Brasil Ltda" },
  { id: "CL002", nome: "Loja da Maria" },
  { id: "CL003", nome: "Consultoria XPTO" }
];

const mockContrato = {
  id: "CT001",
  cliente: "Agro Brasil Ltda",
  tipo: "Gestão de Tráfego",
  valor: 3500,
  inicio: "2024-05-01",
  fim: "2025-05-01",
  status: "Ativo"
};

export default function EditarContratoPage() {
  const router = useRouter();
  const params = useParams();
  const [contrato, setContrato] = useState(mockContrato);
  const [salvo, setSalvo] = useState(false);

  function handleChange(e: any) {
    setContrato({ ...contrato, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => {
      router.push(`/dashboard/contratos/${contrato.id}`);
    }, 1200);
  }

  if (salvo) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh]">
        <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-green-200 mb-2">Alterações salvas!</h2>
        <p className="text-zinc-400 text-center">
          Redirecionando para detalhes do contrato...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        className="flex items-center gap-2 text-blue-300 hover:text-blue-500 mb-6"
        onClick={() => router.push(`/dashboard/contratos/${contrato.id}`)}
      >
        <ArrowLeft className="w-5 h-5" /> Voltar para contrato
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-blue-200 mb-4">Editar Contrato</h1>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Cliente</label>
          <select
            required
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            name="cliente"
            value={contrato.cliente}
            onChange={handleChange}
          >
            <option value="">Selecione o cliente</option>
            {clientesMock.map((cli) => (
              <option key={cli.id} value={cli.nome}>{cli.nome}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Tipo de contrato</label>
          <input
            required
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            name="tipo"
            value={contrato.tipo}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Valor (R$)</label>
          <input
            required
            type="number"
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            name="valor"
            value={contrato.valor}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Início</label>
            <input
              required
              type="date"
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="inicio"
              value={contrato.inicio}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Término</label>
            <input
              required
              type="date"
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="fim"
              value={contrato.fim}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Status</label>
          <select
            required
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            name="status"
            value={contrato.status}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="Ativo">Ativo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Vencendo">Vencendo</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-semibold text-lg transition mt-4"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
