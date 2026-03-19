import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const symbols = ['^FCHI', '^IXIC', '^GSPC', '^DJI', 'BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD', 'ADA-USD', 'XRP-USD']
    const symbolList = symbols.join('%2C')

    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolList}&fields=regularMarketPrice,regularMarketChangePercent,regularMarketChange,shortName`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, next: { revalidate: 60 } }
    )

    if (!res.ok) throw new Error('Yahoo Finance unavailable')
    const json = await res.json()
    const quotes = json.quoteResponse?.result ?? []

    const formatted = quotes.map((q: any) => ({
      symbol: q.symbol,
      name: q.shortName ?? q.symbol,
      price: q.regularMarketPrice ?? 0,
      change: q.regularMarketChangePercent ?? 0,
      changeAbs: q.regularMarketChange ?? 0,
      type: q.symbol.includes('-USD') ? 'crypto' : 'index',
    }))

    return NextResponse.json({ data: formatted, timestamp: Date.now(), source: 'yahoo' })
  } catch {
    return NextResponse.json({
      data: generateSimulated(),
      timestamp: Date.now(),
      source: 'simulated'
    })
  }
}

function generateSimulated() {
  return [
    { symbol: '^FCHI', name: 'CAC 40', price: 7542 + (Math.random() - 0.5) * 50, change: (Math.random() - 0.48) * 2, changeAbs: 0, type: 'index' },
    { symbol: '^IXIC', name: 'NASDAQ', price: 17234 + (Math.random() - 0.5) * 100, change: (Math.random() - 0.48) * 2, changeAbs: 0, type: 'index' },
    { symbol: '^GSPC', name: 'S&P 500', price: 5456 + (Math.random() - 0.5) * 30, change: (Math.random() - 0.48) * 1.5, changeAbs: 0, type: 'index' },
    { symbol: '^DJI', name: 'DOW JONES', price: 42341 + (Math.random() - 0.5) * 200, change: (Math.random() - 0.48) * 1.5, changeAbs: 0, type: 'index' },
    { symbol: 'BTC-USD', name: 'Bitcoin', price: 87234 + (Math.random() - 0.5) * 1000, change: (Math.random() - 0.47) * 4, changeAbs: 0, type: 'crypto' },
    { symbol: 'ETH-USD', name: 'Ethereum', price: 3456 + (Math.random() - 0.5) * 100, change: (Math.random() - 0.47) * 5, changeAbs: 0, type: 'crypto' },
    { symbol: 'BNB-USD', name: 'BNB', price: 612 + (Math.random() - 0.5) * 20, change: (Math.random() - 0.47) * 4, changeAbs: 0, type: 'crypto' },
    { symbol: 'SOL-USD', name: 'Solana', price: 178 + (Math.random() - 0.5) * 10, change: (Math.random() - 0.47) * 6, changeAbs: 0, type: 'crypto' },
    { symbol: 'ADA-USD', name: 'Cardano', price: 0.82 + (Math.random() - 0.5) * 0.05, change: (Math.random() - 0.47) * 5, changeAbs: 0, type: 'crypto' },
    { symbol: 'XRP-USD', name: 'XRP', price: 2.34 + (Math.random() - 0.5) * 0.1, change: (Math.random() - 0.47) * 5, changeAbs: 0, type: 'crypto' },
  ]
}
