// @ts-nocheck
'use client'
// ── app/page.tsx — VeSiMy Homepage (v3.1 merged) ──────────────────────────────
// Philosophy: target achievement through process improvement.
// CI tool interactive previews removed. Mission-first structure.

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { VLogoMark, VeSiMyWordmark } from '@/components/ui/Logo'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = '"DM Serif Display",Palatino Linotype,Georgia,serif'
const mono  = '"IBM Plex Mono",ui-monospace,monospace'

// ── Industry terminology data ─────────────────────────────────────────────────
const TERMS: Record<string, Record<string, string>> = {
  'CRAFT BREWERY':  { product:'Batch',            ct:'Brew Day Duration',    defect:'Off-flavour / Failed QC', gemba:'Brew floor / Cellar',   kaizen:'Brewery improvement',       bottleneck:'Constraint batch' },
  'HOSPITAL / ED':  { product:'Patient',           ct:'Length of Stay',       defect:'Adverse Event',           gemba:'Care Floor / Ward',     kaizen:'Care improvement',          bottleneck:'Capacity constraint' },
  'LAW FIRM':       { product:'Completed matter',  ct:'Phase duration',       defect:'Draft revision',          gemba:'Client site',           kaizen:'Practice improvement',      bottleneck:'Partner queue' },
  'SOFTWARE DEV':   { product:'Shipped feature',   ct:'Cycle time (days)',    defect:'Bug / PR rework',         gemba:'Dev floor / Studio',    kaizen:'Dev improvement sprint',    bottleneck:'Code review queue' },
  'OIL & GAS':      { product:'Well completion',   ct:'Drilling phase time',  defect:'NPT event',               gemba:'Drill floor / Rig',     kaizen:'Drilling improvement',      bottleneck:'NPT constraint' },
  'POLICE':         { product:'Resolved case',     ct:'Investigation phase',  defect:'File rejection',          gemba:'Investigation office',  kaizen:'Investigation improvement', bottleneck:'Case file constraint' },
  'REAL ESTATE':    { product:'Closed transaction',ct:'Transaction phase',    defect:'File kickback',           gemba:'Client / field',        kaizen:'Process improvement',       bottleneck:'Approval queue' },
  'FILM & TV':      { product:'Deliverable master',ct:'Stage duration',       defect:'Overrun / Retake',        gemba:'Set / Location',        kaizen:'Production improvement',    bottleneck:'Principal photography' },
  'AQUACULTURE':    { product:'Harvested seafood', ct:'Stage duration',       defect:'Mortality event',         gemba:'Pen / Cage site',       kaizen:'Production improvement',    bottleneck:'Grow-out constraint' },
  'RESTAURANT':     { product:'Cover served',      ct:'Kitchen cycle time',   defect:'Wrong order / Return',    gemba:'Kitchen / FOH',         kaizen:'Service improvement',       bottleneck:'Kitchen constraint' },
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

const REFS = [
  { ind:'AUTOMOTIVE',   name:'Automotive Seat Assembly',  detail:'CT 145s vs 120s Takt. Foam rack relocation eliminates 16s NVA per cycle. All tools fully populated.',  tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN','PDCA','SMED','YAMAZUMI'] },
  { ind:'HOSPITAL / ED',name:'ED Patient Flow',           detail:'Door-to-discharge 3.2 hrs vs 2-hr target. Root: no CI data structure — no escalation mechanism.',      tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN','PDCA'] },
  { ind:'SOFTWARE DEV', name:'Feature Delivery Pipeline', detail:'14-day avg cycle. 35% PRs need 2+ review rounds. Reviewer capacity is the constraint.',                tools:['VSM','TIME STUDY','5 WHY','WASTE','KAIZEN','PDCA'] },
  { ind:'CRAFT BREWERY',name:'Batch Production',          detail:'6 fermenters at 103% capacity. 4% off-flavour rate. 3% stuck sparge on adjunct batches.',              tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN','SMED'] },
  { ind:'LAW FIRM',     name:'Matter Lifecycle',          detail:'40% first draft revision rate. Partner review queue adds 2-day wait per matter.',                      tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN','PDCA'] },
  { ind:'OIL & GAS',   name:'Drilling Operations',        detail:'NPT 18% vs 8% benchmark. Stuck pipe 11% of total NPT. Root: PM protocol not updated since 2019.',     tools:['VSM','TIME STUDY','FISHBONE','5 WHY','WASTE','KAIZEN','PDCA'] },
  { ind:'WAREHOUSE',   name:'Fulfilment Operations',      detail:'96.8% pick accuracy vs 99.5% SLA. Top-50 SKU re-slot and zone redesign is the fix.',                  tools:['VSM','TIME STUDY','5 WHY','WASTE','KAIZEN','PDCA'] },
  { ind:'PHARMACY',    name:'Retail Dispensing',          detail:'45-min peak wait. Single pharmacist covering 180 Rxs/day — demand-matched scheduling needed.',         tools:['VSM','TIME STUDY','FISHBONE','5 WHY','KAIZEN','PDCA'] },
]

const CHANGELOG = [
  { tag:'NEW',         color:'#0176D3', title:'V2 Process Builder',            date:'March 2026',
    body:'Upload a Standard Operating Procedure and VeSiMy parses it into a live value stream map automatically. Every step enriched with cycle time, operators, defect rates — then analysed by AI in one click.',
    items:['SOP upload → auto-parsed step map in seconds','AI analysis: bottleneck detection, PCE scoring, gap findings','Future State panel: AI generates a recommended improvement map','Integrated journal — every insight and action in one place'] },
  { tag:'MAJOR',       color:'#0176D3', title:'62-industry reference projects', date:'March 2026',
    body:'Every industry has a fully built reference project — populated with real bottleneck data, root causes drilled to system failure, kaizen events, and PDCA cycles. Your industry only — no cross-industry contamination.',
    items:['All CI tools populated on every reference project','Real root causes — not placeholder text','Industry-specific steps, terminology, and metrics','Seeded for your industry only at onboarding'] },
  { tag:'MAJOR',       color:'#2E844A', title:'Industry language engine',       date:'March 2026',
    body:'Your workspace speaks the language of the field you work in. A nurse never sees "WIP". A brewer never sees "takt time" without context. 62 industries, 40+ adapted terms each.',
    items:['Applies across dashboard, tools, AI, and learning center','Zero cross-industry terminology bleed','Fully reflected in every Supe AI response','Language preview before you confirm at signup'] },
  { tag:'MAJOR',       color:'#8C44CC', title:'Industry-aware onboarding',      date:'March 2026',
    body:'A 4-step wizard guides every new user. Industry selection is first — it determines everything: reference project seeded, language applied, learning content loaded. No generic start screen.',
    items:['Industry → Role → First Project → Launch','Industry-specific roles at Step 2','Reference project seeded for your industry only','Language preview before confirmation'] },
  { tag:'IMPROVEMENT', color:'#C0402A', title:'40+ unique industry watermarks', date:'March 2026',
    body:'Every industry group has a unique SVG watermark in the workspace. Gears for manufacturing. Stethoscope for hospital. Derrick for oil & gas. Subtle, unmistakable, and yours.',
    items:['40+ unique illustrations — one per industry group','Opacity 0.038 — visible but never distracting','Auto-switches when industry changes'] },
  { tag:'IMPROVEMENT', color:'#2E844A', title:'Complete account isolation',     date:'March 2026',
    body:'A brewery never receives a law firm reference project. Every API call filters by industry. Cross-industry language is blocked throughout your account until explicitly overridden.',
    items:['Profile-level industry setting drives all content','Zero cross-industry contamination at any level','Separate projects can span multiple industries if needed'] },
]

// ── Scrolling industry strip ──────────────────────────────────────────────────
function IndustryStrip() {
  const items = [...ALL_INDUSTRIES, ...ALL_INDUSTRIES]
  return (
    <div style={{ background:'rgba(1,118,211,0.05)', borderTop:'1px solid rgba(1,118,211,0.12)', borderBottom:'1px solid rgba(1,118,211,0.12)', padding:'10px 0', overflow:'hidden' }}>
      <div style={{ display:'flex', whiteSpace:'nowrap', animation:'stripScroll 55s linear infinite' }}>
        {items.map((ind, i) => (
          <span key={i} style={{ padding:'0 22px', fontFamily:mono, fontSize:10, letterSpacing:1, color:'#6B6760', display:'inline-flex', alignItems:'center', gap:18 }}>
            {ind}<span style={{ opacity:.3, fontSize:13 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Industry terminology switcher ─────────────────────────────────────────────
function IndustryTerms() {
  const [active, setActive] = useState(TERM_KEYS[0])
  const timerRef = useRef<any>(null)
  const idxRef   = useRef(0)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % TERM_KEYS.length
      setActive(TERM_KEYS[idxRef.current])
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [])

  function pick(key: string) {
    clearInterval(timerRef.current)
    idxRef.current = TERM_KEYS.indexOf(key)
    setActive(key)
  }

  const terms = TERMS[active]
  const rows = [
    ['Product',    terms?.product    ?? '—'],
    ['Cycle Time', terms?.ct         ?? '—'],
    ['Defect',     terms?.defect     ?? '—'],
    ['Gemba',      terms?.gemba      ?? '—'],
    ['Kaizen',     terms?.kaizen     ?? '—'],
    ['Bottleneck', terms?.bottleneck ?? '—'],
  ]

  return (
    <section style={{ background:'#032D60', padding:'clamp(64px,8vh,100px) clamp(16px,4vw,48px)', overflow:'hidden' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'start' }} className="terms-grid">
          <div>
            <p style={{ fontFamily:mono, fontSize:9, letterSpacing:3, color:'rgba(255,255,255,.3)', marginBottom:20, textTransform:'uppercase' }}>04 — Industry language</p>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(28px,3.5vw,48px)', lineHeight:1.1, color:'#ffffff', fontWeight:400, marginBottom:24 }}>
              A nurse never sees "WIP".<br />A brewer never sees "takt"<br />without context.
            </h2>
            <p style={{ fontSize:15, lineHeight:1.85, color:'rgba(255,255,255,.5)', fontWeight:300, maxWidth:380, marginBottom:32 }}>
              Select your industry at signup. Every term — cycle time to kaizen — is translated into the language your team already uses. 66 industries. Built for each field, not adapted from manufacturing.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {TERM_KEYS.map(key => (
                <button key={key} onClick={() => pick(key)} style={{
                  padding:'6px 14px', borderRadius:100, border:`1px solid ${key===active?'rgba(1,118,211,.5)':'rgba(255,255,255,.1)'}`,
                  fontSize:11, color:key===active?'#6CB9FC':'rgba(255,255,255,.45)',
                  background:key===active?'rgba(1,118,211,.15)':'transparent',
                  cursor:'pointer', transition:'all .15s', fontFamily:'inherit',
                }}>
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:'28px 26px' }}>
            <p style={{ fontFamily:mono, fontSize:8, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:20 }}>TERMINOLOGY PREVIEW — {active}</p>
            {rows.map(([lean, val], i) => (
              <div key={lean} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,.06)' : 'none', gap:8 }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,.3)', flexShrink:0 }}>{lean}</span>
                <span style={{ fontFamily:mono, fontSize:10, color:'rgba(1,118,211,.5)' }}>→</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#6CB9FC', textAlign:'right' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Supe AI chat ──────────────────────────────────────────────────────────────
function SupeSection() {
  return (
    <section style={{ padding:'clamp(64px,8vh,100px) clamp(16px,4vw,48px)', background:'#F8F6F0' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'center' }} className="supe-grid">
        <div className="reveal">
          <p style={{ fontFamily:mono, fontSize:9, letterSpacing:3, color:'rgba(1,118,211,.7)', marginBottom:20, textTransform:'uppercase' }}>05 — Supe AI</p>
          <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,44px)', lineHeight:1.12, fontWeight:400, marginBottom:18 }}>
            Every target is achievable.<br />Supe AI shows you how.
          </h2>
          <p style={{ fontSize:15, lineHeight:1.85, color:'#3A3835', marginBottom:28, fontWeight:300 }}>
            Supe reads your entire value stream — every step, cycle time, waste type, root cause, and improvement goal — and tells you exactly what stands between you and your target. In your industry's language. With your actual data.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              'References your actual step names and measurements — not templates',
              'Built on ISO 22468, ILO standards, and lean methodology',
              'Speaks the language of your industry in every response',
              'Generates ISO-compliant reports directly from your process data',
              'Powers the V2 one-click analysis report — SOP to findings in seconds',
            ].map(feat => (
              <div key={feat} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#0176D3', flexShrink:0, marginTop:6 }} />
                <span style={{ fontSize:14, color:'#3A3835', lineHeight:1.6 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal d2" style={{ background:'#032D60', borderRadius:16, padding:24, overflow:'hidden', boxShadow:'0 32px 80px rgba(3,45,96,.15)' }}>
          <p style={{ fontFamily:mono, fontSize:8, letterSpacing:2, color:'rgba(255,255,255,.25)', marginBottom:16 }}>SUPE AI · PRO FEATURE</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ padding:'12px 16px', borderRadius:'10px 10px 3px 10px', background:'rgba(255,255,255,.07)', color:'rgba(255,255,255,.65)', fontSize:13, lineHeight:1.7, alignSelf:'flex-end', maxWidth:'88%' }}>
              My target is door-to-discharge under 2 hours. We're at 3.2. What's actually stopping us?
            </div>
            <div style={{ padding:'12px 16px', borderRadius:'10px 10px 10px 3px', background:'rgba(1,118,211,.14)', border:'1px solid rgba(1,118,211,.22)', color:'rgba(255,255,255,.8)', fontSize:13, lineHeight:1.7, maxWidth:'92%' }}>
              Your primary constraint is <strong style={{ color:'#6CB9FC' }}>Treatment & Intervention</strong> — cycle time 52 min against a 45-min takt. Every patient is late before they reach discharge.<br /><br />
              But the root cause isn't the step. Your 5 Why traces this to a single systemic failure: <strong style={{ color:'#6CB9FC' }}>no CI structure in the department.</strong> Staff identify the bottleneck every shift. There is no mechanism to escalate through data.<br /><br />
              90 days of hourly arrival data is what you need in front of administration. That's the evidence that unlocks a demand-matched schedule — and closes most of your 1-hour gap.
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:14 }}>
            <div style={{ display:'flex', gap:3 }}>
              <div className="think-dot" />
              <div className="think-dot" />
              <div className="think-dot" />
            </div>
            <span style={{ fontFamily:mono, fontSize:10, color:'rgba(255,255,255,.25)' }}>Analysing your value stream…</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Reference projects scroller ───────────────────────────────────────────────
function ReferenceSection() {
  return (
    <section style={{ background:'#F0EDE6', padding:'clamp(64px,8vh,100px) clamp(16px,4vw,48px)', borderTop:'0.5px solid #D8D5CE' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div className="reveal" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, gap:24, flexWrap:'wrap' }}>
          <div>
            <p style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(1,118,211,.8)', marginBottom:12, textTransform:'uppercase' }}>06 — Reference projects</p>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(24px,3vw,40px)', lineHeight:1.12, fontWeight:400, maxWidth:500 }}>
              62 reference projects. Real bottlenecks.<br />Your industry's language. Day one.
            </h2>
          </div>
          <p style={{ fontSize:13, color:'#6B6760', maxWidth:220, lineHeight:1.6, textAlign:'right' }}>
            Load a fully-built example the moment you sign up. Every CI tool populated. Real root causes — not placeholder text.
          </p>
        </div>
        <div className="reveal d1" style={{ display:'flex', gap:16, overflowX:'auto', paddingBottom:6, scrollbarWidth:'none' }}>
          {REFS.map(r => (
            <div key={r.name}
              style={{ flex:'0 0 268px', background:'white', border:'1px solid rgba(1,118,211,.12)', borderRadius:13, padding:20, transition:'all .2s', cursor:'default' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform='translateY(-3px)'; el.style.boxShadow='0 12px 40px rgba(1,118,211,.1)'; el.style.borderColor='#0176D3' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform=''; el.style.boxShadow=''; el.style.borderColor='rgba(1,118,211,.12)' }}>
              <p style={{ fontFamily:mono, fontSize:8, letterSpacing:2, color:'#0176D3', marginBottom:8 }}>{r.ind}</p>
              <p style={{ fontSize:14, fontWeight:700, color:'#0D0C0A', marginBottom:7, lineHeight:1.3 }}>{r.name}</p>
              <p style={{ fontSize:12, color:'#6B6760', lineHeight:1.65, marginBottom:12 }}>{r.detail}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {r.tools.map(t => (
                  <span key={t} style={{ fontFamily:mono, fontSize:7, padding:'2px 5px', borderRadius:3, background:'rgba(1,118,211,.07)', color:'#0176D3', letterSpacing:.5 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [eyeIdx, setEyeIdx] = useState(0)
  const eyeLines = [
    'Manufacturing · Logistics · Healthcare · Real Estate · Legal',
    'For lean engineers · CI coordinators · operations managers',
    'Any process. Any industry. Any team size.',
  ]
  useEffect(() => {
    const t = setInterval(() => setEyeIdx(i => (i + 1) % eyeLines.length), 3400)
    return () => clearInterval(t)
  }, [])

  // Scroll reveal — mirrors the HTML reference IntersectionObserver
  useEffect(() => {
    const ro = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el))
    return () => ro.disconnect()
  }, [])

  return (
    <div style={{ background:'#F8F6F0', color:'#0D0C0A', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', overflowX:'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes breathe        { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes eyeSlide       { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes stripScroll    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes logoFloat      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes supeThink      { 0%,100%{opacity:.25} 50%{opacity:1} }
        @keyframes think          { 0%,100%{opacity:.25} 50%{opacity:1} }
        .think-dot { width:4px;height:4px;border-radius:50%;background:#0176D3;opacity:.5;animation:think .8s ease infinite; }
        .think-dot:nth-child(2) { animation-delay:.2s; }
        .think-dot:nth-child(3) { animation-delay:.4s; }

        /* ── Scroll reveal ── */
        .reveal { opacity:0; transform:translateY(28px); transition:opacity .75s ease, transform .75s ease; }
        .reveal.in { opacity:1; transform:translateY(0); }
        .d1 { transition-delay:.1s; } .d2 { transition-delay:.2s; }
        .d3 { transition-delay:.3s; } .d4 { transition-delay:.4s; }

        .nav-link { color:rgba(248,247,245,.55); text-decoration:none; font-size:13px; transition:color .15s; }
        .nav-link:hover { color:#F8F7F5; }
        .how-step { background:#F0EDE6; padding:32px 26px; border-right:1px solid rgba(1,118,211,.1); transition:background .2s; }
        .how-step:last-child { border-right:none; }
        .how-step:hover { background:#FFFFFF; }
        .step-icon { width:42px;height:42px;border:1.5px solid rgba(1,118,211,.16);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:18px;background:white;transition:border-color .2s; }
        .how-step:hover .step-icon { border-color:#0176D3; }
        .mission-pillar { padding:24px 26px;border:1px solid rgba(255,255,255,.08);border-radius:12px;transition:all .25s;position:relative;overflow:hidden; }
        .mission-pillar::before { content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#0176D3; }
        .mission-pillar:hover { background:rgba(255,255,255,.04);border-color:rgba(1,118,211,.3); }
        .ba-row { display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;padding:16px 0;border-bottom:1px solid rgba(1,118,211,.1); }
        .price-card { background:white;border:1px solid rgba(1,118,211,.12);border-radius:14px;padding:28px 24px;position:relative; }
        .price-card.featured { border-color:#0176D3;box-shadow:0 0 0 3px rgba(1,118,211,.08); }
        .hide-mobile { display:flex; }
        @media(max-width:900px){
          .hero-grid  { grid-template-columns:1fr!important; }
          .hero-right { display:none!important; }
          .mission-grid,.problem-grid,.terms-grid,.supe-grid { grid-template-columns:1fr!important; gap:40px!important; }
          .how-steps  { grid-template-columns:1fr 1fr!important; }
          .pricing-grid { grid-template-columns:1fr!important; max-width:380px!important; margin:0 auto!important; }
          nav { padding:0 20px!important; }
          .hide-mobile { display:none!important; }
        }
        @media(max-width:600px){
          .how-steps { grid-template-columns:1fr!important; }
          .ba-row { grid-template-columns:1fr!important; }
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{ position:'sticky', top:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:60, background:'rgba(26,23,20,0.97)', backdropFilter:'blur(14px)', borderBottom:'1px solid rgba(255,255,255,0.09)' }}>
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
          <Link href="/auth/login" style={{ padding:'7px 16px', background:'transparent', border:'1px solid rgba(255,255,255,.14)', borderRadius:8, fontSize:13, color:'rgba(248,247,245,.6)', textDecoration:'none' }}>
            Sign in
          </Link>
          <Link href="/auth/signup" style={{ padding:'7px 18px', background:'#0176D3', border:'none', borderRadius:8, fontSize:13, fontWeight:700, color:'white', textDecoration:'none' }}>
            Start mapping →
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ minHeight:'100vh', padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px) clamp(60px,8vh,80px)', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden', background:'#1A1714' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(1,118,211,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(1,118,211,.1) 1px,transparent 1px)', backgroundSize:'48px 48px', opacity:.4, pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 72% 50%,rgba(1,118,211,.08) 0%,transparent 65%)', pointerEvents:'none' }} />

        <div className="hero-grid" style={{ maxWidth:1160, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center', position:'relative', zIndex:1 }}>

          {/* Left */}
          <div className="reveal">
            <div style={{ marginBottom:24, height:18, overflow:'hidden' }}>
              <span key={eyeIdx} style={{ fontFamily:mono, fontSize:9, color:'rgba(1,118,211,.7)', letterSpacing:2, textTransform:'uppercase', fontWeight:700, animation:'eyeSlide .4s ease both', display:'block' }}>
                {eyeLines[eyeIdx]}
              </span>
            </div>
            <h1 style={{ fontFamily:serif, fontSize:'clamp(42px,5.5vw,72px)', lineHeight:1.05, color:'#F8F7F5', marginBottom:16, fontWeight:400, letterSpacing:-.5 }}>
              You have a process.<br />
              You have a target.<br />
              <span style={{ fontStyle:'italic', color:'#0176D3' }}>You have VeSiMy.</span>
            </h1>
            <p style={{ fontFamily:mono, fontSize:11, letterSpacing:2, color:'#6B6760', marginBottom:28, paddingBottom:28, borderBottom:'1px solid rgba(1,118,211,.15)' }}>
              LEAN · TPS · SIX SIGMA · FOR EVERY INDUSTRY
            </p>
            <p style={{ fontSize:16, lineHeight:1.82, color:'rgba(248,247,245,.55)', marginBottom:36, fontWeight:300, maxWidth:460 }}>
              The methodology behind Toyota. The rigour of Six Sigma. The clarity of lean.{' '}
              <strong style={{ color:'rgba(248,247,245,.82)', fontWeight:500 }}>Now available to every team, every sector, every size — with AI that proves your targets are achievable</strong>{' '}
              and tracks every step of the improvement that gets you there.
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap', marginBottom:44 }}>
              <Link href="/auth/signup" style={{ background:'linear-gradient(135deg,#0a5eaa,#0176D3)', color:'white', padding:'14px 28px', borderRadius:9, fontSize:15, fontWeight:600, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 4px 20px rgba(1,118,211,.3)' }}>
                Start mapping <ArrowRightIcon size={14} color="white" />
              </Link>
              <a href="#how" style={{ color:'rgba(248,247,245,.55)', fontSize:14, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:5, fontWeight:500 }}
                onMouseEnter={e => (e.currentTarget.style.color='#F8F7F5')} onMouseLeave={e => (e.currentTarget.style.color='rgba(248,247,245,.55)')}>
                See how it works ↓
              </a>
            </div>
            {/* Stats */}
            <div className="reveal d2" style={{ display:'flex', gap:28, paddingTop:24, borderTop:'1px solid rgba(1,118,211,.15)', flexWrap:'wrap' }}>
              {[['66','Industries'],['11+','CI Tools'],['62','Reference Projects'],['$0','Forever tier']].map(([v,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:mono, fontSize:22, fontWeight:600, color:'#0176D3', letterSpacing:-.5 }}>{v}</div>
                  <div style={{ fontFamily:mono, fontSize:10, color:'#6B6760', letterSpacing:.5 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Process improvement results panel */}
          <div className="hero-right reveal d2">
            <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(1,118,211,.12)', boxShadow:'0 32px 100px rgba(3,45,96,.18),0 4px 16px rgba(3,45,96,.06)', overflow:'hidden' }}>
              {/* Header */}
              <div style={{ background:'#242220', padding:'9px 14px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #353330' }}>
                <div style={{ display:'flex', gap:5 }}>
                  {['#C0402A','#0176D3','#1DD1A1'].map((col,i) => <div key={i} style={{ width:9,height:9,borderRadius:'50%',background:col,opacity:.7 }} />)}
                </div>
                <span style={{ fontFamily:mono, fontSize:9, color:'#8E8A82', flex:1, textAlign:'center', letterSpacing:.5 }}>Process Intelligence Report · Seat Assembly Line</span>
                <span style={{ fontFamily:mono, fontSize:7, fontWeight:700, padding:'2px 7px', borderRadius:4, background:'rgba(46,132,74,.2)', color:'#1DD1A1', letterSpacing:.5 }}>AFTER</span>
              </div>
              {/* KPI strip */}
              <div style={{ display:'flex', borderBottom:'1px solid #E8E5E0', background:'white' }}>
                {[['LEAD TIME','4m 22s','#2E844A'],['PCE','68%','#2E844A'],['DEFECTS','0.4%','#2E844A'],['TARGET','✓ MET','#2E844A']].map(([l,v,col],i,arr) => (
                  <div key={l} style={{ flex:1, padding:'8px 6px', borderRight: i<arr.length-1?'1px solid #E8E5E0':'none', textAlign:'center' }}>
                    <div style={{ fontFamily:mono, fontSize:6.5, color:'#8E8A82', letterSpacing:.8, marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:col, lineHeight:1 }}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Before/after bar charts */}
              <div style={{ padding:'20px 20px 12px' }}>
                <div style={{ fontFamily:mono, fontSize:8, letterSpacing:2, color:'#8E8A82', marginBottom:16 }}>BEFORE → AFTER</div>
                {[
                  { label:'Lead Time', before:'14m 40s', after:'4m 22s', beforePct:100, afterPct:30, color:'#2E844A' },
                  { label:'Defect Rate', before:'8.2%', after:'0.4%', beforePct:100, afterPct:5, color:'#F4A623' },
                  { label:'Process Cycle Efficiency', before:'34%', after:'68%', beforePct:34, afterPct:68, color:'#0176D3' },
                ].map(row => (
                  <div key={row.label} style={{ marginBottom:18 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:600, color:'#1E1B17' }}>{row.label}</span>
                      <span style={{ fontSize:11, fontFamily:mono, color:'#2E844A', fontWeight:700 }}>{row.before} → {row.after}</span>
                    </div>
                    <div style={{ marginBottom:4 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:8, fontFamily:mono, color:'#8E8A82', width:32, textAlign:'right' }}>BEFORE</span>
                        <div style={{ flex:1, height:20, borderRadius:3, background:'rgba(0,0,0,.05)', overflow:'hidden' }}>
                          <div style={{ width:`${row.beforePct}%`, height:'100%', background:'#C0402A', opacity:.65, borderRadius:3, display:'flex', alignItems:'center', paddingLeft:6 }}>
                            <span style={{ fontSize:9, fontFamily:mono, color:'white', fontWeight:700 }}>{row.before}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:8, fontFamily:mono, color:'#8E8A82', width:32, textAlign:'right' }}>AFTER</span>
                        <div style={{ flex:1, height:20, borderRadius:3, background:'rgba(0,0,0,.05)', overflow:'hidden' }}>
                          <div style={{ width:`${row.afterPct}%`, height:'100%', background:row.color, borderRadius:3, display:'flex', alignItems:'center', paddingLeft:6 }}>
                            <span style={{ fontSize:9, fontFamily:mono, color:'white', fontWeight:700 }}>{row.after}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Supe hint bar */}
              <div style={{ padding:'10px 12px', background:'#EEF4FB', borderTop:'1px solid #D8E8F8', display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#0176D3', animation:'breathe 1.5s ease infinite', flexShrink:0 }} />
                <span style={{ fontSize:11, color:'#1A4F8A', fontWeight:500 }}>Supe AI — <strong>Root cause confirmed. Action plan complete. Target achieved.</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / BEFORE-AFTER ───────────────────────────────────────────── */}
      <section style={{ padding:'clamp(64px,8vh,100px) clamp(16px,4vw,48px)', background:'#F8F6F0' }}>
        <div className="problem-grid" style={{ maxWidth:1160, margin:'0 auto', display:'grid', gridTemplateColumns:'5fr 6fr', gap:'clamp(40px,6vw,80px)', alignItems:'start' }}>
          <div className="reveal">
            <span style={{ fontFamily:mono, fontSize:10, letterSpacing:2, color:'#6B6760', opacity:.5, display:'block', marginBottom:14 }}>01</span>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,44px)', lineHeight:1.12, fontWeight:400, marginBottom:20 }}>
              Every team knows where the waste is.<br />
              <em style={{ fontStyle:'italic', color:'#0176D3' }}>Nobody can prove it.</em>
            </h2>
            <p style={{ fontSize:15, lineHeight:1.85, color:'#3A3835', fontWeight:300, maxWidth:380, marginTop:18 }}>
              The bottleneck is obvious to everyone on the floor — or in the ward, the kitchen, the studio, or the field. The root cause never makes it into a report. The improvement never gets measured. The problem comes back.<br /><br />
              VeSiMy closes the gap between "we know this is broken" and "we can prove we fixed it."
            </p>
          </div>
          <div className="reveal d2" style={{ borderTop:'1px solid rgba(1,118,211,.1)' }}>
            {[
              ['Post-it notes on a whiteboard',        'Live value stream with real cycle times'],
              ['Gut feel root cause',                  '5 Why drilled to the system failure'],
              ['Improvement in someone\'s head',       'Kaizen events with owners and due dates'],
              ['"I think it\'s getting better"',       'Before/after baseline with ISO proof'],
              ['Manufacturing jargon in a hospital',   'Care pathway. Patient. Discharge.'],
              ['Consultant invoice, no platform left', 'Your team owns the tool, the data, the proof'],
            ].map(([before, after]) => (
              <div key={before} className="ba-row">
                <div>
                  <div style={{ fontFamily:mono, fontSize:7, letterSpacing:2, color:'#6B6760', opacity:.6, marginBottom:4 }}>BEFORE</div>
                  <div style={{ fontSize:12.5, color:'#6B6760', textDecoration:'line-through', textDecorationColor:'rgba(192,64,42,.45)', textDecorationThickness:'1.5px', lineHeight:1.4 }}>{before}</div>
                </div>
                <div style={{ fontFamily:mono, fontSize:11, color:'#0176D3', opacity:.6, flexShrink:0 }}>→</div>
                <div>
                  <div style={{ fontFamily:mono, fontSize:7, letterSpacing:2, color:'#6B6760', opacity:.6, marginBottom:4 }}>AFTER</div>
                  <div style={{ fontSize:12.5, color:'#0D0C0A', fontWeight:500, lineHeight:1.4 }}>{after}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how" style={{ background:'#F0EDE6', padding:'clamp(64px,8vh,100px) clamp(16px,4vw,48px)', borderTop:'0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="reveal" style={{ marginBottom:56 }}>
            <p style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'#0176D3', marginBottom:16 }}>02 — How it works</p>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,44px)', lineHeight:1.12, fontWeight:400 }}>
              From visible problem to permanent fix.<br />In four steps.
            </h2>
          </div>
          <div className="how-steps reveal d1" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:'rgba(1,118,211,.08)', gap:1, borderRadius:12, overflow:'hidden' }}>
            {[
              { n:'01', title:'Map the value stream', path:'M3 12h18M3 6h18M3 18h10', d:'', body:'Add every step. Enter cycle times, WIP, operators, defect rates. The VSM builds in real time. Bottlenecks turn red the moment cycle time crosses takt — no formula required.' },
              { n:'02', title:'Time every operation',  path:'M12 3a9 9 0 100 18A9 9 0 0012 3zM12 7v5l3 3', d:'d1', body:'The built-in stopwatch records 10+ observations, removes outliers, and calculates a statistically sound mean. Set a baseline. Set a target. Supe AI shows you the gap.' },
              { n:'03', title:'Find the root cause',   path:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', d:'d2', body:'Fishbone maps every cause category. 5 Why drills through symptoms to the system failure. Every analysis links to the step it came from.' },
              { n:'04', title:'Prove what changed',    path:'M9 12l2 2 4-4M12 3a9 9 0 100 18A9 9 0 0012 3z', d:'d3', body:'Log kaizen events. Record actual results. PDCA documents before and after. Export an ISO-compliant report — audit-ready, management-ready, in one click.' },
            ].map(step => (
              <div key={step.n} className={`how-step reveal ${step.d}`}>
                <span style={{ fontFamily:mono, fontSize:10, color:'#0176D3', opacity:.5, letterSpacing:1, marginBottom:28, display:'block' }}>{step.n} ─────</span>
                <div className="step-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0176D3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={step.path} />
                  </svg>
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:'#0D0C0A', marginBottom:10, lineHeight:1.3 }}>{step.title}</div>
                <div style={{ fontSize:13, lineHeight:1.75, color:'#6B6760' }}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRY TERMINOLOGY ─────────────────────────────────────────────── */}
      <section id="industries"><IndustryTerms /></section>

      {/* ── SUPE AI ─────────────────────────────────────────────────────────── */}
      <SupeSection />

      {/* ── REFERENCE PROJECTS ──────────────────────────────────────────────── */}
      <ReferenceSection />

      {/* ── WHAT'S NEW ──────────────────────────────────────────────────────── */}
      <section style={{ background:'#FFFFFF', padding:'clamp(64px,8vh,100px) clamp(16px,4vw,48px)', borderTop:'0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div className="reveal" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24, marginBottom:48, flexWrap:'wrap' }}>
            <div>
              <div style={{ display:'inline-block', fontFamily:mono, fontSize:9, color:'rgba(1,118,211,.8)', letterSpacing:2.5, textTransform:'uppercase', marginBottom:14, fontWeight:700, padding:'4px 12px', background:'rgba(1,118,211,.07)', border:'1px solid rgba(1,118,211,.15)', borderRadius:4 }}>What's new — Version 3.1</div>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(22px,3vw,38px)', fontWeight:400, color:'#1E1B17', lineHeight:1.15, marginBottom:14 }}>
                Built for your industry.<br />Not adapted for it.
              </h2>
              <p style={{ fontSize:14, color:'#6B6760', maxWidth:480, lineHeight:1.8 }}>
                VeSiMy v3 is the most significant update since launch. The new V2 Process Builder, 62-industry reference projects, and a full industry language engine mean every part of the product now speaks the language of your field.
              </p>
            </div>
            <Link href="/changelog" style={{ fontSize:12, color:'#0176D3', fontWeight:600, textDecoration:'none', flexShrink:0, marginTop:8 }}>Full changelog →</Link>
          </div>
          <div className="reveal d1" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap:20 }}>
            {CHANGELOG.map(item => (
              <div key={item.title} style={{ background:'#F8F6F0', border:'1px solid #E8E5E0', borderRadius:14, padding:'22px 22px 20px', display:'flex', flexDirection:'column' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontFamily:mono, fontSize:8, fontWeight:700, letterSpacing:2, color:item.color, background:`${item.color}16`, border:`1px solid ${item.color}30`, borderRadius:4, padding:'3px 8px' }}>{item.tag}</span>
                  <span style={{ fontFamily:mono, fontSize:9, color:'#8E8A82' }}>{item.date}</span>
                </div>
                <h3 style={{ fontSize:15, fontWeight:700, color:'#1E1B17', marginBottom:10, lineHeight:1.3 }}>{item.title}</h3>
                <p style={{ fontSize:12.5, color:'#6B6760', lineHeight:1.75, marginBottom:14 }}>{item.body}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:'auto' }}>
                  {item.items.map(pt => (
                    <div key={pt} style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
                      <div style={{ width:5, height:5, borderRadius:'50%', background:item.color, flexShrink:0, marginTop:5, opacity:.7 }} />
                      <span style={{ fontSize:11.5, color:'#514F4D', lineHeight:1.5 }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ───────────────────────────────────────────────────────────── */}
      <div style={{ padding:'clamp(64px,7vw,90px) clamp(16px,4vw,48px)', textAlign:'center', background:'#F8F6F0', borderTop:'3px solid #0176D3', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)', fontFamily:serif, fontSize:220, color:'rgba(1,118,211,.05)', lineHeight:1, pointerEvents:'none', userSelect:'none' as any }}>"</div>
        <div className="reveal" style={{ maxWidth:680, margin:'0 auto', position:'relative', zIndex:1 }}>
          <p style={{ fontFamily:serif, fontSize:'clamp(18px,2.5vw,26px)', lineHeight:1.5, color:'#0D0C0A', fontStyle:'italic', marginBottom:24, fontWeight:400 }}>
            "The ability to add individual steps per operator with times is exactly what we needed. The designator for value-add and non-value-add per step, and the Yamazumi — that's the workflow."
          </p>
          <p style={{ fontFamily:mono, fontSize:10, letterSpacing:1.5, color:'#6B6760' }}>CI PRACTITIONER · LEAN MANUFACTURING · EARLY USER</p>
        </div>
      </div>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding:'clamp(64px,8vh,100px) clamp(16px,4vw,48px)', background:'#F0EDE6', borderTop:'0.5px solid #D8D5CE' }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:52 }}>
            <span style={{ fontFamily:mono, fontSize:9, letterSpacing:2.5, color:'rgba(1,118,211,.8)', display:'block', marginBottom:16, textTransform:'uppercase' }}>Pricing</span>
            <h2 style={{ fontFamily:serif, fontSize:'clamp(26px,3vw,42px)', fontWeight:400, color:'#0D0C0A', marginBottom:12 }}>
              Every CI tool, no paywall.<br />Upgrade for AI and advanced exports.
            </h2>
            <p style={{ fontSize:15, color:'#3A3835' }}>No feature gates on the core methodology. VSM, Fishbone, 5 Why, Kaizen, PDCA — available from day one.</p>
          </div>
          <div className="pricing-grid reveal d1" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
            {(Object.entries(PLANS) as any[]).map(([key, plan]) => {
              const isPro = key === 'pro'; const isLife = key === 'lifetime'; const isEnt = key === 'enterprise'
              return (
                <div key={key} className={`price-card${isPro||isLife?' featured':''}`}>
                  {(isPro||isLife) && <div style={{ position:'absolute', top:-11, left:'50%', transform:'translateX(-50%)', background:'#0176D3', color:'white', fontFamily:mono, fontSize:8, letterSpacing:2, padding:'3px 14px', borderRadius:100, whiteSpace:'nowrap' }}>{isLife?'BEST VALUE':'MOST POPULAR'}</div>}
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
                    style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'11px 20px', borderRadius:8, fontWeight:700, fontSize:14, textDecoration:'none',
                      background:isPro||isLife?'linear-gradient(135deg,#0a5eaa,#0176D3)':'#F0EDE6',
                      color:isPro||isLife?'white':'#3A3835',
                      border:isPro||isLife?'none':'1px solid #D8D5CE' }}>
                    {plan.cta}
                  </Link>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign:'center', marginTop:20 }}>
            <Link href="/pricing" style={{ fontSize:13, color:'#8E8A82', textDecoration:'none', borderBottom:'1px solid #D8D5CE', paddingBottom:2 }}>View full pricing details →</Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section style={{ padding:'clamp(80px,10vh,120px) clamp(16px,4vw,48px)', textAlign:'center', background:'#1A1714', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 50% at 50% 100%,rgba(1,118,211,.09) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 className="reveal" style={{ fontFamily:serif, fontSize:'clamp(36px,5vw,68px)', lineHeight:1.08, marginBottom:16, fontWeight:400, color:'#F8F7F5' }}>
            You have a process.<br />
            You have a target.<br />
            <em style={{ fontStyle:'italic', color:'#0176D3' }}>Now you have VeSiMy.</em>
          </h2>
          <p className="reveal d1" style={{ fontSize:16, color:'rgba(248,247,245,.35)', marginBottom:44, fontWeight:300 }}>No card. No setup. No manufacturing jargon if you're not in manufacturing.</p>
          <div className="reveal d2" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/auth/signup" style={{ padding:'15px 38px', background:'linear-gradient(135deg,#0a5eaa,#0176D3)', color:'white', border:'none', borderRadius:9, fontSize:16, fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 4px 20px rgba(1,118,211,.3)' }}>
              Create your account <ArrowRightIcon size={15} color="white" />
            </Link>
            <Link href="/auth/signup?ref=1" style={{ padding:'15px 24px', background:'transparent', color:'rgba(255,255,255,.5)', border:'1px solid rgba(255,255,255,.14)', borderRadius:9, fontSize:15, textDecoration:'none' }}>
              Explore a fully-built sample project →
            </Link>
          </div>
          <p style={{ fontFamily:mono, fontSize:11, color:'rgba(255,255,255,.18)', marginTop:20 }}>ISO 9001:2015 · ISO 22468:2020 · IATF 16949 aligned</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.08)', padding:'clamp(20px,3vw,28px) clamp(16px,4vw,48px)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, background:'#1A1714' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <VLogoMark size={26} />
          <VeSiMyWordmark size={15} onDark />
        </div>
        <div style={{ display:'flex', gap:20, fontSize:12, color:'rgba(248,247,245,.4)', flexWrap:'wrap' }}>
          {[['About','/about'],['Blog','/blog'],['Changelog','/changelog'],['Pricing','/pricing'],['Learn','/learn'],['Privacy','/privacy'],['Terms','/terms'],['Contact','mailto:founder@vesimy.com']].map(([l,h]) => (
            <Link key={l} href={h} style={{ color:'inherit', textDecoration:'none' }}
              onMouseEnter={e => (e.currentTarget.style.color='#0176D3')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(248,247,245,.4)')}>
              {l}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily:mono, fontSize:11, color:'rgba(248,247,245,.2)', letterSpacing:1.5, textTransform:'uppercase' }}>© 2026 VeSiMy</span>
      </footer>

    </div>
  )
}
