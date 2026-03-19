'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Zap, ChevronRight, Check, Sparkles } from 'lucide-react'
import { useUserProfile, PROFILES, type ProfileType } from '@/hooks/useUserProfile'
import { useBubbles } from '@/hooks/useBubbles'

const PROFILE_ORDER: ProfileType[] = [
  'student', 'professional', 'teacher', 'gamer',
  'creator', 'trader', 'journalist', 'bettor', 'senior', 'other',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setProfileType, completeOnboarding } = useUserProfile()
  const { switchBubble } = useBubbles()
  const [selected, setSelected] = useState<ProfileType | null>(null)
  const [step, setStep] = useState<'select' | 'preview'>('select')

  const handleSelect = (type: ProfileType) => {
    setSelected(type)
    setStep('preview')
  }

  const handleConfirm = () => {
    if (!selected) return
    setProfileType(selected)
    completeOnboarding()
    // Switch to first suggested bubble
    const firstBubble = PROFILES[selected].suggestedBubbles[0]
    if (firstBubble) switchBubble(firstBubble)
    router.push('/feed')
  }

  const selectedData = selected ? PROFILES[selected] : null

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-start py-8 px-4 overflow-auto">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-600/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap size={24} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              NEXUS
            </h1>
            <p className="text-xs text-zinc-500 -mt-0.5">La super-app qui te comprend</p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-2">Tu es plutôt... ?</h2>
                <p className="text-zinc-400 text-sm">
                  NEXUS adapte automatiquement ton expérience pour maximiser tes gains
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {PROFILE_ORDER.map((type, i) => {
                  const data = PROFILES[type]
                  return (
                    <motion.button
                      key={type}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                      onClick={() => handleSelect(type)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative bg-gradient-to-br ${data.gradient} border ${data.borderColor} rounded-2xl p-4 flex flex-col items-center gap-2 text-center cursor-pointer hover:shadow-lg transition-all group`}
                    >
                      <span className="text-3xl">{data.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{data.label}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">{data.description}</p>
                      </div>
                      <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${data.bgColor} ${data.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {data.avgEarnings}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* NEXUS advantages vs Twitter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-surface-2 border border-white/5 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={14} className="text-violet-400" />
                  <p className="text-sm font-bold text-white">NEXUS vs les autres réseaux</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    '✅ Payé pour poster',
                    '✅ Payé pour voir des pubs',
                    '✅ Parier sur tout',
                    '✅ Bulles de filtrage',
                    '✅ Prométhée te protège',
                    '✅ Algorithme transparent',
                    '✅ Pas de shadowban',
                    '✅ Données protégées',
                    '✅ Communauté décide',
                  ].map(item => (
                    <div key={item} className="text-xs text-zinc-300">{item}</div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 'preview' && selected && selectedData && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-xl mx-auto"
            >
              {/* Profile header */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`bg-gradient-to-br ${selectedData.gradient} border ${selectedData.borderColor} rounded-3xl p-6 mb-5 text-center`}
              >
                <div className="text-5xl mb-3">{selectedData.emoji}</div>
                <h2 className="text-2xl font-black text-white mb-1">{selectedData.label}</h2>
                <p className={`text-sm font-semibold ${selectedData.color} mb-2`}>{selectedData.tagline}</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${selectedData.bgColor} border ${selectedData.borderColor}`}>
                  <span className="text-lg">⬡</span>
                  <span className={`text-sm font-bold ${selectedData.color}`}>{selectedData.avgEarnings}</span>
                </div>
              </motion.div>

              {/* What NEXUS sets up for you */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-surface-2 border border-white/5 rounded-2xl p-4">
                  <p className="text-xs font-bold text-zinc-400 mb-2">🫧 Bulles suggérées</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedData.suggestedBubbles.map(id => {
                      const labels: Record<string, string> = {
                        main: '🌍 Principal', trading: '📈 Trading', news: '📰 Actu',
                        gaming: '🎮 Gaming', memes: '😂 Mèmes', music: '🎵 Musique',
                        education: '🎓 Éducation', kawaii: '🌸 Kawaii',
                      }
                      return (
                        <span key={id} className="text-xs font-medium px-2 py-1 bg-white/5 rounded-lg text-zinc-300">
                          {labels[id] ?? id}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-surface-2 border border-white/5 rounded-2xl p-4">
                  <p className="text-xs font-bold text-zinc-400 mb-2">🎯 Tes missions</p>
                  <div className="space-y-1">
                    {selectedData.missions.slice(0, 3).map(m => (
                      <p key={m} className="text-xs text-zinc-300">{m}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-surface-2 border border-white/5 rounded-2xl p-4 mb-5">
                <p className="text-xs font-bold text-zinc-400 mb-2">✨ NEXUS t'active automatiquement</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {selectedData.highlights.map(h => (
                    <div key={h} className="flex items-center gap-1.5">
                      <Check size={11} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-zinc-300">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prométhée message */}
              <div className="bg-surface-2 border border-violet-500/20 rounded-2xl p-4 mb-6 flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
                  <Zap size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-violet-400 mb-0.5">Prométhée</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {selected === 'student' && "Bienvenue ! J'ai activé les bulles Mèmes et Gaming pour toi. Tes missions sont simples — commence maintenant et gagne tes premiers GLYPHS ce soir."}
                    {selected === 'professional' && "Bienvenue ! J'ai activé les bulles Trading et Actu. Ta première mission : partage une analyse de marché. La communauté paye pour de bons insights."}
                    {selected === 'teacher' && "Bienvenue ! J'ai activé la bulle Éducation. Lance un cours de 60 secondes aujourd'hui — tes premiers élèves peuvent commencer à t'abonner immédiatement."}
                    {selected === 'gamer' && "Bienvenue ! J'ai activé la bulle Gaming. Un tournoi commence dans 2h — entre et gagne tes premiers GLYPHS en jouant."}
                    {selected === 'creator' && "Bienvenue créateur ! Poste ton premier Reel dès maintenant et gagne +100⬡ immédiatement. La viralité sur NEXUS est 3× plus rapide que sur TikTok."}
                    {selected === 'trader' && "Bienvenue trader ! Le portfolio virtuel est activé avec €10 000 fictifs. Passe en MODE PRO quand tu es prêt pour miser de vrais GLYPHS."}
                    {selected === 'journalist' && "Bienvenue ! J'ai activé la bulle Actu. Chaque article que tu postes peut être fact-checké par moi en temps réel."}
                    {selected === 'bettor' && "Bienvenue ! Le Golden Nugget a lieu vendredi 21h. Les Prédictions sont ouvertes 24h/24. Bons paris ! 🎰"}
                    {selected === 'senior' && "Bienvenue ! Je suis Prométhée, ton assistant sur NEXUS. Je t'accompagne pas à pas. Commence simplement par partager une photo aujourd'hui."}
                    {selected === 'other' && "Bienvenue sur NEXUS ! Je suis Prométhée. Explore à ton rythme — chaque section te récompense. Commence par regarder une pub pour gagner tes premiers GLYPHS."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  ← Changer
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  className={`flex-[2] py-3 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 bg-gradient-to-r ${selectedData.gradient.replace('/20', '').replace('/10', '')} hover:opacity-90 transition-opacity border ${selectedData.borderColor}`}
                >
                  C'est parti ! <ChevronRight size={18} />
                </motion.button>
              </div>

              <p className="text-center text-xs text-zinc-600 mt-3">
                Tu pourras changer ton profil à tout moment dans les Préférences
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
