'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Star } from 'lucide-react'
import { useStreak } from '@/hooks/useStreak'

interface Props {
  userId: string | null
  compact?: boolean
}

export function StreakWidget({ userId, compact = false }: Props) {
  const { streak, isCheckedInToday, checkIn, justCheckedIn } = useStreak(userId)
  const currentStreak = streak?.current_streak ?? 0

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => checkIn()}>
        <motion.div animate={{ scale: justCheckedIn ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.4 }}>
          <Flame className={currentStreak > 0 ? 'text-orange-400' : 'text-zinc-600'} size={16} />
        </motion.div>
        <span className={`text-sm font-bold ${currentStreak > 0 ? 'text-orange-400' : 'text-zinc-500'}`}>
          {currentStreak}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-surface-2 rounded-2xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Streak quotidien</h3>
        {(streak?.longest_streak ?? 0) > 0 && (
          <span className="text-xs text-zinc-500">Record: {streak?.longest_streak}j</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: justCheckedIn ? [1, 1.2, 1] : 1, rotate: justCheckedIn ? [0, -10, 10, 0] : 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Flame
            size={48}
            className={currentStreak > 0 ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' : 'text-zinc-700'}
          />
          {currentStreak >= 7 && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}
            >
              <Star size={10} className="text-yellow-900" />
            </motion.div>
          )}
        </motion.div>
        <div>
          <div className="text-3xl font-black text-white">
            {currentStreak}<span className="text-lg font-normal text-zinc-400 ml-1">jours</span>
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            {isCheckedInToday ? '✓ Check-in du jour effectué' : 'Check-in disponible !'}
          </div>
        </div>
      </div>
      {currentStreak > 0 && currentStreak < 7 && (
        <div className="mt-2 text-xs text-zinc-500">
          <span className="text-violet-400">{7 - currentStreak}j</span> avant le bonus 50 GLYPHS
        </div>
      )}
      {!isCheckedInToday && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => checkIn()}
          className="mt-3 w-full py-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Check-in du jour (+5 GLYPHS)
        </motion.button>
      )}
      <AnimatePresence>
        {justCheckedIn && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-2 text-center text-sm font-bold text-orange-400"
          >
            🔥 Streak maintenu !
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
