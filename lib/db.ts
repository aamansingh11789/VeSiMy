// @ts-nocheck
// ── lib/db.ts ────────────────────────────────────────────────────────────────
// Vesimy database access layer
// All Supabase queries go through here — keeps components clean

import { createClient } from '@/lib/supabase'
import type { Project, Step, KanbanCard, KanbanColumn } from './store'

// ── Fresh client per call (no singleton — avoids session bleed) ──────────────
function getClient() {
  return createClient()
}

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

const NUMERIC_STEP_FIELDS = new Set([
  'position',
  'operators',
  'cycle_time',
  'setup_time',
  'wait_time',
  'trans_time',
  'wip',
  'uptime',
  'defect_rate',
  'completion_accuracy',
  'sm_min',
  'sm_max',
  'branch_position',
])

function toNullableNumber(value: any) {
  if (value === '' || value === null || value === undefined) return null
  const num = Number(value)
  return Number.isNaN(num) ? null : num
}

function toNumberOrDefault(value: any, fallback: number) {
  if (value === '' || value === null || value === undefined) return fallback
  const num = Number(value)
  return Number.isNaN(num) ? fallback : num
}

function cleanStepUpdatePayload(updates: Record<string, any>) {
  const cleaned: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  for (const [key, value] of Object.entries(updates || {})) {
    if (key === 'toolData') continue

    if (NUMERIC_STEP_FIELDS.has(key)) {
      cleaned[key] = toNullableNumber(value)
    } else {
      cleaned[key] = value
    }
  }

  return cleaned
}

async function getCurrentUser(db: any) {
  const {
    data: { user },
    error,
  } = await db.auth.getUser()

  if (error) throw error
  if (!user) throw new Error('Not authenticated')
  return user
}

// ══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchProjects(): Promise<Project[]> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data || []) as Project[]
}

export async function fetchProject(id: string): Promise<Project> {
  const db = getClient()
  const user = await getCurrentUser(db)

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
    .eq('user_id', user.id)
    .single()

  if (error) throw error

  const project = data as any
  project.steps = (project.steps || [])
    .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
    .map((step: any) => ({
      ...step,
      toolData: Object.fromEntries(
        (step.tool_data || []).map((td: any) => [td.tool, td.data])
      ),
      tool_data: undefined,
    }))

  return project as Project
}

export async function createProject(form: Partial<Project>): Promise<Project> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data, error } = await db
    .from('projects')
    .insert({
      user_id: user.id,
      name: form.name || 'New Project',
      description: form.description || null,
      industry: form.industry || null,
      customer: form.customer || null,
      state: form.state || 'current',
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function archiveProject(id: string): Promise<void> {
  await updateProject(id, { status: 'archived' } as any)
}

export async function deleteProject(id: string): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

// ══════════════════════════════════════════════════════════════════════════════
// STEPS
// ══════════════════════════════════════════════════════════════════════════════

export async function createStep(projectId: string, form: Partial<Step>): Promise<Step> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data: projectRow, error: projectErr } = await db
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (projectErr || !projectRow) throw new Error('Project not found')

  const { data: existing, error: posErr } = await db
    .from('steps')
    .select('position')
    .eq('project_id', projectId)
    .order('position', { ascending: false })
    .limit(1)

  if (posErr) throw posErr

  const position = existing?.length ? (existing[0].position ?? 0) + 1 : 0

  const insertData: Record<string, any> = {
    project_id: projectId,
    user_id: user.id,
    position,
    name: form.name || 'New Step',
    department: form.department || null,
    operators: toNumberOrDefault(form.operators, 1),
    cycle_time: toNullableNumber(form.cycle_time),
    setup_time: toNumberOrDefault((form as any).setup_time, 0),
    wait_time: toNumberOrDefault(form.wait_time, 0),
    trans_time: toNumberOrDefault(form.trans_time, 0),
    wip: toNumberOrDefault(form.wip, 0),
    uptime: toNullableNumber(form.uptime),
    defect_rate: toNullableNumber(form.defect_rate),
    completion_accuracy: toNullableNumber(form.completion_accuracy),
    flow_type: form.flow_type || 'push',
    sm_min: toNullableNumber(form.sm_min),
    sm_max: toNullableNumber(form.sm_max),
    notes: form.notes || null,
    is_main_flow:
      (form as any).is_main_flow !== undefined ? (form as any).is_main_flow : true,
  }

  if ((form as any).branch_id) {
    insertData.branch_id = (form as any).branch_id
  }

  if ((form as any).branch_position !== undefined) {
    insertData.branch_position = toNullableNumber((form as any).branch_position)
  }

  const { data, error } = await db
    .from('steps')
    .insert(insertData)
    .select()
    .single()

  if (error) throw error
  return { ...data, toolData: {} } as Step
}

