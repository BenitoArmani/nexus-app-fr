'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Clock, Coins, Users, Star, History, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { soundSystem } from '@/lib/sounds'

function CountdownTimer({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    const calc = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setTimeLeft('EN COURS !'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`)
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])
  return <span>{timeLeft}</span>
}

function getNextFriday21h() {
  const d = new Date()
  const day = d.getDay()
  const daysUntil = (5 - day + 7) % 7 || 7
  const friday = new Date(d)
  friday.setDate(d.getDate() + daysUntil)
  friday.setHours(21, 0, 0, 0)
  return friday.toISOString()
}

export default function GoldenNuggetPage() {
  const [nextEvent] = useState(getNextFriday21h())
  const [potAmount, setPotAmount] = useState(15000)
  const [participants, setParticipants] = useState(247)
  const [betAmount, setBetAmount] = useState(100)
  const [hasParticipated, setHasParticipated] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const participate = () => {
    if (hasParticipated) return
    soundSystem?.play('bet_win')
    setHasParticipated(true)
    setPotAmount(p => p + betAmount)
    setParticipants(p => p + 1)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-yellow-500/30 p-6"
        style={{ background: 'linear-gradient(135deg, rgba(120,53,15,0.4) 0%, rgba(17,24,39,0.9) 50%, rgba(131,24,67,0.3) 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>
              <Trophy size={36} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.8))' }} />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black text-yellow-400 tracking-tight">
                GOLDEN NUGGET
              </h1>
              <p className="text-xs text-yellow-400/60 font-medium tracking-widest uppercase">Chaque vendredi à 21h</p>
            </div>
          </div>

          {/* Pot display */}
          <div className="text-center py-5 mb-4">
            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Cagnotte</p>
            <motion.div
              key={potAmount}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-6xl font-black"
              style={{ color: '#fbbf24', textShadow: '0 0 40px rgba(251,191,36,0.5)' }}
            >
              {potAmount.toLocaleString()}
            </motion.div>
            <p className="text-yellow-400/70 font-bold text-lg mt-1">GLYPHS</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 rounded-2xl py-3 mb-5"
               style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <Clock size={16} className="text-yellow-400" />
            <span className="font-black font-mono text-xl text-yellow-400">
              <CountdownTimer target={nextEvent} />
            </span>
          </div>

          {/* Question */}
          <div className="rounded-2xl p-3 mb-5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-zinc-400 mb-1">Question de cette semaine :</p>
            <p className="text-sm font-medium text-white">Quel actif financier va le plus progresser cette semaine ?</p>
          </div>

          {/* Bet */}
          {!hasParticipated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 shrink-0">Mise :</span>
                <input type="range" min={50} max={5000} step={50} value={betAmount}
                  onChange={e => setBetAmount(Number(e.target.value))}
                  className="flex-1 accent-yellow-400" />
                <span className="text-yellow-400 font-black w-20 text-right">{betAmount.toLocaleString()} G</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={participate}
                className="w-full py-3.5 font-black text-lg rounded-2xl transition-all"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}
              >
                PARTICIPER — {betAmount.toLocaleString()} GLYPHS
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 rounded-2xl"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <Star className="mx-auto text-emerald-400 mb-2" size={24} />
              <p className="text-emerald-400 font-bold">Participation enregistrée !</p>
              <p className="text-sm text-zinc-400 mt-1">Tu as misé {betAmount.toLocaleString()} GLYPHS</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Participants', value: participants, color: 'text-violet-400' },
          { icon: Coins, label: 'Cagnotte', value: `${potAmount.toLocaleString()}G`, color: 'text-yellow-400' },
          { icon: Zap, label: 'Ton rang', value: hasParticipated ? `#${participants}` : '-', color: 'text-cyan-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-surface-2 rounded-2xl p-4 border border-white/5 text-center">
            <Icon size={16} className={`${color} mx-auto mb-1.5`} />
            <div className={`text-lg font-black ${color}`}>{value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-surface-2 rounded-2xl p-4 border border-white/5">
        <h3 className="text-sm font-semibold text-white mb-3">Comment ça marche ?</h3>
        <div className="space-y-2 text-xs text-zinc-400">
          <p>🎯 Chaque vendredi à 21h, Prométhée lance un événement spécial</p>
          <p>💰 Tous les participants misent des GLYPHS dans la cagnotte</p>
          <p>🏆 La cagnotte est distribuée aux gagnants selon leurs réponses</p>
          <p>🔥 Plus tu mises, plus tu peux gagner</p>
          <p>📢 Annonce automatique 48h avant via notification</p>
        </div>
      </div>
    </div>
  )
}
