// @ts-nocheck
// ── app/api/projects/[id]/route.ts ─────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

interface Params { params: { id: string } }

// GET /api/projects/[id]
export async function GET(_: NextRequest, {
  try { params 
  } catch (err: any) {
    console.error("[projects/[id]]", err)
    return NextResponse.json({ error: err?.message || "Request failed" }, { status: 500 })
  }}: Params) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('projects').select('*').eq('id', params.id).eq('user_id', user.id).single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ project: data })
}

// PATCH /api/projects/[id]
export async function PATCH(request: NextRequest, {
  try { params 
  } catch (err: any) {
    console.error("[projects/[id]]", err)
    return NextResponse.json({ error: err?.message || "Request failed" }, { status: 500 })
  }}: Params) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const updates = {
    name:           body.name,
    description:    body.description,
    industry:       body.industry,
    state:          body.state,
    status:         body.status,
    customer:       body.customer,
    updated_at:     new Date().toISOString(),
  }
  // Remove undefined keys
  Object.keys(updates).forEach(k => updates[k as keyof typeof updates] === undefined && delete updates[k as keyof typeof updates])

  const { data, error } = await supabase
    .from('projects').update(updates).eq('id', params.id).eq('user_id', user.id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ project: data })
}

// DELETE /api/projects/[id]
export async function DELETE(_: NextRequest, {
  try { params 
  } catch (err: any) {
    console.error("[projects/[id]]", err)
    return NextResponse.json({ error: err?.message || "Request failed" }, { status: 500 })
  }}: Params) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('projects').delete().eq('id', params.id).eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
