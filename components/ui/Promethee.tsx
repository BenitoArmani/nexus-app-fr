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

/* ─── 2D Flame SVG ─────────────────────────── */
function FlameSpirit({ clicked, scale = 1 }: { clicked: boolean; scale?: number }) {
  const W = 44 * scale
  const H = 60 * scale
  const uid = `f${Math.round(scale * 100)}`

  return (
    <motion.div
      style={{ width: W, height: H }}
      animate={{ y: [0, -3 * scale, 0, -2 * scale, 0], rotate: [-2, 2, -3, 1, -2] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        style={{ width: '100%', height: '100%', transformOrigin: 'bottom center' }}
        animate={clicked ? { scaleX: 0.6, scaleY: 1.5 } : { scaleX: 1, scaleY: 1 }}
        transition={clicked
          ? { duration: 0.1, ease: 'easeOut' }
          : { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg width="100%" height="100%" viewBox="0 0 44 60" style={{ overflow: 'visible' }}>
          <defs>
            {/* Outer glow blur */}
            <filter id={`glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Outer flame: light cyan at tip → mid-blue at base */}
            <linearGradient id={`outer-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#bae6fd" />
              <stop offset="45%"  stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            {/* Inner core: darker blue */}
            <linearGradient id={`inner-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>

          {/* Outer glow halo */}
          <path
            d="M22 3 C19 9,8 17,7 27 C5 38,9 48,15 53 C17 55,20 57,22 57 C24 57,27 55,29 53 C35 48,39 38,37 27 C36 17,25 9,22 3Z"
            fill="rgba(56,189,248,0.22)"
            style={{ transform: 'scale(1.28)', transformOrigin: '22px 57px' }}
            filter={`url(#glow-${uid})`}
          />

          {/* Main flame — outer silhouette (lighter cyan) */}
          <motion.path
            d="M22 3 C19 9,8 17,7 27 C5 38,9 48,15 53 C17 55,20 57,22 57 C24 57,27 55,29 53 C35 48,39 38,37 27 C36 17,25 9,22 3Z"
            fill={`url(#outer-${uid})`}
            animate={{ scaleX: [1, 0.96, 1.04, 0.97, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '22px 57px' }}
          />

          {/* Inner core — darker, narrower, slightly raised */}
          <motion.path
            d="M22 15 C20 20,14 27,13 35 C12 42,15 49,19 52 C20 53,21 54,22 54 C23 54,24 53,25 52 C29 49,32 42,31 35 C30 27,24 20,22 15Z"
            fill={`url(#inner-${uid})`}
            animate={{ scaleX: [1, 0.91, 1.07, 0.94, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
            style={{ transformOrigin: '22px 54px' }}
          />

          {/* Bright highlight */}
          <ellipse cx="22" cy="38" rx="5" ry="8" fill="rgba(186,230,253,0.28)" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main component ─────────────────────────── */
export default function Promethee() {
  const { messages, loading, open, setOpen, sendMessage, getDailyCount, FREE_LIMIT } = usePromethee()
  const { balance, spendGlyphs } = useGlyphs()
  const [input, setInput]       = useState('')
  const [clicked, setClicked]   = useState(false)
  const [cssClicked, setCssClicked] = useState(false)
  const messagesEndRef          = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleButtonClick = () => {
    if (open) { setOpen(false); return }
    setClicked(true)
    setCssClicked(true)
    setTimeout(() => setCssClicked(false), 120)
    setTimeout(() => { setClicked(false); setOpen(true) }, 380)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const text = input
    setInput('')
    await sendMessage(text, balance, spendGlyphs)
  }

  const count = getDailyCount()

  return (
    <>
      <style>{`
        .promethe {
          transition: filter 0.2s ease;
          filter: drop-shadow(0 0 6px rgba(0,200,255,0.55));
        }
        .promethe:hover {
          filter: drop-shadow(0 0 13px rgba(0,220,255,0.9));
          transform: scale(1.12);
        }
        .promethe.clicked {
          transform: scale(0.85);
          transition: transform 0.08s ease;
        }
        @keyframes flameFloat {
          0%,100% { transform: translateY(0px); }
          40%      { transform: translateY(-4px); }
          70%      { transform: translateY(-2px); }
        }
      `}</style>

      {/* ── Floating flame button ── */}
      <motion.button
        onClick={handleButtonClick}
        className={`fixed bottom-24 right-3 md:bottom-6 md:right-6 z-50 promethe${cssClicked ? ' clicked' : ''}`}
        style={{ width: 50, height: 66, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <FlameSpirit clicked={clicked} scale={1} />
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-36 right-3 md:bottom-[104px] md:right-6 z-50 w-[340px] max-h-[520px] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(3, 30, 51, 0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(56,189,248,0.18)',
              borderRadius: '22px',
              boxShadow: '0 8px 48px rgba(0,0,0,0.55), 0 0 32px rgba(14,165,233,0.07)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(56,189,248,0.12)', background: 'rgba(2,132,199,0.08)' }}>
              <div className="flex items-center gap-2.5">
                <div style={{ width: 28, height: 38, flexShrink: 0 }}>
                  <FlameSpirit clicked={false} scale={0.55} />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Prométhée</p>
                  <p className="text-[11px]" style={{ color: 'rgba(186,230,253,0.55)' }}>{count}/{FREE_LIMIT} messages · IA NEXUS</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                style={{ color: 'rgba(186,230,253,0.4)' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="text-center py-3">
                  <div className="flex justify-center mb-1">
                    <FlameSpirit clicked={false} scale={0.75} />
                  </div>
                  <p className="text-sm font-black text-white mb-1">Je suis Prométhée</p>
                  <p className="text-xs mb-4" style={{ color: 'rgba(186,230,253,0.45)' }}>Ton IA créateur sur NEXUS</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s.label}
                        onClick={() => setInput(s.label)}
                        className="text-xs px-2 py-2 rounded-xl text-left transition-colors"
                        style={{ background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(56,189,248,0.13)', color: 'rgba(186,230,253,0.65)' }}
                      >
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: 'white', borderBottomRightRadius: 5 }
                      : { background: 'rgba(14,165,233,0.09)', border: '1px solid rgba(56,189,248,0.13)', color: 'rgba(240,249,255,0.88)', borderBottomLeftRadius: 5 }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm px-3 py-2" style={{ background: 'rgba(14,165,233,0.09)', border: '1px solid rgba(56,189,248,0.13)' }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: '#38bdf8' }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t" style={{ borderColor: 'rgba(56,189,248,0.1)' }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Demande à Prométhée..."
                  className="flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  style={{
                    background: 'rgba(14,165,233,0.07)',
                    border: '1px solid rgba(56,189,248,0.18)',
                    color: 'rgba(240,249,255,0.9)',
                    fontSize: 16,
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-35 transition-opacity hover:opacity-85"
                  style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}
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
