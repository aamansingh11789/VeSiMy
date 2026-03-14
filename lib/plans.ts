// @ts-nocheck
// ── lib/plans.ts ──────────────────────────────────────────────────────────────
// Plan definitions — safe to import in both client AND server components
// (No Stripe SDK import here — stripe client lives in lib/stripe.ts server-only)

export const PLANS = {
  free: {
    name:        'Free',
    price:       0,
    description: 'For individuals exploring lean tools',
    features: [
      'Up to 3 projects',
      'VSM Builder (unlimited steps)',
      'All 6 CI tools (Time Study, 5 Why, Fishbone, Waste, Kaizen, Improvement)',
      'Kanban board',
      'Basic Report & PDF export',
      'Community support',
    ],
  },
  pro: {
    name:        'Pro',
    price:       29,
    description: 'For lean practitioners and CI teams',
    features: [
      'Unlimited projects',
      'Everything in Free',
      'Supe AI assistant',
      'Process Simulation',
      'Live Floor Monitor',
      'Multi-page VSM export (A3 print)',
      'Priority support',
    ],
  },
  enterprise: {
    name:        'Enterprise',
    price:       null,
    description: 'For multi-site operations and large teams',
    features: [
      'Everything in Pro',
      'SSO / SAML login',
      'Admin dashboard',
      'Custom onboarding & training',
      'SLA & dedicated support',
      'Custom integrations',
    ],
  },
  lifetime: {
    name:        'Lifetime',
    price:       99,
    description: 'One-time payment, all Pro features forever',
    features: [
      'All Pro features',
      'All future updates included',
      'No monthly fee ever',
      'Founding member badge',
    ],
  },
}

export type PlanKey = keyof typeof PLANS
