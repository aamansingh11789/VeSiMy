// TypeScript enabled, @ts-nocheck removed as part of quality pass
// ── lib/store-types.ts ──────────────────────────────────────────────────────
// Entity type definitions used throughout the app.
// These describe data shapes, they do NOT represent store state.
// Actual data lives in component useState, initialised from server props.

export interface Step {
  id: string
  project_id: string
  user_id?: string
  position: number
  name: string
  cycle_time?: number
  department?: string
  operators?: number
  uptime?: number
  defect_rate?: number
  completion_accuracy?: number
  wait_time?: number
  trans_time?: number
  wip?: number
  flow_type: 'push' | 'supermarket' | 'fifo' | 'queue'
  sm_min?: number
  sm_max?: number
  notes?: string
  va_type?: 'va' | 'nnva' | 'nva'
  op_steps?: Array<{ id: string; name: string; time: number; va_type: 'va' | 'nnva' | 'nva' }>
  is_bottleneck?: boolean
  health_status?: string
  setup_time?: number
  branch_id?:        string | null
  branch_label?:     string | null
  branch_parent_id?: string | null
  branch_position?:  number
  is_main_flow?:     boolean
  toolData?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Branch {
  id: string
  project_id: string
  branch_id: string
  label: string
  color: string
  parent_step_id: string | null
  merge_step_id:  string | null
  position: number
}

export type KanbanPriority = 'critical' | 'high' | 'normal' | 'low'
export type KanbanStatus   = 'backlog' | 'ready' | 'in-progress' | 'blocked' | 'done'

export interface KanbanCard {
  id:           string
  project_id:   string
  column_id:    string
  title:        string
  description?: string
  priority:     KanbanPriority
  assignee?:    string
  due_date?:    string
  step_id?:     string
  wip_count?:   number
  tags?:        string[]
  blocked_reason?: string
  position:     number
  created_at:   string
  updated_at:   string
}

export interface KanbanColumn {
  id:         string
  project_id: string
  title:      string
  color:      string
  wip_limit:  number | null
  position:   number
  step_id?:   string
  created_at: string
  updated_at: string
  cards?:     KanbanCard[]
}

export type ProjectTab = 'builder' | 'vsm' | 'kaizen' | 'kanban' | 'report' | 'branches' | 'simulation' | 'live' | 'roadmap' | 'pdca'

export interface Project {
  id:           string
  user_id:      string
  name:         string
  description?: string
  industry?:    string
  state:        'current' | 'future'
  status:       'active' | 'archived'
  version?:     string

  // VSM / process context
  product?:    string   // product family / part name
  customer?:   string
  supplier?:   string

  // Takt time inputs, all optional; used by calcProcessMetrics and PDFExport
  demand?:             number | string | null  // units per day
  working_hours?:      number | string | null  // hours per day
  shifts?:             number | string | null  // shifts per day
  available_time_sec?: number | string | null  // pre-computed seconds per day
  takt_time?:          number | string | null  // override (seconds); bypasses demand calc

  // Kaizen planning
  kaizen_roadmap?: Record<string, any>

  // Steps are joined server-side when needed
  steps?:       Step[]

  created_at:   string
  updated_at:   string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan_tier: 'trial' | 'trialing' | 'trial_expired' | 'pro' | 'lifetime' | 'enterprise'
  projects_count: number
  projects_limit: number
  onboarded?: boolean
  industry?: string
  role?: string
  company?: string
  is_beta?: boolean
  beta_tier?: string | null
  beta_expires_at?: string | null
  lifetime_access?: boolean
  subscription_status?: string
  subscription_period_end?: string | null
}
