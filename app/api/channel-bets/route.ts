import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { safeLog } from '@/lib/security'

// POST /api/channel-bets — create a bet
export async function POST(req: NextRequest) {
  try {
    const { creatorId, channelId, question, amount } = await req.json()
    if (!creatorId || !channelId || !question || !amount) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }
    if (amount < 10) return NextResponse.json({ error: 'Mise minimum 10 GLYPHS' }, { status: 400 })

    // Deduct from creator balance
    const { error: deductErr } = await supabase.rpc('credit_glyphs', {
      p_user_id: creatorId,
      p_amount: -amount,
      p_label: `Pari canal : ${question}`,
    })
    if (deductErr) return NextResponse.json({ error: 'Solde insuffisant' }, { status: 400 })

    const { data, error } = await supabase
      .from('channel_bets')
      .insert({ creator_id: creatorId, channel_id: channelId, question, amount })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ bet: data })
  } catch (err) {
    safeLog('error', 'Create channel bet error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur création pari' }, { status: 500 })
  }
}

// GET /api/channel-bets?channelId=xxx — fetch bets for a channel
export async function GET(req: NextRequest) {
  try {
    const channelId = req.nextUrl.searchParams.get('channelId')
    if (!channelId) return NextResponse.json({ bets: [] })

    const { data, error } = await supabase
      .from('channel_bets')
      .select('*, creator:creator_id(id,username,full_name,avatar_url), acceptor:accepted_by(id,username,full_name)')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error
    return NextResponse.json({ bets: data ?? [] })
  } catch (err) {
    safeLog('error', 'Fetch channel bets error', { error: String(err) })
    return NextResponse.json({ bets: [] })
  }
}

// PATCH /api/channel-bets — accept or resolve
export async function PATCH(req: NextRequest) {
  try {
    const { betId, action, userId, winnerId } = await req.json()

    if (action === 'accept') {
      const { data: bet } = await supabase
        .from('channel_bets')
        .select('*')
        .eq('id', betId)
        .single()

      if (!bet || bet.status !== 'open') {
        return NextResponse.json({ error: 'Pari non disponible' }, { status: 400 })
      }
      if (bet.creator_id === userId) {
        return NextResponse.json({ error: 'Tu ne peux pas accepter ton propre pari' }, { status: 400 })
      }

      // Deduct from acceptor
      const { error: deductErr } = await supabase.rpc('credit_glyphs', {
        p_user_id: userId,
        p_amount: -bet.amount,
        p_label: `Acceptation pari : ${bet.question}`,
      })
      if (deductErr) return NextResponse.json({ error: 'Solde insuffisant' }, { status: 400 })

      await supabase
        .from('channel_bets')
        .update({ status: 'accepted', accepted_by: userId })
        .eq('id', betId)

      return NextResponse.json({ success: true })
    }

    if (action === 'resolve') {
      const { data: bet } = await supabase
        .from('channel_bets')
        .select('*')
        .eq('id', betId)
        .single()

      if (!bet || bet.status !== 'accepted') {
        return NextResponse.json({ error: 'Pari non accepté' }, { status: 400 })
      }
      if (bet.creator_id !== userId) {
        return NextResponse.json({ error: 'Seul le créateur peut trancher' }, { status: 400 })
      }

      // Credit winner with double the stake
      await supabase.rpc('credit_glyphs', {
        p_user_id: winnerId,
        p_amount: bet.amount * 2,
        p_label: `Victoire pari : ${bet.question}`,
      })

      await supabase
        .from('channel_bets')
        .update({ status: 'resolved', winner_id: winnerId, resolved_at: new Date().toISOString() })
        .eq('id', betId)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
  } catch (err) {
    safeLog('error', 'Update channel bet error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
