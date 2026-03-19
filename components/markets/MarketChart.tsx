'use client'
import { useMemo } from 'react'
import { generatePriceHistory } from '@/hooks/useStockMarket'

interface MarketChartProps {
  symbol: string
  basePrice: number
  change: number
  changePercent: number
  range: '1J' | '1S' | '1M' | '1A'
  width?: number
  height?: number
  showArea?: boolean
}

export default function MarketChart({
  symbol, basePrice, change, changePercent, range,
  width = 300, height = 90, showArea = true
}: MarketChartProps) {
  const points = useMemo(() => {
    const count = range === '1J' ? 48 : range === '1S' ? 56 : range === '1M' ? 60 : 52
    const volatility = range === '1A' ? 0.022 : range === '1M' ? 0.016 : range === '1S' ? 0.012 : 0.008
    return generatePriceHistory(basePrice, count, volatility)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, basePrice, range])

  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1

  const pad = 4
  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * width,
    y: height - pad - ((p - min) / span) * (height - pad * 2),
  }))

  const polylineStr = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')
  const areaPath = `M ${coords[0].x},${height} L ${polylineStr} L ${coords[coords.length - 1].x},${height} Z`

  const isUp = changePercent >= 0
  const color = isUp ? '#10b981' : '#f43f5e'
  const gradId = `g-${symbol.replace(/[^a-z0-9]/gi, '')}-${range}`

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {showArea && <path d={areaPath} fill={`url(#${gradId})`} />}
      <polyline
        points={polylineStr}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
