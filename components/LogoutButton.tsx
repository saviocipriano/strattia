'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Você saiu da sua conta.')
      router.push('/login')
    } catch (error) {
      console.error('Erro ao sair:', error)
      toast.error('Erro ao fazer logout.')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
    >
      <LogOut size={16} />
      Sair
    </button>
  )
}
