'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Eye, Lock, Send, Flag, Copy, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import SafeContentWrapper from '@/components/ui/SafeContentWrapper'
import { formatNumber, timeAgo } from '@/lib/utils'
import { triggerGlyphGain } from '@/components/ui/GlyphGainToast'
import toast from 'react-hot-toast'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  onLike: (id: string) => void
}

/* ---------- Mock comments per post ---------- */
const MOCK_COMMENTS: Record<string, { id: string; author: string; username: string; text: string; ago: string }[]> = {
  p1: [
    { id: 'c1', author: 'Alexandre Dubois', username: 'alex_tech', text: 'Incroyable collection ! Les matières donnent vraiment envie 🔥', ago: '1h' },
    { id: 'c2', author: 'Jade Leroux', username: 'jade_gaming', text: 'J\'adore le coloris violet 💜 Tu livres en Europe ?', ago: '45min' },
    { id: 'c3', author: 'Léa Dumont', username: 'lea_vlog', text: 'Partenariat potentiel ? DM me 🙌', ago: '20min' },
  ],
  p2: [
    { id: 'c4', author: 'Hugo Vallet', username: 'hugo_dev', text: 'Point 2 is so true. Deep work > background music 🎯', ago: '3h' },
    { id: 'c5', author: 'Priya Sharma', username: 'priya_edutech', text: 'Totalement d\'accord pour les 2 terminaux, game changer 👏', ago: '2h' },
  ],
}

function getComments(postId: string) {
  return MOCK_COMMENTS[postId] ?? [
    { id: 'x1', author: 'Karim Mansour', username: 'karim_trader', text: 'Super contenu, continue comme ça ! 💪', ago: '2h' },
    { id: 'x2', author: 'Enzo Marchand', username: 'enzo_fitness', text: 'J\'adore ce genre de post 🔥', ago: '1h' },
  ]
}

