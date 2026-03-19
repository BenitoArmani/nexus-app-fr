'use client'
import Link from 'next/link'
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink } from 'lucide-react'
import { useStockMarket } from '@/hooks/useStockMarket'
import MarketChart from './MarketChart'

function PriceBadge({ change, pct }: { change: number; pct: number }) {
  const up = change >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {up ? '+' : ''}{pct.toFixed(2)}%
    </span>
  )
}

export default function StockWidget() {
  const { cryptoQuotes, stockQuotes, exchangeName, exchangeFlag, currency, lastUpdated } = useStockMarket()

  // BTC + ETH always first, then top 2 local stocks
  const topCrypto = cryptoQuotes.slice(0, 2)
  const topStocks = stockQuotes.slice(0, 2)
  const items = [...topCrypto, ...topStocks]

  const timeStr = lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-surface-2 border border-white/5 rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={15} className="text-emerald-400" />
          <span className="text-sm font-bold text-text-primary">Marchés</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">{exchangeFlag} {exchangeName.split(' ')[0]}</span>
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <RefreshCw size={9} /> {timeStr}
          </span>
        </div>
      </div>

      {/* Quote rows */}
      <div className="space-y-2">
        {items.map(q => {
          const isCrypto = q.type === 'crypto'
          const sym = isCrypto ? '$' : currency
          const price = q.price >= 10000
            ? q.price.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
            : q.price.toLocaleString('fr-FR', { maximumFractionDigits: 2 })

          return (
            <div key={q.symbol} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-text-primary flex-shrink-0">
                {q.symbol.slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{q.name}</p>
                <PriceBadge change={q.change} pct={q.changePercent} />
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-text-primary">{sym}{price}</p>
                <div className="w-20 h-8 mt-0.5">
                  <MarketChart
                    symbol={q.symbol}
                    basePrice={q.price}
                    change={q.change}
                    changePercent={q.changePercent}
                    range="1J"
                    width={80}
                    height={28}
                    showArea={false}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Link to full page */}
      <Link
        href="/markets"
        className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl text-xs text-violet-400 hover:bg-violet-500/10 transition-colors font-medium"
      >
        Voir tous les marchés <ExternalLink size={11} />
      </Link>
    </div>
  )
}
