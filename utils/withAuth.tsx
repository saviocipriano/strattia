'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Loader2 } from 'lucide-react'
import React from 'react'

// Tipagem correta para componentes com props
export function withAuth<T extends Record<string, unknown>>(Component: React.ComponentType<T>) {
  const AuthenticatedComponent = (props: T) => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/login')
        } else {
          setLoading(false)
        }
      })

      return () => unsubscribe()
    }, [router])

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      )
    }

    return <Component {...props} />
  }

  return AuthenticatedComponent
}
