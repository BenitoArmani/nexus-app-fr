'use client'
import { useState } from 'react'
import { Eye, EyeOff, ShieldAlert } from 'lucide-react'
import { useSafeMode } from '@/hooks/useSafeMode'
import AgeVerificationModal from './AgeVerificationModal'

interface SafeContentWrapperProps {
  isExplicit: boolean
  children: React.ReactNode
  className?: string
}

export default function SafeContentWrapper({ isExplicit, children, className = '' }: SafeContentWrapperProps) {
  const { safeMode, showAgeModal, setShowAgeModal, requestDisable, confirmAge } = useSafeMode()
  const [revealedLocally, setRevealedLocally] = useState(false)

  // Not explicit → render normally
  if (!isExplicit) return <>{children}</>

  // Explicit but safe mode off, or user revealed → show with badge only
  if (!safeMode || revealedLocally) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-rose-500/80 backdrop-blur-sm rounded-lg px-2 py-0.5">
          <ShieldAlert size={10} className="text-white" />
          <span className="text-[10px] text-white font-semibold">Contenu adulte</span>
        </div>
        {children}
        {revealedLocally && safeMode && (
          <button
            onClick={() => setRevealedLocally(false)}
            className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white/80 hover:bg-black/80 transition-colors"
          >
            <EyeOff size={11} /> Masquer
          </button>
        )}
      </div>
    )
  }

  // Explicit + safe mode ON → blur overlay
  return (
    <>
      <div className={`relative overflow-hidden ${className}`}>
        {/* Blurred content underneath */}
        <div className="blur-2xl scale-110 opacity-60 pointer-events-none select-none">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-2/60 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/30 rounded-full px-3 py-1">
            <ShieldAlert size={13} className="text-rose-400" />
            <span className="text-xs font-semibold text-rose-400">Contenu adulte</span>
          </div>
          <p className="text-sm font-semibold text-text-primary">Contenu sensible</p>
          <p className="text-xs text-text-muted text-center px-4">Ce contenu a été marqué comme explicite par son créateur.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setRevealedLocally(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs text-text-primary font-medium transition-colors"
            >
              <Eye size={13} /> Voir quand même
            </button>
            <button
              onClick={requestDisable}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-xl text-xs text-violet-400 font-medium transition-colors"
            >
              Désactiver le filtre
            </button>
          </div>
        </div>
      </div>

      <AgeVerificationModal
        open={showAgeModal}
        onClose={() => setShowAgeModal(false)}
        onConfirm={confirmAge}
      />
    </>
  )
}
