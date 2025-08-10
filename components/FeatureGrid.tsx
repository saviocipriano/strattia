// components/FeatureGrid.tsx

'use client'

import { motion } from 'framer-motion'
import { Bolt, BarChart4, FileText, Zap } from 'lucide-react'

const features = [
  {
    title: 'IA que Otimiza em Tempo Real',
    description: 'Campanhas ajustadas automaticamente 24h por dia para melhor performance.',
    icon: <Zap className="w-6 h-6 text-blue-500" />,
  },
  {
    title: 'Relatórios Automatizados',
    description: 'Receba relatórios inteligentes por e-mail ou WhatsApp com insights reais.',
    icon: <BarChart4 className="w-6 h-6 text-blue-500" />,
  },
  {
    title: 'Geração de LPs Instantânea',
    description: 'Crie páginas de alta conversão com IA sem precisar de design ou programação.',
    icon: <FileText className="w-6 h-6 text-blue-500" />,
  },
  {
    title: 'Automação de Contratos e Notificações',
    description: 'Seus clientes avisados do vencimento automaticamente, sem esforço.',
    icon: <Bolt className="w-6 h-6 text-blue-500" />,
  },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 px-6 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Por que escolher a <span className="text-blue-500">Strattia?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
