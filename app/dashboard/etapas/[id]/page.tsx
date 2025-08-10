"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/Textarea"; // ✅ corrigido aqui
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function EditarEtapaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [status, setStatus] = useState<"pendente" | "em_andamento" | "concluida">("pendente");
  const [inicio, setInicio] = useState<Date | undefined>();
  const [prazo, setPrazo] = useState<Date | undefined>();
  const [observacoes, setObservacoes] = useState("");
  const [projetoId, setProjetoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEtapa = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const projetosSnap = await getDocs(
          query(collection(db, "projetos"), where("userId", "==", user.uid))
        );

        if (projetosSnap.empty) return;

        const projetoId = projetosSnap.docs[0].id;
        setProjetoId(projetoId);

        const etapaRef = doc(db, `projetos/${projetoId}/etapas/${id}`);
        const etapaSnap = await getDoc(etapaRef);

        if (etapaSnap.exists()) {
          const data = etapaSnap.data();
          setTitulo(data.titulo);
          setStatus(data.status);
          setInicio(data.inicio?.toDate());
          setPrazo(data.prazo?.toDate());
          setObservacoes(data.observacoes || "");
        }
      } catch (error) {
        console.error("Erro ao buscar etapa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEtapa();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projetoId || !id) return;

    setSaving(true);

    try {
      const etapaRef = doc(db, `projetos/${projetoId}/etapas/${id}`);
      await updateDoc(etapaRef, {
        titulo,
        status,
        inicio: inicio || null,
        prazo: prazo || null,
        observacoes,
      });

      router.push("/dashboard/etapas");
    } catch (error) {
      console.error("Erro ao atualizar etapa:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Editar Etapa</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Título</Label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
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
          <Calendar selected={inicio} onSelect={setInicio} />
        </div>

        <div>
          <Label>Prazo Final</Label>
          <Calendar selected={prazo} onSelect={setPrazo} />
        </div>

        <div>
          <Label>Observações</Label>
          <Textarea
            value={observacoes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setObservacoes(e.target.value)
            }
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
            </span>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </div>
  );
}
