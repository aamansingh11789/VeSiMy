// TypeScript enabled — @ts-nocheck removed as part of quality pass
// ── app/api/projects/[id]/route.ts ─────────────────────────────────────────
import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

interface Params { params: { id: string } }

// GET /api/projects/[id]
export async function GET(_: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('projects').select('*').eq('id', params.id).eq('user_id', user.id).single()

    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ project: data })
  } catch (err: any) {
    console.error('[projects/[id] GET]', err)
    return NextResponse.json({ error: 'Failed to load project.' }, { status: 500 })
  }
}

// PATCH /api/projects/[id]
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const updates = {
      name:               body.name,
      description:        body.description,
      industry:           body.industry,
      state:              body.state,
      status:             body.status,
      customer:           body.customer,
      // VSM / takt fields
      product:            body.product,
      supplier:           body.supplier,
      demand:             body.demand            !== undefined ? (body.demand    ? Number(body.demand)            : null) : undefined,
      working_hours:      body.working_hours     !== undefined ? (body.working_hours ? Number(body.working_hours) : null) : undefined,
      shifts:             body.shifts            !== undefined ? (body.shifts    ? Number(body.shifts)            : null) : undefined,
      available_time_sec: body.available_time_sec !== undefined ? (body.available_time_sec ? Number(body.available_time_sec) : null) : undefined,
      takt_time:          body.takt_time         !== undefined ? (body.takt_time ? Number(body.takt_time)         : null) : undefined,
      kaizen_roadmap:     body.kaizen_roadmap,
      updated_at:         new Date().toISOString(),
    }
    Object.keys(updates).forEach(k => updates[k as keyof typeof updates] === undefined && delete updates[k as keyof typeof updates])

    const { data, error } = await supabase
      .from('projects').update(updates).eq('id', params.id).eq('user_id', user.id).select().single()

    if (error) return NextResponse.json({ error: 'Failed to load project.' }, { status: 500 })
    return NextResponse.json({ project: data })
  } catch (err: any) {
    console.error('[projects/[id] PATCH]', err)
    return NextResponse.json({ error: 'Failed to load project.' }, { status: 500 })
  }
}

// DELETE /api/projects/[id]
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('projects').delete().eq('id', params.id).eq('user_id', user.id)

    if (error) return NextResponse.json({ error: 'Failed to load project.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[projects/[id] DELETE]', err)
    return NextResponse.json({ error: 'Failed to load project.' }, { status: 500 })
  }
}
