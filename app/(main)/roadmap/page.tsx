'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Zap, Flame, Rocket, Diamond, Crown,
  Radio, ShoppingBag, Smartphone, Share2, Copy, Check,
  Lock, CheckCircle2, ChevronDown, ChevronUp, Star
} from 'lucide-react'
import { NexusHexIcon } from '@/components/ui/NexusLogo'
import toast from 'react-hot-toast'

// Mock current member count — in prod, fetch from Supabase
const CURRENT_MEMBERS = 312

interface Milestone {
  id: string
  target: number
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  glowColor: string
  badge: string
  title: string
  description: string
  features: { emoji: string; label: string; detail: string }[]
  founderBonus?: string
}

const MILESTONES: Milestone[] = [
  {
    id: 'founders',
    target: 500,
    label: 'Fondateurs',
    icon: Star,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    glowColor: 'shadow-amber-500/20',
    badge: '🌱',
    title: 'Accès Fondateurs',
    description: 'Les 500 premiers membres qui bâtissent NEXUS avec nous. Statut permanent.',
    features: [
      { emoji: '⬡', label: 'GLYPHS ×2 à vie', detail: 'Tous vos gains GLYPHS sont doublés définitivement' },
      { emoji: '🏅', label: 'Badge Fondateur', detail: 'Visible sur votre profil, permanent, exclusif' },
      { emoji: '🎯', label: 'Vote sur les features', detail: 'Accès au board privé pour voter les prochaines fonctionnalités' },
      { emoji: '📣', label: 'Canal Fondateurs', detail: 'Accès direct à l\'équipe NEXUS sur Discord privé' },
    ],
    founderBonus: 'Statut Fondateur = permanent, même après 1M membres',
  },
  {
    id: 'community',
    target: 500,
    label: 'Communauté',
    icon: Zap,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    glowColor: 'shadow-violet-500/20',
    badge: '⚡',
    title: 'Streaming Live',
    description: 'La communauté est assez grande pour supporter une infrastructure live. On l\'ouvre à tous.',
    features: [
      { emoji: '🔴', label: 'Live streaming 720p', detail: 'Streame en direct depuis NEXUS, jusqu\'à 500 viewers' },
      { emoji: '🎁', label: 'Cadeaux live GLYPHS', detail: 'Tes viewers t\'envoient des GLYPHS pendant le live' },
      { emoji: '💬', label: 'Chat temps réel', detail: 'Tchat animé avec émotes NEXUS exclusives' },
      { emoji: '📱', label: 'Stream mobile', detail: 'Démarre un live directement depuis ton téléphone' },
    ],
  },
  {
    id: 'momentum',
    target: 10000,
    label: 'Momentum',
    icon: Flame,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    glowColor: 'shadow-orange-500/20',
    badge: '🔥',
    title: 'Streaming HD + Monétisation Live',
    description: 'Avec 10K membres actifs, on peut financer une infrastructure vidéo premium.',
    features: [
      { emoji: '📺', label: 'Streaming 1080p HD', detail: 'Qualité broadcast professionnelle jusqu\'à 5000 viewers' },
      { emoji: '💰', label: 'Revenus live directs', detail: 'Reçois des paiements réels en plus des GLYPHS' },
      { emoji: '🎬', label: 'VOD automatique', detail: 'Tes lives sont enregistrés et rediffusés automatiquement' },
      { emoji: '🤝', label: 'Co-streaming', detail: 'Invite un autre créateur sur ton live simultanément' },
    ],
  },
  {
    id: 'scale',
    target: 50000,
    label: 'Scale',
    icon: Rocket,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    glowColor: 'shadow-cyan-500/20',
    badge: '🚀',
    title: 'Marketplace & Économie Créateur',
    description: 'À 50K membres, NEXUS devient un vrai écosystème économique.',
    features: [
      { emoji: '🛍️', label: 'Marketplace intégrée', detail: 'Vends produits physiques et numériques directement sur NEXUS' },
      { emoji: '📦', label: 'Shop créateur', detail: 'Ta boutique personnalisée avec ta propre URL' },
      { emoji: '🤖', label: 'Prométhée v2', detail: 'IA encore plus intelligente avec analyse de ton audience' },
      { emoji: '📊', label: 'Analytics avancés', detail: 'Données détaillées sur chaque abonné et conversion' },
    ],
  },
  {
    id: 'national',
    target: 200000,
    label: 'National',
    icon: Diamond,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    badge: '💎',
    title: 'App Mobile Native',
    description: 'Avec 200K membres, on lance l\'application iOS et Android native.',
    features: [
      { emoji: '📱', label: 'App iOS & Android', detail: 'Application native optimisée, notifications push, offline mode' },
      { emoji: '🎙️', label: 'Streaming 4K', detail: 'Qualité maximale pour les top créateurs' },
      { emoji: '🌍', label: 'Expansion EU', detail: 'Ouverture à toute l\'Europe avec support multilingue' },
      { emoji: '💳', label: 'Carte NEXUS', detail: 'Carte bancaire liée à tes GLYPHS (partenariat fintech)' },
    ],
  },
  {
    id: 'leader',
    target: 1000000,
    label: 'Leader',
    icon: Crown,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    glowColor: 'shadow-yellow-500/20',
    badge: '👑',
    title: 'DAO & Partage des Revenus',
    description: 'À 1M membres, NEXUS appartient à sa communauté.',
    features: [
      { emoji: '🏛️', label: 'DAO communautaire', detail: 'Les membres votent sur les décisions stratégiques de NEXUS' },
      { emoji: '💸', label: 'Partage des revenus', detail: '20% des revenus de la plateforme redistribués aux top créateurs' },
      { emoji: '🌐', label: 'Expansion mondiale', detail: 'NEXUS disponible dans 50 pays, 20 langues' },
      { emoji: '📈', label: 'Programme d\'actions', detail: 'Les fondateurs reçoivent des parts de NEXUS' },
    ],
  },
]

