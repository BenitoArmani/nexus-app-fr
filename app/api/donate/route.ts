import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { safeLog } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json() // montant en centimes
    if (!amount || amount < 1) return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré (mode démo)' }, { status: 503 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'eur', product_data: { name: 'Don pour NEXUS', description: 'Merci de soutenir NEXUS ❤️' }, unit_amount: Math.max(amount, 1) }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?donated=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    safeLog('error', 'Donation error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
