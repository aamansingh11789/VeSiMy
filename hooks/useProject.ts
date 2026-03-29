// @ts-nocheck
'use client'
// ── hooks/useProject.ts ────────────────────────────────────────────────────
// Central hook for cloud-synced project state
// Replaces localStorage-based useLocalStorage from v1 demo


import { useState, useCallback, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Project } from '@/lib/store'

interface UseProjectReturn {
  project:     Project | null
  saving:      boolean
  lastSaved:   Date | null
  updateProject: (updates: Partial<Project>) => void
  saveNow:     () => Promise<void>
}

export function useProject(projectId: string, initial: Project): UseProjectReturn {
  const [project,   setProject]  = useState<Project>(initial)
  const [saving,    setSaving]   = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const pendingRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRef   = useRef(project)

  useEffect(() => { latestRef.current = project }, [project])

  const saveNow = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(latestRef.current),
      })
      if (!res.ok) throw new Error('Save failed')
      setLastSaved(new Date())
    } catch {
      toast.error('Failed to save — check your connection')
    } finally {
      setSaving(false)
    }
  }, [projectId])

  const updateProject = useCallback((updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }))
    // Debounced auto-save: 1.5s after last change
    if (pendingRef.current) clearTimeout(pendingRef.current)
    pendingRef.current = setTimeout(saveNow, 1500)
  }, [saveNow])

  // Save on unmount if pending
  useEffect(() => () => { if (pendingRef.current) { clearTimeout(pendingRef.current); saveNow() } }, [saveNow])

  return { project, saving, lastSaved, updateProject, saveNow }
}
