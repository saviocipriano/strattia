"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { Inbox, FileText } from "lucide-react";
import { toast } from "sonner";

export default function MateriaisPage() {
  const [arquivos, setArquivos] = useState<FileList | null>(null);
  const [materiais, setMateriais] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  async function buscarProjetoId() {
    if (!user) return null;
    const q = query(collection(db, "projetos"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    return snap.empty ? null : snap.docs[0].id;
  }

  async function carregarMateriais() {
    const projetoId = await buscarProjetoId();
    if (!projetoId) return;
    const snap = await getDocs(collection(db, `projetos/${projetoId}/materiais`));
    const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMateriais(lista);
  }

  useEffect(() => {
    carregarMateriais();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivos || !user) return;

    setLoading(true);
    const projetoId = await buscarProjetoId();
    if (!projetoId) return;

    try {
      for (let i = 0; i < arquivos.length; i++) {
        const file = arquivos[i];
        const storagePath = `materiais/${user.uid}/${file.name}`;
        const fileRef = storageRef(storage, storagePath);

        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        await addDoc(collection(db, `projetos/${projetoId}/materiais`), {
          nomeArquivo: file.name,
          tipo: file.type,
          url,
          criadoEm: Timestamp.now(),
        });
      }

      toast.success("Arquivos enviados com sucesso!");
      setArquivos(null);
      await carregarMateriais();
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao enviar: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-4">Upload de Materiais</h1>

      <form
        onSubmit={handleUpload}
        className="border-2 border-dashed border-blue-500 bg-zinc-900 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center"
      >
        <Inbox className="w-12 h-12 text-blue-400" />
        <p className="text-zinc-300">
          Selecione os arquivos abaixo e clique em <strong>Enviar</strong>
        </p>
        <input
          type="file"
          multiple
          onChange={(e) => setArquivos(e.target.files)}
          className="text-white"
        />
        <button
          type="submit"
          disabled={loading || !arquivos}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition mt-2"
        >
          {loading ? "Enviando..." : "Enviar Arquivos"}
        </button>
      </form>

      {materiais.length > 0 && (
        <div className="mt-10">
          <h2 className="text-white text-lg font-semibold mb-2">
            Arquivos Enviados
          </h2>
          <ul className="space-y-3">
            {materiais.map((mat) => (
              <li
                key={mat.id}
                className="bg-zinc-800 rounded-md px-4 py-3 flex items-center justify-between text-white border border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {mat.nomeArquivo}
                  </a>
                </div>
                <span className="text-sm text-zinc-400">
                  {new Date(mat.criadoEm?.seconds * 1000).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
