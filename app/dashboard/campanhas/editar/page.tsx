'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type CampanhaData = {
  nome: string
  plataforma: string
  status: string
  usaria: boolean
}

export default function EditarCampanhaPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<CampanhaData>({
    nome: '',
    plataforma: '',
    status: '',
    usaria: false,
  })

  const router = useRouter()

  useEffect(() => {
    const fetchCampanha = async () => {
      try {
        const ref = doc(db, 'campanhas', params.id)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const data = snap.data()
          setForm({
            nome: data.nome || '',
            plataforma: data.plataforma || '',
            status: data.status || '',
            usaria: data.usaria ?? false,
          })
        }
      } catch (error) {
        console.error('Erro ao buscar campanha:', error)
        toast.error('Erro ao carregar a campanha.')
      }
    }

    fetchCampanha()
  }, [params.id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const ref = doc(db, 'campanhas', params.id)
      await updateDoc(ref, form)
      toast.success('Campanha atualizada com sucesso!')
      router.push('/dashboard/campanhas')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error('Erro ao atualizar campanha.')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Editar Campanha</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-white">
        <div>
          <label className="block text-sm">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-600"
          />
        </div>
        <div>
          <label className="block text-sm">Plataforma</label>
          <input
            type="text"
            name="plataforma"
            value={form.plataforma}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-600"
          />
        </div>
        <div>
          <label className="block text-sm">Status</label>
          <input
            type="text"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="usaria"
            checked={form.usaria}
            onChange={handleChange}
            className="accent-blue-500"
          />
          <label>Usar IA</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  )
}
