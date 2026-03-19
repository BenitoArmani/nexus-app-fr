'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Lock } from 'lucide-react'
import { useBubbles, DEFAULT_BUBBLES } from '@/hooks/useBubbles'

export default function BubbleBar() {
  const { activeBubbleId, activeBubble, switchBubble, isUnlocked } = useBubbles()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showLockedToast, setShowLockedToast] = useState<string | null>(null)

  const handleClick = (id: string) => {
    if (!isUnlocked(id)) {
      setShowLockedToast(id)
      setTimeout(() => setShowLockedToast(null), 2000)
      return
    }
    switchBubble(id)
  }

  return (
    <>
      {/* PC: Vertical bar on right edge */}
      <div className="fixed right-0 top-0 bottom-0 hidden md:flex flex-col items-center pt-16 pb-4 gap-1.5 w-[58px] bg-bg-primary/80 backdrop-blur-xl border-l border-white/5 z-30 overflow-y-auto">
        {DEFAULT_BUBBLES.map(bubble => {
          const active = activeBubbleId === bubble.id
          const unlocked = isUnlocked(bubble.id)

          return (
            <div
              key={bubble.id}
              className="relative"
              onMouseEnter={() => setHoveredId(bubble.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bubble-indicator-pc"
                  className="absolute -right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full"
                  style={{ background: activeBubble.accentColor }}
                />
              )}

              <motion.button
                onClick={() => handleClick(bubble.id)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                animate={active ? {
                  boxShadow: [`0 0 0px ${bubble.accentColor}00`, `0 0 12px ${bubble.accentColor}40`, `0 0 0px ${bubble.accentColor}00`]
                } : {}}
                transition={active ? { duration: 2, repeat: Infinity } : {}}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all relative ${
                  active
                    ? `${bubble.bgColor} border-2 ${bubble.borderColor}`
                    : unlocked
                    ? 'bg-surface-2 border border-white/5 hover:border-white/20 hover:bg-white/5'
                    : 'bg-surface-2 border border-white/5 opacity-40 cursor-not-allowed'
                }`}
              >
                <span className={`transition-all ${!unlocked ? 'grayscale' : ''}`}>{bubble.emoji}</span>
                {!unlocked && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-surface-3 rounded-full flex items-center justify-center border border-white/10">
                    <Lock size={8} className="text-zinc-500" />
                  </div>
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredId === bubble.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-surface-2 border border-white/10 rounded-xl px-3 py-2 pointer-events-none z-50 shadow-xl min-w-[140px]"
                  >
                    <p className="text-xs font-bold text-white whitespace-nowrap">{bubble.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{bubble.description}</p>
                    {!unlocked && (
                      <p className="text-[10px] text-amber-400 mt-1 font-semibold">{bubble.cost}⬡/mois</p>
                    )}
                    {/* Arrow */}
                    <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-surface-2 border-r border-t border-white/10 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Locked toast */}
              <AnimatePresence>
                {showLockedToast === bubble.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-amber-500/20 border border-amber-500/40 rounded-xl px-3 py-2 pointer-events-none z-50 whitespace-nowrap"
                  >
                    <p className="text-xs font-bold text-amber-400">🔒 {bubble.cost}⬡/mois</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Divider */}
        <div className="w-8 h-px bg-white/5 my-1" />

        {/* Add bubble */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-zinc-600 hover:text-violet-400 hover:border-violet-500/30 transition-colors"
          title="Créer une bulle personnalisée"
        >
          <Plus size={16} />
        </motion.button>
      </div>

      {/* Mobile: horizontal bar above bottom nav */}
      <div className="fixed bottom-[64px] left-0 right-0 md:hidden z-30 bg-bg-primary/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {DEFAULT_BUBBLES.map(bubble => {
            const active = activeBubbleId === bubble.id
            const unlocked = isUnlocked(bubble.id)

            return (
              <motion.button
                key={bubble.id}
                onClick={() => handleClick(bubble.id)}
                whileTap={{ scale: 0.85 }}
                className="flex-shrink-0 flex flex-col items-center gap-1 transition-all"
              >
                <motion.div
                  animate={active ? { scale: [1, 1.08, 1] } : {}}
                  transition={active ? { duration: 2, repeat: Infinity } : {}}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl relative transition-all ${
                    active
                      ? `${bubble.bgColor} border-2 ${bubble.borderColor}`
                      : 'bg-surface-2 border border-white/5'
                  } ${!unlocked ? 'opacity-40' : ''}`}
                >
                  {bubble.emoji}
                  {!unlocked && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-surface-3 rounded-full flex items-center justify-center border border-white/10">
                      <Lock size={8} className="text-zinc-500" />
                    </div>
                  )}
                </motion.div>
                <span className={`text-[9px] font-semibold whitespace-nowrap transition-colors ${active ? bubble.color : 'text-zinc-600'}`}>
                  {bubble.label}
                </span>
              </motion.button>
            )
          })}

          {/* Add bubble */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-zinc-600">
              <Plus size={16} />
            </div>
            <span className="text-[9px] font-semibold text-zinc-600">Créer</span>
          </div>
        </div>
      </div>
    </>
  )
}
