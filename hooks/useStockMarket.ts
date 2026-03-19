'use client'
import { useState, useEffect, useCallback } from 'react'
import type { StockQuote } from '@/types'

// Country → local exchange mapping
const COUNTRY_EXCHANGES: Record<string, { name: string; flag: string; currency: string; stocks: StockQuote[] }> = {
  FR: {
    name: 'CAC 40 (Paris)',
    flag: '🇫🇷',
    currency: '€',
    stocks: [
      { symbol: 'MC.PA', name: 'LVMH', price: 638.20, change: 8.40, changePercent: 1.33, volume: 420000, type: 'stock' },
      { symbol: 'OR.PA', name: "L'Oréal", price: 345.50, change: -2.10, changePercent: -0.60, volume: 310000, type: 'stock' },
      { symbol: 'TTE.PA', name: 'TotalEnergies', price: 56.82, change: 0.43, changePercent: 0.76, volume: 2800000, type: 'stock' },
      { symbol: 'AIR.PA', name: 'Airbus', price: 158.34, change: 3.22, changePercent: 2.08, volume: 980000, type: 'stock' },
      { symbol: 'BNP.PA', name: 'BNP Paribas', price: 71.28, change: -0.84, changePercent: -1.17, volume: 1500000, type: 'stock' },
    ],
  },
  DE: {
    name: 'DAX (Francfort)',
    flag: '🇩🇪',
    currency: '€',
    stocks: [
      { symbol: 'SAP.DE', name: 'SAP SE', price: 198.42, change: 3.18, changePercent: 1.63, volume: 1200000, type: 'stock' },
      { symbol: 'SIE.DE', name: 'Siemens', price: 174.08, change: -1.46, changePercent: -0.83, volume: 890000, type: 'stock' },
      { symbol: 'BMW.DE', name: 'BMW', price: 82.34, change: 1.22, changePercent: 1.50, volume: 2100000, type: 'stock' },
      { symbol: 'BAYN.DE', name: 'Bayer', price: 29.08, change: -0.54, changePercent: -1.82, volume: 4500000, type: 'stock' },
    ],
  },
  GB: {
    name: 'FTSE 100 (Londres)',
    flag: '🇬🇧',
    currency: '£',
    stocks: [
      { symbol: 'SHEL.L', name: 'Shell', price: 26.84, change: 0.32, changePercent: 1.21, volume: 8900000, type: 'stock' },
      { symbol: 'HSBA.L', name: 'HSBC', price: 8.42, change: -0.08, changePercent: -0.94, volume: 18000000, type: 'stock' },
      { symbol: 'AZN.L', name: 'AstraZeneca', price: 122.50, change: 2.10, changePercent: 1.74, volume: 2300000, type: 'stock' },
      { symbol: 'BP.L', name: 'BP plc', price: 4.82, change: -0.06, changePercent: -1.23, volume: 24000000, type: 'stock' },
    ],
  },
  US: {
    name: 'S&P 500 (New York)',
    flag: '🇺🇸',
    currency: '$',
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 213.49, change: 2.34, changePercent: 1.11, volume: 52400000, type: 'stock' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.40, change: 18.20, changePercent: 2.12, volume: 38900000, type: 'stock' },
      { symbol: 'MSFT', name: 'Microsoft', price: 414.20, change: 3.80, changePercent: 0.93, volume: 21000000, type: 'stock' },
      { symbol: 'AMZN', name: 'Amazon', price: 189.30, change: -1.20, changePercent: -0.63, volume: 31000000, type: 'stock' },
    ],
  },
  JP: {
    name: 'Nikkei 225 (Tokyo)',
    flag: '🇯🇵',
    currency: '¥',
    stocks: [
      { symbol: '7203.T', name: 'Toyota Motor', price: 3248, change: 42, changePercent: 1.31, volume: 8200000, type: 'stock' },
      { symbol: '6758.T', name: 'Sony Group', price: 2891, change: -18, changePercent: -0.62, volume: 3400000, type: 'stock' },
      { symbol: '9984.T', name: 'SoftBank Group', price: 8420, change: 120, changePercent: 1.45, volume: 6100000, type: 'stock' },
    ],
  },
  CA: {
    name: 'TSX (Toronto)',
    flag: '🇨🇦',
    currency: 'CA$',
    stocks: [
      { symbol: 'SHOP.TO', name: 'Shopify', price: 98.42, change: 1.84, changePercent: 1.90, volume: 4200000, type: 'stock' },
      { symbol: 'RY.TO', name: 'Royal Bank', price: 148.30, change: 0.80, changePercent: 0.54, volume: 2800000, type: 'stock' },
    ],
  },
  BE: {
    name: 'BEL 20 (Bruxelles)',
    flag: '🇧🇪',
    currency: '€',
    stocks: [
      { symbol: 'SOLB.BR', name: 'Solvay', price: 24.12, change: 0.34, changePercent: 1.43, volume: 580000, type: 'stock' },
      { symbol: 'UCB.BR', name: 'UCB SA', price: 138.40, change: -1.80, changePercent: -1.28, volume: 290000, type: 'stock' },
    ],
  },
  CH: {
    name: 'SMI (Zurich)',
    flag: '🇨🇭',
    currency: 'CHF',
    stocks: [
      { symbol: 'NESN.SW', name: 'Nestlé SA', price: 84.18, change: 0.22, changePercent: 0.26, volume: 3200000, type: 'stock' },
      { symbol: 'NOVN.SW', name: 'Novartis', price: 98.42, change: 1.08, changePercent: 1.11, volume: 4100000, type: 'stock' },
    ],
  },
}

