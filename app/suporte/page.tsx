"use client";

import { useState } from "react";
import { LifeBuoy, ChevronDown, ChevronUp, Mail, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";

const faqs = [
  {
    pergunta: "Como conectar minha conta do Google Ads?",
    resposta:
      "Vá em Configurações > Integrações e clique em 'Conectar' na linha do Google Ads. Siga o passo a passo de autenticação. Se precisar de ajuda, fale com nosso suporte!",
  },
  {
    pergunta: "Posso migrar minhas campanhas existentes?",
    resposta:
      "Sim! Você pode importar campanhas existentes durante o cadastro ou acessar o módulo Campanhas e usar a opção 'Importar'.",
  },
  {
    pergunta: "Meu painel está com lentidão, o que faço?",
    resposta:
      "Limpe o cache do navegador, tente em aba anônima ou confira o status do sistema abaixo. Se persistir, abra um chamado com detalhes do problema.",
  },
  {
    pergunta: "Como faço upgrade do meu plano?",
    resposta:
      "Em Configurações > Assinatura, clique em 'Gerenciar Assinatura'. Siga o fluxo de upgrade na plataforma.",
  },
];

export default function SuportePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleFaq(i: number) {
    setFaqOpen(faqOpen === i ? null : i);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setEnviado(true);
      setLoading(false);
    }, 1400);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <LifeBuoy className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Ajuda & Suporte</h1>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-blue-300 mb-3">Perguntas frequentes</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-900/80 rounded-lg border border-zinc-800">
              <button
                onClick={() => handleFaq(i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left font-semibold text-blue-200 focus:outline-none"
              >
                {faq.pergunta}
                {faqOpen === i ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {faqOpen === i && (
                <div className="px-5 pb-4 text-zinc-300 border-t border-zinc-800">{faq.resposta}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulário */}
      <div className="mb-10 bg-zinc-900/80 border border-zinc-800 rounded-xl p-7">
        <h2 className="text-xl font-semibold text-blue-300 mb-2">Abrir um chamado</h2>
        {enviado ? (
          <div className="flex flex-col items-center gap-2 py-10">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
            <div className="text-lg text-green-300 font-bold">Chamado enviado!</div>
            <div className="text-zinc-400">Nossa equipe responderá em breve no seu e-mail.</div>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <input
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              placeholder="Seu nome"
              required
            />
            <input
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600"
              placeholder="Seu e-mail"
              type="email"
              required
            />
            <textarea
              className="bg-zinc-800 rounded px-4 py-2 text-white outline-blue-600 min-h-[90px]"
              placeholder="Descreva seu problema, dúvida ou sugestão"
              required
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-semibold text-lg flex items-center gap-2 justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
              Enviar chamado
            </button>
          </form>
        )}
      </div>

      {/* Atalhos rápidos e Status */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl flex-1 p-6">
          <h2 className="text-lg font-semibold text-blue-300 mb-3">Contato rápido</h2>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:suporte@strattia.com"
              className="flex items-center gap-2 text-blue-400 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="w-5 h-5" />
              suporte@strattia.com
            </a>
            <a
              href="https://wa.me/5531999999999"
              className="flex items-center gap-2 text-green-400 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Business
            </a>
          </div>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl flex-1 p-6">
          <h2 className="text-lg font-semibold text-blue-300 mb-3">Status do sistema</h2>
          <div className="text-green-400 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Todos os sistemas operando normalmente
          </div>
          {/* Aqui pode mostrar alertas, incidentes ou status API se quiser depois */}
        </div>
      </div>
    </div>
  );
}
