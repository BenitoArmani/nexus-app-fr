'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ScheduleModalProps {
  open: boolean
  content: string
  onClose: () => void
  onSchedule: (scheduledAt: string) => void
}

export default function ScheduleModal({ open, content, onClose, onSchedule }: ScheduleModalProps) {
  const minDate = new Date()
  minDate.setMinutes(minDate.getMinutes() + 5)
  const minStr = minDate.toISOString().slice(0, 16)

  const [datetime, setDatetime] = useState(minStr)

  const handleSchedule = () => {
    if (!datetime) return
    onSchedule(new Date(datetime).toISOString())
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="bg-bg-primary border border-white/10 rounded-2xl p-5 w-full max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Calendar size={16} className="text-violet-400" /> Programmer le post
              </h3>
              <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-muted">
                <X size={14} />
              </button>
            </div>

            <div className="bg-surface-2 border border-white/5 rounded-xl p-3 mb-4">
              <p className="text-sm text-text-secondary line-clamp-3">{content || 'Post sans texte'}</p>
            </div>

            <div className="mb-4">
              <label className="text-xs text-text-muted mb-1.5 flex items-center gap-1">
                <Clock size={12} /> Date et heure de publication
              </label>
              <input
                type="datetime-local"
                value={datetime}
                min={minStr}
                onChange={e => setDatetime(e.target.value)}
                className="w-full bg-surface-2 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-violet-500/50 [color-scheme:dark]"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>Annuler</Button>
              <Button className="flex-1" onClick={handleSchedule} disabled={!datetime}>
                🗓 Programmer
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
