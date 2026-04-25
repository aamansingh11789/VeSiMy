// TypeScript enabled
// ── app/api/projects/[id]/snapshot/route.ts ───────────────────────────────────
// POST — save current project state as a version snapshot
// GET  — list all snapshots for a project

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

interface Params { params: { id: string } }

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body  = await request.json()
    const { label, description } = body || {}

    // Load current project + steps
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('*, steps(*)')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (projErr || !project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    // Calculate current metrics
    const steps = (project.steps || []) as any[]
    const mainSteps = steps.filter((s: any) => s.is_main_flow !== false)
    const totalCT   = mainSteps.reduce((a: number, s: any) => a + (Number(s.cycle_time) || 0), 0)
    const totalWait = mainSteps.reduce((a: number, s: any) => a + (Number(s.wait_time) || 0), 0)
    const leadTime  = totalCT + totalWait
    const vaSteps   = mainSteps.filter((s: any) => s.va_type === 'va')
    const vaCT      = vaSteps.reduce((a: number, s: any) => a + (Number(s.cycle_time) || 0), 0)
    const pce       = leadTime > 0 ? Math.round((vaCT / leadTime) * 1000) / 10 : null

    // Get next version number
    const { count } = await supabase
      .from('version_snapshots')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', params.id)
      .eq('user_id', user.id)

    const versionNumber = (count || 0) + 1

    // Prepare snapshot data (exclude sensitive join fields)
    const snapshotData = {
      project: {
        id: project.id, name: project.name, industry: project.industry,
        demand: project.demand, takt_time: project.takt_time,
      },
      steps: steps.map((s: any) => ({
        id: s.id, name: s.name, position: s.position,
        cycle_time: s.cycle_time, wait_time: s.wait_time, wip: s.wip,
        defect_rate: s.defect_rate, va_type: s.va_type,
        is_main_flow: s.is_main_flow, branch_id: s.branch_id,
        is_bottleneck: s.is_bottleneck,
      })),
      capturedAt: new Date().toISOString(),
    }

    const { data: snapshot, error } = await supabase
      .from('version_snapshots')
      .insert({
        project_id:     params.id,
        user_id:        user.id,
        version_number: versionNumber,
        label:          label || null,
        description:    description || null,
        snapshot_data:  snapshotData,
        step_count:     steps.length,
        total_ct:       totalCT,
        total_wait:     totalWait,
        pce:            pce,
        metrics:        { totalCT, totalWait, leadTime, vaCT, pce, stepCount: steps.length },
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to save snapshot' }, { status: 500 })
    return NextResponse.json({ snapshot })

  } catch (err: any) {
    console.error('[snapshot POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('version_snapshots')
      .select('id, version_number, label, description, step_count, total_ct, total_wait, pce, created_at')
      .eq('project_id', params.id)
      .eq('user_id', user.id)
      .order('version_number', { ascending: false })

    if (error) return NextResponse.json({ error: 'Failed to load snapshots' }, { status: 500 })
    return NextResponse.json({ snapshots: data || [] })

  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
