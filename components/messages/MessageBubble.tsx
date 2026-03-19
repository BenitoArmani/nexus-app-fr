import { cn } from '@/lib/utils'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
        isOwn
          ? 'bg-violet-600 text-white rounded-tr-sm'
          : 'bg-surface-2 text-text-primary border border-white/5 rounded-tl-sm'
      )}>
        <p>{message.content}</p>
        <p className={cn('text-[10px] mt-1', isOwn ? 'text-white/60 text-right' : 'text-text-muted')}>{time}</p>
      </div>
    </div>
  )
}
