"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const clientesMock = [
  { id: "CL001", nome: "Agro Brasil Ltda" },
  { id: "CL002", nome: "Loja da Maria" },
  { id: "CL003", nome: "Consultoria XPTO" }
];

export default function NovoContratoPage() {
  const router = useRouter();
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      router.push("/dashboard/contratos");
    }, 1200);
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh]">
        <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-green-200 mb-2">Contrato cadastrado!</h2>
        <p className="text-zinc-400 text-center">
          Redirecionando para a listagem...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        className="flex items-center gap-2 text-blue-300 hover:text-blue-500 mb-6"
        onClick={() => router.push("/dashboard/contratos")}
      >
        <ArrowLeft className="w-5 h-5" /> Voltar para contratos
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-blue-200 mb-4">Novo Contrato</h1>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Cliente</label>
          <select required className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600" name="cliente">
            <option value="">Selecione o cliente</option>
            {clientesMock.map((cli) => (
              <option key={cli.id} value={cli.nome}>{cli.nome}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Tipo de contrato</label>
          <input required className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600" placeholder="Ex: Gestão de Tráfego" name="tipo" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Valor (R$)</label>
          <input required type="number" className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600" placeholder="Ex: 1500" name="valor" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Início</label>
            <input required type="date" className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600" name="inicio" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Término</label>
            <input required type="date" className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600" name="fim" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Status</label>
          <select required className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600" name="status">
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
          Cadastrar Contrato
        </button>
      </form>
    </div>
  );
}
