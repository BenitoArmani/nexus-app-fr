import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { story_id } = await req.json()
    if (!story_id) return NextResponse.json({ error: 'story_id requis' }, { status: 400 })

    // Récupérer les infos de la story pour notifier le propriétaire de la plateforme
    const { data: story } = await supabase
      .from('stories')
      .select('user_id, media_url')
      .eq('id', story_id)
      .single()

    if (!story) return NextResponse.json({ error: 'Story introuvable' }, { status: 404 })

    // Notifier l'auteur que sa story a été signalée (visible côté admin)
    await supabase.from('notifications').insert({
      user_id: story.user_id,
      type: 'report',
      title: 'Ta story a été signalée',
      body: 'Un utilisateur a signalé ta story comme contenu inapproprié. Elle sera examinée.',
      read: false,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
