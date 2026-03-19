// @ts-nocheck
'use client'
// ── app/onboarding/OnboardingClient.tsx ──────────────────────────────────────
// 3-step guided onboarding: Role → First Project → First Step → Dashboard

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { VesimyLogo } from '@/components/ui/Logo'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ChevronRightIcon, CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'


const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

const ROLES = [
  { id:'ops_manager',    label:'Operations Manager',       icon:'🏭' },
  { id:'lean_engineer',  label:'Lean / CI Engineer',       icon:'⚙️' },
  { id:'quality_mgr',    label:'Quality Manager',          icon:'✅' },
  { id:'plant_mgr',      label:'Plant / Site Manager',     icon:'🏗️' },
  { id:'consultant',     label:'Lean Consultant',          icon:'🤝' },
  { id:'student',        label:'Student / Learning Lean',  icon:'🎓' },
  { id:'other',          label:'Other',                    icon:'👋' },
]

const INDUSTRIES = [
  { id:'automotive',    label:'Automotive',         icon:'🚗' },
  { id:'electronics',   label:'Electronics / PCB',  icon:'⚡' },
  { id:'food_bev',      label:'Food & Beverage',    icon:'🍽️' },
  { id:'aerospace',     label:'Aerospace',          icon:'✈️' },
  { id:'healthcare',    label:'Healthcare',         icon:'🏥' },
  { id:'logistics',     label:'Logistics / 3PL',    icon:'📦' },
  { id:'industrial',    label:'Industrial Mfg',     icon:'🔧' },
  { id:'other',         label:'Other',              icon:'🌐' },
]

const FIRST_PROCESS_TEMPLATES = [
  { id:'assembly',   label:'Assembly Line',           steps:['Material Receipt','Sub-Assembly','Main Assembly','Quality Inspection','Packaging','Shipping'] },
  { id:'machining',  label:'CNC / Machining Cell',    steps:['Raw Material Queue','Setup','Machining','Deburr / Clean','Inspection','Move to Storage'] },
  { id:'order_flow', label:'Order Fulfilment',        steps:['Order Receipt','Pick','Pack','Quality Check','Dispatch','Delivery Confirmation'] },
  { id:'custom',     label:'I\'ll start from scratch', steps:[] },
]

interface Props { profile: any }

