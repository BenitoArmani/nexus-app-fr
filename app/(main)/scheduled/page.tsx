'use client'
import { motion } from 'framer-motion'
import { Calendar, Clock, Trash2, CheckCircle2, XCircle, AlarmClock } from 'lucide-react'
import { useScheduledPosts } from '@/hooks/useScheduledPosts'

function statusBadge(status: string) {
  if (status === 'published') return <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1"><CheckCircle2 size={10} />Publié</span>
  if (status === 'cancelled') return <span className="text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full flex items-center gap-1"><XCircle size={10} />Annulé</span>
  return <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full flex items-center gap-1"><Clock size={10} />En attente</span>
}

export default function ScheduledPage() {
  const { posts, cancelPost } = useScheduledPosts()

  const pending = posts.filter(p => p.status === 'pending')
  const done = posts.filter(p => p.status !== 'pending')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-text-primary flex items-center gap-2">
          <AlarmClock size={24} className="text-violet-400" /> Posts programmés 🗓
        </h1>
        <p className="text-text-muted text-sm mt-0.5">Gérez votre calendrier éditorial</p>
      </motion.div>

      {posts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-center py-16">
          <Calendar size={40} className="text-text-muted mx-auto mb-3 opacity-30" />
          <p className="text-text-muted text-sm">Aucun post programmé</p>
          <p className="text-text-muted text-xs mt-1">Utilisez le bouton 🗓 dans le composer pour programmer un post</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                <Clock size={14} className="text-amber-400" /> À venir ({pending.length})
              </h2>
              <div className="space-y-2">
                {pending.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-surface-2 border border-white/5 rounded-2xl p-4 flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {statusBadge(post.status)}
                        <span className="text-xs text-text-muted">
                          {new Date(post.scheduled_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-text-primary line-clamp-2">{post.content}</p>
                    </div>
                    <button onClick={() => cancelPost(post.id)}
                      className="w-8 h-8 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 flex items-center justify-center text-text-muted transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {done.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-text-muted mb-2">Historique</h2>
              <div className="space-y-2 opacity-60">
                {done.map(post => (
                  <div key={post.id} className="bg-surface-2 border border-white/5 rounded-2xl p-4 flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">{statusBadge(post.status)}</div>
                      <p className="text-sm text-text-primary line-clamp-1">{post.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
