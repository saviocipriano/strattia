"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function NovaEtapaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [status, setStatus] = useState<"pendente" | "em_andamento" | "concluida">("pendente");
  const [inicio, setInicio] = useState<Date | undefined>(new Date());
  const [prazo, setPrazo] = useState<Date | undefined>();
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [projetoId, setProjetoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjetoId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "projetos"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setProjetoId(snapshot.docs[0].id);
      }
    };

    fetchProjetoId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projetoId || !titulo) return;

    setLoading(true);

    try {
      const etapasRef = collection(db, `projetos/${projetoId}/etapas`);
      await addDoc(etapasRef, {
        titulo,
        status,
        inicio: inicio ? new Date(inicio) : null,
        prazo: prazo ? new Date(prazo) : null,
        observacoes,
        ordem: Date.now(),
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard/etapas");
    } catch (error) {
      console.error("Erro ao salvar etapa:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        Nova Etapa do Projeto
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Título da Etapa</Label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "pendente" | "em_andamento" | "concluida")
            }
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>

        <div>
          <Label>Data de Início</Label>
          <Calendar mode="single" selected={inicio} onSelect={setInicio} />
        </div>

        <div>
          <Label>Prazo Final</Label>
          <Calendar mode="single" selected={prazo} onSelect={setPrazo} />
        </div>

        <div>
          <Label>Observações</Label>
          <Textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
            </span>
          ) : (
            "Salvar Etapa"
          )}
        </Button>
      </form>
    </div>
  );
}
