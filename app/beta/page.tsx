// @ts-nocheck
'use client'
// ── app/beta/page.tsx — Early Access Beta ─────────────────────────────────────

import { useState, useEffect } from 'react'
import Link                    from 'next/link'
import { AlertIcon, ClockIcon, ArrowRightIcon, CheckIcon } from '@/components/ui/Icons'


const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'
const GOLD  = '#D4A208'

const ROLES      = ['Operations Manager','Lean / CI Engineer','Quality Manager','Plant / Site Manager','Manufacturing Engineer','Lean Consultant','Other']
const INDUSTRIES = ['Automotive','Electronics / PCB','Aerospace','Industrial Manufacturing','Food & Beverage','Healthcare','Logistics / 3PL','Construction','Other']
const TOOLS      = ['Excel / Spreadsheets','Visio / Lucidchart','External Consultant','Post-it Notes / Whiteboard','eVSM / iGrafx','None — doing it manually']
const LEAN_EXP   = [
  { id: 'none',         label: "None — I'm new to lean" },
  { id: 'basic',        label: 'Basic — aware of concepts, some reading' },
  { id: 'intermediate', label: 'Intermediate — ran kaizen events or mapped VSMs before' },
  { id: 'expert',       label: 'Expert — lean is my job title / daily practice' },
]
const TEAM_SIZES = ['1-10','11-50','51-200','200+']

