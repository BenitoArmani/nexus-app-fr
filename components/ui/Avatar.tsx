'use client'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
  className?: string
}

const sizeMap = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 }
const sizeClass = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
}

function getDiceBearUrl(seed: string, px: number) {
  const s = encodeURIComponent(seed.toLowerCase().replace(/\s+/g, '-'))
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${s}&size=${px}&backgroundColor=1a0a2e,0f172a,1e1b4b&shapeColor=7c3aed,8b5cf6,0891b2,22d3ee`
}

export default function Avatar({ src, name, size = 'md', online, className }: AvatarProps) {
  const px = sizeMap[size]
  const [srcError, setSrcError] = useState(false)

  const imgSrc = (src && !srcError) ? src : getDiceBearUrl(name, px * 2)

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div className={cn('rounded-full overflow-hidden bg-violet-950 flex items-center justify-center', sizeClass[size])}>
        <Image
          src={imgSrc}
          alt={name}
          width={px}
          height={px}
          className="object-cover w-full h-full"
          unoptimized
          onError={() => setSrcError(true)}
        />
      </div>
      {online !== undefined && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-bg-primary',
          size === 'xs' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5',
          online ? 'bg-emerald-400' : 'bg-gray-500',
        )} />
      )}
    </div>
  )
}
