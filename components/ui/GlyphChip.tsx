'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlyphChipProps {
  amount: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

const sizeClasses = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-0.5',
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1',
  lg: 'text-base px-3 py-1.5 gap-1.5',
}

export default function GlyphChip({ amount, size = 'sm', animated = false, className }: GlyphChipProps) {
  return (
    <motion.span
      whileHover={animated ? { scale: 1.05 } : undefined}
      className={cn(
        'inline-flex items-center rounded-full font-bold',
        'bg-gradient-to-r from-violet-500/20 to-cyan-500/20',
        'border border-violet-500/30',
        'text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400',
        sizeClasses[size],
        className
      )}
    >
      <span className="text-violet-400">⬡</span>
      <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-black">
        {amount.toLocaleString('fr-FR')}
      </span>
    </motion.span>
  )
}
