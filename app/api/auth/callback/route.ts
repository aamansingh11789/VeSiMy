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

  // ── Step 4: Check if user has completed onboarding ────────────────────────
  // Do NOT mark as onboarded here — the onboarding wizard does that after
  // the user selects their industry and role. New users get sent to /onboarding.
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles').select('onboarded').eq('id', user.id).single()
      if (!profile || !profile.onboarded) {
        // Rebuild a fresh redirect to /onboarding that carries the same cookies.
        // We cannot reuse the existing `response` because NextResponse.redirect
        // replaces the Location header but the cookies are already attached to
        // the original response object — copying them manually is fragile.
        // Instead we re-create the client writing onto a new response.
        const onboardResponse = NextResponse.redirect(new URL('/onboarding', origin).toString())
        // Re-create client writing cookies onto the new response
        const supabase2 = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() { return request.cookies.getAll() },
              setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                  onboardResponse.cookies.set(name, value, options)
                })
              },
            },
          }
        )
        // Refresh session onto the new response
        await supabase2.auth.getUser()
        // Also copy any cookies already set on the original response
        response.cookies.getAll().forEach(c => {
          if (!onboardResponse.cookies.get(c.name)) {
            onboardResponse.cookies.set(c.name, c.value)
          }
        })
        return onboardResponse
      }
    }
  } catch (_) { /* non-fatal — fall through to dashboard */ }

  // ── Step 5: Return the response — carries session cookies + redirect ───────
  return response
}
