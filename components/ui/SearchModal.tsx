'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, User, FileText, Play } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { MOCK_USERS, MOCK_POSTS, MOCK_REELS } from '@/lib/mock-data'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const TRENDING = ['#CreateursFR', '#NexusTech', '#MusiqueFR', '#Gaming2025', '#Bitcoin']

type ResultType = 'user' | 'post' | 'reel'
interface SearchResult {
  id: string
  type: ResultType
  title: string
  subtitle: string
  avatar?: string | null
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [history, setHistory] = useState<string[]>(['valorant', 'bitcoin', 'sophia_create'])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    const userResults: SearchResult[] = MOCK_USERS
      .filter(u => u.username.includes(q) || u.full_name.toLowerCase().includes(q))
      .map(u => ({ id: u.id, type: 'user', title: u.full_name, subtitle: `@${u.username}`, avatar: u.avatar_url }))
    const postResults: SearchResult[] = MOCK_POSTS
      .filter(p => p.content.toLowerCase().includes(q))
      .slice(0, 2)
      .map(p => ({ id: p.id, type: 'post', title: p.content.slice(0, 60) + '...', subtitle: `Post · @${p.user?.username}` }))
    const reelResults: SearchResult[] = MOCK_REELS
      .filter(r => r.caption.toLowerCase().includes(q))
      .slice(0, 2)
      .map(r => ({ id: r.id, type: 'reel', title: r.caption, subtitle: `Reel · @${r.user?.username}`, avatar: r.thumbnail_url }))
    setResults([...userResults, ...postResults, ...reelResults].slice(0, 8))
  }, [query])

  const addToHistory = (term: string) => {
    setHistory(prev => [term, ...prev.filter(h => h !== term)].slice(0, 5))
  }

  const RESULT_ICONS = { user: User, post: FileText, reel: Play }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-lg bg-surface-2 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <Search size={18} className="text-text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') onClose(); if (e.key === 'Enter' && query) addToHistory(query) }}
                placeholder="Rechercher créateurs, posts, reels..."
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-text-muted hover:text-text-primary">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {!query ? (
                <div className="p-4 space-y-4">
                  {/* History */}
                  {history.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Clock size={10} /> Récents
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {history.map(h => (
                          <button key={h} onClick={() => setQuery(h)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-violet-500/10 text-text-muted hover:text-violet-400 rounded-xl text-xs transition-colors">
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Trending */}
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                      <TrendingUp size={10} /> Tendances
                    </p>
                    <div className="space-y-1">
                      {TRENDING.map((tag, i) => (
                        <button key={tag} onClick={() => setQuery(tag)}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-xl text-left transition-colors group">
                          <span className="text-sm text-violet-400 font-medium">{tag}</span>
                          <span className="text-xs text-text-muted">{(5 - i) * 12}k posts</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((r, i) => {
                    const Icon = RESULT_ICONS[r.type]
                    return (
                      <motion.button
                        key={r.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => { addToHistory(query); onClose() }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-left transition-colors"
                      >
                        {r.type === 'user' ? (
                          <Avatar src={r.avatar} name={r.title} size="sm" />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-surface-3 flex items-center justify-center flex-shrink-0">
                            <Icon size={14} className="text-text-muted" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary truncate">{r.title}</p>
                          <p className="text-xs text-text-muted truncate">{r.subtitle}</p>
                        </div>
                        <span className="text-[10px] text-text-muted capitalize">{r.type}</span>
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-text-muted text-sm">
                  Aucun résultat pour &quot;{query}&quot;
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
