import { NextRequest, NextResponse } from 'next/server'

// Clé publique de test Giphy (rate-limited) — remplacer par ta propre clé via GIPHY_API_KEY
const GIPHY_KEY = process.env.GIPHY_API_KEY ?? 'dc6zaTOxFJmzC'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
  const limit = searchParams.get('limit') ?? '24'

  const endpoint = q
    ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=${limit}&rating=pg-13&lang=fr`
    : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=${limit}&rating=pg-13`

  try {
    const res = await fetch(endpoint)
    const json = await res.json()
    const results = (json.data ?? []).map((item: Record<string, unknown>) => {
      const images = item.images as Record<string, { url: string; width: string; height: string }> ?? {}
      return {
        id: item.id,
        title: item.title ?? '',
        url: images.original?.url ?? '',
        preview_url: images.fixed_height_small?.url ?? images.original?.url ?? '',
        width: parseInt(images.original?.width ?? '200'),
        height: parseInt(images.original?.height ?? '200'),
      }
    })
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
