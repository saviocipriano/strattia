'use client'

import { Check } from 'lucide-react'

const plans = [
  {
    title: 'Essencial',
    price: 'R$ 197/mês',
    description: 'Ideal para negócios em início de escala.',
    features: [
      '1 conta Meta integrada',
      'Otimizações automáticas com IA',
      'Geração de relatórios semanais',
      'Suporte por WhatsApp',
    ],
  },
  {
    title: 'Pro',
    price: 'R$ 497/mês',
    description: 'Para quem deseja escalar múltiplas campanhas.',
    features: [
      'Até 5 contas Meta',
      'LPs automatizadas incluídas',
      'Inteligência preditiva de ROAS',
      'Relatórios e alertas em tempo real',
    ],
  },
  {
    title: 'Agência',
    price: 'R$ 1.297/mês',
    description: 'Solução completa para gestores e agências.',
    features: [
      '50 contas integradas',
      'Dashboard multi-cliente com IA autônoma',
      'Alertas de vencimento de contrato',
      'Prioridade no suporte e roadmap',
    ],
  },
]

export default function PricingSection() {
  return (
    <section className="py-20 px-6 bg-zinc-950 border-y border-zinc-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos para cada fase do seu crescimento</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Comece simples e evolua com a IA da Strattia. Sem contratos longos. Cancele quando quiser.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="border border-zinc-800 bg-zinc-900 p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
              <p className="text-blue-400 text-2xl font-semibold mb-4">{plan.price}</p>
              <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="text-blue-500 w-4 h-4 mt-1" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 transition font-medium">
                Escolher Plano
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
