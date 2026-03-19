'use client'
import { motion } from 'framer-motion'
import { Play, Trophy, Users, Heart, Eye, Gamepad2, Wifi, Plus } from 'lucide-react'
import Image from 'next/image'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useGaming } from '@/hooks/useGaming'
import { formatNumber, formatEuro } from '@/lib/utils'

export default function GamingPage() {
  const { gamePosts, tournaments, lfgPosts, activeTab, setActiveTab, selectedGame, setSelectedGame, games, toggleLike } = useGaming()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
            <Gamepad2 size={24} className="text-violet-400" /> Gaming Hub
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Clips, streams, tournois et recherche d&apos;équipe</p>
        </div>
        <Button size="sm">
          <Wifi size={14} className="text-rose-400" /> Go Live
        </Button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'clips', label: '🎬 Clips & Lives' },
          { id: 'tournaments', label: '🏆 Tournois' },
          { id: 'lfg', label: '🎮 LFG' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as 'clips' | 'tournaments' | 'lfg')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === t.id ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-text-muted hover:bg-white/5'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'clips' && (
        <>
          {/* Game filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {games.map(g => (
              <button key={g} onClick={() => setSelectedGame(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${selectedGame === g ? 'bg-violet-500 text-white' : 'bg-surface-2 text-text-muted hover:bg-white/5 border border-white/5'}`}>
                {g === 'all' ? 'Tous les jeux' : g}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gamePosts.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-violet-500/30 transition-colors">
                <div className="relative aspect-video">
                  <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play size={24} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 flex gap-1">
                    {post.type === 'stream' ? (
                      <span className="flex items-center gap-1 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Wifi size={8} /> LIVE
                      </span>
                    ) : (
                      <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">CLIP</span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Eye size={8} /> {formatNumber(post.views)}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <Avatar src={post.user?.avatar_url} name={post.user?.full_name || ''} size="xs" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary line-clamp-1">{post.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-text-muted">{post.user?.username}</span>
                        <span className="text-xs bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full">{post.game}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-xs text-text-muted hover:text-rose-400 transition-colors">
                      <Heart size={13} /> {formatNumber(post.likes)}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'tournaments' && (
        <div className="space-y-4">
          {tournaments.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-surface-2 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                🏆
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-text-primary">{t.name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'live' ? 'bg-rose-500 text-white animate-pulse' : 'bg-violet-500/20 text-violet-400'}`}>
                    {t.status === 'live' ? '🔴 LIVE' : 'À venir'}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{t.game}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-text-muted flex items-center gap-1"><Users size={10} /> {t.participants}/{t.max_participants}</span>
                  <span className="text-xs text-emerald-400 font-bold">💰 {formatEuro(t.prize_pool)}</span>
                </div>
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(t.participants / t.max_participants) * 100}%` }} />
                </div>
              </div>
              <Button size="sm" variant={t.status === 'live' ? 'primary' : 'outline'}>
                {t.status === 'live' ? 'Rejoindre' : "S'inscrire"}
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'lfg' && (
        <div className="space-y-3">
          <div className="flex justify-end mb-2">
            <Button size="sm" variant="outline"><Plus size={13} /> Poster une recherche</Button>
          </div>
          {lfgPosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-surface-2 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
              <Avatar src={post.user?.avatar_url} name={post.user?.full_name || ''} size="md" online />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary">{post.user?.username}</p>
                  <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">{post.game}</span>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{post.rank}</span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">🔍 {post.looking_for} · 🌍 {post.language}</p>
              </div>
              <Button size="sm" variant="secondary">Contacter</Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
