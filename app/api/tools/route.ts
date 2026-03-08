// @ts-nocheck
// ── app/api/tools/route.ts ───────────────────────────────────────────────────
// Upsert tool data for a step
// POST /api/tools  { stepId, toolType, data }

import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { stepId, toolType, data } = body

  if (!stepId || !toolType) {
    return NextResponse.json({ error: 'stepId and toolType are required' }, { status: 400 })
  }

  // Verify the user owns this step
  const { data: step } = await supabase
    .from('steps')
    .select('id, project_id')
    .eq('id', stepId)
    .eq('user_id', user.id)
    .single()

  if (!step) return NextResponse.json({ error: 'Step not found' }, { status: 404 })

  const { data: result, error } = await supabase
    .from('tool_data')
    .upsert(
      {
        step_id:    stepId,
        user_id:    user.id,
        tool_type:  toolType,
        data:       data || {},
        saved_at:   new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'step_id,tool_type' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Touch project updated_at
  await supabase
    .from('projects')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', step.project_id)

  return NextResponse.json({ toolData: result })
}
