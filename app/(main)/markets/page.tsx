'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, RefreshCw, Bell, BellOff, X, Plus, ChevronRight, Database, Wifi, Search, Star, StarOff, Loader2 } from 'lucide-react'
import { useMarkets } from '@/hooks/useMarkets'
import { useStockMarket } from '@/hooks/useStockMarket'
import { useVirtualPortfolio } from '@/hooks/useVirtualPortfolio'
import MarketChart from '@/components/markets/MarketChart'
import { BuyModal } from '@/components/markets/BuyModal'
import { PortfolioPanel } from '@/components/markets/PortfolioPanel'
import { formatNumber } from '@/lib/utils'
import type { StockQuote } from '@/types'

type ChartRange = '1J' | '1S' | '1M' | '1A'

function PriceChange({ value, percent }: { value: number; percent: number }) {
  const up = value >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {up ? '+' : ''}{value.toFixed(2)} ({up ? '+' : ''}{percent.toFixed(2)}%)
    </span>
  )
}

function AlertForm({ symbol, onAdd }: { symbol: string; onAdd: (symbol: string, price: number, condition: 'above' | 'below') => void }) {
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState<'above' | 'below'>('above')
  return (
    <div className="flex gap-2 mt-2">
      <select
        value={condition}
        onChange={e => setCondition(e.target.value as 'above' | 'below')}
        className="bg-surface-3 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-text-primary focus:outline-none"
      >
        <option value="above">≥ (au-dessus)</option>
        <option value="below">≤ (en-dessous)</option>
      </select>
      <input
        type="number" step="any" value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="Prix cible"
        className="flex-1 bg-surface-3 border border-white/5 rounded-xl px-2 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-violet-500/50"
      />
      <button
        onClick={() => {
          const p = parseFloat(price)
          if (!isNaN(p) && p > 0) { onAdd(symbol, p, condition); setPrice('') }
        }}
        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl transition-colors"
      >
        <Plus size={12} />
      </button>
    </div>
  )
}

interface SearchResult {
  symbol: string
  name: string
  type: 'stock' | 'crypto'
  exchange: string
}

