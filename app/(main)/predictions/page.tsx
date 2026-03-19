'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, Users, Clock, Flame, Plus, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useGlyphs } from '@/hooks/useGlyphs'

interface Prediction {
  id: string
  category: string
  categoryEmoji: string
  categoryColor: string
  question: string
  yesPercent: number
  noPercent: number
  totalStaked: number
  totalBettors: number
  endsAt: number
  source: string
  trending?: boolean
  resolved?: boolean
  resolvedTo?: 'yes' | 'no'
}

const PREDICTIONS: Prediction[] = [
  {
    id: '1',
    category: 'Gaming',
    categoryEmoji: '🎮',
    categoryColor: 'text-red-400',
    question: 'GTA 6 sortira avant fin 2025 ?',
    yesPercent: 78,
    noPercent: 22,
    totalStaked: 45230,
    totalBettors: 1247,
    endsAt: new Date('2025-12-31').getTime(),
    source: 'rockstargames.com officiel',
    trending: true,
  },
  {
    id: '2',
    category: 'Gaming',
    categoryEmoji: '🎮',
    categoryColor: 'text-red-400',
    question: 'GTA 6 sera disponible sur PC à la sortie ?',
    yesPercent: 31,
    noPercent: 69,
    totalStaked: 18420,
    totalBettors: 892,
    endsAt: new Date('2025-12-31').getTime(),
    source: 'rockstargames.com officiel',
  },
  {
    id: '3',
    category: 'Crypto',
    categoryEmoji: '₿',
    categoryColor: 'text-amber-400',
    question: 'Bitcoin dépassera 200 000$ avant 2026 ?',
    yesPercent: 54,
    noPercent: 46,
    totalStaked: 128900,
    totalBettors: 3821,
    endsAt: new Date('2025-12-31').getTime(),
    source: 'coinmarketcap.com',
    trending: true,
  },
  {
    id: '4',
    category: 'Tech & IA',
    categoryEmoji: '🤖',
    categoryColor: 'text-cyan-400',
    question: 'OpenAI lancera GPT-5 avant juin 2025 ?',
    yesPercent: 67,
    noPercent: 33,
    totalStaked: 34500,
    totalBettors: 1456,
    endsAt: new Date('2025-06-01').getTime(),
    source: 'openai.com officiel',
  },
  {
    id: '5',
    category: 'Tech & IA',
    categoryEmoji: '🤖',
    categoryColor: 'text-cyan-400',
    question: "Apple lancera ses lunettes AR en 2025 ?",
    yesPercent: 42,
    noPercent: 58,
    totalStaked: 22100,
    totalBettors: 987,
    endsAt: new Date('2025-12-31').getTime(),
    source: 'apple.com officiel',
  },
  {
    id: '6',
    category: 'Géopolitique',
    categoryEmoji: '🌍',
    categoryColor: 'text-blue-400',
    question: "La Russie et l'Ukraine signeront un accord de paix en 2025 ?",
    yesPercent: 18,
    noPercent: 82,
    totalStaked: 87400,
    totalBettors: 4201,
    endsAt: new Date('2025-12-31').getTime(),
    source: 'reuters.com / AP',
    trending: true,
  },
  {
    id: '7',
    category: 'Sport',
    categoryEmoji: '🏆',
    categoryColor: 'text-yellow-400',
    question: 'La France gagnera le Mondial 2026 ?',
    yesPercent: 23,
    noPercent: 77,
    totalStaked: 56700,
    totalBettors: 2890,
    endsAt: new Date('2026-07-15').getTime(),
    source: 'fifa.com officiel',
  },
  {
    id: '8',
    category: 'Sport',
    categoryEmoji: '🏆',
    categoryColor: 'text-yellow-400',
    question: 'Mbappé marquera 30 buts cette saison ?',
    yesPercent: 61,
    noPercent: 39,
    totalStaked: 31200,
    totalBettors: 1543,
    endsAt: new Date('2025-06-01').getTime(),
    source: 'realmadrid.com / transfermarkt.com',
  },
  {
    id: '9',
    category: 'Pop Culture',
    categoryEmoji: '🎬',
    categoryColor: 'text-pink-400',
    question: "Qui gagnera l'Oscar du meilleur film 2026 ?",
    yesPercent: 45,
    noPercent: 55,
    totalStaked: 14300,
    totalBettors: 672,
    endsAt: new Date('2026-03-01').getTime(),
    source: 'oscars.org officiel',
  },
  {
    id: '10',
    category: '🇫🇷 France',
    categoryEmoji: '🇫🇷',
    categoryColor: 'text-blue-300',
    question: 'Le prix du pain dépassera 2€ la baguette en 2025 ?',
    yesPercent: 71,
    noPercent: 29,
    totalStaked: 9800,
    totalBettors: 452,
    endsAt: new Date('2025-12-31').getTime(),
    source: 'insee.fr statistiques',
  },
]

