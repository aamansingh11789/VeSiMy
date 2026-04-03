// @ts-nocheck
// ── lib/store.ts ────────────────────────────────────────────────────────────
// Vesimy global state — Zustand store
// Replaces the useState/useLocalStorage pattern from v1 demo

import { create } from 'zustand'

// ── Types ───────────────────────────────────────────────────────────────────
export type Theme = 'dark' | 'light'
export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

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
  // Branching
  branch_id?:        string | null
  branch_label?:     string | null
  branch_parent_id?: string | null
  branch_position?:  number
  is_main_flow?:     boolean
  toolData: Record<string, any>
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

// ── Kanban types ─────────────────────────────────────────────────────────────
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
  step_id?:     string   // optional link to a VSM step
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
  wip_limit:  number | null   // null = no limit
  position:   number
  step_id?:   string          // optional link to VSM step
  created_at: string
  updated_at: string
  cards?:     KanbanCard[]
}

export type ProjectTab = 'builder' | 'vsm' | 'kaizen' | 'kanban' | 'report' | 'branches' | 'simulation' | 'live' | 'roadmap' | 'pdca'

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  industry?: string
  state: 'current' | 'future'
  status: 'active' | 'archived'
  customer?: string
  kaizen_roadmap?: Record<string, any>
  steps?: Step[]
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan_tier: 'trial' | 'trialing' | 'trial_expired' | 'pro' | 'lifetime' | 'enterprise'
  projects_count: number
  projects_limit: number
  // Extended fields (added by migrations 004-008)
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

// ── Store ───────────────────────────────────────────────────────────────────
interface AppState {
  // UI
  theme: Theme
  sidebarOpen: boolean
  toasts: Toast[]

  // Project
  currentProject: Project | null
  steps: Step[]
  projectLoading: boolean

  // Active modal state
  activeTool: { tool: string; stepId: string } | null
  showStepModal: boolean
  editingStep: Step | null

  // Profile
  profile: Profile | null

  // Actions
  setTheme: (t: Theme) => void
  toggleSidebar: () => void
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: string) => void

  setCurrentProject: (p: Project | null) => void
  setSteps: (steps: Step[]) => void
  setProjectLoading: (v: boolean) => void

  addStep: (step: Step) => void
  updateStep: (id: string, updates: Partial<Step>) => void
  removeStep: (id: string) => void
  setStepToolData: (stepId: string, tool: string, data: any) => void
  reorderSteps: (steps: Step[]) => void

  setActiveTool: (v: { tool: string; stepId: string } | null) => void
  setShowStepModal: (v: boolean) => void
  setEditingStep: (s: Step | null) => void

  setProfile: (p: Profile | null) => void
}

export const useStore = create<AppState>((set) => ({
  // ── Initial State ──────────────────────────────────────────────────────────
  theme:          'dark',
  sidebarOpen:    true,
  toasts:         [],
  currentProject: null,
  steps:          [],
  projectLoading: false,
  activeTool:     null,
  showStepModal:  false,
  editingStep:    null,
  profile:        null,

  // ── UI ─────────────────────────────────────────────────────────────────────
  setTheme: (theme) => {
    set({ theme })
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('oc_theme', theme)
    }
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  showToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2, 9)
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500)
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  // ── Project ────────────────────────────────────────────────────────────────
  setCurrentProject: (p) => set({ currentProject: p }),
  setSteps:          (steps) => set({ steps }),
  setProjectLoading: (v) => set({ projectLoading: v }),

  addStep: (step) =>
    set((s) => ({ steps: [...s.steps, { ...step, toolData: {} }] })),

  updateStep: (id, updates) =>
    set((s) => ({ steps: s.steps.map((st) => st.id === id ? { ...st, ...updates } : st) })),

  removeStep: (id) =>
    set((s) => ({ steps: s.steps.filter((st) => st.id !== id) })),

  setStepToolData: (stepId, tool, data) =>
    set((s) => ({
      steps: s.steps.map((st) =>
        st.id === stepId
          ? { ...st, toolData: { ...(st.toolData || {}), [tool]: data } }
          : st
      ),
    })),

  reorderSteps: (steps) => set({ steps }),

  // ── Modal ──────────────────────────────────────────────────────────────────
  setActiveTool:    (v) => set({ activeTool: v }),
  setShowStepModal: (v) => set({ showStepModal: v }),
  setEditingStep:   (s) => set({ editingStep: s }),

  // ── Profile ────────────────────────────────────────────────────────────────
  setProfile: (p) => set({ profile: p }),
}))
