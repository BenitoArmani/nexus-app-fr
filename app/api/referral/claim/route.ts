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

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify JWT and get authenticated user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      safeLog('warn', 'Referral claim: invalid token', { error: authError?.message })
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const referred_id = user.id

    // Parse body
    const body = await req.json() as { code?: string }
    const code = body.code?.trim().toUpperCase()
    if (!code || code.length < 4) {
      return NextResponse.json({ error: 'Code de parrainage invalide' }, { status: 400 })
    }

    // Find the referrer by referral_code
    const { data: referrer, error: referrerError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('referral_code', code)
      .single()

    if (referrerError || !referrer) {
      safeLog('info', 'Referral claim: code not found', { code })
      return NextResponse.json({ error: 'Code de parrainage introuvable' }, { status: 404 })
    }

    const referrer_id = referrer.id

    // No self-referral
    if (referrer_id === referred_id) {
      return NextResponse.json({ error: 'Auto-parrainage non autorisé' }, { status: 400 })
    }

    // Check if referred_id is already in referrals table
    const { data: existing } = await supabaseAdmin
      .from('referrals')
      .select('id')
      .eq('referred_id', referred_id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Ce compte a déjà été parrainé' }, { status: 409 })
    }

    // Insert into referrals table
    const { error: insertError } = await supabaseAdmin
      .from('referrals')
      .insert({ referrer_id, referred_id })

    if (insertError) {
      safeLog('error', 'Referral claim: insert failed', { error: insertError.message })
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement du parrainage' }, { status: 500 })
    }

    // Update referred user's referred_by field
    await supabaseAdmin
      .from('users')
      .update({ referred_by: referrer_id })
      .eq('id', referred_id)

    safeLog('info', 'Referral claim: success', { referrer_id, referred_id })
    return NextResponse.json({ success: true })
  } catch (err) {
    safeLog('error', 'Referral claim: unexpected error', { error: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
