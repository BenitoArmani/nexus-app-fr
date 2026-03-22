'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import Image from 'next/image'
import Avatar from '@/components/ui/Avatar'
import StoryCreateModal from './StoryCreateModal'
import { formatNumber } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import type { Story } from '@/types'

const STORY_DURATION = 5000

export default function Stories() {
  const { user } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [showCreate, setShowCreate] = useState(false)
  const [reported, setReported] = useState<string | null>(null)

  async function handleReport(storyId: string) {
    if (reported === storyId) return
    setReported(storyId)
    try {
      await fetch('/api/stories/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id: storyId }),
      })
    } catch { /* silencieux */ }
    setTimeout(() => setActiveIndex(null), 800)
  }

  async function fetchStories() {
    try {
      const res = await fetch('/api/stories')
      if (!res.ok) return
      const data: Story[] = await res.json()
      setStories(data)
    } catch { /* silencieux */ }
  }

  useEffect(() => { fetchStories() }, [])

  const activeStory = activeIndex !== null ? stories[activeIndex] : null

  const goNext = useCallback(() => {
    if (activeIndex === null) return
    if (activeIndex < stories.length - 1) {
      setActiveIndex(activeIndex + 1)
      setProgress(0)
    } else {
      setActiveIndex(null)
    }
  }, [activeIndex, stories.length])

  const goPrev = useCallback(() => {
    if (activeIndex === null || activeIndex === 0) return
    setActiveIndex(activeIndex - 1)
    setProgress(0)
  }, [activeIndex])

  function openStory(i: number) {
    setActiveIndex(i)
    setProgress(0)
    // Incrémenter les vues
    fetch(`/api/stories/${stories[i].id}/view`, { method: 'PATCH' }).catch(() => {})
  }

  useEffect(() => {
    if (activeIndex === null) return
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); goNext(); return 100 }
        return p + (100 / (STORY_DURATION / 100))
      })
    }, 100)
    return () => clearInterval(interval)
  }, [activeIndex, goNext])

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {/* Add story */}
        <motion.div
          whileTap={{ scale: 0.92 }}
          className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group"
          onClick={() => setShowCreate(true)}
        >
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10">
              <Avatar src={user?.avatar_url ?? null} name={user?.full_name ?? 'Moi'} size="lg" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center border-2 border-bg-primary">
              <Plus size={10} className="text-white" />
            </div>
          </div>
          <span className="text-[11px] text-text-muted font-medium">Ma story</span>
        </motion.div>

        {/* Stories */}
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            whileTap={{ scale: 0.92 }}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
            onClick={() => openStory(i)}
          >
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-bg-primary">
                <Avatar src={story.user?.avatar_url} name={story.user?.full_name || ''} size="lg" className="w-full h-full" />
              </div>
            </div>
            <span className="text-[11px] text-text-muted font-medium max-w-[64px] truncate text-center">
              {story.user?.username?.split('_')[0] ?? 'Story'}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {activeStory && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="relative w-full h-full sm:max-w-[400px] sm:h-[85vh] sm:rounded-2xl overflow-hidden"
            >
              {activeStory.media_type === 'video' ? (
                <video
                  src={activeStory.media_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay muted loop playsInline
                />
              ) : (
                <Image src={activeStory.media_url} alt="Story" fill className="object-cover" unoptimized />
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 pointer-events-none" />

              {/* Progress bars */}
              <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
                {stories.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      animate={{ width: i < activeIndex ? '100%' : i === activeIndex ? `${progress}%` : '0%' }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                ))}
              </div>

              {/* User info */}
              <div className="absolute top-8 left-4 right-12 flex items-center gap-2.5 z-10">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/60">
                  <Avatar src={activeStory.user?.avatar_url} name={activeStory.user?.full_name || ''} size="sm" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{activeStory.user?.full_name}</p>
                  <p className="text-white/60 text-[11px]">{formatNumber(activeStory.views ?? 0)} vues</p>
                </div>
              </div>

              {/* Close + Report */}
              <div className="absolute top-8 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => setActiveIndex(null)}
                  className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                >
                  <X size={16} />
                </button>
                {activeStory.user_id !== user?.id && (
                  <button
                    onClick={() => handleReport(activeStory.id)}
                    className={`w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${reported === activeStory.id ? 'bg-red-500 text-white' : 'bg-black/40 text-white/70 hover:text-red-400'}`}
                    title="Signaler"
                  >
                    <Flag size={14} />
                  </button>
                )}
              </div>

              {/* Tap zones */}
              <button onClick={goPrev} className="absolute left-0 top-0 w-1/3 h-full z-10" />
              <button onClick={goNext} className="absolute right-0 top-0 w-1/3 h-full z-10" />

              {activeIndex > 0 && (
                <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full hidden sm:flex items-center justify-center text-white z-20">
                  <ChevronLeft size={16} />
                </button>
              )}
              {activeIndex < stories.length - 1 && (
                <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full hidden sm:flex items-center justify-center text-white z-20">
                  <ChevronRight size={16} />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create modal */}
      {showCreate && (
        <StoryCreateModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { fetchStories() }}
        />
      )}
    </>
  )
}
