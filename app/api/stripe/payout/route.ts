import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { safeLog } from '@/lib/security'

const GLYPHS_PER_EURO = 110
const MIN_GLYPHS = 3000 // minimum 3 000 GLYPHS (≈ 27€) — équilibre motivation/sécurité

export async function POST(req: NextRequest) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })

    // Vérification JWT — ne jamais faire confiance au userId du body
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    const { data: { user: authUser } } = await supabase.auth.getUser(token)
    if (!authUser) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })

    const { glyphs } = await req.json()
    const userId = authUser.id // toujours depuis le JWT, jamais le body
    if (!glyphs || glyphs < MIN_GLYPHS) {
      return NextResponse.json({ error: `Minimum ${MIN_GLYPHS} GLYPHS pour un retrait` }, { status: 400 })
    }

    // Get user data
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_account_id, stripe_account_status, glyphs_balance, created_at')
      .eq('id', userId)
      .single()

    if (!userData?.stripe_account_id || userData.stripe_account_status !== 'active') {
      return NextResponse.json({ error: 'Compte Stripe non connecté ou non vérifié' }, { status: 400 })
    }
    if ((userData.glyphs_balance ?? 0) < glyphs) {
      return NextResponse.json({ error: 'Solde GLYPHS insuffisant' }, { status: 400 })
    }

    // Compte doit avoir 30 jours d'ancienneté
    const accountAgeDays = (Date.now() - new Date(userData.created_at).getTime()) / 86400000
    if (accountAgeDays < 30) {
      return NextResponse.json({ error: 'Retrait disponible 30 jours après inscription' }, { status: 400 })
    }

    // 1 retrait max par mois
    const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0)
    const { count: payoutsThisMonth } = await supabase
      .from('glyphs_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .ilike('event', '%Retrait%')
      .gte('created_at', startOfMonth.toISOString())
    if ((payoutsThisMonth ?? 0) >= 1) {
      return NextResponse.json({ error: 'Un seul retrait par mois autorisé' }, { status: 400 })
    }

    const euros = Math.floor(glyphs / GLYPHS_PER_EURO)
    const cents = euros * 100

    if (cents < 100) {
      return NextResponse.json({ error: 'Montant trop faible (minimum 1€)' }, { status: 400 })
    }

    // Create Stripe transfer to connected account
    const transfer = await stripe.transfers.create({
      amount: cents,
      currency: 'eur',
      destination: userData.stripe_account_id,
      description: `Retrait NEXUS — ${glyphs} GLYPHS → ${euros}€`,
    })

    // Deduct GLYPHS via SQL function
    await supabase.rpc('credit_glyphs', {
      p_user_id: userId,
      p_amount: -glyphs,
      p_label: `Retrait bancaire — ${euros}€`,
    })

    safeLog('info', 'Payout created', { userId, glyphs, euros, transferId: transfer.id })
    return NextResponse.json({ success: true, euros, transferId: transfer.id })
  } catch (err) {
    safeLog('error', 'Stripe payout error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur lors du virement' }, { status: 500 })
  }
}
