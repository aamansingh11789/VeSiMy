// TypeScript enabled
'use client'
import { ZapIcon, ChevronDownIcon, CheckIcon } from '@/components/ui/Icons'
// ── components/supe/SupePanel.tsx ─────────────────────────────────────────────

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { analyzeSteps, ISSUE_LABEL, SEV_COLOR } from '@/lib/supe-engine'
import type { Step } from '@/lib/store'

interface Props { steps: Step[]; projectId: string; industry?: string; projectName?: string }

type ChatMsg = { role: 'user' | 'assistant'; content: string }

const DEMO_RECS = [
  { key:'demo-1', issue_type:'bottleneck' as const, severity:'high' as const, step_name:'Assembly Station 3',
    suggestion:'Assembly Station 3 cycle time (4m 20s) is 87% above process average. Rebalance by splitting the inspect sub-task to a dedicated QC station. Target: within 10% of 140s takt time.',
    principle:'Line Balancing' },
  { key:'demo-2', issue_type:'smed' as const, severity:'medium' as const, step_name:'CNC Machining',
    suggestion:'Setup time of 28 minutes at CNC Machining is a SMED opportunity. Convert fixture alignment (internal) to a pre-staged external setup. Target: sub-10 minute changeover.',
    principle:'SMED' },
  { key:'demo-3', issue_type:'waiting' as const, severity:'medium' as const, step_name:'Incoming Inspection',
    suggestion:'Wait time (12m) exceeds cycle time (8m) at Incoming Inspection. Batch size from receiving is creating upstream queue. Implement pull signal with max WIP of 3 units.',
    principle:'7 Wastes, Waiting' },
]

const SUGGESTED_QUESTIONS = [
  'Where is my biggest bottleneck?',
  'How can I reduce lead time?',
  'What should I kaizen first?',
  'Calculate my takt time',
  'Which step wastes the most time?',
  'How do I fix my defect rate?',
]

