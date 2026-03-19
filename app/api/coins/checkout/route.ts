import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { safeLog } from '@/lib/security'

const COIN_PACKS = [
  { id: 'pack_500', coins: 500, price: 500, label: '500 Coins' },      // 5€
  { id: 'pack_1100', coins: 1100, price: 1000, label: '1100 Coins' },  // 10€
  { id: 'pack_2500', coins: 2500, price: 2000, label: '2500 Coins' },  // 20€
]

export async function POST(req: NextRequest) {
  try {
    const { packId, userId } = await req.json()
    const pack = COIN_PACKS.find(p => p.id === packId)
    if (!pack) return NextResponse.json({ error: 'Pack invalide' }, { status: 400 })
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré (mode démo)' }, { status: 503 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'eur', product_data: { name: `NEXUS Coins — ${pack.label}`, description: `${pack.coins} NEXUS Coins crédités immédiatement` }, unit_amount: pack.price }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/coins?success=true&coins=${pack.coins}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/coins?cancelled=true`,
      metadata: { userId: userId || 'anonymous', packId, coins: pack.coins.toString() },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    safeLog('error', 'Stripe checkout error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur paiement' }, { status: 500 })
  }
}
