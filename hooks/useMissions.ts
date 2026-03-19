'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { soundSystem } from '@/lib/sounds'

export interface Mission {
  id: string
  key: string
  type: 'daily' | 'weekly'
  title: string
  description: string
  reward_glyphs: number
  target_count: number
  emoji: string
  progress: number
  completed: boolean
}

const DEFAULT_DAILY: Mission[] = [
  { id: 'd1', key: 'post', type: 'daily', title: 'Poste quelque chose', description: 'Publie un post aujourd\'hui', reward_glyphs: 20, target_count: 1, emoji: '📝', progress: 0, completed: false },
  { id: 'd2', key: 'like', type: 'daily', title: 'Like 5 posts', description: 'Aime 5 publications', reward_glyphs: 10, target_count: 5, emoji: '❤️', progress: 0, completed: false },
  { id: 'd3', key: 'comment', type: 'daily', title: 'Commente 3 posts', description: 'Laisse 3 commentaires', reward_glyphs: 15, target_count: 3, emoji: '💬', progress: 0, completed: false },
  { id: 'd4', key: 'watch_ad', type: 'daily', title: 'Regarde 10 pubs', description: 'Regarde 10 publicités', reward_glyphs: 30, target_count: 10, emoji: '📺', progress: 0, completed: false },
  { id: 'd5', key: 'bet', type: 'daily', title: 'Place un pari', description: 'Participe à un pari', reward_glyphs: 25, target_count: 1, emoji: '🎰', progress: 0, completed: false },
]

const DEFAULT_WEEKLY: Mission[] = [
  { id: 'w1', key: 'reel', type: 'weekly', title: 'Poste 3 Reels', description: 'Publie 3 vidéos cette semaine', reward_glyphs: 200, target_count: 3, emoji: '🎬', progress: 0, completed: false },
  { id: 'w2', key: 'invite', type: 'weekly', title: 'Invite un ami', description: 'Parraine 1 nouvelle personne', reward_glyphs: 500, target_count: 1, emoji: '👥', progress: 0, completed: false },
  { id: 'w3', key: 'live', type: 'weekly', title: 'Fais un live', description: 'Démarre un stream live', reward_glyphs: 300, target_count: 1, emoji: '🔴', progress: 0, completed: false },
]

export function useMissions(userId: string | null) {
  const [dailyMissions, setDailyMissions] = useState<Mission[]>(DEFAULT_DAILY)
  const [weeklyMissions, setWeeklyMissions] = useState<Mission[]>(DEFAULT_WEEKLY)
  const [loading, setLoading] = useState(false)

  const incrementMission = useCallback(async (key: string, amount = 1) => {
    const update = (missions: Mission[]) => missions.map(m => {
      if (m.key !== key || m.completed) return m
      const newProgress = Math.min(m.progress + amount, m.target_count)
      const completed = newProgress >= m.target_count
      if (completed && !m.completed) soundSystem?.play('mission_complete')
      return { ...m, progress: newProgress, completed }
    })
    setDailyMissions(update)
    setWeeklyMissions(update)
  }, [])

  return { dailyMissions, weeklyMissions, loading, incrementMission }
}
