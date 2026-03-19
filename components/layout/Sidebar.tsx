'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Play, MessageCircle, Hash, TrendingUp, Settings, LogOut, PlusCircle,
  Coins, Gamepad2, BookOpen, BarChart2, Award, Calendar, HelpCircle, Users,
  Shield, Tv2, AlarmClock, Trophy, Sparkles, Map, Star, Compass, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import NexusLogo from '@/components/ui/NexusLogo'
import { useAuth } from '@/hooks/useAuth'
import { useEarnings } from '@/hooks/useEarnings'
import { useGlyphs } from '@/hooks/useGlyphs'
import { useUserProfile } from '@/hooks/useUserProfile'
import { cn, formatEuro } from '@/lib/utils'

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { href: '/feed',     icon: Home,          label: 'Accueil'      },
      { href: '/explore',  icon: Compass,       label: 'Explorer'     },
      { href: '/reels',    icon: Play,          label: 'Reels'        },
      { href: '/messages', icon: MessageCircle, label: 'Messages', badge: 3 },
      { href: '/servers',  icon: Hash,          label: 'Serveurs'     },
    ],
  },
  {
    label: 'Finance & Marchés',
    items: [
      { href: '/earnings',    icon: TrendingUp, label: 'Gains 💰'         },
      { href: '/markets',     icon: BarChart2,  label: 'Marchés 📈'       },
      { href: '/predictions', icon: Sparkles,   label: 'Prédictions 🔮'   },
      { href: '/betting',     icon: Coins,      label: 'Paris 🎰'         },
    ],
  },
  {
    label: 'Créateurs',
    items: [
      { href: '/glyphs',        icon: Sparkles,  label: 'GLYPHS ⬡'        },
      { href: '/subscribe',     icon: Star,      label: 'Abonnements ⭐'   },
      { href: '/analytics',     icon: BarChart2, label: 'Analytics 📊'     },
      { href: '/golden-nugget', icon: Trophy,    label: 'Golden Nugget 🏆' },
      { href: '/scheduled',     icon: AlarmClock,label: 'Programmés 🗓'    },
    ],
  },
  {
    label: 'Communauté',
    items: [
      { href: '/gaming',     icon: Gamepad2,  label: 'Gaming 🎮'          },
      { href: '/education',  icon: BookOpen,  label: 'Éducation 📚'       },
      { href: '/watchparty', icon: Tv2,       label: 'Watch Party 🎬'     },
      { href: '/events',     icon: Calendar,  label: 'Événements 📅'      },
      { href: '/loyalty',    icon: Award,     label: 'Fidélité 🏅'        },
      { href: '/roadmap',    icon: Map,       label: 'Roadmap 🗺️'         },
      { href: '/invite',     icon: Users,     label: 'Inviter 🎁'         },
      { href: '/coins',      icon: Coins,     label: 'Acheter Coins'      },
    ],
  },
  {
    label: 'Paramètres',
    items: [
      { href: '/support',     icon: HelpCircle, label: 'Support 💬'   },
      { href: '/security',    icon: Shield,     label: 'Sécurité 🛡️'  },
      { href: '/preferences', icon: Settings,   label: 'Préférences ⚙️' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { totalMonth } = useEarnings()
  const { balance } = useGlyphs()
  const { profileData } = useUserProfile()
  const [liveEarnings, setLiveEarnings] = useState(totalMonth)

  // Start all groups open except last two
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(NAV_GROUPS.map((_, i) => [i, i < 3]))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveEarnings(prev => +(prev + 0.02).toFixed(2))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  const toggleGroup = (i: number) => {
    setOpenGroups(prev => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 hidden md:flex flex-col w-16 lg:w-[240px] bg-bg-primary border-r border-white/5 py-4 overflow-y-auto z-30 transition-[width] duration-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Logo */}
      <div className="px-3 lg:px-4 mb-6">
        <NexusLogo size={38} showText href="/feed" animate />
      </div>

      {/* Create post */}
      <div className="px-2 lg:px-4 mb-6">
        <Link href="/feed?compose=true">
          <motion.div
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 rounded-2xl py-3 px-2 lg:px-4 font-bold text-white flex items-center justify-center lg:justify-start gap-2 transition-opacity cursor-pointer"
          >
            <PlusCircle size={18} className="flex-shrink-0" />
            <span className="hidden lg:block">Créer un post</span>
          </motion.div>
        </Link>
      </div>

      {/* Navigation — grouped */}
      <nav className="px-2 flex-1">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label} className="mb-2">
            {/* Group header (lg only) */}
            <button
              onClick={() => toggleGroup(gi)}
              className="hidden lg:flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-wider hover:text-zinc-400 transition-colors"
            >
              {group.label}
              <ChevronDown
                size={12}
                className={cn('transition-transform duration-200', openGroups[gi] ? 'rotate-0' : '-rotate-90')}
              />
            </button>

            <AnimatePresence initial={false}>
              {(openGroups[gi] !== false) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {group.items.map(item => {
                    const active = pathname.startsWith(item.href)
                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          whileHover={{ x: 3, scale: 1.02 }} whileTap={{ scale: 0.96 }}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-medium transition-all mb-0.5 relative',
                            active
                              ? 'bg-violet-500/15 text-violet-400'
                              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                          )}
                        >
                          {active && (
                            <motion.div
                              layoutId="sidebar-indicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full"
                            />
                          )}
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className="flex-shrink-0 relative"
                          >
                            <item.icon size={18} />
                            {item.badge && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full lg:hidden" />
                            )}
                          </motion.div>
                          <span className="hidden lg:block">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden lg:block">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* GLYPHS widget */}
      <div className="px-2 mb-3 space-y-1.5">
        <div className="hidden lg:block px-3 py-2 rounded-[14px] bg-surface-2 border border-white/5">
          <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">{profileData.avgEarningsDetail}</p>
        </div>

        <Link href="/glyphs">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-[14px] bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15 transition-colors cursor-pointer"
          >
            <span className="text-violet-400 text-lg flex-shrink-0">⬡</span>
            <div className="hidden lg:block min-w-0 flex-1">
              <p className="text-xs text-zinc-400">GLYPHS</p>
              <p className="text-sm font-black text-violet-400">{balance.toLocaleString('fr-FR')}</p>
            </div>
            <span className="hidden lg:block text-[9px] font-semibold text-violet-500/60 bg-violet-500/10 rounded-full px-1.5 py-0.5">Gérer</span>
          </motion.div>
        </Link>
      </div>

      {/* User + signout */}
      <div className="px-2 border-t border-white/5 pt-4 mt-2">
        {user && (
          <Link href={`/profile/${user.username}`}>
            <div className="px-1 lg:px-2 py-2 mb-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Avatar src={user.avatar_url} name={user.full_name} size="sm" online />
                <div className="hidden lg:block min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-text-primary truncate">{user.full_name}</p>
                    {user.is_verified && <Badge variant="verified">Pro</Badge>}
                  </div>
                  <p className="text-xs text-text-muted truncate">@{user.username}</p>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5 flex items-center gap-1.5">
                    <span className="relative flex w-1.5 h-1.5 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    {formatEuro(liveEarnings)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}

        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary transition-all">
            <Settings size={18} className="flex-shrink-0" />
            <span className="hidden lg:block">Paramètres</span>
          </div>
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-sm font-medium text-text-secondary hover:bg-rose-500/10 hover:text-rose-400 transition-all"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span className="hidden lg:block">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
