'use client'
import { useState, useEffect } from 'react'

export interface Bubble {
  id: string
  emoji: string
  label: string
  color: string
  bgColor: string
  borderColor: string
  accentColor: string
  free: boolean
  cost?: number
  description: string
}

export const DEFAULT_BUBBLES: Bubble[] = [
  {
    id: 'main',
    emoji: '🌍',
    label: 'Principal',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/20',
    borderColor: 'border-violet-500/50',
    accentColor: '#8b5cf6',
    free: true,
    description: 'Feed complet · Tout le contenu',
  },
  {
    id: 'trading',
    emoji: '📈',
    label: 'Trading',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50',
    accentColor: '#10b981',
    free: true,
    description: 'Bourse, crypto, finance',
  },
  {
    id: 'news',
    emoji: '📰',
    label: 'Actu',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    accentColor: '#3b82f6',
    free: true,
    description: 'Actualités locales & mondiales',
  },
  {
    id: 'gaming',
    emoji: '🎮',
    label: 'Gaming',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    accentColor: '#ef4444',
    free: false,
    cost: 200,
    description: 'Gaming, esport, streams',
  },
  {
    id: 'memes',
    emoji: '😂',
    label: 'Mèmes',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    accentColor: '#f59e0b',
    free: false,
    cost: 200,
    description: 'Mèmes, humour, fun',
  },
  {
    id: 'music',
    emoji: '🎵',
    label: 'Musique',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/50',
    accentColor: '#ec4899',
    free: false,
    cost: 200,
    description: 'Clips, concerts, playlists',
  },
  {
    id: 'education',
    emoji: '🎓',
    label: 'Éducation',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/50',
    accentColor: '#06b6d4',
    free: false,
    cost: 200,
    description: 'Cours, tutoriels, science',
  },
  {
    id: 'kawaii',
    emoji: '🌸',
    label: 'Kawaii',
    color: 'text-pink-300',
    bgColor: 'bg-pink-400/15',
    borderColor: 'border-pink-400/50',
    accentColor: '#f9a8d4',
    free: false,
    cost: 200,
    description: 'Anime, manga, kawaii 🐱',
  },
]

const STORAGE_KEY = 'nexus_active_bubble'
const UNLOCKED_KEY = 'nexus_unlocked_bubbles'

export function useBubbles() {
  const [activeBubbleId, setActiveBubbleId] = useState('main')
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['main', 'trading', 'news'])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setActiveBubbleId(saved)
    const savedUnlocked = localStorage.getItem(UNLOCKED_KEY)
    if (savedUnlocked) setUnlockedIds(JSON.parse(savedUnlocked))
  }, [])

  const switchBubble = (id: string) => {
    setActiveBubbleId(id)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, id)
  }

  const unlockBubble = (id: string) => {
    const updated = [...unlockedIds, id]
    setUnlockedIds(updated)
    if (typeof window !== 'undefined') localStorage.setItem(UNLOCKED_KEY, JSON.stringify(updated))
  }

  const isUnlocked = (id: string) => {
    const bubble = DEFAULT_BUBBLES.find(b => b.id === id)
    return (bubble?.free ?? false) || unlockedIds.includes(id)
  }

  const activeBubble = DEFAULT_BUBBLES.find(b => b.id === activeBubbleId) ?? DEFAULT_BUBBLES[0]

  return { activeBubbleId, activeBubble, switchBubble, unlockBubble, isUnlocked }
}
