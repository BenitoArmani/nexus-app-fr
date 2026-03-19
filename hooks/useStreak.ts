'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { soundSystem } from '@/lib/sounds'

interface StreakData {
  current_streak: number
  longest_streak: number
  last_check_in: string | null
  total_glyphs_earned: number
}

export function useStreak(userId: string | null) {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [justCheckedIn, setJustCheckedIn] = useState(false)

  const fetchStreak = useCallback(async () => {
    if (!userId) {
      setStreak({ current_streak: 0, longest_streak: 0, last_check_in: null, total_glyphs_earned: 0 })
      setLoading(false)
      return
    }
    const { data } = await supabase.from('streaks').select('*').eq('user_id', userId).single()
    if (data) setStreak(data)
    else setStreak({ current_streak: 0, longest_streak: 0, last_check_in: null, total_glyphs_earned: 0 })
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchStreak() }, [fetchStreak])

  const checkIn = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const currentStreak = streak?.current_streak ?? 0
    const lastCheckIn = streak?.last_check_in

    if (lastCheckIn === today) return { alreadyCheckedIn: true, glyphs: 0 }

    const isConsecutive = lastCheckIn === yesterday
    const newStreak = isConsecutive ? currentStreak + 1 : 1
    const longestStreak = Math.max(streak?.longest_streak ?? 0, newStreak)

    let glyphsEarned = 5
    if (newStreak === 7) glyphsEarned = 50
    else if (newStreak === 30) glyphsEarned = 200
    else if (newStreak === 100) glyphsEarned = 500

    const newStreakData: StreakData = {
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_check_in: today,
      total_glyphs_earned: (streak?.total_glyphs_earned ?? 0) + glyphsEarned
    }

    if (userId) {
      await supabase.from('streaks').upsert({ user_id: userId, ...newStreakData })
      await supabase.from('glyph_transactions').insert({
        user_id: userId,
        amount: glyphsEarned,
        source: 'streak',
        description: `Streak jour ${newStreak}`
      }).then(() => {})
    }

    setStreak(newStreakData)
    soundSystem?.play(newStreak >= 7 ? 'big_win' : 'glyphs')
    setJustCheckedIn(true)
    setTimeout(() => setJustCheckedIn(false), 3000)

    return { glyphs: glyphsEarned, newStreak }
  }, [userId, streak])

  const isCheckedInToday = streak?.last_check_in === new Date().toISOString().split('T')[0]

  return { streak, loading, checkIn, isCheckedInToday, justCheckedIn }
}
