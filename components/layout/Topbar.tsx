'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Avatar from '@/components/ui/Avatar'
import SearchModal from '@/components/ui/SearchModal'
import NotificationToast from '@/components/ui/NotificationToast'
import NexusLogo from '@/components/ui/NexusLogo'
import { useAuth } from '@/hooks/useAuth'
import { useGlyphs } from '@/hooks/useGlyphs'
import { useNotifications } from '@/hooks/useNotifications'

function vibrate(ms = 8) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms)
}

export default function Topbar() {
  const { user }                                    = useAuth()
  const { balance }                                 = useGlyphs()
  const { notifications, unreadCount, markAllRead } = useNotifications(user?.id ?? null)
  const [searchOpen, setSearchOpen]                 = useState(false)
  const [notifOpen, setNotifOpen]                   = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#0F0F17]/92 backdrop-blur-2xl border-b border-white/[0.05] flex items-center px-3 gap-2.5 md:hidden" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(56px + env(safe-area-inset-top, 0px))' }}>
        <NexusLogo size={30} showText animate href="/feed" />

        {/* Search bar */}
        <button
          onClick={() => { setSearchOpen(true); vibrate() }}
          className="flex-1 flex items-center gap-2 bg-white/[0.05] border border-white/[0.06] rounded-2xl pl-3 pr-3 py-2 text-sm text-zinc-500 hover:border-violet-500/30 transition-colors relative min-w-0"
        >
          <Search size={13} className="shrink-0 text-zinc-600" />
          <span className="truncate text-xs">Rechercher...</span>
        </button>

        {/* GLYPHS — toujours visible */}
        <Link href="/glyphs" onClick={() => vibrate()}>
          <motion.div
            whileTap={{ scale: 0.92 }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl"
          >
            <span className="text-violet-400 text-xs font-black">⬡</span>
            <span className="text-xs font-black text-violet-400">{balance >= 1000 ? `${(balance/1000).toFixed(1)}k` : balance.toLocaleString('fr-FR')}</span>
          </motion.div>
        </Link>

        {/* Notifs */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => { setNotifOpen(!notifOpen); vibrate() }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.05] text-zinc-400"
        >
          <Bell size={16} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-black text-white flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Avatar */}
        {user && (
          <Link href={`/profile/${user.username}`} onClick={() => vibrate()}>
            <motion.div whileTap={{ scale: 0.92 }}>
              <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
            </motion.div>
          </Link>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationToast
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
      />
    </>
  )
}
