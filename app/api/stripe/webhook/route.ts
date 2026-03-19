// @ts-nocheck
// ── app/api/stripe/webhook/route.ts ──────────────────────────────────────────
// Events: customer.subscription.created, updated, deleted,
//         invoice.payment_failed, checkout.session.completed (lifetime)

import { constructWebhookEvent } from '@/lib/stripe'
import { createAdminClient }     from '@/lib/supabase'
import { NextResponse, type NextRequest } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')!
  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  await supabase.from('stripe_events').upsert({ id: event.id, type: event.type, data: event.data as any })

  const sub = (event.data.object as Stripe.Subscription)

  async function syncSubscription(sub: Stripe.Subscription) {
    const userId = sub.metadata.userId
    const plan   = sub.metadata.plan || 'pro'
    const status = sub.status
    if (!userId) return
    await supabase.from('profiles').update({
      subscription_id:         sub.id,
      subscription_status:     status,
      subscription_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      plan_tier:               status === 'active' || status === 'trialing' ? plan : 'trial_expired',
      projects_limit:          status === 'active' ? 999999 : status === 'trialing' ? 999999 : 999999, // all plans unlimited
      stripe_customer_id:      sub.customer as string,
    }).eq('id', userId)
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await syncSubscription(sub)
      break

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId  = session.metadata?.userId
      const plan    = session.metadata?.plan
      if (userId && plan === 'lifetime' && session.payment_status === 'paid') {
        await supabase.from('profiles').update({
          lifetime_access:       true,
          lifetime_activated_at: new Date().toISOString(),
          beta_tier:             'gold_standard',
          plan_tier:             'lifetime',
          projects_limit:        30,
          stripe_customer_id:    session.customer as string,
        }).eq('id', userId)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const custSub = await import('@/lib/stripe').then(m => m.stripe.subscriptions.retrieve(invoice.subscription as string))
      await syncSubscription(custSub)
      break
    }
  }

  return NextResponse.json({ received: true })
}
