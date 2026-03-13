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
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser()
      if (user && !next) {
        const { data: profile } = await supabase
          .from('profiles').select('onboarded').eq('id', user.id).single()
        const dest = profile?.onboarded ? '/dashboard' : '/onboarding'
        return NextResponse.redirect(`${origin}${dest}`)
      }
      return NextResponse.redirect(`${origin}${next || '/dashboard'}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