export async function updateStep(stepId: string, updates: Partial<Step>): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)
  const payload = cleanStepUpdatePayload(updates as any)

  const { error } = await db
    .from('steps')
    .update(payload)
    .eq('id', stepId)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function deleteStep(stepId: string): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('steps')
    .delete()
    .eq('id', stepId)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function reorderSteps(projectId: string, orderedIds: string[]): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  // Sequential updates preserve ordering integrity.
  // Parallel Promise.all() would race and produce inconsistent positions
  // under slow network or DB load.
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await db
      .from('steps')
      .update({ position: i, updated_at: new Date().toISOString() })
      .eq('id', orderedIds[i])
      .eq('project_id', projectId)
      .eq('user_id', user.id)
    if (error) throw error
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// TOOL DATA
// ══════════════════════════════════════════════════════════════════════════════

export async function saveToolData(
  stepId: string,
  toolType: string,
  data: Record<string, any>
): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data: stepRow, error: stepErr } = await db
    .from('steps')
    .select('id, project_id, user_id')
    .eq('id', stepId)
    .eq('user_id', user.id)
    .single()

  if (stepErr || !stepRow) throw new Error('Step not found')

  const { data: existing, error: existingErr } = await db
    .from('tool_data')
    .select('id')
    .eq('step_id', stepId)
    .eq('tool', toolType)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingErr) throw existingErr

  if (existing?.id) {
    const { error } = await db
      .from('tool_data')
      .update({
        data,
        updated_at: new Date().toISOString(),
        saved_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .eq('user_id', user.id)

    if (error) throw error
    return
  }

  const { error } = await db
    .from('tool_data')
    .insert({
      step_id: stepId,
      project_id: stepRow.project_id,
      user_id: user.id,
      tool: toolType,
      data,
      saved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

  if (error) throw error
}

export async function getToolData(
  stepId: string,
  toolType: string
): Promise<Record<string, any> | null> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data, error } = await db
    .from('tool_data')
    .select('data')
    .eq('step_id', stepId)
    .eq('tool', toolType)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error
  return data?.data ?? null
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchProfile() {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(updates: Record<string, any>) {
  const db = getClient()
  const user = await getCurrentUser(db)

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
// BRANCHES
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchBranches(projectId: string) {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data, error } = await db
    .from('branches')
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .order('position')

  if (error) throw error
  return data || []
}

export async function createBranch(projectId: string, form: {
  label: string
  color: string
  parent_step_id: string | null
  merge_step_id: string | null
}) {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data: projectRow, error: projectErr } = await db
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (projectErr || !projectRow) throw new Error('Project not found')

  const branchId = `branch-${Date.now()}`

  const { data: existing, error: posErr } = await db
    .from('branches')
    .select('position')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .order('position', { ascending: false })
    .limit(1)

  if (posErr) throw posErr

  const position = existing?.length ? (existing[0].position ?? 0) + 1 : 0

  const { data, error } = await db
    .from('branches')
    .insert({
      project_id: projectId,
      user_id: user.id,
      branch_id: branchId,
      label: form.label,
      color: form.color,
      parent_step_id: form.parent_step_id,
      merge_step_id: form.merge_step_id,
      position,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBranch(id: string, updates: Record<string, any>) {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('branches')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function deleteBranch(id: string, branchId: string) {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error: stepDeleteErr } = await db
    .from('steps')
    .delete()
    .eq('branch_id', branchId)
    .eq('user_id', user.id)

  if (stepDeleteErr) throw stepDeleteErr

  const { error } = await db
    .from('branches')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function createBranchStep(
  projectId: string,
  branchId: string,
  branchLabel: string,
  branchParentId: string,
  form: Record<string, any>
) {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data: existing, error: posErr } = await db
    .from('steps')
    .select('branch_position')
    .eq('branch_id', branchId)
    .eq('user_id', user.id)
    .order('branch_position', { ascending: false })
    .limit(1)

  if (posErr) throw posErr

  const branchPosition = existing?.length ? ((existing[0].branch_position || 0) + 1) : 0

  const { data, error } = await db
    .from('steps')
    .insert({
      project_id: projectId,
      user_id: user.id,
      position: 999,
      branch_id: branchId,
      branch_label: branchLabel,
      branch_parent_id: branchParentId,
      branch_position: branchPosition,
      is_main_flow: false,
      name: form.name || 'New Step',
      department: form.department || null,
      operators: toNumberOrDefault(form.operators, 1),
      uptime: toNullableNumber(form.uptime),
      defect_rate: toNullableNumber(form.defect_rate),
      completion_accuracy: toNullableNumber(form.completion_accuracy),
      cycle_time: toNullableNumber(form.cycle_time),
      setup_time: toNumberOrDefault(form.setup_time, 0),
      wait_time: toNumberOrDefault(form.wait_time, 0),
      trans_time: toNumberOrDefault(form.trans_time, 0),
      wip: toNumberOrDefault(form.wip, 0),
      flow_type: form.flow_type || 'push',
      notes: form.notes || null,
    })
    .select()
    .single()

  if (error) throw error
  return { ...data, toolData: {} }
}

// ══════════════════════════════════════════════════════════════════════════════
// KANBAN
// ══════════════════════════════════════════════════════════════════════════════

export async function fetchKanbanBoard(projectId: string): Promise<KanbanColumn[]> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data: cols, error } = await db
    .from('kanban_columns')
    .select('*, kanban_cards(*)')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .order('position')

  if (error) throw error

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
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data: existing, error: posErr } = await db
    .from('kanban_columns')
    .select('position')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .order('position', { ascending: false })
    .limit(1)

  if (posErr) throw posErr

  const position = existing?.length ? (existing[0].position ?? 0) + 1 : 0

  const { data, error } = await db
    .from('kanban_columns')
    .insert({
      project_id: projectId,
      user_id: user.id,
      title: form.title,
      color: form.color,
      wip_limit: form.wip_limit,
      step_id: form.step_id || null,
      position,
    })
    .select()
    .single()

  if (error) throw error
  return { ...data, cards: [] } as KanbanColumn
}

export async function updateKanbanColumn(id: string, updates: Partial<KanbanColumn>): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)
  const { cards, ...rest } = updates as any

  const { error } = await db
    .from('kanban_columns')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function deleteKanbanColumn(id: string): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('kanban_columns')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function createKanbanCard(
  projectId: string,
  columnId: string,
  form: Partial<KanbanCard>
): Promise<KanbanCard> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data: existing, error: posErr } = await db
    .from('kanban_cards')
    .select('position')
    .eq('column_id', columnId)
    .eq('user_id', user.id)
    .order('position', { ascending: false })
    .limit(1)

  if (posErr) throw posErr

  const position = existing?.length ? (existing[0].position ?? 0) + 1 : 0

  const { data, error } = await db
    .from('kanban_cards')
    .insert({
      project_id: projectId,
      column_id: columnId,
      user_id: user.id,
      title: form.title || 'New Card',
      description: form.description || null,
      priority: form.priority || 'normal',
      assignee: form.assignee || null,
      due_date: form.due_date || null,
      step_id: form.step_id || null,
      tags: form.tags || [],
      blocked_reason: form.blocked_reason || null,
      position,
    })
    .select()
    .single()

  if (error) throw error
  return data as KanbanCard
}

