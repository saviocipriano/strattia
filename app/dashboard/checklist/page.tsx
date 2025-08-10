"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChecklistPage() {
  const [checklist, setChecklist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  async function getProjetoId() {
    if (!user) return null;
    const q = query(collection(db, "projetos"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0].id;
  }

  async function carregarChecklist() {
    const projetoId = await getProjetoId();
    if (!projetoId) return;
    const q = query(
      collection(db, `projetos/${projetoId}/checklist`),
      orderBy("ordem", "asc")
    );
    const snap = await getDocs(q);
    const itens = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setChecklist(itens);
    setLoading(false);
  }

  async function marcarComoFeito(itemId: string) {
    const projetoId = await getProjetoId();
    if (!projetoId) return;
    const ref = doc(db, `projetos/${projetoId}/checklist/${itemId}`);
    await updateDoc(ref, { status: "feito" });
    carregarChecklist();
  }

  useEffect(() => {
    carregarChecklist();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">
        Checklist do Projeto
      </h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : checklist.length === 0 ? (
        <p className="text-zinc-400">Nenhuma etapa definida ainda.</p>
      ) : (
        <ul className="space-y-4">
          {checklist.map((item) => (
            <li
              key={item.id}
              className={cn(
                "p-4 rounded-lg border shadow flex items-start gap-3",
                item.status === "feito"
                  ? "border-green-600 bg-green-900/20"
                  : "border-zinc-700 bg-zinc-900"
              )}
            >
              <button
                onClick={() => marcarComoFeito(item.id)}
                disabled={item.status === "feito"}
                className="mt-1"
              >
                {item.status === "feito" ? (
                  <CheckCircle2 className="text-green-500 w-6 h-6" />
                ) : (
                  <Circle className="text-zinc-500 w-6 h-6 hover:text-blue-500" />
                )}
              </button>
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg">
                  {item.titulo}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {item.descricao || ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
