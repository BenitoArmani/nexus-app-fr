'use client'
import { useState, useEffect } from 'react'
import { MOCK_STOCKS, MOCK_PORTFOLIO } from '@/lib/mock-data'
import type { StockQuote, PortfolioHolding } from '@/types'

export function useMarkets() {
  const [quotes, setQuotes] = useState<StockQuote[]>(MOCK_STOCKS)
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>(MOCK_PORTFOLIO)
  const [virtualCash, setVirtualCash] = useState(10000)
  const [tab, setTab] = useState<'stocks' | 'crypto'>('stocks')

  // Simule des fluctuations de prix toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuotes(prev => prev.map(q => {
        const fluctuation = (Math.random() - 0.48) * q.price * 0.005
        const newPrice = Math.max(q.price + fluctuation, 0.01)
        const change = newPrice - (q.price - q.change)
        const changePercent = (change / (q.price - q.change)) * 100
        return { ...q, price: parseFloat(newPrice.toFixed(2)), change: parseFloat(change.toFixed(2)), changePercent: parseFloat(changePercent.toFixed(2)) }
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const totalValue = portfolio.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0)
  const totalCost = portfolio.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0)
  const totalPnL = totalValue - totalCost
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0

  const filteredQuotes = quotes.filter(q => tab === 'stocks' ? q.type === 'stock' : q.type === 'crypto')

  return { quotes: filteredQuotes, allQuotes: quotes, portfolio, virtualCash, totalValue, totalPnL, totalPnLPercent, tab, setTab }
}
