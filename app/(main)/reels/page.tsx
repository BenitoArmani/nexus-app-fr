'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, Upload } from 'lucide-react'
import ReelPlayer from '@/components/reels/ReelPlayer'
import Button from '@/components/ui/Button'
import { ReelUploadModal } from '@/components/reels/ReelUploadModal'
import { useReels } from '@/hooks/useReels'
import { useAuth } from '@/hooks/useAuth'

export default function ReelsPage() {
  const { reels, currentIndex, toggleLike, nextReel, prevReel } = useReels()
  const { user } = useAuth()
  const [uploadOpen, setUploadOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0) nextReel()
      else prevReel()
    }
    const el = containerRef.current
    el?.addEventListener('wheel', handleWheel, { passive: false })
    return () => el?.removeEventListener('wheel', handleWheel)
  }, [nextReel, prevReel])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') nextReel()
      if (e.key === 'ArrowUp') prevReel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [nextReel, prevReel])

  return (
    <div className="relative h-[calc(100vh-56px)] overflow-hidden bg-black" ref={containerRef}>
      {/* Reel stack */}
      <div className="relative h-full flex items-center justify-center">
        <div className="relative w-full max-w-sm h-full mx-auto">
          {reels.map((reel, i) => (
            <motion.div
              key={reel.id}
              className="absolute inset-0"
              animate={{
                y: `${(i - currentIndex) * 100}%`,
                opacity: Math.abs(i - currentIndex) <= 1 ? 1 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <ReelPlayer
                reel={reel}
                active={i === currentIndex}
                onLike={toggleLike}
              />
            </motion.div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          <button
            onClick={prevReel}
            disabled={currentIndex === 0}
            className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/60 transition-colors"
          >
            <ChevronUp size={20} />
          </button>
          <div className="flex flex-col gap-1 items-center">
            {reels.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${i === currentIndex ? 'w-1.5 h-4 bg-white' : 'w-1 h-1 bg-white/40'}`}
              />
            ))}
          </div>
          <button
            onClick={nextReel}
            disabled={currentIndex === reels.length - 1}
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