export default function MarketsPage() {
  const { portfolio, virtualCash, totalValue, totalPnL, totalPnLPercent, allQuotes: _allQuotes } = useMarkets()
  const {
    exchangeName, exchangeFlag, currency, stockQuotes, cryptoQuotes,
    lastUpdated, chartRange, setChartRange, alerts, addAlert, removeAlert,
    watchlist, watchlistQuotes, addToWatchlist, removeFromWatchlist, isInWatchlist,
    loadingCountry,
  } = useStockMarket()
  const portfolio2 = useVirtualPortfolio()

  const [tab, setTab] = useState<'stocks' | 'crypto' | 'watchlist'>('crypto')
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null)
  const [showAlertForm, setShowAlertForm] = useState<string | null>(null)
  const [buyQuote, setBuyQuote] = useState<StockQuote | null>(null)
  const [apiSource, setApiSource] = useState<'yahoo' | 'simulated' | null>(null)
  const [apiTimestamp, setApiTimestamp] = useState<number | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 1) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/markets/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setSearchResults(data.results ?? [])
      } catch { setSearchResults([]) }
      setSearching(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Poll /api/markets every 60 seconds
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch('/api/markets')
        if (res.ok) {
          const json = await res.json()
          setApiSource(json.source)
          setApiTimestamp(json.timestamp)
        }
      } catch {}
    }
    fetchMarkets()
    const interval = setInterval(fetchMarkets, 60000)
    return () => clearInterval(interval)
  }, [])

  const portfolioTotal = totalValue + virtualCash
  const timeStr = lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  // Crypto: BTC + ETH always first
  const sortedCrypto = [...cryptoQuotes].sort((a, b) => {
    if (a.symbol === 'BTC') return -1
    if (b.symbol === 'BTC') return 1
    if (a.symbol === 'ETH') return -1
    if (b.symbol === 'ETH') return 1
    return 0
  })

  // Update virtual portfolio prices when quotes change
  useEffect(() => {
    const prices: Record<string, number> = {}
    ;[...sortedCrypto, ...stockQuotes, ...watchlistQuotes].forEach(q => { prices[q.symbol] = q.price })
    portfolio2.updatePrices(prices)
  }, [sortedCrypto, stockQuotes, watchlistQuotes])

  const quotes = tab === 'crypto' ? sortedCrypto : tab === 'watchlist' ? watchlistQuotes : stockQuotes
  const sym = (q: StockQuote) => q.type === 'crypto' ? '$' : currency

  const RANGES: ChartRange[] = ['1J', '1S', '1M', '1A']

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-text-primary">📈 Bourse & Crypto</h1>
          <p className="text-text-muted text-sm mt-0.5">
            {loadingCountry ? (
              <span className="text-text-muted animate-pulse">Détection du pays...</span>
            ) : (
              <span>{exchangeFlag} Bourse locale : <span className="text-violet-400 font-semibold">{exchangeName}</span></span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {apiSource && (
            <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border ${apiSource === 'yahoo' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
              {apiSource === 'yahoo' ? <Wifi size={11} /> : <Database size={11} />}
              <span>{apiSource === 'yahoo' ? 'Yahoo Finance' : 'Simulé'}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-surface-2 border border-white/5 rounded-xl px-3 py-1.5">
            <RefreshCw size={11} className="animate-spin [animation-duration:3s]" />
            <span>Live · {timeStr}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: quotes + chart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-surface-2 border border-white/5 rounded-2xl px-4 py-2.5 focus-within:border-violet-500/50 transition-colors">
              <Search size={15} className="text-text-muted shrink-0" />
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Rechercher une action, crypto, ETF... (ex: TSLA, BTC, LVMH)"
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              {searching && <Loader2 size={14} className="animate-spin text-text-muted shrink-0" />}
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false) }} className="text-text-muted hover:text-text-primary">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            <AnimatePresence>
              {searchOpen && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-surface-2 border border-white/10 rounded-2xl overflow-hidden z-50 shadow-xl"
                >
                  {searchResults.map(r => (
                    <div key={r.symbol} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-text-primary shrink-0">
                        {r.symbol.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary">{r.symbol}</p>
                        <p className="text-xs text-text-muted truncate">{r.name} · {r.exchange}</p>
                      </div>
                      <button
                        onClick={() => {
                          if (isInWatchlist(r.symbol)) {
                            removeFromWatchlist(r.symbol)
                          } else {
                            addToWatchlist({ symbol: r.symbol, name: r.name, type: r.type, exchange: r.exchange })
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          isInWatchlist(r.symbol)
                            ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                            : 'bg-surface-3 text-text-muted hover:bg-violet-500/10 hover:text-violet-400 border border-white/5'
                        }`}
                      >
                        {isInWatchlist(r.symbol) ? <><Star size={11} fill="currentColor" /> Suivi</> : <><Plus size={11} /> Suivre</>}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'crypto', label: '₿ Crypto' },
              { key: 'stocks', label: `📊 Actions ${exchangeFlag}` },
              { key: 'watchlist', label: `⭐ Ma liste (${watchlist.length})` },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => { setTab(key as typeof tab); setSelectedQuote(null); setSearchOpen(false) }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === key ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'text-text-muted hover:bg-white/5'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Selected quote — expanded chart view */}
          <AnimatePresence>
            {selectedQuote && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-surface-2 border border-violet-500/20 rounded-2xl p-5 overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-text-primary">{selectedQuote.name}</h3>
                      <span className="text-xs text-text-muted bg-surface-3 rounded-lg px-2 py-0.5">{selectedQuote.symbol}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-2xl font-black text-text-primary">
                        {sym(selectedQuote)}{selectedQuote.price.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                      </span>
                      <PriceChange value={selectedQuote.change} percent={selectedQuote.changePercent} />
                    </div>
                  </div>
                  <button onClick={() => setSelectedQuote(null)} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-text-muted">
                    <X size={14} />
                  </button>
                </div>

                {/* Time range selector */}
                <div className="flex gap-1 mb-3">
                  {RANGES.map(r => (
                    <button key={r} onClick={() => setChartRange(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${chartRange === r ? 'bg-violet-500/20 text-violet-400' : 'text-text-muted hover:bg-white/5'}`}>
                      {r}
                    </button>
                  ))}
                </div>

                {/* Chart */}
                <div className="w-full">
                  <MarketChart
                    symbol={selectedQuote.symbol}
                    basePrice={selectedQuote.price}
                    change={selectedQuote.change}
                    changePercent={selectedQuote.changePercent}
                    range={chartRange}
                    width={520}
                    height={140}
                  />
                </div>

                {/* Alert form */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setShowAlertForm(showAlertForm === selectedQuote.symbol ? null : selectedQuote.symbol)}
                    className="flex items-center gap-1.5 text-xs text-violet-400 font-semibold hover:text-violet-300"
                  >
                    <Bell size={12} />
                    {showAlertForm === selectedQuote.symbol ? 'Annuler' : 'Créer une alerte de prix'}
                  </button>
                  {showAlertForm === selectedQuote.symbol && (
                    <AlertForm symbol={selectedQuote.symbol} onAdd={(s, p, c) => { addAlert(s, p, c); setShowAlertForm(null) }} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty watchlist state */}
          {tab === 'watchlist' && watchlist.length === 0 && (
            <div className="bg-surface-2 border border-white/5 rounded-2xl p-10 text-center">
              <Star size={28} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-text-primary mb-1">Ta liste est vide</p>
              <p className="text-xs text-text-muted">Recherche une action ou crypto ci-dessus et clique sur <strong className="text-violet-400">Suivre</strong></p>
            </div>
          )}

          {/* Quotes list */}
          {(tab !== 'watchlist' || watchlist.length > 0) && (
          <div className="bg-surface-2 border border-white/5 rounded-2xl overflow-hidden" onClick={() => setSearchOpen(false)}>
            {quotes.map((q, i) => (
              <motion.div
                key={q.symbol}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => { setSelectedQuote(selectedQuote?.symbol === q.symbol ? null : q); setBuyQuote(q); setSearchOpen(false) }}
                className={`flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors cursor-pointer ${selectedQuote?.symbol === q.symbol ? 'bg-violet-500/5' : ''}`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-text-primary flex-shrink-0 ${q.symbol === 'BTC' ? 'bg-amber-500/20 text-amber-400' : q.symbol === 'ETH' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20'}`}>
                  {q.symbol === 'BTC' ? '₿' : q.symbol === 'ETH' ? 'Ξ' : q.symbol.slice(0, 2)}
                </div>

                {/* Name + symbol */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-text-primary">{q.symbol}</p>
                    {(q.symbol === 'BTC' || q.symbol === 'ETH') && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 rounded-full px-1.5 py-0.5 font-semibold">TOP</span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate">{q.name}</p>
                </div>

                {/* Sparkline */}
                <div className="hidden sm:block w-20 h-10 flex-shrink-0">
                  <MarketChart
                    symbol={q.symbol} basePrice={q.price} change={q.change}
                    changePercent={q.changePercent} range="1J"
                    width={80} height={36} showArea={false}
                  />
                </div>

                {/* Price + change */}
                <div className="text-right flex-shrink-0 min-w-[90px]">
                  <p className="text-sm font-bold text-text-primary">
                    {sym(q)}{q.price >= 10000
                      ? q.price.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
                      : q.price.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                  </p>
                  <PriceChange value={q.change} percent={q.changePercent} />
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation()
                    if (isInWatchlist(q.symbol)) removeFromWatchlist(q.symbol)
                    else addToWatchlist({ symbol: q.symbol, name: q.name, type: q.type, exchange: '' })
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${isInWatchlist(q.symbol) ? 'text-yellow-400 hover:text-zinc-500' : 'text-zinc-700 hover:text-yellow-400'}`}
                  title={isInWatchlist(q.symbol) ? 'Retirer de la liste' : 'Ajouter à ma liste'}
                >
                  <Star size={13} fill={isInWatchlist(q.symbol) ? 'currentColor' : 'none'} />
                </button>
                <ChevronRight size={14} className="text-text-muted flex-shrink-0" />
              </motion.div>
            ))}
          </div>
          )}

          {/* Active Alerts */}
          {alerts.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-surface-2 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={14} className="text-violet-400" />
                <h3 className="text-sm font-bold text-text-primary">Alertes de prix actives</h3>
              </div>
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${a.triggered ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-surface-3 border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      {a.triggered
                        ? <Bell size={13} className="text-emerald-400" />
                        : <BellOff size={13} className="text-text-muted" />}
                      <span className="text-xs font-semibold text-text-primary">{a.symbol}</span>
                      <span className="text-xs text-text-muted">
                        {a.condition === 'above' ? '≥' : '≤'} {a.targetPrice.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
                      </span>
                      {a.triggered && <span className="text-xs text-emerald-400 font-semibold">Déclenché !</span>}
                    </div>
                    <button onClick={() => removeAlert(a.id)} className="text-text-muted hover:text-rose-400">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: virtual portfolio */}
        <div className="space-y-4">
          <PortfolioPanel
            cash={portfolio2.cash}
            holdings={portfolio2.holdings}
            transactions={portfolio2.transactions}
            portfolioTotal={portfolio2.portfolioTotal}
            totalPnL={portfolio2.totalPnL}
            totalPnLPercent={portfolio2.totalPnLPercent}
            allTimeReturn={portfolio2.allTimeReturn}
            allTimeReturnPercent={portfolio2.allTimeReturnPercent}
            totalGlyphsEarned={portfolio2.totalGlyphsEarned}
            portfolioMode={portfolio2.portfolioMode}
            weeklyGlyphsStaked={portfolio2.weeklyGlyphsStaked}
            remainingWeeklyGlyphs={portfolio2.remainingWeeklyGlyphs}
            onReset={portfolio2.reset}
            onSelectHolding={(symbol) => {
              const q = [...sortedCrypto, ...stockQuotes].find(x => x.symbol === symbol)
              if (q) setBuyQuote(q)
            }}
            onSetMode={portfolio2.setPortfolioMode}
          />
        </div>
      </div>
      <BuyModal
        quote={buyQuote}
        onClose={() => setBuyQuote(null)}
        cash={portfolio2.cash}
        holding={portfolio2.holdings.find(h => h.symbol === buyQuote?.symbol)}
        onBuy={portfolio2.buy}
        onSell={portfolio2.sell}
        currency={currency}
        portfolioMode={portfolio2.portfolioMode}
        remainingWeeklyGlyphs={portfolio2.remainingWeeklyGlyphs}
        glyphsBalance={portfolio2.totalGlyphsEarned}
      />
    </div>
  )
}