export async function updateKanbanCard(id: string, updates: Partial<KanbanCard>): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('kanban_cards')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function moveKanbanCard(
  cardId: string,
  toColumnId: string,
  toPosition: number
): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('kanban_cards')
    .update({
      column_id: toColumnId,
      position: toPosition,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function deleteKanbanCard(id: string): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('kanban_cards')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function seedDefaultKanbanColumns(
  projectId: string,
  steps: Array<{ id: string; name: string }>
): Promise<KanbanColumn[]> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const COLORS = ['#4E4B45', '#1090D4', '#C49B2E', '#6426A0', '#2A9E82', '#F4A623', '#C0402A', '#3070B8']

  const cols = [
    { title: 'Backlog', color: '#38385C', wip_limit: null, step_id: null, position: 0 },
    ...steps.map((s, i) => ({
      title: s.name,
      color: COLORS[(i + 1) % COLORS.length],
      wip_limit: 5,
      step_id: s.id,
      position: i + 1,
    })),
    { title: 'Done', color: '#1DD1A1', wip_limit: null, step_id: null, position: steps.length + 1 },
  ]

  const { data, error } = await db
    .from('kanban_columns')
    .insert(cols.map(c => ({ ...c, project_id: projectId, user_id: user.id })))
    .select()

  if (error) throw error
  return (data || []).map((c: any) => ({ ...c, cards: [] })) as KanbanColumn[]
}
// ══════════════════════════════════════════════════════════════════════════════
// V2 STEPS — used by V2ProjectClient. All writes go through here to enforce
// user_id ownership at the data layer, not the component layer.
// ══════════════════════════════════════════════════════════════════════════════

export async function upsertV2Step(step: Record<string, any>): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  // Strip client-only fields that don't exist in the DB schema
  const { toolData, ...data } = step

  const { error } = await db
    .from('steps')
    .upsert({ ...data, user_id: user.id, version: 'v2' })
    .eq('user_id', user.id)  // RLS double-enforcement

  if (error) throw error
}

export async function deleteV2Step(stepId: string): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('steps')
    .delete()
    .eq('id', stepId)
    .eq('user_id', user.id)  // user must own the step

  if (error) throw error
}

export async function createV2Step(form: Record<string, any>): Promise<Record<string, any>> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { data, error } = await db
    .from('steps')
    .insert({ ...form, user_id: user.id, version: 'v2' })
    .select('*')
    .single()

  if (error) throw error
  return { ...data, tasks: data.tasks || [], missing_info_flags: data.missing_info_flags || [], toolData: {} }
}

export async function updateV2Project(projectId: string, updates: Record<string, any>): Promise<void> {
  const db = getClient()
  const user = await getCurrentUser(db)

  const { error } = await db
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) throw error
}
