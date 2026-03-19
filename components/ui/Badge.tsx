import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'verified' | 'live' | 'premium' | 'creator' | 'new'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'verified', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
      {
        'bg-violet-500/20 text-violet-300 border border-violet-500/30': variant === 'verified',
        'bg-rose-500 text-white animate-pulse': variant === 'live',
        'bg-amber-500/20 text-amber-300 border border-amber-500/30': variant === 'premium',
        'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30': variant === 'creator',
        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30': variant === 'new',
      },
      className
    )}>
      {variant === 'verified' && '✓'}
      {children}
    </span>
  )
}
