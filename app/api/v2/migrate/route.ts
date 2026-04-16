// @ts-nocheck
// ── app/api/v2/migrate/route.ts ────────────────────────────────────────────────
// Migrates a V1 project to V2 format.
// Maps existing steps to new V2 columns with sensible defaults.
// Preserves all tool_data. Non-destructive.

import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { project_id } = await request.json()

    const { data: project } = await supabase.from('projects')
      .select('*, steps(*)').eq('id', project_id).eq('user_id', user.id).single()

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    if (project.version === 'v2') return NextResponse.json({ message: 'Already V2', project_id })

    // Migrate each step
    const stepUpdates = (project.steps || []).map((step: any) => ({
      id: step.id,
      version: 'v2',
      step_type: guessStepType(step),
      cycle_time_unit: 'seconds',
      cycle_time_type: 'assumed',
      tasks: [],
      missing_info_flags: getMissingFlags(step),
      from_sop: false,
    }))

    for (const update of stepUpdates) {
      const { id, ...data } = update
      await supabase.from('steps').update(data).eq('id', id).eq('user_id', user.id)
    }

    // Mark project as V2 — with user ownership check
    await supabase.from('projects').update({ version: 'v2' }).eq('id', project_id).eq('user_id', user.id)

    return NextResponse.json({
      success: true, project_id,
      steps_migrated: stepUpdates.length,
      message: `Project migrated to V2. ${stepUpdates.length} steps updated.`,
    })

  } catch (err: any) {
    console.error('[migrate]', err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }
}

function guessStepType(step: any): string {
  const name = (step.name || '').toLowerCase()
  if (name.includes('check') || name.includes('verify') || name.includes('inspect') || name.includes('audit'))
    return 'inspection'
  if (name.includes('wait') || name.includes('queue') || name.includes('hold') || name.includes('pending'))
    return 'delay'
  if (name.includes('move') || name.includes('transfer') || name.includes('transport') || name.includes('ship'))
    return 'transport'
  if (name.includes('store') || name.includes('stock') || name.includes('warehouse'))
    return 'storage'
  if (name.includes('rework') || name.includes('repair') || name.includes('fix') || name.includes('redo'))
    return 'rework'
  return 'process'
}

function getMissingFlags(step: any): string[] {
  const flags = []
  if (!step.cycle_time || step.cycle_time === 0) flags.push('cycle_time')
  if (!step.operators || step.operators === 0) flags.push('operators')
  if (step.defect_rate === undefined || step.defect_rate === null) flags.push('defect_rate')
  if (!step.department) flags.push('department')
  return flags
}
