// app/relatorios/page.tsx

'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Campanha A', cliques: 1240, leads: 310 },
  { name: 'Campanha B', cliques: 980, leads: 190 },
  { name: 'Campanha C', cliques: 1560, leads: 480 },
  { name: 'Campanha D', cliques: 720, leads: 130 },
]

export default function RelatoriosPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Relatórios de Performance</h1>
      <p className="text-gray-400 mb-10">Acompanhe o desempenho das suas campanhas de tráfego com dados em tempo real.</p>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Cliques vs Leads</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: 'white' }} />
            <Bar dataKey="cliques" fill="#3b82f6" name="Cliques" />
            <Bar dataKey="leads" fill="#10b981" name="Leads" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
