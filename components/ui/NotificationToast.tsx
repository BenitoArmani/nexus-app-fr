'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, Coins, X } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { MOCK_USERS } from '@/lib/mock-data'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'tip' | 'message'
  message: string
  user?: typeof MOCK_USERS[0]
  time: string
}

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like',    message: 'a aimé votre post',              user: MOCK_USERS[0],  time: 'À l\'instant'   },
  { id: 'n2', type: 'comment', message: 'a commenté : "Super contenu !"', user: MOCK_USERS[5],  time: 'Il y a 1 min'   },
  { id: 'n3', type: 'follow',  message: 'vous suit maintenant',            user: MOCK_USERS[1],  time: 'Il y a 3 min'   },
  { id: 'n4', type: 'tip',     message: 'vous a envoyé 5,00€',             user: MOCK_USERS[2],  time: 'Il y a 5 min'   },
  { id: 'n5', type: 'like',    message: 'a aimé votre photo',              user: MOCK_USERS[10], time: 'Il y a 8 min'   },
  { id: 'n6', type: 'follow',  message: 'vous suit maintenant',            user: MOCK_USERS[6],  time: 'Il y a 12 min'  },
  { id: 'n7', type: 'message', message: 'vous a envoyé un message',        user: MOCK_USERS[3],  time: 'Il y a 20 min'  },
  { id: 'n8', type: 'comment', message: 'a commenté : "Continue comme ça"', user: MOCK_USERS[9], time: 'Il y a 1h'     },
]

const NOTIF_ICONS = {
  like: { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  comment: { icon: MessageCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  follow: { icon: UserPlus, color: 'text-violet-400', bg: 'bg-violet-500/20' },
  tip: { icon: Coins, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  message: { icon: MessageCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
}

interface NotificationToastProps {
  open: boolean
  onClose: () => void
}

export default function NotificationToast({ open, onClose }: NotificationToastProps) {
  const [notifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed right-0 top-14 bottom-0 w-80 bg-bg-primary border-l border-white/5 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
              <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.map((n, i) => {
                const cfg = NOTIF_ICONS[n.type]
                const Icon = cfg.icon
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 cursor-pointer"
                  >
                    <div className="relative">
                      <Avatar src={n.user?.avatar_url} name={n.user?.full_name || ''} size="sm" />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${cfg.bg} flex items-center justify-center`}>
                        <Icon size={9} className={cfg.color} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary">
                        <span className="font-semibold">{n.user?.username}</span>{' '}{n.message}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">{n.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="p-4 border-t border-white/5">
              <button className="w-full text-xs text-text-muted hover:text-text-primary transition-colors">
                Tout marquer comme lu
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
