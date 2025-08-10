"use client";

import { useState } from "react";
import {
  UserCog, Settings, Sun, Moon, Mail, Bell, ShieldCheck,
  Link2, Users, CreditCard, ChevronRight, Loader2
} from "lucide-react";

const tabs = [
  { label: "Conta", icon: UserCog },
  { label: "Preferências", icon: Sun },
  { label: "Notificações", icon: Bell },
  { label: "Segurança", icon: ShieldCheck },
  { label: "Integrações", icon: Link2 },
  { label: "Assinatura", icon: CreditCard },
  { label: "Equipe", icon: Users },
];

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);

  function handleSaveFake() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-2">
          <Settings className="w-7 h-7 text-blue-400" /> Configurações
        </h1>
        <p className="text-zinc-400">Personalize sua conta, preferências e integrações.</p>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition
              ${tab === i ? "bg-blue-700 text-white shadow" : "bg-zinc-800 text-blue-200 hover:bg-blue-800/60"}
            `}
          >
            <t.icon className="w-5 h-5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      {/* Conteúdo das abas */}
      <div className="bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-lg p-8 space-y-8">
        {tab === 0 && (
          // Conta
          <div>
            <h2 className="text-xl font-semibold text-blue-200 mb-4">Informações da Conta</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              <img src="https://ui-avatars.com/api/?name=Savio+Cipriano&background=1e293b&color=fff" alt="avatar" className="w-20 h-20 rounded-full border-4 border-blue-800" />
              <div>
                <div className="text-white text-lg font-bold">Sávio Cipriano</div>
                <div className="text-zinc-400 text-sm">savio@strattia.com</div>
                <div className="text-blue-300 text-xs mt-2">Plano: <span className="bg-blue-950 text-blue-400 px-2 py-1 rounded">Pro</span></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 font-semibold">Telefone</label>
                <input className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600 w-full" defaultValue="(31) 99999-9999" />
              </div>
              <div>
                <label className="text-zinc-400 font-semibold">Nova senha</label>
                <input className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600 w-full" placeholder="Nova senha..." type="password" />
              </div>
            </div>
            <button
              onClick={handleSaveFake}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded font-semibold text-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              Salvar Alterações
            </button>
          </div>
        )}

        {tab === 1 && (
          // Preferências
          <div>
            <h2 className="text-xl font-semibold text-blue-200 mb-4">Preferências</h2>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" defaultChecked />
                Modo escuro ativado
              </label>
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" />
                Receber novidades e dicas por e-mail
              </label>
              <div>
                <label className="text-zinc-400 font-semibold">Idioma</label>
                <select className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600 w-full">
                  <option value="pt-BR">Português</option>
                  <option value="en-US">English</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSaveFake}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded font-semibold text-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              Salvar Preferências
            </button>
          </div>
        )}

        {tab === 2 && (
          // Notificações
          <div>
            <h2 className="text-xl font-semibold text-blue-200 mb-4">Notificações</h2>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" defaultChecked />
                Receber alertas de campanhas
              </label>
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" />
                Receber avisos de vencimento de contratos
              </label>
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" />
                Receber novidades e atualizações
              </label>
            </div>
            <button
              onClick={handleSaveFake}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded font-semibold text-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              Salvar Notificações
            </button>
          </div>
        )}

        {tab === 3 && (
          // Segurança
          <div>
            <h2 className="text-xl font-semibold text-blue-200 mb-4">Segurança</h2>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" defaultChecked />
                Ativar autenticação em dois fatores (2FA)
              </label>
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" />
                Receber alerta em novo login
              </label>
              <label className="flex items-center gap-2 text-zinc-200 font-medium">
                <input type="checkbox" className="accent-blue-600 w-5 h-5" />
                Deslogar de todas as sessões
              </label>
            </div>
            <button
              onClick={handleSaveFake}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded font-semibold text-lg flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              Salvar Segurança
            </button>
          </div>
        )}

        {tab === 4 && (
          // Integrações
          <div>
            <h2 className="text-xl font-semibold text-blue-200 mb-4">Integrações</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-800 rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-100">Meta Ads</div>
                  <div className="text-xs text-zinc-400">Conta conectada</div>
                </div>
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-medium">Desconectar</button>
              </div>
              <div className="bg-zinc-800 rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-100">Google Ads</div>
                  <div className="text-xs text-zinc-400">Não conectado</div>
                </div>
                <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-medium">Conectar</button>
              </div>
              <div className="bg-zinc-800 rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-100">WhatsApp API</div>
                  <div className="text-xs text-zinc-400">Não conectado</div>
                </div>
                <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-medium">Conectar</button>
              </div>
            </div>
          </div>
        )}

        {tab === 5 && (
          // Assinatura/Plano
          <div>
            <h2 className="text-xl font-semibold text-blue-200 mb-4">Assinatura</h2>
            <div className="bg-zinc-800 rounded p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-zinc-100 text-lg mb-1">Plano PRO</div>
                <div className="text-zinc-400 text-sm mb-2">Próxima cobrança: <span className="font-semibold text-white">01/08/2025</span></div>
                <div className="text-zinc-300">Limite de campanhas: <span className="text-blue-400 font-bold">Ilimitado</span></div>
              </div>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded font-semibold mt-3 md:mt-0">Gerenciar Assinatura</button>
            </div>
          </div>
        )}

        {tab === 6 && (
          // Equipe
          <div>
            <h2 className="text-xl font-semibold text-blue-200 mb-4">Equipe</h2>
            <div className="bg-zinc-800 rounded p-6">
              <div className="font-bold text-zinc-100 mb-3">Usuários com acesso:</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <img src="https://ui-avatars.com/api/?name=Savio+Cipriano" className="w-8 h-8 rounded-full" />
                  <span className="text-white">Sávio Cipriano <span className="bg-blue-700 text-xs rounded px-2 py-0.5 ml-2 text-white">Admin</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <img src="https://ui-avatars.com/api/?name=Joao+Pedro" className="w-8 h-8 rounded-full" />
                  <span className="text-zinc-200">João Pedro</span>
                </li>
              </ul>
              <button className="mt-5 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-medium">Convidar novo membro</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
