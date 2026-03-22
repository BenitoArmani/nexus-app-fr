import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('post_id')
  if (!postId) return NextResponse.json({ error: 'post_id requis' }, { status: 400 })

  const { data, error } = await supabase
    .from('comments')
    .select('*, user:users(id, username, full_name, avatar_url, is_verified)')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  try {
    const { post_id, user_id, content, gif_url, gif_preview_url, gif_source } = await req.json()
    if (!post_id || !user_id) return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    if (!content?.trim() && !gif_url) return NextResponse.json({ error: 'Commentaire vide' }, { status: 400 })

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id, user_id, content: content?.trim() ?? null, gif_url: gif_url ?? null, gif_preview_url: gif_preview_url ?? null, gif_source: gif_source ?? null })
      .select('*, user:users(id, username, full_name, avatar_url, is_verified)')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
