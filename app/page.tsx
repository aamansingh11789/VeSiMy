// @ts-nocheck
// ── app/page.tsx — VeSiMy Landing Page ───────────────────────────────────────
'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { VesimyLogo, VLogoMark } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeProvider'
import { PLANS } from '@/lib/stripe'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'

const serif = 'Palatino Linotype,Book Antiqua,Palatino,Georgia,serif'

// ── Watermark background pattern ──────────────────────────────────────────────
function WatermarkBg() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      background: 'linear-gradient(160deg, #04040F 0%, #080620 50%, #04040F 100%)',
    }}>
      {/* Radial glow center */}
      <div style={{ position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)', width:800, height:600,
        background:'radial-gradient(ellipse, rgba(212,162,8,0.10) 0%, transparent 70%)', pointerEvents:'none' }} />
      {/* Watermark text pattern */}
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:0.07 }}>
        <defs>
          <pattern id="wmpattern" x="0" y="0" width="220" height="80" patternUnits="userSpaceOnUse">
            <text x="10" y="28" fontFamily="Palatino Linotype,serif" fontSize="13" fontWeight="700"
              fill="#D4A208" letterSpacing="4">VESIMY</text>
            <text x="28" y="56" fontFamily="Palatino Linotype,serif" fontSize="22" fontWeight="700"
              fill="#D4A208">V</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wmpattern)" />
      </svg>
      {/* Big ghost V centered */}
      <div style={{ position:'absolute', top:'5%', left:'50%', transform:'translateX(-50%)', opacity:0.05 }}>
        <VLogoMark size={600} />
      </div>
    </div>
  )
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState('0')
  const [fired, setFired] = useState(false)
  useEffect(() => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(num) || fired) return
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setFired(true)
      const suffix = value.replace(/[0-9.]/g, '')
      let start = 0; const steps = 40
      const inc = num / steps
      const tick = () => {
        start += inc
        if (start >= num) { setDisplay(value); return }
        setDisplay(Math.round(start) + suffix)
        requestAnimationFrame(tick)
      }
      tick()
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, fired])
  return (
    <div ref={ref} style={{ textAlign:'center' }}>
      <div style={{ fontFamily:serif, fontSize:'clamp(28px,4vw,48px)', fontWeight:800, color:'#D4A208', lineHeight:1 }}>{display || value}</div>
      <div style={{ fontSize:10, color:'#7070A0', letterSpacing:2.5, marginTop:6, fontFamily:'monospace' }}>{label}</div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div style={{ position:'relative', color:'#EAE8F4', minHeight:'100vh' }}>
      <WatermarkBg />
      <div style={{ position:'relative', zIndex:1 }}>

        {/* ── Navbar ───────────────────────────────────────────────────────── */}
        <nav className="home-nav" style={{ position:'sticky', top:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 40px', height:60, borderBottom:'1px solid rgba(26,26,64,0.5)',
          background:'rgba(3,3,13,0.85)', backdropFilter:'blur(16px)' }}>
          <VesimyLogo size={32} showText />
          <div className="home-nav-links" style={{ display:'flex', gap:28, fontSize:13, color:'#7070A0' }}>
            {[['Why VeSiMy','#why'],['Tools','#tools'],['Compare','#compare'],['Pricing','#pricing']].map(([l,h]) => (
              <a key={l} href={h} style={{ color:'inherit', textDecoration:'none' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#EAE8F4')}
                onMouseLeave={e=>(e.currentTarget.style.color='#7070A0')}>{l}</a>
            ))}
          </div>
          <div className="home-nav-cta" style={{ display:'flex', gap:10, alignItems:'center' }}>
            <ThemeToggle />
            <Link href="/demo" className="demo-link" style={{ padding:'8px 16px', borderRadius:8, fontSize:13, color:'#7070A0', textDecoration:'none', border:'1px solid rgba(40,40,92,0.5)' }}>Live Demo</Link>
            <Link href="/auth/login" style={{ padding:'8px 16px', borderRadius:8, fontSize:13, color:'#7070A0', textDecoration:'none', border:'1px solid rgba(40,40,92,0.5)' }}>Sign In</Link>
            <Link href="/auth/signup" style={{ padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:700, color:'#03030D', textDecoration:'none', background:'linear-gradient(135deg,#C49510,#D4A208)' }}>Get Started</Link>
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section style={{ minHeight:'92vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 24px 60px', textAlign:'center' }}>
          {/* Logo mark */}
          <div style={{ marginBottom:28 }}>
            <VLogoMark size={120} />
          </div>

          {/* Big VeSiMy wordmark under V */}
          <div style={{ marginBottom:8, marginTop:4 }}>
            <span style={{
              fontFamily: 'Palatino Linotype,Book Antiqua,Palatino,serif',
              fontWeight: 800,
              fontSize: 'clamp(38px,6vw,72px)',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #FFD060 0%, #D4A208 55%, #B87A06 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: 4,
            }}>VeSiMy</span>
          </div>

          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(3,3,13,0.85)', border:'1px solid rgba(212,162,8,0.5)', borderRadius:100, padding:'6px 18px', marginBottom:32, backdropFilter:'blur(8px)' }}>
            <span style={{ fontSize:10, color:'#7070A0', letterSpacing:2, fontFamily:'monospace' }}>©</span>
            <span style={{ fontSize:13, color:'#D4A208', fontWeight:700, letterSpacing:4, fontFamily:'monospace' }}>CONTINUOUS IMPROVEMENT PLATFORM</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily:serif, fontSize:'clamp(42px,6.5vw,80px)', fontWeight:700, lineHeight:1.1, marginBottom:24, maxWidth:800 }}>
            Every great team<br />
            <span style={{ color:'#D4A208' }}>keeps getting better.</span>
          </h1>

          <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'#B0B0C8', maxWidth:560, lineHeight:1.75, marginBottom:40 }}>
            VeSiMy gives your team one place to map value streams, run kaizen events, track improvements, and build a culture of continuous excellence.
          </p>

          <div className="hero-cta-row" style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            <Link href="/auth/signup" style={{ padding:'14px 36px', borderRadius:10, fontSize:16, fontWeight:700, textDecoration:'none',
              background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', display:'flex', alignItems:'center', gap:8,
              boxShadow:'0 8px 32px rgba(212,162,8,0.3)' }}>
              Start Free <ArrowRightIcon size={16} color="currentColor" />
            </Link>
            <Link href="/demo" style={{ padding:'14px 28px', borderRadius:10, fontSize:15, fontWeight:600, textDecoration:'none',
              background:'rgba(8,8,24,0.8)', color:'#EAE8F4', border:'1px solid rgba(40,40,92,0.5)', backdropFilter:'blur(8px)',
              display:'flex', alignItems:'center', gap:8 }}>
              ▶ See Live Demo
            </Link>
            <Link href="/beta" style={{ padding:'14px 28px', borderRadius:10, fontSize:15, fontWeight:600, textDecoration:'none',
              background:'rgba(8,8,24,0.8)', color:'#D4A208', border:'1px solid rgba(212,162,8,0.3)', backdropFilter:'blur(8px)',
              display:'flex', alignItems:'center', gap:8 }}>
              👑 Join Launch Week
            </Link>
          </div>
          <p style={{ fontSize:12, color:'#7070A0', marginTop:14 }}>Free forever · No credit card · Works on any device</p>
        </section>

        {/* ── Industries ───────────────────────────────────────────────────── */}
        <section style={{ padding:'16px clamp(16px,5vw,40px)', borderTop:'1px solid rgba(26,26,64,0.4)', borderBottom:'1px solid rgba(26,26,64,0.4)', background:'rgba(4,4,14,0.6)', backdropFilter:'blur(8px)' }}>
          <div style={{ maxWidth:900, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center' }}>
            {['Automotive','Electronics','Aerospace','Food & Beverage','Healthcare','Logistics','Oil & Gas','Industrial Mfg'].map(ind => (
              <span key={ind} style={{ fontSize:12, color:'#7070A0', border:'1px solid rgba(70,70,120,0.6)', borderRadius:100, padding:'5px 14px', letterSpacing:0.5 }}>{ind}</span>
            ))}
          </div>
        </section>

        {/* ── Six Tools ────────────────────────────────────────────────────── */}
        <section id="tools" style={{ padding:'clamp(40px,8vw,96px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth:960, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(28px,4vw,52px)', fontWeight:700, marginBottom:12 }}>
                Six tools. <span style={{ color:'#D4A208' }}>One platform.</span>
              </h2>
              <p style={{ fontSize:16, color:'#7070A0', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
                Everything your team needs to drive continuous improvement, built in.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {[
                { icon:'~→', title:'Value Stream Map',    desc:'Visualize your entire process flow and identify waste at every step.',         color:'#D4A208' },
                { icon:'⊞',  title:'Kanban Board',        desc:'Manage work in progress with visual WIP limits and drag-drop cards.',          color:'#6CB9FC' },
                { icon:'◎',  title:'Kaizen Events',       desc:'Track improvement initiatives from idea to completion with full history.',      color:'#1DD1A1' },
                { icon:'⏱',  title:'Time Study',          desc:'Measure cycle times with precision and calculate takt time automatically.',     color:'#F4A623' },
                { icon:'◆',  title:'5 Why Analysis',      desc:'Drill down to root causes with structured problem-solving methodology.',       color:'#FF6B6B' },
                { icon:'⊳⊲', title:'Fishbone Diagram',    desc:'Map cause-and-effect relationships visually with Ishikawa analysis.',          color:'#8C44CC' },
              ].map(tool => (
                <div key={tool.title} style={{ background:'rgba(8,8,24,0.75)', border:'1px solid rgba(40,40,92,0.5)', borderRadius:14, padding:'28px 24px', backdropFilter:'blur(8px)',
                  transition:'border-color 0.2s' }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor=`rgba(212,162,8,0.3)`)}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(40,40,92,0.5)')}>
                  <div style={{ width:48, height:48, borderRadius:12, background:`rgba(${tool.color==='#D4A208'?'212,162,8':tool.color==='#6CB9FC'?'108,185,252':tool.color==='#1DD1A1'?'29,209,161':tool.color==='#F4A623'?'244,166,35':tool.color==='#FF6B6B'?'255,107,107':'140,68,204'},0.12)`,
                    display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, fontSize:20, color:tool.color }}>
                    {tool.icon}
                  </div>
                  <div style={{ fontWeight:700, fontSize:16, color:'#EAE8F4', marginBottom:8 }}>{tool.title}</div>
                  <div style={{ fontSize:13, color:'#7070A0', lineHeight:1.6 }}>{tool.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VESIMY Acronym ───────────────────────────────────────────────── */}
        <section id="why" style={{ padding:'clamp(40px,8vw,96px) clamp(16px,5vw,40px)', background:'rgba(4,4,14,0.6)', backdropFilter:'blur(8px)', borderTop:'1px solid rgba(26,26,64,0.4)' }}>
          <div style={{ maxWidth:960, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <p style={{ fontSize:11, color:'#D4A208', letterSpacing:3, fontFamily:'monospace', marginBottom:12 }}>THE PHILOSOPHY</p>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(24px,3.5vw,44px)', fontWeight:700, marginBottom:12 }}>
                Every letter means something.
              </h2>
              <p style={{ fontSize:15, color:'#7070A0', maxWidth:480, margin:'0 auto' }}>
                VeSiMy isn't just a name — it's a framework for how great operations think.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {[
                { letter:'V', color:'#D4A208', icon:'◆', bg:'rgba(212,162,8,0.1)',  title:'Value Addition',       sub:'V is for', body:'Every process step must add measurable value to the customer.',  note:"If it doesn't add value, it's waste — and waste is the enemy of excellence." },
                { letter:'E', color:'#1DD1A1', icon:'↻', bg:'rgba(29,209,161,0.1)', title:'Efficiency Improvement',sub:'E is for', body:'Do more with less — time, energy, material, and motion.',        note:"Efficiency isn't about working harder; it's about working smarter, always." },
                { letter:'S', color:'#6CB9FC', icon:'→', bg:'rgba(108,185,252,0.1)',title:'Streamlining Processes', sub:'S is for', body:'Remove bottlenecks, reduce handoffs, and eliminate unnecessary steps.', note:'A streamlined process flows like water — fast, smooth, and unstoppable.' },
                { letter:'I', color:'#8C44CC', icon:'⊞', bg:'rgba(140,68,204,0.1)', title:'Improvement Matrix',    sub:'I is for', body:'Track every improvement initiative across impact, effort, and outcome.', note:'The matrix turns scattered ideas into a prioritized roadmap for action.' },
                { letter:'M', color:'#FF6B6B', icon:'⊡', bg:'rgba(255,107,107,0.1)',title:'Mapping Tools',         sub:'M is for', body:'Visualize your entire value stream — from raw material to customer delivery.', note:"You can't improve what you can't see. Maps make the invisible visible." },
                { letter:'Y', color:'#F4A623', icon:'▲', bg:'rgba(244,166,35,0.1)', title:'Yield Optimization',    sub:'Y is for', body:'Maximize output quality and quantity while minimizing defects and rework.', note:'True yield optimization means the right output, first time, every time.' },
              ].map(item => (
                <div key={item.letter} style={{ background:'rgba(8,8,24,0.75)', border:'1px solid rgba(40,40,92,0.5)', borderRadius:14, padding:'28px 24px', backdropFilter:'blur(8px)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                    <div style={{ width:44, height:44, borderRadius:10, background:item.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize:12, color:'#7070A0' }}>{item.sub}</div>
                      <div style={{ fontSize:28, fontWeight:800, color:item.color, fontFamily:serif, lineHeight:1 }}>{item.letter}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight:700, fontSize:15, color:'#EAE8F4', marginBottom:8 }}>{item.title}</div>
                  <p style={{ fontSize:13, color:'#B0B0C8', lineHeight:1.6, marginBottom:8 }}>{item.body}</p>
                  <p style={{ fontSize:12, color:'#7070A0', lineHeight:1.5, fontStyle:'italic' }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Market Compare ───────────────────────────────────────────────── */}
        <section id="compare" style={{ padding:'clamp(40px,8vw,96px) clamp(16px,5vw,40px)', background:'rgba(4,4,14,0.6)', backdropFilter:'blur(8px)', borderTop:'1px solid rgba(26,26,64,0.4)', borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
          <div style={{ maxWidth:960, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <p style={{ fontSize:11, color:'#D4A208', letterSpacing:3, fontFamily:'monospace', marginBottom:12 }}>HOW WE COMPARE</p>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(24px,3.5vw,42px)', fontWeight:700, marginBottom:12 }}>Built for practitioners. Priced for reality.</h2>
            </div>
            <div style={{ overflowX:'auto', background:'rgba(8,8,24,0.75)', border:'1px solid rgba(40,40,92,0.5)', borderRadius:16, padding:'8px', backdropFilter:'blur(8px)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(212,162,8,0.2)' }}>
                    {['Feature','VeSiMy','eVSM / ValueStream Guru','iGrafx','Lucidchart / Visio','Excel + Consultant'].map((h,i) => (
                      <th key={h} style={{ padding:'12px 16px', textAlign: i===0?'left':'center', fontWeight:700, fontSize:11, letterSpacing:1,
                        color: i===1?'#D4A208':'#38385C', fontFamily:'monospace', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['VSM Mapping',          '✓','✓','✓','✓','Manual'],
                    ['AI Analysis (Supe)',   '✓','✗','✗','✗','✗'],
                    ['SOP → VSM in 60s',    '✓','✗','✗','✗','✗'],
                    ['Kaizen Tracking',      '✓','✗','Addon','✗','✗'],
                    ['5 Why / Fishbone',     '✓','✗','✗','Templates','✗'],
                    ['Live Floor Metrics',   '✓','✗','✗','✗','✗'],
                    ['Process Simulation',   '✓','Addon','✓','✗','✗'],
                    ['Price / user / mo',   '$0–$29','$200–500','$150+','$10+','$150–500/hr'],
                    ['Setup time',           '5 min','Days','Days','Hours','Weeks'],
                    ['Works on mobile',      '✓','✗','✗','Partial','✗'],
                  ].map(row => (
                    <tr key={row[0]} style={{ borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
                      {row.map((cell,i) => (
                        <td key={i} style={{ padding:'12px 16px', textAlign:i===0?'left':'center',
                          color: i===1 ? (cell==='✓'?'#1DD1A1':cell==='✗'?'#FF6B6B':'#D4A208') : cell==='✓'?'#1DD1A1':cell==='✗'?'#38385C':'#7070A0',
                          fontWeight: i===1?700:400 }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <section style={{ padding:'72px 40px', background:'rgba(4,4,14,0.5)', backdropFilter:'blur(6px)', borderTop:'1px solid rgba(26,26,64,0.4)', borderBottom:'1px solid rgba(26,26,64,0.4)' }}>
          <div style={{ maxWidth:800, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:40, textAlign:'center' }}>
            <Stat value="6"    label="CI TOOLS BUILT IN" />
            <Stat value="∞"    label="STEPS PER PROJECT" />
            <Stat value="100%" label="FREE TO START" />
            <Stat value="60s"  label="SOP TO VSM MAP" />
            <Stat value="$0"   label="SETUP REQUIRED" />
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────────── */}
        <section id="pricing" style={{ padding:'clamp(40px,8vw,96px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth:960, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <p style={{ fontSize:11, color:'#D4A208', letterSpacing:3, marginBottom:12, fontFamily:'monospace' }}>PRICING</p>
              <h2 style={{ fontFamily:serif, fontSize:'clamp(24px,3.5vw,40px)', fontWeight:700, marginBottom:12 }}>
                Upgrade when VeSiMy earns it.
              </h2>
              <p style={{ color:'#7070A0', fontSize:15, maxWidth:440, margin:'0 auto', lineHeight:1.7 }}>
                No pressure, no time limits on the free plan. We'd rather earn your upgrade than force it.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
              {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
                const isPro  = key === 'pro'
                const isLife = key === 'lifetime'
                const isEnt  = key === 'enterprise'
                return (
                  <div key={key} style={{ background:isPro||isLife?'rgba(212,162,8,0.04)':'var(--glass)', border:isPro||isLife?'1px solid rgba(212,162,8,0.3)':'1px solid var(--border)', borderRadius:14, padding:'28px 24px', backdropFilter:'blur(12px)', position:'relative' }}>
                    {isPro && <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', fontSize:10, fontWeight:700, padding:'4px 18px', borderRadius:100, letterSpacing:1.5, whiteSpace:'nowrap' }}>MOST POPULAR</div>}
                    {isLife && <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', fontSize:10, fontWeight:700, padding:'4px 18px', borderRadius:100, letterSpacing:1.5, whiteSpace:'nowrap' }}>👑 LAUNCH WEEK</div>}
                    <div style={{ fontSize:11, color:'#D4A208', letterSpacing:2, fontWeight:600, marginBottom:6, fontFamily:'monospace' }}>{plan.name.toUpperCase()}</div>
                    <div style={{ fontSize:36, fontWeight:800, color:'var(--text)', marginBottom:4, lineHeight:1 }}>
                      {isEnt ? 'Custom' : plan.price === 0 ? 'Free' : `$${plan.price}`}
                      {!isEnt && plan.price !== null && (plan.price as number) > 0 && (
                        <span style={{ fontSize:14, fontWeight:400, color:'var(--text2)' }}>{isLife?' once':'/mo'}</span>
                      )}
                    </div>
                    <p style={{ fontSize:13, color:'var(--text2)', marginBottom:20, lineHeight:1.5 }}>{plan.description}</p>
                    <ul style={{ listStyle:'none', marginBottom:22, display:'flex', flexDirection:'column', gap:9 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:9, fontSize:13, color:'var(--text2)' }}>
                          <CheckIcon size={13} color="#D4A208" style={{ marginTop:2, flexShrink:0 }} />{f}
                        </li>
                      ))}
                    </ul>
                    <Link href={isEnt?'/enterprise':isLife?'/beta':plan.price===0?'/auth/signup':`/auth/signup?plan=${key}`}
                      style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'11px 20px', borderRadius:9, textDecoration:'none', fontWeight:600, fontSize:14,
                        background:isPro||isLife?'linear-gradient(135deg,#C49510,#D4A208)':'var(--glass)',
                        color:isPro||isLife?'#03030D':'var(--text)', border:isPro||isLife?'none':'1px solid var(--border)' }}>
                      {plan.cta}
                    </Link>
                    {isLife && <p style={{ textAlign:'center', fontSize:11, color:'#D4A208', marginTop:10 }}>Launch Week open now → <Link href="/beta" style={{ color:'#D4A208' }}>Claim Gold Standard</Link></p>}
                  </div>
                )
              })}
            </div>
            <div style={{ textAlign:'center', marginTop:24 }}>
              <Link href="/pricing" style={{ fontSize:13, color:'#7070A0', textDecoration:'none', borderBottom:'1px solid rgba(40,40,92,0.6)', paddingBottom:2 }}>View full pricing details →</Link>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section style={{ padding:'100px 24px', textAlign:'center', maxWidth:640, margin:'0 auto' }}>
          <p style={{ fontFamily:serif, fontSize:'clamp(22px,3vw,38px)', fontWeight:700, lineHeight:1.4, marginBottom:16 }}>
            The factories that win the next decade<br />
            <span style={{ color:'#D4A208' }}>are mapping their processes today.</span>
          </p>
          <p style={{ fontSize:14, color:'#7070A0', marginBottom:36, lineHeight:1.7 }}>
            Join the teams who stopped talking about improvement<br />and started tracking it — with AI that never clocks out.
          </p>
          <Link href="/auth/signup" style={{ fontSize:16, fontWeight:700, background:'linear-gradient(135deg,#C49510,#D4A208)', color:'#03030D', padding:'15px 36px', borderRadius:12, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, boxShadow:'0 6px 32px rgba(212,162,8,0.25)' }}>
            Start Free Today <ArrowRightIcon size={16} color="currentColor" />
          </Link>
          <p style={{ fontSize:12, color:'#7070A0', marginTop:14 }}>Free forever · No credit card · Works on any device</p>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer style={{ borderTop:'1px solid rgba(26,26,64,0.5)', padding:'32px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, background:'rgba(3,3,13,0.9)', backdropFilter:'blur(16px)' }}>
          <VesimyLogo size={28} showText />
          <div style={{ display:'flex', gap:24, fontSize:12, color:'#7070A0' }}>
            {[['Privacy','/privacy'],['Terms','/terms'],['Pricing','/pricing'],['Contact','mailto:hello@vesimy.com']].map(([label,href]) => (
              <Link key={label} href={href} style={{ color:'inherit', textDecoration:'none' }}
                onMouseEnter={e=>(e.currentTarget.style.color='#D4A208')}
                onMouseLeave={e=>(e.currentTarget.style.color='#38385C')}>{label}</Link>
            ))}
          </div>
          <span style={{ fontSize:11, color:'#7070A0', letterSpacing:2, fontFamily:'monospace' }}>© 2026 VeSiMy</span>
        </footer>

      </div>
    </div>
  )
}
