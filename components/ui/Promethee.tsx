'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { usePromethee } from '@/hooks/usePromethee'
import { useGlyphs } from '@/hooks/useGlyphs'

const SUGGESTIONS = [
  { icon: '🖊', label: 'Écrire mon post' },
  { icon: '#', label: 'Hashtags' },
  { icon: '📈', label: 'Analyse' },
  { icon: '🔮', label: 'Tendances' },
  { icon: '🌍', label: 'Traduire' },
  { icon: '📋', label: 'Résumer' },
]

export default function Promethee() {
  const { messages, loading, open, setOpen, sendMessage, getDailyCount, FREE_LIMIT } = usePromethee()
  const { balance, spendGlyphs } = useGlyphs()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const text = input
    setInput('')
    await sendMessage(text, balance, spendGlyphs)
  }

  const count = getDailyCount()

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="flame" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <span className="text-2xl">🔥</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 320, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 320, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:bottom-[88px] md:right-6 z-50 w-[340px] max-h-[560px] bg-bg-primary border border-violet-500/20 rounded-2xl shadow-2xl shadow-violet-500/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="text-sm font-black text-text-primary">Prométhée</p>
                  <p className="text-xs text-text-muted">{count}/{FREE_LIMIT} messages · IA NEXUS</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <span className="text-3xl block mb-2">🔥</span>
                  <p className="text-sm font-bold text-text-primary mb-1">Je suis Prométhée</p>
                  <p className="text-xs text-text-muted mb-4">Ton IA créateur sur NEXUS</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s.label}
                        onClick={() => setInput(s.label)}
                        className="text-xs px-2 py-2 rounded-xl bg-surface-2 border border-white/5 hover:border-violet-500/30 text-text-muted hover:text-violet-400 transition-colors text-left"
                      >
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-br-sm'
                      : 'bg-surface-2 border border-white/5 text-text-primary rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface-2 border border-white/5 rounded-2xl rounded-bl-sm px-3 py-2">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full"
                          animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Demande à Prométhée..."
                  className="flex-1 bg-surface-2 border border-white/5 rounded-xl px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
