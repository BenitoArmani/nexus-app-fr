import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  await supabase.rpc('increment_story_views', { story_id: id })
  return NextResponse.json({ success: true })
}
