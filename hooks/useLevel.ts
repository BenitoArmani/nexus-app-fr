'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { soundSystem } from '@/lib/sounds'

export const LEVELS = [
  { level: 1, name: 'Découvreur', min: 0, max: 1000, color: '#6366f1', badge: '🌱' },
  { level: 2, name: 'Explorateur', min: 1000, max: 5000, color: '#06b6d4', badge: '🔵' },
  { level: 3, name: 'Créateur', min: 5000, max: 15000, color: '#8b5cf6', badge: '⭐' },
  { level: 4, name: 'Influenceur', min: 15000, max: 50000, color: '#ec4899', badge: '💎' },
  { level: 5, name: 'Légende NEXUS', min: 50000, max: Infinity, color: '#f59e0b', badge: '👑' },
]

export function getLevelInfo(totalGlyphs: number) {
  return LEVELS.find(l => totalGlyphs >= l.min && totalGlyphs < l.max) ?? LEVELS[LEVELS.length - 1]
}

export function getProgressToNextLevel(totalGlyphs: number) {
  const current = getLevelInfo(totalGlyphs)
  if (current.level === 5) return 100
  return Math.min(((totalGlyphs - current.min) / (current.max - current.min)) * 100, 100)
}

export function useLevel(userId: string | null) {
  const [totalGlyphs, setTotalGlyphs] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase.from('user_levels').select('total_glyphs_earned').eq('user_id', userId).single()
      .then(({ data }) => {
        if (data) setTotalGlyphs(data.total_glyphs_earned)
        setLoading(false)
      })
  }, [userId])

  const currentLevel = getLevelInfo(totalGlyphs)
  const progress = getProgressToNextLevel(totalGlyphs)
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1)

  return { totalGlyphs, currentLevel, nextLevel, progress, loading }
}
