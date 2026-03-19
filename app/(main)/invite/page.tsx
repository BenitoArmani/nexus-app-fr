'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Copy, Check, Trophy, Crown, Zap, ArrowRight } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { MOCK_USERS } from '@/lib/mock-data'
import { useAuth } from '@/hooks/useAuth'
import { useGlyphs } from '@/hooks/useGlyphs'
import toast from 'react-hot-toast'

/* Paliers de parrainage */
const TIERS = [
  { friends: 3,  glyphs: 1500,  bonus: null,                  label: 'Starter'     },
  { friends: 10, glyphs: 5000,  bonus: 'Badge Ambassadeur 🏅', label: 'Ambassadeur' },
  { friends: 25, glyphs: 15000, bonus: 'Accès VIP 👑',         label: 'VIP'         },
]

const MOCK_INVITES = [
  { user: MOCK_USERS[0], status: 'active',  joinedAt: '10 Mar 2025', glyphsEarned: 500 },
  { user: MOCK_USERS[1], status: 'active',  joinedAt: '5 Mar 2025',  glyphsEarned: 500 },
  { user: MOCK_USERS[4], status: 'pending', joinedAt: null,           glyphsEarned: 0   },
]

export default function InvitePage() {
  const { user } = useAuth()
  const { addGlyphs } = useGlyphs()
  const [copied, setCopied] = useState(false)

  const handle = user?.username ?? 'moi_creator'
  const inviteLink = `https://nexus.app/join/${handle}`

  const totalActive  = MOCK_INVITES.filter(i => i.status === 'active').length
  const glyphsEarned = MOCK_INVITES.reduce((s, i) => s + i.glyphsEarned, 0)

  /* Next tier to reach */
  const nextTier = TIERS.find(t => totalActive < t.friends) ?? TIERS[TIERS.length - 1]
  const tierProgress = Math.min(100, (totalActive / nextTier.friends) * 100)

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    toast.success('Lien copié ! Partage-le pour gagner 500 ⬡ par ami.', {
      style: { background: '#1a0a2e', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px' },
    })
  }

  const share = (platform: string) => {
    const text = `Je gagne de l'argent en scrollant sur NEXUS 💸 Toi aussi tu peux ! Tu reçois 200 ⬡ Glyphs gratuits à l'inscription 🎁`
    const urls: Record<string, string> = {
      whatsapp:  `https://wa.me/?text=${encodeURIComponent(text + '\n' + inviteLink)}`,
      twitter:   `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(inviteLink)}`,
      telegram:  `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`,
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`,
    }
    if (urls[platform]) window.open(urls[platform], '_blank')
  }

  /* Simulated claim (demo) */
  const handleClaim = (glyphs: number, label: string) => {
    addGlyphs(glyphs, `Parrainage — ${label}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Users size={22} className="text-violet-400" /> Parrainage
        </h1>
        <p className="text-zinc-500 text-sm mt-0.5">Invite tes amis · Gagnez tous les deux</p>
      </div>

      {/* Hero reward card */}
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-violet-600/20 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-6">

        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Par invitation acceptée</p>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-black text-violet-400">+500 ⬡</p>
                <p className="text-[10px] text-zinc-500">pour toi</p>
              </div>
              <ArrowRight size={14} className="text-zinc-600" />
              <div className="text-center">
                <p className="text-2xl font-black text-cyan-400">+200 ⬡</p>
                <p className="text-[10px] text-zinc-500">pour ton ami</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-center">
            <Crown size={16} className="text-amber-400 mx-auto mb-1" />
            <p className="text-[10px] text-amber-300 font-bold">Fondateur</p>
            <p className="text-[9px] text-zinc-500">Bonus ×2</p>
          </div>
        </div>

        {/* Progress to next tier */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>{totalActive} ami{totalActive > 1 ? 's' : ''} actif{totalActive > 1 ? 's' : ''}</span>
            <span>Prochain palier : {nextTier.friends} amis → {nextTier.glyphs.toLocaleString('fr-FR')} ⬡</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tierProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>

        <p className="text-xs text-zinc-600">{glyphsEarned.toLocaleString('fr-FR')} ⬡ gagnés au total via parrainage</p>
      </motion.div>

      {/* Invite link */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-white mb-3">Ton lien d'invitation</p>

        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-zinc-800/60 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-zinc-400 truncate font-mono">
            {inviteLink}
          </div>
          <button onClick={copyLink}
            className={`px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
              copied ? 'bg-emerald-600 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'
            }`}>
            {copied ? <><Check size={13} /> Copié !</> : <><Copy size={13} /> Copier</>}
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'whatsapp', emoji: '💬', label: 'WhatsApp', color: 'hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-400' },
            { id: 'telegram', emoji: '✈️', label: 'Telegram', color: 'hover:bg-blue-500/15 hover:border-blue-500/30 hover:text-blue-400'  },
            { id: 'twitter',  emoji: '𝕏',  label: 'Twitter',  color: 'hover:bg-sky-500/15 hover:border-sky-500/30 hover:text-sky-400'     },
            { id: 'facebook', emoji: '📘', label: 'Facebook', color: 'hover:bg-indigo-500/15 hover:border-indigo-500/30 hover:text-indigo-400' },
          ].map(p => (
            <button key={p.id} onClick={() => share(p.id)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs text-zinc-400 border border-white/5 transition-colors ${p.color}`}>
              <span className="text-base">{p.emoji}</span>
              <span className="hidden sm:block">{p.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tiers */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Trophy size={14} className="text-amber-400" /> Paliers de parrainage
        </p>
        <div className="space-y-3">
          {TIERS.map((tier, i) => {
            const reached = totalActive >= tier.friends
            return (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                reached ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-zinc-800/30'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                    reached ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-500'
                  }`}>
                    {reached ? '✓' : tier.friends}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{tier.friends} amis — {tier.label}</p>
                    <p className="text-xs text-zinc-500">{tier.bonus ?? 'Récompense GLYPHS'}</p>
                  </div>
                </div>
                {reached ? (
                  <button onClick={() => handleClaim(tier.glyphs, tier.label)}
                    className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full hover:bg-emerald-500/20 transition-colors">
                    Réclamer {tier.glyphs.toLocaleString('fr-FR')} ⬡
                  </button>
                ) : (
                  <span className="text-xs text-zinc-600 font-bold">{tier.glyphs.toLocaleString('fr-FR')} ⬡</span>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Filleuls */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5">
        <p className="text-sm font-bold text-white mb-3">Mes filleuls ({MOCK_INVITES.length})</p>
        <div className="space-y-3">
          {MOCK_INVITES.map((inv, i) => (
            <motion.div key={inv.user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3">
              <Avatar src={inv.user.avatar_url} name={inv.user.full_name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{inv.user.full_name}</p>
                <p className="text-xs text-zinc-500">
                  {inv.status === 'active' ? `Actif depuis le ${inv.joinedAt}` : 'Lien envoyé · En attente'}
                </p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                inv.status === 'active'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-amber-500/15 text-amber-400'
              }`}>
                {inv.status === 'active' ? `+${inv.glyphsEarned} ⬡` : 'En attente'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tip */}
      <div className="flex items-start gap-2 p-3 bg-violet-500/5 border border-violet-500/15 rounded-xl">
        <Zap size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="text-white font-semibold">Astuce :</span> le message le plus efficace c'est "Tu scrolles déjà sur Instagram, là tu gagnes de l'argent en faisant pareil". Envoie ton lien sur WhatsApp à 10 proches — statistiquement 2-3 vont s'inscrire.
        </p>
      </div>
    </div>
  )
}
