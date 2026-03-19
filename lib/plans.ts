// @ts-nocheck
// ── lib/plans.ts ──────────────────────────────────────────────────────────────
// Plan definitions — safe to import in both client AND server components
// (No Stripe SDK import here — stripe client lives in lib/stripe.ts server-only)

export const PLANS = {
  free: {
    name:        'Free',
    price:       0,
    description: 'Unlimited projects, all 9 CI tools — completely free. No clock, no pressure.',
    cta:         'Start free — unlimited projects',
    features: [
      'Unlimited projects — free forever',
      'VSM Builder with unlimited steps',
      'All 9 CI tools: Time Study, 5 Why, Fishbone, Waste ID, Kaizen, Yamazumi, Standard Work, Gap Analysis, PDCA',
      'AI step-level diagnosis on every tool',
      'Basic Report & PDF export',
      'Community support',
    ],
  },
  pro: {
    name:        'Pro',
    price:       29,
    description: 'Unlimited projects and Supe AI — for teams serious about improvement.',
    cta:         'Start Pro — 14-day free',
    features: [
      'Unlimited projects',
      'Everything in Free',
      'Supe AI mentor — reads your real VSM data',
      'Process Simulation',
      'Live Floor Monitor',
      'Multi-page A3 export (print-ready)',
      'Priority support',
    ],
  },
  enterprise: {
    name:        'Enterprise',
    price:       null,
    description: 'Multi-site operations, large teams, and compliance requirements.',
    cta:         'Talk to us',
    features: [
      'Everything in Pro',
      'SSO / SAML login',
      'Admin dashboard & team management',
      'Custom onboarding & training',
      'SLA & dedicated support',
      'Custom integrations',
    ],
  },
  lifetime: {
    name:        'Lifetime',
    price:       99,
    description: 'All Pro features, forever. One payment — no subscriptions.',
    cta:         'Get lifetime access',
    features: [
      'All Pro features — including everything added in future',
      'No monthly fee, ever',
      'Priority support',
      'Founding member recognition',
    ],
  },
}

export type PlanKey = keyof typeof PLANS
