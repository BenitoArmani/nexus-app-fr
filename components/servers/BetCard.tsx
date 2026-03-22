'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'
import { useGlyphs } from '@/hooks/useGlyphs'
import toast from 'react-hot-toast'

export interface ChannelBet {
  id: string
  creator_id: string
  question: string
  amount: number
  status: 'open' | 'accepted' | 'resolved' | 'cancelled'
  accepted_by?: string
  winner_id?: string
  created_at: string
  creator?: { id: string; username: string; full_name: string; avatar_url?: string }
  acceptor?: { id: string; username: string; full_name: string }
}

interface BetCardProps {
  bet: ChannelBet
  onUpdate: () => void
}

export default function BetCard({ bet, onUpdate }: BetCardProps) {
  const { user }                 = useAuth()
  const { balance, spendGlyphs } = useGlyphs()
  const [loading, setLoading]    = useState(false)

  const isCreator  = user?.id === bet.creator_id
  const isAcceptor = user?.id === bet.accepted_by
  const canAccept  = bet.status === 'open' && !isCreator && user

  const accept = async () => {
    if (!user) return
    if (!spendGlyphs(bet.amount, `Pari : ${bet.question}`)) return
    setLoading(true)
    const res = await fetch('/api/channel-bets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betId: bet.id, action: 'accept', userId: user.id }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success('Pari accepté ! Bonne chance 🎲')
      onUpdate()
    } else {
      toast.error(data.error || 'Erreur')
    }
    setLoading(false)
  }

  const resolve = async (winnerId: string) => {
    if (!user) return
    setLoading(true)
    const res = await fetch('/api/channel-bets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betId: bet.id, action: 'resolve', userId: user.id, winnerId }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success(`Pari résolu ! Le gagnant remporte ${bet.amount * 2} GLYPHS ⬡`)
      onUpdate()
    } else {
      toast.error(data.error || 'Erreur')
    }
    setLoading(false)
  }

  const statusColor = {
    open:      'border-amber-500/30 bg-amber-500/5',
    accepted:  'border-violet-500/30 bg-violet-500/5',
    resolved:  'border-emerald-500/30 bg-emerald-500/5',
    cancelled: 'border-zinc-500/30 bg-zinc-500/5',
  }[bet.status]

  const statusLabel = {
    open:      '🎲 En attente d\'un adversaire',
    accepted:  '⚔️ En cours',
    resolved:  '🏆 Résolu',
    cancelled: '❌ Annulé',
  }[bet.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl p-4 my-2 ${statusColor}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Trophy size={14} className="text-amber-400" />
        <span className="text-xs font-bold text-amber-400">Mini-pari · {bet.amount} ⬡ chacun</span>
        <span className="ml-auto text-[10px] text-zinc-500">{statusLabel}</span>
      </div>

      {/* Question */}
      <p className="text-sm font-semibold text-white mb-3 leading-snug">"{bet.question}"</p>

      {/* Players */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <Avatar src={bet.creator?.avatar_url} name={bet.creator?.full_name ?? '?'} size="xs" />
          <span className="text-xs text-zinc-300">@{bet.creator?.username ?? '?'}</span>
        </div>
        <span className="text-zinc-600 text-xs">vs</span>
        {bet.acceptor ? (
          <div className="flex items-center gap-1.5">
            <Avatar src={undefined} name={bet.acceptor.full_name} size="xs" />
            <span className="text-xs text-zinc-300">@{bet.acceptor.username}</span>
          </div>
        ) : (
          <span className="text-xs text-zinc-600 italic">En attente...</span>
        )}
      </div>

      {/* Pot */}
      <div className="text-xs text-center text-zinc-500 mb-3">
        Pot total : <span className="text-amber-400 font-bold">{bet.amount * (bet.status === 'open' ? 1 : 2)} ⬡</span>
        {bet.status !== 'open' && <span className="text-zinc-600"> → gagnant remporte tout</span>}
      </div>

      {/* Actions */}
      {canAccept && (
        <button
          onClick={accept}
          disabled={loading || balance < bet.amount}
          className="w-full py-2 rounded-xl bg-violet-500 hover:bg-violet-400 text-white text-sm font-bold disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : '⚔️'}
          Accepter le pari ({bet.amount} ⬡)
        </button>
      )}

      {isCreator && bet.status === 'accepted' && (
        <div className="space-y-2">
          <p className="text-xs text-center text-zinc-500 mb-2">Qui a gagné ?</p>
          <div className="flex gap-2">
            <button
              onClick={() => resolve(bet.creator_id)}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 size={12} /> Moi
            </button>
            <button
              onClick={() => resolve(bet.accepted_by!)}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <XCircle size={12} /> @{bet.acceptor?.username}
            </button>
          </div>
        </div>
      )}

      {bet.status === 'resolved' && bet.winner_id && (
        <div className="text-center text-xs text-emerald-400 font-bold">
          🏆 Gagnant : @{bet.winner_id === bet.creator_id ? bet.creator?.username : bet.acceptor?.username}
          {' '}remporte {bet.amount * 2} ⬡
        </div>
      )}
    </motion.div>
  )
}
