'use client'
import { motion } from 'framer-motion'
import { Award, TrendingUp, Star, Zap, Users, Gift } from 'lucide-react'

const RANKS = [
  { id: 'discovery', name: 'Découverte', emoji: '🌱', min: 0, max: 499, color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30', perks: ['Accès de base'] },
  { id: 'bronze', name: 'Bronze', emoji: '🥉', min: 500, max: 1999, color: 'text-amber-600', bg: 'bg-amber-600/20', border: 'border-amber-600/30', perks: ['Badge Bronze', 'Commission -2%'] },
  { id: 'silver', name: 'Argent', emoji: '🥈', min: 2000, max: 4999, color: 'text-gray-300', bg: 'bg-gray-400/20', border: 'border-gray-400/30', perks: ['Badge Argent', 'Commission -5%', 'Boost x1.2'] },
  { id: 'gold', name: 'Or', emoji: '🥇', min: 5000, max: 9999, color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/30', perks: ['Badge Or', 'Commission -8%', 'Boost x1.5', 'Support prioritaire'] },
  { id: 'platinum', name: 'Platine', emoji: '💎', min: 10000, max: 24999, color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/30', perks: ['Badge Platine', 'Commission -10%', 'Boost x2', 'Analytics avancés'] },
  { id: 'legend', name: 'Légende', emoji: '👑', min: 25000, max: Infinity, color: 'text-violet-400', bg: 'bg-violet-400/20', border: 'border-violet-400/30', perks: ['Badge Légende', 'Commission -15%', 'Boost x3', 'Accès bêta', 'Call mensuel équipe'] },
]

const CURRENT_XP = 1840
const CURRENT_RANK = RANKS[1] // Bronze

const XP_SOURCES = [
  { icon: TrendingUp, label: 'Gains cumulés (€ → XP)', ratio: '1€ = 10 XP' },
  { icon: Star, label: 'Posts publiés', ratio: '1 post = 5 XP' },
  { icon: Users, label: 'Invitations acceptées', ratio: '1 ami = 50 XP' },
  { icon: Zap, label: 'Ancienneté', ratio: '1 mois = 30 XP' },
  { icon: Gift, label: 'Tips reçus', ratio: '1€ tip = 5 XP' },
]

export default function LoyaltyPage() {
  const nextRank = RANKS[RANKS.findIndex(r => r.id === CURRENT_RANK.id) + 1]
  const progress = ((CURRENT_XP - CURRENT_RANK.min) / ((nextRank?.min || CURRENT_XP + 1) - CURRENT_RANK.min)) * 100

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
          <Award size={24} className="text-violet-400" /> Programme de fidélité
        </h1>
        <p className="text-text-muted text-sm mt-0.5">Gagne des XP, monte en rang, débloque des avantages</p>
      </motion.div>

      {/* Current rank */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className={`${CURRENT_RANK.bg} border ${CURRENT_RANK.border} rounded-2xl p-6 mb-6`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{CURRENT_RANK.emoji}</span>
          <div>
            <p className="text-sm text-text-muted">Rang actuel</p>
            <h2 className={`text-2xl font-black ${CURRENT_RANK.color}`}>{CURRENT_RANK.name}</h2>
            <p className="text-sm text-text-muted">{CURRENT_XP.toLocaleString()} XP</p>
          </div>
        </div>

        {nextRank && (
          <div>
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>{CURRENT_RANK.name}</span>
              <span className={nextRank.color}>{nextRank.name} — {nextRank.min.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
              />
            </div>
            <p className="text-xs text-text-muted mt-1">{nextRank.min - CURRENT_XP} XP pour atteindre {nextRank.name}</p>
          </div>
        )}
      </motion.div>

      {/* All ranks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {RANKS.map((rank, i) => {
          const isCurrent = rank.id === CURRENT_RANK.id
          const isLocked = rank.min > CURRENT_XP
          return (
            <motion.div key={rank.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`${rank.bg} border ${rank.border} rounded-2xl p-4 relative ${isLocked ? 'opacity-50' : ''} ${isCurrent ? 'ring-2 ring-violet-500' : ''}`}>
              {isCurrent && <span className="absolute -top-2 left-3 bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ACTUEL</span>}
              <span className="text-2xl mb-2 block">{rank.emoji}</span>
              <p className={`text-sm font-bold ${rank.color}`}>{rank.name}</p>
              <p className="text-xs text-text-muted">{rank.min === 0 ? '0' : rank.min.toLocaleString()} XP</p>
              <ul className="mt-2 space-y-0.5">
                {rank.perks.map(p => (
                  <li key={p} className="text-[10px] text-text-muted flex items-center gap-1">
                    <span className="text-emerald-400">✓</span> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>

      {/* XP sources */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-surface-2 border border-white/5 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-3">Comment gagner des XP ?</h3>
        <div className="space-y-2">
          {XP_SOURCES.map(src => (
            <div key={src.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <src.icon size={14} className="text-violet-400" />
                <span className="text-sm text-text-secondary">{src.label}</span>
              </div>
              <span className="text-xs font-bold text-violet-400">{src.ratio}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
