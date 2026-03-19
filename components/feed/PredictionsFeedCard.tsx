'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { useGlyphs } from '@/hooks/useGlyphs'
import { triggerGlyphGain } from '@/components/ui/GlyphGainToast'

interface MiniPrediction {
  id: string
  question: string
  category: string
  categoryEmoji: string
  yesPercent: number
  noPercent: number
  totalBettors: number
  totalStaked: number
  trending?: boolean
}

const FEED_PREDICTIONS: MiniPrediction[] = [
  {
    id: 'fp1',
    question: 'GTA 6 sortira avant fin 2025 ?',
    category: 'Gaming',
    categoryEmoji: '🎮',
    yesPercent: 78,
    noPercent: 22,
    totalBettors: 1247,
    totalStaked: 45230,
    trending: true,
  },
  {
    id: 'fp2',
    question: 'Bitcoin dépassera 200 000$ avant 2026 ?',
    category: 'Crypto',
    categoryEmoji: '₿',
    yesPercent: 54,
    noPercent: 46,
    totalBettors: 3821,
    totalStaked: 128900,
    trending: true,
  },
  {
    id: 'fp3',
    question: 'La France gagnera la Coupe du Monde 2026 ?',
    category: 'Sport',
    categoryEmoji: '⚽',
    yesPercent: 22,
    noPercent: 78,
    totalBettors: 2104,
    totalStaked: 67800,
  },
]

const QUICK_BETS = [25, 50, 100]

export default function PredictionsFeedCard() {
  const { balance, spendGlyphs, addGlyphs } = useGlyphs()
  const [bets, setBets] = useState<Record<string, { side: 'yes' | 'no'; amount: number } | null>>({})
  const [activeBet, setActiveBet] = useState<{ id: string; side: 'yes' | 'no' } | null>(null)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleBet = (predId: string, side: 'yes' | 'no', amount: number) => {
    if (bets[predId]) return // already bet
    const ok = spendGlyphs(amount, `Pari ${side.toUpperCase()} — ${FEED_PREDICTIONS.find(p => p.id === predId)?.question.slice(0, 30)}...`)
    if (!ok) return
    setBets(prev => ({ ...prev, [predId]: { side, amount } }))
    setActiveBet(null)
    // Simulate 30% chance of winning after 2s (demo)
    setTimeout(() => {
      const win = Math.random() > 0.5
      if (win) {
        addGlyphs(Math.round(amount * 1.8), '🎯 Pari gagnant !')
        triggerGlyphGain(Math.round(amount * 1.8), 'Pari gagnant')
      }
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/5"
    >
      <div className="bg-gradient-to-br from-violet-600/10 via-bg-primary to-cyan-600/5 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-violet-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Paris du moment</span>
              <span className="ml-2 text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded-full font-semibold animate-pulse">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Solde: <span className="text-violet-400 font-bold">⬡{balance}</span></span>
            <button onClick={() => setDismissed(true)} className="text-zinc-600 hover:text-zinc-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Predictions list */}
        <div className="space-y-3">
          {FEED_PREDICTIONS.map((pred, i) => {
            const myBet = bets[pred.id]
            const isActive = activeBet?.id === pred.id

            return (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border transition-colors ${
                  myBet
                    ? myBet.side === 'yes'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-rose-500/5 border-rose-500/20'
                    : 'bg-white/3 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="p-3">
                  {/* Question row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm">{pred.categoryEmoji}</span>
                      <p className="text-xs font-semibold text-zinc-200 leading-tight line-clamp-2">{pred.question}</p>
                    </div>
                    {pred.trending && (
                      <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-amber-400 font-semibold">
                        <TrendingUp size={10} />
                        Hot
                      </span>
                    )}
                  </div>

                  {/* Percentage bar */}
                  <div className="flex h-2 rounded-full overflow-hidden gap-px mb-1.5">
                    <motion.div
                      className="bg-emerald-500 rounded-l-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.yesPercent}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                    <motion.div
                      className="bg-rose-500 rounded-r-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.noPercent}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 mb-2">
                    <span className="text-emerald-400 font-semibold">OUI {pred.yesPercent}%</span>
                    <span className="text-zinc-500">{pred.totalBettors.toLocaleString()} parieurs · ⬡{(pred.totalStaked / 1000).toFixed(0)}K</span>
                    <span className="text-rose-400 font-semibold">NON {pred.noPercent}%</span>
                  </div>

                  {/* My bet or bet buttons */}
                  {myBet ? (
                    <div className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-semibold ${
                      myBet.side === 'yes' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      <span>{myBet.side === 'yes' ? '✅' : '❌'}</span>
                      <span>Pari {myBet.side === 'yes' ? 'OUI' : 'NON'} — ⬡{myBet.amount} misés</span>
                      <span className="ml-auto text-zinc-500">Gain potentiel: ⬡{Math.round(myBet.amount * (myBet.side === 'yes' ? (100 / pred.yesPercent) : (100 / pred.noPercent)) * 0.9)}</span>
                    </div>
                  ) : isActive ? (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex gap-1.5">
                          {QUICK_BETS.map(amt => (
                            <button
                              key={amt}
                              onClick={() => handleBet(pred.id, activeBet.side, amt)}
                              disabled={balance < amt}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                balance < amt
                                  ? 'bg-white/5 text-zinc-600 cursor-not-allowed'
                                  : activeBet.side === 'yes'
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              ⬡{amt}
                            </button>
                          ))}
                          <button
                            onClick={() => setActiveBet(null)}
                            className="px-2 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-600 text-center">
                          Mise sur {activeBet.side === 'yes' ? 'OUI' : 'NON'} · Gain ×{activeBet.side === 'yes' ? (100 / pred.yesPercent).toFixed(1) : (100 / pred.noPercent).toFixed(1)} si victoire
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setActiveBet({ id: pred.id, side: 'yes' })}
                        className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-xs font-bold text-emerald-400 transition-colors"
                      >
                        OUI
                      </button>
                      <button
                        onClick={() => setActiveBet({ id: pred.id, side: 'no' })}
                        className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-xs font-bold text-rose-400 transition-colors"
                      >
                        NON
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer link */}
        <Link href="/predictions" className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Voir tous les paris
          <ChevronRight size={12} />
        </Link>
      </div>
    </motion.div>
  )
}
