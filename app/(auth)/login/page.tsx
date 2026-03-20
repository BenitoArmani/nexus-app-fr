'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Chrome, Eye, EyeOff, ShieldAlert, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { NexusHexIcon } from '@/components/ui/NexusLogo'
import { useAuth } from '@/hooks/useAuth'
import { checkLoginAttempts, recordFailedLogin, recordSuccessfulLogin } from '@/lib/security'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const { signIn, signInWithGoogle, googleLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get('error')
    if (err === 'auth_failed') toast.error('Échec de la connexion Google. Réessayez.')
    else if (err === 'timeout') toast.error('La connexion a expiré. Réessayez.')
    else if (err) toast.error(decodeURIComponent(err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if account is locked
    const attemptCheck = checkLoginAttempts(email)
    if (!attemptCheck.allowed) {
      const mins = Math.ceil(((attemptCheck.lockedUntil ?? 0) - Date.now()) / 60000)
      setLockoutUntil(attemptCheck.lockedUntil)
      toast.error(`Compte verrouillé. Réessayez dans ${mins} min.`)
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      recordSuccessfulLogin(email)
      router.push('/feed')
    } catch {
      const result = recordFailedLogin(email)
      if (!result.allowed) {
        setLockoutUntil(result.lockedUntil)
        toast.error('Compte verrouillé 15 min après 5 tentatives échouées.')
      } else {
        toast.error(`Email ou mot de passe incorrect. ${result.remaining} tentative${result.remaining > 1 ? 's' : ''} restante${result.remaining > 1 ? 's' : ''}.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil

  // Demo mode — set cookie then redirect
  const handleDemo = () => {
    document.cookie = 'nexus-demo=1; path=/; max-age=86400; SameSite=Lax'
    router.push('/feed')
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <NexusHexIcon size={56} />
          </div>
          <h1 className="text-2xl font-black text-text-primary">Bon retour !</h1>
          <p className="text-text-muted text-sm mt-1">Connectez-vous à NEXUS</p>
        </div>

        <div className="bg-surface-2 border border-white/5 rounded-2xl p-6 space-y-4">
          {/* Google */}
          <button
            onClick={async () => {
              try {
                await signInWithGoogle()
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err)
                console.error('[NEXUS] signInWithGoogle failed:', msg)
                toast.error(`Google: ${msg}`)
              }
            }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-text-primary font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <Chrome size={16} />}
            {googleLoading ? 'Redirection...' : 'Continuer avec Google'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-text-muted">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          {isLocked && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <ShieldAlert size={15} className="text-rose-400 flex-shrink-0" />
              <p className="text-xs text-rose-400">Compte verrouillé suite à 5 tentatives échouées. Réessayez dans quelques minutes.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="vous@example.com"
                  className="w-full bg-surface-3 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-text-muted">Mot de passe</label>
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      toast.error('Entrez votre email d\'abord')
                      return
                    }
                    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: 'https://nexussociable.fr/auth/callback',
                    })
                    if (resetError) {
                      toast.error(resetError.message)
                    } else {
                      toast('Email de réinitialisation envoyé ! Vérifiez votre boîte.', { icon: '📧', style: { background: '#1a0a2e', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } })
                    }
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-surface-3 border border-white/5 rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="md" disabled={loading || isLocked}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <button onClick={handleDemo} className="w-full py-2.5 border border-violet-500/30 hover:bg-violet-500/10 rounded-xl text-sm text-violet-400 font-medium transition-colors">
            🚀 Démo — Accès direct (sans compte)
          </button>
        </div>

        <p className="text-center text-sm text-text-muted mt-4">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold">
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
