'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Upload } from 'lucide-react'
import ReelPlayer from '@/components/reels/ReelPlayer'
import Button from '@/components/ui/Button'
import { ReelUploadModal } from '@/components/reels/ReelUploadModal'
import { useReels } from '@/hooks/useReels'
import { useAuth } from '@/hooks/useAuth'
import AdUnit from '@/components/ui/AdUnit'

const AD_EVERY = 3

export default function ReelsPage() {
  const { reels, toggleLike } = useReels()
  const { user } = useAuth()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [slotIndex, setSlotIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intercale une pub toutes les AD_EVERY reels : [reel, reel, reel, AD, reel, reel, reel, AD, ...]
  const slots: Array<{ type: 'reel'; index: number } | { type: 'ad'; adIndex: number }> = []
  reels.forEach((_, i) => {
    slots.push({ type: 'reel', index: i })
    if ((i + 1) % AD_EVERY === 0) slots.push({ type: 'ad', adIndex: Math.floor(i / AD_EVERY) })
  })

  const next = useCallback(() => setSlotIndex(i => Math.min(i + 1, slots.length - 1)), [slots.length])
  const prev = useCallback(() => setSlotIndex(i => Math.max(i - 1, 0)), [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0) next()
      else prev()
    }
    const el = containerRef.current
    el?.addEventListener('wheel', handleWheel, { passive: false })
    return () => el?.removeEventListener('wheel', handleWheel)
  }, [next, prev])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') next()
      if (e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  // Index du reel courant (pour les indicateurs de navigation)
  const currentSlot = slots[slotIndex]
  const currentReelIndex = currentSlot?.type === 'reel' ? currentSlot.index : -1

  return (
    <div className="relative h-[calc(100vh-56px)] overflow-hidden bg-black" ref={containerRef}>
      {/* Reel stack */}
      <div className="relative h-full flex items-center justify-center">
        <div className="relative w-full max-w-sm h-full mx-auto">
          {slots.map((slot, i) => (
            slot.type === 'reel' ? (
              <motion.div
                key={reels[slot.index].id}
                className="absolute inset-0"
                animate={{
                  y: `${(i - slotIndex) * 100}%`,
                  opacity: Math.abs(i - slotIndex) <= 1 ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <ReelPlayer
                  reel={reels[slot.index]}
                  active={i === slotIndex}
                  onLike={toggleLike}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`ad-${slot.adIndex}`}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black"
                animate={{
                  y: `${(i - slotIndex) * 100}%`,
                  opacity: Math.abs(i - slotIndex) <= 1 ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">Sponsorisé</p>
                <AdUnit
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_REELS ?? 'reels-slot'}
                  format="rectangle"
                  className="w-72"
                />
              </motion.div>
            )
          ))}
        </div>

        {/* Navigation buttons — desktop uniquement */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-3 z-10 hidden md:flex">
          <button
            onClick={prev}
            disabled={slotIndex === 0}
            className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/60 transition-colors"
          >
            <ChevronUp size={20} />
          </button>
          <div className="flex flex-col gap-1 items-center">
            {reels.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${i === currentReelIndex ? 'w-1.5 h-4 bg-white' : 'w-1 h-1 bg-white/40'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={slotIndex === slots.length - 1}
            className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/60 transition-colors"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Upload button */}
        <div className="absolute top-4 right-4 z-10">
          <Button size="sm" variant="secondary" className="bg-black/40 backdrop-blur-sm border-white/20 text-white" onClick={() => setUploadOpen(true)}>
            <Upload size={14} /> Publier un reel
          </Button>
        </div>
      </div>

      <ReelUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        userId={user?.id}
      />
    </div>
  )
}
