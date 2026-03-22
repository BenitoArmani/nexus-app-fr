'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Check, X, Loader2, Eye, EyeOff } from 'lucide-react'
import Button from '@/components/ui/Button'
import { NexusHexIcon } from '@/components/ui/NexusLogo'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

const PASSWORD_RULES = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: '1 lettre majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: '1 chiffre', test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { signUp } = useAuth()
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const passwordValid = PASSWORD_RULES.every(r => r.test(form.password))
  const confirmMatch = form.confirm.length > 0 && form.confirm === form.password
  const confirmError = form.confirm.length > 0 && form.confirm !== form.password

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'password') setPasswordTouched(true)

    if (name === 'username') {
      setUsernameStatus('idle')
      setSuggestions([])
      if (debounceRef.current) clearTimeout(debounceRef.current)

      const trimmed = value.trim().toLowerCase()
      if (trimmed.length < 3) { setUsernameStatus('idle'); return }

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
        } catch { setUsernameStatus('idle') }
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
    if (!passwordValid) {
      toast.error('Le mot de passe ne respecte pas les règles')
      return
    }
    if (!confirmMatch) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.username)
      toast.success('Compte créé ! Bienvenue sur NEXUS 🎉')
      router.push('/onboarding')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l\'inscription'
      if (msg.includes('email de confirmation')) {
        toast(msg, { icon: '📧', style: { background: '#1a0a2e', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' } })
        router.push('/login')
        return
      }
      toast.error(msg)
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

  const canSubmit = !loading
    && usernameStatus !== 'taken'
    && usernameStatus !== 'invalid'
    && passwordValid
    && confirmMatch

  return (
    <div className="min-h-screen bg-bg-primary flex items-start sm:items-center justify-center p-4 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
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
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Username */}
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
              <p className="text-[11px] text-zinc-500 mt-1">3 à 20 caractères · lettres minuscules, chiffres et _ uniquement</p>

              <AnimatePresence>
                {usernameStatus !== 'idle' && usernameMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[11px] mt-1 font-medium ${usernameStatus === 'available' ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {usernameStatus === 'available' ? '✅' : '❌'} {usernameMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5"
                  >
                    <p className="text-[10px] text-zinc-500 mb-1">Essaie :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setForm(prev => ({ ...prev, username: s })); setUsernameStatus('idle'); setSuggestions([]) }}
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

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
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
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-surface-3 border rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                    passwordTouched && !passwordValid
                      ? 'border-rose-500/40 focus:border-rose-500/60'
                      : passwordTouched && passwordValid
                      ? 'border-emerald-500/40 focus:border-emerald-500/60'
                      : 'border-white/5 focus:border-violet-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Live password rules */}
              <AnimatePresence>
                {passwordTouched && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1"
                  >
                    {PASSWORD_RULES.map(rule => {
                      const ok = rule.test(form.password)
                      return (
                        <div key={rule.label} className="flex items-center gap-1.5">
                          {ok
                            ? <Check size={11} className="text-emerald-400 shrink-0" />
                            : <X size={11} className="text-zinc-600 shrink-0" />
                          }
                          <span className={`text-[11px] ${ok ? 'text-emerald-400' : 'text-zinc-500'}`}>
                            {rule.label}
                          </span>
                        </div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-surface-3 border rounded-xl pl-9 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
                    confirmError
                      ? 'border-rose-500/40 focus:border-rose-500/60'
                      : confirmMatch
                      ? 'border-emerald-500/40 focus:border-emerald-500/60'
                      : 'border-white/5 focus:border-violet-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <AnimatePresence>
                {form.confirm.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-[11px] mt-1 font-medium flex items-center gap-1 ${confirmMatch ? 'text-emerald-400' : 'text-rose-400'}`}
                  >
                    {confirmMatch
                      ? <><Check size={11} /> Mots de passe identiques</>
                      : <><X size={11} /> Ne correspondent pas</>
                    }
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <p className="text-[11px] text-text-muted">
              En vous inscrivant, vous acceptez nos{' '}
              <Link href="/terms" className="text-violet-400 hover:underline">CGU</Link>
              {' '}et notre{' '}
              <Link href="/privacy" className="text-violet-400 hover:underline">politique de confidentialité</Link>.
            </p>

            <Button
              type="submit"
              className="w-full"
              size="md"
              disabled={!canSubmit}
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
