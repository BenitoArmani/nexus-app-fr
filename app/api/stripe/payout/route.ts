import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { safeLog } from '@/lib/security'

const GLYPHS_PER_EURO = 110
const MIN_GLYPHS = 5000 // minimum 5 000 GLYPHS (≈ 45€) — marge de sécurité plateforme

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
      .select('stripe_account_id, stripe_account_status, glyphs_balance')
      .eq('id', userId)
      .single()

    if (!userData?.stripe_account_id || userData.stripe_account_status !== 'active') {
      return NextResponse.json({ error: 'Compte Stripe non connecté ou non vérifié' }, { status: 400 })
    }
    if ((userData.glyphs_balance ?? 0) < glyphs) {
      return NextResponse.json({ error: 'Solde GLYPHS insuffisant' }, { status: 400 })
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
