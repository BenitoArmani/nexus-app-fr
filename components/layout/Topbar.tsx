'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import SearchModal from '@/components/ui/SearchModal'
import NotificationToast from '@/components/ui/NotificationToast'
import NexusLogo from '@/components/ui/NexusLogo'
import { useAuth } from '@/hooks/useAuth'
import { useGlyphs } from '@/hooks/useGlyphs'

export default function Topbar() {
  const { user } = useAuth()
  const { balance } = useGlyphs()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-bg-primary/90 backdrop-blur-xl border-b border-white/5 flex items-center px-4 gap-3 md:hidden">
        {/* Logo */}
        <NexusLogo size={32} showText animate href="/feed" />

        {/* Search bar (opens modal) */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 bg-surface-2 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-sm text-text-muted hover:border-violet-500/30 transition-colors relative"
          >
            <Search size={15} className="absolute left-3 text-text-muted" />
            Rechercher...
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Link href="/glyphs">
            <span className="hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 hover:bg-violet-500/20 transition-colors">
              <span>⬡</span>
              {balance.toLocaleString('fr-FR')}
            </span>
          </Link>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </Button>
          <Link href="/messages">
            <Button variant="ghost" size="icon">
              <MessageCircle size={18} />
            </Button>
          </Link>
          {user && (
            <Link href={`/profile/${user.username}`}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
              </motion.div>
            </Link>
          )}
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationToast open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  )
}
