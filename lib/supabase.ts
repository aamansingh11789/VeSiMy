// @ts-nocheck
// ── lib/supabase.ts ────────────────────────────────────────────────────────
// Client-side Supabase only — safe to import anywhere including Client Components
// Server-side client is in lib/supabase-server.ts

import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Client-side Supabase (use everywhere) ─────────────────────────────────
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON)
}

