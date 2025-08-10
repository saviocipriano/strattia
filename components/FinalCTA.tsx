'use client'

import { useRouter } from 'next/navigation'

export default function FinalCTA() {
  const router = useRouter()

  return (
    <section className="py-20 bg-zinc-900 border-t border-zinc-800 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para ter uma IA cuidando do seu tráfego 24h por dia?
        </h2>
        <p className="text-gray-400 mb-6">
          Crie sua conta na Strattia em poucos segundos e veja o que a automação inteligente pode fazer por você.
        </p>
        <button
          onClick={() => router.push('/register')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition"
        >
          Começar agora
        </button>
      </div>
    </section>
  )
}
