"use client";

import { useEffect, useState, useRef } from "react";
import { db, auth, storage } from "@/lib/firebase";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, collection,
  addDoc, serverTimestamp, onSnapshot
} from "firebase/firestore";
import {
  ref as storageRef, uploadBytes, getDownloadURL
} from "firebase/storage";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, ChevronRight, Loader2, UploadCloud, SendHorizonal,
  Star, Trophy, BookOpenCheck, Video, UserCircle
} from "lucide-react";
import { motion } from "framer-motion";

const ACESSOS = [
  {
    id: "meta",
    label: "Meta Business Suite",
    instrucao: "Compartilhe acesso ao seu Meta Ads.",
    tutorial: "https://www.youtube.com/watch?v=fake-tutorial-meta"
  },
  {
    id: "google",
    label: "Google Ads",
    instrucao: "Envie acesso de administrador ao Google Ads.",
    tutorial: "https://www.youtube.com/watch?v=fake-tutorial-google"
  },
  {
    id: "site",
    label: "Domínio/Site",
    instrucao: "Envie informações do domínio ou painel do site.",
    tutorial: "https://www.youtube.com/watch?v=fake-tutorial-site"
  },
  {
    id: "creative",
    label: "Materiais Criativos",
    instrucao: "Faça upload de logos, fotos e criativos.",
    tutorial: "https://www.youtube.com/watch?v=fake-tutorial-creative"
  },
];

