'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Loader2 } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { uploadMedia } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ProfileEditModal({ open, onClose }: Props) {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name ?? '')
  const [bio, setBio]           = useState(user?.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  const handleAvatarChange = async (file: File) => {
    setAvatarPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const { url } = await uploadMedia(file, 'avatars')
      setAvatarUrl(url)
    } catch {
      toast.error('Échec de l\'upload de l\'avatar.')
      setAvatarPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!fullName.trim()) { toast.error('Le nom ne peut pas être vide.'); return }
    setSaving(true)
    try {
      await updateProfile({
        full_name:  fullName.trim(),
        bio:        bio.trim() || null,
        avatar_url: avatarUrl || null,
      })
      toast.success('Profil mis à jour !')
      onClose()
    } catch {
      toast.error('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto bg-surface-2 border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-text-primary">Modifier le profil</h2>
              <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Avatar */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarChange(f) }}
            />
            <div className="flex justify-center mb-5">
              <button
                onClick={() => fileRef.current?.click()}
                className="relative group"
                disabled={uploading}
              >
                <Avatar
                  src={avatarPreview ?? avatarUrl ?? undefined}
                  name={fullName || user.full_name}
                  size="xl"
                />
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading
                    ? <Loader2 size={20} className="animate-spin text-white" />
                    : <Camera size={20} className="text-white" />
                  }
                </div>
              </button>
            </div>

            <div className="space-y-3">
              {/* Full name */}
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1.5">Nom affiché</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  maxLength={50}
                  className="w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet-500/50"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-medium text-text-muted block mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder="Parlez de vous..."
                  className="w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 resize-none"
                />
                <p className="text-[11px] text-text-muted text-right mt-0.5">{bio.length}/160</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <Button variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
                Annuler
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving || uploading}>
                {saving ? <><Loader2 size={13} className="animate-spin" /> Sauvegarde…</> : 'Sauvegarder'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
