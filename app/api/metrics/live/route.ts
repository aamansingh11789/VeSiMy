// @ts-nocheck
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase }           from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 })

  const { step_id, project_id, metric_type, value, notes } = await request.json()
  if (!step_id||!project_id||!metric_type||value===undefined)
    return NextResponse.json({ error:'Missing fields' }, { status:400 })

  const { data, error } = await supabase.from('live_metrics')
    .insert({ step_id, project_id, metric_type, value:Number(value), notes:notes||null, operator_id:user.id })
    .select().single()

  if (error) return NextResponse.json({ error:error.message }, { status:500 })
  return NextResponse.json({ success:true, metric:data })
}
