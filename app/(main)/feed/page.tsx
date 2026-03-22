'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Users, Search } from 'lucide-react'
import Stories from '@/components/feed/Stories'
import PostComposer from '@/components/feed/PostComposer'
import PostCard from '@/components/feed/PostCard'
import SearchModal from '@/components/ui/SearchModal'
import StockWidget from '@/components/markets/StockWidget'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { usePosts } from '@/hooks/usePosts'
import { useEarnings } from '@/hooks/useEarnings'
import { useAuth } from '@/hooks/useAuth'
import { MOCK_USERS } from '@/lib/mock-data'
import { formatNumber, formatEuro } from '@/lib/utils'
import { StreakWidget } from '@/components/ui/StreakWidget'
import { MissionsWidget } from '@/components/ui/MissionsWidget'
import { LeaderboardWidget } from '@/components/ui/LeaderboardWidget'
import RewardedAd from '@/components/ui/RewardedAd'
import { useUserProfile } from '@/hooks/useUserProfile'
import PredictionsFeedCard from '@/components/feed/PredictionsFeedCard'
import { FeedSkeleton } from '@/components/ui/Skeleton'
import AdUnit from '@/components/ui/AdUnit'
import Link from 'next/link'

const TABS = ['Pour toi', 'Abonnements', 'Tendances']

