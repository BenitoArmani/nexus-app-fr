'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ImagePlus, Loader2 } from 'lucide-react'
import { uploadMedia } from '@/lib/cloudinary'
import { supabase } from '@/lib/supabase'

interface Props {
  onClose: () => void
  onCreated: () => void
}

export default function StoryCreateModal({ onClose, onCreated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cguAccepted, setCguAccepted] = useState(false)

  function handleFile(f: File) {
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
      setError('Image ou vidéo uniquement')
      return
    }
    if (f.size > 50 * 1024 * 1024) {
      setError('Fichier trop lourd (max 50 Mo)')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }

  async function handlePublish() {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non authentifié')

      const { url, type } = await uploadMedia(file, 'stories')

      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ media_url: url, media_type: type }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erreur')

      onCreated()
      onClose()
    } catch (err) {
      setError(String(err))
    } finally {
      setUploading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-bg-secondary rounded-t-3xl sm:rounded-2xl w-full max-w-sm p-5 pb-8 sm:pb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Nouvelle story</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary">
              <X size={16} />
            </button>
          </div>

          {/* Preview */}
          {preview ? (
            <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden mb-4 bg-black">
              {file?.type.startsWith('video/') ? (
                <video src={preview} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => { setPreview(null); setFile(null) }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full aspect-[9/16] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 mb-4 text-text-muted hover:border-violet-500 hover:text-violet-400 transition-colors"
            >
              <ImagePlus size={32} />
              <span className="text-sm font-medium">Choisir une image ou vidéo</span>
              <span className="text-xs opacity-60">Disparaît après 24h</span>
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />

          {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}

          <div className="flex gap-2">
            {preview && !uploading && (
              <button
                onClick={() => inputRef.current?.click()}
                className="flex-1 py-3 rounded-xl bg-white/5 text-text-muted text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Changer
              </button>
            )}
            {/* CGU */}
          <label className="flex items-start gap-2.5 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cguAccepted}
              onChange={e => setCguAccepted(e.target.checked)}
              className="mt-0.5 accent-violet-500 w-4 h-4 flex-shrink-0"
            />
            <span className="text-xs text-text-muted leading-snug">
              Je certifie que ce contenu ne contient aucune violence, contenu choquant ou illégal et respecte les{' '}
              <a href="/conditions-utilisation" target="_blank" className="text-violet-400 underline">CGU</a>.
            </span>
          </label>

          <button
              onClick={handlePublish}
              disabled={!file || uploading || !cguAccepted}
              className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-bold disabled:opacity-40 hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? <><Loader2 size={16} className="animate-spin" /> Upload...</> : 'Publier la story'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
