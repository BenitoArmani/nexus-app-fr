'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Sparkles, AlertTriangle, Info, Wrench } from 'lucide-react'

export type BannerType = 'announcement' | 'golden-nugget' | 'maintenance' | 'feature' | 'urgent'

interface Banner {
  id: string
  type: BannerType
  message: string
  cta?: { label: string; href: string }
  expiresAt?: number
}

// Mock banners — in production these would come from Supabase/API
const ACTIVE_BANNERS: Banner[] = [
  {
    id: 'golden-nugget-2026-03-21',
    type: 'golden-nugget',
    message: '🎰 Golden Nugget ce vendredi 21h — Prométhée a choisi son défi. La cagnotte dépasse déjà 12 000⬡ !',
    cta: { label: 'Voir le défi', href: '/golden-nugget' },
    expiresAt: new Date('2026-03-22T21:00:00').getTime(),
  },
]

const BANNER_STYLES: Record<BannerType, { bg: string; border: string; text: string; icon: typeof Trophy }> = {
  'golden-nugget': {
    bg: 'bg-gradient-to-r from-amber-900/60 to-yellow-900/40',
    border: 'border-amber-500/40',
    text: 'text-amber-200',
    icon: Trophy,
  },
  announcement: {
    bg: 'bg-gradient-to-r from-violet-900/60 to-purple-900/40',
    border: 'border-violet-500/40',
    text: 'text-violet-200',
    icon: Info,
  },
  feature: {
    bg: 'bg-gradient-to-r from-cyan-900/60 to-blue-900/40',
    border: 'border-cyan-500/40',
    text: 'text-cyan-200',
    icon: Sparkles,
  },
  maintenance: {
    bg: 'bg-gradient-to-r from-orange-900/60 to-amber-900/40',
    border: 'border-orange-500/40',
    text: 'text-orange-200',
    icon: Wrench,
  },
  urgent: {
    bg: 'bg-gradient-to-r from-rose-900/60 to-red-900/40',
    border: 'border-rose-500/40',
    text: 'text-rose-200',
    icon: AlertTriangle,
  },
}

function getBannerKey(id: string) {
  return `nexus_banner_dismissed_${id}`
}

function isDismissed(id: string): boolean {
  if (typeof window === 'undefined') return false
  const ts = localStorage.getItem(getBannerKey(id))
  if (!ts) return false
  // Remember dismissal for 24h
  return Date.now() - parseInt(ts) < 24 * 60 * 60 * 1000
}

function dismiss(id: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getBannerKey(id), String(Date.now()))
}

export default function NexusBanner() {
  const [visibleBanners, setVisibleBanners] = useState<Banner[]>([])

  useEffect(() => {
    const now = Date.now()
    const visible = ACTIVE_BANNERS.filter(b => {
      if (b.expiresAt && now > b.expiresAt) return false
      return !isDismissed(b.id)
    })
    setVisibleBanners(visible)
  }, [])

  const closeBanner = (id: string) => {
    dismiss(id)
    setVisibleBanners(prev => prev.filter(b => b.id !== id))
  }

  if (visibleBanners.length === 0) return null
  const banner = visibleBanners[0] // Show one banner at a time
  const style = BANNER_STYLES[banner.type]
  const Icon = style.icon

  return (
    <AnimatePresence>
      <motion.div
        key={banner.id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`${style.bg} border-b ${style.border} overflow-hidden z-50 relative`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icon size={14} className={`${style.text} flex-shrink-0`} />
            <p className={`text-xs font-medium ${style.text} truncate`}>
              {banner.message}
            </p>
            {banner.cta && (
              <a
                href={banner.cta.href}
                className={`flex-shrink-0 text-xs font-bold underline underline-offset-2 ${style.text} hover:opacity-80 transition-opacity ml-2`}
              >
                {banner.cta.label} →
              </a>
            )}
          </div>
          <button
            onClick={() => closeBanner(banner.id)}
            className={`flex-shrink-0 ml-3 ${style.text} hover:opacity-60 transition-opacity`}
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
