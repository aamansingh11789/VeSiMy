// TypeScript enabled, @ts-nocheck removed as part of quality pass
// ── app/api/projects/route.ts ──────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

// GET /api/projects, list all projects for the current user
export async function GET() {
  try {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Failed to load projects. Please refresh.' }, { status: 500 })
  // Filter status in JS so legacy NULL-status projects are not hidden.
  const projects = (data || []).filter((p: any) => p.status !== 'archived' && p.status !== 'template')
  return NextResponse.json({ projects })

  } catch (err: any) {
    console.error("[projects]", err)
    return NextResponse.json({ error: 'Failed to load projects. Please refresh.' }, { status: 500 })
  }}

// POST /api/projects, create a new project
export async function POST(request: NextRequest) {
  try {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check plan limits, count live from DB, not stale profile.projects_count
  const [{ data: profile }, { data: projRows }] = await Promise.all([
    supabase.from('profiles').select('projects_limit, plan_tier, lifetime_access, is_beta').eq('id', user.id).single(),
    supabase.from('projects').select('id, status').eq('user_id', user.id),
  ])
  // Count visible projects (active + legacy NULL), excluding archived/template.
  const liveCount = (projRows || []).filter((p: any) => p.status !== 'archived' && p.status !== 'template').length

  const tier        = profile?.plan_tier || 'trial'
  const limit       = profile?.projects_limit ?? 3
  const count       = liveCount ?? 0
  const isUnlimited = ['pro', 'lifetime', 'enterprise'].includes(tier) || profile?.lifetime_access
  const isTrialing  = ['trialing', 'trial'].includes(tier) || profile?.is_beta

  if (!isUnlimited && count >= limit) {
    const msg = isTrialing
      ? 'Trial limit reached (3 projects). Upgrade to Pro to continue.'
      : `Project limit reached. Your plan allows ${limit} projects.`
    return NextResponse.json({ error: msg, code: 'LIMIT_REACHED' }, { status: 403 })
  }

  const body = await request.json()

  const { data, error } = await supabase.from('projects').insert({
    user_id:     user.id,
    version:     'v2',
    name:        body.name || 'New Project',
    description: body.description,
    industry:    body.industry,
    customer:    body.customer,
    state:       body.state || 'current',
    status:      'active',
  }).select().single()

  if (error) return NextResponse.json({ error: 'Failed to load projects. Please refresh.' }, { status: 500 })
  return NextResponse.json({ project: data }, { status: 201 })

  } catch (err: any) {
    console.error("[projects]", err)
    return NextResponse.json({ error: 'Failed to load projects. Please refresh.' }, { status: 500 })
  }}
