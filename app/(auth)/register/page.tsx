'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Chrome, Check, X, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { NexusHexIcon } from '@/components/ui/NexusLogo'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'username') {
      setUsernameStatus('idle')
      setSuggestions([])
      if (debounceRef.current) clearTimeout(debounceRef.current)

      const trimmed = value.trim().toLowerCase()
      if (trimmed.length < 3) {
        setUsernameStatus('idle')
        return
      }

      setUsernameStatus('checking')
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/username?username=${encodeURIComponent(trimmed)}`)
          const data = await res.json()
          if (data.available) {
            setUsernameStatus('available')
            setUsernameMessage(data.message ?? `@${trimmed} est disponible !`)
          } else {
            setUsernameStatus(data.error?.includes('caractères') || data.error?.includes('réservé') ? 'invalid' : 'taken')
            setUsernameMessage(data.error ?? `@${trimmed} est déjà pris.`)
            setSuggestions(data.suggestions ?? [])
          }
        } catch {
          setUsernameStatus('idle')
        }
      }, 500)
    }
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
      toast.error('Choisis un pseudo disponible')
      return
    }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.username)
      toast.success('Compte créé ! Bienvenue sur NEXUS 🎉')
      router.push('/onboarding')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const UsernameIcon = () => {
    if (usernameStatus === 'checking') return <Loader2 size={13} className="animate-spin text-zinc-400" />
    if (usernameStatus === 'available') return <Check size={13} className="text-emerald-400" />
    if (usernameStatus === 'taken' || usernameStatus === 'invalid') return <X size={13} className="text-rose-400" />
    return null
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <NexusHexIcon size={56} />
          </div>
          <h1 className="text-2xl font-black text-text-primary">Rejoindre NEXUS</h1>
          <p className="text-text-muted text-sm mt-1">Créez votre compte créateur gratuitement</p>
        </div>

        <div className="bg-surface-2 border border-white/5 rounded-2xl p-6 space-y-4">
          <button
            onClick={async () => {
              try {
                await signInWithGoogle()
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err)
                console.error('[NEXUS] signInWithGoogle (register) failed:', msg)
                toast.error(`Google: ${msg}`)
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-text-primary font-medium transition-colors"
          >
            <Chrome size={16} /> Continuer avec Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-text-muted">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username with real-time check */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="mon_pseudo"
                  className={`w-full bg-surface-3 border rounded-xl pl-9 pr-9 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                    usernameStatus === 'available'
                      ? 'border-emerald-500/50 focus:border-emerald-500'
                      : usernameStatus === 'taken' || usernameStatus === 'invalid'
                      ? 'border-rose-500/50 focus:border-rose-500'
                      : 'border-white/5 focus:border-violet-500/50'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <UsernameIcon />
                </div>
              </div>

              {/* Status message */}
              <AnimatePresence>
                {usernameStatus !== 'idle' && usernameMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[11px] mt-1.5 font-medium ${
                      usernameStatus === 'available' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {usernameStatus === 'available' ? '✅' : '❌'} {usernameMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 space-y-1"
                  >
                    <p className="text-[10px] text-zinc-500">Essaie :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setForm(prev => ({ ...prev, username: s }))
                            setUsernameStatus('idle')
                            setSuggestions([])
                          }}
                          className="text-[11px] font-semibold px-2 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 transition-colors"
                        >
                          @{s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Règles username */}
            {usernameStatus === 'idle' && form.username.length === 0 && (
              <p className="text-[11px] text-zinc-500 -mt-1">3 à 20 caractères · lettres, chiffres et _ uniquement</p>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email" name="email"
                  value={form.email}
                  onChange={handleChange} required
                  placeholder="vous@example.com"
                  className="w-full bg-surface-3 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password" name="password"
                  value={form.password}
                  onChange={handleChange} required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-surface-3 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Minimum 6 caractères</p>
            </div>

            <p className="text-[11px] text-text-muted">
              En vous inscrivant, vous acceptez nos CGU et politique de confidentialité.
            </p>
            <Button
              type="submit"
              className="w-full"
              size="md"
              disabled={loading || usernameStatus === 'taken' || usernameStatus === 'invalid'}
            >
              {loading ? 'Création...' : 'Créer mon compte →'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-4">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  )
}
