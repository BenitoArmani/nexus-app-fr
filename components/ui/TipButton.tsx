'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useGlyphs } from '@/hooks/useGlyphs'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const PRESETS = [10, 50, 100, 500]

interface TipButtonProps {
  toUserId: string
  toUsername: string
  context?: string
  contextId?: string
  className?: string
}

export default function TipButton({ toUserId, toUsername, context = 'post', contextId = '', className = '' }: TipButtonProps) {
  const { user }                  = useAuth()
  const { balance, spendGlyphs }  = useGlyphs()
  const [open, setOpen]           = useState(false)
  const [amount, setAmount]       = useState('')
  const [loading, setLoading]     = useState(false)

  if (!user || user.id === toUserId) return null

  const send = async (glyphs: number) => {
    if (glyphs < 1) return
    if (!spendGlyphs(glyphs, `Tip à @${toUsername}`)) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/glyphs/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token ?? ''}` },
        body: JSON.stringify({ toUserId, amount: glyphs, context, contextId }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`⬡ ${glyphs} GLYPHS envoyés à @${toUsername} !`, {
          style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }
        })
        setOpen(false)
        setAmount('')
      } else {
        toast.error(data.error || 'Erreur')
      }
    } catch {
      toast.error('Erreur de connexion')
    }
    setLoading(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
      >
        <span className="text-base leading-none">⬡</span>
        <span className="text-xs font-bold">Tip</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-10 left-0 z-50 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-4"
            >
              <p className="text-xs font-bold text-white mb-1">Envoyer des GLYPHS</p>
              <p className="text-[11px] text-zinc-500 mb-3">à @{toUsername} · Solde : {balance.toLocaleString('fr-FR')} ⬡</p>

              {/* Presets */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {PRESETS.map(n => (
                  <button
                    key={n}
                    onClick={() => send(n)}
                    disabled={loading || balance < n}
                    className="py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 disabled:opacity-30 transition-colors"
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Custom */}
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max={balance}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Montant..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 placeholder:text-zinc-600"
                />
                <button
                  onClick={() => send(parseInt(amount) || 0)}
                  disabled={loading || !amount || parseInt(amount) < 1}
                  className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold disabled:opacity-30 hover:bg-amber-400 transition-colors"
                >
                  {loading ? <Loader2 size={13} className="animate-spin" /> : 'Envoyer'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
