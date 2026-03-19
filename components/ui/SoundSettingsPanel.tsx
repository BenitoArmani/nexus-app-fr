'use client'
import { useState, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { soundSystem } from '@/lib/sounds'

export function SoundSettingsPanel() {
  const [enabled, setEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const settings = soundSystem?.getSettings()
    if (settings) { setEnabled(settings.enabled); setVolume(Math.round(settings.volume * 100)) }
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">Sons et effets</p>
          <p className="text-xs text-zinc-500">Retours audio pour les interactions</p>
        </div>
        <button
          onClick={() => {
            const n = !enabled; setEnabled(n)
            soundSystem?.updateSettings({ enabled: n })
            if (n) soundSystem?.play('notification')
          }}
          className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-violet-600' : 'bg-zinc-700'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {enabled && (
        <div className="flex items-center gap-3">
          <VolumeX size={14} className="text-zinc-500 shrink-0" />
          <input type="range" min={0} max={100} value={volume}
            onChange={e => { const v = Number(e.target.value); setVolume(v); soundSystem?.updateSettings({ volume: v / 100 }) }}
            className="flex-1 accent-violet-500" />
          <Volume2 size={14} className="text-zinc-400 shrink-0" />
          <span className="text-xs text-zinc-400 w-8 text-right">{volume}%</span>
        </div>
      )}
    </div>
  )
}
