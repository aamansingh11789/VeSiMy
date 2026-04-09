// @ts-nocheck
// ── app/api/steps/route.ts ───────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

// POST /api/steps — create a new step
export async function POST(request: NextRequest) {
  try {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Accept both camelCase (projectId) and snake_case (project_id) from callers
  const projectId = body.projectId || body.project_id

  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

  // Get max position for this project
  const { data: existing } = await supabase
    .from('steps')
    .select('position')
    .eq('project_id', projectId)
    .order('position', { ascending: false })
    .limit(1)

  // Use explicit order_index if provided (onboarding template pre-loads), otherwise auto-increment
  const position = body.order_index !== undefined
    ? Number(body.order_index)
    : (existing?.length ? existing[0].position + 1 : 0)

  const { data, error } = await supabase
    .from('steps')
    .insert({
      project_id:          projectId,
      user_id:             user.id,
      position,
      name:                body.name                || 'New Step',
      department:          body.department,
      operators:           body.operators           ? Number(body.operators)           : 1,
      uptime:              body.uptime              ? Number(body.uptime)              : null,
      defect_rate:         body.defect_rate         ? Number(body.defect_rate)         : null,
      completion_accuracy: body.completion_accuracy ? Number(body.completion_accuracy) : null,
      wait_time:           body.wait_time           ? Number(body.wait_time)           : 0,
      trans_time:          body.trans_time          ? Number(body.trans_time)          : 0,
      wip:                 body.wip                 ? Number(body.wip)                 : 0,
      flow_type:           body.flow_type           || 'push',
      sm_min:              body.sm_min              ? Number(body.sm_min)              : null,
      sm_max:              body.sm_max              ? Number(body.sm_max)              : null,
      notes:               body.notes,
      va_type:             body.va_type || "va",
      op_steps:            body.op_steps || [],
      // V2 fields — only written if the column exists (migration applied)
      // These are ignored silently by Supabase if the column doesn't exist yet
      ...(body.step_type        && { step_type:        body.step_type }),
      ...(body.cycle_time_unit  && { cycle_time_unit:  body.cycle_time_unit }),
      ...(body.cycle_time_type  && { cycle_time_type:  body.cycle_time_type }),
      ...(body.tasks            && { tasks:            body.tasks }),
      ...(body.from_sop         && { from_sop:         body.from_sop }),
      ...(body.version          && { version:          body.version }),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update project updated_at
  await supabase.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', projectId)

  return NextResponse.json({ step: { ...data, toolData: {} } }, { status: 201 })

  } catch (err: any) {
    console.error("[steps]", err)
    return NextResponse.json({ error: err?.message || "Request failed" }, { status: 500 })
  }}