export function OnboardingClient({ profile }: Props) {
  const router = useRouter()
  const db     = createClient()

  const [step,       setStep]      = useState(1)   // 1-3
  const [role,       setRole]      = useState('')
  const [industry,   setIndustry]  = useState('')
  const [template,   setTemplate]  = useState('')
  const [projName,   setProjName]  = useState('')
  const [saving,     setSaving]    = useState(false)
  const [done,       setDone]      = useState(false)

  const totalSteps = 3
  const pct        = ((step - 1) / totalSteps) * 100

  async function finish() {
    if (!projName.trim()) { toast.error('Give your project a name'); return }
    setSaving(true)
    try {
      // 1. Mark profile onboarded + save role/industry
      await db.from('profiles').update({
        onboarded: true,
        role:      role,
        industry:  industry,
      }).eq('id', profile.id)

      // 2. Create first project
      const res = await fetch('/api/projects', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: projName, industry }),
      })
      const { project } = await res.json()

      // 3. Create template steps if chosen
      const tpl = FIRST_PROCESS_TEMPLATES.find(t => t.id === template)
      if (project?.id && tpl?.steps.length) {
        await Promise.all(tpl.steps.map((name, i) =>
          fetch('/api/steps', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              project_id: project.id,
              name,
              order_index: i,
              cycle_time: 0,
              wait_time:  0,
            }),
          })
        ))
      }

      setDone(true)
      setTimeout(() => {
        if (project?.id) router.push(`/project/${project.id}`)
        else router.push('/dashboard')
      }, 2000)
    } catch (e) {
      toast.error('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  if (done) return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:24 }}>
      <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(29,209,161,0.12)', border:'2px solid #1DD1A1', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <CheckIcon size={36} color='#1DD1A1' />
      </div>
      <h2 style={{ fontFamily:serif, fontSize:28, color:'var(--text)', fontWeight:700 }}>You're all set.</h2>
      <p style={{ color:'var(--text3)', fontSize:15 }}>Opening your first value stream map…</p>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column',
      backgroundImage:'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,162,8,0.05) 0%, transparent 60%)',
    }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 40px', borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
        <VesimyLogo size={32} showText />
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700,
                background: step > n ? 'rgba(29,209,161,0.15)' : step === n ? 'rgba(212,162,8,0.15)' : 'rgba(40,40,92,0.4)',
                border: step > n ? '1.5px solid #1DD1A1' : step === n ? '1.5px solid #D4A208' : '1.5px solid rgba(40,40,92,0.6)',
                color:   step > n ? '#1DD1A1' : step === n ? '#D4A208' : 'var(--sl-400)',
              }}>
                {step > n ? <CheckIcon size={13} strokeWidth={3} /> : n}
              </div>
              {n < 3 && <ChevronRightIcon size={14} color='var(--border2)' />}
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ fontSize:12, color:'var(--sl-400)', background:'none', border:'none', cursor:'pointer' }}>
          Skip setup →
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height:2, background:'rgba(26,26,64,0.4)' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg,#C49510,#D4A208)', width:`${pct}%`, transition:'width 0.4s ease' }} />
      </div>

      {/* Content */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:640 }}>

          {/* ── STEP 1: Role + Industry ── */}
          {step === 1 && (
            <div>
              <p style={{ fontSize:11, color:'#D4A208', letterSpacing:3, fontFamily:'monospace', marginBottom:16 }}>STEP 1 OF 3 — YOUR ROLE</p>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(24px,4vw,40px)', fontWeight:700, color:'var(--text)', marginBottom:8, lineHeight:1.2 }}>
                Welcome{profile.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}.<br />
                <span style={{ color:'#D4A208' }}>What's your role?</span>
              </h1>
              <p style={{ fontSize:14, color:'var(--text3)', marginBottom:32, lineHeight:1.6 }}>
                VeSiMy adapts its suggestions to how you work.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10, marginBottom:32 }}>
                {ROLES.map(r => (
                  <button key={r.id} onClick={() => setRole(r.id)} style={{ padding:'14px 16px', borderRadius:12, textAlign:'left', cursor:'pointer', transition:'all 0.15s',
                    background: role===r.id ? 'rgba(212,162,8,0.08)' : '#FFFFFF',
                    border:     role===r.id ? '1.5px solid rgba(212,162,8,0.5)' : '1.5px solid rgba(40,40,92,0.5)',
                  }}>
                    <div style={{ fontSize:22, marginBottom:6 }}>{r.icon}</div>
                    <div style={{ fontSize:13, fontWeight:600, color: role===r.id?'var(--text)':'#B0B0C8', lineHeight:1.3 }}>{r.label}</div>
                  </button>
                ))}
              </div>

              <p style={{ fontSize:13, color:'var(--text3)', marginBottom:16, fontWeight:600 }}>And your industry:</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:40 }}>
                {INDUSTRIES.map(ind => (
                  <button key={ind.id} onClick={() => setIndustry(ind.id)} style={{ padding:'8px 14px', borderRadius:100, fontSize:13, cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:6,
                    background: industry===ind.id ? 'rgba(212,162,8,0.1)' : '#FFFFFF',
                    border:     industry===ind.id ? '1px solid rgba(212,162,8,0.4)' : '1px solid rgba(40,40,92,0.5)',
                    color:      industry===ind.id ? 'var(--text)' : 'var(--text3)',
                  }}>
                    <span>{ind.icon}</span>{ind.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setStep(2)} disabled={!role || !industry} style={{ padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, cursor: !role||!industry?'not-allowed':'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:8,
                background:!role||!industry ? 'rgba(40,40,92,0.3)' : 'linear-gradient(135deg,#C49510,#D4A208)',
                color:     !role||!industry ? 'var(--sl-400)'            : 'var(--bg)',
              }}>
                Continue <ArrowRightIcon size={16} />
              </button>
            </div>
          )}

          {/* ── STEP 2: First Project ── */}
          {step === 2 && (
            <div>
              <p style={{ fontSize:11, color:'#D4A208', letterSpacing:3, fontFamily:'monospace', marginBottom:16 }}>STEP 2 OF 3 — YOUR FIRST PROCESS</p>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(24px,4vw,40px)', fontWeight:700, color:'var(--text)', marginBottom:8, lineHeight:1.2 }}>
                Name your first<br /><span style={{ color:'#D4A208' }}>value stream.</span>
              </h1>
              <p style={{ fontSize:14, color:'var(--text3)', marginBottom:28, lineHeight:1.6 }}>
                This is the process you'll map first. You can always add more later.
              </p>

              <label className="label" style={{ marginBottom:8, display:'block' }}>Process / Project Name</label>
              <input className="input" value={projName} onChange={e => setProjName(e.target.value)}
                placeholder="e.g. Engine Assembly Line, Order Fulfilment, CNC Cell A"
                style={{ marginBottom:28, fontSize:15 }} autoFocus />

              <p style={{ fontSize:13, color:'var(--text3)', marginBottom:14, fontWeight:600 }}>Start with a template — or blank:</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:40 }}>
                {FIRST_PROCESS_TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)} style={{ padding:'16px', borderRadius:12, textAlign:'left', cursor:'pointer', transition:'all 0.15s',
                    background: template===t.id ? 'rgba(140,68,204,0.08)' : '#FFFFFF',
                    border:     template===t.id ? '1.5px solid rgba(140,68,204,0.4)' : '1.5px solid rgba(40,40,92,0.5)',
                  }}>
                    <div style={{ fontWeight:600, fontSize:14, color: template===t.id?'var(--text)':'#B0B0C8', marginBottom:t.steps.length?6:0 }}>{t.label}</div>
                    {t.steps.length > 0 && (
                      <div style={{ fontSize:11, color:'var(--sl-400)', lineHeight:1.6 }}>
                        {t.steps.slice(0,3).join(' → ')}{t.steps.length > 3 ? ' → …' : ''}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button onClick={() => setStep(1)} style={{ padding:'13px 20px', borderRadius:10, fontSize:14, background:'rgba(40,40,92,0.3)', border:'1px solid rgba(40,40,92,0.6)', color:'var(--text3)', cursor:'pointer' }}>
                  ← Back
                </button>
                <button onClick={() => setStep(3)} disabled={!projName.trim() || !template} style={{ flex:1, padding:'13px 32px', borderRadius:10, fontSize:15, fontWeight:700, cursor:!projName.trim()||!template?'not-allowed':'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  background:!projName.trim()||!template ? 'rgba(40,40,92,0.3)' : 'linear-gradient(135deg,#C49510,#D4A208)',
                  color:     !projName.trim()||!template ? 'var(--sl-400)'            : 'var(--bg)',
                }}>
                  Continue <ArrowRightIcon size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm + Launch ── */}
          {step === 3 && (
            <div>
              <p style={{ fontSize:11, color:'#D4A208', letterSpacing:3, fontFamily:'monospace', marginBottom:16 }}>STEP 3 OF 3 — READY TO MAP</p>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(24px,4vw,40px)', fontWeight:700, color:'var(--text)', marginBottom:8, lineHeight:1.2 }}>
                You're ready.<br /><span style={{ color:'#D4A208' }}>Let's start mapping.</span>
              </h1>
              <p style={{ fontSize:14, color:'var(--text3)', marginBottom:36, lineHeight:1.6 }}>
                Here's what VeSiMy is about to create for you:
              </p>

              {/* Summary card */}
              <div style={{ background:'#FFFFFF', border:'1px solid rgba(212,162,8,0.2)', borderRadius:16, padding:28, marginBottom:36 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {[
                    ['Your Role',     ROLES.find(r=>r.id===role)?.label || role,     '👤'],
                    ['Industry',      INDUSTRIES.find(i=>i.id===industry)?.label || industry, '🏭'],
                    ['First Project', projName,                                        '🗺️'],
                    ['Template',      FIRST_PROCESS_TEMPLATES.find(t=>t.id===template)?.label || 'Blank', '📋'],
                  ].map(([k, v, icon]) => (
                    <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:13, color:'var(--text3)', display:'flex', alignItems:'center', gap:8 }}>
                        <span>{icon}</span>{k}
                      </span>
                      <span style={{ fontSize:13, color:'var(--text)', fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What happens next */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:36 }}>
                {[
                  { icon:'🗺️', label:'VSM map opens with your steps pre-loaded' },
                  { icon:'🤖', label:'Supe AI analyzes your process immediately' },
                  { icon:'📊', label:'Process Health Score starts tracking' },
                ].map(item => (
                  <div key={item.label} style={{ background:'#FFFFFF', border:'1px solid rgba(40,40,92,0.4)', borderRadius:10, padding:'14px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:22, marginBottom:8 }}>{item.icon}</div>
                    <div style={{ fontSize:11, color:'var(--text3)', lineHeight:1.5 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:12 }}>
                <button onClick={() => setStep(2)} style={{ padding:'13px 20px', borderRadius:10, fontSize:14, background:'rgba(40,40,92,0.3)', border:'1px solid rgba(40,40,92,0.6)', color:'var(--text3)', cursor:'pointer' }}>
                  ← Back
                </button>
                <button onClick={finish} disabled={saving} style={{ flex:1, padding:'14px 32px', borderRadius:10, fontSize:16, fontWeight:700, cursor:saving?'wait':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  background:'linear-gradient(135deg,#C49510,#D4A208)',
                  color:'var(--bg)', boxShadow:'0 4px 24px rgba(212,162,8,0.3)',
                  opacity: saving ? 0.8 : 1,
                }}>
                  {saving ? '⟳ Creating your map…' : 'Launch My Value Stream Map'} {!saving && <ArrowRightIcon size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
