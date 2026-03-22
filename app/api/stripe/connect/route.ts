import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { safeLog } from '@/lib/security'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nexussociable.fr'

export async function POST(req: NextRequest) {
  try {
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })

    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    // Check if user already has a Stripe account
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_account_id, stripe_account_status')
      .eq('id', userId)
      .single()

    let accountId = userData?.stripe_account_id

    // Create new Express account if needed
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'FR',
        capabilities: { transfers: { requested: true } },
        settings: { payouts: { schedule: { interval: 'manual' } } },
      })
      accountId = account.id

      await supabase
        .from('users')
        .update({ stripe_account_id: accountId, stripe_account_status: 'pending' })
        .eq('id', userId)
    }

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${APP_URL}/earnings?connect=refresh`,
      return_url: `${APP_URL}/earnings?connect=success`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (err) {
    safeLog('error', 'Stripe Connect error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur connexion Stripe' }, { status: 500 })
  }
}

// GET: check account status
export async function GET(req: NextRequest) {
  try {
    if (!stripe) return NextResponse.json({ status: 'none' })

    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ status: 'none' })

    const { data: userData } = await supabase
      .from('users')
      .select('stripe_account_id, stripe_account_status')
      .eq('id', userId)
      .single()

    if (!userData?.stripe_account_id) return NextResponse.json({ status: 'none' })

    // Verify with Stripe
    const account = await stripe.accounts.retrieve(userData.stripe_account_id)
    const active = account.details_submitted && account.charges_enabled

    if (active && userData.stripe_account_status !== 'active') {
      await supabase
        .from('users')
        .update({ stripe_account_status: 'active' })
        .eq('id', userId)
    }

    return NextResponse.json({
      status: active ? 'active' : 'pending',
      accountId: userData.stripe_account_id,
    })
  } catch (err) {
    safeLog('error', 'Stripe Connect status error', { error: String(err) })
    return NextResponse.json({ status: 'none' })
  }
}
