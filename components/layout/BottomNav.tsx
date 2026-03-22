'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Play, MessageCircle, Compass, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

function vibrate(ms = 8) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms)
}

export default function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const NAV_ITEMS = [
    { href: '/feed',    label: 'Accueil',  Icon: Home          },
    { href: '/reels',   label: 'Reels',    Icon: Play          },
    { href: '/messages',label: 'Messages', Icon: MessageCircle, badge: 3 },
    { href: '/explore', label: 'Explorer', Icon: Compass       },
    { href: user ? `/profile/${user.username}` : '/preferences', label: 'Profil', Icon: UserCircle },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0F0F17]/95 backdrop-blur-2xl border-t border-white/[0.06]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-around h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.label} href={item.href} className="flex-1" onClick={() => vibrate()}>
              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="flex flex-col items-center gap-1 py-1 relative"
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <div className="relative">
                  <motion.div
                    animate={active ? { scale: 1.1 } : { scale: 1 }}
                    className={cn(
                      'w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-200',
                      active ? 'bg-violet-500/15 text-violet-400' : 'text-zinc-500'
                    )}
                  >
                    <item.Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  </motion.div>
                  {item.badge && !active && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-rose-500 rounded-full text-[9px] font-black text-white flex items-center justify-center px-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-semibold transition-colors leading-none',
                  active ? 'text-violet-400' : 'text-zinc-600'
                )}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