const CATEGORIES = ['Tout', 'Gaming', 'Crypto', 'Tech & IA', 'Géopolitique', 'Sport', 'Pop Culture', '🇫🇷 France']

function TimeLeft({ endsAt }: { endsAt: number }) {
  const ms = endsAt - Date.now()
  if (ms < 0) return <span className="text-zinc-500">Terminé</span>
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  if (days > 30) {
    const months = Math.floor(days / 30)
    return <span>{months} mois</span>
  }
  return <span>{days} jours</span>
}

function BetModal({ prediction, onClose, onBet }: {
  prediction: Prediction
  onClose: () => void
  onBet: (side: 'yes' | 'no', amount: number) => void
}) {
  const [side, setSide] = useState<'yes' | 'no'>('yes')
  const [amount, setAmount] = useState('50')
  const [done, setDone] = useState(false)
  const betAmount = parseInt(amount) || 0
  const odds = side === 'yes' ? prediction.yesPercent : prediction.noPercent
  const potentialWin = odds > 0 ? Math.floor(betAmount * (100 / odds)) : 0

  const execute = () => {
    if (betAmount < 1) return
    onBet(side, betAmount)
    setDone(true)
    setTimeout(() => { setDone(false); onClose() }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-surface-2 border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/5">
          <p className="text-xs text-zinc-500 mb-1">{prediction.categoryEmoji} {prediction.category}</p>
          <p className="text-sm font-bold text-white leading-snug">{prediction.question}</p>
        </div>
        <div className="p-5 space-y-4">
          {/* YES/NO toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSide('yes')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${side === 'yes' ? 'bg-emerald-500 text-white' : 'bg-surface-3 text-zinc-400 hover:text-white'}`}
            >
              ✅ OUI · {prediction.yesPercent}%
            </button>
            <button
              onClick={() => setSide('no')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${side === 'no' ? 'bg-rose-500 text-white' : 'bg-surface-3 text-zinc-400 hover:text-white'}`}
            >
              ❌ NON · {prediction.noPercent}%
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-zinc-400 font-medium">Mise (GLYPHS)</label>
            <div className="flex gap-2 mt-1.5">
              <input
                type="number" min="1" value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 bg-surface-3 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[25, 50, 100, 500].map(n => (
                <button key={n} onClick={() => setAmount(String(n))}
                  className="flex-1 py-1.5 bg-surface-3 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors">
                  {n}⬡
                </button>
              ))}
            </div>
          </div>

          {/* Potential win */}
          {betAmount > 0 && (
            <div className="bg-surface-3 rounded-xl p-3 space-y-1">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Mise</span>
                <span className="text-white">{betAmount}⬡</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Gain potentiel si {side === 'yes' ? 'OUI' : 'NON'}</span>
                <span className="text-emerald-400 font-semibold">+{potentialWin}⬡</span>
              </div>
              <p className="text-[10px] text-zinc-600 pt-1">Les cotes évoluent selon les mises</p>
            </div>
          )}

          {!done ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={execute}
              disabled={betAmount < 1}
              className={`w-full py-3.5 font-bold text-base rounded-2xl disabled:opacity-40 transition-all ${
                side === 'yes' ? 'bg-emerald-500 hover:bg-emerald-400 text-white' : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              Parier {betAmount}⬡ sur {side === 'yes' ? 'OUI' : 'NON'}
            </motion.button>
          ) : (
            <div className="w-full py-3.5 text-center font-bold rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Pari enregistré !
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PredictionsPage() {
  const { balance, spendGlyphs, addGlyphs } = useGlyphs()
  const [category, setCategory] = useState('Tout')
  const [activePrediction, setActivePrediction] = useState<Prediction | null>(null)
  const [userBets, setUserBets] = useState<Record<string, { side: 'yes' | 'no'; amount: number }>>({})

  const filtered = PREDICTIONS.filter(p => category === 'Tout' || p.category === category)
  const trending = PREDICTIONS.filter(p => p.trending)

  const handleBet = (prediction: Prediction, side: 'yes' | 'no', amount: number) => {
    if (!spendGlyphs(amount, `Pari: ${prediction.question}`)) return
    setUserBets(prev => ({ ...prev, [prediction.id]: { side, amount } }))
    setActivePrediction(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
              <Sparkles size={22} className="text-violet-400" /> Prédictions
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Parie tes GLYPHS sur les événements du monde réel</p>
          </div>
          <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-xl px-3 py-2">
            <span className="text-violet-400">⬡</span>
            <span className="text-sm font-bold text-violet-400">{balance.toLocaleString('fr-FR')}</span>
          </div>
        </div>
      </motion.div>

      {/* Trending banner */}
      {trending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame size={14} className="text-amber-400" />
            <span className="text-sm font-bold text-amber-400">Trending 🔥</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {trending.map(p => (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePrediction(p)}
                className="flex-shrink-0 w-[200px] bg-surface-2 border border-white/5 rounded-xl p-3 text-left hover:border-violet-500/30 transition-colors"
              >
                <p className="text-xs font-semibold text-white leading-snug mb-2 line-clamp-2">{p.question}</p>
                <div className="flex gap-1 mb-1.5">
                  <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${p.yesPercent}%`, flex: `${p.yesPercent}` }} />
                  <div className="h-1.5 rounded-full bg-rose-500" style={{ flex: `${p.noPercent}` }} />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>OUI {p.yesPercent}%</span>
                  <span>NON {p.noPercent}%</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              category === cat
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'bg-surface-2 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prediction cards grid */}
      <div className="space-y-3">
        {filtered.map((p, i) => {
          const myBet = userBets[p.id]

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-surface-2 border rounded-2xl p-4 transition-colors hover:border-violet-500/20 ${
                p.trending ? 'border-amber-500/20' : 'border-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${p.categoryColor}`}>{p.categoryEmoji} {p.category}</span>
                    {p.trending && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">🔥 Trending</span>
                    )}
                    {myBet && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${myBet.side === 'yes' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {myBet.side === 'yes' ? '✅ OUI' : '❌ NON'} {myBet.amount}⬡
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">{p.question}</p>
                </div>
              </div>

              {/* Percentage bar */}
              <div className="mb-2">
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.yesPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.04 }}
                    className="h-full bg-emerald-500 rounded-l-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.noPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.04 }}
                    className="h-full bg-rose-500 rounded-r-full"
                  />
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-emerald-400">OUI {p.yesPercent}%</span>
                  <span className="text-rose-400">NON {p.noPercent}%</span>
                </div>
              </div>

              {/* Stats + actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <span className="text-violet-400">⬡</span>
                    {(p.totalStaked / 1000).toFixed(1)}k misés
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={10} />
                    {p.totalBettors.toLocaleString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    <TimeLeft endsAt={p.endsAt} />
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActivePrediction(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 border border-violet-500/20 transition-colors"
                  >
                    Parier <ChevronRight size={11} />
                  </motion.button>
                </div>
              </div>

              {/* Source */}
              <p className="text-[10px] text-zinc-600 mt-1.5">
                🔗 Résultat basé sur : {p.source}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Create prediction CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-surface-2 border border-dashed border-white/10 rounded-2xl p-6 text-center"
      >
        <Sparkles size={24} className="text-zinc-600 mx-auto mb-2" />
        <p className="text-sm font-bold text-text-primary mb-1">Propose une prédiction</p>
        <p className="text-xs text-zinc-500 mb-3">Tu gagnes 2% des mises si Prométhée valide ta question</p>
        <button className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 text-sm font-semibold hover:bg-violet-500/30 transition-colors">
          <Plus size={14} /> Créer une prédiction
        </button>
      </motion.div>

      {/* Bet modal */}
      <AnimatePresence>
        {activePrediction && (
          <BetModal
            prediction={activePrediction}
            onClose={() => setActivePrediction(null)}
            onBet={(side, amount) => handleBet(activePrediction, side, amount)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
