// @ts-nocheck
// ── lib/supabase-admin.ts ──────────────────────────────────────────────────
// SERVER ONLY — never import this from client components.
// Uses the service role key which bypasses all RLS policies.
import 'server-only'
import { createClient as createAdminSupabase } from '@supabase/supabase-js'

export function createAdminClient() {
  return createAdminSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
