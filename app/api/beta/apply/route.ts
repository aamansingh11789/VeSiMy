// @ts-nocheck
// ── app/api/beta/apply/route.ts ───────────────────────────────────────────────
// Early Access: everyone is auto-approved during the launch window
// Scoring kept for analytics / future use
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase }           from '@/lib/supabase-server'
import { createAdminClient }              from '@/lib/supabase'

function scoreApplication(data: any): { score: number; breakdown: Record<string, number> } {
  const b: Record<string, number> = {}

  // 1. Lean experience (0–30 pts)
  b.lean_experience = { none: 0, basic: 10, intermediate: 22, expert: 30 }[data.lean_experience] ?? 0

  // 2. Role relevance (0–25 pts)
  const roleScores: Record<string, number> = {
    ops_manager: 25, lean_engineer: 25, plant_mgr: 22, quality_mgr: 20,
    consultant: 18, manufacturing_eng: 20, student: 5, other: 8,
    'Operations Manager': 25, 'Lean / CI Engineer': 25, 'Plant / Site Manager': 22,
    'Quality Manager': 20, 'Manufacturing Engineer': 20, 'Lean Consultant': 18, 'Other': 8,
  }
  b.role = roleScores[data.role] ?? 8

  // 3. Industry match (0–20 pts)
  const indScores: Record<string, number> = {
    automotive: 20, electronics: 20, aerospace: 20, industrial: 18,
    food_bev: 16, healthcare: 15, logistics: 14, construction: 12, other: 8,
    'Automotive': 20, 'Electronics / PCB': 20, 'Aerospace': 20, 'Industrial Manufacturing': 18,
    'Food & Beverage': 16, 'Healthcare': 15, 'Logistics / 3PL': 14, 'Construction': 12, 'Other': 8,
  }
  b.industry = indScores[data.industry] ?? 8

  // 4. Articulation quality (0–15 pts)
  const totalWords = ((data.pain_point || '') + ' ' + (data.use_case || ''))
    .split(/\s+/).filter(Boolean).length
  b.articulation = totalWords >= 80 ? 15 : totalWords >= 50 ? 12 : totalWords >= 30 ? 8 : totalWords >= 15 ? 4 : 1

  // 5. Team size (0–10 pts)
  b.team_size = { '200+': 10, '51-200': 8, '11-50': 6, '1-10': 3 }[data.team_size] ?? 2

  const score = Object.values(b).reduce((a, v) => a + v, 0)
  return { score: Math.min(100, score), breakdown: b }
}

export async function POST(req: NextRequest) {
  try {
  const data = await req.json()

  const required = ['email', 'full_name', 'role', 'industry', 'lean_experience', 'pain_point', 'use_case']
  for (const f of required)
    if (!data[f]?.trim()) return NextResponse.json({ error: `${f} is required` }, { status: 400 })

  const { score, breakdown } = scoreApplication(data)

  // ── Early Access: everyone is auto-approved ────────────────────────────────
  // Check if launch window is still open
  const admin = createAdminClient()
  const { data: win } = await admin.from('launch_window').select('*').single()
  const now = new Date()
  const windowOpen = win?.is_open && (!win.closes_at || new Date(win.closes_at) > now)

  // Status: approved during window, pending otherwise (for future review)
  const status = windowOpen ? 'approved' : (score >= 75 ? 'approved' : score >= 50 ? 'waitlisted' : 'pending')

  const supabase = await createServerSupabase()

  // Duplicate check
  const { data: existing } = await supabase.from('beta_applications')
    .select('id,status').eq('email', data.email.toLowerCase()).single()
  if (existing)
    return NextResponse.json({
      error: `You already have an application on file (status: ${existing.status}).`,
    }, { status: 409 })

  const { error } = await supabase.from('beta_applications').insert({
    email:            data.email.toLowerCase(),
    full_name:        data.full_name,
    company:          data.company || null,
    role:             data.role,
    industry:         data.industry,
    years_experience: data.years_experience ? parseInt(data.years_experience) : null,
    lean_experience:  data.lean_experience,
    current_tools:    data.current_tools || [],
    team_size:        data.team_size || null,
    pain_point:       data.pain_point.slice(0, 500),
    use_case:         data.use_case.slice(0, 500),
    linkedin_url:     data.linkedin_url || null,
    referral_source:  data.referral_source || null,
    score,
    score_breakdown:  breakdown,
    status,
    reviewed_by:      windowOpen ? 'launch_week_auto' : null,
    reviewed_at:      windowOpen ? new Date().toISOString() : null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, score, status, windowOpen })

  } catch (err: any) {
    console.error("[beta/apply]", err)
    return NextResponse.json({ error: err?.message || "Request failed" }, { status: 500 })
  }}
