'use client'
import { motion } from 'framer-motion'
import { Shield, ShieldOff, ShieldCheck, Eye, EyeOff, AlertTriangle, Focus, Bell, Volume2, User } from 'lucide-react'
import Link from 'next/link'
import { useSafeMode } from '@/hooks/useSafeMode'
import { useFocusMode } from '@/hooks/useFocusMode'
import { useUserProfile, PROFILES, type ProfileType } from '@/hooks/useUserProfile'
import AgeVerificationModal from '@/components/ui/AgeVerificationModal'
import { SoundSettingsPanel } from '@/components/ui/SoundSettingsPanel'
import toast from 'react-hot-toast'

// PROFILE_ORDER needs to be exported from useUserProfile or defined here
const ALL_PROFILES: ProfileType[] = [
  'student', 'professional', 'teacher', 'gamer',
  'creator', 'trader', 'journalist', 'bettor', 'senior', 'other',
]

export default function PreferencesPage() {
  const { safeMode, isAdultVerified, showAgeModal, setShowAgeModal, requestDisable, confirmAge, enableSafeMode } = useSafeMode()
  const { focusMode, toggleFocusMode } = useFocusMode()
  const { profile, setProfileType } = useUserProfile()

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications non supportées dans ce navigateur')
      return
    }
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      toast.success('Notifications activées !')
    } else {
      toast.error('Notifications refusées')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-text-primary mb-1">⚙️ Préférences</h1>
        <p className="text-text-muted text-sm mb-6">Personnalisez votre expérience NEXUS.</p>
      </motion.div>

      {/* Profile type section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden mb-4"
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-violet-400" />
            <h2 className="text-sm font-bold text-text-primary">Mon profil NEXUS</h2>
          </div>
          <p className="text-xs text-text-muted">NEXUS adapte automatiquement ton feed, tes missions et tes suggestions selon ton profil.</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALL_PROFILES.map(type => {
              const data = PROFILES[type]
              const active = profile.type === type
              return (
                <button
                  key={type}
                  onClick={() => { setProfileType(type); toast.success(`Profil ${data.label} activé !`) }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left ${
                    active
                      ? `${data.bgColor} ${data.borderColor} ${data.color}`
                      : 'bg-surface-3 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-base">{data.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{data.label}</p>
                    <p className="text-[10px] opacity-60 truncate">{data.avgEarnings}</p>
                  </div>
                </button>
              )
            })}
          </div>
          <Link href="/onboarding" className="mt-3 block text-xs text-center text-violet-400 hover:text-violet-300 transition-colors">
            Refaire l&apos;onboarding complet →
          </Link>
        </div>
      </motion.div>

      {/* Safe mode section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden mb-4"
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-violet-400" />
            <h2 className="text-base font-bold text-text-primary">Mode Safe — Filtre de contenu</h2>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Contrôle la visibilité des contenus sensibles et explicites sur la plateforme.
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Status */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${safeMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
            {safeMode
              ? <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
              : <ShieldOff size={20} className="text-rose-400 flex-shrink-0" />}
            <div>
              <p className={`text-sm font-bold ${safeMode ? 'text-emerald-400' : 'text-rose-400'}`}>
                Mode Safe {safeMode ? 'activé' : 'désactivé'}
              </p>
              <p className="text-xs text-text-muted">
                {safeMode
                  ? 'Les contenus explicites sont masqués avec un flou. Cliquez pour les révéler un à un.'
                  : 'Tous les contenus sont visibles. Activez le mode Safe pour filtrer les contenus sensibles.'}
              </p>
            </div>
          </div>

          {/* Toggle button */}
          {safeMode ? (
            <button
              onClick={requestDisable}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-sm text-rose-400 font-semibold transition-colors"
            >
              <EyeOff size={16} />
              Désactiver le mode Safe (vérification d'âge requise)
            </button>
          ) : (
            <button
              onClick={enableSafeMode}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-sm text-emerald-400 font-semibold transition-colors"
            >
              <Shield size={16} />
              Réactiver le mode Safe
            </button>
          )}

          {/* Verification status */}
          {isAdultVerified && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <ShieldCheck size={13} className="text-violet-400" />
              Âge vérifié (+18 ans confirmé)
            </div>
          )}

          {/* Info boxes */}
          <div className="space-y-2">
            <div className="flex gap-2 p-3 bg-surface-3 rounded-xl">
              <Eye size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Contenu sensible</p>
                <p className="text-xs text-text-muted">Les images et vidéos signalées comme explicites sont floutées. Cliquez sur "Voir quand même" pour révéler un contenu spécifique sans désactiver le filtre global.</p>
              </div>
            </div>
            <div className="flex gap-2 p-3 bg-surface-3 rounded-xl">
              <AlertTriangle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Mineurs</p>
                <p className="text-xs text-text-muted">Les utilisateurs de moins de 18 ans ne peuvent jamais désactiver le mode Safe. Cette restriction est permanente et ne peut pas être contournée.</p>
              </div>
            </div>
            <div className="flex gap-2 p-3 bg-surface-3 rounded-xl">
              <Shield size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text-primary">Créateurs de contenu</p>
                <p className="text-xs text-text-muted">Vous devez explicitement marquer votre contenu comme "adulte" lors de la publication. Le non-respect entraîne la suppression du contenu et des sanctions de compte.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Focus mode section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden mb-4"
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Focus size={16} className="text-cyan-400" />
            <h2 className="text-base font-bold text-text-primary">Mode Focus</h2>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Masque les distractions et simplifie l&apos;interface pour te concentrer sur la création.
          </p>
        </div>
        <div className="p-4">
          <button
            onClick={toggleFocusMode}
            className={`w-full flex items-center justify-between py-3 px-4 rounded-xl border transition-colors ${
              focusMode
                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                : 'bg-surface-3 border-white/5 text-text-muted hover:border-cyan-500/20'
            }`}
          >
            <span className="text-sm font-semibold">Mode Focus {focusMode ? 'activé' : 'désactivé'}</span>
            <div className={`w-10 h-6 rounded-full transition-colors relative ${focusMode ? 'bg-cyan-500' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${focusMode ? 'left-5' : 'left-1'}`} />
            </div>
          </button>
        </div>
      </motion.div>

      {/* Push notifications section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden mb-4"
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-amber-400" />
            <h2 className="text-base font-bold text-text-primary">Notifications Push</h2>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Recevez des notifications pour les nouveaux messages, likes et abonnés.
          </p>
        </div>
        <div className="p-4">
          <button
            onClick={requestPushPermission}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-sm text-amber-400 font-semibold transition-colors"
          >
            <Bell size={16} />
            Activer les notifications
          </button>
        </div>
      </motion.div>

      {/* Sound settings section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden mb-4"
      >
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-violet-400" />
            <h2 className="text-base font-bold text-text-primary">Sons & Effets Sonores</h2>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Retours audio pour les interactions (likes, notifications, gains de GLYPHS…).
          </p>
        </div>
        <div className="p-4">
          <SoundSettingsPanel />
        </div>
      </motion.div>

      <AgeVerificationModal
        open={showAgeModal}
        onClose={() => setShowAgeModal(false)}
        onConfirm={confirmAge}
      />
    </div>
  )
}
