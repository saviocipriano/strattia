// components/HeroSection.tsx

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
      {/* Fundo gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black z-0 animate-pulse" />

      {/* Conteúdo principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-4xl text-center"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          A primeira IA de tráfego que <span className="text-blue-500">realmente entrega</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Automatize campanhas, gere LPs, aumente performance e escale clientes com uma só plataforma.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded shadow transition"
          >
            Criar Conta Grátis
          </Link>
          <Link
            href="#features"
            className="text-white border border-white/30 hover:border-white px-6 py-3 rounded shadow transition"
          >
            Ver Funcionalidades
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
