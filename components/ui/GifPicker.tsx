'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Bookmark, Plus } from 'lucide-react'
import Image from 'next/image'
import type { GifResult, UserGif } from '@/types'

interface GifPickerProps {
  onSelect: (gif: GifResult) => void
  onClose: () => void
  userId?: string
}

const CATEGORIES = ['Mes GIFs', 'Réactions', 'Sport', 'Humour', 'Amour', 'Fête']

export default function GifPicker({ onSelect, onClose, userId }: GifPickerProps) {
  const [tab, setTab] = useState<'tenor' | 'mine'>('tenor')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GifResult[]>([])
  const [myGifs, setMyGifs] = useState<UserGif[]>([])
  const [myCategory, setMyCategory] = useState('Mes GIFs')
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchTenor = useCallback(async (q: string) => {
    setLoadingSearch(true)
    try {
      const res = await fetch(`/api/gifs/tenor?q=${encodeURIComponent(q || 'trending')}&limit=24`)
      const json = await res.json()
      setResults(json.results ?? [])
    } finally {
      setLoadingSearch(false)
    }
  }, [])

  // Load trending on mount
  useEffect(() => {
    searchTenor('')
  }, [searchTenor])

  // Load my GIFs
  useEffect(() => {
    if (tab === 'mine' && userId) {
      fetch(`/api/gifs/save?user_id=${userId}`)
        .then(r => r.json())
        .then((data: UserGif[]) => setMyGifs(data))
        .catch(() => {})
    }
  }, [tab, userId])

  const handleQueryChange = (val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchTenor(val), 400)
  }

  const handleSaveGif = async (gif: GifResult, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userId) return
    setSavedIds(prev => new Set([...prev, gif.id]))
    await fetch('/api/gifs/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, url: gif.url, preview_url: gif.preview_url, title: gif.title, source: 'tenor', tenor_id: gif.id }),
    })
  }

  const filteredMyGifs = myCategory === 'Mes GIFs' ? myGifs : myGifs.filter(g => g.category === myCategory)
  const myCategories = ['Mes GIFs', ...Array.from(new Set(myGifs.map(g => g.category).filter(c => c !== 'Mes GIFs')))]

  void CATEGORIES

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
      style={{ maxHeight: 320 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex gap-1">
          <button
            onClick={() => setTab('tenor')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${tab === 'tenor' ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            GIFs
          </button>
          <button
            onClick={() => setTab('mine')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors flex items-center gap-1 ${tab === 'mine' ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Bookmark size={10} /> Mes GIFs
          </button>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-300">
          <X size={14} />
        </button>
      </div>

      {tab === 'tenor' && (
        <>
          {/* Search */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <Search size={12} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                placeholder="Rechercher un GIF..."
                className="flex-1 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                style={{ fontSize: 16 }}
                autoComplete="off"
              />
            </div>
          </div>
          {/* Grid */}
          <div className="overflow-y-auto px-3 pb-3" style={{ maxHeight: 220 }}>
            {loadingSearch ? (
              <div className="flex items-center justify-center h-20 text-zinc-600 text-xs">Chargement...</div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 gap-2">
                <p className="text-zinc-600 text-xs">Aucun résultat</p>
                <p className="text-zinc-700 text-[10px]">Ajoute GIPHY_API_KEY dans les variables d&apos;env</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {results.map(gif => (
                  <div key={gif.id} className="relative group cursor-pointer rounded-lg overflow-hidden bg-white/5" style={{ aspectRatio: '1' }} onClick={() => onSelect(gif)}>
                    <Image src={gif.preview_url || gif.url} alt={gif.title} fill className="object-cover" unoptimized />
                    {userId && (
                      <button
                        onClick={e => handleSaveGif(gif, e)}
                        className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center shadow transition-all ${savedIds.has(gif.id) ? 'bg-violet-500 text-white opacity-100' : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'}`}
                      >
                        {savedIds.has(gif.id) ? <Bookmark size={9} fill="currentColor" /> : <Plus size={9} />}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'mine' && (
        <>
          {/* Category tabs */}
          <div className="flex gap-1 px-3 pb-2 overflow-x-auto scrollbar-hide">
            {myCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setMyCategory(cat)}
                className={`shrink-0 px-2.5 py-1 text-[10px] font-semibold rounded-full transition-colors ${myCategory === cat ? 'bg-violet-500/20 text-violet-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Grid */}
          <div className="overflow-y-auto px-3 pb-3" style={{ maxHeight: 220 }}>
            {filteredMyGifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 gap-1">
                <p className="text-zinc-600 text-xs">Aucun GIF enregistré</p>
                <p className="text-zinc-700 text-[10px]">Sauvegarde des GIFs depuis l&apos;onglet GIFs</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {filteredMyGifs.map(gif => (
                  <div
                    key={gif.id}
                    className="relative cursor-pointer rounded-lg overflow-hidden bg-white/5"
                    style={{ aspectRatio: '1' }}
                    onClick={() => onSelect({ id: gif.id, title: gif.title ?? '', url: gif.url, preview_url: gif.preview_url ?? gif.url, width: 200, height: 200 })}
                  >
                    <Image src={gif.preview_url ?? gif.url} alt={gif.title ?? 'gif'} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  )
}
