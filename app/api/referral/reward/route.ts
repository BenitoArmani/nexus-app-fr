import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeLog } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 })
    }
    const token = authHeader.slice(7)

    // Create Supabase client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify JWT and get authenticated user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      safeLog('warn', 'Referral reward: invalid token', { error: authError?.message })
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const referred_id = user.id

    // Check if the authenticated user was referred (has referred_by set)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('referred_by')
      .eq('id', referred_id)
      .single()

    if (userError || !userData?.referred_by) {
      return NextResponse.json({ success: true, rewarded: false, reason: 'Aucun parrain trouvé' })
    }

    const referrer_id = userData.referred_by as string

    // Check referral record: created >= 3 days ago AND not yet rewarded
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

    const { data: referral, error: referralError } = await supabaseAdmin
      .from('referrals')
      .select('id, created_at, rewarded_at')
      .eq('referred_id', referred_id)
      .eq('referrer_id', referrer_id)
      .single()

    if (referralError || !referral) {
      return NextResponse.json({ success: true, rewarded: false, reason: 'Parrainage introuvable' })
    }

    if (referral.rewarded_at) {
      return NextResponse.json({ success: true, rewarded: false, reason: 'Récompense déjà attribuée' })
    }

    if (referral.created_at > threeDaysAgo) {
      return NextResponse.json({ success: true, rewarded: false, reason: 'Délai de 3 jours non atteint' })
    }

    // Check user has at least 1 post in the last 3 days (activity check)
    const { count: postCount } = await supabaseAdmin
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', referred_id)
      .gte('created_at', threeDaysAgo)

    if (!postCount || postCount < 1) {
      return NextResponse.json({ success: true, rewarded: false, reason: 'Activité insuffisante (aucun post récent)' })
    }

    // All conditions met: credit 500 GLYPHS to referrer
    const { error: rpcError } = await supabaseAdmin.rpc('credit_glyphs', {
      p_user_id: referrer_id,
      p_amount: 500,
      p_label: 'Parrainage — +500 GLYPHS',
    })

    if (rpcError) {
      safeLog('error', 'Referral reward: credit_glyphs failed', { error: rpcError.message })
      return NextResponse.json({ error: 'Erreur lors du crédit de GLYPHS' }, { status: 500 })
    }

    // Update referrals.rewarded_at
    await supabaseAdmin
      .from('referrals')
      .update({ rewarded_at: new Date().toISOString() })
      .eq('id', referral.id)

    safeLog('info', 'Referral reward: success', { referrer_id, referred_id })
    return NextResponse.json({ success: true, rewarded: true })
  } catch (err) {
    safeLog('error', 'Referral reward: unexpected error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
