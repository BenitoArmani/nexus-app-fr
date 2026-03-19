'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Crown, TrendingUp, Clock, Target } from 'lucide-react'
import { useRewards } from '@/hooks/useRewards'
import { useAds, AD_QUOTA_OPTIONS, type AdQuota } from '@/hooks/useAds'
import ConfettiEffect from './ConfettiEffect'
import toast from 'react-hot-toast'

interface RewardedAdProps {
  onComplete?: (euros: number) => void
  compact?: boolean
}

/* Durée de la pub : variable aussi (15-30s) */
function randomAdDuration() {
  return 15 + Math.floor(Math.random() * 16) // 15–30 s
}

export default function RewardedAd({ onComplete, compact = false }: RewardedAdProps) {
  const { triggerReward } = useRewards()
  const {
    canWatch, dailyCount, quota, setQuota,
    inCooldown, cooldownLeft, onAdWatched,
    isFounderPeriod, weeklyEarnings, monthlyProjection, revenuePerAd,
  } = useAds()

  const [watching, setWatching]     = useState(false)
  const [countdown, setCountdown]   = useState(30)
  const [adDuration, setAdDuration] = useState(30)
  const [confetti, setConfetti]     = useState(false)
  const [showQuota, setShowQuota]   = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAd = () => {
    if (!canWatch) return
    const dur = randomAdDuration()
    setAdDuration(dur)
    setCountdown(dur)
    setWatching(true)
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          handleAdComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleAdComplete = () => {
    setWatching(false)
    onAdWatched()
    setConfetti(true)
    onComplete?.(revenuePerAd)
    triggerReward('ad_watched', false)
    toast.success(`+${revenuePerAd.toFixed(3)} € crédité${isFounderPeriod ? ' (offre Fondateur 50/50 🎉)' : ''}`, {
      style: { background: '#1a0a2e', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px' },
      duration: 3500,
    })
    setTimeout(() => setConfetti(false), 3000)
  }

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  /* ---- COMPACT mode (e.g. in glyphs page) ---- */
  if (compact) {
    return (
      <>
        <ConfettiEffect active={confetti} onDone={() => setConfetti(false)} />
        <button
          onClick={startAd}
          disabled={!canWatch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-violet-500/30 text-violet-300 hover:from-violet-500/30 hover:to-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={12} fill="currentColor" />
          {watching ? `${countdown}s` : inCooldown ? `${cooldownLeft}s` : `+${revenuePerAd.toFixed(3)} € Pub`}
        </button>
      </>
    )
  }

  /* ---- FULL mode ---- */
  return (
    <>
      <ConfettiEffect active={confetti} onDone={() => setConfetti(false)} />
      <div className="bg-surface-2 border border-violet-500/20 rounded-2xl p-4 space-y-3">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-bold text-text-primary">Publicité récompensée</p>
              {isFounderPeriod && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300">
                  <Crown size={9} /> Fondateur 50/50
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">
              {dailyCount}/{quota} aujourd'hui · {revenuePerAd.toFixed(3)} €/pub
            </p>
          </div>
          <button
            onClick={() => setShowQuota(v => !v)}
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            <Target size={13} /> Quota
          </button>
        </div>

        {/* Quota picker */}
        <AnimatePresence>
          {showQuota && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="pb-1">
                <p className="text-xs text-zinc-500 mb-2">Pubs/jour que tu veux regarder :</p>
                <div className="flex gap-2">
                  {AD_QUOTA_OPTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => { setQuota(q as AdQuota); setShowQuota(false) }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        quota === q
                          ? 'bg-violet-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      <div>{q}/j</div>
                      <div className="text-[9px] font-normal opacity-70">
                        ~{(q * 30 * 0.06 * (isFounderPeriod ? 0.5 : 0.4)).toFixed(0)} €/mois
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar daily */}
        <div>
          <div className="flex justify-between text-[10px] text-zinc-600 mb-1">
            <span>{dailyCount} regardées</span>
            <span>objectif {quota}</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (dailyCount / quota) * 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Ad player or CTA */}
        <AnimatePresence mode="wait">
          {watching ? (
            <motion.div key="watching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-surface-3 rounded-xl p-5 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-2 border-violet-500/40 flex items-center justify-center">
                  <span className="text-xl font-black text-violet-400">{countdown}</span>
                </div>
                <p className="text-xs text-text-muted text-center">Regarde jusqu'à la fin pour gagner {revenuePerAd.toFixed(3)} €</p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden mt-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: adDuration, ease: 'linear' }}
                />
              </div>
            </motion.div>
          ) : inCooldown ? (
            <motion.div key="cooldown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 py-3 text-sm text-zinc-500"
            >
              <Clock size={14} />
              Prochaine pub dans <span className="font-bold text-zinc-300">{cooldownLeft}s</span>
            </motion.div>
          ) : (
            <motion.button
              key="start"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={startAd}
              disabled={!canWatch}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play size={15} fill="white" />
              Regarder → +{revenuePerAd.toFixed(3)} €
            </motion.button>
          )}
        </AnimatePresence>

        {/* Earnings summary */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
          <div className="bg-zinc-800/50 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <TrendingUp size={10} className="text-emerald-400" />
              <p className="text-[10px] text-zinc-500">Cette semaine</p>
            </div>
            <p className="text-sm font-black text-emerald-400">{weeklyEarnings.toFixed(2)} €</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Target size={10} className="text-violet-400" />
              <p className="text-[10px] text-zinc-500">Projection mois</p>
            </div>
            <p className="text-sm font-black text-violet-400">{monthlyProjection.toFixed(2)} €</p>
          </div>
        </div>

        {isFounderPeriod && (
          <p className="text-[10px] text-amber-400/70 text-center">
            👑 Offre Fondateur : tu gardes 50% des revenus pub (vs 40% standard)
          </p>
        )}
      </div>
    </>
  )
}
