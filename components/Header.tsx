// components/Header.tsx

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">Strattia</Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="#" className="hover:text-blue-400 transition">Início</Link>
          <Link href="#features" className="hover:text-blue-400 transition">Funcionalidades</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">Criar Conta</Link>
          <Link href="/login" className="text-sm text-gray-300 hover:text-white">Login</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-t border-zinc-800 px-6 py-4 space-y-4"
          >
            <Link href="#" className="block hover:text-blue-400 transition">Início</Link>
            <Link href="#features" className="block hover:text-blue-400 transition">Funcionalidades</Link>
            <Link href="/register" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">Criar Conta</Link>
            <Link href="/login" className="block text-sm text-gray-300 hover:text-white">Login</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
