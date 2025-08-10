"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function NovaPropostaPage() {
  const router = useRouter();
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aqui você faria o POST para o banco de dados (Firebase, etc)
    setEnviado(true);
    setTimeout(() => {
      router.push("/dashboard/propostas");
    }, 1500);
  }

  if (enviado) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh]">
        <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-green-200 mb-2">Proposta enviada!</h2>
        <p className="text-zinc-400 text-center">
          Sua proposta foi cadastrada e já aparece na listagem.<br />
          Redirecionando...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        className="flex items-center gap-2 text-blue-300 hover:text-blue-500 mb-6"
        onClick={() => router.push("/dashboard/propostas")}
      >
        <ArrowLeft className="w-5 h-5" /> Voltar para propostas
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-blue-200 mb-4">Nova Proposta</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Cliente</label>
            <input
              required
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              placeholder="Nome do cliente"
              name="cliente"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Valor</label>
            <input
              required
              type="number"
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              placeholder="Ex: 1500"
              name="valor"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Data de envio</label>
            <input
              required
              type="date"
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="enviadaEm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Validade</label>
            <input
              required
              type="date"
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              name="validade"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Status</label>
          <select
            required
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            name="status"
          >
            <option value="">Selecione</option>
            <option value="Aprovada">Aprovada</option>
            <option value="Em análise">Em análise</option>
            <option value="Rejeitada">Rejeitada</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Descrição / Itens da Proposta</label>
          <textarea
            required
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600 min-h-[90px]"
            placeholder="Descreva os serviços, itens ou detalhes da proposta"
            name="descricao"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold text-lg transition mt-4"
        >
          Enviar Proposta
        </button>
      </form>
    </div>
  );
}
