// @ts-nocheck
// ── middleware.ts ──────────────────────────────────────────────────────────
// Auth middleware — protects all /dashboard and /project routes

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name)               { return request.cookies.get(name)?.value },
        set(name, value, opts)  { request.cookies.set({ name, value, ...opts }); response.cookies.set({ name, value, ...opts }) },
        remove(name, opts)      { request.cookies.set({ name, value: '', ...opts }); response.cookies.set({ name, value: '', ...opts }) },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Protected routes — redirect to login if no session
  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/project'))) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in — redirect away from auth pages
  if (session && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/project/:path*', '/auth/:path*'],
}