export default function FeedPage() {
  const { posts, toggleLike, addPost, loading: postsLoading } = usePosts()
  const { totalMonth } = useEarnings()
  const { user } = useAuth()
  const { needsOnboarding, profileData, profile } = useUserProfile()
  const [activeTab, setActiveTab] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <div className="flex xl:max-w-[960px] xl:mx-auto">
        {/* Main feed */}
        <div className="flex-1 min-w-0 max-w-[600px] border-x border-white/5">
          {/* Onboarding banner */}
          {needsOnboarding && (
            <Link href="/onboarding">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-violet-600/20 to-cyan-600/10 border-b border-violet-500/20 px-4 py-3 flex items-center gap-3 hover:from-violet-600/30 transition-colors cursor-pointer"
              >
                <span className="text-2xl">✨</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">Personnalise NEXUS pour toi</p>
                  <p className="text-xs text-zinc-400">Dis-nous qui tu es → on adapte tout automatiquement</p>
                </div>
                <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">2 min →</span>
              </motion.div>
            </Link>
          )}

          {/* Profile missions banner (if onboarding done) */}
          {!needsOnboarding && profile.type !== 'other' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`border-b border-white/5 px-4 py-2 flex items-center gap-2 text-xs ${profileData.color}`}
            >
              <span>{profileData.emoji}</span>
              <span className="font-semibold">{profileData.label}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{profileData.tagline}</span>
            </motion.div>
          )}

          {/* Stories */}
          <motion.section
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-2 border-b border-white/5 p-4"
          >
            <Stories />
          </motion.section>

          {/* Composer */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="border-b border-white/5"
          >
            <PostComposer onPost={addPost} />
          </motion.div>

          {/* Tabs — sticky */}
          <div className="sticky top-0 z-20 bg-bg-primary/95 backdrop-blur-xl border-b border-white/5 flex px-4">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === i
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}
                {activeTab === i && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Posts — skeleton during load, then real content */}
          {postsLoading ? (
            <FeedSkeleton />
          ) : activeTab === 0 ? (
            /* Pour toi */
            <div className="divide-y divide-white/5">
              {posts.map((post, i) => (
                <React.Fragment key={post.id}>
                  <PostCard post={post} onLike={toggleLike} />
                  {i === 2 && <PredictionsFeedCard />}
                  {(i + 1) % 5 === 0 && (
                    <div className="px-4 py-3 border-b border-white/5">
                      <AdUnit
                        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED ?? 'feed-slot'}
                        format="auto"
                        className="w-full"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : activeTab === 1 ? (
            /* Abonnements — subset of posts simulating followed creators */
            <div className="divide-y divide-white/5">
              {posts.slice(0, 4).map((post) => (
                <PostCard key={post.id} post={post} onLike={toggleLike} />
              ))}
              {posts.length === 0 && (
                <div className="text-center py-20 text-zinc-500">
                  <p className="text-base font-semibold text-white mb-2">Personne à suivre ?</p>
                  <p className="text-sm mb-4">Abonne-toi à des créateurs pour voir leur contenu ici.</p>
                  <a href="/explore" className="text-violet-400 hover:text-violet-300 text-sm font-semibold">Explorer les créateurs →</a>
                </div>
              )}
            </div>
          ) : (
            /* Tendances */
            <div className="p-4 space-y-4">
              {/* Trending tags */}
              <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
                {['#CreateursFR', '#NexusTech', '#MusiqueFR', '#Gaming2025', '#Bitcoin', '#Lifestyle'].map(tag => (
                  <a key={tag} href={`/explore?tag=${tag.slice(1)}`}
                    className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium rounded-full hover:bg-violet-500/20 transition-colors">
                    {tag}
                  </a>
                ))}
              </div>
              {/* Hot posts — sorted by likes */}
              {[...posts].sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)).map((post) => (
                <PostCard key={post.id} post={post} onLike={toggleLike} />
              ))}
            </div>
          )}
        </div>

        {/* Right panel — xl+ only */}
        <aside className="hidden xl:block w-[340px] flex-shrink-0 ml-8 py-6 space-y-4 sticky top-0 h-screen overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Search */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 bg-surface-2 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-sm text-text-muted hover:border-violet-500/30 transition-colors relative"
            >
              <Search size={15} className="absolute left-4 text-text-muted" />
              Rechercher...
            </button>
          </motion.div>

          {/* Earnings widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="bg-gradient-to-br from-emerald-600/15 to-violet-600/10 border border-emerald-500/20 rounded-2xl p-4"
          >
            <p className="text-xs text-text-muted mb-1">Gains ce mois</p>
            <p className="text-2xl font-black text-emerald-400">{formatEuro(totalMonth)}</p>
            <p className="text-xs text-text-muted mt-1">↑ +12% vs mois dernier</p>
          </motion.div>

          {/* Rewarded ad */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}>
            <RewardedAd />
          </motion.div>

          {/* AdSense sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.19 }}>
            <AdUnit
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? 'sidebar-slot'}
              format="rectangle"
              className="w-full"
            />
          </motion.div>

          {/* Stock market widget */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <StockWidget />
          </motion.div>

          {/* Predictions teaser */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.21 }}>
            <a href="/predictions" className="block bg-gradient-to-br from-violet-600/15 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-4 hover:border-violet-500/40 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔮</span>
                <h3 className="text-sm font-bold text-text-primary">Prédictions du moment</h3>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-zinc-300 font-medium">GTA 6 sort avant 2026 ?</div>
                <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                  <div className="bg-emerald-500 rounded-l-full" style={{ width: '78%' }} />
                  <div className="bg-rose-500 rounded-r-full" style={{ width: '22%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>OUI 78%</span><span>NON 22%</span>
                </div>
              </div>
              <p className="text-xs text-violet-400 font-semibold mt-2">Voir toutes les prédictions →</p>
            </a>
          </motion.div>

          {/* Streak widget */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
            <StreakWidget userId={user?.id ?? null} />
          </motion.div>

          {/* Missions widget */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
            <MissionsWidget userId={user?.id ?? null} />
          </motion.div>

          {/* Leaderboard widget */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
            <LeaderboardWidget />
          </motion.div>

          {/* Trending */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-surface-2 border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-violet-400" />
              <h3 className="text-sm font-bold text-text-primary">Tendances</h3>
            </div>
            <div className="space-y-1">
              {[
                { tag: '#CreateursFR', width: 85 },
                { tag: '#NexusTech',   width: 72 },
                { tag: '#MusiqueFR',   width: 58 },
                { tag: '#Lifestyle',   width: 44 },
                { tag: '#Gaming',      width: 33 },
              ].map(({ tag, width }, i) => (
                <div key={tag} className="relative flex items-center justify-between px-2 py-1.5 rounded-xl cursor-pointer overflow-hidden group">
                  {/* Progress bar background */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 bg-violet-500/8 rounded-xl"
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                  />
                  <span className="text-sm text-violet-400 font-medium relative z-10">{tag}</span>
                  <span className="text-xs text-text-muted relative z-10">{formatNumber((i + 1) * 8500 + 1000)} posts</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-surface-2 border border-white/5 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-text-primary">Suggestions</h3>
            </div>
            <div className="space-y-3">
              {MOCK_USERS.slice(0, 3).map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar src={user.avatar_url} name={user.full_name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium text-text-primary truncate">{user.full_name}</p>
                      {user.is_verified && <Badge variant="verified" className="!px-1">✓</Badge>}
                    </div>
                    <p className="text-xs text-text-muted">{formatNumber(user.followers_count)} abonnés</p>
                  </div>
                  <button className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                    Suivre
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nexus Premium promo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-violet-600/20 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-4"
          >
            <Sparkles size={20} className="text-violet-400 mb-2" />
            <h3 className="text-sm font-bold text-text-primary mb-1">Devenez Créateur Pro</h3>
            <p className="text-xs text-text-muted mb-3">Monétisez vos contenus et atteignez vos objectifs.</p>
            <button className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors">
              Activer le mode Créateur
            </button>
          </motion.div>
        </aside>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
