'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, Smile, Send, X, ShieldAlert, Calendar } from 'lucide-react'
import dynamic from 'next/dynamic'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import ScheduleModal from '@/components/feed/ScheduleModal'
import { useAuth } from '@/hooks/useAuth'
import { useScheduledPosts } from '@/hooks/useScheduledPosts'
import type { GifResult } from '@/types'
import toast from 'react-hot-toast'

const GifPicker = dynamic(() => import('@/components/ui/GifPicker'), { ssr: false })

interface PostComposerProps {
  onPost: (content: string) => void
}

export default function PostComposer({ onPost }: PostComposerProps) {
  const { user } = useAuth()
  const { schedulePost } = useScheduledPosts()
  const [content, setContent] = useState('')
  const [focused, setFocused] = useState(false)
  const [showGifs, setShowGifs] = useState(false)
  const [selectedGif, setSelectedGif] = useState<string | null>(null)
  const [isExplicit, setIsExplicit] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const handleSubmit = () => {
    if (!content.trim() && !selectedGif) return
    onPost(content)
    setContent('')
    setFocused(false)
    setSelectedGif(null)
    setShowGifs(false)
  }

  const handleSchedule = (scheduledAt: string) => {
    if (!content.trim()) return
    schedulePost(content, scheduledAt)
    setContent('')
    setFocused(false)
    toast.success('Post programmé avec succès !')
  }

  const handleGifSelect = (gif: GifResult) => {
    setSelectedGif(gif.url)
    setShowGifs(false)
  }

  return (
    <motion.div
      layout
      className="bg-surface-2 border border-white/5 rounded-2xl p-4"
    >
      <div className="flex gap-3">
        <Avatar src={user?.avatar_url} name={user?.full_name || 'User'} size="md" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Quoi de neuf ? Partagez quelque chose..."
            rows={focused ? 3 : 1}
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none transition-all"
          />

          {/* GIF preview */}
          {selectedGif && (
            <div className="relative inline-block mt-2 mb-2">
              <img src={selectedGif} alt="GIF sélectionné" className="max-h-32 rounded-xl border border-white/10" />
              <button
                onClick={() => setSelectedGif(null)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-surface-3 border border-white/10 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={10} />
              </button>
            </div>
          )}

          <motion.div
            initial={false}
            animate={{ height: focused || content ? 'auto' : 0, opacity: focused || content ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex gap-2 relative">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                  <Image size={14} /> Photo
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-violet-400 hover:bg-violet-500/10 transition-colors">
                  <Video size={14} /> Vidéo
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                  <Smile size={14} /> Humeur
                </button>
                <button
                  onClick={() => setIsExplicit(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors ${isExplicit ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-text-muted hover:text-rose-400 hover:bg-rose-500/10'}`}
                  title="Marquer comme contenu adulte"
                >
                  <ShieldAlert size={14} /> {isExplicit ? '🔞 Adulte' : '+18'}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowGifs(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors ${showGifs ? 'text-violet-400 bg-violet-500/10' : 'text-text-muted hover:text-violet-400 hover:bg-violet-500/10'}`}
                  >
                    GIF
                  </button>
                  <AnimatePresence>
                    {showGifs && (
                      <GifPicker onSelect={handleGifSelect} onClose={() => setShowGifs(false)} />
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {content.length > 0 && (
                  <span className={`text-[11px] font-mono tabular-nums ${content.length > 460 ? 'text-rose-400' : content.length > 400 ? 'text-amber-400' : 'text-zinc-600'}`}>
                    {500 - content.length}
                  </span>
                )}
                <Button size="sm" variant="outline" onClick={() => setShowSchedule(true)} disabled={!content.trim()}
                  className="!px-2" title="Programmer">
                  <Calendar size={13} />
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={(!content.trim() && !selectedGif) || content.length > 500}>
                  <Send size={13} /> Publier
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <ScheduleModal
        open={showSchedule}
        content={content}
        onClose={() => setShowSchedule(false)}
        onSchedule={handleSchedule}
      />
    </motion.div>
  )
}
