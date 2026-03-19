import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  if (!query || query.length < 1) return NextResponse.json({ results: [] })

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0&listsCount=0`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('Yahoo search failed')
    const data = await res.json()

    const results = (data.quotes ?? [])
      .filter((q: any) => q.quoteType === 'EQUITY' || q.quoteType === 'CRYPTOCURRENCY' || q.quoteType === 'INDEX' || q.quoteType === 'ETF')
      .slice(0, 8)
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.longname ?? q.shortname ?? q.symbol,
        type: q.quoteType === 'CRYPTOCURRENCY' ? 'crypto' : 'stock',
        exchange: q.exchange ?? '',
      }))

    return NextResponse.json({ results })
  } catch {
    // Fallback: popular tickers matching query
    const POPULAR = [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', exchange: 'NASDAQ' },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', exchange: 'NASDAQ' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', exchange: 'NASDAQ' },
      { symbol: 'META', name: 'Meta Platforms', type: 'stock', exchange: 'NASDAQ' },
      { symbol: 'AMZN', name: 'Amazon.com', type: 'stock', exchange: 'NASDAQ' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', exchange: 'NASDAQ' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', exchange: 'NASDAQ' },
      { symbol: 'BTC-USD', name: 'Bitcoin', type: 'crypto', exchange: 'CCC' },
      { symbol: 'ETH-USD', name: 'Ethereum', type: 'crypto', exchange: 'CCC' },
      { symbol: 'SOL-USD', name: 'Solana', type: 'crypto', exchange: 'CCC' },
      { symbol: 'MC.PA', name: 'LVMH', type: 'stock', exchange: 'EPA' },
      { symbol: 'OR.PA', name: "L'Oréal", type: 'stock', exchange: 'EPA' },
      { symbol: 'AIR.PA', name: 'Airbus', type: 'stock', exchange: 'EPA' },
    ]
    const q = query.toLowerCase()
    const results = POPULAR.filter(p =>
      p.symbol.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    )
    return NextResponse.json({ results })
  }
}
