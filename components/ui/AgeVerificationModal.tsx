'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X, AlertTriangle } from 'lucide-react'

interface AgeVerificationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (year: number, month: number, day: number) => boolean
}

export default function AgeVerificationModal({ open, onClose, onConfirm }: AgeVerificationModalProps) {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [denied, setDenied] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const d = parseInt(day), m = parseInt(month), y = parseInt(year)
    if (!d || !m || !y || y < 1900 || y > new Date().getFullYear()) return
    const ok = onConfirm(y, m, d)
    if (!ok) setDenied(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-surface-2 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-base font-black text-text-primary">Vérification d'âge</h2>
                  <p className="text-xs text-text-muted">Accès réservé aux +18 ans</p>
                </div>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-text-muted">
                <X size={14} />
              </button>
            </div>

            {denied ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                  <AlertTriangle size={28} className="text-rose-400" />
                </div>
                <p className="text-sm font-semibold text-text-primary text-center">
                  Accès refusé
                </p>
                <p className="text-xs text-text-muted text-center">
                  Vous devez avoir au moins 18 ans pour désactiver le filtre de contenu.<br />
                  Le mode Safe reste activé.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-surface-3 border border-white/10 rounded-xl text-sm text-text-primary font-medium"
                >
                  Compris
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-text-muted mb-4">
                  Entrez votre date de naissance pour confirmer votre âge. Cette information n'est pas enregistrée.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-text-muted block mb-1">Jour</label>
                      <input
                        type="number" min="1" max="31" value={day}
                        onChange={e => setDay(e.target.value)}
                        placeholder="JJ"
                        className="w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 text-center"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-text-muted block mb-1">Mois</label>
                      <input
                        type="number" min="1" max="12" value={month}
                        onChange={e => setMonth(e.target.value)}
                        placeholder="MM"
                        className="w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 text-center"
                        required
                      />
                    </div>
                    <div className="flex-[2]">
                      <label className="text-xs text-text-muted block mb-1">Année</label>
                      <input
                        type="number" min="1900" max={new Date().getFullYear()} value={year}
                        onChange={e => setYear(e.target.value)}
                        placeholder="AAAA"
                        className="w-full bg-surface-3 border border-white/5 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50 text-center"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Confirmer mon âge
                  </button>
                </form>
                <p className="text-xs text-text-muted text-center mt-3">
                  Les mineurs ne peuvent jamais désactiver le filtre.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
