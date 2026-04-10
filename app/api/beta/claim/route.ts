// @ts-nocheck
// ── app/api/beta/claim/route.ts ───────────────────────────────────────────────
// Early Access Beta: open to everyone while the window is active
// No seat limits — uses admin client to bypass RLS on launch_window
import { NextResponse }         from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST() {
  try {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })

  // Check if user already has beta or lifetime access
  const { data: profile } = await supabase
    .from('profiles').select('is_beta,lifetime_access').eq('id', user.id).single()
  if (profile?.is_beta || profile?.lifetime_access)
    return NextResponse.json({ success: false, message: 'You already have beta access.' })

  // Use admin client to read launch_window (bypasses RLS)
  const admin = createAdminClient()
  const { data: win } = await admin.from('launch_window').select('*').single()

  // Check if launch window is open
  const now = new Date()
  const windowOpen = win?.is_open && (!win.closes_at || new Date(win.closes_at) > now)

  if (!windowOpen) {
    return NextResponse.json({
      success: false,
      message: 'The Gold Standard launch window has closed. Check back for the next beta opening.',
      windowClosed: true,
    })
  }

  // Grant beta access — 30-day trial starting now
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  await Promise.all([
    // Increment counter (informational)
    admin.from('launch_window').update({
      total_claimed: (win.total_claimed || 0) + 1,
      updated_at:    new Date().toISOString(),
    }).eq('id', win.id),

    // Grant beta access on profile
    admin.from('profiles').update({
      is_beta:             true,
      beta_tier:           'gold_standard',
      beta_expires_at:     expiresAt,
      plan_tier:           'trialing',
      projects_limit:      999999,  // unlimited
      subscription_status: 'beta_trial',
    }).eq('id', user.id),
  ])

  return NextResponse.json({ success: true, expiresAt, windowLabel: win?.label || 'Early Access' })

  } catch (err: any) {
    console.error("[beta/claim]", err)
    return NextResponse.json({ error: err?.message || "Request failed" }, { status: 500 })
  }}
