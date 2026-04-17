// @ts-nocheck
import { NextResponse, type NextRequest } from 'next/server'
import { createServerSupabase }           from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error:'Unauthorized' }, { status:401 })

  // Verify user has paid plan (Live Floor is a Pro feature)
  const { data: profile } = await supabase.from('profiles')
    .select('plan_tier, lifetime_access, is_beta').eq('id', user.id).single()
  const isPaid = ['pro','lifetime','enterprise'].includes(profile?.plan_tier) ||
    profile?.lifetime_access || profile?.is_beta
  if (!isPaid) return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })

  const { step_id, project_id, metric_type, value, notes } = await request.json()
  if (!step_id||!project_id||!metric_type||value===undefined)
    return NextResponse.json({ error:'Missing fields' }, { status:400 })

  // FIX: verify user owns the step being logged (prevents cross-user metric injection)
  const { data: stepOwner, error: stepOwnerErr } = await supabase
    .from('steps').select('id').eq('id', step_id).eq('user_id', user.id).single()
  if (stepOwnerErr || !stepOwner)
    return NextResponse.json({ error:'Step not found' }, { status:404 })

  const { data, error } = await supabase.from('live_metrics')
    .insert({ step_id, project_id, metric_type, value:Number(value), notes:notes||null, user_id:user.id })
    .select().single()

  if (error) return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  return NextResponse.json({ success:true, metric:data })

  } catch (err: any) {
    console.error("[metrics/live]", err)
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 })
  }}
