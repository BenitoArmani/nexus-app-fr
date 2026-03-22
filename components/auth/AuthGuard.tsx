'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { NexusHexIcon } from '@/components/ui/NexusLogo'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user === null) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse">
            <NexusHexIcon size={48} />
          </div>
          <p className="text-text-muted text-sm">Chargement…</p>
        </div>
      </div>
    )
  }

  if (user === null) {
    // Redirecting — render nothing to avoid flash
    return null
  }

  return <>{children}</>
}