// ── Countdown to close date ───────────────────────────────────────────────────
function useCountdown(closeDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState({ days:0, hours:0, mins:0, secs:0, expired:false })
  useEffect(() => {
    if (!closeDate) return
    const tick = () => {
      const diff = closeDate.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft({ days:0, hours:0, mins:0, secs:0, expired:true }); return }
      const days  = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const mins  = Math.floor((diff % 3600000)  / 60000)
      const secs  = Math.floor((diff % 60000)    / 1000)
      setTimeLeft({ days, hours, mins, secs, expired: false })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [closeDate])
  return timeLeft
}

export default function BetaPage() {
  const [phase,      setPhase]      = useState<'landing'|'form'|'done'>('landing')
  const [submitting, setSubmitting] = useState(false)
  const [result,     setResult]     = useState<{ score:number; status:string } | null>(null)
  const [windowInfo, setWindowInfo] = useState<{ closes_at: string; label: string; is_open: boolean } | null>(null)
  const [form, setForm] = useState({
    full_name:'', email:'', company:'', role:'', industry:'', years_experience:'',
    lean_experience:'', current_tools:[] as string[], team_size:'',
    pain_point:'', use_case:'', linkedin_url:'', referral_source:'',
  })
  const [error, setError] = useState('')

  // Fetch window info on load
  useEffect(() => {
    fetch('/api/beta/window').then(r => r.json()).then(d => {
      if (d.closes_at) setWindowInfo(d)
    }).catch(() => {})
  }, [])

  const closeDate = windowInfo?.closes_at ? new Date(windowInfo.closes_at) : null
  const countdown = useCountdown(closeDate)

  const set       = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const toggleTool = (t: string) => set('current_tools',
    form.current_tools.includes(t) ? form.current_tools.filter(x => x !== t) : [...form.current_tools, t])

  async function submit() {
    setError('')
    const required = ['full_name','email','role','industry','lean_experience','pain_point','use_case']
    const missing  = required.filter(k => !(form as any)[k]?.trim())
    if (missing.length) { setError(`Please complete: ${missing.join(', ')}`); return }
    if (form.pain_point.split(' ').length < 10) { setError('Please describe your pain point in a bit more detail (10+ words).'); return }
    if (form.use_case.split(' ').length < 10)   { setError('Please describe your use case in a bit more detail (10+ words).'); return }

    setSubmitting(true)
    try {
      const res  = await fetch('/api/beta/apply', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed. Try again.'); setSubmitting(false); return }
      setResult(data)
      setPhase('done')
    } catch { setError('Network error. Please try again.'); setSubmitting(false) }
  }

  // ── DONE STATE ───────────────────────────────────────────────────────────────
  if (phase === 'done' && result) {
    const isApproved = result.status === 'approved'
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ maxWidth:520, width:'100%', textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', margin:'0 auto 28px', display:'flex', alignItems:'center', justifyContent:'center',
            background: isApproved ? 'rgba(29,209,161,0.12)' : 'rgba(212,162,8,0.1)',
            border:`2px solid ${isApproved?'#1DD1A1':'#D4A208'}` }}>
            {isApproved ? <CheckIcon size={40} color='#1DD1A1' /> : <span style={{ fontSize:32 }}>👑</span>}
          </div>
          <h1 style={{ fontFamily:serif, fontSize:28, fontWeight:700, color:'var(--text)', marginBottom:12 }}>
            {isApproved ? "You're In. Welcome to Founding Member." : 'Application Received'}
          </h1>
          <p style={{ color:'var(--text3)', fontSize:15, lineHeight:1.7, marginBottom:28 }}>
            {isApproved
              ? `Your Founding Member access is confirmed. Log in to claim your 30-day Pro trial — and your permanent Founding Member badge.`
              : `Your application is under review. We'll reach out within 48 hours.`}
          </p>
          <div style={{ background:'#FFFFFF', border:`1px solid rgba(212,162,8,0.2)`, borderRadius:12, padding:'18px 24px', marginBottom:28, textAlign:'left' }}>
            <p style={{ fontSize:11, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:12 }}>WHAT HAPPENS NEXT</p>
            {(isApproved ? [
              '✅ Head to the app — your Founding Member badge is waiting',
              '⏱  30-day Pro trial starts when you first log in',
              '💳 Upgrade to $99 Lifetime before trial ends to lock it in',
              '🏢 Your company gets a 33% enterprise discount code via email',
              '👑 Founding Member badge is permanent — it never goes away',
            ] : [
              '📧 We\'ll email you within 48 hours',
              '👑 Founding Member badge is yours if approved',
            ]).map((line, i) => (
              <div key={i} style={{ fontSize:13, color:'#B0B0C8', marginBottom:8 }}>{line}</div>
            ))}
          </div>
          {isApproved && (
            <Link href='/auth/signup' style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 28px', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer',
              background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#2A1F00', textDecoration:'none', marginBottom:16 }}>
              Claim Your Access <ArrowRightIcon size={16} />
            </Link>
          )}
          <div>
            <Link href="/" style={{ textDecoration:'none', color:'var(--sl-400)', fontSize:13 }}>← Back to VeSiMy</Link>
          </div>
        </div>
      </div>
    )
  }

  // ── LANDING ──────────────────────────────────────────────────────────────────
  if (phase === 'landing') return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)',
      backgroundImage:'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,162,8,0.06) 0%, transparent 60%)' }}>

      {/* Nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 40px', borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
        <Link href="/" style={{ textDecoration:'none' }}>
          <span style={{ fontFamily:serif, fontWeight:700, fontSize:22 }}>
            <span style={{ color:GOLD }}>V</span>e<span style={{ color:'#8C44CC' }}>S</span>i<span style={{ color:'#6CB9FC' }}>M</span>y
          </span>
        </Link>
        <Link href="/auth/signup" style={{ fontSize:13, color:'var(--text3)', textDecoration:'none' }}>Already a user? Sign in →</Link>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'64px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(212,162,8,0.08)', border:'1px solid rgba(212,162,8,0.25)', borderRadius:100, padding:'6px 18px', marginBottom:24 }}>
            <span style={{ fontSize:14 }}>👑</span>
            <span style={{ fontSize:11, color:GOLD, fontWeight:700, letterSpacing:2, fontFamily:'monospace' }}>FOUNDING MEMBER ACCESS</span>
          </div>
          <h1 style={{ fontFamily:serif, fontSize:'clamp(32px,5vw,58px)', fontWeight:700, lineHeight:1.15, marginBottom:20 }}>
            For one week only —<br />
            <span style={{ background:'linear-gradient(135deg,#F5D060,#D4A208,#9A7200)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Founding Member
            </span>{' '}is open to everyone.
          </h1>
          <p style={{ fontSize:18, color:'var(--text3)', maxWidth:560, margin:'0 auto 36px', lineHeight:1.7 }}>
            VeSiMy just launched. For early access, every practitioner who signs up gets the Founding Member badge — permanently. This is a limited credential for early practitioners.
          </p>

          {/* Countdown */}
          {closeDate && !countdown.expired && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#FFFFFF', border:'1px solid rgba(212,162,8,0.2)', borderRadius:12, padding:'14px 24px', marginBottom:32 }}>
              <ClockIcon size={14} color={GOLD} />
              <span style={{ fontSize:12, color:'var(--text3)', fontFamily:'monospace' }}>CLOSES IN</span>
              {[
                [countdown.days, 'DAYS'],
                [countdown.hours, 'HRS'],
                [countdown.mins, 'MIN'],
                [countdown.secs, 'SEC'],
              ].map(([val, unit]) => (
                <div key={unit as string} style={{ display:'flex', flexDirection:'column', alignItems:'center', minWidth:44 }}>
                  <span style={{ fontSize:22, fontWeight:700, color:'var(--text)', fontFamily:'monospace' }}>{String(val).padStart(2,'0')}</span>
                  <span style={{ fontSize:9, color:'var(--sl-400)', letterSpacing:1 }}>{unit}</span>
                </div>
              ))}
            </div>
          )}
          {countdown.expired && (
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:12, padding:'12px 20px', marginBottom:32 }}>
              <span style={{ fontSize:13, color:'#FF6B6B' }}>The launch window has closed. Join the waitlist for the next opening.</span>
            </div>
          )}

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => setPhase('form')} style={{ padding:'14px 36px', borderRadius:10, fontSize:16, fontWeight:700, cursor:'pointer',
              background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#2A1F00', border:'none', display:'flex', alignItems:'center', gap:8 }}>
              Join Founding Member <ArrowRightIcon size={16} />
            </button>
            <a href="#perks" style={{ padding:'14px 24px', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer',
              background:'#FFFFFF', color:'var(--text3)', border:'1px solid rgba(40,40,92,0.5)', textDecoration:'none' }}>
              See what you get ↓
            </a>
          </div>
        </div>

        {/* What you get */}
        <div id="perks" style={{ background:'#FFFFFF', border:'1px solid rgba(212,162,8,0.2)', borderRadius:16, padding:'32px 36px', marginBottom:48 }}>
          <p style={{ fontSize:11, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:20 }}>WHAT GOLD STANDARD GETS YOU — FOREVER</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:24 }}>
            {[
              { icon:'⏱', title:'30-Day Pro Trial',       desc:'Full Pro access from day one — all 6 CI tools, PDF export, Supe AI, unlimited steps.' },
              { icon:'♾️', title:'$99 Lifetime Upgrade',   desc:'Pay once after the trial. 99 projects, no monthly fees, ever. Beta price only.' },
              { icon:'👑', title:'Permanent Gold Badge',   desc:'Sidebar, settings, and every report you export carries the Founding Member mark. Permanent.' },
              { icon:'🏢', title:'33% Enterprise Discount',desc:"Your company gets a perpetual 33% off any enterprise plan — as long as you're a Founding Member holder." },
              { icon:'🗺️', title:'Shape the Roadmap',      desc:'Direct line to submit feature requests. Founding testers get priority consideration on every release.' },
              { icon:'📞', title:'Founding Tester Access', desc:'Direct channel to the team. Bug reports, feedback, product questions — you have our ear.' },
            ].map(item => (
              <div key={item.title} style={{ display:'flex', gap:14 }}>
                <span style={{ fontSize:26, flexShrink:0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:5 }}>{item.title}</div>
                  <div style={{ fontSize:12, color:'var(--text3)', lineHeight:1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why it's time-limited */}
        <div style={{ background:'rgba(212,162,8,0.04)', border:'1px solid rgba(212,162,8,0.15)', borderRadius:14, padding:'24px 28px', marginBottom:48, display:'flex', gap:20, alignItems:'flex-start' }}>
          <span style={{ fontSize:28, flexShrink:0 }}>⏳</span>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--text)', marginBottom:6 }}>Why early access only?</div>
            <p style={{ fontSize:13, color:'var(--text3)', lineHeight:1.7, margin:0 }}>
              The Founding Member badge is a founding-tester credential. After early access, it goes away — new users join on standard pricing. 
              Everyone who gets in during the window keeps their badge, their 33% enterprise discount, and their lifetime upgrade option permanently. 
              This is the only way to get it.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div style={{ textAlign:'center' }}>
          <button onClick={() => setPhase('form')} style={{ padding:'15px 44px', borderRadius:10, fontSize:16, fontWeight:700, cursor:'pointer',
            background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#2A1F00', border:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
            Join Founding Member <ArrowRightIcon size={16} />
          </button>
          <p style={{ fontSize:12, color:'var(--sl-400)', marginTop:12 }}>Takes 3 minutes. No credit card required.</p>
        </div>
      </div>
    </div>
  )

  // ── APPLICATION FORM ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)',
      backgroundImage:'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(212,162,8,0.05) 0%, transparent 55%)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 40px', borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
        <Link href="/" style={{ textDecoration:'none' }}>
          <span style={{ fontFamily:serif, fontWeight:700, fontSize:22 }}>
            <span style={{ color:GOLD }}>V</span>e<span style={{ color:'#8C44CC' }}>S</span>i<span style={{ color:'#6CB9FC' }}>M</span>y
          </span>
        </Link>
        <button onClick={() => setPhase('landing')} style={{ background:'none', border:'none', color:'var(--sl-400)', cursor:'pointer', fontSize:13 }}>
          ← Back
        </button>
      </div>

      <div style={{ maxWidth:680, margin:'0 auto', padding:'48px 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:11, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:12 }}>GOLD STANDARD — EARLY ACCESS</div>
          <h1 style={{ fontFamily:serif, fontSize:'clamp(24px,3.5vw,38px)', fontWeight:700, marginBottom:8 }}>Claim Your Founding Member Access</h1>
          <p style={{ fontSize:14, color:'var(--text3)' }}>Takes about 3 minutes. Everyone is approved during early access.</p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
          {/* Basic info */}
          <Section title="About You">
            <Row2>
              <Field label="Full Name *"><input className="input" value={form.full_name} onChange={e=>set('full_name',e.target.value)} placeholder="Jane Smith" /></Field>
              <Field label="Email *"><input className="input" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="jane@company.com" type="email" /></Field>
            </Row2>
            <Row2>
              <Field label="Company / Organization"><input className="input" value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Acme Manufacturing" /></Field>
              <Field label="Years in Manufacturing / CI">
                <select className="input" value={form.years_experience} onChange={e=>set('years_experience',e.target.value)}>
                  <option value="">Select…</option>
                  {['<1','1-3','3-7','7-15','15+'].map(v=><option key={v} value={v}>{v} years</option>)}
                </select>
              </Field>
            </Row2>
          </Section>

          {/* Role & industry */}
          <Section title="Your Role">
            <Row2>
              <Field label="Your Role *">
                <select className="input" value={form.role} onChange={e=>set('role',e.target.value)}>
                  <option value="">Select…</option>
                  {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Industry *">
                <select className="input" value={form.industry} onChange={e=>set('industry',e.target.value)}>
                  <option value="">Select…</option>
                  {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </Field>
            </Row2>
            <Field label="Team Size at Your Facility">
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {TEAM_SIZES.map(s=>(
                  <button key={s} type="button" onClick={()=>set('team_size',s)} style={{ padding:'7px 16px', borderRadius:8, fontSize:13, cursor:'pointer', border:'1px solid',
                    background: form.team_size===s?'rgba(212,162,8,0.1)':'#FFFFFF',
                    borderColor: form.team_size===s?'rgba(212,162,8,0.4)':'rgba(40,40,92,0.5)',
                    color: form.team_size===s?'var(--text)':'var(--text3)' }}>{s} people</button>
                ))}
              </div>
            </Field>
          </Section>

          {/* Lean experience */}
          <Section title="Your Lean Experience">
            <Field label="Lean / CI Experience Level *">
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {LEAN_EXP.map(opt=>(
                  <button key={opt.id} type="button" onClick={()=>set('lean_experience',opt.id)} style={{ padding:'11px 16px', borderRadius:10, fontSize:13, cursor:'pointer', border:'1px solid', textAlign:'left',
                    background: form.lean_experience===opt.id?'rgba(212,162,8,0.08)':'#FFFFFF',
                    borderColor: form.lean_experience===opt.id?'rgba(212,162,8,0.4)':'rgba(40,40,92,0.5)',
                    color: form.lean_experience===opt.id?'var(--text)':'var(--text3)' }}>
                    <span style={{ color: form.lean_experience===opt.id?GOLD:'var(--border2)', marginRight:8 }}>
                      {form.lean_experience===opt.id?'◉':'○'}
                    </span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Tools you currently use for CI (select all that apply)">
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {TOOLS.map(t=>(
                  <button key={t} type="button" onClick={()=>toggleTool(t)} style={{ padding:'7px 14px', borderRadius:100, fontSize:12, cursor:'pointer', border:'1px solid',
                    background: form.current_tools.includes(t)?'rgba(140,68,204,0.1)':'#FFFFFF',
                    borderColor: form.current_tools.includes(t)?'rgba(140,68,204,0.4)':'rgba(40,40,92,0.5)',
                    color: form.current_tools.includes(t)?'var(--text)':'var(--text3)' }}>{t}</button>
                ))}
              </div>
            </Field>
          </Section>

          {/* Use case */}
          <Section title="Your Use Case">
            <Field label="What's your biggest CI pain point right now? *" hint="Be specific — name the process, the waste, the bottleneck.">
              <textarea className="input" rows={4} value={form.pain_point} onChange={e=>set('pain_point',e.target.value)}
                placeholder="e.g. Our CNC machining cell has a 47-second changeover nobody has mapped properly. We track it in Excel but the data is stale by the time it reaches me…" />
              <div style={{ fontSize:11, color: form.pain_point.split(' ').length>=10?'#1DD1A1':'var(--sl-400)', marginTop:4, textAlign:'right' }}>
                {form.pain_point.split(' ').filter(Boolean).length} words
              </div>
            </Field>
            <Field label="How would you use VeSiMy specifically? *" hint="What process would you map first? What decision would it inform?">
              <textarea className="input" rows={4} value={form.use_case} onChange={e=>set('use_case',e.target.value)}
                placeholder="e.g. I'd map our engine assembly current state first — 22 steps, ~3 operators. Goal is to find where WIP piles up before the inspection station…" />
              <div style={{ fontSize:11, color: form.use_case.split(' ').length>=10?'#1DD1A1':'var(--sl-400)', marginTop:4, textAlign:'right' }}>
                {form.use_case.split(' ').filter(Boolean).length} words
              </div>
            </Field>
          </Section>

          {/* Optional */}
          <Section title="Optional">
            <Row2>
              <Field label="LinkedIn URL"><input className="input" value={form.linkedin_url} onChange={e=>set('linkedin_url',e.target.value)} placeholder="linkedin.com/in/yourprofile" /></Field>
              <Field label="How did you hear about VeSiMy?"><input className="input" value={form.referral_source} onChange={e=>set('referral_source',e.target.value)} placeholder="LinkedIn, Google, colleague…" /></Field>
            </Row2>
          </Section>

          {error && (
            <div style={{ padding:'12px 16px', borderRadius:8, background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.3)', display:'flex', gap:10, alignItems:'flex-start' }}>
              <AlertIcon size={16} color='#FF6B6B' style={{ flexShrink:0, marginTop:1 }} />
              <span style={{ fontSize:13, color:'#FF6B6B' }}>{error}</span>
            </div>
          )}

          <button onClick={submit} disabled={submitting} style={{ padding:'15px 32px', borderRadius:10, fontSize:16, fontWeight:700, cursor:submitting?'wait':'pointer', width:'100%', border:'none',
            background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#2A1F00', opacity:submitting?0.8:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {submitting ? '⟳ Submitting…' : 'Claim Founding Member Access'} {!submitting && <ArrowRightIcon size={16} />}
          </button>
          <p style={{ fontSize:12, color:'var(--sl-400)', textAlign:'center' }}>No spam. No cold calls. Cancel the trial anytime.</p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title:string; children:any }) {
  return (
    <div style={{ background:'#FFFFFF', border:'1px solid rgba(40,40,92,0.4)', borderRadius:14, padding:'22px 24px' }}>
      <p style={{ fontSize:11, color:GOLD, letterSpacing:2, fontFamily:'monospace', marginBottom:18 }}>{title.toUpperCase()}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>{children}</div>
    </div>
  )
}
function Row2({ children }: { children:any }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>{children}</div>
}
function Field({ label, hint, children }: { label:string; hint?:string; children:any }) {
  return (
    <div>
      <label className="label">{label}</label>
      {hint && <p style={{ fontSize:11, color:'var(--sl-400)', marginBottom:6, marginTop:2 }}>{hint}</p>}
      {children}
    </div>
  )
}
