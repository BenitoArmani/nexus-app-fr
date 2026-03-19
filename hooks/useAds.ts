'use client'
import { useState, useCallback, useEffect } from 'react'

const COUNT_KEY    = 'nexus_ad_count'
const DATE_KEY     = 'nexus_ad_date'
const COOLDOWN_KEY = 'nexus_ad_cooldown'
const QUOTA_KEY    = 'nexus_ad_quota'
const WEEKLY_KEY   = 'nexus_ad_weekly'   // JSON: { weekStart: string; count: number }

/* Variable cooldown: random between 90 s and 6 min (irrégulier = plus engageant) */
function randomCooldown() {
  return (90 + Math.floor(Math.random() * 270)) * 1000   // 90–360 s
}

export const AD_QUOTA_OPTIONS = [5, 10, 20, 30] as const
export type AdQuota = typeof AD_QUOTA_OPTIONS[number]

/* CPM rewarded video FR ≈ 60 €/1000 → 0,06 €/pub */
export const AD_REVENUE_PER_VIEW = 0.06
/* Lancement 50/50 : l'utilisateur reçoit 50% (0,03 €/pub) */
export const FOUNDER_SHARE = 0.50
/* Après milestone 2 000 membres, part standard = 40% */
export const STANDARD_SHARE = 0.40

const MOCK_MEMBERS = 312   // synced with roadmap

export function useAds() {
  /* ---- daily count ---- */
  const getDailyCount = (): number => {
    if (typeof window === 'undefined') return 0
    const today = new Date().toDateString()
    if (localStorage.getItem(DATE_KEY) !== today) {
      localStorage.setItem(DATE_KEY, today)
      localStorage.setItem(COUNT_KEY, '0')
      return 0
    }
    return parseInt(localStorage.getItem(COUNT_KEY) || '0', 10)
  }

  /* ---- weekly count ---- */
  const getWeeklyData = (): { weekStart: string; count: number } => {
    if (typeof window === 'undefined') return { weekStart: '', count: 0 }
    const raw = localStorage.getItem(WEEKLY_KEY)
    if (!raw) return { weekStart: '', count: 0 }
    try { return JSON.parse(raw) } catch { return { weekStart: '', count: 0 } }
  }

  const getWeekStart = (): string => {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay())
    return d.toDateString()
  }

  const getWeeklyCount = (): number => {
    const data = getWeeklyData()
    if (data.weekStart !== getWeekStart()) return 0
    return data.count
  }

  /* ---- quota ---- */
  const getQuota = (): AdQuota => {
    if (typeof window === 'undefined') return 10
    const stored = parseInt(localStorage.getItem(QUOTA_KEY) || '10', 10)
    return (AD_QUOTA_OPTIONS.includes(stored as AdQuota) ? stored : 10) as AdQuota
  }

  /* ---- cooldown ---- */
  const isInCooldown = (): boolean => {
    if (typeof window === 'undefined') return false
    const lastWatch = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10)
    const nextAllowed = parseInt(localStorage.getItem(COOLDOWN_KEY + '_next') || '0', 10)
    return Date.now() < nextAllowed
  }

  const [dailyCount, setDailyCount] = useState<number>(0)
  const [weeklyCount, setWeeklyCount] = useState<number>(0)
  const [quota, setQuotaState] = useState<AdQuota>(10)
  const [inCooldown, setInCooldown] = useState(false)
  const [cooldownLeft, setCooldownLeft] = useState(0)

  useEffect(() => {
    setDailyCount(getDailyCount())
    setWeeklyCount(getWeeklyCount())
    setQuotaState(getQuota())
    setInCooldown(isInCooldown())
  }, [])

  /* Countdown timer */
  useEffect(() => {
    if (!inCooldown) return
    const interval = setInterval(() => {
      const next = parseInt(localStorage.getItem(COOLDOWN_KEY + '_next') || '0', 10)
      const remaining = Math.max(0, next - Date.now())
      setCooldownLeft(Math.ceil(remaining / 1000))
      if (remaining <= 0) {
        setInCooldown(false)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [inCooldown])

  const isFounderPeriod = MOCK_MEMBERS < 2000
  const userShare = isFounderPeriod ? FOUNDER_SHARE : STANDARD_SHARE

  const canWatch = dailyCount < quota && !inCooldown

  const onAdWatched = useCallback(() => {
    /* Daily count */
    const newDaily = getDailyCount() + 1
    localStorage.setItem(COUNT_KEY, String(newDaily))
    setDailyCount(newDaily)

    /* Weekly count */
    const ws = getWeekStart()
    const wd = getWeeklyData()
    const newWeekly = wd.weekStart === ws ? wd.count + 1 : 1
    localStorage.setItem(WEEKLY_KEY, JSON.stringify({ weekStart: ws, count: newWeekly }))
    setWeeklyCount(newWeekly)

    /* Variable cooldown */
    const cd = randomCooldown()
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
    localStorage.setItem(COOLDOWN_KEY + '_next', String(Date.now() + cd))
    setInCooldown(true)
    setCooldownLeft(Math.ceil(cd / 1000))
  }, [])

  const setQuota = useCallback((q: AdQuota) => {
    localStorage.setItem(QUOTA_KEY, String(q))
    setQuotaState(q)
  }, [])

  /* Weekly earnings estimate in € */
  const weeklyEarnings = +(weeklyCount * AD_REVENUE_PER_VIEW * userShare).toFixed(2)
  /* Monthly projection (based on quota) */
  const monthlyProjection = +(quota * 30 * AD_REVENUE_PER_VIEW * userShare).toFixed(2)

  return {
    canWatch,
    dailyCount,
    weeklyCount,
    quota,
    setQuota,
    inCooldown,
    cooldownLeft,
    onAdWatched,
    isFounderPeriod,
    userShare,
    weeklyEarnings,
    monthlyProjection,
    revenuePerAd: +(AD_REVENUE_PER_VIEW * userShare).toFixed(4),
  }
}
