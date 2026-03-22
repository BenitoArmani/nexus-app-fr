'use client'
import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Search, Flame, Compass, Users, Hash, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { useSearchParams } from 'next/navigation'
import { MOCK_USERS, MOCK_POSTS } from '@/lib/mock-data'
import { formatNumber, timeAgo } from '@/lib/utils'

const TRENDING_TAGS = [
  { tag: 'CreateursFR',  posts: 43500, hot: true  },
  { tag: 'NexusTech',    posts: 31200, hot: true  },
  { tag: 'MusiqueFR',    posts: 27800, hot: false },
  { tag: 'Gaming2025',   posts: 22100, hot: false },
  { tag: 'Bitcoin',      posts: 19400, hot: false },
  { tag: 'Lifestyle',    posts: 17600, hot: false },
  { tag: 'FitnessFR',    posts: 14300, hot: false },
  { tag: 'IndieDev',     posts: 11900, hot: false },
  { tag: 'CryptoDeFi',   posts: 9800,  hot: false },
  { tag: 'TravelFR',     posts: 8700,  hot: false },
  { tag: 'DesignUI',     posts: 7200,  hot: false },
  { tag: 'StartupLife',  posts: 5400,  hot: false },
]

const TOP_CREATORS = MOCK_USERS.filter(u => u.is_creator).sort((a, b) => b.followers_count - a.followers_count).slice(0, 6)

function ExploreContent() {
  const searchParams = useSearchParams()
  const tagParam = searchParams.get('tag')
  const [query, setQuery] = useState(tagParam ? `#${tagParam}` : '')
  const [activeFilter, setActiveFilter] = useState<'all' | 'people' | 'posts' | 'tags'>('all')

  const filteredUsers = MOCK_USERS.filter(u =>
    !query || u.full_name.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase())
  )
  const filteredPosts = MOCK_POSTS.filter(p =>
    !query || p.content.toLowerCase().includes(query.replace('#', '').toLowerCase())
  )

  const showResults = query.length > 0

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sticky search bar */}
      <div className="sticky top-0 z-20 bg-bg-primary/95 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher créateurs, posts, hashtags..."
            className="w-full bg-zinc-800/70 border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/40 transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">✕</button>
          )}
        </div>

        {showResults && (
          <div className="flex gap-2 mt-2">
            {(['all', 'people', 'posts', 'tags'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  activeFilter === f ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {{ all: 'Tout', people: 'Personnes', posts: 'Posts', tags: 'Tags' }[f]}
              </button>
            ))}
          </div>
        )}
      </div>

      {showResults ? (
        /* ---------- Search results ---------- */
        <div className="p-4 space-y-6">
          {(activeFilter === 'all' || activeFilter === 'people') && filteredUsers.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users size={12} /> Personnes
              </h2>
              <div className="space-y-2">
                {filteredUsers.slice(0, 5).map((user, i) => (
                  <motion.div key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link href={`/profile/${user.username}`}>
                      <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors">
                        <Avatar src={user.avatar_url} name={user.full_name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-white truncate">{user.full_name}</span>
                            {user.is_verified && <Badge variant="verified">✓</Badge>}
                          </div>
                          <p className="text-xs text-zinc-500">@{user.username} · {formatNumber(user.followers_count)} abonnés</p>
                        </div>
                        <button className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-full hover:bg-violet-500/20 transition-colors">
                          Suivre
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {(activeFilter === 'all' || activeFilter === 'tags') && (
            <section>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Hash size={12} /> Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.filter(t => !query || t.tag.toLowerCase().includes(query.replace('#', '').toLowerCase())).map(t => (
                  <Link key={t.tag} href={`/explore?tag=${t.tag}`}>
                    <span className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium rounded-full hover:bg-violet-500/20 transition-colors">
                      #{t.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(activeFilter === 'all' || activeFilter === 'posts') && filteredPosts.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles size={12} /> Posts
              </h2>
              <div className="space-y-3">
                {filteredPosts.slice(0, 4).map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar src={post.user?.avatar_url} name={post.user?.full_name || ''} size="xs" />
                      <Link href={`/profile/${post.user?.username}`} className="text-xs font-semibold text-zinc-300 hover:text-white">{post.user?.full_name}</Link>
                      <span className="text-xs text-zinc-600">· {timeAgo(post.created_at)}</span>
                    </div>
                    <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">{post.content}</p>
                    <p className="text-xs text-zinc-600 mt-2">❤️ {formatNumber(post.likes_count)} · 💬 {formatNumber(post.comments_count)}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {filteredUsers.length === 0 && filteredPosts.length === 0 && (
            <div className="text-center py-16 text-zinc-600">
              <Compass size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun résultat pour "{query}"</p>
            </div>
          )}
        </div>
      ) : (
        /* ---------- Discovery view ---------- */
        <div className="p-4 space-y-8">

          {/* Trending tags */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-violet-400" />
              <h2 className="text-sm font-bold text-white">Tendances du moment</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TRENDING_TAGS.slice(0, 8).map((t, i) => (
                <motion.div key={t.tag} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={`/explore?tag=${t.tag}`}>
                    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-violet-500/20 hover:bg-violet-500/5 transition-all cursor-pointer group">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-violet-400 group-hover:text-violet-300">#{t.tag}</span>
                          {t.hot && <Flame size={12} className="text-orange-400" />}
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5">{formatNumber(t.posts)} posts</p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center text-sm">
                        #{i + 1}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Top Creators */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Créateurs populaires</h2>
              </div>
              <Link href="/feed" className="text-xs text-violet-400 hover:text-violet-300">Voir tous →</Link>
            </div>
            <div className="space-y-2">
              {TOP_CREATORS.map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link href={`/profile/${user.username}`}>
                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors group">
                      <div className="relative">
                        <Avatar src={user.avatar_url} name={user.full_name} size="md" />
                        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-black text-zinc-400">
                          {i + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-white truncate">{user.full_name}</span>
                          {user.is_verified && <Badge variant="verified">✓</Badge>}
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{user.bio?.slice(0, 50)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-white">{formatNumber(user.followers_count)}</p>
                        <p className="text-[10px] text-zinc-600">abonnés</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Discover grid */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Compass size={16} className="text-emerald-400" />
              <h2 className="text-sm font-bold text-white">À découvrir</h2>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MOCK_POSTS.filter(p => p.media_url).map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="aspect-square rounded-xl overflow-hidden bg-zinc-800 cursor-pointer relative group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.media_url!} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-xs text-white font-semibold">❤️ {formatNumber(post.likes_count)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-40 text-zinc-500 text-sm">Chargement...</div>}>
      <ExploreContent />
    </Suspense>
  )
}

export default function ExplorePageWrapper() { return <Suspense><ExplorePage /></Suspense> }
