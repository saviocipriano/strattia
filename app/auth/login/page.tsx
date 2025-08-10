'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-black overflow-hidden relative px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black opacity-95 z-0 animate-pulse" />

      <motion.div
        className="hidden md:flex w-1/2 h-full relative items-center justify-center"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <img
          src="https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1374&q=80"
          alt="Login visual"
          className="w-full h-full object-cover object-center brightness-[.4]"
        />
        <div className="absolute text-white text-center px-4">
          <h2 className="text-4xl lg:text-5xl font-bold drop-shadow-xl">STRATTIA</h2>
          <p className="text-lg lg:text-xl text-white/80 mt-2 drop-shadow-sm">Acesse sua performance</p>
        </div>
      </motion.div>

      <motion.div
        className="z-10 w-full max-w-md md:w-1/2 bg-zinc-900/80 backdrop-blur-lg rounded-2xl p-8 sm:p-10 shadow-xl border border-white/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-white text-2xl md:text-3xl font-bold text-center mb-3">Fazer login</h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Acesse sua conta e acompanhe seus projetos
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-white mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-white mb-1">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Ainda não tem uma conta?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
