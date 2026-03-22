import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { user_id, url, preview_url, title, source, category, tenor_id } = await req.json()
    if (!user_id || !url) return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })

    const { data, error } = await supabase
      .from('user_gifs')
      .upsert({ user_id, url, preview_url: preview_url ?? null, title: title ?? null, source: source ?? 'tenor', category: category ?? 'Mes GIFs', tenor_id: tenor_id ?? null }, { onConflict: 'user_id,url' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id requis' }, { status: 400 })

  const { data, error } = await supabase
    .from('user_gifs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
