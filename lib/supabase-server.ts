// @ts-nocheck
// ── lib/supabase-server.ts ─────────────────────────────────────────────────
// Server-side Supabase — only import this in Server Components and API Routes
// NEVER import this in Client Components ('use client' files)

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string)         { return cookieStore.get(name)?.value },
      set(name, value, options) { try { cookieStore.set({ name, value, ...options }) } catch {} },
      remove(name, options)     { try { cookieStore.set({ name, value: '', ...options }) } catch {} },
    },
  })
}
