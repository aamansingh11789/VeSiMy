// @ts-nocheck
// ── middleware.ts ──────────────────────────────────────────────────────────
// Supabase SSR auth middleware — correct cookie pattern.
// Uses getAll/setAll and getUser() (not getSession) per Supabase SSR docs.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write to request first so later handlers in this same middleware see them
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Rebuild the response so the updated cookies flow to the browser
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() validates the JWT with Supabase servers.
  // getSession() only reads the local cookie — can be stale / spoofed.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protected routes — redirect to login if no valid user
  const protectedPaths = ['/dashboard', '/project', '/settings', '/onboarding', '/projects', '/kaizen', '/learn']
  if (!user && protectedPaths.some(p => pathname.startsWith(p))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in — redirect away from auth pages, but only if genuinely authenticated.
  // Do NOT redirect if user came directly to /auth/login or /auth/signup from homepage.
  // Only redirect if they navigated there while an active dashboard session exists
  // (i.e. they bookmarked /auth/login while logged in).
  if (user && pathname === '/auth/login') {
    // Check if this is a fresh navigation (no referer) or came from within the app
    const referer = request.headers.get('referer') || ''
    const host = request.headers.get('host') || ''
    const isInternalNav = referer.includes(host) && !referer.includes('/auth/')
    if (isInternalNav) {
      const dashUrl = request.nextUrl.clone()
      dashUrl.pathname = '/dashboard'
      dashUrl.search = ''
      return NextResponse.redirect(dashUrl)
    }
  }

  // Logged-in user on /onboarding — allow through (onboarding page handles redirect if already done)

  // Return the supabaseResponse — it carries any refreshed session cookies
  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/project/:path*',
    '/projects/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/kaizen/:path*',
    '/learn/:path*',
    '/auth/login',
    '/auth/signup',
  ],
}
