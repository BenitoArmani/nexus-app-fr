'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, Coins, Bell, X, CheckCheck } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { AppNotification } from '@/hooks/useNotifications'

const NOTIF_ICONS: Record<string, { icon: typeof Heart; color: string; bg: string }> = {
  like:    { icon: Heart,          color: 'text-rose-400',    bg: 'bg-rose-500/20'    },
  comment: { icon: MessageCircle,  color: 'text-cyan-400',    bg: 'bg-cyan-500/20'    },
  follow:  { icon: UserPlus,       color: 'text-violet-400',  bg: 'bg-violet-500/20'  },
  tip:     { icon: Coins,          color: 'text-amber-400',   bg: 'bg-amber-500/20'   },
  message: { icon: MessageCircle,  color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  default: { icon: Bell,           color: 'text-zinc-400',    bg: 'bg-zinc-500/20'    },
}

interface Props {
  open:           boolean
  onClose:        () => void
  notifications:  AppNotification[]
  unreadCount:    number
  onMarkAllRead:  () => void
}

export default function NotificationToast({ open, onClose, notifications, unreadCount, onMarkAllRead }: Props) {
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
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] font-black rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
                  <Bell size={28} className="opacity-30" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                notifications.map((n, i) => {
                  const cfg = NOTIF_ICONS[n.type] ?? NOTIF_ICONS.default
                  const Icon = cfg.icon
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors ${!n.read ? 'bg-violet-500/5' : ''}`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center">
                          <Icon size={14} className={cfg.color} />
                        </div>
                        {!n.read && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-primary font-semibold leading-snug">{n.title}</p>
                        {n.body && <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{n.body}</p>}
                        <p className="text-[10px] text-zinc-600 mt-1">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {unreadCount > 0 && (
              <div className="p-4 border-t border-white/5">
                <button
                  onClick={onMarkAllRead}
                  className="w-full flex items-center justify-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors font-semibold"
                >
                  <CheckCheck size={13} /> Tout marquer comme lu
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
