// @ts-nocheck
// ── lib/store.ts ────────────────────────────────────────────────────────────
// Vesimy global state — Zustand store
//
// SCOPE: UI-only state that needs to cross component boundaries.
// - Theme preference
// - Sidebar open/closed
// - Toast notifications
// - Active tool modal (set by step cards, read by ProjectClient)
//
// NOT in this store: project data, steps, profile, toolData.
// Those live in React component state, initialised from server props,
// and never need to cross component boundaries outside their own tree.

import { create } from 'zustand'

// ── Types ───────────────────────────────────────────────────────────────────
export type Theme = 'dark' | 'light'
export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

// Re-export entity types that are used app-wide for convenience
// (actual data never flows through the store — these are just type references)
export type { Step, Branch, Project, Profile, KanbanCard, KanbanColumn, KanbanPriority, KanbanStatus, ProjectTab } from './store-types'

// ── Store ───────────────────────────────────────────────────────────────────
interface AppState {
  // UI
  theme: Theme
  sidebarOpen: boolean
  toasts: Toast[]

  // Active tool modal — set by step card clicks, read by ProjectClient
  // This is the one piece of state that needs to cross tree boundaries
  activeTool: { tool: string; stepId: string } | null

  // Actions
  setTheme: (t: Theme) => void
  toggleSidebar: () => void
  showToast: (message: string, type?: ToastType) => void
  dismissToast: (id: string) => void
  setActiveTool: (v: { tool: string; stepId: string } | null) => void
}

export const useStore = create<AppState>((set) => ({
  theme:       'dark',
  sidebarOpen: true,
  toasts:      [],
  activeTool:  null,

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

  setActiveTool: (v) => set({ activeTool: v }),
}))