/* ---------- Floating heart burst ---------- */
function HeartBurst({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[99] text-rose-500"
      style={{ left: x - 20, top: y - 20 }}
      initial={{ opacity: 1, scale: 0.5 }}
      animate={{ opacity: 0, scale: 2.5, y: -40 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Heart size={40} fill="currentColor" />
    </motion.div>
  )
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [saved, setSaved] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [localComments, setLocalComments] = useState(getComments(post.id))
  const [showMenu, setShowMenu] = useState(false)
  const [heartBursts, setHeartBursts] = useState<{ id: number; x: number; y: number }[]>([])
  const lastTap = useRef(0)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLike = (e: React.MouseEvent) => {
    if (!post.liked_by_me) {
      triggerGlyphGain(1, 'Like', e.clientX, e.clientY)
    }
    onLike(post.id)
  }

  /* Double-tap image to like */
  const handleImageTap = useCallback((e: React.MouseEvent) => {
    const now = Date.now()
    if (now - lastTap.current < 350) {
      // Double tap
      const id = now
      setHeartBursts(b => [...b, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setHeartBursts(b => b.filter(h => h.id !== id)), 800)
      if (!post.liked_by_me) {
        triggerGlyphGain(1, 'Like', e.clientX, e.clientY)
        onLike(post.id)
      }
    }
    lastTap.current = now
  }, [post.liked_by_me, onLike])

  const handleSendComment = () => {
    if (!commentText.trim()) return
    setLocalComments(prev => [{
      id: Date.now().toString(),
      author: 'Moi',
      username: 'moi_creator',
      text: commentText.trim(),
      ago: 'maintenant',
    }, ...prev])
    setCommentText('')
    toast.success('Commentaire publié !', {
      style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://nexus.app/post/${post.id}`).catch(() => {})
    toast.success('Lien copié !', {
      style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' }
    })
    setShowMenu(false)
  }

  const handleReport = () => {
    toast('Signalement envoyé. Merci.', {
      icon: '🛡️',
      style: { background: '#1a0a2e', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }
    })
    setShowMenu(false)
  }

  /* Hashtag / mention renderer */
  const renderContent = (text: string) =>
    text.split(/(\s+)/).map((word, i) => {
      if (/^#\w+/.test(word))
        return <Link key={i} href={`/explore?tag=${word.slice(1)}`} className="text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">{word}</Link>
      if (/^@\w+/.test(word))
        return <Link key={i} href={`/profile/${word.slice(1)}`} className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">{word}</Link>
      return word
    })

  return (
    <>
      {/* Heart bursts (portal-like, fixed position) */}
      {heartBursts.map(h => <HeartBurst key={h.id} x={h.x} y={h.y} />)}

      <motion.article
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden transition-colors duration-200 hover:bg-white/[0.025] hover:border-white/[0.08]"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${post.user?.username}`}>
              <Avatar src={post.user?.avatar_url} name={post.user?.full_name || ''} size="md" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/profile/${post.user?.username}`} className="text-sm font-semibold text-text-primary hover:text-violet-400 transition-colors">
                  {post.user?.full_name}
                </Link>
                {post.user?.is_verified && <Badge variant="verified">Vérifié</Badge>}
                {post.is_premium && <Badge variant="premium">Premium</Badge>}
              </div>
              <p className="text-xs text-text-muted">@{post.user?.username} · {timeAgo(post.created_at)}</p>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(m => !m)}
              className="w-8 h-8 rounded-xl hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-10 z-30 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden w-44"
                >
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-200 hover:bg-white/5 transition-colors">
                    <Copy size={14} className="text-zinc-400" /> Copier le lien
                  </button>
                  <button
                    onClick={() => {
                      toast.success('Partagé !', { style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' } })
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-zinc-200 hover:bg-white/5 transition-colors"
                  >
                    <Share2 size={14} className="text-zinc-400" /> Partager
                  </button>
                  <div className="h-px bg-white/5" />
                  <button onClick={handleReport} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/5 transition-colors">
                    <Flag size={14} /> Signaler
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Click-outside to close */}
            {showMenu && <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-4">
          <p className="text-base text-text-primary leading-relaxed whitespace-pre-line">
            {renderContent(post.content)}
          </p>
        </div>

        {/* Media — double-tap to like */}
        {post.media_url && (
          <SafeContentWrapper isExplicit={post.is_explicit ?? false}>
            <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={handleImageTap}>
              {post.is_premium ? (
                <div className="absolute inset-0 bg-surface-2 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                    <Lock size={24} className="text-violet-400" />
                  </div>
                  <p className="text-sm font-semibold text-text-primary">Contenu Premium</p>
                  <p className="text-xs text-text-muted">Abonnez-vous pour accéder</p>
                </div>
              ) : (
                <>
                  <Image src={post.media_url} alt="Post media" fill className="object-cover" unoptimized />
                  <p className="absolute bottom-2 right-3 text-[10px] text-white/40 select-none">Double tap ❤️</p>
                </>
              )}
            </div>
          </SafeContentWrapper>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 px-5 py-2 text-sm text-text-muted border-t border-white/5">
          <span className="flex items-center gap-1">
            <Eye size={12} /> {formatNumber(post.views)} vues
          </span>
          <span>{formatNumber(post.likes_count)} j'aime</span>
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:text-cyan-400 transition-colors"
          >
            {formatNumber(localComments.length + post.comments_count)} commentaires
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 px-2 py-1 border-t border-white/5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              post.liked_by_me ? 'text-rose-400' : 'text-text-muted hover:text-rose-400 hover:bg-rose-500/5'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={post.liked_by_me ? 'liked' : 'not-liked'}
                initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}
              >
                <Heart size={18} fill={post.liked_by_me ? 'currentColor' : 'none'} />
              </motion.div>
            </AnimatePresence>
            J'aime
          </motion.button>

          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              showComments ? 'text-cyan-400 bg-cyan-500/5' : 'text-text-muted hover:text-cyan-400 hover:bg-cyan-500/5'
            }`}
          >
            <MessageCircle size={18} /> Commenter
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://nexus.app/post/${post.id}`).catch(() => {})
              toast.success('Lien copié !', { style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' } })
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-violet-400 hover:bg-violet-500/5 transition-colors"
          >
            <Share2 size={18} /> Partager
          </button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setSaved(!saved)}
            className={`flex items-center justify-center w-10 py-2 rounded-xl text-sm font-medium transition-colors ${
              saved ? 'text-amber-400' : 'text-text-muted hover:text-amber-400 hover:bg-amber-500/5'
            }`}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="p-4 space-y-3">
                {/* Existing comments */}
                {localComments.map(c => (
                  <div key={c.id} className="flex gap-2.5">
                    <Avatar src={undefined} name={c.author} size="xs" />
                    <div className="flex-1 bg-white/[0.03] rounded-2xl rounded-tl-sm px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-white">{c.author}</span>
                        <span className="text-[10px] text-zinc-600">· {c.ago}</span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-snug">{c.text}</p>
                    </div>
                  </div>
                ))}

                {/* Comment input */}
                <div className="flex gap-2 pt-1">
                  <Avatar src={undefined} name="Moi" size="xs" />
                  <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/5 rounded-2xl px-3 py-2 focus-within:border-violet-500/40 transition-colors">
                    <input
                      type="text"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                      placeholder="Écrire un commentaire..."
                      className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                    />
                    <button
                      onClick={handleSendComment}
                      disabled={!commentText.trim()}
                      className="text-violet-400 disabled:text-zinc-600 hover:text-violet-300 transition-colors"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    </>
  )
}
