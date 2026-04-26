// ── lib/plans.ts ───────────────────────────────────────────────────────────
// Client-safe plan display metadata. Do not put Stripe secrets or price IDs here.

export const PLAN_DISPLAY = {
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
      'Full improvement report export',
      'PDCA export — A3, 8D, DMAIC, OODA',
      'Yamazumi + Standard Work export',
      'Kaizen Roadmap — mission control',
      'Branches — parallel sub-assembly flows',
      'Cloud sync & backup',
      'Priority support',
    ],
    cta: 'Start Pro — $29/mo',
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
    oneTime: true,
  },
  enterprise: {
    name:        'Enterprise',
    price:       null,
    description: 'For multi-site teams and organisations that need collaboration, governance, and support.',
    features: [
      'Unlimited projects',
      'Everything in Pro',
      'Team collaboration & shared projects',
      'Organisation dashboard',
      'API access + custom integrations',
      'SSO / SAML',
      'SLA options',
      'Dedicated onboarding & training',
    ],
    cta: 'Get a Quote',
  },
} as const

export type PlanKey = keyof typeof PLAN_DISPLAY
