'use client'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_SERVERS } from '@/lib/mock-data'
import type { Server } from '@/types'

interface ServerSidebarProps {
  activeServer: Server | null
  onSelect: (server: Server) => void
}

export default function ServerSidebar({ activeServer, onSelect }: ServerSidebarProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-4 px-2 w-16 bg-bg-primary border-r border-white/5 h-full overflow-y-auto">
      {MOCK_SERVERS.map(server => (
        <motion.button
          key={server.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(server)}
          title={server.name}
          className={cn(
            'w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all relative',
            activeServer?.id === server.id
              ? 'bg-violet-500/30 ring-2 ring-violet-500 rounded-xl'
              : 'bg-surface-2 hover:bg-violet-500/20 hover:rounded-xl'
          )}
        >
          {activeServer?.id === server.id && (
            <motion.div
              layoutId="server-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-500 -translate-x-2 rounded-r-full"
            />
          )}
          {server.icon}
        </motion.button>
      ))}

      <div className="w-8 h-px bg-white/10 my-1" />

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="w-11 h-11 rounded-2xl bg-surface-2 hover:bg-emerald-500/20 flex items-center justify-center text-text-muted hover:text-emerald-400 transition-colors"
      >
        <Plus size={20} />
      </motion.button>
    </div>
  )
}
