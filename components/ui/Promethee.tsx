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

/* ─── Flame spirit character ─────────────────────────── */
function FlameSpirit({ clicked, scale = 1 }: { clicked: boolean; scale?: number }) {
  const W = 52 * scale
  const H = 70 * scale

  return (
    <motion.div
      style={{ width: W, height: H, position: 'relative' }}
      /* idle sway */
      animate={{ rotate: [-4, 3, -5, 4, -3, 5, -4], y: [0, -2 * scale, 0, -3 * scale, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* click stretch */}
      <motion.div
        style={{ width: '100%', height: '100%', position: 'relative', transformOrigin: 'bottom center' }}
        animate={clicked ? { scaleX: 0.55, scaleY: 1.55 } : { scaleX: 1, scaleY: 1 }}
        transition={clicked ? { duration: 0.12, ease: 'easeOut' } : { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      >

        {/* ── outer glow halo ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(56,189,248,0.35) 0%, rgba(14,165,233,0.15) 55%, transparent 80%)',
          borderRadius: '45% 45% 50% 50% / 50% 50% 50% 50%',
          transform: `scale(${1.55 * scale})`,
          filter: `blur(${7 * scale}px)`,
        }} />

        {/* ── main body ── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: `${10 * scale}px ${5 * scale}px ${2 * scale}px ${5 * scale}px`,
            background: 'radial-gradient(ellipse at 50% 42%, #0ea5e9 0%, #0284c7 45%, #075985 100%)',
            borderRadius: '44% 44% 50% 50% / 54% 54% 46% 46%',
            border: `${1.5 * scale}px solid rgba(56,189,248,0.65)`,
            boxShadow: `0 0 ${12 * scale}px rgba(56,189,248,0.25), inset 0 ${scale}px 0 rgba(186,230,253,0.15)`,
          }}
          /* body flicker — stepped inspired by the bat */
          animate={{ scaleX: [1, 0.94, 1.04, 0.96, 1.02, 1], scaleY: [1, 1.05, 0.96, 1.03, 0.98, 1] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: 'linear' }}
        />

        {/* ── inner bright core ── */}
        <div style={{
          position: 'absolute',
          left: '22%', top: '30%', width: '56%', height: '38%',
          background: 'radial-gradient(ellipse, rgba(186,230,253,0.45) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: `blur(${4 * scale}px)`,
        }} />

        {/* ── flame tip center (tallest) ── */}
        <motion.div
          style={{
            position: 'absolute',
            top: -20 * scale, left: '50%', transform: 'translateX(-50%)',
            width: 14 * scale, height: 30 * scale,
            background: 'linear-gradient(to top, #38bdf8 0%, #7dd3fc 55%, transparent 100%)',
            borderRadius: '50% 50% 22% 22% / 80% 80% 20% 20%',
            filter: `blur(${1.5 * scale}px)`,
          }}
          animate={{ scaleX: [1, 0.65, 1.25, 0.75, 1.15, 1], scaleY: [1, 1.25, 0.88, 1.3, 0.9, 1], x: [-scale, scale, -2 * scale, 2 * scale, 0] }}
          transition={{ duration: 0.45, repeat: Infinity, ease: 'linear' }}
        />

        {/* ── flame tip left (shorter) ── */}
        <motion.div
          style={{
            position: 'absolute',
            top: -10 * scale, left: '20%',
            width: 9 * scale, height: 18 * scale,
            background: 'linear-gradient(to top, #38bdf8, #bae6fd 60%, transparent)',
            borderRadius: '50% 50% 22% 22% / 80% 80% 20% 20%',
            filter: `blur(${2 * scale}px)`,
            opacity: 0.75,
          }}
          animate={{ scaleY: [1, 1.4, 0.75, 1.2, 1], x: [-scale, scale, 0] }}
          transition={{ duration: 0.65, repeat: Infinity, ease: 'linear', delay: 0.12 }}
        />

        {/* ── flame tip right (shorter) ── */}
        <motion.div
          style={{
            position: 'absolute',
            top: -10 * scale, right: '20%',
            width: 9 * scale, height: 18 * scale,
            background: 'linear-gradient(to top, #38bdf8, #bae6fd 60%, transparent)',
            borderRadius: '50% 50% 22% 22% / 80% 80% 20% 20%',
            filter: `blur(${2 * scale}px)`,
            opacity: 0.75,
          }}
          animate={{ scaleY: [1, 0.78, 1.35, 0.88, 1], x: [scale, -scale, 0] }}
          transition={{ duration: 0.65, repeat: Infinity, ease: 'linear', delay: 0.22 }}
        />

        {/* ── eye left ── */}
        <div style={{
          position: 'absolute',
          top: '38%', left: '24%',
          width: 9 * scale, height: 9 * scale,
          background: 'white',
          borderRadius: '50%',
          boxShadow: `0 0 ${5 * scale}px rgba(186,230,253,0.9)`,
        }} />

        {/* ── eye right ── */}
        <div style={{
          position: 'absolute',
          top: '38%', right: '24%',
          width: 9 * scale, height: 9 * scale,
          background: 'white',
          borderRadius: '50%',
          boxShadow: `0 0 ${5 * scale}px rgba(186,230,253,0.9)`,
        }} />

        {/* ── base wisp glow ── */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 14 * scale,
            background: 'radial-gradient(ellipse at 50% 100%, rgba(56,189,248,0.4), transparent)',
            filter: `blur(${3 * scale}px)`,
          }}
          animate={{ opacity: [0.4, 0.85, 0.3, 0.9, 0.4] }}
          transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
        />

      </motion.div>
    </motion.div>
  )
}

/* ─── Main component ─────────────────────────── */
export default function Promethee() {
  const { messages, loading, open, setOpen, sendMessage, getDailyCount, FREE_LIMIT } = usePromethee()
  const { balance, spendGlyphs } = useGlyphs()
  const [input, setInput]     = useState('')
  const [clicked, setClicked] = useState(false)
  const messagesEndRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleButtonClick = () => {
    if (open) { setOpen(false); return }
    setClicked(true)
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
      {/* ── Floating flame button ── */}
      <motion.button
        onClick={handleButtonClick}
        className="fixed bottom-24 right-3 md:bottom-6 md:right-6 z-50"
        style={{ width: 56, height: 72, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        whileHover={{ scale: 1.08 }}
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
