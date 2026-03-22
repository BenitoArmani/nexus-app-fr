'use client'
import { useState, useCallback, useEffect } from 'react'
import { MOCK_BETTING } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase'
import type { BettingQuestion } from '@/types'

export function useBetting() {
  const [questions, setQuestions] = useState<BettingQuestion[]>(MOCK_BETTING)
  const [coins, setCoins]         = useState(2500)

  useEffect(() => {
    supabase
      .from('betting_questions')
      .select('*, betting_options(*), users:creator_id(id, username, full_name, avatar_url)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data && data.length > 0 && !error) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: BettingQuestion[] = data.map((q: any) => ({
            id:            q.id,
            creator_id:    q.creator_id,
            question:      q.question,
            total_pool:    q.total_pool ?? 0,
            status:        q.status,
            winner_option: q.winner_option ?? undefined,
            expires_at:    q.expires_at,
            created_at:    q.created_at,
            creator:       q.users ?? undefined,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options: (q.betting_options ?? []).map((o: any) => ({
              id:         o.id,
              label:      o.label,
              odds:       o.odds ?? 2.0,
              total_bets: o.total_bets ?? 0,
            })),
          }))
          setQuestions(mapped)
        }
        // Table doesn't exist or empty → keep mock data as fallback
      })
  }, [])

  const placeBet = useCallback((questionId: string, optionId: string, amount: number) => {
    if (amount > coins) return false
    setCoins(prev => prev - amount)
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      return {
        ...q,
        total_pool: q.total_pool + amount,
        options: q.options.map(o =>
          o.id === optionId ? { ...o, total_bets: o.total_bets + amount } : o
        ),
      }
    }))

    // Persist bet to Supabase — fire-and-forget
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('user_bets').upsert(
        { question_id: questionId, option_id: optionId, user_id: user.id, amount },
        { onConflict: 'question_id,option_id,user_id' }
      ).then(() => {})
    })

    return true
  }, [coins])

  return { questions, coins, placeBet }
}
