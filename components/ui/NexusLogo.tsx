'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface NexusLogoProps {
  size?: number
  showText?: boolean
  animate?: boolean
  href?: string
}

export function NexusHexIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagon — violet fill so it's visible on any dark bg */}
      <polygon
        points="20,2 36,11 36,29 20,38 4,29 4,11"
        fill="#2d1060"
        stroke="#8b5cf6"
        strokeWidth="2"
      />

      {/* N letter — white bold */}
      <path
        d="M13 27V13L22 25V13M22 25V27"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top dot — violet */}
      <circle cx="20" cy="2" r="2.5" fill="#8b5cf6" />

      {/* Bottom dot — cyan */}
      <circle cx="20" cy="38" r="2.5" fill="#06b6d4" />
    </svg>
  )
}

export default function NexusLogo({ size = 40, showText = true, animate = true, href = '/feed' }: NexusLogoProps) {
  const inner = (
    <div className="flex items-center gap-3">
      {animate ? (
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <NexusHexIcon size={size} />
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
            style={{ borderRadius: '30%' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              animate={{ x: ['-140%', '220%'] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 5, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        </motion.div>
      ) : (
        <NexusHexIcon size={size} />
      )}

      {showText && (
        <span className="relative hidden lg:block overflow-hidden">
          <span
            className="font-black text-xl tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            NEXUS
          </span>
          {animate && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 5, ease: [0.25, 0.1, 0.25, 1] }}
            />
          )}
        </span>
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{inner}</Link>
  }
  return inner
}
