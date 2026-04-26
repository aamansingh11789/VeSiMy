// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── lib/stripe.ts ──────────────────────────────────────────────────────────
// PROMO: SPRING25 — 20% off first payment — expires 2026-04-21
// Setup: Stripe Dashboard > Coupons > create 20% off first_time_transaction
// Then:  Promotions > create code SPRING25 linking to that coupon
import Stripe from 'stripe'
import { PLAN_DISPLAY } from '@/lib/plans'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// ── Plans ───────────────────────────────────────────────────────────────────
// Trial:      $0 · 14-day · 3 projects · all CI tools · no card required
// Pro:        $29/mo · 10 projects · Supe AI + A3 export · simulation
// Lifetime:   $99 once · 30 projects · all Pro features · no monthly fee
// Enterprise: custom · unlimited · SSO + SLA + admin dashboard

export const PLANS = {
  trial: {
    ...PLAN_DISPLAY.trial,
    priceId: null,
  },
  pro: {
    ...PLAN_DISPLAY.pro,
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  },
  lifetime: {
    ...PLAN_DISPLAY.lifetime,
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID,
  },
  enterprise: {
    ...PLAN_DISPLAY.enterprise,
    priceId: null,
  },
} as const

export type PlanKey = keyof typeof PLANS

// ── Create Checkout Session ─────────────────────────────────────────────────
export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  email,
  plan,
  returnUrl,
}: {
  customerId?: string
  priceId:     string
  userId:      string
  email:       string
  plan:        string
  returnUrl:   string
}) {
  const isOneTime = (PLANS[plan as keyof typeof PLANS] as any)?.oneTime === true

  const baseParams: any = {
    payment_method_types: ['card'],
    customer:             customerId || undefined,
    customer_email:       customerId ? undefined : email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}/dashboard?upgraded=true&plan=${plan}`,
    cancel_url:  `${returnUrl}/pricing`,
    metadata:    { userId, plan },
    allow_promotion_codes: true,
  }

  if (isOneTime) {
    baseParams.mode = 'payment'
  } else {
    baseParams.mode = 'subscription'
    baseParams.subscription_data = {
      trial_period_days: 14,
      metadata: { userId, plan },
    }
  }

  return await stripe.checkout.sessions.create(baseParams)
}

// ── Create Customer Portal Session ─────────────────────────────────────────
export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer:   customerId,
    return_url: `${returnUrl}/dashboard`,
  })
  return session
}

// ── Webhook signature verification ─────────────────────────────────────────
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
