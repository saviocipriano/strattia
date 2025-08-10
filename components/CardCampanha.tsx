// components/CardCampanha.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PauseCircle, XCircle } from "lucide-react";

interface CardCampanhaProps {
  campanha: {
    id: string;
    nome: string;
    plataforma: string;
    status: string;
    ia: boolean;
    impressoes?: number;
    cliques?: number;
    conversoes?: number;
  };
}

export default function CardCampanha({ campanha }: { campanha: CardCampanhaProps["campanha"] }) {
  function getStatusBadge(status: string) {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-100 text-green-700 border-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Ativo</Badge>;
      case "pausado":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-400 flex items-center gap-1"><PauseCircle className="w-4 h-4" />Pausado</Badge>;
      case "finalizado":
        return <Badge className="bg-gray-200 text-gray-700 border-gray-400 flex items-center gap-1"><XCircle className="w-4 h-4" />Finalizado</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground border-muted-foreground">-</Badge>;
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 24px #1e293b44" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-blue-900 shadow-xl p-6 flex flex-col gap-3 min-w-[290px] max-w-xs"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-blue-100">{campanha.nome}</h3>
        {getStatusBadge(campanha.status)}
      </div>
      <span className="text-sm text-blue-200">{campanha.plataforma}</span>
      <div className="flex gap-4 mt-2 mb-1">
        <div className="text-center">
          <span className="font-bold text-lg text-blue-300">{campanha.impressoes ?? 0}</span>
          <div className="text-xs text-blue-200">Impressões</div>
        </div>
        <div className="text-center">
          <span className="font-bold text-lg text-blue-300">{campanha.cliques ?? 0}</span>
          <div className="text-xs text-blue-200">Cliques</div>
        </div>
        <div className="text-center">
          <span className="font-bold text-lg text-blue-300">{campanha.conversoes ?? 0}</span>
          <div className="text-xs text-blue-200">Conversões</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm">{campanha.ia ? "IA: Sim" : "IA: Não"}</span>
        <Link href={`/dashboard/campanhas/${campanha.id}`} className="text-blue-300 font-semibold hover:underline text-sm">
          Ver detalhes →
        </Link>
      </div>
    </motion.div>
  );
}
