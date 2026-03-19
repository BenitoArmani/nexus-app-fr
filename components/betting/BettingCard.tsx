'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Coins, Clock, TrendingUp } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { formatNumber, timeAgo } from '@/lib/utils'
import type { BettingQuestion } from '@/types'

interface BettingCardProps {
  question: BettingQuestion
  coins: number
  onBet: (questionId: string, optionId: string, amount: number) => boolean
}

export default function BettingCard({ question, coins, onBet }: BettingCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [amount, setAmount] = useState(100)
  const [betPlaced, setBetPlaced] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const totalBets = question.options.reduce((s, o) => s + o.total_bets, 0)

  const handleBet = () => {
    if (!selected) return
    const success = onBet(question.id, selected, amount)
    if (success) { setBetPlaced(true); setShowInput(false) }
  }

  const expiresIn = () => {
    const diff = new Date(question.expires_at).getTime() - Date.now()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}j`
    return `${hours}h`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-surface-2 border border-white/5 rounded-2xl p-5"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar src={question.creator?.avatar_url} name={question.creator?.full_name || ''} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted mb-1">@{question.creator?.username} · {timeAgo(question.created_at)}</p>
          <h3 className="text-sm font-bold text-text-primary leading-snug">{question.question}</h3>
        </div>
        <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-xl flex-shrink-0">
          <Clock size={10} /> {expiresIn()}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {question.options.map(opt => {
          const pct = totalBets > 0 ? (opt.total_bets / totalBets) * 100 : 25
          const isSelected = selected === opt.id
          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => { if (!betPlaced) { setSelected(opt.id); setShowInput(true) } }}
              disabled={betPlaced}
              className={`w-full text-left relative overflow-hidden rounded-xl border transition-all ${
                isSelected ? 'border-violet-500/60 bg-violet-500/10' : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between px-3 py-2.5">
                <span className="text-sm font-medium text-text-primary">{opt.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-muted">{pct.toFixed(0)}%</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-lg ${opt.odds < 2 ? 'bg-emerald-500/20 text-emerald-400' : opt.odds < 3.5 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    x{opt.odds}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-violet-500/5 transition-all" style={{ width: `${pct}%` }} />
            </motion.button>
          )
        })}
      </div>

      {/* Bet input */}
      {showInput && !betPlaced && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-3">
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1 bg-surface-3 border border-white/5 rounded-xl px-3 py-2">
              <Coins size={14} className="text-amber-400" />
              <input
                type="number" value={amount} onChange={e => setAmount(Math.min(Number(e.target.value), coins))}
                min={10} max={coins} step={10}
                className="flex-1 bg-transparent text-sm text-text-primary focus:outline-none w-20"
              />
              <span className="text-xs text-text-muted">coins</span>
            </div>
            <div className="flex gap-1">
              {[50, 100, 500].map(v => (
                <button key={v} onClick={() => setAmount(Math.min(v, coins))} className="px-2 py-1 text-xs bg-white/5 hover:bg-violet-500/20 rounded-lg text-text-muted hover:text-violet-400 transition-colors">
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={handleBet} className="flex-1">
              Miser {amount} <Coins size={12} />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setSelected(null); setShowInput(false) }}>Annuler</Button>
          </div>
        </motion.div>
      )}

      {betPlaced && (
        <div className="flex items-center justify-center gap-2 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400 font-semibold mb-3">
          ✅ Pari placé ! Bonne chance 🍀
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 text-xs text-text-muted border-t border-white/5 pt-3">
        <span className="flex items-center gap-1"><Coins size={11} className="text-amber-400" /> {formatNumber(question.total_pool)} coins</span>
        <span className="flex items-center gap-1"><TrendingUp size={11} /> Pool actif</span>
        <span className="ml-auto flex items-center gap-1 text-amber-400 font-medium"><Coins size={11} /> {formatNumber(coins)} coins</span>
      </div>
    </motion.div>
  )
}
