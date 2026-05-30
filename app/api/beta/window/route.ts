// TypeScript enabled, @ts-nocheck removed as part of quality pass
// ── app/api/beta/window/route.ts ──────────────────────────────────────────────
// Returns current launch window status (public, no auth required)
import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.from('launch_window').select('*').single()
    if (error || !data) {
      // If table doesn't exist yet (pre-migration), return open state
      return NextResponse.json({ is_open: true, closes_at: null, label: 'Early Access' })
    }
    const now        = new Date()
    const windowOpen = data.is_open && (!data.closes_at || new Date(data.closes_at) > now)
    return NextResponse.json({
      is_open:       windowOpen,
      closes_at:     data.closes_at,
      label:         data.label || 'Early Access',
      total_claimed: data.total_claimed || 0,
    })
  } catch {
    return NextResponse.json({ is_open: true, closes_at: null, label: 'Early Access' })
  }
}
