'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Send, Heart, Flame, Laugh, PartyPopper } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { MOCK_USERS } from '@/lib/mock-data'

interface WatchPartyRoomProps {
  roomId: string
  title: string
  videoUrl?: string
  onLeave: () => void
}

const REACTIONS = [
  { emoji: '❤️', icon: Heart },
  { emoji: '🔥', icon: Flame },
  { emoji: '😂', icon: Laugh },
  { emoji: '🎉', icon: PartyPopper },
]

interface FloatingReaction {
  id: number
  emoji: string
  x: number
}

const MOCK_MESSAGES = [
  { id: 1, user: MOCK_USERS[0], text: 'Trop bien cette scène ! 🔥', time: '14:32' },
  { id: 2, user: MOCK_USERS[1], text: 'Je suis d\'accord, c\'est incroyable', time: '14:33' },
  { id: 3, user: MOCK_USERS[2], text: '🎵 La musique est ouf', time: '14:33' },
]

export default function WatchPartyRoom({ roomId, title, videoUrl, onLeave }: WatchPartyRoomProps) {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const [viewers] = useState(Math.floor(Math.random() * 6) + 3)
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([])

  const sendReaction = (emoji: string) => {
    const reaction: FloatingReaction = { id: Date.now(), emoji, x: Math.random() * 80 + 10 }
    setFloatingReactions(prev => [...prev, reaction])
    setTimeout(() => setFloatingReactions(prev => prev.filter(r => r.id !== reaction.id)), 3000)
  }

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: { id: '0', username: 'moi_creator', full_name: 'Moi', avatar_url: 'https://i.pravatar.cc/150?img=68', bio: null, is_verified: true, is_creator: true, monthly_goal: 500, followers_count: 3420, following_count: 186, created_at: '' },
      text: input,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    }])
    setInput('')
  }

  return (
    <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden relative">
      {/* Video player */}
      <div className="relative aspect-video bg-black">
        {videoUrl ? (
          <video src={videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-4xl">🎬</span>
            <p className="text-sm text-text-muted">Lecture synchronisée</p>
          </div>
        )}
        {/* Floating reactions */}
        <AnimatePresence>
          {floatingReactions.map(r => (
            <motion.div
              key={r.id}
              initial={{ y: '100%', x: `${r.x}%`, opacity: 1, scale: 1 }}
              animate={{ y: '-100%', opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
              className="absolute bottom-0 text-2xl pointer-events-none"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Viewer count */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          <Users size={12} className="text-white" />
          <span className="text-xs text-white font-bold">{viewers}</span>
        </div>
        {/* Title */}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-xs text-white/80 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 truncate">{title}</p>
        </div>
      </div>

      {/* Reactions */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-white/5">
        {REACTIONS.map(r => (
          <button key={r.emoji} onClick={() => sendReaction(r.emoji)}
            className="flex-1 py-2 rounded-xl hover:bg-white/5 text-lg transition-colors">
            {r.emoji}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="border-t border-white/5">
        <div className="h-40 overflow-y-auto p-3 space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className="flex items-start gap-2">
              <Avatar src={msg.user.avatar_url} name={msg.user.full_name} size="xs" />
              <div>
                <span className="text-xs font-semibold text-violet-400">{msg.user.username}</span>
                <span className="text-xs text-text-muted"> {msg.time}</span>
                <p className="text-xs text-text-primary">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 p-3 border-t border-white/5">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Réagis en direct..."
            className="flex-1 bg-surface-3 border border-white/5 rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
          />
          <button onClick={sendMessage} className="w-8 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center">
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