export default function ProjetoDashboard() {
  const [loading, setLoading] = useState(true);
  const [projeto, setProjeto] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [acessos, setAcessos] = useState<any>({});
  const [checklist, setChecklist] = useState<any[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (usr) => {
      setUser(usr);
      if (!usr) { setLoading(false); return; }
      const docRef = doc(db, "projetos", usr.uid);
      const unsubSnap = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProjeto(data);
          setAcessos(data.acessos || {});
          setChecklist(data.checklist || []);
        } else {
          setProjeto(null);
        }
        setLoading(false);
      });

      // Mensagens em subcoleção
      const mensagensRef = collection(db, "projetos", usr.uid, "mensagens");
      const unsubMsg = onSnapshot(mensagensRef, (snap) => {
        const msgs: any[] = [];
        snap.forEach(doc => msgs.push(doc.data()));
        setMensagens(msgs.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)));
      });

      return () => {
        unsubSnap();
        unsubMsg();
      };
    });
    return () => unsub();
  }, []);

  // Progresso gamificado
  const etapasTotais = ACESSOS.length + (checklist?.length || 0);
  const etapasConcluidas =
    (Object.values(acessos).filter((a: any) => a && a.status === "concluido").length) +
    (checklist?.filter((c: any) => c.concluido).length || 0);
  const progresso = etapasTotais > 0 ? Math.round((etapasConcluidas / etapasTotais) * 100) : 0;

  // Iniciar projeto se não existir
  async function criarProjetoBase() {
    if (!user) return;
    setLoading(true);
    await setDoc(doc(db, "projetos", user.uid), {
      status: "Onboarding",
      checklist: [
        { titulo: "Preencher briefing", concluido: false },
        { titulo: "Reunião inicial agendada", concluido: false },
        { titulo: "Aprovar plano de ação", concluido: false },
        { titulo: "Campanha em lançamento", concluido: false },
      ],
      acessos: {},
      gamification: { nivel: "Novo", pontos: 0, badges: [] },
      createdAt: serverTimestamp(),
    });
    setLoading(false);
  }

  // Upload de acesso (arquivo ou info)
  async function handleAcessoUpload(id: string, e: any) {
    if (!user) return;
    setUploading(id);
    const file = e.target.files[0];
    const sRef = storageRef(storage, `projetos/${user.uid}/acessos/${id}/${file.name}`);
    await uploadBytes(sRef, file);
    const url = await getDownloadURL(sRef);
    await updateDoc(doc(db, "projetos", user.uid), {
      [`acessos.${id}`]: { status: "concluido", url, nome: file.name, data: new Date().toISOString() }
    });
    setUploading(null);
  }

  // Marcar tarefa do checklist
  async function marcarChecklist(index: number) {
    if (!user) return;
    const newChecklist = checklist.map((item, i) =>
      i === index ? { ...item, concluido: !item.concluido } : item
    );
    await updateDoc(doc(db, "projetos", user.uid), { checklist: newChecklist });
  }

  // Mensagem
  async function enviarMensagem(e: any) {
    e.preventDefault();
    if (!user || !mensagem.trim()) return;
    const mensagensRef = collection(db, "projetos", user.uid, "mensagens");
    await addDoc(mensagensRef, {
      remetente: user.displayName || user.email,
      texto: mensagem,
      createdAt: serverTimestamp(),
    });
    setMensagem("");
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="flex flex-col items-center gap-6 p-12">
        <h2 className="text-2xl font-bold text-gray-700">Bem-vindo ao seu Hub de Sucesso!</h2>
        <button
          onClick={criarProjetoBase}
          className="bg-gradient-to-r from-blue-700 to-purple-600 text-white px-8 py-4 rounded-xl hover:scale-105 transition font-bold shadow-lg"
        >
          Iniciar Onboarding
        </button>
      </div>
    );
  }

  return (
    <div className="p-0 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Premium */}
      <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-700 to-purple-700 p-7 rounded-2xl shadow-lg">
          <UserCircle className="text-white" size={54} />
          <div>
            <h1 className="text-3xl text-white font-extrabold tracking-tight mb-1">Olá, {user.displayName || user.email} 👋</h1>
            <p className="text-white/90">Bem-vindo à sua área exclusiva Strattia! Complete o onboarding abaixo e acompanhe seu projeto em tempo real.</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <span className="text-white font-bold text-lg">{progresso}% completo</span>
            <Progress value={progresso} className="w-40 h-3 bg-white/30" />
            <span className="text-white text-xs font-semibold mt-1">Nível: {projeto.gamification?.nivel || "Novo"}</span>
          </div>
        </div>
      </motion.div>

    {/* Cards de Acesso */}
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
  <div className="grid md:grid-cols-2 gap-7">
    {ACESSOS.map(acesso => (
      <div key={acesso.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-3 border-t-4 border-blue-600 relative">
        <div className="flex items-center gap-3">
          <BookOpenCheck className="text-blue-700" size={28} />
          <span className="text-lg font-semibold text-gray-900">{acesso.label}</span>
          {acessos[acesso.id]?.status === "concluido" && (
            <CheckCircle2 className="text-green-600 ml-2" size={22} />
          )}
        </div>
        <span className="text-gray-500 text-base">{acesso.instrucao}</span>
        <a
          href={acesso.tutorial}
          className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Video size={16} /> Ver tutorial rápido
        </a>
        {acessos[acesso.id]?.status === "concluido" ? (
          <a
            href={acessos[acesso.id]?.url}
            className="mt-2 text-blue-700 underline font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            Baixar arquivo enviado
          </a>
        ) : (
          <label className="mt-1 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition disabled:opacity-60 cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={e => handleAcessoUpload(acesso.id, e)}
              disabled={uploading === acesso.id}
            />
            {uploading === acesso.id ? "Enviando..." : "Enviar arquivo"}
          </label>
        )}
      </div>
    ))}
  </div>
</motion.div>

      {/* Checklist Gamificado */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="bg-white rounded-2xl shadow p-7 mt-4">
          <h2 className="text-xl font-bold text-purple-700 mb-2 flex items-center gap-2">
            <Star className="text-yellow-400" size={22} /> Missões do Projeto
          </h2>
          <ul className="space-y-3">
            {checklist.map((item: any, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <button
                  onClick={() => marcarChecklist(i)}
                  className={`rounded-full border-2 p-1 transition ${item.concluido ? 'border-green-500 bg-green-100' : 'border-purple-400 bg-purple-50'}`}
                  aria-label="Concluir etapa"
                >
                  {item.concluido
                    ? <CheckCircle2 className="text-green-500" size={22} />
                    : <ChevronRight className="text-purple-500" size={22} />}
                </button>
                <span className={`text-base font-medium ${item.concluido ? "line-through text-gray-400" : ""}`}>{item.titulo}</span>
                {item.concluido && <Trophy className="text-yellow-400 ml-2" size={18} />}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Chat Inteligente e Timeline */}
      <div className="flex flex-col lg:flex-row gap-7">
        {/* Chat */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
          <div className="bg-white rounded-2xl shadow p-7">
            <h2 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
              <SendHorizonal className="text-blue-600" size={20} /> Fale com seu gestor
            </h2>
            <div className="max-h-52 overflow-y-auto mb-3 border rounded-md p-3 bg-gray-50">
              {mensagens.length === 0 && (
                <span className="text-gray-400">Nenhuma mensagem ainda.</span>
              )}
              {mensagens.map((msg: any, i: number) => (
                <div key={i} className="mb-2">
                  <span className="font-semibold text-blue-700">{msg.remetente || "Cliente"}: </span>
                  <span>{msg.texto}</span>
                  <span className="block text-xs text-gray-400">{msg.createdAt?.toDate?.().toLocaleString?.() || ""}</span>
                </div>
              ))}
            </div>
            <form onSubmit={enviarMensagem} className="flex gap-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="Digite sua mensagem..."
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-700 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
                disabled={loading || !mensagem.trim()}
              >
                Enviar
              </button>
            </form>
          </div>
        </motion.div>
        {/* Timeline animada */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex-1">
          <div className="bg-white rounded-2xl shadow p-7">
            <h2 className="text-lg font-bold text-blue-700 mb-2 flex items-center gap-2">
              <ChevronRight className="text-purple-600" size={22} /> Linha do Tempo
            </h2>
            <ul className="timeline flex flex-col gap-5">
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-blue-700 block" /> Início do onboarding
              </li>
              {checklist.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full ${item.concluido ? "bg-green-500" : "bg-gray-300"} block`} />
                  {item.titulo}
                  {item.concluido && <CheckCircle2 className="text-green-500 ml-1" size={18} />}
                </li>
              ))}
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-yellow-500 block" /> Lançamento das campanhas
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
