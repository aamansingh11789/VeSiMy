// @ts-nocheck
'use client'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon, KaizenIcon, FishboneIcon, FiveWhyIcon, WasteIcon, ZapIcon, BarChartIcon, StopwatchIcon, VSMIcon, RoadmapIcon } from '@/components/ui/Icons'
import { createClient } from '@/lib/supabase'

const serif = '"DM Serif Display",Palatino Linotype,Georgia,serif'
const mono  = '"IBM Plex Mono",ui-monospace,monospace'

// ── Industry data ─────────────────────────────────────────────────────────────
const TERMS: Record<string, Record<string, string>> = {
  'CRAFT BREWERY':  { product:'Batch',             ct:'Brew Day Duration',    defect:'Off-flavour / Failed QC', gemba:'Brew floor / Cellar',   kaizen:'Brewery improvement',       bottleneck:'Constraint batch' },
  'HOSPITAL / ED':  { product:'Patient',            ct:'Length of Stay',       defect:'Adverse Event',           gemba:'Care Floor / Ward',     kaizen:'Care improvement',          bottleneck:'Capacity constraint' },
  'LAW FIRM':       { product:'Completed matter',   ct:'Phase duration',       defect:'Draft revision',          gemba:'Client site',           kaizen:'Practice improvement',      bottleneck:'Partner queue' },
  'SOFTWARE DEV':   { product:'Shipped feature',    ct:'Cycle time (days)',    defect:'Bug / PR rework',         gemba:'Dev floor / Studio',    kaizen:'Dev improvement sprint',    bottleneck:'Code review queue' },
  'OIL & GAS':      { product:'Well completion',    ct:'Drilling phase time',  defect:'NPT event',               gemba:'Drill floor / Rig',     kaizen:'Drilling improvement',      bottleneck:'NPT constraint' },
  'POLICE':         { product:'Resolved case',      ct:'Investigation phase',  defect:'File rejection',          gemba:'Investigation office',  kaizen:'Investigation improvement', bottleneck:'Case file constraint' },
  'REAL ESTATE':    { product:'Closed transaction', ct:'Transaction phase',    defect:'File kickback',           gemba:'Client / field',        kaizen:'Process improvement',       bottleneck:'Approval queue' },
  'FILM & TV':      { product:'Deliverable master', ct:'Stage duration',       defect:'Overrun / Retake',        gemba:'Set / Location',        kaizen:'Production improvement',    bottleneck:'Principal photography' },
  'AQUACULTURE':    { product:'Harvested seafood',  ct:'Stage duration',       defect:'Mortality event',         gemba:'Pen / Cage site',       kaizen:'Production improvement',    bottleneck:'Grow-out constraint' },
  'RESTAURANT':     { product:'Cover served',       ct:'Kitchen cycle time',   defect:'Wrong order / Return',    gemba:'Kitchen / FOH',         kaizen:'Service improvement',       bottleneck:'Kitchen constraint' },
}
const TERM_KEYS = Object.keys(TERMS)

const ALL_INDUSTRIES = [
  'Automotive','Hospital / ED','Software Dev','Restaurant','Craft Brewery',
  'Law Firm','Retail Store','E-Commerce','Warehouse','Hotel','Retail Banking',
  'Construction','Contact Centre','Marketing Agency','Real Estate','Pharma',
  'Winery','Primary Care','Aerospace','Food & Bev Mfg','Surgery / OR',
  'Pharmacy','Insurance','IT Operations','Cybersecurity','Telecoms','Grocery',
  'Airline','Freight & Trucking','Higher Education','Corporate L&D','Government',
  'Fire & Rescue','Police','Military','Film & TV','Music Production',
  'Video Games','Live Events','Publishing','Pro Sports','Fitness Clubs',
  'Nonprofit','Social Care','Farming','Aquaculture','Oil & Gas','Rail',
  'Port & Maritime','Management Consulting','Engineering Consulting',
  'Academic Research','Clinical Trials','Project Management','Architecture',
  'K-12 Education','Power Generation',
]

const CHANGELOG = [
  { tag:'NEW',         color:'#0176D3', title:'V2 Process Builder',            date:'March 2026',
    body:'Upload a Standard Operating Procedure and VeSiMy parses it into a live value stream map automatically.',
    items:['SOP upload → auto-parsed step map in seconds','AI analysis: bottleneck detection, PCE scoring','Future State panel: AI-generated improvement map','Integrated journal — every insight in one place'] },
  { tag:'MAJOR',       color:'#0176D3', title:'68 industries, 70 reference projects', date:'March 2026',
    body:'Every industry has a fully built reference project populated with real bottleneck data and root causes.',
    items:['All CI tools populated on every reference project','Real root causes — not placeholder text','Industry-specific steps, terminology, and metrics'] },
  { tag:'MAJOR',       color:'#2E844A', title:'Industry language engine',       date:'March 2026',
    body:'Your workspace speaks the language of your field. A nurse never sees "WIP". 68 industries, 40+ adapted terms each.',
    items:['Applies across dashboard, tools, AI, and learning center','Zero cross-industry terminology bleed','Fully reflected in every Supe AI response'] },
  { tag:'MAJOR',       color:'#8C44CC', title:'Industry-aware onboarding',      date:'March 2026',
    body:'A 4-step wizard guides every new user. Industry first — determines everything.',
    items:['Industry → Role → First Project → Launch','Industry-specific roles at Step 2','Reference project seeded for your industry only'] },
  { tag:'IMPROVEMENT', color:'#C0402A', title:'40+ unique industry watermarks', date:'March 2026',
    body:'Every industry group has a unique SVG watermark in the workspace.',
    items:['40+ unique illustrations — one per industry group','Opacity 0.038 — visible but never distracting'] },
  { tag:'IMPROVEMENT', color:'#2E844A', title:'Complete account isolation',     date:'March 2026',
    body:'A brewery never receives a law firm reference project. Every API call filters by industry.',
    items:['Profile-level industry setting drives all content','Zero cross-industry contamination at any level'] },
]

// ── Magnetic button hook ──────────────────────────────────────────────────────
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width  / 2)
    const y = e.clientY - (r.top  + r.height / 2)
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }, [strength])
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transform = 'translate(0,0)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)'
  }, [])
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.addEventListener('mousemove', onMove as any)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove as any); el.removeEventListener('mouseleave', onLeave) }
  }, [onMove, onLeave])
  return ref
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0; const dur = 1400; const t0 = performance.now()
      const step = (t: number) => {
        const p = Math.min((t - t0) / dur, 1)
        const ease = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(ease * target))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])
  return <div ref={ref} style={{ fontFamily: mono, fontSize: 22, fontWeight: 600, color: '#38BDF8', letterSpacing: -0.5 }}>{val}{suffix}</div>
}

// ── Aurora blob ───────────────────────────────────────────────────────────────
function AuroraHero() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Sensario photo — your photo, used as texture layer */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/sensario-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.07,
        mixBlendMode: 'luminosity',
      }}/>
      {/* Noise texture */}
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:.045,mixBlendMode:'overlay'}} aria-hidden>
        <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#noise)"/>
      </svg>
      {/* Aurora blobs */}
      <div style={{ position:'absolute', top:'-20%', left:'-10%', width:'70%', height:'80%', background:'radial-gradient(ellipse,rgba(1,118,211,0.28) 0%,transparent 65%)', animation:'aurora1 18s ease-in-out infinite', borderRadius:'50%', filter:'blur(40px)' }}/>
      <div style={{ position:'absolute', top:'10%', right:'-15%', width:'55%', height:'70%', background:'radial-gradient(ellipse,rgba(56,189,248,0.18) 0%,transparent 65%)', animation:'aurora2 22s ease-in-out infinite', borderRadius:'50%', filter:'blur(50px)' }}/>
      <div style={{ position:'absolute', bottom:'-10%', left:'20%', width:'60%', height:'60%', background:'radial-gradient(ellipse,rgba(99,102,241,0.15) 0%,transparent 65%)', animation:'aurora3 26s ease-in-out infinite', borderRadius:'50%', filter:'blur(45px)' }}/>
      <div style={{ position:'absolute', top:'40%', left:'40%', width:'40%', height:'50%', background:'radial-gradient(ellipse,rgba(14,165,233,0.12) 0%,transparent 65%)', animation:'aurora4 20s ease-in-out infinite', borderRadius:'50%', filter:'blur(60px)' }}/>
      <div style={{ position:'absolute', bottom:'0', right:'10%', width:'45%', height:'55%', background:'radial-gradient(ellipse,rgba(79,70,229,0.1) 0%,transparent 65%)', animation:'aurora5 24s ease-in-out infinite', borderRadius:'50%', filter:'blur(55px)' }}/>
      {/* Grid overlay */}
      <div style={{ position:'absolute',inset:0, backgroundImage:'linear-gradient(rgba(56,189,248,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.06) 1px,transparent 1px)', backgroundSize:'52px 52px' }}/>
      {/* Vignette */}
      <div style={{ position:'absolute',inset:0, background:'radial-gradient(ellipse 80% 80% at 50% 50%,transparent 40%,rgba(3,8,20,.7) 100%)' }}/>
    </div>
  )
}

