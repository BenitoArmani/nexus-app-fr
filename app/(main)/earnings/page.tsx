'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Zap, ExternalLink, CheckCircle2, Loader2, ArrowDownToLine } from 'lucide-react'
import EarningsDashboard from '@/components/earnings/EarningsDashboard'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useGlyphs } from '@/hooks/useGlyphs'
import toast from 'react-hot-toast'

const GLYPHS_PER_EURO = 110
const MIN_GLYPHS = 1000

type ConnectStatus = 'loading' | 'none' | 'pending' | 'active'

export default function EarningsPage() {
  const { user }                          = useAuth()
  const { balance }                       = useGlyphs()
  const searchParams                      = useSearchParams()
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>('loading')
  const [connectLoading, setConnectLoading] = useState(false)
  const [payoutGlyphs, setPayoutGlyphs]   = useState('')
  const [payoutLoading, setPayoutLoading] = useState(false)

  const glyphsAmount = parseInt(payoutGlyphs) || 0
  const eurosAmount  = Math.floor(glyphsAmount / GLYPHS_PER_EURO)

  // Check Stripe Connect status on mount
  useEffect(() => {
    if (!user) return
    fetch(`/api/stripe/connect?userId=${user.id}`)
      .then(r => r.json())
      .then(d => setConnectStatus(d.status ?? 'none'))
      .catch(() => setConnectStatus('none'))
  }, [user])

  // Handle return from Stripe onboarding
  useEffect(() => {
    const connect = searchParams.get('connect')
    if (connect === 'success') {
      toast.success('Compte bancaire connecté ! Tu peux maintenant retirer tes gains.')
      setConnectStatus('loading')
      if (user) {
        fetch(`/api/stripe/connect?userId=${user.id}`)
          .then(r => r.json())
          .then(d => setConnectStatus(d.status ?? 'none'))
      }
      window.history.replaceState({}, '', '/earnings')
    }
    if (connect === 'refresh') {
      toast('Onboarding interrompu. Recommence la connexion.')
      window.history.replaceState({}, '', '/earnings')
    }
  }, [searchParams, user])

  const handleConnect = async () => {
    if (!user) return
    setConnectLoading(true)
    try {
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error || 'Erreur Stripe')
    } catch {
      toast.error('Erreur de connexion')
    }
    setConnectLoading(false)
  }

  const handlePayout = async () => {
    if (!user || glyphsAmount < MIN_GLYPHS) return
    setPayoutLoading(true)
    try {
      const res = await fetch('/api/stripe/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, glyphs: glyphsAmount }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`✅ Virement de ${data.euros}€ envoyé sur ton compte bancaire !`, { duration: 6000 })
        setPayoutGlyphs('')
      } else {
        toast.error(data.error || 'Erreur lors du virement')
      }
    } catch {
      toast.error('Erreur de connexion')
    }
    setPayoutLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-text-primary">Mes Gains</h1>
        <p className="text-text-muted text-sm mt-0.5">Suis tes revenus et retire tes GLYPHS en euros</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dashboard */}
        <div className="lg:col-span-2">
          <EarningsDashboard />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Stripe Connect / Payout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-surface-2 border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownToLine size={16} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-text-primary">Retirer mes gains</h3>
            </div>

            {connectStatus === 'loading' && (
              <div className="flex justify-center py-4">
                <Loader2 size={20} className="animate-spin text-zinc-500" />
              </div>
            )}

            {connectStatus === 'none' && (
              <>
                <p className="text-xs text-text-muted mb-4">
                  Connecte ton compte bancaire via Stripe pour retirer tes GLYPHS en euros.<br />
                  <span className="text-violet-400 font-semibold">110 GLYPHS = 1€</span>
                </p>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={handleConnect}
                  disabled={connectLoading}
                >
                  {connectLoading ? <Loader2 size={13} className="animate-spin" /> : <CreditCard size={13} />}
                  Connecter mon compte bancaire
                  <ExternalLink size={11} />
                </Button>
              </>
            )}

            {connectStatus === 'pending' && (
              <>
                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <Loader2 size={13} className="text-amber-400 animate-spin" />
                  <p className="text-xs text-amber-400 font-semibold">Vérification en cours...</p>
                </div>
                <p className="text-xs text-text-muted mb-3">
                  Stripe vérifie ton identité. Ça prend quelques minutes à 24h.
                </p>
                <Button variant="secondary" size="sm" className="w-full" onClick={handleConnect} disabled={connectLoading}>
                  Compléter le dossier <ExternalLink size={11} />
                </Button>
              </>
            )}

            {connectStatus === 'active' && (
              <>
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <p className="text-xs text-emerald-400 font-semibold">Compte bancaire connecté</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-400 font-medium">GLYPHS à retirer</label>
                    <input
                      type="number"
                      min={MIN_GLYPHS}
                      max={balance}
                      value={payoutGlyphs}
                      onChange={e => setPayoutGlyphs(e.target.value)}
                      placeholder={`min. ${MIN_GLYPHS}`}
                      className="mt-1 w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50"
                    />
                    <div className="flex justify-between text-xs mt-1.5">
                      <span className="text-zinc-500">Solde : {balance.toLocaleString('fr-FR')} ⬡</span>
                      <button onClick={() => setPayoutGlyphs(String(balance))} className="text-violet-400 hover:text-violet-300">Tout retirer</button>
                    </div>
                  </div>

                  {glyphsAmount >= MIN_GLYPHS && (
                    <div className="bg-surface-3 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>{glyphsAmount.toLocaleString()} GLYPHS</span>
                        <span className="text-emerald-400 font-bold">= {eurosAmount}€</span>
                      </div>
                      <p className="text-[10px] text-zinc-600">Virement sous 2-5 jours ouvrés</p>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={handlePayout}
                    disabled={payoutLoading || glyphsAmount < MIN_GLYPHS || glyphsAmount > balance}
                  >
                    {payoutLoading ? <Loader2 size={13} className="animate-spin" /> : <ArrowDownToLine size={13} />}
                    Virer {eurosAmount > 0 ? `${eurosAmount}€` : ''}
                  </Button>
                </div>
              </>
            )}
          </motion.div>

          {/* Rate info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-surface-2 border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-violet-400" fill="currentColor" />
              <p className="text-xs font-bold text-text-primary">Taux de conversion</p>
            </div>
            <div className="space-y-2">
              {[
                { glyphs: 1000,  euros: '9€'  },
                { glyphs: 5000,  euros: '45€' },
                { glyphs: 10000, euros: '90€' },
                { glyphs: 50000, euros: '454€'},
              ].map(r => (
                <div key={r.glyphs} className="flex justify-between text-xs">
                  <span className="text-zinc-400">{r.glyphs.toLocaleString('fr-FR')} ⬡</span>
                  <span className="text-emerald-400 font-semibold">{r.euros}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-3">110 GLYPHS = 1€ · Minimum 1 000 GLYPHS</p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
