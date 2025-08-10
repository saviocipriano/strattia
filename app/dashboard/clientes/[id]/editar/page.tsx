"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const mockCliente = {
  id: "CL001",
  nome: "Agro Brasil Ltda",
  email: "contato@agrobrasil.com",
  telefone: "(31) 3333-4444",
  cidade: "Uberlândia",
  estado: "MG",
  status: "Ativo"
};

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const [cliente, setCliente] = useState(mockCliente);
  const [salvo, setSalvo] = useState(false);

  function handleChange(e: any) {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => {
      router.push(`/dashboard/clientes/${cliente.id}`);
    }, 1200);
  }

  if (salvo) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh]">
        <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-green-200 mb-2">Alterações salvas!</h2>
        <p className="text-zinc-400 text-center">
          Redirecionando para detalhes do cliente...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        className="flex items-center gap-2 text-blue-300 hover:text-blue-500 mb-6"
        onClick={() => router.push(`/dashboard/clientes/${cliente.id}`)}
      >
        <ArrowLeft className="w-5 h-5" /> Voltar para cliente
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-blue-200 mb-4">Editar Cliente</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Nome</label>
            <input
              required
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="nome"
              value={cliente.nome}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">E-mail</label>
            <input
              required
              type="email"
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="email"
              value={cliente.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Telefone</label>
            <input
              required
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="telefone"
              value={cliente.telefone}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Cidade</label>
            <input
              required
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="cidade"
              value={cliente.cidade}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Estado (UF)</label>
          <input
            required
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            name="estado"
            value={cliente.estado}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Status</label>
          <select
            required
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            name="status"
            value={cliente.status}
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
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
