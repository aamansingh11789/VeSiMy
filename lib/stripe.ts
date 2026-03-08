// @ts-nocheck
// ── lib/stripe.ts ──────────────────────────────────────────────────────────
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// ── Pricing ────────────────────────────────────────────────────────────────
export const PLANS = {
  free: {
    name:        'Free',
    price:       0,
    description: 'For individuals exploring CI tools',
    features: [
      'Up to 3 projects',
      'All 6 CI tools (VSM, Kaizen, Fishbone, 5 Why, Waste, Time Study)',
      'Local data storage',
      'Basic PDF export',
    ],
    cta: 'Get Started Free',
    priceId: null,
  },
  pro: {
    name:        'Pro',
    price:       29,
    description: 'For serious CI practitioners',
    features: [
      'Unlimited projects',
      'Cloud sync & backup',
      'Full PDF & VSM export',
      'Shareable project links',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Pro — $29/mo',
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  },
  lifetime: {
    name:        'Lifetime',
    price:       99,
    description: 'Pay once. Use forever. (Beta exclusive)',
    features: [
      '99 projects',
      'Everything in Pro',
      'Gold Standard badge',
      'No recurring fees — ever',
      'Priority beta feedback channel',
      '33% enterprise discount for your company',
    ],
    cta: 'Upgrade for Life — $99',
    priceId:  process.env.STRIPE_LIFETIME_PRICE_ID,
    oneTime:  true,
  },
  enterprise: {
    name:        'Enterprise',
    price:       null,                  // dynamic — quote-based
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Organization dashboard',
      'API access',
      'Custom integrations',
      'SSO / SAML',
      'SLA guarantee',
      'Dedicated onboarding',
    ],
    cta: 'Get a Quote',
    priceId: null,                      // quotes are generated, not fixed
  },
} as const

export type PlanKey = keyof typeof PLANS

// ── Create Checkout Session ────────────────────────────────────────────────
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
  // FIX Bug#9: lifetime is a one-time payment; must use mode:'payment' not 'subscription'
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
    // No subscription_data for one-time payments
  } else {
    baseParams.mode = 'subscription'
    baseParams.subscription_data = {
      trial_period_days: 14,
      metadata: { userId, plan },
    }
  }

  const session = await stripe.checkout.sessions.create(baseParams)
  return session
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
