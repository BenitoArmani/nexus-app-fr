import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { safeLog } from '@/lib/security'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    safeLog('error', 'Webhook signature verification failed', { error: String(err) })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        safeLog('info', 'Payment completed', { sessionId: event.data.object.id })
        // TODO: créditer les coins ou activer l'abonnement
        break
      case 'customer.subscription.deleted':
        safeLog('info', 'Subscription cancelled', { subscriptionId: event.data.object.id })
        break
      default:
        safeLog('info', `Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    safeLog('error', 'Webhook handler error', { error: String(err) })
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
