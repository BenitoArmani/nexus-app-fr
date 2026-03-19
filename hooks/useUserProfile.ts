'use client'
import { useState, useEffect } from 'react'

export type ProfileType =
  | 'student' | 'professional' | 'teacher' | 'gamer'
  | 'creator' | 'trader' | 'journalist' | 'bettor' | 'senior' | 'other'

export interface UserProfile {
  type: ProfileType
  completedOnboarding: boolean
  preferredBubbles: string[]
  language: string
}

export interface ProfileMeta {
  emoji: string
  label: string
  description: string
  ageRange: string
  avgEarnings: string
  avgEarningsDetail: string
  color: string
  bgColor: string
  borderColor: string
  gradient: string
  suggestedBubbles: string[]
  tagline: string
  missions: string[]
  highlights: string[]
}

export const PROFILES: Record<ProfileType, ProfileMeta> = {
  student: {
    emoji: '👨‍🎓',
    label: 'Étudiant',
    description: 'Mèmes, gaming, argent facile',
    ageRange: '16-25 ans',
    avgEarnings: '~50€/mois',
    avgEarningsDetail: 'Les étudiants gagnent en moyenne 50€/mois sur NEXUS 📚',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    gradient: 'from-yellow-600/20 to-orange-600/10',
    suggestedBubbles: ['memes', 'gaming', 'main'],
    tagline: '"Paie ton café en regardant des mèmes"',
    missions: ['Regarde 10 pubs → +30⬡', 'Like 5 posts → +10⬡', 'Place un pari gaming → +25⬡'],
    highlights: ['Bulle Mèmes & Gaming', 'Tournois entre amis', 'Streak gamifié', 'Paris sur GTA 6, esport...'],
  },
  professional: {
    emoji: '👨‍💼',
    label: 'Professionnel',
    description: 'Finance, réseau, analyses',
    ageRange: '25-45 ans',
    avgEarnings: '~500€/mois',
    avgEarningsDetail: 'Les professionnels monétisent leur expertise jusqu\'à 500€/mois 💼',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-600/20 to-indigo-600/10',
    suggestedBubbles: ['trading', 'news', 'main'],
    tagline: '"Monétise ton expertise dès maintenant"',
    missions: ['Poste une analyse → +50⬡', 'Partage un article → +20⬡', 'Bonne prédiction → +200⬡'],
    highlights: ['Bulle Trading premium', 'Portfolio compétitif', 'Prédictions financières', 'Analytics de posts'],
  },
  teacher: {
    emoji: '👩‍🏫',
    label: 'Formateur',
    description: 'Cours, abonnements, quiz',
    ageRange: 'Tout âge',
    avgEarnings: '200-1000€/mois',
    avgEarningsDetail: 'Les formateurs gagnent 200-1000€/mois sur NEXUS 🎓',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    gradient: 'from-cyan-600/20 to-blue-600/10',
    suggestedBubbles: ['education', 'main'],
    tagline: '"Tes 30 élèves = 150€/mois automatiques"',
    missions: ['Poste un cours 60s → +50⬡', 'Crée un quiz → +30⬡', 'Live de cours → +300⬡'],
    highlights: ['Bulle Éducation', 'Abonnements élèves payants', 'Certificats NEXUS', 'Quiz interactifs'],
  },
  gamer: {
    emoji: '🎮',
    label: 'Gamer',
    description: 'Streams, tournois, esport',
    ageRange: '15-35 ans',
    avgEarnings: '100-2000€/mois',
    avgEarningsDetail: 'Les streamers gagnent 100-2000€/mois sur NEXUS 🎮',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    gradient: 'from-red-600/20 to-rose-600/10',
    suggestedBubbles: ['gaming', 'main'],
    tagline: '"Stream sans OBS, gagne des GLYPHS en jouant"',
    missions: ['Poste un clip → +50⬡', 'Rejoins un tournoi → +25⬡', 'Gagne un défi → +200⬡'],
    highlights: ['Bulle Gaming exclusive', 'Tournois NEXUS', 'LFG intégré', 'Paris esport temps réel'],
  },
  creator: {
    emoji: '🎨',
    label: 'Créateur',
    description: 'Contenu viral, fans, monétisation',
    ageRange: 'Tout âge',
    avgEarnings: '500-5000€/mois',
    avgEarningsDetail: 'Les créateurs gagnent 500-5000€/mois sur NEXUS 🎨',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    gradient: 'from-pink-600/20 to-rose-600/10',
    suggestedBubbles: ['main', 'music'],
    tagline: '"Crée, poste, monétise — sans intermédiaire"',
    missions: ['Poste un Reel → +100⬡', 'Obtiens 10 likes → +20⬡', 'Nouvel abonné → +50⬡'],
    highlights: ['Outils création intégrés', 'Tips & cadeaux virtuels', 'Analytics détaillés', 'Boost visibilité'],
  },
  trader: {
    emoji: '📈',
    label: 'Trader',
    description: 'Marchés, prédictions, portfolio',
    ageRange: '20-50 ans',
    avgEarnings: 'Variable en ⬡',
    avgEarningsDetail: 'Les traders gagnent des GLYPHS sur chaque bonne prédiction 📈',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    gradient: 'from-emerald-600/20 to-green-600/10',
    suggestedBubbles: ['trading', 'news'],
    tagline: '"Portfolio virtuel, gains réels en GLYPHS"',
    missions: ['Bonne prédiction → +200⬡', 'Trade profitable → +X⬡', 'Partage une analyse → +30⬡'],
    highlights: ['Bulle Trading premium', 'MODE PRO portfolio', 'Prédictions Polymarket-style', 'Alertes prix'],
  },
  journalist: {
    emoji: '🌍',
    label: 'Journaliste',
    description: 'Actualités, fact-checking, audience',
    ageRange: 'Tout âge',
    avgEarnings: '~300€/mois',
    avgEarningsDetail: 'Les journalistes monétisent via newsletters et abonnements 🌍',
    color: 'text-blue-300',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    gradient: 'from-blue-500/20 to-cyan-600/10',
    suggestedBubbles: ['news', 'main'],
    tagline: '"Touche le monde entier depuis NEXUS"',
    missions: ['Poste un article → +40⬡', 'Article viral → +500⬡', 'Abonné newsletter → +10⬡'],
    highlights: ['Bulle Actu', 'Prométhée fact-checker', 'Audience mondiale', 'Newsletter intégrée'],
  },
  bettor: {
    emoji: '🎰',
    label: 'Parieur',
    description: 'Prédictions, Golden Nugget, cotes',
    ageRange: '18+ uniquement',
    avgEarnings: 'Variable',
    avgEarningsDetail: 'Les meilleurs pronostiqueurs gagnent des milliers de GLYPHS 🎰',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    gradient: 'from-amber-600/20 to-yellow-600/10',
    suggestedBubbles: ['main', 'trading'],
    tagline: '"Paris sur tout — GTA 6, Bitcoin, foot, géopolitique..."',
    missions: ['Place un pari → +25⬡', 'Pari gagnant → ×2-10 mise', 'Golden Nugget vendredi → jackpot'],
    highlights: ['Prédictions Polymarket', 'Golden Nugget vendredi 21h', 'Duels entre amis', 'Classement pronostiqueurs'],
  },
  senior: {
    emoji: '👴',
    label: 'Débutant',
    description: 'Simple, guidé, famille et photos',
    ageRange: '55+ ans',
    avgEarnings: '~20€/mois',
    avgEarningsDetail: 'Partage des photos = gagne des bons cadeaux facilement 👴',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    gradient: 'from-green-600/20 to-emerald-600/10',
    suggestedBubbles: ['main'],
    tagline: '"NEXUS t\'accompagne pas à pas"',
    missions: ['Partage une photo → +10⬡', 'Connecte-toi → +5⬡', 'Regarde une pub → +10⬡'],
    highlights: ['Prométhée guide permanent', 'Interface simplifiée', 'Groupes famille privés', 'Gains expliqués simplement'],
  },
  other: {
    emoji: '✨',
    label: 'Je découvre',
    description: 'Explorer NEXUS à mon rythme',
    ageRange: 'Tout âge',
    avgEarnings: 'À découvrir',
    avgEarningsDetail: 'Découvre toutes les façons de gagner sur NEXUS ✨',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    gradient: 'from-violet-600/20 to-cyan-600/10',
    suggestedBubbles: ['main'],
    tagline: '"Explore tout ce que NEXUS a à offrir"',
    missions: ['Connexion → +5⬡', 'Premier post → +20⬡', 'Explore une bulle → +10⬡'],
    highlights: ['Toutes les bulles disponibles', 'Prométhée guide', 'Missions adaptées', 'Découverte progressive'],
  },
}

const STORAGE_KEY = 'nexus_user_profile'

const INITIAL: UserProfile = {
  type: 'other',
  completedOnboarding: false,
  preferredBubbles: ['main'],
  language: 'fr',
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProfile({ ...INITIAL, ...JSON.parse(raw) })
    } catch {}
    setLoaded(true)
  }, [])

  const save = (updated: UserProfile) => {
    setProfile(updated)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const setProfileType = (type: ProfileType) => {
    save({ ...profile, type, preferredBubbles: PROFILES[type].suggestedBubbles })
  }

  const completeOnboarding = () => save({ ...profile, completedOnboarding: true })

  return {
    profile,
    loaded,
    profileData: PROFILES[profile.type],
    setProfileType,
    completeOnboarding,
    needsOnboarding: loaded && !profile.completedOnboarding,
  }
}
