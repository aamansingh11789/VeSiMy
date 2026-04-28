// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── lib/stripe.ts ──────────────────────────────────────────────────────────
// PROMO: SPRING25 — 20% off first payment — expires 2026-04-21
// Setup: Stripe Dashboard > Coupons > create 20% off first_time_transaction
// Then:  Promotions > create code SPRING25 linking to that coupon
import Stripe from 'stripe'

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
    name:        'Trial',
    price:       0,
    description: '14-day free trial. Full access. No credit card required.',
    features: [
      'Up to 3 projects',
      'All CI tools',
      'V2 Process Builder',
      'Reference projects',
      'No credit card',
    ],
    projects_limit: 3,
    priceId: null,
    cta: 'Start free trial',
  },
  pro: {
    name:        'Pro',
    price:       29,
    description: 'Everything you need to run a serious CI programme.',
    features: [
      'Up to 10 projects',
      'All CI tools + AI Gap Analysis',
      'VSM export — A3 landscape PDF',
      'Full ISO improvement report export',
      'PDCA export — A3, 8D, DMAIC, OODA',
      'Yamazumi + Standard Work export',
      'Kaizen Roadmap — mission control',
      'Branches — parallel sub-assembly flows',
      'Cloud sync & backup',
      'Priority support',
    ],
    cta: 'Start Pro — $29/mo',
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  },
  lifetime: {
    name:        'Lifetime',
    price:       99,
    description: 'Pay once. Use forever. Lock in launch pricing now.',
    features: [
      'Up to 30 projects',
      'Everything in Pro',
      'Gold Standard founder badge',
      'No recurring fees — ever',
      'All future tool releases included',
      '33% enterprise discount for your company',
      'Priority feedback channel — shape the roadmap',
    ],
    cta: 'Get Lifetime Access — $99',
    priceId:  process.env.STRIPE_LIFETIME_PRICE_ID,
    oneTime:  true,
  },
  enterprise: {
    name:        'Enterprise',
    price:       null,
    description: 'For manufacturing teams and multi-site organisations.',
    features: [
      'Unlimited projects',
      'Everything in Pro',
      'Team collaboration & shared projects',
      'Organisation dashboard',
      'API access + custom integrations',
      'SSO / SAML',
      'SLA guarantee',
      'Dedicated onboarding & training',
    ],
    cta: 'Get a Quote',
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
