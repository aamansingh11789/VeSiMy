// TypeScript enabled — @ts-nocheck removed as part of quality pass
// app/api/profile/me/route.ts
// Lightweight endpoint to re-fetch the current user's plan fields.
// Used by post-Stripe upgrade polling to check when the webhook has fired.
import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan_tier, lifetime_access, subscription_status')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      plan_tier:           profile?.plan_tier,
      lifetime_access:     profile?.lifetime_access,
      subscription_status: profile?.subscription_status,
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 })
  }
}
