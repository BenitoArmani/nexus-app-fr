'use client'
import { Hash, Volume2, Megaphone, ChevronDown, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_CHANNELS } from '@/lib/mock-data'
import type { Server, Channel } from '@/types'

const CHANNEL_ICONS = {
  text: Hash,
  voice: Volume2,
  announcement: Megaphone,
}

interface ChannelListProps {
  server: Server
  activeChannel: Channel | null
  onSelect: (channel: Channel) => void
}

export default function ChannelList({ server, activeChannel, onSelect }: ChannelListProps) {
  const channels = MOCK_CHANNELS.filter(c => c.server_id === server.id)
  const textChannels = channels.filter(c => c.type === 'text' || c.type === 'announcement')
  const voiceChannels = channels.filter(c => c.type === 'voice')

  return (
    <div className="flex flex-col h-full w-48 bg-surface-2 border-r border-white/5">
      {/* Server header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <h3 className="text-sm font-bold text-text-primary truncate">{server.name}</h3>
        <ChevronDown size={14} className="text-text-muted flex-shrink-0" />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Text channels */}
        <div>
          <p className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Salons textuels
          </p>
          {textChannels.map(ch => {
            const Icon = CHANNEL_ICONS[ch.type]
            return (
              <button
                key={ch.id}
                onClick={() => onSelect(ch)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm transition-colors text-left',
                  activeChannel?.id === ch.id
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                )}
              >
                <Icon size={14} />
                {ch.name}
              </button>
            )
          })}
        </div>

        {/* Voice channels */}
        {voiceChannels.length > 0 && (
          <div>
            <p className="px-2 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Salons vocaux
            </p>
            {voiceChannels.map(ch => (
              <button
                key={ch.id}
                onClick={() => onSelect(ch)}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm transition-colors text-left',
                  activeChannel?.id === ch.id
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                )}
              >
                <Volume2 size={14} />
                {ch.name}
                <span className="ml-auto text-xs text-emerald-400 font-semibold">3</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User strip */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-white/5 bg-bg-primary">
        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs">M</div>
        <span className="text-xs text-text-muted flex-1 truncate">Moi (Demo)</span>
        <Settings size={12} className="text-text-muted hover:text-text-primary cursor-pointer" />
      </div>
    </div>
  )
}
