'use client'
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import type { GifResult } from '@/types'

// Giphy public beta key (gratuit pour le dev)
const GIPHY_KEY = 'dc6zaTOxFJmzC'

interface GifPickerProps {
  onSelect: (gif: GifResult) => void
  onClose: () => void
}

export default function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [query, setQuery] = useState('')
  const [gifs, setGifs] = useState<GifResult[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      // Trending
      setLoading(true)
      try {
        const res = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=12&rating=g`)
        const data = await res.json()
        setGifs(data.data?.map((g: any) => ({
          id: g.id, title: g.title,
          url: g.images.fixed_height.url,
          preview_url: g.images.fixed_height_small.url,
          width: parseInt(g.images.fixed_height.width),
          height: parseInt(g.images.fixed_height.height),
        })) || [])
      } catch { setGifs([]) }
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=12&rating=g`)
      const data = await res.json()
      setGifs(data.data?.map((g: any) => ({
        id: g.id, title: g.title,
        url: g.images.fixed_height.url,
        preview_url: g.images.fixed_height_small.url,
        width: parseInt(g.images.fixed_height.width),
        height: parseInt(g.images.fixed_height.height),
      })) || [])
    } catch { setGifs([]) }
    setLoading(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full mb-2 left-0 w-80 bg-surface-2 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-sm font-bold text-text-primary">GIFs & Mèmes</span>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={16} /></button>
      </div>
      <div className="p-2">
        <div className="relative mb-2">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search(query)}
            placeholder="Rechercher un GIF..."
            className="w-full bg-surface-3 border border-white/5 rounded-xl pl-8 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            autoFocus
            onFocus={() => gifs.length === 0 && search('')}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-text-muted text-sm">Chargement...</div>
        ) : (
          <div className="grid grid-cols-3 gap-1 max-h-52 overflow-y-auto">
            {gifs.map(gif => (
              <button key={gif.id} onClick={() => onSelect(gif)} className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all">
                <img src={gif.preview_url || gif.url} alt={gif.title} className="w-full h-full object-cover" />
              </button>
            ))}
            {gifs.length === 0 && !loading && (
              <div className="col-span-3 text-center py-6 text-text-muted text-xs">Appuyez sur Entrée pour rechercher</div>
            )}
          </div>
        )}
        <p className="text-[10px] text-text-muted text-center mt-1">Powered by GIPHY</p>
      </div>
    </motion.div>
  )
}
