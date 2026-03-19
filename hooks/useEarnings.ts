'use client'
import { useState } from 'react'
import { MOCK_EARNINGS, MOCK_MONTHLY_EARNINGS } from '@/lib/mock-data'
import type { Earning } from '@/types'

export function useEarnings() {
  const [earnings] = useState<Earning[]>(MOCK_EARNINGS)
  const [monthlyData] = useState(MOCK_MONTHLY_EARNINGS)

  const totalMonth = earnings.reduce((sum, e) => sum + e.amount, 0)
  const monthlyGoal = 500

  const bySource = {
    reels: earnings.filter(e => e.source === 'reels').reduce((s, e) => s + e.amount, 0),
    subscriptions: earnings.filter(e => e.source === 'subscriptions').reduce((s, e) => s + e.amount, 0),
    tips: earnings.filter(e => e.source === 'tips').reduce((s, e) => s + e.amount, 0),
    shop: earnings.filter(e => e.source === 'shop').reduce((s, e) => s + e.amount, 0),
  }

  return { earnings, monthlyData, totalMonth, monthlyGoal, bySource }
}
