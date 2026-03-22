'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, Smile, Send, X, ShieldAlert, Calendar, Loader2, TrendingDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import ScheduleModal from '@/components/feed/ScheduleModal'
import { useAuth } from '@/hooks/useAuth'
import { useScheduledPosts } from '@/hooks/useScheduledPosts'
import { uploadMedia } from '@/lib/cloudinary'
import type { GifResult } from '@/types'
import toast from 'react-hot-toast'

const GifPicker = dynamic(() => import('@/components/ui/GifPicker'), { ssr: false })

interface PostComposerProps {
  onPost: (content: string, mediaUrl?: string, mediaType?: 'image' | 'video', betsDisabled?: boolean, isExplicit?: boolean) => void
}

export default function PostComposer({ onPost }: PostComposerProps) {
  const { user }              = useAuth()
  const { schedulePost }      = useScheduledPosts()
  const [content, setContent] = useState('')
  const [focused, setFocused] = useState(false)
  const [showGifs, setShowGifs] = useState(false)
  const [selectedGif, setSelectedGif] = useState<string | null>(null)
  const [mediaUrl, setMediaUrl]       = useState<string | null>(null)
  const [mediaType, setMediaType]     = useState<'image' | 'video' | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [uploading, setUploading]     = useState(false)
  const [isExplicit, setIsExplicit]     = useState(false)
  const [betsDisabled, setBetsDisabled] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleMediaSelect = async (file: File, type: 'image' | 'video') => {
    // Local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setMediaPreview(objectUrl)
    setMediaType(type)
    setSelectedGif(null)
    setUploading(true)
    try {
      const { url } = await uploadMedia(file, 'posts')
      setMediaUrl(url)
    } catch {
      toast.error('Échec de l\'upload. Réessaie.')
      setMediaPreview(null)
      setMediaType(null)
    } finally {
      setUploading(false)
    }
  }

  const clearMedia = () => {
    setMediaUrl(null)
    setMediaPreview(null)
    setMediaType(null)
    if (photoInputRef.current) photoInputRef.current.value = ''
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handleSubmit = () => {
    if (!content.trim() && !selectedGif && !mediaUrl) return
    if (uploading) { toast.error('Upload en cours, patiente...'); return }
    const finalMedia = mediaUrl ?? selectedGif ?? undefined
    const finalType  = mediaUrl ? mediaType ?? undefined : selectedGif ? 'image' : undefined
    onPost(content, finalMedia, finalType ?? undefined, betsDisabled, isExplicit)
    setContent('')
    setFocused(false)
    setSelectedGif(null)
    setShowGifs(false)
    clearMedia()
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
    clearMedia()
    setShowGifs(false)
  }

  return (
    <motion.div layout className="bg-surface-2 border border-white/5 rounded-2xl p-4">
      {/* Hidden file inputs */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleMediaSelect(f, 'image') }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleMediaSelect(f, 'video') }}
      />

      <div className="flex gap-3">
        <Avatar src={user?.avatar_url} name={user?.full_name || 'User'} size="md" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={500}
            onFocus={() => setFocused(true)}
            placeholder="Quoi de neuf ? Partagez quelque chose..."
            rows={focused ? 3 : 1}
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none transition-all"
          />

          {/* Media preview */}
          {(mediaPreview || selectedGif) && (
            <div className="relative inline-block mt-2 mb-2">
              {mediaType === 'video' && mediaPreview ? (
                <video src={mediaPreview} className="max-h-40 rounded-xl border border-white/10" muted />
              ) : (
                <img
                  src={mediaPreview ?? selectedGif ?? ''}
                  alt="Aperçu"
                  className="max-h-40 rounded-xl border border-white/10"
                />
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              )}
              <button
                onClick={clearMedia}
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
              <div className="flex gap-2 relative flex-wrap">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                >
                  <Image size={14} /> Photo
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                >
                  <Video size={14} /> Vidéo
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-text-muted hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                  <Smile size={14} /> Humeur
                </button>
                <button
                  onClick={() => setIsExplicit(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors ${isExplicit ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-text-muted hover:text-rose-400 hover:bg-rose-500/10'}`}
                >
                  <ShieldAlert size={14} /> {isExplicit ? '🔞 Adulte' : '+18'}
                </button>
                <button
                  onClick={() => setBetsDisabled(v => !v)}
                  title="Interdire les paris et tips sous ce post"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors ${betsDisabled ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-text-muted hover:text-amber-400 hover:bg-amber-500/10'}`}
                >
                  <TrendingDown size={14} /> {betsDisabled ? '🚫 Paris off' : 'Paris'}
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
                <Button size="sm" variant="outline" onClick={() => setShowSchedule(true)} disabled={!content.trim()} className="!px-2" title="Programmer">
                  <Calendar size={13} />
                </Button>
                <Button size="sm" onClick={handleSubmit} disabled={(!content.trim() && !selectedGif && !mediaUrl) || content.length > 500 || uploading}>
                  {uploading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Publier
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
