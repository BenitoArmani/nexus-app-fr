'use client'
import { useState, useEffect, useCallback } from 'react'
import { soundSystem } from '@/lib/sounds'

export interface VirtualHolding {
  symbol: string
  name: string
  quantity: number
  avgBuyPrice: number
  currentPrice: number
  type: 'stock' | 'crypto'
  glyphsStaked?: number // PRO mode: glyphs staked on this holding
}

export interface VirtualTransaction {
  id: string
  type: 'buy' | 'sell'
  symbol: string
  name: string
  quantity: number
  price: number
  total: number
  pnl?: number
  glyphsDelta?: number // PRO mode: glyphs gained (+) or lost (-)
  timestamp: number
}

export interface PortfolioState {
  cash: number
  holdings: VirtualHolding[]
  transactions: VirtualTransaction[]
  totalGlyphsEarned: number
  startDate: number
  portfolioMode: 'beginner' | 'pro'
  weeklyGlyphsStaked: number
  weeklyStakeReset: number // timestamp of next Monday midnight reset
}

export const MAX_WEEKLY_PRO_GLYPHS = 1000

function getNextMonday(): number {
  const now = new Date()
  const day = now.getDay() // 0=Sun
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7 || 7
  const next = new Date(now)
  next.setDate(now.getDate() + daysUntilMonday)
  next.setHours(0, 0, 0, 0)
  return next.getTime()
}

const INITIAL_STATE: PortfolioState = {
  cash: 10000,
  holdings: [],
  transactions: [],
  totalGlyphsEarned: 0,
  startDate: Date.now(),
  portfolioMode: 'beginner',
  weeklyGlyphsStaked: 0,
  weeklyStakeReset: getNextMonday(),
}

const STORAGE_KEY = 'nexus_virtual_portfolio'

function loadState(): PortfolioState {
  if (typeof window === 'undefined') return INITIAL_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Reset weekly stake if past reset time
      if (parsed.weeklyStakeReset && Date.now() > parsed.weeklyStakeReset) {
        parsed.weeklyGlyphsStaked = 0
        parsed.weeklyStakeReset = getNextMonday()
      }
      return { ...INITIAL_STATE, ...parsed }
    }
  } catch {}
  return INITIAL_STATE
}

