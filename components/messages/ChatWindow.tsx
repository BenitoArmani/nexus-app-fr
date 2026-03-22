'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, Image as ImageIcon, Smile, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import MessageBubble from './MessageBubble'
import { supabase } from '@/lib/supabase'
import { soundSystem } from '@/lib/sounds'
import type { User, Message } from '@/types'

const MOCK_MESSAGES: Message[] = [
  { id: 'msg1', sender_id: '1', receiver_id: '0', content: 'Salut ! J\'ai vu ton dernier reel, c\'était incroyable 🔥', media_url: null, read: true, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'msg2', sender_id: '0', receiver_id: '1', content: 'Merci beaucoup ! J\'ai passé pas mal de temps sur le montage', media_url: null, read: true, created_at: new Date(Date.now() - 3600000 * 1.9).toISOString() },
  { id: 'msg3', sender_id: '1', receiver_id: '0', content: 'Ça se voit vraiment. Tu as utilisé quel logiciel ?', media_url: null, read: true, created_at: new Date(Date.now() - 3600000 * 1.5).toISOString() },
  { id: 'msg4', sender_id: '0', receiver_id: '1', content: 'Premier Pro + After Effects. Tu veux qu\'on fasse une collab ?', media_url: null, read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'msg5', sender_id: '1', receiver_id: '0', content: 'Oh oui avec plaisir ! Je t\'envoie des créneaux cette semaine 💜', media_url: null, read: false, created_at: new Date(Date.now() - 600000).toISOString() },
]

interface ChatWindowProps {
  user: User
  currentUserId?: string
  onBack?: () => void
}

export default function ChatWindow({ user, currentUserId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  // Load real messages from Supabase if we have a real user
  useEffect(() => {
    if (!currentUserId || currentUserId === '0') return

    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`
        )
        .order('created_at', { ascending: true })
        .limit(100)

      if (data && data.length > 0) setMessages(data)
    }

    loadMessages()

    // Mark as read
    supabase.from('messages')
      .update({ read: true })
      .eq('receiver_id', currentUserId)
      .eq('sender_id', user.id)
      .eq('read', false)
      .then(() => {})

    // Real-time subscription
    const channel = supabase.channel(`chat:${[currentUserId, user.id].sort().join('-')}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`,
      }, (payload) => {
        const msg = payload.new as Message
        if (msg.sender_id === user.id) {
          setMessages(prev => [...prev, msg])
          soundSystem?.play('message')
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId, user.id])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    setSending(true)

    const content = input.trim()
    setInput('')

    // Optimistic update
    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId ?? '0',
      receiver_id: user.id,
      content,
      media_url: null,
      read: false,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    if (currentUserId && currentUserId !== '0') {
      const { data } = await supabase.from('messages').insert({
        sender_id: currentUserId,
        receiver_id: user.id,
        content,
      }).select().single()

      if (data) {
        setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m))
      }
    }

    setSending(false)
  }

  const myId = currentUserId ?? '0'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-surface-2">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white">
              <ArrowLeft size={18} />
            </button>
          )}
          <Avatar src={user.avatar_url} name={user.full_name} size="md" online />
          <div>
            <p className="text-sm font-semibold text-text-primary">{user.full_name}</p>
            <p className="text-xs text-emerald-400">En ligne</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button key={i} className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === myId}
            senderUserId={msg.sender_id !== myId ? msg.sender_id : undefined}
            senderUsername={msg.sender_id !== myId ? user.username : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 bg-surface-2 border border-white/5 rounded-2xl px-3 py-2">
          <button className="text-text-muted hover:text-violet-400 transition-colors">
            <Smile size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Écrire un message..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button className="text-text-muted hover:text-cyan-400 transition-colors">
            <ImageIcon size={20} />
          </button>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-8 h-8 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-xl flex items-center justify-center text-white transition-colors"
          >
            <Send size={14} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
