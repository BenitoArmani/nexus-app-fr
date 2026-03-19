'use client'
import { useCallback } from 'react'
import { useGlyphs } from './useGlyphs'

export type RewardEvent =
  | 'ad_watched'
  | 'like_received'
  | 'comment_received'
  | 'new_subscriber'
  | 'friend_invited'
  | 'daily_login'
  | 'streak_7days'
  | 'live_viewer_10plus'
  | 'reel_10k_views'

const REWARDS: Record<RewardEvent, { amount: number; label: string }> = {
  ad_watched:         { amount: 10,  label: 'Pub regardée' },
  like_received:      { amount: 1,   label: 'Like reçu' },
  comment_received:   { amount: 2,   label: 'Commentaire reçu' },
  new_subscriber:     { amount: 50,  label: 'Nouvel abonné' },
  friend_invited:     { amount: 500, label: 'Ami invité' },
  daily_login:        { amount: 5,   label: 'Connexion journalière' },
  streak_7days:       { amount: 50,  label: 'Streak 7 jours' },
  live_viewer_10plus: { amount: 5,   label: 'Live +10 spectateurs' },
  reel_10k_views:     { amount: 200, label: 'Reel 10k vues' },
}

const AD_CAP_KEY = 'nexus_ad_glyphs_today'
const AD_CAP_DATE_KEY = 'nexus_ad_date'
const AD_DAILY_CAP = 500

export function useRewards() {
  const { addGlyphs } = useGlyphs()

  const triggerReward = useCallback((event: RewardEvent, isBrave = false) => {
    let { amount, label } = REWARDS[event]

    if (event === 'ad_watched') {
      const today = new Date().toDateString()
      const savedDate = localStorage.getItem(AD_CAP_DATE_KEY)
      if (savedDate !== today) {
        localStorage.setItem(AD_CAP_DATE_KEY, today)
        localStorage.setItem(AD_CAP_KEY, '0')
      }
      const earned = parseInt(localStorage.getItem(AD_CAP_KEY) || '0', 10)
      if (earned >= AD_DAILY_CAP) return
      if (isBrave) { amount *= 2; label += ' (Brave x2)' }
      const newEarned = Math.min(earned + amount, AD_DAILY_CAP)
      localStorage.setItem(AD_CAP_KEY, String(newEarned))
      addGlyphs(amount, label)
    } else {
      addGlyphs(amount, label)
    }
  }, [addGlyphs])

  const getDailyAdEarned = () => {
    if (typeof window === 'undefined') return 0
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem(AD_CAP_DATE_KEY)
    if (savedDate !== today) return 0
    return parseInt(localStorage.getItem(AD_CAP_KEY) || '0', 10)
  }

  return { triggerReward, getDailyAdEarned, AD_DAILY_CAP }
}
