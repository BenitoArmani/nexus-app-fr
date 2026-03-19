'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('nexus_cookie_consent')
    if (!consent) setTimeout(() => setVisible(true), 2000)
  }, [])

  const accept = () => { localStorage.setItem('nexus_cookie_consent', 'all'); setVisible(false) }
  const decline = () => { localStorage.setItem('nexus_cookie_consent', 'essential'); setVisible(false) }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-surface-2 border border-white/10 rounded-2xl p-4 shadow-2xl"
        >
          <p className="text-sm font-bold text-text-primary mb-1">🍪 Cookies</p>
          <p className="text-xs text-text-muted mb-3">
            Nous utilisons des cookies essentiels et analytiques pour améliorer NEXUS.{' '}
            <Link href="/privacy" className="text-violet-400 hover:underline">En savoir plus</Link>
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={accept} className="flex-1">Accepter</Button>
            <Button size="sm" variant="ghost" onClick={decline} className="flex-1">Essentiel uniquement</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