function saveState(state: PortfolioState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useVirtualPortfolio() {
  const [state, setState] = useState<PortfolioState>(INITIAL_STATE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setState(loadState())
    setLoaded(true)
  }, [])

  const updatePrices = useCallback((prices: Record<string, number>) => {
    setState(prev => {
      const updated = {
        ...prev,
        holdings: prev.holdings.map(h => ({
          ...h,
          currentPrice: prices[h.symbol] ?? h.currentPrice,
        }))
      }
      saveState(updated)
      return updated
    })
  }, [])

  const setPortfolioMode = useCallback((mode: 'beginner' | 'pro') => {
    setState(prev => {
      const updated = { ...prev, portfolioMode: mode }
      saveState(updated)
      return updated
    })
  }, [])

  const buy = useCallback((
    symbol: string, name: string, price: number,
    quantity: number, type: 'stock' | 'crypto' = 'stock',
    glyphsStake = 0
  ) => {
    const total = price * quantity
    setState(prev => {
      if (prev.cash < total) return prev

      // PRO mode: check weekly stake limit
      if (prev.portfolioMode === 'pro' && glyphsStake > 0) {
        if (prev.weeklyGlyphsStaked + glyphsStake > MAX_WEEKLY_PRO_GLYPHS) return prev
      }

      const existing = prev.holdings.find(h => h.symbol === symbol)
      let newHoldings: VirtualHolding[]

      if (existing) {
        const newQty = existing.quantity + quantity
        const newAvg = ((existing.avgBuyPrice * existing.quantity) + (price * quantity)) / newQty
        const newStake = (existing.glyphsStaked ?? 0) + glyphsStake
        newHoldings = prev.holdings.map(h =>
          h.symbol === symbol
            ? { ...h, quantity: newQty, avgBuyPrice: newAvg, currentPrice: price, glyphsStaked: newStake }
            : h
        )
      } else {
        newHoldings = [...prev.holdings, { symbol, name, quantity, avgBuyPrice: price, currentPrice: price, type, glyphsStaked: glyphsStake }]
      }

      const tx: VirtualTransaction = {
        id: `${symbol}-buy-${Date.now()}`,
        type: 'buy',
        symbol,
        name,
        quantity,
        price,
        total,
        glyphsDelta: prev.portfolioMode === 'pro' && glyphsStake > 0 ? -glyphsStake : undefined,
        timestamp: Date.now(),
      }

      const updated = {
        ...prev,
        cash: prev.cash - total,
        holdings: newHoldings,
        transactions: [tx, ...prev.transactions].slice(0, 100),
        weeklyGlyphsStaked: prev.portfolioMode === 'pro'
          ? prev.weeklyGlyphsStaked + glyphsStake
          : prev.weeklyGlyphsStaked,
      }
      saveState(updated)
      soundSystem?.play('glyphs')
      return updated
    })
  }, [])

  const sell = useCallback((symbol: string, price: number, quantity: number) => {
    setState(prev => {
      const holding = prev.holdings.find(h => h.symbol === symbol)
      if (!holding || holding.quantity < quantity) return prev

      const total = price * quantity
      const pnl = (price - holding.avgBuyPrice) * quantity

      let newHoldings: VirtualHolding[]
      if (holding.quantity === quantity) {
        newHoldings = prev.holdings.filter(h => h.symbol !== symbol)
      } else {
        newHoldings = prev.holdings.map(h =>
          h.symbol === symbol ? { ...h, quantity: h.quantity - quantity, currentPrice: price } : h
        )
      }

      let glyphsDelta = 0
      let glyphsEarned = prev.totalGlyphsEarned

      if (prev.portfolioMode === 'beginner') {
        // Beginner: only earn GLYPHS on profit (1G per €10)
        if (pnl > 0) {
          glyphsDelta = Math.floor(pnl / 10)
          glyphsEarned += glyphsDelta
          if (glyphsDelta > 50) soundSystem?.play('big_win')
          else if (glyphsDelta > 0) soundSystem?.play('success')
        }
      } else {
        // PRO mode: stake proportional to the fraction being sold
        const sellRatio = quantity / holding.quantity
        const stakeForSell = Math.floor((holding.glyphsStaked ?? 0) * sellRatio)

        if (pnl > 0) {
          // Win: get stake back + profit glyphs
          glyphsDelta = stakeForSell + Math.floor(pnl / 10)
          glyphsEarned += glyphsDelta
          if (glyphsDelta > 50) soundSystem?.play('big_win')
          else soundSystem?.play('success')
        } else if (pnl < 0) {
          // Loss: lose staked glyphs
          glyphsDelta = -stakeForSell
          glyphsEarned = Math.max(0, glyphsEarned + glyphsDelta)
          soundSystem?.play('error')
        } else {
          // Break even: get stake back
          glyphsDelta = stakeForSell
          glyphsEarned += glyphsDelta
        }
      }

      const tx: VirtualTransaction = {
        id: `${symbol}-sell-${Date.now()}`,
        type: 'sell',
        symbol,
        name: holding.name,
        quantity,
        price,
        total,
        pnl,
        glyphsDelta: glyphsDelta !== 0 ? glyphsDelta : undefined,
        timestamp: Date.now(),
      }

      const updated = {
        ...prev,
        cash: prev.cash + total,
        holdings: newHoldings,
        transactions: [tx, ...prev.transactions].slice(0, 100),
        totalGlyphsEarned: glyphsEarned,
      }
      saveState(updated)
      return updated
    })
  }, [])

  const reset = useCallback(() => {
    setState(prev => {
      const fresh: PortfolioState = {
        ...INITIAL_STATE,
        startDate: Date.now(),
        portfolioMode: prev.portfolioMode,
        weeklyStakeReset: getNextMonday(),
      }
      saveState(fresh)
      return fresh
    })
  }, [])

  // Computed values
  const totalInvested = state.holdings.reduce((s, h) => s + h.quantity * h.avgBuyPrice, 0)
  const totalValue = state.holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0)
  const totalPnL = totalValue - totalInvested
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0
  const portfolioTotal = totalValue + state.cash
  const allTimeReturn = portfolioTotal - 10000
  const allTimeReturnPercent = (allTimeReturn / 10000) * 100
  const remainingWeeklyGlyphs = MAX_WEEKLY_PRO_GLYPHS - state.weeklyGlyphsStaked

  return {
    ...state,
    loaded,
    totalInvested,
    totalValue,
    totalPnL,
    totalPnLPercent,
    portfolioTotal,
    allTimeReturn,
    allTimeReturnPercent,
    remainingWeeklyGlyphs,
    MAX_WEEKLY_PRO_GLYPHS,
    buy,
    sell,
    reset,
    updatePrices,
    setPortfolioMode,
  }
}
