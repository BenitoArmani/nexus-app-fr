'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Edit } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import ChatWindow from '@/components/messages/ChatWindow'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { MOCK_CONVERSATIONS } from '@/lib/mock-data'
import { timeAgo, cn } from '@/lib/utils'
import type { User, Conversation } from '@/types'

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeUser, setActiveUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadConversations() {
      if (!user || user.id === '0') {
        setConversations(MOCK_CONVERSATIONS)
        setActiveUser(MOCK_CONVERSATIONS[0].user)
        setLoading(false)
        return
      }

      // Get all messages involving current user
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, username, full_name, avatar_url, is_verified, is_creator),
          receiver:receiver_id(id, username, full_name, avatar_url, is_verified, is_creator)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        // Group by conversation partner
        const convMap = new Map<string, Conversation>()
        data.forEach((msg: any) => {
          const partner = msg.sender_id === user.id ? msg.receiver : msg.sender
          if (!partner) return
          if (!convMap.has(partner.id)) {
            convMap.set(partner.id, {
              user: {
                id: partner.id,
                username: partner.username,
                full_name: partner.full_name,
                avatar_url: partner.avatar_url,
                bio: null,
                is_verified: partner.is_verified,
                is_creator: partner.is_creator,
                monthly_goal: 0,
                followers_count: 0,
                following_count: 0,
                created_at: '',
              },
              last_message: msg,
              unread_count: (!msg.read && msg.receiver_id === user.id) ? 1 : 0,
            })
          } else {
            const conv = convMap.get(partner.id)!
            if (!msg.read && msg.receiver_id === user.id) {
              conv.unread_count++
            }
          }
        })
        setConversations(Array.from(convMap.values()))
        setActiveUser(Array.from(convMap.values())[0]?.user ?? null)
      } else {
        setConversations(MOCK_CONVERSATIONS)
        setActiveUser(MOCK_CONVERSATIONS[0].user)
      }
      setLoading(false)
    }

    loadConversations()
  }, [user])

  const filtered = conversations.filter(c =>
    c.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Conversations list */}
      <div className={cn(
        'w-full md:w-72 flex-shrink-0 border-r border-white/5 bg-surface-2 flex flex-col',
        activeUser ? 'hidden md:flex' : 'flex'
      )}>
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary">Messages</h2>
          <button className="w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
            <Edit size={16} />
          </button>
        </div>

        <div className="px-3 py-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-surface-3 border border-white/5 rounded-xl pl-8 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-10 h-10 bg-zinc-800 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-zinc-800 rounded w-28" />
                  <div className="h-2.5 bg-zinc-800 rounded w-40" />
                </div>
              </div>
            ))
          ) : filtered.map(conv => (
            <motion.button
              key={conv.user.id}
              whileHover={{ x: 2 }}
              onClick={() => setActiveUser(conv.user)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 transition-colors text-left',
                activeUser?.id === conv.user.id ? 'bg-violet-500/10' : 'hover:bg-white/3'
              )}
            >
              <Avatar src={conv.user.avatar_url} name={conv.user.full_name} size="md" online={conv.user.id === '1'} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary truncate">{conv.user.full_name}</p>
                  <p className="text-[10px] text-text-muted flex-shrink-0 ml-1">
                    {conv.last_message ? timeAgo(conv.last_message.created_at) : ''}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-muted truncate">{conv.last_message?.content}</p>
                  {conv.unread_count > 0 && (
                    <span className="ml-1 flex-shrink-0 w-4 h-4 bg-violet-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className={cn('flex-1 flex flex-col', !activeUser ? 'hidden md:flex' : 'flex')}>
        {activeUser ? (
          <ChatWindow
            user={activeUser}
            currentUserId={user?.id}
            onBack={() => setActiveUser(null)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-4">
              <Edit size={28} className="text-violet-400" />
            </div>
            <p className="text-text-primary font-semibold">Sélectionnez une conversation</p>
            <p className="text-text-muted text-sm mt-1">Ou commencez une nouvelle discussion</p>
          </div>
        )}
      </div>
    </div>
  )
}
