'use client'
import { useEffect, useRef, useState } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  label?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

/**
 * Renders a real Google AdSense unit when NEXT_PUBLIC_ADSENSE_ID is set.
 * Falls back to a styled placeholder (for dev / before AdSense approval).
 */
export default function AdUnit({ slot, format = 'auto', className = '', label = 'Publicité' }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null)
  const pushed  = useRef(false)
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID   // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!publisherId || pushed.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
      setLoaded(true)
    } catch {
      // AdSense not ready yet — placeholder stays visible
    }
  }, [publisherId])

  /* ---- Placeholder (no AdSense ID or pending approval) ---- */
  if (!publisherId) {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-bold">{label}</p>
          <div className="w-2/3 h-2 bg-zinc-800 rounded-full" />
          <div className="w-1/2 h-2 bg-zinc-800 rounded-full mt-1" />
        </div>
        {/* invisible sizing div */}
        <div className="h-24" />
      </div>
    )
  }

  /* ---- Real AdSense unit ---- */
  return (
    <div className={`relative ${className}`}>
      <p className="text-[10px] text-zinc-700 uppercase tracking-widest mb-1 text-center">{label}</p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
