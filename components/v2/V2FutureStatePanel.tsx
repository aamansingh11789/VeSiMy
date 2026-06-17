// TypeScript enabled
'use client'
import { AlertIcon, SearchIcon, ClockIcon, ZapIcon } from '@/components/ui/Icons'
import { SERIF, BRAND, GREEN, AMBER, RED, NAVY } from './v2-constants'
// ── components/v2/V2FutureStatePanel.tsx ──────────────────────────────────────
// Future State generator.
// Step 1: Set target (what, category, value, deadline)
// Step 2: Supe brainstorming session (paid) or self-directed analysis
// Step 3: Generate future state VSM + report + action plan

import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'


const TARGET_CATEGORIES = [
  { id: 'output_quantity', label: 'Increase output quantity', example: 'e.g. from 80 to 120 units/day' },
  { id: 'output_quality',  label: 'Improve output quality',  example: 'e.g. defect rate from 8% to 1%' },
  { id: 'cost',            label: 'Reduce cost',             example: 'e.g. reduce process cost by 20%' },
  { id: 'time',            label: 'Reduce time / lead time', example: 'e.g. from 4.2 hours to 1.5 hours' },
  { id: 'revenue',         label: 'Increase revenue',        example: 'e.g. increase throughput by 30%' },
  { id: 'compliance',      label: 'Achieve compliance',      example: 'e.g. meet ISO 9001 audit standard' },
  { id: 'custom',          label: 'Custom target',           example: 'Define your own' },
]

interface ChatMsg { role: 'user' | 'supe'; text: string; timestamp: string }

interface Props {
  project: any; profile: any; t: any; indLabel: string
  currentReport: any; steps: any[]; isPaid: boolean
  onReportGenerated: (r: any) => void
}

