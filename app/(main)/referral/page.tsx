'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Users, Copy, Check, Share2, Gift, Trophy, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '@/hooks/useAuth'
import { useGlyphs } from '@/hooks/useGlyphs'
import { supabase } from '@/lib/supabase'
import { safeLog } from '@/lib/security'
import toast from 'react-hot-toast'

interface ReferralStats {
  total: number
  rewarded: number
  referral_code: string | null
}

export default function ReferralPage() {
  const { user } = useAuth()
  const { balance } = useGlyphs()
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<ReferralStats>({ total: 0, rewarded: 0, referral_code: null })
  const [loading, setLoading] = useState(true)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nexussociable.fr'
  const referralCode = stats.referral_code ?? ''
  const referralLink = referralCode ? `${appUrl}/signup?ref=${referralCode}` : ''

  const loadStats = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      // Load referral_code from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('referral_code')
        .eq('id', user.id)
        .single()

      if (userError) {
        safeLog('warn', 'Referral page: could not load referral_code', { error: userError.message })
      }

      // Load referral stats
      const { data: referrals, error: refError } = await supabase
        .from('referrals')
        .select('id, rewarded_at')
        .eq('referrer_id', user.id)

      if (refError) {
        safeLog('warn', 'Referral page: could not load referrals', { error: refError.message })
      }

      const total = referrals?.length ?? 0
      const rewarded = referrals?.filter(r => r.rewarded_at !== null).length ?? 0

      setStats({
        total,
        rewarded,
        referral_code: userData?.referral_code ?? null,
      })
    } catch (err) {
      safeLog('error', 'Referral page: loadStats error', { error: err instanceof Error ? err.message : 'unknown' })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const copyLink = async () => {
    if (!referralLink) return
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
      toast.success('Lien copié !', {
        style: {
          background: '#1a0a2e',
          color: '#c084fc',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '12px',
        },
      })
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  const shareLink = async () => {
    if (!referralLink) return
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'NEXUS', url: referralLink })
      } catch {
        // User cancelled or not supported — fallback to copy
        await copyLink()
      }
    } else {
      await copyLink()
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Users size={22} className="text-violet-400" />
          Parrainage
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Invite tes amis sur NEXUS et gagne <span className="text-violet-400 font-semibold">500 ⬡ GLYPHS</span> par filleul actif après 3 jours.
        </p>
      </motion.div>

      {/* Hero card — gradient */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-violet-600/20 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-zinc-500 mb-2">Récompense par filleul actif</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-violet-400">+500 ⬡</span>
              <span className="text-xs text-zinc-500 bg-zinc-800/60 px-2 py-1 rounded-full">après 3 jours d'activité</span>
            </div>
          </div>
          <Gift size={32} className="text-violet-400/50" />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Solde GLYPHS</p>
            <p className="text-lg font-black text-violet-400">{balance.toLocaleString('fr-FR')} ⬡</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Filleuls invités</p>
            {loading
              ? <Loader2 size={16} className="animate-spin text-zinc-500 mx-auto mt-1" />
              : <p className="text-lg font-black text-white">{stats.total}</p>
            }
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Récompenses</p>
            {loading
              ? <Loader2 size={16} className="animate-spin text-zinc-500 mx-auto mt-1" />
              : <p className="text-lg font-black text-cyan-400">{stats.rewarded}</p>
            }
          </div>
        </div>
      </motion.div>

      {/* Referral link + QR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
      >
        <p className="text-sm font-bold text-white">Ton lien de parrainage</p>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 size={20} className="animate-spin text-zinc-500" />
          </div>
        ) : referralCode ? (
          <>
            {/* Link display */}
            <div className="flex gap-2">
              <div className="flex-1 bg-zinc-800/60 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-zinc-400 truncate font-mono select-all">
                {referralLink}
              </div>
              <button
                onClick={copyLink}
                className={`px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-violet-600 hover:bg-violet-500 text-white'
                }`}
              >
                {copied ? <><Check size={13} /> Copié !</> : <><Copy size={13} /> Copier</>}
              </button>
            </div>

            {/* Share button */}
            <button
              onClick={shareLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-colors"
            >
              <Share2 size={15} />
              Partager ce lien
            </button>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <p className="text-xs text-zinc-500">QR Code à scanner</p>
              <div className="p-3 bg-white rounded-2xl shadow-lg">
                <QRCodeSVG
                  value={referralLink}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#18181b"
                  level="M"
                />
              </div>
              <p className="text-[11px] text-zinc-600 text-center">
                Code : <span className="font-mono font-bold text-violet-400">{referralCode}</span>
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-4">
            Aucun code de parrainage disponible pour le moment.
          </p>
        )}
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5"
      >
        <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Trophy size={14} className="text-amber-400" />
          Comment ça marche ?
        </p>
        <ol className="space-y-3">
          {[
            { step: '1', title: 'Partage ton lien', desc: 'Envoie ton lien unique à tes amis via WhatsApp, Telegram ou les réseaux sociaux.' },
            { step: '2', title: 'Ils s\'inscrivent', desc: 'Ton ami crée son compte NEXUS en utilisant ton lien de parrainage.' },
            { step: '3', title: 'Il reste actif 3 jours', desc: 'Il publie au moins un post dans les 3 jours suivant son inscription.' },
            { step: '4', title: 'Tu reçois 500 ⬡', desc: 'La récompense est automatiquement créditée sur ton solde GLYPHS.' },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-xs font-black text-white">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-start gap-2 p-3 bg-violet-500/5 border border-violet-500/15 rounded-xl"
      >
        <span className="text-violet-400 flex-shrink-0 mt-0.5">💡</span>
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="text-white font-semibold">Astuce :</span> le message le plus efficace c'est{' '}
          <em>"Tu scrolles déjà sur Instagram, là tu gagnes de l'argent en faisant pareil"</em>. Envoie ton lien sur WhatsApp à 10 proches — statistiquement 2-3 vont s'inscrire.
        </p>
      </motion.div>
    </div>
  )
}
