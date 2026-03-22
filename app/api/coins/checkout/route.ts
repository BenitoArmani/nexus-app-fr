import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { safeLog } from '@/lib/security'

export const GLYPH_PACKS = [
  { id: 'pack_550',  glyphs: 550,  price: 500,  label: '550 Glyphs'  },  // 5€
  { id: 'pack_1200', glyphs: 1200, price: 1000, label: '1 200 Glyphs' }, // 10€
  { id: 'pack_2750', glyphs: 2750, price: 2000, label: '2 750 Glyphs' }, // 20€
  { id: 'pack_6000', glyphs: 6000, price: 4000, label: '6 000 Glyphs' }, // 40€
]

export async function POST(req: NextRequest) {
  try {
    const { packId, userId } = await req.json()
    const pack = GLYPH_PACKS.find(p => p.id === packId)
    if (!pack) return NextResponse.json({ error: 'Pack invalide' }, { status: 400 })
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    if (!stripe) return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `NEXUS — ${pack.label}`,
            description: `${pack.glyphs} GLYPHS crédités immédiatement sur votre compte`,
          },
          unit_amount: pack.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/glyphs?success=true&glyphs=${pack.glyphs}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/glyphs?cancelled=true`,
      metadata: { userId, packId, glyphs: pack.glyphs.toString() },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    safeLog('error', 'Stripe checkout error', { error: String(err) })
    return NextResponse.json({ error: 'Erreur paiement' }, { status: 500 })
  }
}
