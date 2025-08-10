"use client";

import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Settings2 } from "lucide-react";
import { Toaster, toast } from "sonner";

// ---------- Esquema (Zod v3)
const schema = z.object({
  nome: z.string().trim().min(3, "Nome obrigatório"),
  objetivo: z.string().trim().min(2, "Selecione um objetivo"),
  plataforma: z.string().trim().min(2, "Escolha a plataforma"),
  orcamentoDiario: z.coerce.number().positive("Informe um valor > 0"),
  orcamentoTotal: z.coerce.number().positive("Informe um valor > 0"),
  dataInicio: z.string().trim().min(1, "Informe a data"),
  dataFim: z.string().trim().min(1, "Informe a data"),
  localizacao: z.string().trim().min(2, "Informe localização"),
  faixaEtaria: z.string().trim().min(1, "Escolha a faixa etária"),
  genero: z.string().trim().min(1, "Escolha o gênero"),
  interesses: z.string().trim().min(2, "Informe interesses"),
  criativo: z.any().optional(), // upload validado no backend
  headline: z.string().trim().min(5, "Informe a headline"),
  url: z.string().trim().url("URL inválida"),
  ia: z.boolean().default(true),
  automacoes: z.array(z.string()).default([]),
  notificacoes: z.string().optional().default(""),
});

type FormValues = z.infer<typeof schema>;

const objetivos = [
  "Conversões",
  "Leads",
  "Vendas",
  "Alcance",
  "Reconhecimento de marca",
];

const plataformas = [
  { value: "meta", label: "Meta (Facebook/Instagram)" },
  { value: "google", label: "Google Ads" },
  { value: "tiktok", label: "TikTok Ads" },
];

const faixasEtarias = ["18-24", "25-34", "35-44", "45-54", "55+"];
const generos = ["Masculino", "Feminino", "Todos"];

const automacoesDisponiveis = [
  "Ajustar orçamento automaticamente",
  "Pausar campanha fora do horário comercial",
  "Enviar relatório diário",
  "Sugerir novos criativos",
];