// ── 3D VSM preview ────────────────────────────────────────────────────────────
function VSMPreview3D() {
  const steps = [
    { name:'Order Receipt', ct:'12s', va:'va',   defect:2,  ops:1 },
    { name:'Pick',          ct:'28s', va:'va',   defect:0,  ops:2 },
    { name:'Pack',          ct:'45s', va:'va',   defect:3,  ops:1 },
    { name:'Quality Check', ct:'18s', va:'nnva', defect:8,  ops:1, bottleneck:true },
    { name:'Dispatch',      ct:'22s', va:'va',   defect:0,  ops:2 },
  ]
  const vaColors = { va:'#22D3EE', nnva:'#F59E0B', nva:'#F87171' }

  return (
    <div style={{ perspective:'1100px', transformStyle:'preserve-3d' }}>
      <div style={{ transform:'rotateX(14deg) rotateY(-6deg)', transformStyle:'preserve-3d', animation:'float3d 8s ease-in-out infinite' }}>
        {/* Glass card */}
        <div style={{
          background:'rgba(255,255,255,0.04)',
          backdropFilter:'blur(24px)',
          WebkitBackdropFilter:'blur(24px)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:20,
          padding:'20px 18px 24px',
          boxShadow:'0 32px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08) inset, 0 1px 0 rgba(255,255,255,0.15) inset',
          position:'relative',
          overflow:'hidden',
        }}>
          {/* Inner light reflection */}
          <div style={{ position:'absolute',top:0,left:0,right:0,height:'50%',background:'linear-gradient(180deg,rgba(255,255,255,0.06) 0%,transparent 100%)',borderRadius:'20px 20px 0 0',pointerEvents:'none' }}/>

          {/* Header */}
          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:18 }}>
            <div style={{ display:'flex',gap:5 }}>
              {['#FF5F56','#FFBD2E','#27C93F'].map((c,i)=><div key={i} style={{ width:9,height:9,borderRadius:'50%',background:c }}/>)}
            </div>
            <span style={{ fontFamily:mono,fontSize:9,color:'rgba(255,255,255,0.3)',letterSpacing:1.5 }}>PROCESS MAP · LIVE</span>
            <div style={{ marginLeft:'auto',display:'flex',gap:4,alignItems:'center' }}>
              <div style={{ width:5,height:5,borderRadius:'50%',background:'#22D3EE',animation:'breathe 1.5s ease infinite' }}/>
              <span style={{ fontFamily:mono,fontSize:8,color:'#22D3EE' }}>ANALYZING</span>
            </div>
          </div>

          {/* KPI row */}
          <div style={{ display:'flex',gap:8,marginBottom:18 }}>
            {[['LEAD TIME','2m 05s','#22D3EE'],['PCE','68%','#4ADE80'],['DEFECTS','2.8%','#F59E0B'],['TARGET','MET ✓','#4ADE80']].map(([l,v,c])=>(
              <div key={l} style={{ flex:1,background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'8px 6px',textAlign:'center',border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily:mono,fontSize:7,color:'rgba(255,255,255,0.3)',letterSpacing:1,marginBottom:3 }}>{l}</div>
                <div style={{ fontFamily:mono,fontSize:12,fontWeight:700,color:c }}>{v}</div>
              </div>
            ))}
          </div>

          {/* VSM steps row */}
          <div style={{ display:'flex',alignItems:'center',gap:0,marginBottom:18,overflowX:'auto',scrollbarWidth:'none' }}>
            {/* Supplier */}
            <div style={{ width:32,height:28,borderRadius:4,background:'rgba(99,102,241,0.4)',border:'1px solid rgba(99,102,241,0.6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <span style={{ fontSize:8,color:'rgba(255,255,255,0.6)' }}>S</span>
            </div>
            {/* Arrow */}
            <div style={{ width:16,height:1,background:'rgba(255,255,255,0.15)',position:'relative',flexShrink:0 }}>
              <div style={{ position:'absolute',right:-4,top:-3,color:'rgba(255,255,255,0.3)',fontSize:8 }}>›</div>
            </div>

            {steps.map((step,i)=>(
              <div key={i} style={{ display:'flex',alignItems:'center',flexShrink:0 }}>
                <div style={{ position:'relative' }}>
                  {/* Step box */}
                  <div style={{
                    width:72,height:40,borderRadius:6,
                    background: step.bottleneck ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)',
                    border:`1px solid ${step.bottleneck ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: step.bottleneck ? '0 0 16px rgba(239,68,68,0.2)' : 'none',
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                    padding:'4px 3px',
                    transition:'all 0.3s',
                  }}>
                    <div style={{ fontFamily:mono,fontSize:7.5,color:'rgba(255,255,255,0.75)',fontWeight:600,textAlign:'center',lineHeight:1.2,marginBottom:3 }}>
                      {step.name}
                    </div>
                    <div style={{ fontFamily:mono,fontSize:7,color:'rgba(255,255,255,0.35)' }}>{step.ct}</div>
                  </div>
                  {/* VA bar */}
                  <div style={{ height:3,borderRadius:'0 0 4px 4px',background:vaColors[step.va as keyof typeof vaColors],marginTop:0 }}/>
                  {/* Bottleneck glow */}
                  {step.bottleneck && (
                    <div style={{ position:'absolute',top:-6,right:-6,width:14,height:14,borderRadius:'50%',background:'#F87171',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'white',animation:'pulseGlow 1.5s ease infinite' }}>!</div>
                  )}
                  {/* Data box */}
                  <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderTop:'none',borderRadius:'0 0 4px 4px',padding:'3px 4px',width:72 }}>
                    <div style={{ fontFamily:mono,fontSize:6.5,color:'rgba(255,255,255,0.25)' }}>
                      Ops:{step.ops} · D:{step.defect}%
                    </div>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width:20,height:1,background:'rgba(255,255,255,0.15)',flexShrink:0,position:'relative' }}>
                    <div style={{ position:'absolute',right:-4,top:-3,color:'rgba(255,255,255,0.3)',fontSize:8 }}>›</div>
                  </div>
                )}
              </div>
            ))}

            {/* Arrow + Customer */}
            <div style={{ width:16,height:1,background:'rgba(255,255,255,0.15)',position:'relative',flexShrink:0 }}>
              <div style={{ position:'absolute',right:-4,top:-3,color:'rgba(255,255,255,0.3)',fontSize:8 }}>›</div>
            </div>
            <div style={{ width:32,height:28,borderRadius:4,background:'rgba(99,102,241,0.4)',border:'1px solid rgba(99,102,241,0.6)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <span style={{ fontSize:8,color:'rgba(255,255,255,0.6)' }}>C</span>
            </div>
          </div>

          {/* Timeline sawtooth */}
          <div style={{ padding:'10px 0 4px',borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontFamily:mono,fontSize:7,color:'rgba(255,255,255,0.2)',letterSpacing:1.5,marginBottom:8 }}>TIMELINE · ISO 22468</div>
            <svg width="100%" height="28" viewBox="0 0 340 28">
              {/* CT bars */}
              {[
                {x:0,   w:20, h:16, color:'#22D3EE'},
                {x:24,  w:8,  h:6,  color:'rgba(255,255,255,0.1)'},
                {x:36,  w:32, h:18, color:'#22D3EE'},
                {x:72,  w:8,  h:6,  color:'rgba(255,255,255,0.1)'},
                {x:84,  w:52, h:20, color:'#22D3EE'},
                {x:140, w:8,  h:6,  color:'rgba(255,255,255,0.1)'},
                {x:152, w:22, h:14, color:'#F59E0B'},
                {x:178, w:8,  h:6,  color:'rgba(255,255,255,0.1)'},
                {x:190, w:26, h:16, color:'#22D3EE'},
              ].map((b,i)=>(
                <rect key={i} x={b.x} y={28-b.h} width={b.w} height={b.h} fill={b.color} rx="1" opacity="0.8"/>
              ))}
              {/* Takt line */}
              <line x1="0" y1="10" x2="340" y2="10" stroke="#F87171" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
              <text x="300" y="8" fontSize="6" fill="#F87171" opacity="0.6" fontFamily="monospace">TAKT</text>
            </svg>
          </div>

          {/* Supe bar */}
          <div style={{ marginTop:12,padding:'8px 10px',background:'rgba(34,211,238,0.08)',border:'1px solid rgba(34,211,238,0.15)',borderRadius:8,display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ display:'flex',gap:3 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:4,height:4,borderRadius:'50%',background:'#22D3EE',animation:`supeWave 1s ease ${i*0.2}s infinite` }}/>)}
            </div>
            <span style={{ fontFamily:mono,fontSize:9,color:'rgba(34,211,238,0.8)' }}>Supe — Quality Check is your bottleneck. Takt exceeded by 26%.</span>
          </div>
        </div>

        {/* Shadow card under */}
        <div style={{ position:'absolute',bottom:-16,left:'5%',right:'5%',height:'100%',background:'rgba(1,118,211,0.06)',borderRadius:20,border:'1px solid rgba(1,118,211,0.08)',zIndex:-1,filter:'blur(2px)',transform:'translateZ(-20px)' }}/>
      </div>
    </div>
  )
}

// ── Industry Terms section ────────────────────────────────────────────────────
function IndustryTerms() {
  const [active, setActive] = useState(TERM_KEYS[0])
  const timerRef = useRef<any>(null)
  useEffect(() => {
    timerRef.current = setInterval(() => setActive(k => { const i = TERM_KEYS.indexOf(k); return TERM_KEYS[(i+1)%TERM_KEYS.length] }), 3200)
    return () => clearInterval(timerRef.current)
  }, [])
  const rows = Object.entries(TERMS[active])
  return (
    <section style={{ background:'linear-gradient(180deg,#030812 0%,#060C1F 100%)', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', position:'relative', overflow:'hidden' }}>
      {/* Glass orb accent */}
      <div style={{ position:'absolute',top:'-20%',right:'-10%',width:'50%',height:'120%',background:'radial-gradient(ellipse,rgba(1,118,211,0.12) 0%,transparent 65%)',pointerEvents:'none',filter:'blur(30px)' }}/>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'start' }} >
          <div>
            <p style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(56,189,248,0.7)', marginBottom:16, textTransform:'uppercase' }}>Industry Language Engine</p>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,42px)', lineHeight:1.12, fontWeight:400, marginBottom:20, color:'#F1F5F9' }}>
              Your team shouldn't have to<br />
              <em style={{ fontStyle:'italic', color:'#38BDF8' }}>translate lean into their language.</em>
            </h2>
            <p style={{ fontSize:14, lineHeight:1.85, color:'rgba(248,247,245,0.45)', fontWeight:300, maxWidth:380 }}>
              A nurse doesn't have WIP. A brewer doesn't have takt time. A lawyer doesn't have a gemba walk. VeSiMy speaks the language of your field from day one — 69 industries, every term adapted.
            </p>
            <div style={{ marginTop:28, display:'flex', flexWrap:'wrap', gap:6 }}>
              {TERM_KEYS.map(k => (
                <button key={k} onClick={() => { setActive(k); clearInterval(timerRef.current); timerRef.current = setInterval(()=>setActive(kk=>{const i=TERM_KEYS.indexOf(kk);return TERM_KEYS[(i+1)%TERM_KEYS.length]}),3200)}}
                  style={{ fontFamily:mono, fontSize:8, letterSpacing:1.5, padding:'5px 10px', border:'1px solid', borderRadius:5, cursor:'pointer', transition:'all .15s',
                    borderColor: active===k ? '#38BDF8' : 'rgba(255,255,255,0.1)',
                    background: active===k ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.03)',
                    color: active===k ? '#38BDF8' : 'rgba(255,255,255,0.35)' }}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className="reveal d2" style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'28px 26px', boxShadow:'0 0 0 0.5px rgba(255,255,255,0.05) inset' }}>
            {rows.map(([lean, translated], i) => (
              <div key={lean} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom: i < rows.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap:8 }}>
                <span style={{ fontFamily:mono, fontSize:10, color:'rgba(255,255,255,0.25)', letterSpacing:1, textTransform:'uppercase', width:'38%', flexShrink:0 }}>{lean.replace(/_/g,' ')}</span>
                <span style={{ fontFamily:mono, fontSize:9, color:'rgba(56,189,248,0.5)', flexShrink:0 }}>&rarr;</span>
                <span style={{ fontSize:13, color:'#F1F5F9', fontWeight:500, textAlign:'right', flex:1 }}>{translated}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Supe AI section ───────────────────────────────────────────────────────────
function SupeSection() {
  const features = [
    'Bottleneck detection — flags steps where cycle time exceeds takt',
    'Root cause brainstorming — asks targeted questions before generating',
    'Future state generation — builds a data-backed improvement map',
    'Gap analysis — identifies every missing data point by step',
    'Lean knowledge base — 200+ chunks of TPS, VSM, Six Sigma source material',
    'Industry-aware — responses adapt to your sector terminology',
  ]
  return (
    <section style={{ padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', background:'#F8F6F0', position:'relative', overflow:'hidden' }}>
      <div className="supe-grid" style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'center' }}>
        <div className="reveal">
          <p style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(1,118,211,0.7)', marginBottom:16, textTransform:'uppercase' }}>Supe AI — Your lean mentor</p>
          <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,42px)', lineHeight:1.12, fontWeight:400, marginBottom:20, color:'#0D0C0A' }}>
            An AI that knows lean.<br />
            <em style={{ fontStyle:'italic', color:'#0176D3' }}>Not just language models.</em>
          </h2>
          <p style={{ fontSize:14, lineHeight:1.85, color:'#3A3835', fontWeight:300, maxWidth:420, marginBottom:28 }}>
            Supe is trained on TPS, VSM, Six Sigma, and ISO 22468 — not generic text. It asks questions before it answers. It generates future states from your actual data.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {features.map(f => (
              <div key={f} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#0176D3', flexShrink:0, marginTop:5 }}/>
                <span style={{ fontSize:13, color:'#3A3835', lineHeight:1.6 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Supe chat glass panel */}
        <div className="reveal d2" style={{ background:'linear-gradient(145deg,#030C1F,#060F2A)', borderRadius:20, padding:24, boxShadow:'0 32px 80px rgba(3,45,96,.25), 0 0 0 1px rgba(56,189,248,0.08)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:'40%',background:'linear-gradient(180deg,rgba(56,189,248,0.06) 0%,transparent 100%)',borderRadius:'20px 20px 0 0',pointerEvents:'none' }}/>
          <div style={{ display:'flex', flexDirection:'column', gap:10, position:'relative', zIndex:1 }}>
            <div style={{ padding:'12px 16px', borderRadius:'12px 12px 3px 12px', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(10px)', color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.7, alignSelf:'flex-end', maxWidth:'88%', border:'1px solid rgba(255,255,255,0.08)' }}>
              My assembly line is running at 68% PCE. Cycle time on Station 3 is over takt. Any ideas?
            </div>
            <div style={{ padding:'12px 16px', borderRadius:'12px 12px 12px 3px', background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.15)', backdropFilter:'blur(10px)', color:'rgba(248,247,245,0.8)', fontSize:13, lineHeight:1.7, maxWidth:'92%' }}>
              Before I give you recommendations — is Station 3 a single-operator step, or are there parallel operators? And is the cycle time 100% repeatable, or is there variance from setup changes? Root cause changes significantly depending on which.
            </div>
            <div style={{ padding:'12px 16px', borderRadius:'12px 12px 3px 12px', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(10px)', color:'rgba(255,255,255,0.65)', fontSize:13, lineHeight:1.7, alignSelf:'flex-end', maxWidth:'88%', border:'1px solid rgba(255,255,255,0.08)' }}>
              Single operator. High variance — setup changes every 3rd cycle.
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:16, padding:'10px 12px', background:'rgba(34,211,238,0.06)', borderRadius:10, border:'1px solid rgba(34,211,238,0.1)' }}>
            <div style={{ display:'flex', gap:4 }}>
              {[0,1,2,3,4].map(i=>(
                <div key={i} style={{ width:3, background:'#22D3EE', borderRadius:3, animation:`wave ${0.6 + i*0.1}s ease-in-out ${i*0.1}s infinite alternate`, opacity:0.7 }}
                  ref={el => { if (el) el.style.height = Math.random() > 0.5 ? '16px' : '8px' }}/>
              ))}
            </div>
            <span style={{ fontFamily:mono, fontSize:10, color:'rgba(34,211,238,0.7)' }}>Supe is analysing your SMED data…</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Reference projects section ────────────────────────────────────────────────
function ReferenceSection() {
  const REFS = [
    { ind:'AUTOMOTIVE',   name:'Automotive Seat Assembly',  detail:'CT 145s vs 120s Takt. Foam rack relocation eliminates 16s NVA per cycle.', tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN'] },
    { ind:'HOSPITAL / ED',name:'ED Patient Flow',           detail:'Door-to-discharge 3.2 hrs vs 2-hr target. Root: no escalation mechanism.',  tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN'] },
    { ind:'SOFTWARE DEV', name:'Feature Delivery Pipeline', detail:'14-day avg cycle. 35% PRs need 2+ review rounds. Reviewer is the constraint.', tools:['VSM','TIME STUDY','5 WHY','WASTE','KAIZEN'] },
    { ind:'CRAFT BREWERY',name:'Batch Production',          detail:'6 fermenters at 103% capacity. 4% off-flavour rate on adjunct batches.',    tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN'] },
    { ind:'LAW FIRM',     name:'Matter Lifecycle',          detail:'40% first draft revision rate. Partner review adds 2-day wait per matter.',  tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN'] },
    { ind:'OIL & GAS',   name:'Drilling Operations',        detail:'NPT 18% vs 8% benchmark. Stuck pipe 11% of NPT. PM protocol outdated.',     tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN'] },
  ]
  return (
    <section style={{ background:'linear-gradient(180deg,#F0EDE6 0%,#E8E4DC 100%)', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', borderTop:'0.5px solid #D8D5CE' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:48, gap:24, flexWrap:'wrap' }}>
          <div>
            <p style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(1,118,211,0.7)', marginBottom:16 }}>04 — Reference Projects</p>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,42px)', lineHeight:1.12, fontWeight:400, color:'#0D0C0A' }}>
              70 reference projects. Real bottlenecks.<br />
              <em style={{ color:'#0176D3', fontStyle:'italic' }}>Your industry's language. Day one.</em>
            </h2>
          </div>
          <Link href="/auth/signup" style={{ fontFamily:mono, fontSize:10, letterSpacing:1.5, color:'#0176D3', textDecoration:'none', border:'1px solid rgba(1,118,211,0.3)', padding:'8px 16px', borderRadius:6, whiteSpace:'nowrap', background:'rgba(1,118,211,0.04)' }}>
            Browse all &rarr;
          </Link>
        </div>
        <div className="reveal d1" style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:8, scrollbarWidth:'none' }}>
          {REFS.map((ref,ri) => (
            <div key={ref.ind} style={{
              minWidth:260, background:'rgba(255,255,255,0.7)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.9)',
              borderRadius:16, padding:'22px 20px', flex:'0 0 auto',
              boxShadow:'0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset',
              transition:'transform 0.3s ease, box-shadow 0.3s ease',
              cursor:'pointer',
            }}
            onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-6px)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 20px 48px rgba(1,118,211,0.12), 0 1px 0 rgba(255,255,255,0.9) inset'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(0)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.8) inset'}}
            >
              <span style={{ fontFamily:mono, fontSize:8, letterSpacing:2, color:'#0176D3', background:'rgba(1,118,211,0.08)', border:'1px solid rgba(1,118,211,0.15)', borderRadius:4, padding:'3px 7px', display:'inline-block', marginBottom:12 }}>{ref.ind}</span>
              <h3 style={{ fontSize:15, fontWeight:700, color:'#0D0C0A', marginBottom:8, lineHeight:1.3 }}>{ref.name}</h3>
              <p style={{ fontSize:12, color:'#6B6760', lineHeight:1.65, marginBottom:14 }}>{ref.detail}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {ref.tools.map(t => (
                  <span key={t} style={{ fontFamily:mono, fontSize:7.5, letterSpacing:.5, padding:'2px 7px', borderRadius:4, background:'rgba(1,118,211,0.07)', color:'#0176D3', border:'1px solid rgba(1,118,211,0.12)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Dual-row industry ticker ──────────────────────────────────────────────────
function DualTicker() {
  const row1 = ALL_INDUSTRIES.slice(0,  Math.ceil(ALL_INDUSTRIES.length/2))
  const row2 = ALL_INDUSTRIES.slice(Math.ceil(ALL_INDUSTRIES.length/2))
  return (
    <div style={{ background:'#060C1F', padding:'32px 0', overflow:'hidden', borderTop:'1px solid rgba(56,189,248,0.08)', borderBottom:'1px solid rgba(56,189,248,0.08)' }}>
      {/* Row 1 — left */}
      <div style={{ display:'flex', whiteSpace:'nowrap', marginBottom:12, animation:'tickerLeft 40s linear infinite' }}>
        {[...row1,...row1,...row1].map((ind,i) => (
          <span key={i} style={{ fontFamily:mono, fontSize:11, letterSpacing:1.5, color:'rgba(56,189,248,0.35)', marginRight:0, display:'inline-flex', alignItems:'center', gap:0 }}>
            <span style={{ padding:'0 20px' }}>{ind.toUpperCase()}</span>
            <span style={{ color:'rgba(56,189,248,0.15)' }}>·</span>
          </span>
        ))}
      </div>
      {/* Row 2 — right */}
      <div style={{ display:'flex', whiteSpace:'nowrap', animation:'tickerRight 50s linear infinite' }}>
        {[...row2,...row2,...row2].map((ind,i) => (
          <span key={i} style={{ fontFamily:mono, fontSize:11, letterSpacing:1.5, color:'rgba(99,102,241,0.3)', marginRight:0, display:'inline-flex', alignItems:'center' }}>
            <span style={{ color:'rgba(99,102,241,0.12)' }}>·</span>
            <span style={{ padding:'0 20px' }}>{ind.toUpperCase()}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── 3D Bento feature cards ────────────────────────────────────────────────────
function BentoFeatures() {
  const cards = [
    { icon:'vsm', title:'Value Stream Mapping', desc:'ISO 22468-compliant VSM with supplier→customer flow, WIP inventory triangles, supermarket pull symbols, and a sawtooth lead-time timeline.', span:2, accent:'#38BDF8' },
    { icon:'stopwatch', title:'Time Study', desc:'10+ observation stopwatch with outlier removal and statistically sound mean.', span:1, accent:'#818CF8' },
    { icon:'fishbone', title:'Fishbone Diagram', desc:'8P or 6M framework. Every cause links to the step it came from.', span:1, accent:'#34D399' },
    { icon:'fivewhy', title:'5 Why Analysis', desc:'System-level root cause. Drill through symptoms to the structural failure.', span:1, accent:'#F59E0B' },
    { icon:'zap', title:'Supe AI Mentor', desc:'Built on TPS, VSM, and Six Sigma source material. Asks before it answers. Generates future states from your actual data.', span:2, accent:'#22D3EE' },
    { icon:'waste', title:'Waste Identification', desc:'All 8 wastes. Select, annotate, and link to your kaizen backlog.', span:1, accent:'#F87171' },
    { icon:'kaizen', title:'Kaizen Events', desc:'Full event lifecycle: target, owner, actions, evidence, close-out.', span:1, accent:'#A78BFA' },
    { icon:'barchart', title:'PDCA & A3 Export', desc:'ISO-compliant PDCA, A3, 8D, DMAIC, OODA export formats.', span:1, accent:'#6EE7B7' },
  ]
  return (
    <section style={{ background:'linear-gradient(180deg,#030812 0%,#060C1F 100%)', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute',bottom:'-20%',left:'20%',width:'60%',height:'60%',background:'radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 65%)',pointerEvents:'none',filter:'blur(40px)' }}/>
      <div style={{ maxWidth:1060, margin:'0 auto', position:'relative', zIndex:1 }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
          <p style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(56,189,248,0.7)', marginBottom:16, textTransform:'uppercase' }}>03 — CI Tool Suite</p>
          <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,44px)', fontWeight:400, color:'#F1F5F9', lineHeight:1.12, marginBottom:14 }}>
            Every tool the methodology demands.<br />
            <em style={{ color:'#38BDF8', fontStyle:'italic' }}>Connected, not siloed.</em>
          </h2>
          <p style={{ fontSize:15, color:'rgba(248,247,245,0.4)', maxWidth:520, margin:'0 auto', lineHeight:1.8 }}>
            VSM, Time Study, Fishbone, 5 Why, Waste ID, Kaizen, PDCA — linked to the same step. Every finding, in one place.
          </p>
        </div>
        <div className="reveal d1" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {cards.map((card,i) => (
            <div key={card.title}
              style={{
                gridColumn: card.span === 2 ? 'span 2' : 'span 1',
                background:'rgba(255,255,255,0.03)',
                backdropFilter:'blur(20px)',
                WebkitBackdropFilter:'blur(20px)',
                border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:16,
                padding: card.span === 2 ? '28px 28px' : '22px 20px',
                position:'relative',
                overflow:'hidden',
                cursor:'default',
                transition:'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(-4px) rotateX(2deg)'
                el.style.boxShadow = `0 24px 48px rgba(0,0,0,0.3), 0 0 0 1px ${card.accent}30`
                el.style.borderColor = `${card.accent}30`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.transform = 'translateY(0) rotateX(0)'
                el.style.boxShadow = 'none'
                el.style.borderColor = 'rgba(255,255,255,0.07)'
              }}
            >
              {/* Top light */}
              <div style={{ position:'absolute',top:0,left:0,right:0,height:'40%',background:`linear-gradient(180deg,${card.accent}08 0%,transparent 100%)`,borderRadius:'16px 16px 0 0',pointerEvents:'none' }}/>
              {/* Accent corner dot */}
              <div style={{ position:'absolute',top:16,right:16,width:8,height:8,borderRadius:'50%',background:card.accent,opacity:0.6,boxShadow:`0 0 12px ${card.accent}` }}/>
              <div style={{ fontSize:28, marginBottom:14 }}>{card.icon}</div>
              <h3 style={{ fontSize: card.span===2 ? 18 : 15, fontWeight:700, color:'#F1F5F9', marginBottom:8, lineHeight:1.25 }}>{card.title}</h3>
              <p style={{ fontSize:13, color:'rgba(248,247,245,0.4)', lineHeight:1.7 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [eyeIdx, setEyeIdx] = useState(0)
  const [showPromo, setShowPromo] = useState(false)
  const [authedUser, setAuthedUser] = useState<{email?:string;name?:string}|null>(null)
  const scrollRef = useRef<number>(0)
  const heroRef = useRef<HTMLElement>(null)

  const eyeLines = [
    'Your defect rate has a root cause. Find it.',
    'Your lead time has waste in it. Map it.',
    'Your improvement needs proof. Track it.',
  ]

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setEyeIdx(i => (i+1) % eyeLines.length), 3400)
    try {
      const dismissed = localStorage.getItem('vesimy_spring25_dismissed')
      const expired = new Date() > new Date('2026-04-21T00:00:00')
      if (!dismissed && !expired) setShowPromo(true)
    } catch {}
    const supabase = createClient()
    supabase.auth.getUser().then(({data:{user}}) => {
      if (user) setAuthedUser({email:user.email, name:user.user_metadata?.full_name})
    })
    return () => clearInterval(t)
  }, [])

  // Scroll reveal
  useEffect(() => {
    if (!mounted) return
    const ro = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el))
    return () => ro.disconnect()
  }, [mounted])

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const hero = document.getElementById('hero-content')
      if (hero) hero.style.transform = `translateY(${y * 0.25}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function dismissPromo() { try { localStorage.setItem('vesimy_spring25_dismissed','1') } catch {} setShowPromo(false) }
  function copyPromoCode() { navigator.clipboard.writeText('SPRING25').catch(() => {}) }

  const magnetCTA = useMagnetic(0.3)
  const magnetSecondary = useMagnetic(0.2)

  return (
    <div style={{ background:'#030812', color:'#F1F5F9', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX:'hidden' }}>

      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes aurora1 { 0%,100%{transform:translate(0%,0%) scale(1)} 33%{transform:translate(5%,-8%) scale(1.08)} 66%{transform:translate(-4%,5%) scale(0.96)} }
        @keyframes aurora2 { 0%,100%{transform:translate(0%,0%) scale(1)} 33%{transform:translate(-6%,5%) scale(1.05)} 66%{transform:translate(3%,-6%) scale(0.98)} }
        @keyframes aurora3 { 0%,100%{transform:translate(0%,0%) scale(1)} 33%{transform:translate(4%,6%) scale(1.1)} 66%{transform:translate(-5%,-4%) scale(0.94)} }
        @keyframes aurora4 { 0%,100%{transform:translate(0%,0%) scale(1)} 50%{transform:translate(-8%,-10%) scale(1.15)} }
        @keyframes aurora5 { 0%,100%{transform:translate(0%,0%) scale(1)} 50%{transform:translate(6%,8%) scale(1.1)} }
        @keyframes float3d { 0%,100%{transform:rotateX(14deg) rotateY(-6deg) translateY(0)} 50%{transform:rotateX(12deg) rotateY(-4deg) translateY(-10px)} }
        @keyframes breathe { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 8px rgba(248,113,113,0.6)} 50%{box-shadow:0 0 20px rgba(248,113,113,0.9)} }
        @keyframes supeWave { 0%{height:4px;opacity:.4} 50%{height:14px;opacity:1} 100%{height:4px;opacity:.4} }
        @keyframes tickerLeft { 0%{transform:translateX(0)} 100%{transform:translateX(-33.333%)} }
        @keyframes tickerRight { 0%{transform:translateX(-33.333%)} 100%{transform:translateX(0)} }
        @keyframes eyeSlide { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wave { from{height:6px} to{height:18px} }
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes countUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .reveal { opacity:0; transform:translateY(28px); transition:opacity .75s ease, transform .75s ease; }
        .reveal.in { opacity:1; transform:translateY(0); }
        .d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s}
        .nav-link { color:rgba(241,245,249,.45); text-decoration:none; font-size:13px; transition:color .15s; }
        .nav-link:hover { color:#F1F5F9; }
        .how-step { background:rgba(255,255,255,0.03); padding:32px 26px; border-right:1px solid rgba(56,189,248,0.08); transition:background .2s,border-color .2s; }
        .how-step:last-child { border-right:none; }
        .how-step:hover { background:rgba(255,255,255,0.06); border-right-color:rgba(56,189,248,0.15); }
        .hide-mobile { display:flex; }
        @media(max-width:900px){
          .hero-grid,.supe-grid,.terms-grid { grid-template-columns:1fr!important; }
          .hero-right { display:none!important; }
          .how-steps { grid-template-columns:1fr 1fr!important; }
          .pricing-grid { grid-template-columns:1fr!important; max-width:380px!important; margin:0 auto!important; }
          nav { padding:0 20px!important; }
          .hide-mobile { display:none!important; }
        }
        @media(max-width:600px){ .how-steps { grid-template-columns:1fr!important; } }
      `}</style>

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{ position:'sticky', top:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:60, background:'rgba(3,8,20,0.85)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ animation:'logoFloat 4s ease-in-out infinite' }}>
            <VLogoMark size={30} />
          </div>
          <VeSiMyWordmark size={18} onDark />
        </Link>
        <div className="hide-mobile" style={{ gap:28 }}>
          {[['How it works','#how'],['Industries','#industries'],['Pricing','#pricing'],['Learn','/learn'],['Blog','/blog']].map(([l,h]) => (
            <a key={l} href={h} className="nav-link">{l}</a>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {authedUser ? (
            <>
              <span style={{ fontFamily:mono, fontSize:11, color:'rgba(255,255,255,0.35)', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{authedUser.name || authedUser.email}</span>
              <Link href="/dashboard" style={{ padding:'7px 18px', background:'linear-gradient(135deg,#0a5eaa,#0176D3)', border:'none', borderRadius:8, fontSize:13, fontWeight:700, color:'white', textDecoration:'none' }}>
                Dashboard &rarr;
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{ padding:'7px 16px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, fontSize:13, color:'rgba(241,245,249,0.5)', textDecoration:'none', transition:'border-color .15s' }}>
                Sign in
              </Link>
              <Link href="/auth/signup" style={{ padding:'7px 18px', background:'linear-gradient(135deg,#0a5eaa,#0176D3)', border:'none', borderRadius:8, fontSize:13, fontWeight:700, color:'white', textDecoration:'none', boxShadow:'0 4px 14px rgba(1,118,211,0.35)' }}>
                Start free &rarr;
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ minHeight:'100vh', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px) clamp(60px,8vh,80px)', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden', background:'#030812' }}>
        <AuroraHero />
        <div id="hero-content" style={{ maxWidth:1160, margin:'0 auto', width:'100%', position:'relative', zIndex:1 }}>
          <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }}>
            {/* Left */}
            <div className="reveal">
              <div style={{ marginBottom:24, height:18, overflow:'hidden' }}>
                <span key={mounted ? eyeIdx : 0} suppressHydrationWarning style={{ fontFamily:mono, fontSize:9, color:'rgba(56,189,248,0.7)', letterSpacing:2, textTransform:'uppercase', fontWeight:700, animation:'eyeSlide .4s ease both', display:'block' }}>
                  {mounted ? eyeLines[eyeIdx] : eyeLines[0]}
                </span>
              </div>
              <h1 style={{ fontFamily:serif, fontSize:'clamp(42px,5.5vw,74px)', lineHeight:1.04, color:'#F1F5F9', marginBottom:20, fontWeight:400, letterSpacing:-.5 }}>
                Your bottleneck has a name.<br />
                Your reject rate has a cause.<br />
                <span style={{ fontStyle:'italic', color:'#38BDF8' }}>Now you can prove both.</span>
              </h1>
              <p style={{ fontSize:16, lineHeight:1.85, color:'rgba(241,245,249,.5)', marginBottom:40, fontWeight:300, maxWidth:460 }}>
                Every operations team knows where the waste is. The problem is turning that gut feeling into a number, a root cause, and a fix that sticks.{' '}
                <strong style={{ color:'rgba(241,245,249,.8)', fontWeight:500 }}>VeSiMy maps your process, finds what's holding it back, and tracks the improvement until the target is hit.</strong>
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap', marginBottom:48 }}>
                <Link ref={magnetCTA as any} href="/auth/signup" style={{
                  background:'linear-gradient(135deg,#0a5eaa,#0176D3)',
                  color:'white', padding:'15px 32px', borderRadius:10, fontSize:15, fontWeight:700,
                  textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8,
                  boxShadow:'0 4px 24px rgba(1,118,211,0.4), 0 0 0 1px rgba(1,118,211,0.5)',
                  transition:'box-shadow 0.3s ease',
                }}>
                  Start mapping <ArrowRightIcon size={14} color="white" />
                </Link>
                <Link ref={magnetSecondary as any} href="#how" style={{
                  color:'rgba(241,245,249,.45)', fontSize:14, textDecoration:'none',
                  display:'inline-flex', alignItems:'center', gap:5, fontWeight:500,
                  transition:'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color='#F1F5F9')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(241,245,249,.45)')}>
                  See how it works ↓
                </Link>
              </div>
              {/* Animated stats */}
              <div className="reveal d2" style={{ display:'flex', gap:32, paddingTop:24, borderTop:'1px solid rgba(56,189,248,0.1)', flexWrap:'wrap' }}>
                {[['68','Industries'],['11+','CI Tools'],['70','Ref Projects'],['$0','14-Day Trial']].map(([v,l]) => (
                  <div key={l}>
                    <Counter target={parseInt(v) || 0} suffix={v.includes('+') ? '+' : ''} />
                    <div style={{ fontFamily:mono, fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:.5, marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 3D VSM */}
            <div className="hero-right reveal d2">
              <VSMPreview3D />
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:0.3 }}>
          <div style={{ width:1, height:48, background:'linear-gradient(180deg,transparent,rgba(56,189,248,0.6))', animation:'breathe 2s ease infinite' }}/>
          <span style={{ fontFamily:mono, fontSize:8, letterSpacing:2, color:'rgba(56,189,248,0.6)' }}>SCROLL</span>
        </div>
      </section>

      {/* ── DUAL TICKER ──────────────────────────────────────────────────── */}
      <DualTicker />

      {/* ── PAIN SECTION — doctor framing ─────────────────────────────────── */}
      <section style={{ padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', background:'#F8F6F0' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>

          {/* Opening diagnosis */}
          <div className="reveal" style={{ textAlign:'center', marginBottom:64 }}>
            <span style={{ fontFamily:mono, fontSize:10, letterSpacing:2, color:'#6B6760', opacity:.5, display:'block', marginBottom:16 }}>THE PROBLEM</span>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(28px,3.5vw,50px)', lineHeight:1.1, fontWeight:400, color:'#0D0C0A', maxWidth:780, margin:'0 auto 20px' }}>
              You already know what's wrong.<br />
              <em style={{ fontStyle:'italic', color:'#0176D3' }}>You just can't prove it yet.</em>
            </h2>
            <p style={{ fontSize:16, lineHeight:1.85, color:'#3A3835', fontWeight:300, maxWidth:560, margin:'0 auto' }}>
              The bottleneck is obvious to anyone who walks the floor. The root cause is debated in every meeting. The improvement gets started, loses momentum, and the problem comes back. Not because your team isn't capable — because there's no system connecting the problem to the proof.
            </p>
          </div>

          {/* Symptom cards */}
          <div className="reveal d1" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:64 }}>
            {[
              {
                symptom: 'Your reject rate is climbing',
                detail: "You have a theory. Your team has three different theories. Without a structured root cause analysis linked to real process data, you're solving symptoms, not causes.",
                fix: 'Fishbone + 5 Why linked to your actual process step',
                color: '#C0402A',
              },
              {
                symptom: 'Your cycle time keeps drifting',
                detail: 'The standard says 90 seconds. The floor runs at 145. The gap is obvious but the cause — setup waste, motion, wait time — has never been measured properly.',
                fix: 'Time study with outlier removal + takt comparison',
                color: '#F4A623',
              },
              {
                symptom: "Improvements don't stick",
                detail: 'The kaizen event ran, the post-its went up, and three months later the problem is back. No one owns it. No one measured the before. No one recorded the after.',
                fix: 'Kaizen tracker with owners, targets, and close-out evidence',
                color: '#0176D3',
              },
              {
                symptom: 'Lead time nobody can explain',
                detail: 'The order takes 4 days. Active work takes 40 minutes. The other 23 hours 20 minutes are queue, wait, and batch — invisible until you map them.',
                fix: 'Value stream map showing every second of wait and work',
                color: '#8C44CC',
              },
              {
                symptom: 'Every team uses different language',
                detail: "A nurse doesn't have WIP. A brewer doesn't have takt time. A lawyer doesn't have a gemba. Generic tools speak factory — your team doesn't.",
                fix: 'Industry language engine — 69 industries, native terminology',
                color: '#2E844A',
              },
              {
                symptom: 'Management wants proof, not opinions',
                detail: "You know the fix. Getting the budget approved means showing before and after in a format that speaks to leadership. That report doesn't write itself.",
                fix: 'ISO-compliant PDCA, A3, and 8D exports in one click',
                color: '#38BDF8',
              },
            ].map((card) => (
              <div key={card.symptom} style={{
                background:'white', border:'1px solid rgba(1,118,211,.1)', borderRadius:14,
                padding:'24px 22px', borderTop:`3px solid ${card.color}`,
                boxShadow:'0 2px 12px rgba(0,0,0,.05)',
                transition:'transform .2s ease, box-shadow .2s ease',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 12px 28px rgba(0,0,0,.1)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='';(e.currentTarget as HTMLDivElement).style.boxShadow='0 2px 12px rgba(0,0,0,.05)'}}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0D0C0A', marginBottom:12, lineHeight:1.3 }}>{card.symptom}</h3>
                <p style={{ fontSize:13, color:'#6B6760', lineHeight:1.75, marginBottom:16 }}>{card.detail}</p>
                <div style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'10px 12px', background:`${card.color}08`, borderRadius:8, border:`1px solid ${card.color}18` }}>
                  <div style={{ width:4, height:4, borderRadius:'50%', background:card.color, flexShrink:0, marginTop:5 }}/>
                  <span style={{ fontSize:12, color:card.color, fontWeight:600, lineHeight:1.5 }}>{card.fix}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Transition line */}
          <div className="reveal" style={{ textAlign:'center' }}>
            <p style={{ fontFamily:mono, fontSize:10, letterSpacing:2.5, color:'rgba(1,118,211,.6)', textTransform:'uppercase', marginBottom:12 }}>The same system that found the problem tracks the fix</p>
            <h3 style={{ fontFamily:serif, fontSize:'clamp(22px,2.5vw,34px)', fontWeight:400, color:'#0D0C0A' }}>
              Every tool linked to the same step.<br />
              <em style={{ fontStyle:'italic', color:'#0176D3' }}>Every finding in one place.</em>
            </h3>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" style={{ background:'linear-gradient(180deg,#060C1F 0%,#030812 100%)', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:56 }}>
            <p style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(56,189,248,0.7)', marginBottom:16 }}>02 — How it works</p>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,44px)', lineHeight:1.12, fontWeight:400, color:'#F1F5F9' }}>
              From symptom to fixed — and proven.<br />Four steps.
            </h2>
          </div>
          <div className="how-steps reveal d1" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:'rgba(255,255,255,0.02)', gap:1, borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' }}>
            {[
              { n:'01', title:'Map the value stream', icon:'M3 12h18M3 6h18M3 18h10', body:'Add every step. Enter cycle times, WIP, operators, defect rates. The VSM builds in real time.' },
              { n:'02', title:'Time every operation',  icon:'M12 3a9 9 0 100 18A9 9 0 0012 3zM12 7v5l3 3', body:'Built-in stopwatch. 10+ observations. Statistically sound mean. Supe shows you the gap.' },
              { n:'03', title:'Find the root cause',   icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', body:'Fishbone maps every cause. 5 Why drills to the system failure. Every analysis links to the step.' },
              { n:'04', title:'Prove what changed',    icon:'M9 12l2 2 4-4M12 3a9 9 0 100 18A9 9 0 0012 3z', body:'Log kaizen events. Record results. Export ISO-compliant PDCA, A3, 8D — audit ready.' },
            ].map((step,i) => (
              <div key={step.n} className={`how-step reveal d${i}`} style={{ padding:'32px 26px' }}>
                <span style={{ fontFamily:mono, fontSize:10, color:'rgba(56,189,248,0.4)', letterSpacing:1, marginBottom:28, display:'block' }}>{step.n} ─────</span>
                <div style={{ width:42,height:42,border:'1.5px solid rgba(56,189,248,0.2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18,background:'rgba(56,189,248,0.04)',transition:'border-color .2s' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={step.icon}/>
                  </svg>
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:'#F1F5F9', marginBottom:10, lineHeight:1.3 }}>{step.title}</div>
                <div style={{ fontSize:13, lineHeight:1.75, color:'rgba(241,245,249,0.4)' }}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY TERMS ───────────────────────────────────────────────── */}
      <section id="industries"><IndustryTerms /></section>

      {/* ── SUPE AI ──────────────────────────────────────────────────────── */}
      <SupeSection />

      {/* ── BENTO FEATURES ───────────────────────────────────────────────── */}
      <BentoFeatures />

      {/* ── REFERENCE PROJECTS ───────────────────────────────────────────── */}
      <ReferenceSection />

      {/* ── WHAT'S NEW ────────────────────────────────────────────────────── */}
      <section style={{ background:'#F8F6F0', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', borderTop:'0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div className="reveal" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24, marginBottom:48, flexWrap:'wrap' }}>
            <div>
              <div style={{ display:'inline-block', fontFamily:mono, fontSize:9, color:'rgba(1,118,211,.8)', letterSpacing:2.5, marginBottom:14, fontWeight:700, padding:'4px 12px', background:'rgba(1,118,211,.07)', border:'1px solid rgba(1,118,211,.15)', borderRadius:4 }}>What's new — Version 3.1</div>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(22px,3vw,38px)', fontWeight:400, color:'#1E1B17', lineHeight:1.15, marginBottom:14 }}>Built for your industry.<br />Not adapted for it.</h2>
            </div>
            <Link href="/changelog" style={{ fontSize:12, color:'#0176D3', fontWeight:600, textDecoration:'none', flexShrink:0, marginTop:8 }}>Full changelog &rarr;</Link>
          </div>
          <div className="reveal d1" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap:20 }}>
            {CHANGELOG.map(item => (
              <div key={item.title} style={{ background:'rgba(255,255,255,0.7)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.9)', borderRadius:16, padding:'22px 22px 20px', display:'flex', flexDirection:'column', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', transition:'transform 0.25s ease, box-shadow 0.25s ease' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 16px 40px rgba(1,118,211,0.1)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform='translateY(0)';(e.currentTarget as HTMLDivElement).style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'}}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontFamily:mono, fontSize:8, fontWeight:700, letterSpacing:2, color:item.color, background:`${item.color}16`, border:`1px solid ${item.color}30`, borderRadius:4, padding:'3px 8px' }}>{item.tag}</span>
                  <span style={{ fontFamily:mono, fontSize:9, color:'#8E8A82' }}>{item.date}</span>
                </div>
                <h3 style={{ fontSize:15, fontWeight:700, color:'#1E1B17', marginBottom:10, lineHeight:1.3 }}>{item.title}</h3>
                <p style={{ fontSize:12.5, color:'#6B6760', lineHeight:1.75, marginBottom:14 }}>{item.body}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:'auto' }}>
                  {item.items.map(pt => (
                    <div key={pt} style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', background:item.color, flexShrink:0, marginTop:5, opacity:.7 }}/>
                      <span style={{ fontSize:11.5, color:'#514F4D', lineHeight:1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────────────────── */}
      <div style={{ padding:'clamp(64px,7vw,90px) clamp(16px,4vw,48px)', textAlign:'center', background:'linear-gradient(180deg,#060C1F 0%,#030812 100%)', position:'relative', overflow:'hidden', borderTop:'1px solid rgba(56,189,248,0.08)' }}>
        <div style={{ position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)', fontFamily:serif, fontSize:220, color:'rgba(56,189,248,0.04)', lineHeight:1, pointerEvents:'none', userSelect:'none' as any }}>"</div>
        <div className="reveal" style={{ maxWidth:680, margin:'0 auto', position:'relative', zIndex:1 }}>
          <p style={{ fontFamily:serif, fontSize:'clamp(18px,2.5vw,26px)', lineHeight:1.5, color:'rgba(241,245,249,0.75)', fontStyle:'italic', marginBottom:24, fontWeight:400 }}>
            "The ability to add individual steps per operator with times is exactly what we needed. The VA/NVA designator per step and the Yamazumi chart — that's the workflow we've been looking for."
          </p>
          <p style={{ fontFamily:mono, fontSize:10, letterSpacing:1.5, color:'rgba(56,189,248,0.4)' }}>CI PRACTITIONER · LEAN MANUFACTURING · FOUNDING MEMBER</p>
        </div>
      </div>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', background:'linear-gradient(180deg,#F0EDE6 0%,#E8E4DC 100%)', borderTop:'0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:52 }}>
            <span style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(1,118,211,.8)', display:'block', marginBottom:16 }}>Pricing</span>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,42px)', fontWeight:400, color:'#0D0C0A', marginBottom:12 }}>
              Every CI tool, no paywall.<br />Upgrade for AI and advanced exports.
            </h2>
            <p style={{ fontSize:15, color:'#3A3835' }}>No feature gates on the core methodology. VSM, Fishbone, 5 Why, Kaizen, PDCA — available from day one.</p>
          </div>
          <div className="pricing-grid reveal d1" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
            {(Object.entries(PLANS) as any[]).filter(([k])=>k!=='trial').map(([key, plan]) => {
              const isPro = key === 'pro'; const isLife = key === 'lifetime'; const isEnt = key === 'enterprise'
              return (
                <div key={key} style={{ background:isPro||isLife ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)', backdropFilter:'blur(12px)', border:`1px solid ${isPro||isLife ? 'rgba(1,118,211,0.4)' : 'rgba(255,255,255,0.9)'}`, borderRadius:16, padding:'28px 24px', position:'relative', boxShadow: isPro||isLife ? '0 0 0 3px rgba(1,118,211,0.1), 0 8px 32px rgba(1,118,211,0.1)' : '0 4px 20px rgba(0,0,0,0.06)', transition:'transform 0.2s ease' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.transform='translateY(-4px)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.transform='translateY(0)'}>
                  {(isPro||isLife) && <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#0a5eaa,#0176D3)', color:'white', fontFamily:mono, fontSize:8, letterSpacing:2, padding:'3px 14px', borderRadius:100, whiteSpace:'nowrap', boxShadow:'0 4px 12px rgba(1,118,211,0.4)' }}>{isLife?'BEST VALUE':'MOST POPULAR'}</div>}
                  <span style={{ fontFamily:mono, fontSize:9, letterSpacing:2, color:'#6B6760', marginBottom:14, display:'block' }}>{plan.name}</span>
                  <div style={{ fontFamily:serif, fontSize:44, color:'#0D0C0A', lineHeight:1, marginBottom:4 }}>
                    {isEnt?'Custom':plan.price===0?'$0':`$${plan.price}`}
                    {!isEnt&&plan.price!==null&&Number(plan.price)>0&&<span style={{ fontSize:14, color:'#6B6760', fontWeight:400 }}>{isLife?' once':'/mo'}</span>}
                  </div>
                  <p style={{ fontSize:13, color:'#6B6760', marginBottom:22, lineHeight:1.6, borderBottom:'1px solid rgba(1,118,211,.12)', paddingBottom:18 }}>{plan.description}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:24 }}>
                    {plan.features.map((f: string) => (
                      <div key={f} style={{ display:'flex', gap:9, fontSize:13, color:'#3A3835', alignItems:'flex-start' }}>
                        <CheckIcon size={13} color="#0176D3" style={{ marginTop:3, flexShrink:0 }} /> {f}
                      </div>
                    ))}
                  </div>
                  <Link href={isEnt?'/enterprise':plan.price===0?'/auth/signup':`/auth/signup?plan=${key}`}
                    style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'11px 20px', borderRadius:9, fontWeight:700, fontSize:14, textDecoration:'none',
                      background:isPro||isLife?'linear-gradient(135deg,#0a5eaa,#0176D3)':'rgba(1,118,211,0.08)',
                      color:isPro||isLife?'white':'#0176D3',
                      border:isPro||isLife?'none':'1px solid rgba(1,118,211,0.2)',
                      boxShadow:isPro||isLife?'0 4px 14px rgba(1,118,211,0.3)':'none' }}>
                    {plan.cta}
                  </Link>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign:'center', marginTop:20 }}>
            <Link href="/pricing" style={{ fontSize:13, color:'#8E8A82', textDecoration:'none', borderBottom:'1px solid #D8D5CE', paddingBottom:2 }}>View full pricing details &rarr;</Link>
          </div>
        </div>
      </section>

      {/* ── SPRING25 PROMO ───────────────────────────────────────────────── */}
      {showPromo && (
        <div style={{ padding:'0 clamp(16px,4vw,48px)', background:'#E8E4DC' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 0' }}>
            <div style={{ background:'rgba(196,155,46,0.1)', border:'1px solid rgba(196,155,46,0.3)', borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:14, flexWrap:'wrap', backdropFilter:'blur(10px)' }}>
              <span style={{ fontSize:20 }}>🌱</span>
              <div style={{ flex:1, minWidth:200 }}>
                <strong style={{ color:'#1E1B17' }}>Spring CI Sprint</strong>
                <span style={{ color:'#6B6760', fontSize:14 }}> — 20% off your first payment. Use code </span>
                <code style={{ background:'rgba(196,155,46,0.15)', padding:'2px 8px', borderRadius:4, fontWeight:700, color:'#B8860B' }}>SPRING25</code>
                <span style={{ color:'#9B9690', fontSize:13 }}> · Expires Easter Sunday, 20 April 2026</span>
              </div>
              <button onClick={copyPromoCode} style={{ padding:'7px 14px', borderRadius:8, border:'1px solid rgba(196,155,46,0.3)', background:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:13, color:'#6B6760', fontWeight:600, backdropFilter:'blur(8px)' }}>Copy code</button>
              <button onClick={dismissPromo} style={{ background:'none', border:'none', cursor:'pointer', color:'#9B9690', fontSize:22, lineHeight:1, padding:'0 4px' }}>×</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding:'clamp(100px,12vh,140px) clamp(16px,4vw,48px)', textAlign:'center', background:'#030812', position:'relative', overflow:'hidden' }}>
        <AuroraHero />
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 className="reveal" style={{ fontFamily:serif, fontSize:'clamp(36px,5vw,72px)', lineHeight:1.06, marginBottom:20, fontWeight:400, color:'#F1F5F9' }}>
            Your process has a bottleneck.<br />
            It has a name.<br />
            <em style={{ fontStyle:'italic', color:'#38BDF8' }}>Now you can find it.</em>
          </h2>
          <p className="reveal d1" style={{ fontSize:16, color:'rgba(241,245,249,.35)', marginBottom:52, fontWeight:300 }}>
            Free to start. No credit card. No manufacturing jargon if you're not in manufacturing.
          </p>
          <div className="reveal d2" style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/signup" style={{ padding:'16px 42px', background:'linear-gradient(135deg,#0a5eaa,#0176D3)', color:'white', border:'none', borderRadius:12, fontSize:17, fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, boxShadow:'0 4px 24px rgba(1,118,211,0.45), 0 0 0 1px rgba(1,118,211,0.5)' }}>
              Create your account <ArrowRightIcon size={16} color="white" />
            </Link>
            <Link href="/auth/signup?ref=1" style={{ padding:'16px 28px', background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', color:'rgba(255,255,255,.5)', border:'1px solid rgba(255,255,255,.12)', borderRadius:12, fontSize:15, textDecoration:'none' }}>
              Explore a sample project &rarr;
            </Link>
          </div>
          <p style={{ fontFamily:mono, fontSize:11, color:'rgba(255,255,255,.15)', marginTop:24 }}>ISO 9001:2015 · ISO 22468:2020 · IATF 16949 aligned</p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.06)', padding:'clamp(20px,3vw,28px) clamp(16px,4vw,48px)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, background:'rgba(3,8,20,0.98)', backdropFilter:'blur(20px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <VLogoMark size={26} />
          <VeSiMyWordmark size={15} onDark />
        </div>
        <div style={{ display:'flex', gap:20, fontSize:12, color:'rgba(241,245,249,.35)', flexWrap:'wrap' }}>
          {[['About','/about'],['Blog','/blog'],['Changelog','/changelog'],['Pricing','/pricing'],['Learn','/learn'],['Privacy','/privacy'],['Terms','/terms'],['Contact','mailto:founder@vesimy.com']].map(([l,h]) => (
            <Link key={l} href={h} style={{ color:'inherit', textDecoration:'none', transition:'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color='#38BDF8')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(241,245,249,.35)')}>
              {l}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily:mono, fontSize:11, color:'rgba(241,245,249,.15)', letterSpacing:1.5 }}>© 2026 VeSiMy</span>
      </footer>

    </div>
  )
}
