"use client";

import { useEffect, useState } from "react";
import { UserCog, Camera, CheckCircle2 } from "lucide-react";
import { auth, db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePassword } from "firebase/auth";
import { toast } from "sonner";

export default function PerfilPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [salvo, setSalvo] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    async function carregarDados() {
      if (!user) return;
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNome(data.nome || "");
        setEmail(data.email || "");
        setTelefone(data.telefone || "");
        setAvatar(data.avatar || null);
      }
    }
    carregarDados();
  }, [user]);

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFotoArquivo(file);
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    let avatarURL = avatar;

    try {
      // Upload da nova foto, se houver
      if (fotoArquivo) {
        const storageReference = ref(storage, `usuarios/${user.uid}/avatar.jpg`);
        await uploadBytes(storageReference, fotoArquivo);
        avatarURL = await getDownloadURL(storageReference);
      }

      // Atualiza dados no Firestore
      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          nome,
          email,
          telefone,
          avatar: avatarURL,
          atualizadoEm: serverTimestamp(),
        },
        { merge: true }
      );

      // Atualiza senha, se preenchida
      if (senha) {
        await updatePassword(user, senha);
      }

      toast.success("Perfil atualizado com sucesso!");
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2000);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao atualizar perfil: " + err.message);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <UserCog className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Perfil do Usuário</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="relative group">
            <img
              src={
                avatar ||
                `https://ui-avatars.com/api/?name=${nome.replace(
                  / /g,
                  "+"
                )}&background=1e293b&color=fff`
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-blue-700 object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-blue-700 p-2 rounded-full cursor-pointer hover:bg-blue-800 transition">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFoto}
              />
            </label>
          </div>
          <span className="text-zinc-300 text-sm">
            Clique no ícone para trocar foto
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">Nome</label>
            <input
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-zinc-400 font-semibold">E-mail</label>
            <input
              type="email"
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Telefone</label>
          <input
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 font-semibold">Nova senha</label>
          <input
            type="password"
            className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Deixe em branco para não alterar"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-semibold text-lg transition mt-2"
        >
          Salvar Alterações
        </button>
        {salvo && (
          <div className="flex items-center gap-2 mt-2 text-green-400 font-semibold text-lg">
            <CheckCircle2 className="w-6 h-6" />
            Alterações salvas!
          </div>
        )}
      </form>
    </div>
  );
}
