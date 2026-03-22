import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
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
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const glyphs = parseInt(session.metadata?.glyphs || '0', 10)

        if (userId && glyphs > 0) {
          // Credit GLYPHS via SQL function (SECURITY DEFINER bypasses RLS)
          const { error } = await supabase.rpc('credit_glyphs', {
            p_user_id: userId,
            p_amount: glyphs,
            p_label: `Achat ${glyphs} GLYPHS via Stripe`,
          })
          if (error) {
            safeLog('error', 'Failed to credit glyphs', { userId, glyphs, error: error.message })
          } else {
            safeLog('info', 'Glyphs credited', { userId, glyphs })
          }
        }
        break
      }
      case 'customer.subscription.deleted':
        safeLog('info', 'Subscription cancelled', { subscriptionId: event.data.object.id })
        break
      default:
        break
    }
  } catch (err) {
    safeLog('error', 'Webhook handler error', { error: String(err) })
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
