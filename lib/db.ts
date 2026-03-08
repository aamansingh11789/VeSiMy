// @ts-nocheck
// ── lib/db.ts ────────────────────────────────────────────────────────────────
// Vesimy database access layer
// All Supabase queries go through here — keeps components clean

import { createClient } from '@/lib/supabase'
import type { Project, Step, KanbanCard, KanbanColumn } from './store'

// ══════════════════════════════════════════════════════════════════════════════
//  PROJECTS
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchProjects(): Promise<Project[]> {
  const db = createClient()
  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}

export async function fetchProject(id: string): Promise<Project> {
  const db = createClient()

  // Fetch project + steps + tool_data in one query
  const { data, error } = await db
    .from('projects')
    .select(`
      *,
      steps (
        *,
        tool_data (*)
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  // Transform: attach toolData as keyed map to each step
  const project = data as any
  project.steps = (project.steps || [])
    .sort((a: any, b: any) => a.position - b.position)
    .map((step: any) => ({
      ...step,
      toolData: Object.fromEntries(
        (step.tool_data || []).map((td: any) => [td.tool_type, td.data])
      ),
      tool_data: undefined,
    }))

  return project as Project
}

export async function createProject(form: Partial<Project>): Promise<Project> {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await db
    .from('projects')
    .insert({
      user_id:            user.id,
      name:               form.name || 'New Project',
      description:        form.description,
      industry:           form.industry,
      state:              form.state || 'current',
      product:            form.product,
      customer:           form.customer,
      supplier:           form.supplier,
      demand:             form.demand             ? Number(form.demand)             : null,
      working_hours:      form.working_hours       ? Number(form.working_hours)       : null,
      available_time_sec: form.available_time_sec  ? Number(form.available_time_sec)  : null,
      takt_time:          form.takt_time           ? Number(form.takt_time)           : null,
      shifts:             form.shifts              ? Number(form.shifts)              : 1,
    })
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const db = createClient()
  const { error } = await db
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function archiveProject(id: string): Promise<void> {
  await updateProject(id, { status: 'archived' } as any)
}

export async function deleteProject(id: string): Promise<void> {
  const db = createClient()
  const { error } = await db.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ══════════════════════════════════════════════════════════════════════════════
//  STEPS
// ══════════════════════════════════════════════════════════════════════════════

export async function createStep(projectId: string, form: Partial<Step>): Promise<Step> {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get max position
  const { data: existing } = await db
    .from('steps')
    .select('position')
    .eq('project_id', projectId)
    .order('position', { ascending: false })
    .limit(1)

  const position = existing?.length ? existing[0].position + 1 : 0

  // Build insert object — only include columns that exist in base schema
  // Optional columns added via migrations are included only if they have values
  const insertData: Record<string, any> = {
    project_id: projectId,
    user_id:    user.id,
    position,
    name:       form.name || 'New Step',
    operators:  form.operators ? Number(form.operators) : 1,
    wait_time:  form.wait_time ? Number(form.wait_time) : 0,
    trans_time: form.trans_time ? Number(form.trans_time) : 0,
    wip:        form.wip ? Number(form.wip) : 0,
    flow_type:  form.flow_type || 'push',
  }

  // Optional text fields
  if (form.department) insertData.department = form.department
  if (form.notes)      insertData.notes      = form.notes

  // Optional numeric fields — only include if set (avoids schema cache errors)
  if (form.uptime      != null) insertData.uptime      = Number(form.uptime)
  if (form.defect_rate != null) insertData.defect_rate = Number(form.defect_rate)
  if (form.sm_min      != null) insertData.sm_min      = Number(form.sm_min)
  if (form.sm_max      != null) insertData.sm_max      = Number(form.sm_max)

  // Migration columns — wrapped in try to handle missing columns gracefully
  try { if (form.completion_accuracy != null) insertData.completion_accuracy = Number(form.completion_accuracy) } catch {}
  try { insertData.setup_time   = form.setup_time ? Number((form as any).setup_time) : 0 } catch {}
  try { insertData.is_main_flow = (form as any).is_main_flow !== undefined ? (form as any).is_main_flow : true } catch {}
  try { if ((form as any).branch_id) insertData.branch_id = (form as any).branch_id } catch {}
  try { if ((form as any).branch_position != null) insertData.branch_position = Number((form as any).branch_position) } catch {}

  const { data, error } = await db
    .from('steps')
    .insert(insertData)
    .select()
    .single()

  if (error) throw error
  return { ...data, toolData: {} } as Step
}

export async function updateStep(stepId: string, updates: Partial<Step>): Promise<void> {
  const db = createClient()
  const { toolData, ...rest } = updates as any
  const { error } = await db
    .from('steps')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', stepId)
  if (error) throw error
}

export async function deleteStep(stepId: string): Promise<void> {
  const db = createClient()
  const { error } = await db.from('steps').delete().eq('id', stepId)
  if (error) throw error
}

export async function reorderSteps(
  projectId: string,
  orderedIds: string[]
): Promise<void> {
  const db = createClient()
  // Batch update positions
  await Promise.all(
    orderedIds.map((id, position) =>
      db.from('steps').update({ position }).eq('id', id)
    )
  )
}

// ══════════════════════════════════════════════════════════════════════════════
//  TOOL DATA
//  Upsert: one record per tool per step, updated on every save
// ══════════════════════════════════════════════════════════════════════════════

export async function saveToolData(
  stepId: string,
  toolType: string,
  data: Record<string, any>
): Promise<void> {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await db
    .from('tool_data')
    .upsert(
      {
        step_id:   stepId,
        user_id:   user.id,
        tool_type: toolType,
        data:      data,
        saved_at:  new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'step_id,tool_type' }
    )

  if (error) throw error
}

export async function getToolData(
  stepId: string,
  toolType: string
): Promise<Record<string, any> | null> {
  const db = createClient()
  const { data, error } = await db
    .from('tool_data')
    .select('data')
    .eq('step_id', stepId)
    .eq('tool_type', toolType)
    .maybeSingle()

  if (error) throw error
  return data?.data ?? null
}

// ══════════════════════════════════════════════════════════════════════════════
//  PROFILE
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchProfile() {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) return null

  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(updates: Record<string, any>) {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await db
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ══════════════════════════════════════════════════════════════════════════════
//  BRANCHES
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchBranches(projectId: string) {
  const db = createClient()
  const { data, error } = await db
    .from('branches')
    .select('*')
    .eq('project_id', projectId)
    .order('position')
  if (error) throw error
  return data || []
}

export async function createBranch(projectId: string, form: {
  label: string
  color: string
  parent_step_id: string | null
  merge_step_id:  string | null
}) {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Generate a unique branch_id
  const branchId = `branch-${Date.now()}`

  // Count existing branches for position
  const { data: existing } = await db
    .from('branches').select('position').eq('project_id', projectId)
    .order('position', { ascending: false }).limit(1)
  const position = existing?.length ? existing[0].position + 1 : 0

  const { data, error } = await db.from('branches').insert({
    project_id:     projectId,
    user_id:        user.id,
    branch_id:      branchId,
    label:          form.label,
    color:          form.color,
    parent_step_id: form.parent_step_id,
    merge_step_id:  form.merge_step_id,
    position,
  }).select().single()

  if (error) throw error
  return data
}

export async function updateBranch(id: string, updates: Record<string, any>) {
  const db = createClient()
  const { error } = await db.from('branches').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteBranch(id: string, branchId: string) {
  const db = createClient()
  // Delete all steps in this branch first
  await db.from('steps').delete().eq('branch_id', branchId)
  // Then delete the branch definition
  const { error } = await db.from('branches').delete().eq('id', id)
  if (error) throw error
}

export async function createBranchStep(
  projectId: string,
  branchId: string,
  branchLabel: string,
  branchParentId: string,
  form: Record<string, any>
) {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get max branch_position for this branch
  const { data: existing } = await db
    .from('steps').select('branch_position')
    .eq('branch_id', branchId)
    .order('branch_position', { ascending: false }).limit(1)
  const branchPosition = existing?.length ? (existing[0].branch_position || 0) + 1 : 0

  const { data, error } = await db.from('steps').insert({
    project_id:       projectId,
    user_id:          user.id,
    position:         999,          // not used for branch steps
    branch_id:        branchId,
    branch_label:     branchLabel,
    branch_parent_id: branchParentId,
    branch_position:  branchPosition,
    is_main_flow:     false,
    name:             form.name || 'New Step',
    department:       form.department,
    operators:        form.operators ? Number(form.operators) : 1,
    uptime:           form.uptime     ? Number(form.uptime)     : null,
    defect_rate:      form.defect_rate ? Number(form.defect_rate) : null,
    completion_accuracy: form.completion_accuracy ? Number(form.completion_accuracy) : null,
    wait_time:        form.wait_time  ? Number(form.wait_time)  : 0,
    trans_time:       form.trans_time ? Number(form.trans_time) : 0,
    wip:              form.wip        ? Number(form.wip)        : 0,
    flow_type:        form.flow_type  || 'push',
    notes:            form.notes,
  }).select().single()

  if (error) throw error
  return { ...data, toolData: {} }
}

// ══════════════════════════════════════════════════════════════════════════════
//  KANBAN
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchKanbanBoard(projectId: string): Promise<KanbanColumn[]> {
  const db = createClient()
  const { data: cols, error: ce } = await db
    .from('kanban_columns')
    .select('*, kanban_cards(*)')
    .eq('project_id', projectId)
    .order('position')
  if (ce) throw ce

  return (cols || []).map((col: any) => ({
    ...col,
    cards: (col.kanban_cards || []).sort((a: any, b: any) => a.position - b.position),
    kanban_cards: undefined,
  })) as KanbanColumn[]
}

export async function createKanbanColumn(
  projectId: string,
  form: { title: string; color: string; wip_limit: number | null; step_id?: string }
): Promise<KanbanColumn> {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await db
    .from('kanban_columns').select('position')
    .eq('project_id', projectId)
    .order('position', { ascending: false }).limit(1)
  const position = existing?.length ? existing[0].position + 1 : 0

  const { data, error } = await db.from('kanban_columns').insert({
    project_id: projectId,
    user_id:    user.id,
    title:      form.title,
    color:      form.color,
    wip_limit:  form.wip_limit,
    step_id:    form.step_id || null,
    position,
  }).select().single()

  if (error) throw error
  return { ...data, cards: [] } as KanbanColumn
}

export async function updateKanbanColumn(id: string, updates: Partial<KanbanColumn>): Promise<void> {
  const db = createClient()
  const { cards, ...rest } = updates as any
  const { error } = await db.from('kanban_columns')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteKanbanColumn(id: string): Promise<void> {
  const db = createClient()
  // Cards cascade-deleted by FK
  const { error } = await db.from('kanban_columns').delete().eq('id', id)
  if (error) throw error
}

export async function createKanbanCard(
  projectId: string,
  columnId: string,
  form: Partial<KanbanCard>
): Promise<KanbanCard> {
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await db
    .from('kanban_cards').select('position')
    .eq('column_id', columnId)
    .order('position', { ascending: false }).limit(1)
  const position = existing?.length ? existing[0].position + 1 : 0

  const { data, error } = await db.from('kanban_cards').insert({
    project_id:     projectId,
    column_id:      columnId,
    user_id:        user.id,
    title:          form.title || 'New Card',
    description:    form.description,
    priority:       form.priority || 'normal',
    assignee:       form.assignee,
    due_date:       form.due_date,
    step_id:        form.step_id,
    tags:           form.tags || [],
    blocked_reason: form.blocked_reason,
    position,
  }).select().single()

  if (error) throw error
  return data as KanbanCard
}

export async function updateKanbanCard(id: string, updates: Partial<KanbanCard>): Promise<void> {
  const db = createClient()
  const { error } = await db.from('kanban_cards')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function moveKanbanCard(
  cardId: string,
  toColumnId: string,
  toPosition: number
): Promise<void> {
  const db = createClient()
  const { error } = await db.from('kanban_cards')
    .update({ column_id: toColumnId, position: toPosition, updated_at: new Date().toISOString() })
    .eq('id', cardId)
  if (error) throw error
}

export async function deleteKanbanCard(id: string): Promise<void> {
  const db = createClient()
  const { error } = await db.from('kanban_cards').delete().eq('id', id)
  if (error) throw error
}

export async function seedDefaultKanbanColumns(
  projectId: string,
  steps: Array<{ id: string; name: string }>
): Promise<KanbanColumn[]> {
  // Create one column per VSM step + Backlog + Done
  const db = createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const COLORS = ['#38385C','#1090D4','#D4A208','#6426A0','#1DD1A1','#F4A623','#E84393','#00BCD4']

  const cols = [
    { title: 'Backlog', color: '#38385C', wip_limit: null, step_id: null, position: 0 },
    ...steps.map((s, i) => ({
      title:     s.name,
      color:     COLORS[(i + 1) % COLORS.length],
      wip_limit: 5,
      step_id:   s.id,
      position:  i + 1,
    })),
    { title: 'Done', color: '#1DD1A1', wip_limit: null, step_id: null, position: steps.length + 1 },
  ]

  const { data, error } = await db.from('kanban_columns').insert(
    cols.map(c => ({ ...c, project_id: projectId, user_id: user.id }))
  ).select()

  if (error) throw error
  return (data || []).map(c => ({ ...c, cards: [] })) as KanbanColumn[]
}
