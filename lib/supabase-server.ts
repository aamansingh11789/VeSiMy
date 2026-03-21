// @ts-nocheck
// ── lib/supabase-server.ts ─────────────────────────────────────────────────
// Server-side Supabase client — for Server Components and Server Actions only.
// Route Handlers (like auth/callback) must NOT use this — they need to write
// cookies onto their own response object. See app/api/auth/callback/route.ts.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Components cannot set cookies — middleware handles refresh
        }
      },
    },
  })
}