export default function NovaCampanhaWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      objetivo: "",
      plataforma: "",
      orcamentoDiario: 0,
      orcamentoTotal: 0,
      dataInicio: "",
      dataFim: "",
      localizacao: "",
      faixaEtaria: "",
      genero: "",
      interesses: "",
      criativo: undefined,
      headline: "",
      url: "",
      ia: true,
      automacoes: [],
      notificacoes: "",
    },
    mode: "onTouched",
  });

  // ---------- Persistência (Firestore)
  async function handleCreate(values: FormValues) {
    setLoading(true);
    try {
      await addDoc(collection(db, "campanhas"), {
        ...values,
        status: "ativo",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Campanha criada com sucesso!");
      setTimeout(() => (window.location.href = "/dashboard/campanhas"), 1200);
    } catch (e: any) {
      toast.error("Erro ao criar campanha", { description: String(e?.message || e) });
    } finally {
      setLoading(false);
    }
  }

  // ---------- Etapas
  function Step1() {
    return (
      <motion.div
        key={1}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        className="space-y-6"
      >
        <div>
          <label className="font-semibold text-gray-200">Nome da Campanha *</label>
          <Input
            {...methods.register("nome")}
            placeholder="Campanha Black Friday"
            className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
          />
          <FieldError field="nome" />
        </div>

        <div>
          <label className="font-semibold text-gray-200">Objetivo *</label>
          <select
            {...methods.register("objetivo")}
            className="mt-1 w-full rounded bg-white text-slate-900 p-2 border border-slate-300"
          >
            <option value="">Selecione o objetivo</option>
            {objetivos.map((obj) => (
              <option key={obj} value={obj}>
                {obj}
              </option>
            ))}
          </select>
          <FieldError field="objetivo" />
        </div>

        <div>
          <label className="font-semibold text-gray-200">Plataforma *</label>
          <select
            {...methods.register("plataforma")}
            className="mt-1 w-full rounded bg-white text-slate-900 p-2 border border-slate-300"
          >
            <option value="">Escolha a plataforma</option>
            {plataformas.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <FieldError field="plataforma" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-200">
              Orçamento Diário (R$) *
            </label>
            <Input
              type="number"
              step="0.01"
              {...methods.register("orcamentoDiario")}
              placeholder="Ex: 50"
              className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
            />
            <FieldError field="orcamentoDiario" />
          </div>
          <div>
            <label className="font-semibold text-gray-200">
              Orçamento Total (R$) *
            </label>
            <Input
              type="number"
              step="0.01"
              {...methods.register("orcamentoTotal")}
              placeholder="Ex: 1500"
              className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
            />
            <FieldError field="orcamentoTotal" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-200">Data de Início *</label>
            <Input
              type="date"
              {...methods.register("dataInicio")}
              className="mt-1 bg-white text-slate-900 border-slate-300"
            />
            <FieldError field="dataInicio" />
          </div>
          <div>
            <label className="font-semibold text-gray-200">Data de Término *</label>
            <Input
              type="date"
              {...methods.register("dataFim")}
              className="mt-1 bg-white text-slate-900 border-slate-300"
            />
            <FieldError field="dataFim" />
          </div>
        </div>
      </motion.div>
    );
  }

  function Step2() {
    return (
      <motion.div
        key={2}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        className="space-y-6"
      >
        <div>
          <label className="font-semibold text-gray-200">Localização *</label>
          <Input
            {...methods.register("localizacao")}
            placeholder="Ex: Brasil, MG, Belo Horizonte"
            className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
          />
          <FieldError field="localizacao" />
        </div>
        <div>
          <label className="font-semibold text-gray-200">Faixa Etária *</label>
          <select
            {...methods.register("faixaEtaria")}
            className="mt-1 w-full rounded bg-white text-slate-900 p-2 border border-slate-300"
          >
            <option value="">Selecione</option>
            {faixasEtarias.map((faixa) => (
              <option key={faixa} value={faixa}>
                {faixa}
              </option>
            ))}
          </select>
          <FieldError field="faixaEtaria" />
        </div>
        <div>
          <label className="font-semibold text-gray-200">Gênero *</label>
          <select
            {...methods.register("genero")}
            className="mt-1 w-full rounded bg-white text-slate-900 p-2 border border-slate-300"
          >
            <option value="">Selecione</option>
            {generos.map((gen) => (
              <option key={gen} value={gen}>
                {gen}
              </option>
            ))}
          </select>
          <FieldError field="genero" />
        </div>
        <div>
          <label className="font-semibold text-gray-200">Interesses *</label>
          <Input
            {...methods.register("interesses")}
            placeholder="Ex: Marketing Digital, Tecnologia"
            className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
          />
          <FieldError field="interesses" />
        </div>
      </motion.div>
    );
  }

  function Step3() {
    return (
      <motion.div
        key={3}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        className="space-y-6"
      >
        <div>
          <label className="font-semibold text-gray-200">
            Criativo (Imagem/Vídeo) *
          </label>
        </div>
        <div>
          <label className="font-semibold text-gray-200">Headline / Copy *</label>
          <Input
            {...methods.register("headline")}
            placeholder="Ex: Descubra a melhor oferta do ano!"
            className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
          />
          <FieldError field="headline" />
        </div>
        <div>
          <label className="font-semibold text-gray-200">URL de Destino *</label>
          <Input
            {...methods.register("url")}
            placeholder="https://sua-landingpage.com"
            className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
          />
          <FieldError field="url" />
        </div>
      </motion.div>
    );
  }

  function Step4() {
    return (
      <motion.div
        key={4}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Settings2 className="text-blue-300 w-5 h-5" />
          <label className="font-semibold text-gray-200">
            Ativar IA para Otimização?
          </label>
          <Switch
            checked={methods.watch("ia")}
            onCheckedChange={(checked) => methods.setValue("ia", checked)}
          />
          <Badge className="ml-2">
            {methods.watch("ia") ? "Ativada" : "Desativada"}
          </Badge>
        </div>

        <div>
          <label className="font-semibold text-gray-200">
            Automação da IA (opcional)
          </label>
          <div className="flex flex-col gap-2">
            {automacoesDisponiveis.map((opt) => {
              const selected = methods.watch("automacoes") || [];
              const checked = selected.includes(opt);
              return (
                <label key={opt} className="flex gap-2 items-center text-gray-300 font-medium">
                  <input
                    type="checkbox"
                    className="accent-blue-500"
                    checked={checked}
                    onChange={(e) => {
                      const arr = methods.getValues("automacoes") || [];
                      methods.setValue(
                        "automacoes",
                        e.target.checked ? [...arr, opt] : arr.filter((o) => o !== opt)
                      );
                    }}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-200">
            Notificações (opcional)
          </label>
          <Input
            {...methods.register("notificacoes")}
            placeholder="Ex: Alertar ao gastar 80% do orçamento"
            className="mt-1 bg-white text-slate-900 placeholder-slate-500 border-slate-300"
          />
        </div>
      </motion.div>
    );
  }

  function Step5() {
    const values = methods.getValues();
    return (
      <motion.div
        key={5}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
      >
        <div className="bg-white/20 rounded-xl p-6 mb-6 shadow flex flex-col gap-3">
          <h2 className="text-blue-300 font-bold text-xl mb-2">
            Resumo da Campanha
          </h2>
          <div className="text-blue-100 grid grid-cols-2 gap-2">
            <span>
              <b>Nome:</b> {values.nome}
            </span>
            <span>
              <b>Objetivo:</b> {values.objetivo}
            </span>
            <span>
              <b>Plataforma:</b>{" "}
              {plataformas.find((p) => p.value === values.plataforma)?.label}
            </span>
            <span>
              <b>Orçamento Diário:</b> R$ {values.orcamentoDiario}
            </span>
            <span>
              <b>Orçamento Total:</b> R$ {values.orcamentoTotal}
            </span>
            <span>
              <b>Período:</b> {values.dataInicio} a {values.dataFim}
            </span>
            <span>
              <b>Localização:</b> {values.localizacao}
            </span>
            <span>
              <b>Faixa Etária:</b> {values.faixaEtaria}
            </span>
            <span>
              <b>Gênero:</b> {values.genero}
            </span>
            <span>
              <b>Interesses:</b> {values.interesses}
            </span>
            <span>
              <b>IA:</b> {values.ia ? "Ativada" : "Desativada"}
            </span>
            <span>
              <b>Automação:</b>{" "}
              {(values.automacoes || []).join(", ") || "Nenhuma"}
            </span>
            <span>
              <b>Notificações:</b> {values.notificacoes || "Nenhuma"}
            </span>
          </div>
          <div className="mt-4">
            <span className="font-semibold text-gray-300">
              Pronto para criar sua campanha com IA!
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // ---------- Auxiliares
  function FieldError({ field }: { field: keyof FormValues }) {
    const error = methods.formState.errors[field]?.message as string | undefined;
    return error ? <span className="text-red-400 text-xs">{error}</span> : null;
  }

  const steps = [<Step1 key={1} />, <Step2 key={2} />, <Step3 key={3} />, <Step4 key={4} />, <Step5 key={5} />];

  const stepFields: Record<number, (keyof FormValues)[]> = {
    1: ["nome", "objetivo", "plataforma", "orcamentoDiario", "orcamentoTotal", "dataInicio", "dataFim"],
    2: ["localizacao", "faixaEtaria", "genero", "interesses"],
    3: ["headline", "url"], // upload validado depois
    4: ["ia", "automacoes", "notificacoes"],
    5: [],
  };

  async function handleNext() {
    const fields = stepFields[step] || [];
    const valid = await methods.trigger(fields, { shouldFocus: true });
    if (valid) setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
  }

  const handleFinalSubmit: SubmitHandler<FormValues> = (data) => {
    handleCreate(data);
  };

  // ---------- Render
  return (
    <div className="flex flex-col items-center min-h-[90vh] bg-gradient-to-br from-gray-900 to-slate-800 py-12 px-2">
      <Toaster position="top-right" richColors />
      <FormProvider {...methods}>
        <form
          className="w-full max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur rounded-2xl shadow-2xl space-y-8"
          onSubmit={methods.handleSubmit(handleFinalSubmit)}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-100 tracking-tight">
              Nova Campanha com <span className="text-blue-400">IA</span>
            </h1>
            <span className="text-sm text-blue-200 bg-blue-700/30 rounded-full px-3 py-1">
              Passo {step}/5
            </span>
          </div>

          <AnimatePresence mode="wait">{steps[step - 1]}</AnimatePresence>

          <div className="flex justify-between gap-4 pt-6">
            {step > 1 ? (
              <Button type="button" onClick={handleBack} variant="secondary" className="px-8">
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {step < steps.length ? (
              <Button type="button" onClick={handleNext} className="px-8 bg-blue-700 hover:bg-blue-600 text-white">
                Avançar
              </Button>
            ) : (
              <Button type="submit" className="px-8 bg-green-700 hover:bg-green-600 text-white" disabled={loading}>
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Criar Campanha com IA"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
