'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import GifPicker from '@/components/ui/GifPicker'
import { useComments } from '@/hooks/useComments'
import { useSounds } from '@/hooks/useSounds'
import { timeAgo } from '@/lib/utils'
import type { GifResult } from '@/types'

interface CommentsSheetProps {
  postId: string
  open: boolean
  onClose: () => void
  userId?: string
  userName?: string
  userAvatar?: string | null
}

export default function CommentsSheet({ postId, open, onClose, userId, userName, userAvatar }: CommentsSheetProps) {
  const { comments, loading, addComment } = useComments(open ? postId : null)
  const { play } = useSounds()
  const [text, setText] = useState('')
  const [selectedGif, setSelectedGif] = useState<GifResult | null>(null)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const handleSend = async () => {
    if ((!text.trim() && !selectedGif) || !userId || sending) return
    setSending(true)
    try {
      await addComment(userId, text.trim(), selectedGif ? {
        url: selectedGif.url,
        preview_url: selectedGif.preview_url,
        source: 'tenor',
        title: selectedGif.title,
      } : undefined)
      play('send')
      setText('')
      setSelectedGif(null)
      setShowGifPicker(false)
    } catch {
      // ignore
    } finally {
      setSending(false)
    }
  }

  const handleGifSelect = (gif: GifResult) => {
    setSelectedGif(gif)
    setShowGifPicker(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/8 rounded-t-3xl bottom-sheet"
            style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 shrink-0">
              <h3 className="text-sm font-semibold text-white">
                Commentaires {comments.length > 0 && <span className="text-zinc-500">({comments.length})</span>}
              </h3>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Comments list */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 pb-2 space-y-3 min-h-0">
              {loading ? (
                <div className="flex items-center justify-center h-20 text-zinc-600 text-sm">Chargement...</div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 gap-2">
                  <p className="text-zinc-500 text-sm">Aucun commentaire</p>
                  <p className="text-zinc-700 text-xs">Sois le premier à commenter !</p>
                </div>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-2.5">
                    <Avatar src={comment.user?.avatar_url} name={comment.user?.full_name || '?'} size="xs" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-semibold text-white truncate">{comment.user?.full_name}</span>
                        {comment.user?.is_verified && <Badge variant="verified">Pro</Badge>}
                        <span className="text-[10px] text-zinc-600 shrink-0">· {timeAgo(comment.created_at)}</span>
                      </div>
                      {comment.content && (
                        <p className="text-sm text-zinc-300 leading-snug">{comment.content}</p>
                      )}
                      {comment.gif_url && (
                        <div className="mt-1.5 relative rounded-xl overflow-hidden bg-white/5 inline-block max-w-[200px]">
                          <Image
                            src={comment.gif_preview_url ?? comment.gif_url}
                            alt="gif"
                            width={200}
                            height={150}
                            className="rounded-xl object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 pb-4 pt-2 border-t border-white/5">
              {/* GIF preview */}
              <AnimatePresence>
                {selectedGif && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-2 relative inline-block"
                  >
                    <div className="relative rounded-xl overflow-hidden bg-white/5">
                      <Image src={selectedGif.preview_url} alt="gif" width={120} height={90} className="rounded-xl object-cover" unoptimized />
                      <button
                        onClick={() => setSelectedGif(null)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* GIF Picker */}
              <div className="relative">
                <AnimatePresence>
                  {showGifPicker && (
                    <GifPicker onSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} userId={userId} />
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-2xl px-3 py-2.5 focus-within:border-violet-500/40 transition-colors">
                  <Avatar src={userAvatar} name={userName || 'Moi'} size="xs" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Écrire un commentaire..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    style={{ fontSize: 16 }}
                  />
                  <button
                    onClick={() => setShowGifPicker(s => !s)}
                    className={`shrink-0 transition-colors ${showGifPicker ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={(!text.trim() && !selectedGif) || sending}
                    className="shrink-0 text-violet-400 disabled:text-zinc-700 hover:text-violet-300 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
