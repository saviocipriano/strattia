"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Edit, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

const mockContrato = {
  id: "CT001",
  cliente: "Agro Brasil Ltda",
  tipo: "Gestão de Tráfego",
  valor: 3500,
  inicio: "2024-05-01",
  fim: "2025-05-01",
  status: "Ativo",
  observacao: "Inclui gestão de Meta e Google Ads, suporte mensal incluso."
};

export default function ContratoDetalhePage() {
  const router = useRouter();
  const params = useParams();

  const [contrato, setContrato] = useState(mockContrato);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [excluido, setExcluido] = useState(false);

  function handleExcluir() {
    setExcluido(true);
    setTimeout(() => {
      router.push("/dashboard/contratos");
    }, 1400);
  }

  if (excluido) {
    return (
      <div className="flex flex-col items-center justify-center h-[65vh]">
        <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-green-200 mb-2">Contrato excluído!</h2>
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
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-200 mb-2">{contrato.cliente}</h1>
            <div className="flex gap-3 text-zinc-300 mb-2">
              <span className="font-semibold">{contrato.tipo}</span>
              <span className="ml-2 text-zinc-400">R$ {contrato.valor.toLocaleString("pt-BR")}</span>
            </div>
            <div className="text-zinc-400 mb-2">
              Início: {contrato.inicio} · Término: {contrato.fim} ·
              <span className={`font-bold ml-2 ${contrato.status === "Ativo" ? "text-green-400" : contrato.status === "Finalizado" ? "text-gray-400" : "text-yellow-400"}`}>
                {contrato.status}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/dashboard/contratos/${contrato.id}/editar`)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
            >
              <Edit className="w-4 h-4" /> Editar
            </button>
            <button
              onClick={() => setConfirmarExclusao(true)}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
            >
              <Trash2 className="w-4 h-4" /> Excluir
            </button>
          </div>
        </div>
        <div className="text-zinc-300 mt-6">
          <span className="font-semibold">Observação: </span>{contrato.observacao}
        </div>
      </div>

      {/* Modal de confirmação */}
      {confirmarExclusao && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-700 flex flex-col items-center max-w-md w-full">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
            <div className="text-white text-xl font-bold mb-2">Excluir contrato?</div>
            <div className="text-zinc-400 mb-6 text-center">
              Essa ação não poderá ser desfeita. Todos os dados associados serão removidos.
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleExcluir}
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded font-semibold"
              >
                Excluir
              </button>
              <button
                onClick={() => setConfirmarExclusao(false)}
                className="bg-zinc-700 hover:bg-zinc-800 text-white px-5 py-2 rounded font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
