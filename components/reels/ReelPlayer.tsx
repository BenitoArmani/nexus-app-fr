'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, DollarSign, Volume2, VolumeX, Play, Pause } from 'lucide-react'
import Image from 'next/image'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { formatNumber, formatEuro } from '@/lib/utils'
import type { Reel } from '@/types'

interface ReelPlayerProps {
  reel: Reel
  active: boolean
  onLike: (id: string) => void
}

export default function ReelPlayer({ reel, active, onLike }: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [showHeart, setShowHeart] = useState(false)

  useEffect(() => {
    if (active && videoRef.current) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {})
    } else if (!active && videoRef.current) {
      videoRef.current.pause()
      setPlaying(false)
    }
  }, [active])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else { videoRef.current.play(); setPlaying(true) }
  }

  const handleDoubleTap = () => {
    if (!reel.liked_by_me) onLike(reel.id)
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 1000)
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center" onDoubleClick={handleDoubleTap}>
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video_url}
        className="w-full h-full object-cover"
        loop
        muted={muted}
        playsInline
        poster={reel.thumbnail_url || undefined}
        onClick={togglePlay}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      {/* Double tap heart */}
      <AnimatePresence>
        {showHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart size={80} className="text-rose-500" fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause overlay */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right sidebar actions */}
      <div className="absolute right-3 bottom-24 flex flex-col gap-5 items-center">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onLike(reel.id)}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center ${reel.liked_by_me ? 'text-rose-400' : 'text-white'}`}>
            <Heart size={22} fill={reel.liked_by_me ? 'currentColor' : 'none'} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow">{formatNumber(reel.likes)}</span>
        </motion.button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
            <MessageCircle size={22} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow">Comm.</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
            <Share2 size={22} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow">Partager</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-emerald-400">
            <DollarSign size={22} />
          </div>
          <span className="text-emerald-400 text-xs font-bold drop-shadow">Tip</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-16">
        <div className="flex items-center gap-2 mb-2">
          <Avatar src={reel.user?.avatar_url} name={reel.user?.full_name || ''} size="sm" />
          <span className="text-white font-semibold text-sm drop-shadow">{reel.user?.username}</span>
          {reel.user?.is_verified && <Badge variant="verified">Pro</Badge>}
        </div>
        <p className="text-white text-sm leading-snug drop-shadow line-clamp-2 mb-2">{reel.caption}</p>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs">{formatNumber(reel.views)} vues</span>
          <span className="text-emerald-400 text-xs font-semibold">{formatEuro(reel.earnings)} générés</span>
        </div>
      </div>

      {/* Sound + Controls */}
      <div className="absolute top-4 right-3 flex flex-col gap-2">
        <button
          onClick={() => setMuted(!muted)}
          className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  )
}
