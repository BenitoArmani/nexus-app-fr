'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Video, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { uploadMedia } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'
import { soundSystem } from '@/lib/sounds'

interface ReelUploadModalProps {
  open: boolean
  onClose: () => void
  userId?: string
  onSuccess?: (reelId: string) => void
}

type UploadState = 'idle' | 'uploading' | 'saving' | 'done' | 'error'

export function ReelUploadModal({ open, onClose, userId, onSuccess }: ReelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [state, setState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('video/')) { setError('Seules les vidéos sont acceptées.'); return }
    if (f.size > 200 * 1024 * 1024) { setError('Fichier trop lourd (max 200 Mo).'); return }
    setFile(f)
    setError(null)
    setPreview(URL.createObjectURL(f))
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleUpload = async () => {
    if (!file) return
    setState('uploading')
    setProgress(0)

    try {
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 5, 85))
      }, 200)

      const { url, publicId } = await uploadMedia(file, 'reels')
      clearInterval(progressInterval)
      setProgress(90)

      setState('saving')

      // Generate thumbnail URL from Cloudinary
      const thumbnailUrl = url
        .replace('/upload/', '/upload/so_0,w_400,h_711,c_fill,q_80/')
        .replace(/\.(mp4|mov|avi|webm)$/, '.jpg')

      // Save to Supabase
      if (userId) {
        const { data, error: dbError } = await supabase.from('reels').insert({
          user_id: userId,
          video_url: url,
          thumbnail_url: thumbnailUrl,
          caption: caption.trim() || '',
          views: 0,
          likes: 0,
          earnings: 0,
        }).select('id').single()

        if (dbError) throw dbError
        setProgress(100)
        setState('done')
        soundSystem?.play('success')
        if (data) onSuccess?.(data.id)
      } else {
        // Demo mode - just show success
        setProgress(100)
        setState('done')
        soundSystem?.play('success')
      }

      setTimeout(() => {
        onClose()
        setState('idle')
        setFile(null)
        setPreview(null)
        setCaption('')
        setProgress(0)
      }, 2000)

    } catch (err) {
      setState('error')
      setError('Erreur lors de l\'upload. Vérifie ta connexion.')
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setCaption('')
    setState('idle')
    setError(null)
    setProgress(0)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={e => { if (e.target === e.currentTarget) { reset(); onClose() } }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-surface-2 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <h2 className="text-base font-bold text-white">Publier un Reel</h2>
              <button onClick={() => { reset(); onClose() }} className="w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Drop zone */}
              {!file ? (
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors group"
                >
                  <Video size={32} className="text-zinc-600 group-hover:text-violet-400 mx-auto mb-3 transition-colors" />
                  <p className="text-sm font-medium text-white mb-1">Glisse ta vidéo ici</p>
                  <p className="text-xs text-zinc-500">MP4, MOV, WebM · max 200 Mo</p>
                  <input ref={fileRef} type="file" accept="video/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-64 flex items-center justify-center">
                  <video src={preview ?? ''} className="max-h-full max-w-full object-contain" controls />
                  {state === 'idle' && (
                    <button
                      onClick={reset}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Caption */}
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Ajoute une légende..."
                maxLength={500}
                rows={2}
                className="w-full bg-surface-2 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 resize-none"
              />

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-sm">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* Progress */}
              {(state === 'uploading' || state === 'saving') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin" />
                      {state === 'uploading' ? 'Upload en cours...' : 'Sauvegarde...'}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Done */}
              {state === 'done' && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  Reel publié avec succès !
                </div>
              )}

              {/* Upload button */}
              {(state === 'idle' || state === 'error') && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpload}
                  disabled={!file}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-90 disabled:opacity-40 text-white font-semibold rounded-2xl transition-opacity flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  Publier le Reel
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
