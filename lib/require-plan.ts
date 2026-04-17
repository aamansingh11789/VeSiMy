// @ts-nocheck
// lib/require-plan.ts — server-side plan enforcement.
// Returns NextResponse 403 if user is not on a qualifying plan.
// Returns null if the user IS allowed (proceed normally).
import { NextResponse } from 'next/server'

export type PlanTier = 'trial' | 'trialing' | 'trial_expired' | 'pro' | 'lifetime' | 'enterprise'
export const PAID_PLANS: PlanTier[] = ['pro', 'lifetime', 'enterprise']

/** Check whether a beta profile is still within its access window. */
function isBetaActive(profile: any): boolean {
  if (!profile?.is_beta) return false
  if (!profile.beta_expires_at) return true  // no expiry = active
  return new Date(profile.beta_expires_at) > new Date()
}

export async function requirePlan(
  supabase: any,
  user: any,
  allowedTiers: PlanTier[] = PAID_PLANS
): Promise<NextResponse | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier, lifetime_access, is_beta, beta_expires_at')
    .eq('id', user.id)
    .single()

  const tier    = profile?.plan_tier || 'trial'
  const allowed =
    allowedTiers.includes(tier as PlanTier) ||
    profile?.lifetime_access === true        ||
    isBetaActive(profile)                    // ← FIX: checks beta_expires_at

  if (!allowed) {
    return NextResponse.json(
      { error: 'This feature requires a Pro plan.', code: 'PLAN_REQUIRED' },
      { status: 403 }
    )
  }
  return null
}

/** Client-safe isPaid check. Accepts profile prop directly. */
export function isPaidProfile(profile: {
  plan_tier?:        string | null
  lifetime_access?:  boolean | null
  is_beta?:          boolean | null
  beta_expires_at?:  string | null
} | null | undefined): boolean {
  if (!profile) return false
  return (
    profile.plan_tier === 'pro'        ||
    profile.plan_tier === 'lifetime'   ||
    profile.plan_tier === 'enterprise' ||
    profile.lifetime_access === true   ||
    isBetaActive(profile)              // ← FIX: checks expiry on client too
  )
}
