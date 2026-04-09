// @ts-nocheck
// ── app/api/steps/[id]/route.ts ──────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

interface Params { params: { id: string } }

// PATCH /api/steps/:id
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const updates = {
      name:         body.name         !== undefined ? body.name         : undefined,
      cycle_time:   body.cycle_time   !== undefined ? body.cycle_time   : undefined,
      wait_time:    body.wait_time    !== undefined ? body.wait_time    : undefined,
      operators:    body.operators    !== undefined ? body.operators    : undefined,
      uptime:       body.uptime       !== undefined ? body.uptime       : undefined,
      defect_rate:  body.defect_rate  !== undefined ? body.defect_rate  : undefined,
      department:   body.department   !== undefined ? body.department   : undefined,
      flow_type:    body.flow_type    !== undefined ? body.flow_type    : undefined,
      sm_min:       body.sm_min       !== undefined ? body.sm_min       : undefined,
      sm_max:       body.sm_max       !== undefined ? body.sm_max       : undefined,
      notes:        body.notes        !== undefined ? body.notes        : undefined,
      va_type:      body.va_type      !== undefined ? body.va_type      : undefined,
      op_steps:     body.op_steps     !== undefined ? body.op_steps     : undefined,
      position:     body.position     !== undefined ? body.position     : undefined,
      branch_id:    body.branch_id    !== undefined ? body.branch_id    : undefined,
      updated_at:   new Date().toISOString(),
    }

    const clean = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined))

    const { data, error } = await supabase
      .from('steps')
      .update(clean)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ step: data })
  } catch (err: any) {
    console.error('[steps/[id] PATCH]', err)
    return NextResponse.json({ error: err?.message || 'Request failed' }, { status: 500 })
  }
}

// DELETE /api/steps/:id
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('steps')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[steps/[id] DELETE]', err)
    return NextResponse.json({ error: err?.message || 'Request failed' }, { status: 500 })
  }
}
