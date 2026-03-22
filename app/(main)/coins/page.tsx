'use client'
import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Gift, CreditCard, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import GlyphChip from '@/components/ui/GlyphChip'
import RewardedAd from '@/components/ui/RewardedAd'
import { useGlyphs } from '@/hooks/useGlyphs'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const GLYPH_PACKS = [
  { id: 'pack_550',  glyphs: 550,  price: 5,  bonus: null,          popular: false, color: 'border-white/10'      },
  { id: 'pack_1200', glyphs: 1200, price: 10, bonus: '+100 bonus',   popular: true,  color: 'border-violet-500/50' },
  { id: 'pack_2750', glyphs: 2750, price: 20, bonus: '+250 bonus',   popular: false, color: 'border-amber-500/30'  },
  { id: 'pack_6000', glyphs: 6000, price: 40, bonus: '+1 000 bonus', popular: false, color: 'border-cyan-500/30'   },
]

const EARN_WAYS = [
  { icon: '📺', label: 'Regarder une pub', glyphs: '+10' },
  { icon: '❤️', label: 'Recevoir un like', glyphs: '+1' },
  { icon: '💬', label: 'Commentaire reçu', glyphs: '+2' },
  { icon: '👥', label: 'Inviter un ami', glyphs: '+500' },
  { icon: '📅', label: 'Connexion journalière', glyphs: '+5' },
  { icon: '🔥', label: 'Streak 7 jours', glyphs: '+50' },
  { icon: '🎯', label: 'Nouvel abonné', glyphs: '+50' },
  { icon: '🚀', label: 'Reel 10k vues', glyphs: '+200' },
]

function GlyphsPage() {
  const { balance, getTransactions } = useGlyphs()
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const transactions = getTransactions()

  // Handle Stripe return
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      const glyphs = searchParams.get('glyphs')
      toast.success(`⬡ +${glyphs} GLYPHS crédités ! Merci pour ton achat 🎉`, {
        duration: 5000,
        style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }
      })
      // Clean URL
      window.history.replaceState({}, '', '/glyphs')
    }
    if (searchParams.get('cancelled') === 'true') {
      toast('Paiement annulé.', { icon: '↩️' })
      window.history.replaceState({}, '', '/glyphs')
    }
  }, [searchParams])

  const buyPack = async (packId: string) => {
    if (!user) { toast.error('Connecte-toi pour acheter des GLYPHS'); return }
    setLoading(packId)
    try {
      const res = await fetch('/api/coins/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId, userId: user.id }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else toast.error(data.error || 'Erreur paiement')
    } catch {
      toast.error('Erreur de connexion au paiement')
    }
    setLoading(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
          <span className="text-violet-400 text-3xl">⬡</span> GLYPHS
        </h1>
        <p className="text-text-muted text-sm mt-0.5">La monnaie de NEXUS — Paris, tips, cadeaux, abonnements</p>
      </motion.div>

      {/* Balance */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-violet-500/20 to-cyan-500/5 border border-violet-500/30 rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-violet-400/70 mb-1">Mon solde</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{balance.toLocaleString('fr-FR')}</span>
            <span className="text-violet-400/60 text-lg pb-1">Glyphs</span>
          </div>
          <p className="text-xs text-violet-400/50 mt-1">≈ {(balance / 110).toFixed(2)}€ de valeur</p>
        </div>
        <span className="text-violet-400/30 text-7xl font-black">⬡</span>
      </motion.div>

      {/* Rewarded Ad */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6">
        <RewardedAd />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buy packs */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-violet-400" /> Acheter des Glyphs
          </h2>
          <div className="space-y-3">
            {GLYPH_PACKS.map((pack, i) => (
              <motion.div key={pack.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative bg-surface-2 border ${pack.color} rounded-2xl p-4 flex items-center gap-4 ${pack.popular ? 'ring-1 ring-violet-500/30' : ''}`}>
                {pack.popular && (
                  <span className="absolute -top-2 left-4 bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    MEILLEURE OFFRE
                  </span>
                )}
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-400 text-xl font-black">⬡</span>
                </div>
                <div className="flex-1">
                  <GlyphChip amount={pack.glyphs} size="md" />
                  {pack.bonus && <p className="text-xs text-emerald-400 mt-0.5">{pack.bonus}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-text-primary">{pack.price}€</p>
                  <Button size="sm" onClick={() => buyPack(pack.id)} disabled={loading === pack.id}
                    variant={pack.popular ? 'primary' : 'outline'} className="mt-1">
                    {loading === pack.id ? '...' : 'Acheter'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Earn ways */}
          <h2 className="text-base font-bold text-text-primary mt-5 mb-3 flex items-center gap-2">
            <Gift size={16} className="text-emerald-400" /> Gagner gratuitement
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {EARN_WAYS.map((way, i) => (
              <motion.div key={way.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-surface-2 border border-white/5 rounded-xl p-3 flex items-center gap-2">
                <span className="text-lg">{way.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-secondary truncate">{way.label}</p>
                  <p className="text-xs font-bold text-violet-400">{way.glyphs}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Transactions history */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
            <History size={16} className="text-cyan-400" /> Historique
          </h2>
          <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-sm">
                <span className="text-3xl block mb-2">⬡</span>
                Aucune transaction pour l&apos;instant
              </div>
            ) : (
              transactions.slice(0, 8).map((tx: { id: string; amount: number; event: string; created_at: string }, i: number) => (
                <motion.div key={tx.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                    {tx.amount > 0 ? <ArrowDownLeft size={14} className="text-emerald-400" /> : <ArrowUpRight size={14} className="text-rose-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{tx.event}</p>
                    <p className="text-xs text-text-muted">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} ⬡
                  </span>
                </motion.div>
              ))
            )}
          </div>

          {/* Usage */}
          <div className="mt-4 bg-surface-2 border border-white/5 rounded-2xl p-4">
            <p className="text-sm font-bold text-text-primary mb-3">Utiliser mes Glyphs</p>
            <div className="space-y-2 text-sm text-text-muted">
              {[
                { emoji: '🎰', label: 'Paris sportifs & events', min: 10 },
                { emoji: '💰', label: 'Tips à un créateur', min: 50 },
                { emoji: '🎁', label: 'Cadeaux virtuels', min: 100 },
                { emoji: '🚀', label: 'Booster un post 24h', min: 200 },
                { emoji: '⭐', label: 'Abonnement créateur', min: 500 },
                { emoji: '🔥', label: '+10 messages Prométhée', min: 100 },
              ].map(u => (
                <div key={u.label} className="flex items-center justify-between">
                  <span>{u.emoji} {u.label}</span>
                  <span className="text-violet-400 font-semibold">min. {u.min} ⬡</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GlyphsPageWrapper() { return <Suspense><GlyphsPage /></Suspense> }
