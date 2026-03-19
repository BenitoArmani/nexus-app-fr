'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, TrendingUp, ArrowUpRight, ArrowDownRight, Gift,
  Flame, Target, Zap, Users, Eye, Star, Trophy, ChevronRight,
  CreditCard, Clock, CheckCircle2, Circle, BarChart2
} from 'lucide-react'
import Link from 'next/link'
import { useGlyphs } from '@/hooks/useGlyphs'
import { useMissions } from '@/hooks/useMissions'
import { useStreak } from '@/hooks/useStreak'
import { useAuth } from '@/hooks/useAuth'

// Simulated daily earnings breakdown
const DAILY_EARNINGS = [
  { label: 'Posts & Likes reçus', amount: 45, emoji: '📝', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { label: 'Missions complétées', amount: 75, emoji: '🎯', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Pubs regardées', amount: 30, emoji: '📺', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Prédictions gagnées', amount: 180, emoji: '🔮', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'Bonus streak', amount: 20, emoji: '🔥', color: 'text-orange-400', bg: 'bg-orange-500/10' },
]

// Weekly chart data (last 7 days)
const WEEKLY_DATA = [
  { day: 'L', amount: 120 },
  { day: 'M', amount: 245 },
  { day: 'M', amount: 88 },
  { day: 'J', amount: 310 },
  { day: 'V', amount: 195 },
  { day: 'S', amount: 420 },
  { day: 'D', amount: 350 },
]

const WAYS_TO_EARN = [
  { emoji: '📺', label: 'Regarder une pub', reward: '0,03 €', action: '/feed', color: 'text-amber-400' },
  { emoji: '🔮', label: 'Parier sur une prédiction', reward: '×1.8', action: '/predictions', color: 'text-violet-400' },
  { emoji: '📈', label: 'Portfolio Débutant (top 3)', reward: 500, action: '/markets', color: 'text-emerald-400' },
  { emoji: '👥', label: 'Parrainer un ami', reward: 500, action: '/invite', color: 'text-cyan-400' },
  { emoji: '🎬', label: 'Poster un Reel', reward: 50, action: '/reels', color: 'text-rose-400' },
  { emoji: '💬', label: 'Commenter un post', reward: 5, action: '/feed', color: 'text-blue-400' },
]

const CONVERSION_RATE = 0.001 // 1 GLYPH = 0.001€ = 0.1 centime

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const duration = 800
    const start = performance.now()
    const from = 0
    const to = value
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [value])

  return <span className={className}>{display.toLocaleString()}</span>
}

