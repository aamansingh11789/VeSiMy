// TypeScript enabled, @ts-nocheck removed as part of quality pass
// ── app/api/auth/callback/route.ts ─────────────────────────────────────────
// OAuth / magic-link callback, correct Supabase SSR cookie pattern.
// CRITICAL: build redirect response FIRST, create Supabase client writing to
// that same response, exchange code, THEN check onboarding status and
// mutate the Location header rather than creating a second response.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next')
  const error = searchParams.get('error')

  if (error) {
    console.error('[auth/callback] OAuth error:', error)
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
  }

  // Step 1: Build redirect to dashboard first, we will adjust destination below
  const response = NextResponse.redirect(`${origin}/dashboard`)

  // Step 2: Create Supabase client that writes cookies onto this response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Step 3: Exchange code, session cookies land on the response
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    console.error('[auth/callback] Exchange error:', exchangeError.message)
    return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
  }

  // Step 4: Determine final destination
  // Adjust the Location header on the SAME response (cookies stay intact)
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Remove from Tier 0 nurture email sequence if they signed up from /start
      if (user.email && process.env.SENDER_API_KEY && process.env.SENDER_TIER0_GROUP_ID) {
        fetch('https://api.sender.net/v2/subscribers/groups', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${process.env.SENDER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email, groups: [process.env.SENDER_TIER0_GROUP_ID] }),
        }).catch(() => {}) // fire-and-forget, never block auth
      }
      const { data: profile } = await supabase
        .from('profiles').select('onboarded').eq('id', user.id).single()

      const isOnboarded = profile && (profile as any).onboarded === true

      if (!isOnboarded) {
        // New user, redirect to onboarding. Reuse same response to keep cookies.
        response.headers.set('Location', `${origin}/onboarding`)
        return response
      }

      // If a specific destination was requested (e.g. from a magic link)
      if (next?.startsWith('/') && !next.startsWith('/auth')) {
        response.headers.set('Location', `${origin}${next}`)
        return response
      }
    }
  } catch (e) {
    console.error('[auth/callback] Profile check failed:', e)
    // Fall through to dashboard
  }

  return response
}