function getStatus(target: number, current: number): 'completed' | 'active' | 'locked' {
  if (current >= target) return 'completed'
  const prevMilestone = MILESTONES.find((_, i, arr) => arr[i + 1]?.target === target)
  if (!prevMilestone || current >= prevMilestone.target) return 'active'
  return 'locked'
}

function MilestoneCard({ milestone, current }: { milestone: Milestone; current: number }) {
  const [expanded, setExpanded] = useState(false)
  const status = getStatus(milestone.target, current)
  const progress = Math.min((current / milestone.target) * 100, 100)
  const remaining = Math.max(milestone.target - current, 0)
  const Icon = milestone.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden transition-all ${
        status === 'completed'
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : status === 'active'
            ? `${milestone.borderColor} ${milestone.bgColor} shadow-lg ${milestone.glowColor}`
            : 'border-white/5 bg-white/[0.02] opacity-60'
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
          status === 'completed' ? 'bg-emerald-500/20' : milestone.bgColor
        }`}>
          {status === 'completed'
            ? <CheckCircle2 size={22} className="text-emerald-400" />
            : status === 'locked'
              ? <Lock size={20} className="text-zinc-600" />
              : <Icon size={22} className={milestone.color} />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{milestone.badge}</span>
            <span className={`text-sm font-black ${
              status === 'completed' ? 'text-emerald-400' : status === 'active' ? 'text-white' : 'text-zinc-500'
            }`}>{milestone.title}</span>
            {status === 'active' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 animate-pulse">
                EN COURS
              </span>
            )}
            {status === 'completed' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                DÉBLOQUÉ ✓
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-violet-500 to-cyan-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[11px] text-zinc-500 shrink-0 font-semibold">
              {status === 'completed'
                ? `${milestone.target.toLocaleString('fr-FR')} ✓`
                : `${remaining.toLocaleString('fr-FR')} restants`
              }
            </span>
          </div>
        </div>

        <div className="shrink-0 text-zinc-600">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded features */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3">
              <p className="text-xs text-zinc-500 mb-3">{milestone.description}</p>
              {milestone.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base shrink-0">{f.emoji}</span>
                  <div>
                    <p className={`text-xs font-bold ${status === 'locked' ? 'text-zinc-600' : 'text-zinc-200'}`}>{f.label}</p>
                    <p className="text-[11px] text-zinc-600">{f.detail}</p>
                  </div>
                </div>
              ))}
              {milestone.founderBonus && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-[11px] text-amber-400 font-semibold">⭐ {milestone.founderBonus}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function RoadmapPage() {
  const [copied, setCopied] = useState(false)
  const current = CURRENT_MEMBERS

  const activeMilestone = MILESTONES.find(m => m.target > current)
  const totalProgress = activeMilestone
    ? Math.round((current / activeMilestone.target) * 100)
    : 100

  const inviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/register?ref=nexus`
    : 'https://nexus.app/register'

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    toast.success('Lien copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <NexusHexIcon size={52} />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Roadmap Communautaire</h1>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Plus on est nombreux, plus NEXUS devient puissant. Chaque membre débloque de nouvelles features pour tous.
        </p>
      </motion.div>

      {/* Live counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-violet-600/15 to-cyan-600/5 border border-violet-500/20 rounded-3xl p-6 mb-6 text-center relative overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Membres actifs</p>
        <motion.p
          className="text-6xl font-black text-white"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {current.toLocaleString('fr-FR')}
        </motion.p>

        {activeMilestone && (
          <div className="mt-4">
            <p className="text-sm text-zinc-400 mb-2">
              Prochain palier : <span className="text-white font-bold">{activeMilestone.badge} {activeMilestone.title}</span> à{' '}
              <span className={`font-black ${activeMilestone.color}`}>{activeMilestone.target.toLocaleString('fr-FR')} membres</span>
            </p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <p className="text-xs text-zinc-600 mt-1.5">
              {(activeMilestone.target - current).toLocaleString('fr-FR')} membres pour débloquer le streaming live
            </p>
          </div>
        )}
      </motion.div>

      {/* Invite CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-2 border border-white/5 rounded-2xl p-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Share2 size={16} className="text-violet-400" />
          <h3 className="text-sm font-bold text-white">Invite tes amis — accélère le déverrouillage</h3>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-surface-3 rounded-xl px-3 py-2 text-xs text-zinc-500 truncate font-mono">
            {inviteLink}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
        <p className="text-[11px] text-zinc-600 mt-2">+500 ⬡ GLYPHS pour toi à chaque ami inscrit</p>
      </motion.div>

      {/* Milestones */}
      <div className="space-y-3">
        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <MilestoneCard milestone={m} current={current} />
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs text-zinc-700 mt-8"
      >
        Les paliers sont permanents — une fois débloqués, les features restent pour toujours.
        <br />Les fondateurs (500 premiers) gardent leurs avantages même après 1M membres.
      </motion.p>
    </div>
  )
}
