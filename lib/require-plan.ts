// @ts-nocheck
// ── lib/require-plan.ts ──────────────────────────────────────────────────────
// Server-side plan enforcement helper.
// Import and call at the top of any premium API route.
// Returns NextResponse 403 if user is not on a qualifying plan.
// Returns null if the user IS allowed (proceed normally).
// server-only removed — isPaidProfile is also used client-side
import { NextResponse } from 'next/server'

export type PlanTier = 'trial' | 'trialing' | 'trial_expired' | 'pro' | 'lifetime' | 'enterprise'

export const PAID_PLANS: PlanTier[] = ['pro', 'lifetime', 'enterprise']

export async function requirePlan(
  supabase: any,
  user: any,
  allowedTiers: PlanTier[] = PAID_PLANS
): Promise<NextResponse | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier, lifetime_access, is_beta')
    .eq('id', user.id)
    .single()

  const tier = profile?.plan_tier || 'trial'
  const allowed =
    allowedTiers.includes(tier as PlanTier) ||
    profile?.lifetime_access === true ||
    profile?.is_beta === true

  if (!allowed) {
    return NextResponse.json(
      { error: 'This feature requires a Pro plan.', code: 'PLAN_REQUIRED' },
      { status: 403 }
    )
  }
  return null
}

// ── Client-safe isPaid check ─────────────────────────────────────────────────
// Use this in ALL components instead of re-implementing isPaid inline.
// Accepts profile prop directly — no Supabase call needed.
export function isPaidProfile(profile: {
  plan_tier?: string | null
  lifetime_access?: boolean | null
  is_beta?: boolean | null
} | null | undefined): boolean {
  if (!profile) return false
  return (
    profile.plan_tier === 'pro' ||
    profile.plan_tier === 'lifetime' ||
    profile.plan_tier === 'enterprise' ||
    profile.lifetime_access === true ||
    profile.is_beta === true
  )
}
