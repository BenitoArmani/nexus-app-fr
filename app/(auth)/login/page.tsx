'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import { NexusHexIcon } from '@/components/ui/NexusLogo'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]  = useState(false)
  const submittingRef          = useRef(false)
  const { signIn }             = useAuth()
  const router                 = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/feed')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('not confirmed') || msg.toLowerCase().includes('email not confirmed')) {
        toast('Confirmez votre email avant de vous connecter. Vérifiez votre boîte mail.', {
          icon: '📧',
          style: { background: '#1a0a2e', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' },
        })
      } else {
        toast.error('Email ou mot de passe incorrect.')
      }
    } finally {
      setLoading(false)
      submittingRef.current = false
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-start sm:items-center justify-center p-4 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                    if (!email) { toast.error('Entrez votre email d\'abord'); return }
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: 'https://nexussociable.fr/auth/callback',
                    })
                    if (error) {
                      toast.error(error.message)
                    } else {
                      toast('Email de réinitialisation envoyé ! Vérifiez votre boîte.', {
                        icon: '📧',
                        style: { background: '#1a0a2e', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' },
                      })
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

            <Button type="submit" className="w-full" size="md" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>
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
