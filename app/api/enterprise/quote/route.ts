// @ts-nocheck
// ── app/api/enterprise/quote/route.ts ────────────────────────────────────────
// Dynamic enterprise pricing engine
// Base: $15/user/mo | addons stack | beta discount applies | annual = 2 months free
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase }           from '@/lib/supabase-server'

const BASE_PER_USER = 15  // $15/user/month base

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    company_name, contact_email, contact_name, company_size,
    num_users, num_projects, needs_api, needs_sso, needs_sla,
    needs_onboarding, needs_custom_int, discount_code, notes,
  } = body

  // ── Validation ─────────────────────────────────────────────────────────────
  if (!company_name || !contact_email || !contact_name || !num_users)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const users = Math.max(1, parseInt(num_users))

  // ── Volume tiers ───────────────────────────────────────────────────────────
  // >50 users → 10% vol discount, >200 → 20%, >500 → 30%
  const volumeDiscount =
    users >= 500 ? 0.30 :
    users >= 200 ? 0.20 :
    users >= 50  ? 0.10 : 0

  // ── Add-on pricing ─────────────────────────────────────────────────────────
  const addons =
    (needs_api         ? 200 : 0) +   // +$200/mo API access
    (needs_sso         ? 150 : 0) +   // +$150/mo SSO/SAML
    (needs_sla         ? 300 : 0) +   // +$300/mo SLA guarantee
    (needs_onboarding  ? 500 : 0) +   // +$500 one-time onboarding (not monthly)
    (needs_custom_int  ? 250 : 0)     // +$250/mo custom integrations

  const base   = users * BASE_PER_USER
  const volAdj = base * (1 - volumeDiscount)
  const monthly_before_discount = volAdj + (needs_api?200:0) + (needs_sso?150:0) + (needs_sla?300:0) + (needs_custom_int?250:0)

  // ── Discount code check ────────────────────────────────────────────────────
  let discountPct = 0
  const supabase  = await createServerSupabase()
  if (discount_code) {
    const { data: disc } = await supabase.from('enterprise_discounts')
      .select('discount_percent,is_active,valid_until')
      .eq('code', discount_code.toUpperCase())
      .single()
    if (disc?.is_active && (!disc.valid_until || new Date(disc.valid_until) > new Date()))
      discountPct = disc.discount_percent
  }

  const final_monthly = Math.round(monthly_before_discount * (1 - discountPct / 100))
  const annual        = Math.round(final_monthly * 10)   // 2 months free
  const annual_savings = final_monthly * 12 - annual

  // ── Usage tier label ───────────────────────────────────────────────────────
  const usage_tier =
    users >= 200  ? 'enterprise' :
    users >= 50   ? 'high'       : 'standard'

  // ── Save quote ─────────────────────────────────────────────────────────────
  const { data: quote, error } = await supabase.from('enterprise_quotes').insert({
    company_name, contact_email, contact_name, company_size: company_size || 'unknown',
    num_users: users, num_projects: parseInt(num_projects) || 20,
    usage_tier,
    needs_api: !!needs_api, needs_sso: !!needs_sso, needs_sla: !!needs_sla,
    needs_onboarding: !!needs_onboarding, needs_custom_int: !!needs_custom_int,
    base_price_monthly:   Math.round(monthly_before_discount),
    discount_code:        discount_code || null,
    discount_percent:     discountPct,
    final_price_monthly:  final_monthly,
    annual_price:         annual,
    annual_savings:       annual_savings,
    notes,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success:     true,
    quote_ref:   quote.quote_reference,
    breakdown: {
      users,
      base_per_user:   BASE_PER_USER,
      base_monthly:    Math.round(base),
      volume_discount: `${Math.round(volumeDiscount*100)}%`,
      addons_monthly:  (needs_api?200:0)+(needs_sso?150:0)+(needs_sla?300:0)+(needs_custom_int?250:0),
      onboarding_fee:  needs_onboarding ? 500 : 0,
      subtotal:        Math.round(monthly_before_discount),
      code_discount:   discountPct > 0 ? `${discountPct}% (${discount_code})` : null,
      final_monthly,
      annual,
      annual_savings:  Math.round(annual_savings),
    },
    valid_until: quote.valid_until,
  })
}
