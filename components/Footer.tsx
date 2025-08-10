// components/Footer.tsx

'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-gray-400 py-10 px-6 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna 1 */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Strattia</h3>
          <p className="text-sm">A inteligência que trabalha por você. Soluções completas de tráfego com IA.</p>
        </div>

        {/* Coluna 2 */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Links úteis</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Início</Link></li>
            <li><Link href="/register" className="hover:text-white transition">Criar Conta</Link></li>
            <li><Link href="#features" className="hover:text-white transition">Funcionalidades</Link></li>
          </ul>
        </div>

        {/* Coluna 3 */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Contato</h4>
          <ul className="space-y-1 text-sm">
            <li>Email: contato@strattia.com</li>
            <li>WhatsApp: (11) 99999-0000</li>
            <li>Instagram: @strattia.ai</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} Strattia. Todos os direitos reservados.
      </div>
    </footer>
  )
}