export default function GlyphsPage() {
  const { balance, getTransactions } = useGlyphs()
  const { dailyMissions, weeklyMissions } = useMissions(null)
  const { streak } = useStreak(null)
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'missions' | 'earn'>('overview')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  const transactions = getTransactions()
  const todayTotal = DAILY_EARNINGS.reduce((s, e) => s + e.amount, 0)
  const weekTotal = WEEKLY_DATA.reduce((s, d) => s + d.amount, 0)
  const weekMax = Math.max(...WEEKLY_DATA.map(d => d.amount))
  const euroValue = (balance * CONVERSION_RATE).toFixed(2)
  const completedDaily = dailyMissions.filter(m => m.completed).length
  const completedWeekly = weeklyMissions.filter(m => m.completed).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">GLYPHS</h1>
            <p className="text-xs text-zinc-500">Ta monnaie NEXUS</p>
          </div>
        </div>
      </motion.div>

      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-violet-600/20 via-violet-600/10 to-cyan-600/5 border border-violet-500/30 rounded-3xl p-6 mb-4 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />

        <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-1 relative">Solde total</p>
        <div className="flex items-end gap-3 mb-2 relative">
          <span className="text-4xl font-black text-white">⬡</span>
          <AnimatedNumber value={balance} className="text-5xl font-black text-white" />
        </div>
        <p className="text-sm text-zinc-400 relative">≈ <span className="text-emerald-400 font-semibold">{euroValue}€</span> en valeur</p>

        {/* Stats row */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 relative">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Aujourd'hui</p>
            <p className="text-sm font-bold text-emerald-400">+{todayTotal} ⬡</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Cette semaine</p>
            <p className="text-sm font-bold text-violet-400">+{weekTotal} ⬡</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Streak</p>
            <p className="text-sm font-bold text-orange-400">🔥 {streak?.current_streak ?? 0}j</p>
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-2xl text-sm font-bold text-emerald-400 transition-colors"
        >
          <CreditCard size={16} />
          Retirer
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex items-center justify-center gap-2 py-3 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-2xl text-sm font-bold text-violet-400 transition-colors"
          onClick={() => setActiveTab('earn')}
        >
          <Zap size={16} />
          Gagner plus
        </motion.button>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-1 bg-surface-2 rounded-2xl p-1 mb-4"
      >
        {([
          { key: 'overview', label: 'Aperçu', icon: BarChart2 },
          { key: 'history', label: 'Historique', icon: Clock },
          { key: 'missions', label: 'Missions', icon: Target },
          { key: 'earn', label: 'Gagner', icon: Sparkles },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === key
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon size={12} />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Weekly chart */}
            <div className="bg-surface-2 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-violet-400" />
                <h3 className="text-sm font-bold text-white">Cette semaine</h3>
                <span className="ml-auto text-sm font-black text-violet-400">+{weekTotal} ⬡</span>
              </div>
              <div className="flex items-end gap-2 h-20">
                {WEEKLY_DATA.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className={`w-full rounded-t-lg ${i === 6 ? 'bg-violet-500' : 'bg-violet-500/30'}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.amount / weekMax) * 64}px` }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                    />
                    <span className="text-[10px] text-zinc-600">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's breakdown */}
            <div className="bg-surface-2 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={16} className="text-orange-400" />
                <h3 className="text-sm font-bold text-white">Gains d'aujourd'hui</h3>
                <span className="ml-auto text-sm font-black text-emerald-400">+{todayTotal} ⬡</span>
              </div>
              <div className="space-y-2">
                {DAILY_EARNINGS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center text-sm shrink-0`}>
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-300 truncate">{item.label}</p>
                        <p className={`text-xs font-bold ${item.color} shrink-0 ml-2`}>+{item.amount} ⬡</p>
                      </div>
                      <div className="mt-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${item.color.replace('text-', 'bg-').replace('-400', '-500')}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.amount / todayTotal) * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conversion info */}
            <div className="bg-surface-2 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Valeur & Conversion</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-surface-3 rounded-xl p-3">
                  <p className="text-lg font-black text-violet-400">⬡100</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">= 0.10€</p>
                </div>
                <div className="bg-surface-3 rounded-xl p-3">
                  <p className="text-lg font-black text-violet-400">⬡1 000</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">= 1.00€</p>
                </div>
                <div className="bg-surface-3 rounded-xl p-3">
                  <p className="text-lg font-black text-violet-400">⬡10K</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">= 10.00€</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 text-center mt-3">Retrait minimum : ⬡5 000 (5€) · Délai: 3-5 jours ouvrés</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-violet-400" />
                <h3 className="text-sm font-bold text-white">Historique des transactions</h3>
              </div>
            </div>
            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">⬡</p>
                <p className="text-sm text-zinc-500">Aucune transaction pour l'instant</p>
                <p className="text-xs text-zinc-600 mt-1">Commence à gagner des GLYPHS !</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.slice(0, 20).map((tx: { id: string; amount: number; event: string; created_at: string }) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.amount > 0 ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                    }`}>
                      {tx.amount > 0
                        ? <ArrowUpRight size={16} className="text-emerald-400" />
                        : <ArrowDownRight size={16} className="text-rose-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{tx.event}</p>
                      <p className="text-[10px] text-zinc-600">
                        {new Date(tx.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className={`text-sm font-black shrink-0 ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} ⬡
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'missions' && (
          <motion.div
            key="missions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Daily missions */}
            <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={16} className="text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Missions du jour</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{completedDaily}/{dailyMissions.length}</span>
                  <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      animate={{ width: `${(completedDaily / dailyMissions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {dailyMissions.map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="shrink-0">
                      {m.completed
                        ? <CheckCircle2 size={18} className="text-emerald-400" />
                        : <Circle size={18} className="text-zinc-700" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${m.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                        {m.emoji} {m.title}
                      </p>
                      {!m.completed && m.target_count > 1 && (
                        <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden w-32">
                          <motion.div
                            className="h-full bg-violet-500 rounded-full"
                            animate={{ width: `${(m.progress / m.target_count) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${m.completed ? 'text-zinc-600 line-through' : 'text-violet-400'}`}>
                      +{m.reward_glyphs} ⬡
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly missions */}
            <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-violet-400" />
                  <h3 className="text-sm font-bold text-white">Missions semaine</h3>
                </div>
                <span className="text-xs text-zinc-500">{completedWeekly}/{weeklyMissions.length}</span>
              </div>
              <div className="divide-y divide-white/5">
                {weeklyMissions.map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="shrink-0">
                      {m.completed
                        ? <CheckCircle2 size={18} className="text-emerald-400" />
                        : <Circle size={18} className="text-zinc-700" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${m.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                        {m.emoji} {m.title}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{m.description}</p>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${m.completed ? 'text-zinc-600 line-through' : 'text-amber-400'}`}>
                      +{m.reward_glyphs} ⬡
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total available */}
            <div className="bg-gradient-to-r from-violet-600/10 to-cyan-600/5 border border-violet-500/20 rounded-2xl p-4 flex items-center gap-3">
              <Gift size={20} className="text-violet-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">
                  Tout compléter = +{[...dailyMissions, ...weeklyMissions].filter(m => !m.completed).reduce((s, m) => s + m.reward_glyphs, 0)} ⬡ restants
                </p>
                <p className="text-xs text-zinc-500">Les missions quotidiennes se renouvellent chaque jour à minuit</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'earn' && (
          <motion.div
            key="earn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-400" />
                  <h3 className="text-sm font-bold text-white">Comment gagner plus de GLYPHS</h3>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {WAYS_TO_EARN.map((way, i) => (
                  <Link href={way.action} key={i}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors cursor-pointer group"
                    >
                      <span className="text-xl shrink-0">{way.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-200">{way.label}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-sm font-black ${way.color}`}>
                          {typeof way.reward === 'number' ? `+${way.reward} ⬡` : way.reward}
                        </span>
                        <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Referral card */}
            <div className="bg-gradient-to-br from-cyan-600/15 to-violet-600/10 border border-cyan-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Parrainage — 500 ⬡ par ami</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-3">Invite tes amis et reçois 500 GLYPHS pour chaque inscription validée.</p>
              <button className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl text-sm font-bold text-cyan-400 transition-colors">
                Copier mon lien de parrainage
              </button>
            </div>

            {/* Premium tip */}
            <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/5 border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Créateur Pro — ×3 GLYPHS</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-3">Active le mode Créateur Pro pour tripler tes gains sur chaque post publié.</p>
              <button className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-sm font-bold text-amber-400 transition-colors">
                Activer Créateur Pro →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-surface-2 border border-white/10 rounded-3xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-emerald-400" />
                <h3 className="text-base font-bold text-white">Retirer mes GLYPHS</h3>
              </div>

              <div className="bg-surface-3 rounded-2xl p-4 mb-4">
                <p className="text-xs text-zinc-500 mb-1">Solde disponible</p>
                <p className="text-2xl font-black text-violet-400">⬡ {balance.toLocaleString()}</p>
                <p className="text-xs text-zinc-500 mt-0.5">= {euroValue}€</p>
              </div>

              <div className="mb-3">
                <label className="text-xs text-zinc-400 mb-1.5 block">Montant à retirer (en GLYPHS)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Min. 5000 GLYPHS"
                  min={5000}
                  max={balance}
                  className="w-full bg-surface-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
                />
                {withdrawAmount && Number(withdrawAmount) >= 5000 && (
                  <p className="text-xs text-emerald-400 mt-1">= {(Number(withdrawAmount) * CONVERSION_RATE).toFixed(2)}€ sur ton compte</p>
                )}
                {withdrawAmount && Number(withdrawAmount) < 5000 && (
                  <p className="text-xs text-rose-400 mt-1">Minimum 5 000 GLYPHS (5€)</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[5000, 10000, 25000].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setWithdrawAmount(String(Math.min(amt, balance)))}
                    className="py-2 bg-surface-3 hover:bg-white/5 border border-white/5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                  >
                    ⬡{(amt / 1000).toFixed(0)}K
                  </button>
                ))}
              </div>

              <button
                disabled={!withdrawAmount || Number(withdrawAmount) < 5000 || Number(withdrawAmount) > balance}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white disabled:text-zinc-500 font-bold rounded-2xl text-sm transition-colors"
                onClick={() => {
                  setShowWithdrawModal(false)
                  setWithdrawAmount('')
                }}
              >
                Confirmer le retrait
              </button>
              <p className="text-[10px] text-zinc-600 text-center mt-2">Délai: 3-5 jours ouvrés · Virement SEPA</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