export function SupePanel({ steps, projectId, industry, projectName }: Props) {
  const isDemo   = !steps?.length || !steps.some(s => s.cycle_time || s.toolData?.stopwatch?.mean > 0)
  const [recs,      setRecs]      = useState(() => isDemo ? DEMO_RECS : analyzeSteps(steps))
  // FIX: persist resolved findings to localStorage per project so they survive page refresh
  const [resolved, setResolved] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const saved = localStorage.getItem(`supe-resolved-${projectId}`)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  function resolveItem(key: string) {
    setResolved(prev => {
      const next = new Set([...prev, key])
      try { localStorage.setItem(`supe-resolved-${projectId}`, JSON.stringify([...next])) } catch {}
      return next
    })
  }
  const [expanded,  setExpanded]  = useState<string|null>(null)
  const [tab,       setTab]       = useState<'findings'|'chat'>('findings')
  const [chat,      setChat]      = useState<ChatMsg[]>([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Reset chat, tab, and expanded state when the user switches to a different project.
  // Without this, the previous project's chat history persists as stale context.
  useEffect(() => {
    setChat([])
    setInput('')
    setExpanded(null)
    setTab('findings')
    setLoading(false)
  }, [projectId])

  useEffect(() => {
    if (!isDemo) setRecs(analyzeSteps(steps))
    else setRecs(DEMO_RECS)
  }, [steps, isDemo])

  // Reload resolved state when project changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(`supe-resolved-${projectId}`)
      setResolved(saved ? new Set(JSON.parse(saved)) : new Set())
    } catch { setResolved(new Set()) }
  }, [projectId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [chat])

  const open  = recs.filter(r => !resolved.has(r.key))
  const highN = open.filter(r => r.severity==='high').length

  async function sendMessage(msg?: string) {
    const question = (msg || input).trim()
    if (!question) return
    setInput('')

    const userMsg: ChatMsg = { role:'user', content:question }
    const newHistory = [...chat, userMsg]
    setChat(newHistory)
    setLoading(true)

    try {
      const res = await fetch('/api/supe/analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          project_id:   projectId,
          steps:        isDemo ? [] : steps,
          question,
          chat_history: chat.slice(-6),
          industry:     industry || null,
          project_name: projectName || null,
        }),
      })
      const d = await res.json()
      const answer = d.answer || "I couldn't analyze that, make sure your ANTHROPIC_API_KEY is configured in Vercel."
      setChat(prev => [...prev, { role:'assistant', content:answer }])
    } catch {
      setChat(prev => [...prev, { role:'assistant', content:"Connection error. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="card" style={{ overflow:'hidden', display:'flex', flexDirection:'column' }}>

      {/* ── Header ── */}
      <div style={{ padding:'14px 18px', background:'var(--vs-white)', borderBottom:'1px solid var(--vs-slate-200)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:'var(--vs-gold-600)', color:'var(--vs-navy-900)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, fontFamily:"'JetBrains Mono',monospace", letterSpacing:0.5 }}>S</div>
          <span style={{ fontWeight:650, color:'var(--vs-navy-900)', fontSize:15, fontFamily:"'Sora','Inter',sans-serif", letterSpacing:'-0.01em' }}>Supe</span>
          <span style={{ fontSize:9, color:'var(--vs-slate-600)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:1.5, textTransform:'uppercase' }}>AI Lean Advisor</span>
          {isDemo && <span style={{ fontSize:9, color:'var(--brand)', background:'var(--brand-dim)', border:'1px solid var(--brand-glow)', padding:'1px 7px', borderRadius:100, letterSpacing:1 }}>DEMO</span>}
        </div>
        {highN > 0 && <span style={{ background:'var(--red)', color:'#fff', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:100 }}>{highN} HIGH</span>}
      </div>

      {/* ── Stats row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        {([[open.length, highN>0?'var(--red)':'var(--brand)', 'ISSUES'],
           [resolved.size, '#1DD1A1', 'RESOLVED'],
           [isDemo ? ',' : steps.length, 'var(--steel)', 'STEPS']] as any[]).map(([v,c,l]) => (
          <div key={l} style={{ padding:'10px', textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:700, color:c }}>{v}</div>
            <div style={{ fontSize:9, color:'var(--text3)', fontFamily:'var(--font-mono)', letterSpacing:1 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── Tab switcher ── */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
        {(['findings','chat'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'9px 0', fontSize:12, fontWeight:600,
            background: tab===t ? 'rgba(201,166,107,0.10)' : 'transparent',
            borderBottom: tab===t ? '2px solid #A8854F' : '2px solid transparent',
            color: tab===t ? '#A8854F' : 'var(--text3)',
            border:'none', cursor:'pointer', transition:'all 0.15s',
            fontFamily:'var(--font-mono)', letterSpacing:0.5, textTransform:'uppercase',
          }}>
            {t === 'findings' ? `Findings${open.length ? ` (${open.length})` : ''}` : 'Ask Supe'}
          </button>
        ))}
      </div>

      {/* ── Findings tab ── */}
      {tab === 'findings' && (
        <div style={{ flex:1, overflowY:'auto', maxHeight:400 }}>
          {isDemo && (
            <div style={{ padding:'10px 16px', background:'var(--vs-paper)', borderBottom:'1px solid var(--vs-slate-200)', display:'flex', alignItems:'center', gap:8 }}>
              
              <span style={{ fontSize:11, color:'var(--text2)' }}>Demo data. Add real steps with cycle times for live analysis.</span>
            </div>
          )}
          {open.length === 0 && (
            <div style={{ padding:'32px 16px', textAlign:'center', color:'var(--text3)', fontSize:13 }}>
              <div style={{ fontSize:22, fontWeight:700, color:"#1DD1A1", marginBottom:8 }}>OK</div>
              No active issues. Process looks healthy!
            </div>
          )}
          {open.map(rec => {
            const isOpen = expanded === rec.key
            return (
              <div key={rec.key} style={{ borderBottom:'1px solid rgba(215,213,206,0.9)' }}>
                <div style={{ padding:'11px 14px', cursor:'pointer', display:'flex', gap:10, alignItems:'flex-start' }}
                     onClick={() => setExpanded(isOpen ? null : rec.key)}
                     onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background='transparent'}
                     onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background='transparent'}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:SEV_COLOR[rec.severity], marginTop:5, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>{ISSUE_LABEL[rec.issue_type]}</div>
                    {rec.step_name && <div style={{ fontSize:10, color:'var(--text2)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>@ {rec.step_name}</div>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:9, color:SEV_COLOR[rec.severity], fontFamily:'var(--font-mono)', textTransform:'uppercase' }}>{rec.severity}</span>
                    <span style={{ fontSize:10, color:'var(--text3)' }}>{isOpen ? <ChevronDownIcon size={10} style={{transform:'rotate(180deg)'}}/> : <ChevronDownIcon size={10}/>}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding:'0 14px 14px 31px' }}>
                    <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7, marginBottom:10 }}>{rec.suggestion}</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6, flexWrap:'wrap' }}>
                      <span style={{ fontSize:10, background:'var(--brand-dim)', border:'1px solid var(--brand-glow)', color:'var(--brand)', padding:'2px 8px', borderRadius:100 }}>{rec.principle}</span>
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => { setTab('chat'); setInput(`Tell me more about the ${rec.principle} issue at ${rec.step_name||'this step'}`); }}
                          style={{ background:'none', border:'none', color:'#A8854F', fontSize:11, cursor:'pointer' }}>
                          Ask Supe
                        </button>
                        {!isDemo && (
                          <button onClick={() => resolveItem(rec.key)}
                            style={{ background:'none', border:'none', color:'#1DD1A1', fontSize:11, cursor:'pointer' }}>
                            
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Chat tab ── */}
      {tab === 'chat' && (
        <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>

          {/* Message history */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:10, maxHeight:320 }}>
            {chat.length === 0 && (
              <div style={{ color:'var(--text3)', fontSize:12, textAlign:'center', paddingTop:8, paddingBottom:4 }}>
                <div style={{ fontSize:10, fontWeight:800, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, color:"var(--brand)", marginBottom:6 }}>SUPE AI</div>
                Ask Supe anything about your process
              </div>
            )}

            {chat.map((msg, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: msg.role==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth:'88%', padding:'9px 12px', borderRadius: msg.role==='user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role==='user' ? 'rgba(201,166,107,0.12)' : 'var(--sl-100)',
                  border: msg.role==='user' ? '1px solid rgba(201,166,107,0.32)' : '1px solid var(--border)',
                  fontSize:12, color:'var(--text)', lineHeight:1.65,
                }}>
                  {msg.role === 'assistant' && (
                    <div style={{ fontSize:9, color:'#A8854F', fontFamily:'var(--font-mono)', letterSpacing:1, marginBottom:5 }}>SUPE</div>
                  )}
                  <div style={{ whiteSpace:'pre-wrap' }}>{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display:'flex', alignItems:'flex-start' }}>
                <div style={{ padding:'10px 14px', borderRadius:'12px 12px 12px 2px', background:'rgba(201,166,107,0.08)', border:'1px solid rgba(201,166,107,0.20)', backdropFilter:'blur(8px)' }}>
                  <div style={{ fontSize:9, color:'#A8854F', fontFamily:'var(--font-mono)', letterSpacing:1, marginBottom:8 }}><ZapIcon size={10}/> SUPE THINKING</div>
                  {/* Waveform animation */}
                  <div style={{ display:'flex', gap:3, alignItems:'center', height:20 }}>
                    {[0,1,2,3,4,5,6,7].map(i => (
                      <div key={i} style={{
                        width: 3, borderRadius: 2, background:'#A8854F',
                        animation: `supeBar 1.1s ease-in-out ${i * 0.1}s infinite alternate`,
                        opacity: 0.7,
                      }} />
                    ))}
                  </div>
                  <style>{`
                    @keyframes supeBar {
                      0%   { height: 3px; opacity: 0.3; }
                      50%  { height: 18px; opacity: 1; }
                      100% { height: 5px; opacity: 0.4; }
                    }
                  `}</style>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested questions, only show when chat is empty */}
          {chat.length === 0 && (
            <div style={{ padding:'0 14px 10px', display:'flex', flexWrap:'wrap', gap:6 }}>
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  padding:'5px 10px', borderRadius:20, fontSize:11, cursor:'pointer',
                  background:'rgba(201,166,107,0.08)', border:'1px solid rgba(201,166,107,0.20)',
                  color:'#A8854F', transition:'all 0.15s',
                }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background='rgba(100,38,160,0.12)'}
                   onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='rgba(201,166,107,0.08)'}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:'10px 14px', borderTop:'1px solid var(--border)', display:'flex', gap:8, flexShrink:0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Supe anything about your process…"
              disabled={loading}
              style={{
                flex:1, background:'#FFFFFF', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)',
                padding:'8px 12px', fontSize:12, color:'var(--text)', outline:'none',
                fontFamily:'inherit', transition:'border 0.15s',
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor='rgba(100,38,160,0.4)'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor='var(--border)'}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
              padding:'8px 14px', borderRadius:'var(--radius-sm)', background:'rgba(201,166,107,0.15)',
              border:'1px solid rgba(201,166,107,0.32)', color:'#A8854F', fontSize:13, cursor:loading||!input.trim()?'not-allowed':'pointer',
              fontWeight:700, transition:'all 0.15s', opacity: loading||!input.trim() ? 0.5 : 1,
            }}>
              ↑
            </button>
          </div>

        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,80%,100% { transform:scale(0.8); opacity:0.4 } 40% { transform:scale(1); opacity:1 } }
      `}</style>

    </div>
  )
}