export function V2FutureStatePanel({ project, profile, t, indLabel, currentReport, steps, isPaid, onReportGenerated }: Props) {
  // Stage: 'target' → 'brainstorm' → 'generating' → 'done'
  const [stage, setStage] = useState<'target' | 'brainstorm' | 'generating' | 'done'>('target')

  // Target form
  const [targetCategory, setTargetCategory] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [targetUnit, setTargetUnit] = useState('')
  const [targetDeadline, setTargetDeadline] = useState('')
  const [targetStatement, setTargetStatement] = useState('')
  const [selfMode, setSelfMode] = useState(false)  // true = self-directed, false = Supe

  // Supe chat
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Future state report
  const [futureReport, setFutureReport] = useState<any>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Start brainstorming, Supe opens with context ────────────────────────
  const startBrainstorm = async () => {
    if (!targetStatement.trim() || !targetCategory) {
      toast.error('Set your target statement and category first')
      return
    }
    setStage('brainstorm')

    if (!selfMode) {
      // Supe opens the conversation with context
      const openingCtx = `You are Supe, a lean VSM expert. The user is working on improving their ${indLabel} process: "${project.name}".

Current state:
- Steps: ${steps.length}
- Lead time: ${currentReport?.estimated_lead_time || 'unknown'}
- PCE: ${currentReport?.va_ratio || 'unknown'}
- Improvement potential: ${JSON.stringify(currentReport?.improvement_potential || {})}

Their target: ${targetStatement}
Category: ${targetCategory}
Value: ${targetValue} ${targetUnit}
Deadline: ${targetDeadline || 'not specified'}

Ask the single most important question to understand what's actually stopping the target from being achieved. One question only. Be direct. No preamble.`

      setChatLoading(true)
      try {
        const res = await fetch('/api/ai/assist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'supe_brainstorm', data: { prompt: openingCtx, industryId: project.industry || profile.industry } }),
        })
        const data = await res.json()
        const supeText = data.result || "Tell me what's actually happening in this process day to day. What does the team say is the biggest problem?"
        setMessages([{ role: 'supe', text: supeText, timestamp: new Date().toISOString() }])
      } catch {
        setMessages([{ role: 'supe', text: `Let's work through this together. You've set a target: "${targetStatement}". What's the single biggest thing currently stopping you from achieving it?`, timestamp: new Date().toISOString() }])
      } finally {
        setChatLoading(false)
      }
    }
  }

  // ── Send message to Supe ─────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg: ChatMsg = { role: 'user', text: chatInput, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setChatInput('')
    setChatLoading(true)

    try {
      // FIX: limit transcript to last 12 messages to prevent context overflow
      const transcript = [...messages, userMsg].slice(-12).map(m => `${m.role === 'user' ? 'User' : 'Supe'}: ${m.text}`).join('\n\n')
      const prompt = `Supe lean VSM brainstorm | Project: ${project.name} | Industry: ${indLabel} | Target: ${targetStatement} | PCE: ${currentReport?.va_ratio || 'unknown'}

CONVERSATION:
${transcript}

Supe: (respond with ONE focused follow-up question or specific lean insight, max 3 sentences, no preamble)`

      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'supe_brainstorm', data: { prompt, industryId: project.industry || profile.industry } }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'supe', text: data.result || 'Can you tell me more about that step?', timestamp: new Date().toISOString() }])
    } catch {
      setMessages(prev => [...prev, { role: 'supe', text: 'Tell me more about that, what does the data show?', timestamp: new Date().toISOString() }])
    } finally {
      setChatLoading(false)
    }
  }

  // ── Generate future state ─────────────────────────────────────────────────
  const generateFutureState = async () => {
    setGenerating(true)
    setStage('generating')
    try {
      // FIX: limit transcript to last 12 messages to prevent context overflow
      const transcript = messages.slice(-12).map(m => `${m.role === 'user' ? 'User' : 'Supe'}: ${m.text}`).join('\n\n')
      const res = await fetch('/api/v2/future-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          target_statement: targetStatement,
          target_category: targetCategory,
          target_value: targetValue,
          target_deadline: targetDeadline,
          target_unit: targetUnit,
          supe_transcript: transcript || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFutureReport(data.report)
      onReportGenerated(data.report)
      setStage('done')
      toast.success('Future state report generated')
    } catch (e: any) {
      toast.error(e.message || 'Generation failed')
      setStage('brainstorm')
    } finally {
      setGenerating(false)
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: TARGET SETTING
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'target') {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: BRAND, marginBottom: 12 }}>FUTURE STATE, STEP 1 OF 2</div>
          <h2 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: 'var(--text)', marginBottom: 10, lineHeight: 1.15 }}>
            What does success look like?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 32, lineHeight: 1.75 }}>
            Define your target clearly. The more specific you are, the more accurate your future state plan will be.
          </p>

          {/* No current report warning */}
          {!currentReport && (
            <div style={{ padding: '12px 14px', background: 'rgba(201,166,107,0.08)', border: '1px solid rgba(201,166,107,0.28)', borderRadius: 9, marginBottom: 24, fontSize: 13, color: 'var(--vs-navy-900, #0B1D33)' }}>
              <AlertIcon size={14} color="var(--vs-navy-900, #0B1D33)"/> Run the current state analysis first (click Analyze) for a more accurate future state projection.
            </div>
          )}

          {/* Target category */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 10 }}>
              What type of target is this? *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {TARGET_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setTargetCategory(cat.id)} style={{
                  padding: '10px 12px', borderRadius: 9, border: '1.5px solid',
                  borderColor: targetCategory === cat.id ? BRAND : 'var(--vs-slate-200, #DDE3EA)',
                  background: targetCategory === cat.id ? 'rgba(11,29,51,0.05)' : 'white',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 13, fontWeight: targetCategory === cat.id ? 700 : 500, color: targetCategory === cat.id ? BRAND : 'var(--text)', marginBottom: 3 }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{cat.example}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Target statement */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
              Target statement, in your own words *
            </label>
            <textarea
              value={targetStatement}
              onChange={e => setTargetStatement(e.target.value)}
              placeholder={`e.g. Reduce ${t?.leadTime || 'lead time'} from 4.2 hours to under 2 hours within 3 months, while maintaining current ${t?.quality || 'quality'} levels…`}
              style={{ width: '100%', minHeight: 90, padding: '10px 12px', borderRadius: 9, border: '1px solid var(--vs-slate-200, #DDE3EA)', fontSize: 13, fontFamily: 'inherit', lineHeight: 1.65, resize: 'vertical', color: 'var(--text)', background: 'var(--vs-paper, #F7F8FA)' }}
            />
          </div>

          {/* Value + unit + deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: 12, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Target value</label>
              <input value={targetValue} onChange={e => setTargetValue(e.target.value)} placeholder="e.g. 95, 2, 120"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--vs-slate-200, #DDE3EA)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--vs-paper, #F7F8FA)' }}/>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Unit</label>
              <input value={targetUnit} onChange={e => setTargetUnit(e.target.value)} placeholder="%, hrs, units…"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--vs-slate-200, #DDE3EA)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--vs-paper, #F7F8FA)' }}/>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 5 }}>Target deadline</label>
              <input type="date" value={targetDeadline} onChange={e => setTargetDeadline(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1px solid var(--vs-slate-200, #DDE3EA)', fontSize: 13, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--vs-paper, #F7F8FA)' }}/>
            </div>
          </div>

          {/* Mode selection */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 10 }}>
              How do you want to develop the future state?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => setSelfMode(false)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
                borderRadius: 10, border: `1.5px solid ${!selfMode ? BRAND : 'var(--vs-slate-200, #DDE3EA)'}`,
                background: !selfMode ? 'rgba(11,29,51,0.04)' : 'white', cursor: 'pointer', textAlign: 'left',
                opacity: isPaid ? 1 : .5,
              }}>
                <ZapIcon size={20} color="var(--brand)"/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: !selfMode ? BRAND : 'var(--text)', marginBottom: 3 }}>
                    Supe AI brainstorming session {!isPaid && '(Pro)'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
                    Supe asks targeted questions about your process, challenges, and constraints, then builds a data-backed future state plan. Like working through it with an experienced lean consultant.
                  </div>
                </div>
              </button>
              <button onClick={() => setSelfMode(true)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
                borderRadius: 10, border: `1.5px solid ${selfMode ? BRAND : 'var(--vs-slate-200, #DDE3EA)'}`,
                background: selfMode ? 'rgba(11,29,51,0.04)' : 'white', cursor: 'pointer', textAlign: 'left',
              }}>
                <SearchIcon size={20} color="var(--text2)"/>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selfMode ? BRAND : 'var(--text)', marginBottom: 3 }}>Self-directed analysis</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
                    Use the CI tools on each step to work through root causes yourself, then generate the future state based on your findings.
                  </div>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={selfMode ? generateFutureState : startBrainstorm}
            disabled={!targetStatement.trim() || !targetCategory}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 10, border: 'none',
              background: (!targetStatement.trim() || !targetCategory) ? 'var(--vs-slate-200)' : 'var(--vs-navy-900, #0B1D33)',
              color: (!targetStatement.trim() || !targetCategory) ? 'var(--text3)' : 'white',
              fontSize: 15, fontWeight: 700, cursor: (!targetStatement.trim() || !targetCategory) ? 'not-allowed' : 'pointer',
            }}>
            {selfMode ? 'Generate future state →' : 'Start Supe session →'}
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: BRAINSTORMING WITH SUPE
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'brainstorm') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Context bar */}
        <div style={{ padding: '10px 20px', background: 'var(--vs-navy-900, #0B1D33)', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,.4)', letterSpacing: 2 }}>TARGET</div>
            <div style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{targetStatement}</div>
          </div>
          <button onClick={generateFutureState} disabled={generating} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#A8854F,#C9A66B)',
            color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
          }}>
            Generate future state →
          </button>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: NAVY }}>
          {messages.length === 0 && chatLoading && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '12px 0' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND, opacity: .6, animation: `think .8s ease ${i*.2}s infinite` }}/>)}
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginLeft: 6 }}>Supe is reading your process…</span>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{
              marginBottom: 14, display: 'flex', flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {msg.role === 'supe' && (
                <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,.3)', marginBottom: 5, letterSpacing: 1 }}><ZapIcon size={14}/> SUPE</div>
              )}
              <div style={{
                maxWidth: '82%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: msg.role === 'user' ? 'rgba(255,255,255,.08)' : 'rgba(11,29,51,.18)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(11,29,51,.3)',
                fontSize: 14, color: msg.role === 'user' ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.9)',
                lineHeight: 1.7,
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {chatLoading && messages.length > 0 && (
            <div style={{ display: 'flex', gap: 5, padding: '8px 0' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND, opacity: .6, animation: `think .8s ease ${i*.2}s infinite` }}/>)}
            </div>
          )}
          <div ref={chatEndRef}/>
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', background: NAVY, borderTop: '1px solid rgba(255,255,255,.08)', flexShrink: 0, display: 'flex', gap: 10 }}>
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Answer Supe's question or add more context…"
            style={{
              flex: 1, padding: '11px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,.15)',
              background: 'rgba(255,255,255,.06)', color: 'white', fontSize: 14, fontFamily: 'inherit',
            }}
          />
          <button onClick={sendMessage} disabled={chatLoading || !chatInput.trim()} style={{
            padding: '11px 18px', borderRadius: 9, border: 'none',
            background: chatLoading || !chatInput.trim() ? 'rgba(11,29,51,.3)' : BRAND,
            color: 'white', fontSize: 14, fontWeight: 700, cursor: chatLoading ? 'wait' : 'pointer',
          }}>Send</button>
        </div>

        <style>{`@keyframes think { 0%,100%{opacity:.2} 50%{opacity:1} }`}</style>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: GENERATING
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'generating') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
        <div style={{ width: 56, height: 56, border: `3px solid rgba(11,29,51,.2)`, borderTopColor: BRAND, borderRadius: '50%', animation: 'spin 1s linear infinite' }}/>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Building your future state…</h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 360, lineHeight: 1.7 }}>
            Analysing your {t?.valueStream || 'value stream'}, applying lean methodology, and generating a data-backed improvement plan.
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STAGE: DONE, Show future state report
  // ─────────────────────────────────────────────────────────────────────────
  if (stage === 'done' && futureReport) {
    const ip = futureReport.improvement_potential || {}
    const actionPlan = futureReport.action_plan || []
    const futureSteps = futureReport.future_state_steps || []
    const fs = futureReport.future_state || {}

    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>

          {/* Disclaimer */}
          <div style={{ background: 'rgba(201,166,107,0.08)', border: '1px solid rgba(201,166,107,.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}><AlertIcon size={14} color="#92400E"/></span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--vs-navy-900, #0B1D33)', marginBottom: 4, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>DISCLAIMER</div>
              <p style={{ fontSize: 12, color: 'var(--vs-navy-900, #0B1D33)', lineHeight: 1.7, margin: 0 }}>{futureReport.disclaimer}</p>
            </div>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: GREEN, marginBottom: 8 }}>FUTURE STATE · TARGET PLAN</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 10, lineHeight: 1.2 }}>{project.name}</h2>
            <div style={{ padding: '12px 16px', background: 'rgba(46,132,74,.06)', border: '1px solid rgba(46,132,74,.2)', borderRadius: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: GREEN, letterSpacing: 1.5, marginBottom: 4 }}>TARGET</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{targetStatement}</p>
              {targetDeadline && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Deadline: {targetDeadline}</div>}
            </div>
          </div>

          {/* Target achievability */}
          {futureReport.target_achievement && (
            <div style={{ marginBottom: 24, padding: '18px 20px', background: 'white', border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 12 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: GREEN, marginBottom: 10 }}>TARGET ASSESSMENT</div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 10 }}>{futureReport.target_achievement}</p>
              {futureReport.tolerance_range && (
                <div style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>
                  Expected tolerance: {futureReport.tolerance_range}
                </div>
              )}
            </div>
          )}

          {/* Projected metrics */}
          {ip && Object.keys(ip).length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 24 }}>
              {Object.entries(ip).filter(([k]) => !['basis','primary_lever'].includes(k)).map(([key, val]) => (
                <div key={key} style={{ padding: '14px 16px', background: 'white', border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text3)', letterSpacing: 1, marginBottom: 5 }}>
                    {key.replace(/_/g,' ').toUpperCase()}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: SERIF, color: GREEN }}>{String(val)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Future state step changes */}
          {futureSteps.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--text3)', marginBottom: 12 }}>FUTURE STATE, STEP CHANGES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {futureSteps.map((s: any, i: number) => {
                  const colors = { improved: GREEN, eliminated: RED, added: BRAND, merged: AMBER, unchanged: '#aaa' }
                  const color = colors[s.change_type as keyof typeof colors] || '#aaa'
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'white', border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 9 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                          <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: color + '18', color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            {(s.change_type || '').toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>{s.change_description}</div>
                        {s.target_cycle_time > 0 && (
                          <div style={{ fontSize: 11, color: GREEN }}>
                            Target CT: {s.target_cycle_time} {s.cycle_time_unit}
                            {s.projected_gain && ` · ${s.projected_gain}`}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action plan */}
          {actionPlan.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: BRAND, marginBottom: 12 }}>ACTION PLAN TO ACHIEVE TARGET</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {actionPlan.map((a: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'white', border: '1px solid var(--vs-slate-200, #DDE3EA)', borderRadius: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: BRAND, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{a.sequence || i+1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{a.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 6 }}>{a.description}</div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        {a.timeframe && <span style={{ fontSize: 11, color: 'var(--text3)' }}><ClockIcon size={11}/> {a.timeframe}</span>}
                        {a.ci_tool && <span style={{ fontSize: 11, color: BRAND }}><ZapIcon size={11}/> {a.ci_tool}</span>}
                        {a.expected_outcome && <span style={{ fontSize: 11, color: GREEN }}>→ {a.expected_outcome}</span>}
                      </div>
                      {a.dependencies?.length > 0 && (
                        <div style={{ fontSize: 11, color: AMBER, marginTop: 4 }}>
                          Depends on: {a.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regenerate */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
            <button onClick={() => { setStage('target'); setFutureReport(null) }} style={{
              padding: '10px 20px', borderRadius: 8, border: '1px solid var(--vs-slate-200, #DDE3EA)',
              background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text2)',
            }}>
              ← Revise target
            </button>
            <button onClick={() => { setStage('brainstorm') }} style={{
              padding: '10px 20px', borderRadius: 8, border: '1px solid var(--vs-slate-200, #DDE3EA)',
              background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text2)',
            }}>
              Continue brainstorming
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
