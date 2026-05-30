// TypeScript enabled, @ts-nocheck removed as part of quality pass
// ── app/api/stripe/portal/route.ts ────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { createPortalSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles').select('stripe_customer_id').eq('id', user.id).single()

    if (!profile?.stripe_customer_id)
      return NextResponse.json({ error: 'No billing account found. Make sure you have an active subscription.' }, { status: 400 })

    const session = await createPortalSession(
      profile.stripe_customer_id,
      process.env.NEXT_PUBLIC_APP_URL || 'https://vesimy.com'
    )
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('[stripe/portal]', err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}
