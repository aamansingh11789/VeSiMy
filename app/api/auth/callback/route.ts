// @ts-nocheck
// ── app/api/auth/callback/route.ts ─────────────────────────────────────────
// After OAuth (Google) or magic link — exchange code for session, route user

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') || null
  const error = searchParams.get('error')

  // Supabase passed back an error (e.g. user denied Google access)
  if (error) {
    console.error('[auth/callback] OAuth error:', error, searchParams.get('error_description'))
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
  }

  try {
    const supabase = await createServerSupabase()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('[auth/callback] Exchange error:', exchangeError.message)
      return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(`${origin}/auth/login?error=no_user`)
    }

    // next param overrides (e.g. from specific redirect)
    if (next) return NextResponse.redirect(`${origin}${next}`)

    // Check onboarding — new Google users won't have a profile yet
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarded')
      .eq('id', user.id)
      .maybeSingle()  // maybeSingle doesn't throw if no row exists

    const dest = (!profile || !profile.onboarded) ? '/onboarding' : '/dashboard'
    return NextResponse.redirect(`${origin}${dest}`)

  } catch (err) {
    console.error('[auth/callback] Unexpected error:', err)
    return NextResponse.redirect(`${origin}/auth/login?error=unexpected`)
  }
}
