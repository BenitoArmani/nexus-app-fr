'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Play, MessageCircle, Compass, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function BottomNav() {
  const pathname  = usePathname()
  const { user }  = useAuth()

  const NAV_ITEMS = [
    { href: '/feed',                          label: 'Accueil',  Icon: Home          },
    { href: '/reels',                         label: 'Reels',    Icon: Play          },
    { href: '/messages',                      label: 'Messages', Icon: MessageCircle, badge: 3 },
    { href: '/explore',                       label: 'Explorer', Icon: Compass       },
    { href: user ? `/profile/${user.username}` : '/preferences', label: 'Profil', Icon: UserCircle },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-bg-primary/98 backdrop-blur-2xl border-t border-white/[0.06] px-1 pb-safe">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.label} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center gap-1 py-1 relative"
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-violet-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <div className="relative">
                  <div className={cn(
                    'w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200',
                    active
                      ? 'bg-violet-500/15 text-violet-400 scale-110'
                      : 'text-zinc-500 hover:text-zinc-300'
                  )}>
                    <item.Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                  </div>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 rounded-full text-[9px] font-black text-white flex items-center justify-center px-1">
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
