// TypeScript enabled
// ── middleware.ts ─────────────────────────────────────────────────────────────
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Protected routes, redirect to login if no session
  const protectedPaths = ['/dashboard', '/project', '/settings', '/onboarding', '/projects', '/kaizen', '/learn', '/guided', '/skill-matrix']
  // Public routes that should never redirect even if they match a protected prefix
  const publicPaths = ['/start']
  if (!user && protectedPaths.some(p => pathname.startsWith(p)) && !publicPaths.some(p => pathname.startsWith(p))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged-in users must never see the auth pages, always send to dashboard.
  // This covers both /auth/login and /auth/signup regardless of how they got there.
  if (user && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))) {
    const dashUrl = request.nextUrl.clone()
    dashUrl.pathname = '/dashboard'
    dashUrl.search = ''
    return NextResponse.redirect(dashUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/project/:path*',
    '/projects/:path*',
    '/settings',
    '/settings/:path*',
    '/onboarding',
    '/onboarding/:path*',
    '/kaizen/:path*',
    '/learn/:path*',
    '/auth/login',
    '/auth/signup',
  ],
}
