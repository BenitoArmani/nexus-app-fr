'use client'
import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Confetti {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

interface ConfettiEffectProps {
  active: boolean
  onDone?: () => void
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#a78bfa']

export default function ConfettiEffect({ active, onDone }: ConfettiEffectProps) {
  const pieces = useRef<Confetti[]>([])

  if (active && pieces.current.length === 0) {
    pieces.current = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.8,
    }))
  }

  if (!active) pieces.current = []

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          {pieces.current.map(piece => (
            <motion.div
              key={piece.id}
              initial={{ x: `${piece.x}vw`, y: '-5vh', rotate: piece.rotation, scale: piece.scale, opacity: 1 }}
              animate={{ y: '110vh', rotate: piece.rotation + 360 * 3, opacity: [1, 1, 0] }}
              transition={{ duration: 2 + Math.random() * 1, ease: 'easeIn', delay: Math.random() * 0.5 }}
              onAnimationComplete={piece.id === 0 ? onDone : undefined}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: piece.color, left: 0, top: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
