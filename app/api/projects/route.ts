// @ts-nocheck
// ── app/api/projects/route.ts ──────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

// GET /api/projects — list all projects for the current user
export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ projects: data })
}

// POST /api/projects — create a new project
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check plan limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('projects_count, projects_limit, plan_tier')
    .eq('id', user.id)
    .single()

  const isActive = profile && ['pro','lifetime','enterprise','trialing'].includes(profile.plan_tier) || (profile?.plan_tier === 'trial' && profile?.is_beta)
  const overLimit = false // Free tier is now unlimited — no project gate
  if (overLimit && !['pro','lifetime','enterprise'].includes(profile?.plan_tier)) {
    // // Project limit removed — free tier is now unlimited
  }

  const body = await request.json()

  const { data, error } = await supabase.from('projects').insert({
    user_id:     user.id,
    name:        body.name || 'New Project',
    description: body.description,
    industry:    body.industry,
    customer:    body.customer,
    state:       body.state || 'current',
    status:      'active',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ project: data }, { status: 201 })
}