const DEFAULT_EXCHANGE = COUNTRY_EXCHANGES.US

export interface PriceAlert {
  id: string
  symbol: string
  targetPrice: number
  condition: 'above' | 'below'
  triggered: boolean
  createdAt: number
}

// Deterministic-ish pseudo-random walk for chart history
export function generatePriceHistory(basePrice: number, points: number, volatility = 0.012): number[] {
  const data: number[] = []
  // Start from a slightly different price to end at basePrice
  let current = basePrice * (1 + (Math.random() - 0.5) * volatility * 10)
  for (let i = 0; i < points - 1; i++) {
    const change = current * (Math.random() - 0.48) * volatility
    current = Math.max(current + change, 0.01)
    data.push(current)
  }
  data.push(basePrice)
  return data
}

export interface WatchlistItem {
  symbol: string
  name: string
  type: 'stock' | 'crypto'
  exchange: string
  addedAt: number
}

export function useStockMarket() {
  const [country, setCountry] = useState('US')
  const [exchangeData, setExchangeData] = useState(DEFAULT_EXCHANGE)
  const [cryptoQuotes, setCryptoQuotes] = useState<StockQuote[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 97420, change: 1250, changePercent: 1.30, volume: 28400000000, type: 'crypto' },
    { symbol: 'ETH', name: 'Ethereum', price: 3842, change: -42, changePercent: -1.08, volume: 14200000000, type: 'crypto' },
    { symbol: 'SOL', name: 'Solana', price: 189.40, change: 8.20, changePercent: 4.52, volume: 4800000000, type: 'crypto' },
    { symbol: 'BNB', name: 'Binance Coin', price: 612.30, change: 3.10, changePercent: 0.51, volume: 2100000000, type: 'crypto' },
  ])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [watchlistQuotes, setWatchlistQuotes] = useState<StockQuote[]>([])
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [chartRange, setChartRange] = useState<'1J' | '1S' | '1M' | '1A'>('1J')
  const [loadingCountry, setLoadingCountry] = useState(true)

  // Detect user country via free IP API
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const code: string = data.country_code ?? 'US'
        setCountry(code)
        setExchangeData(COUNTRY_EXCHANGES[code] ?? DEFAULT_EXCHANGE)
      })
      .catch(() => {})
      .finally(() => setLoadingCountry(false))
  }, [])

  // Fetch live crypto from CoinGecko free API (no key needed)
  const fetchCrypto = useCallback(async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd&include_24hr_change=true',
        { cache: 'no-store' }
      )
      if (!res.ok) return
      const data = await res.json()
      const idMap: Record<string, string> = { BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin' }
      setCryptoQuotes(prev => prev.map(q => {
        const id = idMap[q.symbol]
        if (!id || !data[id]) return q
        const newPrice: number = data[id].usd
        const changePercent: number = data[id].usd_24h_change ?? 0
        const change = parseFloat((newPrice * changePercent / 100).toFixed(2))
        return { ...q, price: newPrice, change, changePercent: parseFloat(changePercent.toFixed(2)) }
      }))
      setLastUpdated(new Date())
    } catch {
      // keep mock data on failure, still update timestamp for simulated refresh
      setLastUpdated(new Date())
    }
  }, [])

  useEffect(() => {
    fetchCrypto()
    const interval = setInterval(fetchCrypto, 60000)
    return () => clearInterval(interval)
  }, [fetchCrypto])

  // Simulate stock fluctuations every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeData(prev => ({
        ...prev,
        stocks: prev.stocks.map(q => {
          const flu = (Math.random() - 0.48) * q.price * 0.003
          const newPrice = parseFloat(Math.max(q.price + flu, 0.01).toFixed(2))
          const basePrice = q.price - q.change
          const change = parseFloat((newPrice - basePrice).toFixed(2))
          const changePercent = parseFloat(((change / basePrice) * 100).toFixed(2))
          return { ...q, price: newPrice, change, changePercent }
        }),
      }))
      setLastUpdated(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Check price alerts against current quotes
  useEffect(() => {
    const all = [...cryptoQuotes, ...exchangeData.stocks]
    setAlerts(prev => prev.map(alert => {
      if (alert.triggered) return alert
      const q = all.find(x => x.symbol === alert.symbol)
      if (!q) return alert
      const triggered = alert.condition === 'above' ? q.price >= alert.targetPrice : q.price <= alert.targetPrice
      return { ...alert, triggered }
    }))
  }, [cryptoQuotes, exchangeData.stocks])

  // Load persisted alerts + watchlist on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem('nexus_price_alerts')
      if (raw) setAlerts(JSON.parse(raw))
    } catch {}
    try {
      const raw = localStorage.getItem('nexus_watchlist')
      if (raw) setWatchlist(JSON.parse(raw))
    } catch {}
  }, [])

  // Fetch quotes for watchlist items
  const fetchWatchlistQuotes = useCallback(async (items: WatchlistItem[]) => {
    if (items.length === 0) { setWatchlistQuotes([]); return }
    try {
      const symbols = items.map(i => i.symbol).join('%2C')
      const res = await fetch(`/api/markets?symbols=${symbols}`)
      if (!res.ok) throw new Error()
      const json = await res.json()
      if (json.data) {
        setWatchlistQuotes(json.data.map((q: any) => ({
          symbol: q.symbol,
          name: q.name,
          price: q.price,
          change: q.changeAbs ?? 0,
          changePercent: q.change ?? 0,
          volume: 0,
          type: q.type === 'crypto' ? 'crypto' : 'stock',
        } as StockQuote)))
      }
    } catch {
      // Generate simulated prices for watchlist items
      setWatchlistQuotes(items.map(item => ({
        symbol: item.symbol,
        name: item.name,
        price: 100 + Math.random() * 900,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 4,
        volume: 0,
        type: item.type,
      })))
    }
  }, [])

  useEffect(() => {
    fetchWatchlistQuotes(watchlist)
  }, [watchlist, fetchWatchlistQuotes])

  function addAlert(symbol: string, targetPrice: number, condition: 'above' | 'below') {
    const alert: PriceAlert = { id: `${symbol}-${Date.now()}`, symbol, targetPrice, condition, triggered: false, createdAt: Date.now() }
    const updated = [...alerts, alert]
    setAlerts(updated)
    if (typeof window !== 'undefined') localStorage.setItem('nexus_price_alerts', JSON.stringify(updated))
  }

  function removeAlert(id: string) {
    const updated = alerts.filter(a => a.id !== id)
    setAlerts(updated)
    if (typeof window !== 'undefined') localStorage.setItem('nexus_price_alerts', JSON.stringify(updated))
  }

  function addToWatchlist(item: Omit<WatchlistItem, 'addedAt'>) {
    if (watchlist.find(w => w.symbol === item.symbol)) return
    const updated = [...watchlist, { ...item, addedAt: Date.now() }]
    setWatchlist(updated)
    if (typeof window !== 'undefined') localStorage.setItem('nexus_watchlist', JSON.stringify(updated))
  }

  function removeFromWatchlist(symbol: string) {
    const updated = watchlist.filter(w => w.symbol !== symbol)
    setWatchlist(updated)
    if (typeof window !== 'undefined') localStorage.setItem('nexus_watchlist', JSON.stringify(updated))
  }

  function isInWatchlist(symbol: string) {
    return watchlist.some(w => w.symbol === symbol)
  }

  return {
    country,
    exchangeName: exchangeData.name,
    exchangeFlag: exchangeData.flag,
    currency: exchangeData.currency,
    stockQuotes: exchangeData.stocks,
    cryptoQuotes,
    allQuotes: [...cryptoQuotes, ...exchangeData.stocks],
    lastUpdated,
    chartRange,
    setChartRange,
    alerts,
    addAlert,
    removeAlert,
    watchlist,
    watchlistQuotes,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    loadingCountry,
  }
}
