'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { NexusHexIcon } from '@/components/ui/NexusLogo'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    let redirected = false

    const doRedirect = (path: string) => {
      if (!redirected) {
        redirected = true
        router.replace(path)
      }
    }

    // Listen for auth state changes (SIGNED_IN, PASSWORD_RECOVERY, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        doRedirect('/feed')
      } else if (event === 'PASSWORD_RECOVERY') {
        subscription.unsubscribe()
        doRedirect('/auth/reset-password')
      } else if (event === 'SIGNED_OUT') {
        subscription.unsubscribe()
        doRedirect('/login')
      }
    })

    // CRITICAL: With PKCE flow, the supabase singleton may already be initialized
    // (detectSessionInUrl only runs once at init). We must explicitly exchange
    // the code from the URL to get a session.
    const code = new URLSearchParams(window.location.search).get('code')
    const error = new URLSearchParams(window.location.search).get('error')
    const errorDescription = new URLSearchParams(window.location.search).get('error_description')

    if (error) {
      console.error('[NEXUS] OAuth error:', error, errorDescription)
      subscription.unsubscribe()
      doRedirect(`/login?error=${encodeURIComponent(errorDescription ?? error)}`)
      return
    }

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) {
          console.error('[NEXUS] PKCE exchange failed:', exchangeError.message)
          subscription.unsubscribe()
          doRedirect('/login?error=auth_failed')
        }
        // If success, onAuthStateChange will fire SIGNED_IN → redirect handled above
      })
    } else {
      // No code — check if there's already a session (e.g. email link auth)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          doRedirect('/feed')
        } else {
          // Fallback: wait up to 8s for onAuthStateChange
          const timeout = setTimeout(() => {
            subscription.unsubscribe()
            doRedirect('/login?error=timeout')
          }, 8000)
          // Store timeout ref for cleanup
          ;(window as Window & { _nexusAuthTimeout?: ReturnType<typeof setTimeout> })._nexusAuthTimeout = timeout
        }
      })
    }

    return () => {
      subscription.unsubscribe()
      const w = window as Window & { _nexusAuthTimeout?: ReturnType<typeof setTimeout> }
      if (w._nexusAuthTimeout) clearTimeout(w._nexusAuthTimeout)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center animate-pulse">
          <NexusHexIcon size={56} />
        </div>
        <p className="text-text-muted text-sm">Connexion en cours…</p>
      </div>
    </div>
  )
}
