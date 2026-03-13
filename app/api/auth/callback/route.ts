// @ts-nocheck
// ── app/api/auth/callback/route.ts ─────────────────────────────────────────
// After OAuth (Google) — check if new user needs onboarding
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || null

  if (code) {
    const supabase = await createServerSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // next param overrides everything (e.g. from a specific redirect)
        if (next) return NextResponse.redirect(`${origin}${next}`)

        // Check onboarding status — new users won't have a profile yet
        const { data: profile } = await supabase
          .from('profiles').select('onboarded').eq('id', user.id).single()

        // No profile = brand new user, send to onboarding
        // Has profile but not onboarded = send to onboarding
        // Fully onboarded = send to dashboard
        const dest = (!profile || !profile.onboarded) ? '/onboarding' : '/dashboard'
        return NextResponse.redirect(`${origin}${dest}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
