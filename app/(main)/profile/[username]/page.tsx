'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Grid3x3, Play, Settings, UserPlus, UserMinus, MessageCircle, Flame, Star, Crown } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useLevel, getLevelInfo, getProgressToNextLevel } from '@/hooks/useLevel'
import { useStreak } from '@/hooks/useStreak'
import { formatNumber } from '@/lib/utils'
import { MOCK_USERS, MOCK_POSTS, MOCK_CURRENT_USER } from '@/lib/mock-data'
import { ProfileSkeleton } from '@/components/ui/Skeleton'
import ProfileEditModal from '@/components/profile/ProfileEditModal'
import type { User, Post } from '@/types'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts')
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)

  const isOwn = currentUser?.username === username

  const { currentLevel, progress } = useLevel(profile?.id ?? null)
  const { streak } = useStreak(profile?.id ?? null)

  useEffect(() => {
    async function loadProfile() {
      // Try Supabase first
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (userData) {
        setProfile(userData)

        // Charger le nombre de followers réels
        const { count: fCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', userData.id)
        setFollowersCount(fCount ?? userData.followers_count ?? 0)

        // Vérifier si l'utilisateur courant suit ce profil
        if (currentUser) {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', currentUser.id)
            .eq('following_id', userData.id)
            .single()
          setFollowing(!!followData)
        }

        const { data: postsData } = await supabase
          .from('posts')
          .select('*, users:user_id(*)')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false })
          .limit(30)
        if (postsData) setPosts(postsData as Post[])
      } else {
        // Demo mode: look up in mock data by username
        const mockUser =
          MOCK_USERS.find(u => u.username === username) ||
          (username === MOCK_CURRENT_USER.username ? MOCK_CURRENT_USER : null) ||
          currentUser

        setProfile(mockUser ?? null)

        if (mockUser) {
          // Show this user's mock posts
          const userPosts = MOCK_POSTS.filter(p => p.user_id === mockUser.id)
          setPosts(userPosts)
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [username, currentUser])

  const handleFollow = async () => {
    if (!currentUser || !profile) return
    const newFollowing = !following
    setFollowing(newFollowing)
    setFollowersCount(c => newFollowing ? c + 1 : Math.max(0, c - 1))
    if (newFollowing) {
      await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: profile.id })
    } else {
      await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', profile.id)
    }
  }

  if (loading) return <ProfileSkeleton />

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-zinc-500">
        <p className="font-semibold text-white mb-1">Utilisateur introuvable</p>
        <p className="text-sm">@{username} n'existe pas</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/5">
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar */}
          <div className="relative">
            <Avatar src={profile.avatar_url} name={profile.full_name} size="xl" />
            {/* Level badge */}
            <div
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-xs font-black"
              style={{ background: currentLevel.color }}
            >
              {currentLevel.level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-white">{profile.full_name}</h1>
              {profile.is_verified && <Badge variant="verified">✓</Badge>}
              {profile.is_creator && <Badge variant="creator">Créateur</Badge>}
            </div>
            <p className="text-zinc-500 text-sm">@{profile.username}</p>

            {/* Level name */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-semibold" style={{ color: currentLevel.color }}>
                {currentLevel.badge} {currentLevel.name}
              </span>
            </div>

            {/* Level progress */}
            {currentLevel.level < 5 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ background: currentLevel.color }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500">{Math.round(progress)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="flex gap-6 mb-4">
          {[
            { label: 'Posts', value: posts.length },
            { label: 'Abonnés', value: followersCount },
            { label: 'Abonnements', value: profile.following_count },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-lg font-black text-white">{formatNumber(value)}</div>
              <div className="text-xs text-zinc-500">{label}</div>
            </div>
          ))}
          {(streak?.current_streak ?? 0) > 0 && (
            <div className="text-center">
              <div className="text-lg font-black text-orange-400 flex items-center gap-1 justify-center">
                <Flame size={16} /> {streak?.current_streak}
              </div>
              <div className="text-xs text-zinc-500">Streak</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isOwn ? (
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 py-2 border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <Settings size={14} /> Modifier le profil
            </button>
          ) : (
            <>
              <button
                onClick={handleFollow}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  following
                    ? 'border border-white/10 text-white hover:bg-white/5'
                    : 'bg-violet-600 hover:bg-violet-500 text-white'
                }`}
              >
                {following ? <><UserMinus size={14} /> Abonné</> : <><UserPlus size={14} /> Suivre</>}
              </button>
              <button className="py-2 px-4 border border-white/10 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                <MessageCircle size={14} /> Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        {[
          { key: 'posts', icon: Grid3x3, label: 'Posts' },
          { key: 'reels', icon: Play, label: 'Reels' },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as 'posts' | 'reels')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === key ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon size={14} />
            {label}
            {activeTab === key && (
              <motion.div
                layoutId="profile-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Posts grid */}
      {activeTab === 'posts' && (
        <div className="p-4">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Grid3x3 size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun post pour l'instant</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="aspect-square bg-zinc-800 rounded-lg overflow-hidden cursor-pointer relative group"
                >
                  {post.media_url ? (
                    <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <p className="text-xs text-zinc-400 text-center line-clamp-4">{post.content}</p>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="text-xs text-white font-semibold flex items-center gap-1">
                      ❤️ {formatNumber(post.likes_count ?? 0)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="py-16 text-center text-zinc-500">
          <Play size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun reel pour l'instant</p>
        </div>
      )}

      <ProfileEditModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  )
}
