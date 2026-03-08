// @ts-nocheck
// ── app/api/steps/route.ts ───────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

// POST /api/steps — create a new step
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { projectId, ...form } = body

  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

  // Get max position for this project
  const { data: existing } = await supabase
    .from('steps')
    .select('position')
    .eq('project_id', projectId)
    .order('position', { ascending: false })
    .limit(1)

  const position = existing?.length ? existing[0].position + 1 : 0

  const { data, error } = await supabase
    .from('steps')
    .insert({
      project_id:          projectId,
      user_id:             user.id,
      position,
      name:                form.name                || 'New Step',
      department:          form.department,
      operators:           form.operators           ? Number(form.operators)           : 1,
      uptime:              form.uptime              ? Number(form.uptime)              : null,
      defect_rate:         form.defect_rate         ? Number(form.defect_rate)         : null,
      completion_accuracy: form.completion_accuracy ? Number(form.completion_accuracy) : null,
      wait_time:           form.wait_time           ? Number(form.wait_time)           : 0,
      trans_time:          form.trans_time          ? Number(form.trans_time)          : 0,
      wip:                 form.wip                 ? Number(form.wip)                 : 0,
      flow_type:           form.flow_type           || 'push',
      sm_min:              form.sm_min              ? Number(form.sm_min)              : null,
      sm_max:              form.sm_max              ? Number(form.sm_max)              : null,
      notes:               form.notes,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update project updated_at
  await supabase.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', projectId)

  return NextResponse.json({ step: { ...data, toolData: {} } }, { status: 201 })
}
