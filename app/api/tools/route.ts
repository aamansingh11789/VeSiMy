// TypeScript enabled, @ts-nocheck removed as part of quality pass
// ── app/api/tools/route.ts ───────────────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { stepId, toolType, data } = body || {}

  if (!stepId || !toolType) {
    return NextResponse.json(
      { error: 'stepId and toolType are required' },
      { status: 400 }
    )
  }

  const { data: step, error: stepError } = await supabase
    .from('steps')
    .select('id, project_id, user_id')
    .eq('id', stepId)
    .eq('user_id', user.id)
    .single()

  if (stepError || !step) {
    return NextResponse.json({ error: 'Step not found' }, { status: 404 })
  }

  const { data: existing, error: existingError } = await supabase
    .from('tool_data')
    .select('id')
    .eq('step_id', stepId)
    .eq('tool', toolType)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 })
  }

  let result: any = null

  if (existing?.id) {
    const { data: updated, error } = await supabase
      .from('tool_data')
      .update({
        data: data || {},
        saved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to save tool data.' }, { status: 500 })
    }

    result = updated
  } else {
    const { data: inserted, error } = await supabase
      .from('tool_data')
      .insert({
        step_id: stepId,
        project_id: step.project_id,
        user_id: user.id,
        tool: toolType,
        data: data || {},
        saved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to save tool data.' }, { status: 500 })
    }

    result = inserted
  }

  await supabase
    .from('projects')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', step.project_id)
    .eq('user_id', user.id)

  return NextResponse.json({ toolData: result })

  } catch (err: any) {
    console.error("[tools]", err)
    return NextResponse.json({ error: 'Failed to save tool data.' }, { status: 500 })
  }}