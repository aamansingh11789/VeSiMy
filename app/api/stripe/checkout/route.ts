// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── app/api/stripe/checkout/route.ts ──────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { createCheckoutSession, PLANS } from '@/lib/stripe'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { plan } = await request.json()
    const planConfig = PLANS[plan as keyof typeof PLANS]

    // Check plan exists
    if (!planConfig) return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 })

    // Check price ID is configured
    if (!planConfig.priceId) return NextResponse.json({ error: `Price not configured for plan: ${plan}. Add ${plan.toUpperCase()}_PRICE_ID to Vercel env vars.` }, { status: 400 })

    const { data: profile } = await supabase
      .from('profiles').select('stripe_customer_id').eq('id', user.id).single()

    const session = await createCheckoutSession({
      customerId: profile?.stripe_customer_id || undefined,
      priceId:    planConfig.priceId,
      userId:     user.id,
      email:      user.email!,
      plan,
      returnUrl:  process.env.NEXT_PUBLIC_APP_URL || 'https://vesimy.com',
    })

    return NextResponse.json({ url: session.url })

  } catch (err: any) {
    console.error('[stripe/checkout]', err)
    // Return the actual Stripe error message so we can debug it
    return NextResponse.json(
      { error: err?.message || 'Checkout failed. Check Vercel logs for details.' },
      { status: 500 }
    )
  }
}
