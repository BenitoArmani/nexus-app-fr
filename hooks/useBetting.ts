'use client'
import { useState, useCallback } from 'react'
import { MOCK_BETTING } from '@/lib/mock-data'
import type { BettingQuestion } from '@/types'

export function useBetting() {
  const [questions, setQuestions] = useState<BettingQuestion[]>(MOCK_BETTING)
  const [coins, setCoins] = useState(2500)

  const placeBet = useCallback((questionId: string, optionId: string, amount: number) => {
    if (amount > coins) return false
    setCoins(prev => prev - amount)
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      return {
        ...q,
        total_pool: q.total_pool + amount,
        options: q.options.map(o => o.id === optionId ? { ...o, total_bets: o.total_bets + amount } : o)
      }
    }))
    return true
  }, [coins])

  return { questions, coins, placeBet }
}
