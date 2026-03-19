'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X } from 'lucide-react'

export default function DonationBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('nexus_donation_dismissed')
    if (!dismissed || Date.now() > parseInt(dismissed) + 30 * 24 * 3600 * 1000) {
      setTimeout(() => setVisible(true), 5000)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem('nexus_donation_dismissed', Date.now().toString())
    setVisible(false)
  }

  const donate = async () => {
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }), // 1€ minimum
      })
      const data = await res.json()
      if (data.url) window.open(data.url, '_blank')
    } catch {}
    dismiss()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-14 left-0 right-0 z-30 flex justify-center px-4 py-2 pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-3 bg-surface-2/95 backdrop-blur-md border border-violet-500/20 rounded-2xl px-4 py-2.5 shadow-lg max-w-lg w-full">
            <Heart size={16} className="text-rose-400 flex-shrink-0" fill="currentColor" />
            <p className="text-xs text-text-secondary flex-1 leading-relaxed">
              <span className="font-semibold text-text-primary">NEXUS restera toujours gratuit.</span>{' '}
              Un don même de 0,01€ nous aide à continuer.
            </p>
            <button
              onClick={donate}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-colors flex-shrink-0"
            >
              Donner
            </button>
            <button onClick={dismiss} className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
