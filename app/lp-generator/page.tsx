// app/lp-generator/page.tsx

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LPGeneratorPage() {
  const [produto, setProduto] = useState('')
  const [publico, setPublico] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [resultado, setResultado] = useState<null | string>(null)

  const gerarLP = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação da IA gerando uma LP básica
    const lp = `
      <div class='space-y-4'>
        <h1 class='text-4xl font-bold text-white'>Transforme ${publico} com ${produto}</h1>
        <p class='text-gray-300'>Alcance ${objetivo} de forma rápida, com tecnologia que realmente funciona.</p>
        <ul class='list-disc list-inside text-gray-400'>
          <li>Benefício 1 automático</li>
          <li>Benefício 2 gerado com IA</li>
          <li>Alta conversão comprovada</li>
        </ul>
        <button class='mt-4 px-6 py-3 bg-blue-600 rounded text-white hover:bg-blue-700'>Quero essa solução</button>
      </div>
    `
    setResultado(lp)
  }

  return (
    <main className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Gerador de Landing Page com IA
        </h1>

        <form onSubmit={gerarLP} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4">
          <div>
            <label className="block mb-1">Produto ou Serviço</label>
            <input
              type="text"
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={produto}
              onChange={e => setProduto(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Público-Alvo</label>
            <input
              type="text"
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={publico}
              onChange={e => setPublico(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Objetivo da Página</label>
            <input
              type="text"
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={objetivo}
              onChange={e => setObjetivo(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
          >
            Gerar LP com IA
          </button>
        </form>

        {resultado && (
          <motion.div
            className="bg-zinc-900 mt-10 p-6 rounded-xl border border-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4">Prévia da Landing Page:</h2>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: resultado }}
            />
          </motion.div>
        )}
      </div>
    </main>
  )
}
