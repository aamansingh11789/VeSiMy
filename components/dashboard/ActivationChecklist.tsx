'use client'
// ── components/dashboard/ActivationChecklist.tsx ─────────────────────────────
// Surfaces a short "do these things to get value from VeSiMy" checklist on
// the dashboard. Auto-detects completion from real project + step data.

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

interface Project {
  id: string
  name: string
  steps?: Array<{
    id: string
    cycle_time?: number | null
    toolData?: Record<string, any> | null
  }>
}

interface Props { projects: Project[] }

export function ActivationChecklist({ projects }: Props) {
  const [dismissed, setDismissed] = useState(false)

  const status = useMemo(() => {
    const hasProject = projects.length > 0
    const firstProject = projects[0]
    const steps = firstProject?.steps || []
    const hasCycleTimes = steps.filter(s => Number(s.cycle_time) > 0).length >= 3
    const hasToolData = steps.some(s => s.toolData && Object.keys(s.toolData).length > 0)
    const hasSupeReport = steps.some(s => s.toolData?.supe || s.toolData?.ai_report)
    return { hasProject, hasCycleTimes, hasToolData, hasSupeReport, firstProjectId: firstProject?.id }
  }, [projects])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDismissed(sessionStorage.getItem('vesimy_checklist_dismissed') === '1')
    }
  }, [])

  const items = [
    { key: 'project', label: 'Create your first project', done: status.hasProject,
      href: status.hasProject ? `/project/${status.firstProjectId}` : '/dashboard' },
    { key: 'steps', label: 'Map 3+ process steps with cycle times', done: status.hasCycleTimes,
      href: status.firstProjectId ? `/project/${status.firstProjectId}` : '/dashboard' },
    { key: 'tool', label: 'Run one CI tool (try Time Study or 5 Why)', done: status.hasToolData,
      href: status.firstProjectId ? `/project/${status.firstProjectId}` : '/dashboard' },
    { key: 'supe', label: 'Get your first Supe AI insight', done: status.hasSupeReport,
      href: status.firstProjectId ? `/project/${status.firstProjectId}?tab=supe` : '/dashboard' },
  ]

  const completed = items.filter(i => i.done).length
  const total = items.length
  const allDone = completed === total
  if (dismissed || allDone) return null

  function dismiss() {
    if (typeof window !== 'undefined') sessionStorage.setItem('vesimy_checklist_dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="card" style={{
      padding: '20px 22px', marginBottom: 20,
      background: 'linear-gradient(135deg, rgba(201,166,107,0.04) 0%, rgba(212,168,67,0.01) 100%)',
      border: '1px solid rgba(201,166,107,0.20)', position: 'relative',
    }}>
      <button onClick={dismiss} aria-label="Hide checklist" style={{
        position: 'absolute', top: 14, right: 14, background: 'transparent',
        border: 'none', cursor: 'pointer', color: 'var(--text3)',
        fontSize: 18, lineHeight: 1, padding: 4,
      }}>×</button>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--vs-gold-600)',
          letterSpacing: 1.5, textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
          Get Started Checklist
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)',
            margin: 0, fontFamily: "'Sora','Inter',sans-serif" }}>
            {completed === 0 ? 'Get the most out of VeSiMy in 4 steps'
              : `${completed} of ${total} steps complete`}
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text3)',
            fontFamily: 'var(--font-mono)' }}>
            {Math.round((completed / total) * 100)}%
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 2,
          background: 'rgba(201,166,107,0.10)', overflow: 'hidden', marginTop: 8 }}>
          <div style={{ height: '100%', width: `${(completed / total) * 100}%`,
            background: 'linear-gradient(90deg, var(--vs-gold-600), var(--vs-gold-500))',
            transition: 'width 0.3s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => (
          <Link key={item.key} href={item.href} className="checklist-item" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 7,
            textDecoration: 'none', transition: 'background 0.15s', background: 'transparent',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
              background: item.done ? 'var(--vs-gold-600)' : 'transparent',
              border: item.done ? '1.5px solid var(--vs-gold-600)' : '1.5px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.done && <CheckIcon size={11} color="#0B1D33" />}
            </div>
            <span style={{
              flex: 1, fontSize: 13,
              color: item.done ? 'var(--text3)' : 'var(--text)',
              textDecoration: item.done ? 'line-through' : 'none',
              fontFamily: 'var(--font-sans)',
            }}>{item.label}</span>
            {!item.done && <ArrowRightIcon size={14} color="var(--text3)" />}
          </Link>
        ))}
      </div>

      <style>{`.checklist-item:hover { background: rgba(201,166,107,0.06) !important; }`}</style>
    </div>
  )
}
