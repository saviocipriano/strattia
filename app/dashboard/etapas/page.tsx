"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  CheckCircle2,
  Loader2,
  Clock,
  Flag,
  ClipboardCheck,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // ✅ certo
import { cn } from "@/lib/utils";

type Etapa = {
  id: string;
  titulo: string;
  status: "pendente" | "em_andamento" | "concluida";
  inicio?: Date;
  prazo?: Date;
  observacoes?: string;
  ordem?: number;
};

export default function EtapasPage() {
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const projetosSnap = await getDocs(
          query(collection(db, "projetos"), where("userId", "==", user.uid))
        );

        if (projetosSnap.empty) {
          setEtapas([]);
          setLoading(false);
          return;
        }

        const projetoId = projetosSnap.docs[0].id;

        const etapasSnap = await getDocs(
          query(
            collection(db, `projetos/${projetoId}/etapas`),
            orderBy("ordem", "asc")
          )
        );

        const etapasData = etapasSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            titulo: data.titulo,
            status: data.status,
            inicio: data.inicio?.toDate(),
            prazo: data.prazo?.toDate(),
            observacoes: data.observacoes || "",
            ordem: data.ordem || 0,
          };
        });

        setEtapas(etapasData);
      } catch (error) {
        console.error("Erro ao buscar etapas:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        Checklist de Etapas do Projeto
      </h1>

      {etapas.length === 0 ? (
        <p className="text-gray-500">Nenhuma etapa cadastrada ainda.</p>
      ) : (
        <ul className="space-y-4">
          {etapas.map((etapa, index) => (
            <li
              key={etapa.id}
              className={cn(
                "border rounded-xl p-4 shadow-sm transition-all",
                etapa.status === "concluida"
                  ? "border-green-400 bg-green-50"
                  : etapa.status === "em_andamento"
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-gray-300"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {etapa.status === "concluida" && (
                    <CheckCircle2 className="text-green-600" />
                  )}
                  {etapa.status === "em_andamento" && (
                    <Clock className="text-yellow-600" />
                  )}
                  {etapa.status === "pendente" && (
                    <ClipboardCheck className="text-gray-600" />
                  )}
                  <h2 className="text-lg font-medium">{etapa.titulo}</h2>
                </div>
                <Flag className="text-blue-500" />
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                {etapa.inicio && (
                  <p>
                    Início:{" "}
                    {format(etapa.inicio, "dd 'de' MMMM yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                )}
                {etapa.prazo && (
                  <p>
                    Prazo:{" "}
                    {format(etapa.prazo, "dd 'de' MMMM yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                )}
                {etapa.observacoes && (
                  <p className="text-gray-700">
                    <strong>Obs.:</strong> {etapa.observacoes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
