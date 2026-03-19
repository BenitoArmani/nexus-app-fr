'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GainEvent {
  id: string
  amount: number
  label: string
  x: number
  y: number
}

// Global event bus for GLYPH gain notifications
let gainListeners: ((event: GainEvent) => void)[] = []

export function triggerGlyphGain(amount: number, label: string, x?: number, y?: number) {
  const event: GainEvent = {
    id: `gain-${Date.now()}-${Math.random()}`,
    amount,
    label,
    x: x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 200),
    y: y ?? 200,
  }
  gainListeners.forEach(fn => fn(event))
}

export default function GlyphGainToast() {
  const [events, setEvents] = useState<GainEvent[]>([])

  const addEvent = useCallback((event: GainEvent) => {
    setEvents(prev => [...prev.slice(-8), event])
    setTimeout(() => {
      setEvents(prev => prev.filter(e => e.id !== event.id))
    }, 2000)
  }, [])

  useEffect(() => {
    gainListeners.push(addEvent)
    return () => {
      gainListeners = gainListeners.filter(fn => fn !== addEvent)
    }
  }, [addEvent])

  return (
    <div className="fixed inset-0 pointer-events-none z-[999]" aria-hidden>
      <AnimatePresence>
        {events.map(event => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: Math.min(Math.max(event.x - 40, 10), (typeof window !== 'undefined' ? window.innerWidth : 400) - 100),
              top: event.y,
            }}
            className="flex items-center gap-1.5 bg-violet-600/90 backdrop-blur-sm border border-violet-400/40 rounded-full px-3 py-1.5 shadow-lg shadow-violet-500/30"
          >
            <span className="text-violet-200 text-xs font-black">+{event.amount}⬡</span>
            <span className="text-violet-300 text-[10px]">{event.label}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
