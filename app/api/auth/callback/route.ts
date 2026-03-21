// @ts-nocheck
// ── app/api/auth/callback/route.ts ─────────────────────────────────────────
// OAuth / magic-link callback.
//
// THE CRITICAL PATTERN:
//   1. Build the redirect response FIRST.
//   2. Create the Supabase client so its setAll() writes cookies ON THAT RESPONSE.
//   3. Call exchangeCodeForSession() — cookies land on the response.
//   4. Return the same response object — browser receives session cookies + redirect together.
//
// If you create the response AFTER exchangeCodeForSession, the cookies are lost
// and the browser arrives at /dashboard with no session → kicked back to /login.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next')
  const error = searchParams.get('error')

  // Supabase passed back an OAuth-level error (e.g. user denied Google access)
  if (error) {
    console.error('[auth/callback] OAuth error:', error, searchParams.get('error_description'))
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
  }

  // ── Decide where to land after login ──────────────────────────────────────
  const destination = next?.startsWith('/') ? next : '/dashboard'

  // ── Step 1: Build the redirect response FIRST ─────────────────────────────
  const response = NextResponse.redirect(`${origin}${destination}`)

  // ── Step 2: Create Supabase client that writes cookies onto the response ──
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write every new cookie directly onto the response object
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // ── Step 3: Exchange code — session cookies land on the response above ────
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[auth/callback] Exchange error:', exchangeError.message)
    return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
  }

  // ── Step 4: Optionally mark the user as onboarded ─────────────────────────
  // We do this quietly — don't block the redirect on profile errors
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ onboarded: true }).eq('id', user.id)
    }
  } catch (_) { /* non-fatal */ }

  // ── Step 5: Return the response — carries session cookies + redirect ───────
  return response
}
