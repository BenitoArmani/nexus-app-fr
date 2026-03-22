'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { NexusHexIcon } from '@/components/ui/NexusLogo'

// Handles PKCE email confirmation links: /auth/callback?code=...
// Also handles password reset links that arrive here.
export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search)
    const code      = params.get('code')
    const error     = params.get('error')
    const flowType  = params.get('type') // Supabase sets ?type=recovery for password reset links

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(params.get('error_description') ?? error)}`)
      return
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: err }) => {
        if (err) {
          router.replace('/login?error=auth_failed')
        } else if (flowType === 'recovery') {
          // Password reset flow — Supabase sets ?type=recovery in the email link
          router.replace('/auth/reset-password')
        } else {
          router.replace('/feed')
        }
      })
    } else {
      // No code — check for existing session (magic link may have set it)
      supabase.auth.getSession().then(({ data: { session } }) => {
        router.replace(session ? '/feed' : '/login')
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <NexusHexIcon size={56} />
        </div>
        <p className="text-text-muted text-sm">Connexion en cours…</p>
      </div>
    </div>
  )
}
