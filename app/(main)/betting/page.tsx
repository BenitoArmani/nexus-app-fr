'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, Trophy, Zap, TrendingUp } from 'lucide-react'
import BettingCard from '@/components/betting/BettingCard'
import ConfettiEffect from '@/components/ui/ConfettiEffect'
import { useBetting } from '@/hooks/useBetting'
import { formatNumber } from '@/lib/utils'

export default function BettingPage() {
  const { questions, coins, placeBet } = useBetting()
  const [confetti, setConfetti] = useState(false)

  const handleBet = (questionId: string, optionId: string, amount: number): boolean => {
    const success = placeBet(questionId, optionId, amount)
    // Small chance of confetti on successful bet (simulates win)
    if (success && Math.random() > 0.7) {
      setConfetti(true)
      setTimeout(() => setConfetti(false), 3000)
    }
    return success
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <ConfettiEffect active={confetti} onDone={() => setConfetti(false)} />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
            🎰 Paris en direct
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Parie avec tes NEXUS Coins sur les événements live</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2">
          <Coins size={18} className="text-amber-400" />
          <span className="text-amber-400 font-black text-lg">{formatNumber(coins)}</span>
          <span className="text-amber-400/60 text-xs">coins</span>
        </div>
      </motion.div>

      {/* Stats banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Trophy, label: 'Paris gagnés', value: '12', color: 'text-amber-400' },
          { icon: TrendingUp, label: 'Gains totaux', value: '3,420', color: 'text-emerald-400' },
          { icon: Zap, label: 'Paris actifs', value: questions.length.toString(), color: 'text-violet-400' },
        ].map(s => (
          <div key={s.label} className="bg-surface-2 border border-white/5 rounded-2xl p-3 text-center">
            <s.icon size={16} className={`${s.color} mx-auto mb-1`} />
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-text-muted">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <BettingCard question={q} coins={coins} onBet={handleBet} />
          </motion.div>
        ))}
      </div>

      {/* Earn coins banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-5 text-center">
        <Coins size={28} className="text-amber-400 mx-auto mb-2" />
        <p className="text-sm font-bold text-text-primary mb-1">Gagne plus de NEXUS Coins</p>
        <p className="text-xs text-text-muted mb-3">Poste du contenu, reçois des likes, complète des quizz</p>
        <div className="flex justify-center gap-4 text-xs text-text-muted">
          <span>📹 +50 coins/reel</span>
          <span>❤️ +1 coin/like</span>
          <span>📚 +100 coins/quiz</span>
        </div>
      </motion.div>
    </div>
  )
}
