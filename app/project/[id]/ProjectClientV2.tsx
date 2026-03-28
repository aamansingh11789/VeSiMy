// @ts-nocheck
// ── app/project/[id]/ProjectClientV2.tsx ─────────────────────────────────────
// V2 project workspace: SOP upload → Interactive VSM map → Analyze → Journal
// Full layout with collapsible sidebar, expanded map canvas.
'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { VSMMapEngine } from '@/components/v2/VSMMapEngine'
import { StepPopupV2 } from '@/components/v2/StepPopupV2'
import { SOPUploader } from '@/components/v2/SOPUploader'
import { AnalysisReport } from '@/components/v2/AnalysisReport'
import { getIndustryLabel, getIndustryTerms } from '@/lib/industry-language'

const BRAND = '#0176D3'; const RED = '#C0402A'; const GREEN = '#2E844A'
const RULE = 'rgba(1,118,211,0.14)'; const PAPER = '#F8F6F0'
const serif = 'DM Serif Display, Georgia, serif'
const mono = 'IBM Plex Mono, monospace'

type V2Tab = 'map' | 'journal' | 'supe'

interface Props {
  initialProject: any
  profile: any
}

export function ProjectClientV2({ initialProject, profile }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const industryId = initialProject.industry || profile?.industry || ''
  const industryLabel = getIndustryLabel(industryId) || 'Your Process'
  const t = getIndustryTerms(industryId)

  const [project, setProject] = useState(initialProject)
  const [steps, setSteps] = useState<any[]>(initialProject.steps || [])
  const [tab, setTab] = useState<V2Tab>('map')
  const [editingStep, setEditingStep] = useState<any | null>(null)
  const [reports, setReports] = useState<any[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [activeReport, setActiveReport] = useState<any | null>(null)
  const [supeMessages, setSupeMessages] = useState<any[]>([])
  const [supeInput, setSupeInput] = useState('')
  const [supeSending, setSupeSending] = useState(false)
  const [showSOP, setShowSOP] = useState(steps.length === 0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // Load reports
  useEffect(() => {
    supabase.from('analysis_reports').select('*')
      .eq('project_id', project.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) { setReports(data); setActiveReport(data[0]) }
      })
  }, [project.id])

  // Auto-scroll supe chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [supeMessages])

  // ── SOP parsed → create steps ─────────────────────────────────
  async function onSOPParsed(parsed: any) {
    try {
      // Update project description if not set
      if (!project.description && parsed.process_description) {
        await supabase.from('projects').update({
          description: parsed.process_description,
        }).eq('id', project.id)
      }
      // Insert parsed steps
      const insertPayload = parsed.steps.map((s: any, i: number) => ({
        project_id: project.id,
        user_id: profile.id,
        position: i,
        name: s.name,
        step_type: s.step_type || 'process',
        tasks: s.tasks || [],
        governing_entity: s.governing_entity || '',
        department: s.department || '',
        notes: s.notes || '',
        cycle_time_unit: s.cycle_time_unit || 'minutes',
        cycle_time_type: s.cycle_time_type || 'assumed',
        missing_info_flags: s.missing_info_flags || ['cycle_time'],
        from_sop: true,
        sop_original_text: s.sop_original_text || '',
        operators: s.operators || 1,
        wip: s.wip || 0,
        defect_rate: s.defect_rate || 0,
        wait_time: s.wait_time || 0,
        flow_type: s.flow_type || 'push',
      }))
      const { data: newSteps } = await supabase.from('steps').insert(insertPayload).select()
      if (newSteps) setSteps(newSteps)
      setShowSOP(false)
      toast.success(`${parsed.steps.length} steps mapped from your SOP. Review each step on the map.`)
    } catch (e: any) {
      toast.error(e.message || 'Failed to create steps')
    }
  }

  // ── Add blank step ─────────────────────────────────────────────
  async function addStep(afterPosition: number) {
    const newPos = afterPosition + 1
    // Shift existing steps
    const toShift = steps.filter(s => s.position >= newPos)
    for (const s of toShift) {
      await supabase.from('steps').update({ position: s.position + 1 }).eq('id', s.id)
    }
    const { data: newStep } = await supabase.from('steps').insert({
      project_id: project.id, user_id: profile.id,
      position: newPos, name: 'New Step',
      step_type: 'process', tasks: [], governing_entity: '',
      cycle_time_unit: t.cycleTime?.includes('day') ? 'days' : 'minutes',
      cycle_time_type: 'assumed', missing_info_flags: ['cycle_time', 'operators', 'tasks'],
      operators: 1, wip: 0, defect_rate: 0, wait_time: 0, flow_type: 'push',
    }).select().single()
    if (newStep) {
      setSteps(prev => [...prev.filter(s => s.position < newPos),
        newStep, ...prev.filter(s => s.position >= newPos)])
      setEditingStep(newStep)
    }
  }

  // ── Save step ──────────────────────────────────────────────────
  async function saveStep(updated: any) {
    const { error } = await supabase.from('steps').update({
      name: updated.name, step_type: updated.step_type,
      tasks: updated.tasks || [], governing_entity: updated.governing_entity || '',
      department: updated.department || '', notes: updated.notes || '',
      cycle_time: updated.cycle_time ? Number(updated.cycle_time) : null,
      cycle_time_unit: updated.cycle_time_unit || 'minutes',
      cycle_time_type: updated.cycle_time_type || 'assumed',
      cycle_time_notes: updated.cycle_time_notes || '',
      operators: Number(updated.operators) || 1,
      wip: Number(updated.wip) || 0,
      defect_rate: Number(updated.defect_rate) || 0,
      wait_time: Number(updated.wait_time) || 0,
      uptime: Number(updated.uptime) || 100,
      flow_type: updated.flow_type || 'push',
      missing_info_flags: computeMissingFlags(updated),
      updated_at: new Date().toISOString(),
    }).eq('id', updated.id)
    if (!error) {
      setSteps(prev => prev.map(s => s.id === updated.id ? { ...s, ...updated, missing_info_flags: computeMissingFlags(updated) } : s))
      setEditingStep(null)
      toast.success('Step saved')
    } else {
      toast.error('Save failed')
    }
  }

  function computeMissingFlags(step: any): string[] {
    const flags: string[] = []
    if (!step.cycle_time) flags.push('cycle_time')
    if (!step.operators || step.operators < 1) flags.push('operators')
    if (!step.tasks?.length) flags.push('tasks')
    if (!step.department) flags.push('department')
    return flags
  }

  // ── Delete step ────────────────────────────────────────────────
  async function deleteStep(stepId: string) {
    await supabase.from('steps').delete().eq('id', stepId)
    setSteps(prev => prev.filter(s => s.id !== stepId))
    setEditingStep(null)
    toast.success('Step removed')
  }

  // ── Analyze ────────────────────────────────────────────────────
  async function runAnalysis() {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/v2/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      const newReport = { ...data.report, generated_at: new Date().toISOString() }
      setReports(prev => [newReport, ...prev])
      setActiveReport(newReport)
      setTab('journal')
      toast.success('Analysis complete — check the Journal')
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  // ── Supe chat ──────────────────────────────────────────────────
  async function sendSupeMessage() {
    if (!supeInput.trim()) return
    const userMsg = { role: 'user', content: supeInput, ts: Date.now() }
    setSupeMessages(prev => [...prev, userMsg])
    setSupeInput(''); setSupeSending(true)
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'supe_chat',
          data: {
            message: supeInput,
            history: supeMessages.slice(-8),
            project: { name: project.name, target: project.project_target,
              target_category: project.target_category, steps: steps.length },
            report_summary: activeReport
              ? `${activeReport.bottlenecks?.length || 0} bottlenecks, improvement potential ${activeReport.improvement_potential?.conservative}–${activeReport.improvement_potential?.optimistic}`
              : 'No analysis run yet',
          },
        }),
      })
      const d = await res.json()
      setSupeMessages(prev => [...prev, { role: 'assistant', content: d.result || "I need more information to help. Can you tell me more about the specific problem you're trying to solve?", ts: Date.now() }])
    } catch {
      setSupeMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.', ts: Date.now() }])
    } finally {
      setSupeSending(false)
    }
  }

  const missingCount = steps.reduce((a, s) => a + (s.missing_info_flags?.length || 0), 0)
  const hasAnalysis = reports.length > 0
  const bottleneckIds = (activeReport?.bottlenecks || []).map((b: any) => b.step_id)

  // ── RENDER ─────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh',
      overflow: 'hidden', background: PAPER }}>

      {/* ── Top bar ───────────────────────────────────────────── */}
      <div style={{ height: 52, borderBottom: `1px solid ${RULE}`, background: 'white',
        display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
        flexShrink: 0, zIndex: 10 }}>
        {/* Collapse sidebar toggle */}
        <button onClick={() => setSidebarCollapsed(v => !v)}
          style={{ width: 30, height: 30, border: `1px solid ${RULE}`, background: 'white',
            borderRadius: 6, cursor: 'pointer', fontSize: 14, color: '#6B6760' }}
          title="Toggle sidebar">
          {sidebarCollapsed ? '→' : '←'}
        </button>

        {/* Project name */}
        <div style={{ fontFamily: mono, fontSize: 11, color: '#6B6760', letterSpacing: .5 }}>
          {project.name}
        </div>
        <div style={{ width: 1, height: 20, background: RULE }}/>
        <div style={{ fontFamily: mono, fontSize: 9, color: BRAND, letterSpacing: 1.5,
          textTransform: 'uppercase', background: 'rgba(1,118,211,0.06)',
          border: `1px solid ${RULE}`, borderRadius: 4, padding: '2px 8px' }}>
          {industryLabel}
        </div>

        {/* Missing info badge */}
        {missingCount > 0 && (
          <div style={{ fontFamily: mono, fontSize: 10, color: '#F4A623',
            background: 'rgba(244,166,35,0.1)', border: '1px solid rgba(244,166,35,0.3)',
            borderRadius: 4, padding: '2px 8px' }}>
            ⚠ {missingCount} fields missing
          </div>
        )}

        <div style={{ flex: 1 }}/>

        {/* Tabs */}
        {(['map', 'journal', 'supe'] as V2Tab[]).map(tabId => {
          const labels: Record<V2Tab, string> = { map: 'Map', journal: 'Journal', supe: '⚡ Supe' }
          const active = tab === tabId
          return (
            <button key={tabId} onClick={() => setTab(tabId)}
              style={{ padding: '6px 14px', border: `1px solid ${active ? BRAND : RULE}`,
                borderRadius: 7, background: active ? 'rgba(1,118,211,0.08)' : 'white',
                color: active ? BRAND : '#6B6760', fontWeight: active ? 700 : 400,
                cursor: 'pointer', fontSize: 12, transition: 'all .15s',
                display: 'flex', alignItems: 'center', gap: 6 }}>
              {tabId === 'journal' && hasAnalysis && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }}/>
              )}
              {labels[tabId]}
            </button>
          )
        })}

        {/* Analyze button */}
        <button onClick={runAnalysis} disabled={analyzing || steps.length < 2}
          style={{ padding: '8px 18px', background: analyzing ? '#E8E5E0' :
            `linear-gradient(135deg, #0a5eaa, ${BRAND})`,
            color: analyzing ? '#8E8A82' : 'white', border: 'none',
            borderRadius: 8, cursor: analyzing || steps.length < 2 ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7,
            opacity: steps.length < 2 ? 0.6 : 1 }}>
          {analyzing ? (
            <><span style={{ width: 12, height: 12, border: '2px solid #8E8A82',
              borderTop: '2px solid transparent', borderRadius: '50%',
              animation: 'spin .8s linear infinite', display: 'inline-block' }}/> Analysing…</>
          ) : '⚡ Analyze'}
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── MAP TAB ─────────────────────────────────────────── */}
        {tab === 'map' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {showSOP ? (
              <SOPUploader
                projectId={project.id}
                onParsed={onSOPParsed}
                onManual={() => { setShowSOP(false); addStep(-1) }}
                onReference={() => { setShowSOP(false); router.push('/dashboard') }}
                industryLabel={industryLabel}
              />
            ) : (
              <>
                {/* Map toolbar */}
                <div style={{ padding: '8px 16px', borderBottom: `1px solid ${RULE}`,
                  background: 'white', display: 'flex', alignItems: 'center', gap: 10,
                  flexShrink: 0 }}>
                  <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2,
                    color: BRAND, textTransform: 'uppercase' }}>
                    CURRENT STATE · {steps.length} {t.processSteps}
                  </span>
                  <div style={{ flex: 1 }}/>
                  <button onClick={() => setShowSOP(true)}
                    style={{ padding: '5px 12px', border: `1px solid ${RULE}`, background: 'white',
                      borderRadius: 6, cursor: 'pointer', fontSize: 11, color: '#6B6760' }}>
                    ⬆ Re-upload SOP
                  </button>
                  <button onClick={() => addStep(steps.length > 0 ? steps[steps.length-1].position : -1)}
                    style={{ padding: '5px 14px', background: GREEN, color: 'white',
                      border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                    + Add step
                  </button>
                </div>

                {/* Map canvas — full width, scrollable */}
                <div style={{ flex: 1, overflow: 'auto', padding: '24px 0 24px 0' }}>
                  <VSMMapEngine
                    steps={steps}
                    taktTime={project.takt_time}
                    onStepClick={setEditingStep}
                    onAddStep={addStep}
                    onDeleteStep={deleteStep}
                    bottleneckIds={bottleneckIds}
                    analysisMode={hasAnalysis}
                  />
                </div>

                {/* Map footer legend */}
                <div style={{ padding: '6px 16px', borderTop: `1px solid ${RULE}`,
                  background: 'white', flexShrink: 0, display: 'flex', gap: 12,
                  fontSize: 11, color: '#8E8A82', flexWrap: 'wrap' }}>
                  <span>💡 Click any step to edit · Hover a step to add/delete · + button to append</span>
                  {missingCount > 0 && (
                    <span style={{ color: '#F4A623', marginLeft: 'auto' }}>
                      ⚠ Steps with amber badges have missing data — click to complete
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── JOURNAL TAB ─────────────────────────────────────── */}
        {tab === 'journal' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Report list */}
            {reports.length > 1 && (
              <div style={{ width: 200, borderRight: `1px solid ${RULE}`, overflowY: 'auto',
                flexShrink: 0, background: 'white', padding: '12px 8px' }}>
                <div style={{ fontFamily: mono, fontSize: 8, letterSpacing: 2,
                  color: '#8E8A82', padding: '0 8px', marginBottom: 8 }}>REPORTS</div>
                {reports.map(r => (
                  <button key={r.id} onClick={() => setActiveReport(r)}
                    style={{ width: '100%', padding: '9px 10px', background: activeReport?.id === r.id
                      ? 'rgba(1,118,211,0.08)' : 'transparent', border: activeReport?.id === r.id
                      ? `1px solid ${RULE}` : '1px solid transparent',
                      borderRadius: 7, cursor: 'pointer', textAlign: 'left', marginBottom: 4 }}>
                    <div style={{ fontFamily: mono, fontSize: 9, color: BRAND }}>
                      v{r.version} · {r.report_type?.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B6760', marginTop: 2 }}>
                      {new Date(r.generated_at || r.created_at).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {/* Active report */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeReport ? (
                <AnalysisReport report={activeReport}
                  onOpenCITool={(stepId, tool) => {
                    const step = steps.find(s => s.id === stepId)
                    if (step) { setEditingStep(step); setTab('map') }
                  }}/>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', height: '100%', gap: 16, color: '#8E8A82' }}>
                  <div style={{ fontSize: 40 }}>📋</div>
                  <div style={{ fontFamily: serif, fontSize: 22 }}>No analysis yet</div>
                  <p style={{ fontSize: 14, textAlign: 'center', maxWidth: 340, lineHeight: 1.7 }}>
                    Complete your process map, then click <strong>⚡ Analyze</strong> to generate the Current State report.
                  </p>
                  <button onClick={runAnalysis} disabled={steps.length < 2}
                    style={{ padding: '10px 24px', background: BRAND, color: 'white',
                      border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                    Run Analysis →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUPE TAB ─────────────────────────────────────────── */}
        {tab === 'supe' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#032D60' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: 2,
                color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>SUPE AI · PRO FEATURE</div>
              <h2 style={{ fontFamily: serif, fontSize: 20, color: 'white', fontWeight: 400, margin: 0 }}>
                Brainstorm with Supe
              </h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4, lineHeight: 1.6 }}>
                Tell Supe what's happening, what your target is, and when you need to hit it. Supe will ask the right questions and help you build a data-backed future state plan.
              </p>
            </div>

            {/* Chat */}
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px',
              display: 'flex', flexDirection: 'column', gap: 12 }}>
              {supeMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 11, fontFamily: mono, letterSpacing: 1.5,
                    color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>START THE CONVERSATION</div>
                  {[
                    `My ${t.defect}s are too high — I need to hit 1% but we're at ${steps[0] ? (steps[0].defect_rate || '?') : '?'}%. What's the fastest path?`,
                    `Walk me through how to turn this current state map into an improvement plan.`,
                    `My target is to reduce ${t.leadTime?.toLowerCase() || 'lead time'} by 40% in 3 months. Where do I start?`,
                  ].map(s => (
                    <button key={s} onClick={() => setSupeInput(s)}
                      style={{ display: 'block', width: '100%', margin: '0 auto 8px',
                        maxWidth: 480, padding: '10px 16px', background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                        color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13,
                        textAlign: 'left', lineHeight: 1.5 }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {supeMessages.map((msg, i) => (
                <div key={i} style={{ maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ padding: '12px 16px', borderRadius: 10,
                    background: msg.role === 'user'
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(1,118,211,0.18)',
                    border: msg.role === 'user'
                      ? '1px solid rgba(255,255,255,0.1)'
                      : '1px solid rgba(1,118,211,0.3)',
                    color: msg.role === 'user' ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.88)',
                    fontSize: 14, lineHeight: 1.7,
                    borderRadius: msg.role === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px' }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {supeSending && (
                <div style={{ display: 'flex', gap: 5, alignItems: 'center',
                  padding: '8px 0', alignSelf: 'flex-start' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%',
                      background: BRAND, opacity: 0.6,
                      animation: `think .8s ease ${i*0.2}s infinite` }}/>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', gap: 10 }}>
              <textarea value={supeInput} onChange={e => setSupeInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendSupeMessage() } }}
                placeholder={`Describe what's happening in your ${t.process || 'process'} and what you want to achieve…`}
                rows={2}
                style={{ flex: 1, background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px',
                  color: 'rgba(255,255,255,0.85)', fontSize: 13, resize: 'none',
                  fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}/>
              <button onClick={sendSupeMessage} disabled={!supeInput.trim() || supeSending}
                style={{ padding: '10px 18px', background: BRAND, color: 'white', border: 'none',
                  borderRadius: 8, cursor: supeInput.trim() ? 'pointer' : 'not-allowed',
                  fontSize: 13, fontWeight: 700, flexShrink: 0, opacity: supeInput.trim() ? 1 : 0.5 }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Step edit panel ─────────────────────────────────────── */}
      {editingStep && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 199 }}
            onClick={() => setEditingStep(null)}/>
          <StepPopupV2
            step={editingStep}
            industry={industryId}
            onSave={saveStep}
            onClose={() => setEditingStep(null)}
            onDelete={() => deleteStep(editingStep.id)}
            onOpenCITool={(stepId, toolId) => {
              setEditingStep(null)
              toast.success(`Opening ${toolId.replace(/_/g,' ')} — switch to the full project view for CI tools`)
            }}
            sopDiff={editingStep.from_sop}
          />
        </>
      )}

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes think{0%,100%{opacity:0.25}50%{opacity:1}}
      `}</style>
    </div>
  )
}
